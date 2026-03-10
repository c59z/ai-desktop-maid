import React, { useState } from 'react'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (tabId: string) => void
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content

  return (
    <div className="flex flex-col h-full">
      {/* 标签头 */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-maid-purple'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-maid-purple to-maid-violet" />
            )}
          </button>
        ))}
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto p-4">{activeContent}</div>
    </div>
  )
}
