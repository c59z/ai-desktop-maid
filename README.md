# AI Desktop Maid - 项目说明

## 项目概述

AI Desktop Maid 是一个基于 Tauri + React + Rust 的桌面 AI 桌宠应用，具有以下特性：

- 本地 AI 对话（使用 Ollama）
- AI 长期记忆系统（SQLite）
- 毒舌可爱的角色人格（莉莉）
- 透明桌面窗口
- 可扩展架构

## 技术栈

- **前端**: React 19 + TypeScript + Vite
- **桌面框架**: Tauri 2
- **后端**: Rust
- **AI 模型**: Ollama (llama3.2)
- **数据库**: SQLite (better-sqlite3)

## 项目结构

```
ai-desktop-maid/
├── src/                          # React 前端
│   ├── components/               # UI 组件
│   │   ├── Pet/                 # 桌宠组件
│   │   ├── ChatBubble/          # 聊天气泡
│   │   └── InputBox/            # 输入框
│   ├── ai/                      # AI 相关
│   │   ├── ollamaClient.ts     # Ollama 客户端
│   │   └── promptBuilder.ts    # Prompt 构建器
│   ├── services/                # 服务层
│   │   └── memoryService.ts    # 记忆服务
│   ├── App.tsx                  # 主应用
│   └── main.tsx                 # 入口文件
└── src-tauri/                   # Rust 后端
    ├── src/
    │   ├── main.rs             # 主入口
    │   ├── lib.rs              # 库文件
    │   └── modules/            # 模块
    │       └── system_monitor.rs
    └── tauri.conf.json         # Tauri 配置
```

## 功能说明

### MVP 功能（已实现）

1. **桌宠 UI**
   - 可爱的桌宠角色（莉莉）
   - 多种情绪状态（开心、正常、难过、思考）
   - 说话动画效果

2. **聊天系统**
   - 聊天气泡显示
   - 用户输入框
   - 实时对话

3. **AI 对话**
   - Ollama 本地模型调用
   - 智能回复生成

4. **记忆系统**
   - 短期记忆（最近对话）
   - 长期记忆（用户信息）
   - SQLite 数据存储

5. **Prompt 构建**
   - 系统提示词
   - 用户画像
   - 对话历史
   - 相关记忆

## 使用说明

### 前置要求

1. 安装 Node.js
2. 安装 Rust（用于 Tauri）
3. 安装 Ollama 并启动服务

### 安装依赖

```bash
npm install
```

### 开发模式

#### 仅前端开发
```bash
npm run dev
```

#### Tauri 桌面应用开发
```bash
npm run tauri:dev
```

### 构建

```bash
npm run tauri:build
```

## 配置说明

### Ollama 配置

默认连接到 `http://localhost:11434`，确保 Ollama 服务已启动。

如需修改，编辑 [ollamaClient.ts](src/ai/ollamaClient.ts) 中的 host 配置。

### 窗口配置

窗口配置在 [tauri.conf.json](src-tauri/tauri.conf.json) 中：

- 透明窗口
- 置顶显示
- 可调整大小
- 无边框

### 数据库配置

数据库默认存储在 `~/.ai-desktop-maid/memories.db`

## 未来扩展

### 第二阶段
- 语音识别（Whisper）
- 语音合成（VITS）
- 多角色声线

### 第三阶段
- 桌面观察
- 行为吐槽
- 插件系统
- 向量检索

## 注意事项

1. 首次运行需要 Ollama 服务
2. 数据库文件会自动创建
3. 窗口支持拖拽和调整大小
4. 点击桌宠可以触发随机问候

## 开发者

根据 project.md 文档开发，遵循 MVP 原则，优先实现核心功能。
