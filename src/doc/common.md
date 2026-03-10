# Common 共同部品

本目录包含项目中可复用的通用组件和工具，遵循统一的设计规范和主题系统。

## 目录结构

```
src/common/
├── ui/                    # UI 组件
│   ├── Button.tsx        # 按钮组件
│   ├── Card.tsx          # 卡片组件
│   ├── Modal.tsx         # 模态框组件
│   ├── Tabs.tsx          # 标签页组件
│   └── index.ts          # 统一导出
├── theme/                 # 主题系统
│   ├── theme.ts          # 主题配置
│   ├── ThemeProvider.tsx # 主题提供者
│   └── index.ts          # 统一导出
└── index.ts              # 总导出
```

---

## 主题系统 (theme/)

### 概述

主题系统提供统一的颜色、间距、圆角、阴影等设计令牌，支持多主题切换。

### 可用主题

| 主题 | 名称 | 主色调 |
|------|------|--------|
| `purple` | 紫色主题（默认） | #667eea → #764ba2 |
| `blue` | 蓝色主题 | #4299e1 → #667eea |
| `pink` | 粉色主题 | #ed64a6 → #9f7aea |
| `green` | 绿色主题 | #48bb78 → #38b2ac |
| `dark` | 深色主题 | #1a202c → #2d3748 |

### 使用方式

#### 1. 在应用入口包裹 ThemeProvider

```tsx
// main.tsx
import { ThemeProvider } from './common/theme'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="purple">
    <App />
  </ThemeProvider>
)
```

#### 2. 在组件中使用主题

```tsx
import { useTheme } from '../../common/theme'

function MyComponent() {
  const { theme, themeMode, setTheme, toggleTheme } = useTheme()

  return (
    <div style={{ 
      background: theme.colors.background,
      color: theme.colors.text 
    }}>
      <p>当前主题: {themeMode}</p>
      <button onClick={() => setTheme('blue')}>切换蓝色主题</button>
      <button onClick={toggleTheme}>循环切换主题</button>
    </div>
  )
}
```

#### 3. 使用主题类名（Tailwind）

```tsx
import { useThemeClasses } from '../../common/theme'

function MyComponent() {
  const classes = useThemeClasses()

  return (
    <div className={classes.bgGradient}>
      <p className={classes.textPrimary}>主要文字</p>
      <p className={classes.textSecondary}>次要文字</p>
    </div>
  )
}
```

### 主题配置结构

```typescript
interface Theme {
  name: ThemeMode
  colors: ThemeColors      // 颜色配置
  spacing: ThemeSpacing    // 间距配置
  borderRadius: ThemeBorderRadius  // 圆角配置
  shadows: ThemeShadows    // 阴影配置
}

interface ThemeColors {
  // 主色调
  primary: string
  primaryLight: string
  primaryDark: string
  
  // 背景色
  background: string
  backgroundGradient: string
  surface: string
  surfaceHover: string
  
  // 文字色
  text: string
  textSecondary: string
  textMuted: string
  
  // 边框色
  border: string
  borderLight: string
  
  // 状态色
  success: string
  warning: string
  error: string
  info: string
  
  // 特殊色
  accent: string
  overlay: string
}
```

---

## UI 组件 (ui/)

### Button 按钮组件

统一的按钮组件，支持多种变体和尺寸。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | 按钮变体 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 按钮尺寸 |
| `isLoading` | `boolean` | `false` | 加载状态 |
| `fullWidth` | `boolean` | `false` | 是否撑满宽度 |
| `disabled` | `boolean` | `false` | 禁用状态 |
| `className` | `string` | `''` | 自定义类名 |

#### 使用示例

```tsx
import { Button } from '../../common/ui'

// 基础用法
<Button onClick={handleClick}>默认按钮</Button>

// 不同变体
<Button variant="primary">主要按钮</Button>
<Button variant="secondary">次要按钮</Button>
<Button variant="ghost">幽灵按钮</Button>
<Button variant="danger">危险按钮</Button>

// 不同尺寸
<Button size="sm">小按钮</Button>
<Button size="md">中按钮</Button>
<Button size="lg">大按钮</Button>

// 加载状态
<Button isLoading>加载中...</Button>

// 撑满宽度
<Button fullWidth>撑满宽度</Button>
```

---

### Modal 模态框组件

统一的模态框组件，用于弹出层交互。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `isOpen` | `boolean` | - | 是否打开 |
| `onClose` | `() => void` | - | 关闭回调 |
| `title` | `string` | - | 标题 |
| `children` | `ReactNode` | - | 内容 |
| `footer` | `ReactNode` | - | 底部内容 |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 弹窗尺寸 |

#### 使用示例

```tsx
import { Modal, Button } from '../../common/ui'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>打开弹窗</Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="设置"
        footer={<Button onClick={() => setIsOpen(false)}>完成</Button>}
        size="xl"
      >
        <p>弹窗内容</p>
      </Modal>
    </>
  )
}
```

---

### Card 卡片组件

卡片容器组件，用于内容展示。

#### Props

##### Card

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `children` | `ReactNode` | - | 内容 |
| `className` | `string` | `''` | 自定义类名 |
| `hover` | `boolean` | `false` | 是否有悬停效果 |
| `onClick` | `() => void` | - | 点击回调 |
| `selected` | `boolean` | `false` | 是否选中 |

##### CardHeader

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | 标题 |
| `subtitle` | `string` | - | 副标题 |
| `action` | `ReactNode` | - | 操作区 |

##### CardFooter

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `children` | `ReactNode` | - | 内容 |
| `className` | `string` | `''` | 自定义类名 |

#### 使用示例

```tsx
import { Card, CardHeader, CardFooter, CardContent } from '../../common/ui'

// 基础用法
<Card hover onClick={handleClick}>
  <CardHeader title="标题" subtitle="副标题" />
  <CardContent>内容</CardContent>
  <CardFooter>底部</CardFooter>
</Card>

// 选中状态
<Card selected>
  <p>已选中的卡片</p>
</Card>
```

---

### Tabs 标签页组件

标签页切换组件。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `tabs` | `Tab[]` | - | 标签页配置 |
| `defaultTab` | `string` | 第一个 tab | 默认选中的 tab |
| `onChange` | `(tabId: string) => void` | - | 切换回调 |

#### Tab 配置

```typescript
interface Tab {
  id: string
  label: string
  content: React.ReactNode
}
```

#### 使用示例

```tsx
import { Tabs } from '../../common/ui'

const tabs = [
  { id: 'tab1', label: '标签1', content: <div>内容1</div> },
  { id: 'tab2', label: '标签2', content: <div>内容2</div> },
  { id: 'tab3', label: '标签3', content: <div>内容3</div> },
]

<Tabs 
  tabs={tabs} 
  defaultTab="tab1" 
  onChange={(id) => console.log('切换到:', id)} 
/>
```

---

## 导入方式

### 方式一：从 common 统一导入

```tsx
import { Modal, Button, Card, Tabs, useTheme } from '../../common'
```

### 方式二：分别导入

```tsx
// 导入 UI 组件
import { Modal, Button, Card, Tabs } from '../../common/ui'

// 导入主题相关
import { useTheme, ThemeProvider } from '../../common/theme'
```

---

## 扩展指南

### 添加新的 UI 组件

1. 在 `src/common/ui/` 目录下创建新组件文件
2. 在 `src/common/ui/index.ts` 中导出
3. 更新本文档

### 添加新主题

1. 在 `src/common/theme/theme.ts` 中定义新主题
2. 添加到 `themes` 映射中
3. 更新 `ThemeMode` 类型
4. 更新本文档

### 添加新的共同部品类型

如需添加 hooks、utils、constants 等其他类型的共同部品：

1. 在 `src/common/` 下创建对应目录
2. 在 `src/common/index.ts` 中导出
3. 更新本文档
