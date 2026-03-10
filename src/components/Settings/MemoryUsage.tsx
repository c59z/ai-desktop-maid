import React, { useState, useEffect } from 'react'
import { memoryService, Memory } from '../../services/memoryService'

export const MemoryUsage: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([])
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedType, setSelectedType] = useState<'all' | 'short' | 'long' | 'vector'>('all')

  useEffect(() => {
    loadMemories()
  }, [selectedType])

  const loadMemories = () => {
    if (selectedType === 'all') {
      setMemories(memoryService.getMemories(50))
      setConversations(memoryService.getRecentConversations(50))
    } else {
      setMemories(memoryService.getMemoriesByType(selectedType, 50))
      setConversations([])
    }
  }

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`
    return date.toLocaleDateString('zh-CN')
  }

  const handleDeleteMemory = (id?: number) => {
    if (id) {
      memoryService.deleteMemory(id)
      loadMemories()
    }
  }

  const handleClearOldConversations = () => {
    memoryService.clearOldConversations(7)
    loadMemories()
  }

  const getMemoryStats = () => {
    const allMemories = memoryService.getMemories(1000)
    const shortMemories = memoryService.getMemoriesByType('short', 1000)
    const longMemories = memoryService.getMemoriesByType('long', 1000)
    const allConversations = memoryService.getRecentConversations(1000)
    
    return {
      totalMemories: allMemories.length,
      shortMemories: shortMemories.length,
      longMemories: longMemories.length,
      totalConversations: allConversations.length
    }
  }

  const stats = getMemoryStats()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">记忆统计</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-maid-purple/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-maid-purple mb-1">
              {stats.totalMemories}
            </div>
            <div className="text-xs text-gray-600">总记忆数</div>
          </div>
          
          <div className="bg-maid-violet/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-maid-violet mb-1">
              {stats.totalConversations}
            </div>
            <div className="text-xs text-gray-600">对话次数</div>
          </div>
          
          <div className="bg-maid-purple/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-maid-purple mb-1">
              {stats.shortMemories}
            </div>
            <div className="text-xs text-gray-600">短期记忆</div>
          </div>
          
          <div className="bg-maid-violet/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-maid-violet mb-1">
              {stats.longMemories}
            </div>
            <div className="text-xs text-gray-600">长期记忆</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">记忆管理</h3>
        
        <div className="flex gap-2 mb-4">
          <button
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              selectedType === 'all'
                ? 'bg-maid-purple text-white'
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-maid-purple'
            }`}
            onClick={() => setSelectedType('all')}
          >
            全部
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              selectedType === 'short'
                ? 'bg-maid-purple text-white'
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-maid-purple'
            }`}
            onClick={() => setSelectedType('short')}
          >
            短期记忆
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              selectedType === 'long'
                ? 'bg-maid-purple text-white'
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-maid-purple'
            }`}
            onClick={() => setSelectedType('long')}
          >
            长期记忆
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {selectedType === 'all' && (
          <>
            {conversations.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">最近对话</h4>
                <div className="space-y-2">
                  {conversations.slice(0, 10).map((conv) => (
                    <div
                      key={conv.id}
                      className="bg-white border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          conv.role === 'user'
                            ? 'bg-maid-purple text-white'
                            : 'bg-maid-violet text-white'
                        }`}>
                          {conv.role === 'user' ? '用户' : '莉莉'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(conv.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 line-clamp-2">
                        {conv.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {memories.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">记忆列表</h4>
                <div className="space-y-2">
                  {memories.map((memory) => (
                    <div
                      key={memory.id}
                      className="bg-white border border-gray-200 rounded-lg p-3 group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            memory.type === 'short'
                              ? 'bg-maid-purple text-white'
                              : memory.type === 'long'
                              ? 'bg-maid-violet text-white'
                              : 'bg-gray-500 text-white'
                          }`}>
                            {memory.type === 'short' ? '短期' : memory.type === 'long' ? '长期' : '向量'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(memory.timestamp)}
                          </span>
                        </div>
                        <button
                          className="text-gray-400 hover:text-red-500 transition-colors text-xs"
                          onClick={() => handleDeleteMemory(memory.id)}
                        >
                          删除
                        </button>
                      </div>
                      <p className="text-sm text-gray-800 line-clamp-3">
                        {memory.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          重要性: {memory.importance}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {memories.length === 0 && conversations.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                暂无记忆数据
              </div>
            )}
          </>
        )}

        {selectedType !== 'all' && (
          <>
            {memories.length > 0 ? (
              <div className="space-y-2">
                {memories.map((memory) => (
                  <div
                    key={memory.id}
                    className="bg-white border border-gray-200 rounded-lg p-3 group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(memory.timestamp)}
                        </span>
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-500 transition-colors text-xs"
                        onClick={() => handleDeleteMemory(memory.id)}
                      >
                        删除
                      </button>
                    </div>
                    <p className="text-sm text-gray-800 line-clamp-3">
                      {memory.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        重要性: {memory.importance}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                暂无{selectedType === 'short' ? '短期' : '长期'}记忆数据
              </div>
            )}
          </>
        )}
      </div>

      {selectedType === 'all' && conversations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors"
            onClick={handleClearOldConversations}
          >
            清除 7 天前的对话记录
          </button>
        </div>
      )}
    </div>
  )
}
