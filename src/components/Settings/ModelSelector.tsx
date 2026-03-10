import React from 'react'

interface ModelSelectorProps {
  currentModel: string
  onModelChange: (model: string) => void
  localModels: any[]
  isLoadingModels: boolean
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  currentModel,
  onModelChange,
  localModels,
  isLoadingModels
}) => {
  const formatModelSize = (bytes: number): string => {
    const gb = bytes / (1024 * 1024 * 1024)
    if (gb >= 1) {
      return `${gb.toFixed(2)} GB`
    }
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">当前模型</h3>
        <span className="text-sm text-maid-purple font-medium">{currentModel}</span>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 mb-2">可用模型 ({localModels.length})</h4>
        
        {isLoadingModels ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            正在加载模型...
          </div>
        ) : localModels.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            未找到本地模型
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {localModels.map((model) => (
              <div
                key={model.name}
                className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                  model.name === currentModel
                    ? 'bg-gradient-to-r from-maid-purple/10 to-maid-violet/10 border-maid-purple'
                    : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:border-maid-purple'
                }`}
                onClick={() => onModelChange(model.name)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-base font-semibold text-gray-800">
                    {model.name}
                  </div>
                  {model.name === currentModel && (
                    <span className="px-2 py-1 bg-maid-purple text-white text-xs rounded-full">
                      当前
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2 text-xs text-gray-600">
                  <span className="bg-maid-purple/10 px-2 py-1 rounded-md">
                    大小: {formatModelSize(model.size)}
                  </span>
                  {model.details?.parameter_size && (
                    <span className="bg-maid-violet/10 px-2 py-1 rounded-md">
                      参数: {model.details.parameter_size}
                    </span>
                  )}
                  {model.details?.quantization_level && (
                    <span className="bg-gray-200 px-2 py-1 rounded-md">
                      量化: {model.details.quantization_level}
                    </span>
                  )}
                </div>

                {model.details?.family && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      模型家族: {model.details.family}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">模型说明</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• 选择不同的模型会影响莉莉的回答质量和响应速度</p>
          <p>• 较大的模型需要更多内存和计算资源</p>
          <p>• 建议根据设备性能选择合适的模型</p>
        </div>
      </div>
    </div>
  )
}
