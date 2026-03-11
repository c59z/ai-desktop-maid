import { useState, useEffect, useRef } from "react";
import { Pet } from "./components/Pet/Pet";
import { ChatMessage } from "./components/ChatBubble/ChatBubble";
import { InputBox } from "./components/InputBox/InputBox";
import { Settings } from "./components/Settings";
import { ollamaClient, ModelInfo } from "./ai/ollamaClient";
import { promptBuilder } from "./ai/promptBuilder";
import { memoryService } from "./services/memoryService";
import { configService } from "./services/configService";
import { useWindow } from "./hooks/useWindow";

const SELECTED_MODEL_KEY = "selectedModel";

function App() {
  const { dragWindow, closeWindow, minimizeWindow } = useWindow();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [petMood, setPetMood] = useState<
    "happy" | "normal" | "sad" | "thinking"
  >("normal");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 模型相关状态
  const [currentModel, setCurrentModel] = useState<string>(
    ollamaClient.getCurrentModel(),
  );
  const [localModels, setLocalModels] = useState<ModelInfo[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // 设置弹窗状态
  const [showSettings, setShowSettings] = useState(false);

  // 聊天区域引用，用于自动滚动
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadRecentConversations();
    loadLocalModels();
  }, []);

  // 消息变化时自动滚动到底部
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const loadRecentConversations = () => {
    const recent = memoryService.getRecentConversations(10);
    const chatMessages: ChatMessage[] = recent.map((conv) => ({
      id: conv.id?.toString() || Date.now().toString(),
      role: conv.role,
      content: conv.content,
      timestamp: conv.timestamp,
    }));
    setMessages(chatMessages);
  };

  const loadLocalModels = async () => {
    setIsLoadingModels(true);
    try {
      const models = await ollamaClient.getLocalModels();
      setLocalModels(models);

      // 自动选择模型逻辑
      if (models.length > 0) {
        // 1. 尝试从配置服务读取上次选择的模型
        const savedModel = await configService.get<string>(SELECTED_MODEL_KEY);

        // 2. 检查保存的模型是否仍在本地可用
        const isSavedModelValid =
          savedModel && models.some((m) => m.name === savedModel);

        // 3. 检查当前默认模型是否可用
        const isCurrentModelValid = models.some((m) => m.name === currentModel);

        if (isSavedModelValid) {
          // 使用保存的模型
          await handleModelChange(savedModel);
        } else if (!isCurrentModelValid) {
          // 如果当前模型不可用，使用第一个可用模型
          const firstModel = models[0].name;
          await handleModelChange(firstModel);
          console.log(`自动切换到可用模型: ${firstModel}`);
        }
      }
    } catch (error) {
      console.error("加载模型列表失败:", error);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleModelChange = async (modelName: string) => {
    ollamaClient.setModel(modelName);
    setCurrentModel(modelName);

    // 保存选择的模型到配置服务
    await configService.set(SELECTED_MODEL_KEY, modelName);
  };

  const handleSendMessage = async (userMessage: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    memoryService.addConversation({
      role: "user",
      content: userMessage,
      timestamp: Date.now(),
    });

    setIsTyping(true);
    setPetMood("thinking");

    try {
      const promptMessages = await promptBuilder.buildMessages(userMessage);
      const aiResponse = await ollamaClient.chat(promptMessages);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      memoryService.addConversation({
        role: "assistant",
        content: aiResponse,
        timestamp: Date.now(),
      });

      setIsSpeaking(true);
      setPetMood("happy");

      setTimeout(() => {
        setIsSpeaking(false);
        setPetMood("normal");
      }, 2000);

      await promptBuilder.saveConversation(userMessage, aiResponse);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setPetMood("sad");
      setTimeout(() => setPetMood("normal"), 2000);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePetClick = () => {
    const greetings = [
      "主人找我有什么事吗？",
      "莉莉在这里~",
      "主人今天心情怎么样？",
      "需要莉莉帮忙吗？",
    ];
    const randomGreeting =
      greetings[Math.floor(Math.random() * greetings.length)];

    // 直接添加 AI 消息，而不是通过 handleSendMessage
    const aiMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "assistant",
      content: randomGreeting,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    memoryService.addConversation({
      role: "assistant",
      content: randomGreeting,
      timestamp: Date.now(),
    });

    // 显示说话动画
    setIsSpeaking(true);
    setPetMood("happy");

    setTimeout(() => {
      setIsSpeaking(false);
      setPetMood("normal");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-maid-purple to-maid-violet flex">
      {/* 左侧边栏 - 桌宠区域 */}
      <div className="w-20 flex-shrink-0 flex flex-col items-center py-4 border-r border-white/10">
        {/* 设置按钮 */}
        <button
          className="mb-4 p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all"
          onClick={() => setShowSettings(true)}
          title="设置"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        {/* 桌宠 */}
        <div className="flex-1 flex items-center justify-center">
          <Pet
            isSpeaking={isSpeaking}
            mood={petMood}
            onClick={handlePetClick}
          />
        </div>

        {/* 底部模型信息 */}
        <div className="px-2 text-center">
          <div className="text-[10px] text-white/50 leading-tight">
            {currentModel}
          </div>
        </div>
      </div>

      {/* 右侧主区域 - 聊天区域 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部标题栏 */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/10 bg-white/5 backdrop-blur-sm">
          {/* 可拖拽区域 */}
          <div
            className="flex items-center gap-3 flex-1 cursor-move"
            onMouseDown={dragWindow}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-maid-purple to-maid-violet flex items-center justify-center text-white text-sm font-bold">
              莉
            </div>
            <div>
              <h1 className="text-white font-semibold text-sm">莉莉</h1>
              <p className="text-white/60 text-xs">
                {isTyping ? "正在输入..." : "在线"}
              </p>
            </div>
          </div>

          {/* 窗口控制按钮 */}
          <div className="flex items-center gap-2">
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onClick={minimizeWindow}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              title="最小化"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onClick={closeWindow}
              className="w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white transition-colors cursor-pointer"
              title="关闭"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 聊天消息区域 */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white/40">
              <div className="w-16 h-16 mb-4 rounded-full bg-white/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-sm">开始和莉莉聊天吧~</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {/* 头像 */}
                <div
                  className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                    message.role === "user"
                      ? "bg-maid-purple text-white"
                      : "bg-white text-maid-purple"
                  }`}
                >
                  {message.role === "user" ? "我" : "莉"}
                </div>

                {/* 消息内容 */}
                <div
                  className={`flex flex-col max-w-[70%] ${
                    message.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      message.role === "user"
                        ? "bg-maid-purple text-white rounded-br-md"
                        : "bg-white text-gray-800 rounded-bl-md"
                    }`}
                  >
                    {message.content}
                  </div>
                  <span className="text-[10px] text-white/40 mt-1 px-1">
                    {new Date(message.timestamp).toLocaleTimeString("zh-CN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))
          )}

          {/* 正在输入指示器 */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-white text-maid-purple flex-shrink-0 flex items-center justify-center text-xs font-bold">
                莉
              </div>
              <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部输入区域 */}
        <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <InputBox
            onSend={handleSendMessage}
            disabled={isTyping}
            placeholder="输入消息..."
          />
        </div>
      </div>

      {/* 设置弹窗 */}
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        currentModel={currentModel}
        onModelChange={handleModelChange}
        localModels={localModels}
        isLoadingModels={isLoadingModels}
      />
    </div>
  );
}

export default App;
