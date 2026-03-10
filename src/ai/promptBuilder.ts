import { Message } from './ollamaClient'
import { memoryService, Memory } from '../services/memoryService'
import { getCurrentPersonality, getPersonalitySystemPrompt } from '../components/Settings/PersonalitySelector'

export interface UserProfile {
  name?: string
  occupation?: string
  interests?: string[]
  habits?: string[]
  customInfo?: string
}

export class PromptBuilder {
  private userProfile: UserProfile = {}

  setUserProfile(profile: Partial<UserProfile>) {
    this.userProfile = { ...this.userProfile, ...profile }
  }

  getUserProfile(): UserProfile {
    return this.userProfile
  }

  async buildSystemPrompt(): Promise<string> {
    const personalityId = await getCurrentPersonality()
    const basePrompt = getPersonalitySystemPrompt(personalityId)
    
    let systemPrompt = basePrompt

    if (this.userProfile.name) {
      systemPrompt += `\n\n用户信息：`
      if (this.userProfile.name) systemPrompt += `\n- 名字：${this.userProfile.name}`
      if (this.userProfile.occupation) systemPrompt += `\n- 职业：${this.userProfile.occupation}`
      if (this.userProfile.interests && this.userProfile.interests.length > 0) {
        systemPrompt += `\n- 兴趣爱好：${this.userProfile.interests.join('、')}`
      }
      if (this.userProfile.habits && this.userProfile.habits.length > 0) {
        systemPrompt += `\n- 习惯：${this.userProfile.habits.join('、')}`
      }
      if (this.userProfile.customInfo) {
        systemPrompt += `\n- 其他信息：${this.userProfile.customInfo}`
      }
    }

    return systemPrompt
  }

  async buildMessages(userInput: string): Promise<Message[]> {
    const systemPrompt = await this.buildSystemPrompt()
    
    const recentMemories = memoryService.getMemories(10)
    const relevantMemories = memoryService.searchMemories(userInput, 5)

    const messages: Message[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
    ]

    if (recentMemories.length > 0 || relevantMemories.length > 0) {
      const allMemories = [...new Set([...recentMemories, ...relevantMemories])]
      const memoryContext = this.formatMemoriesForContext(allMemories)
      
      messages.push({
        role: 'system',
        content: `以下是之前的对话记忆，请参考这些信息来回答：\n${memoryContext}`,
      })
    }

    messages.push({
      role: 'user',
      content: userInput,
    })

    return messages
  }

  private formatMemoriesForContext(memories: Memory[]): string {
    return memories
      .map((memory) => {
        const time = new Date(memory.timestamp).toLocaleString('zh-CN')
        return `[${time}] ${memory.content}`
      })
      .join('\n\n')
  }

  async saveConversation(userInput: string, aiResponse: string): Promise<void> {
    const memory: Memory = {
      type: 'short',
      content: `用户：${userInput}\n莉莉：${aiResponse}`,
      importance: 1,
      timestamp: Date.now(),
    }
    memoryService.addMemory(memory)
  }
}

export const promptBuilder = new PromptBuilder()
