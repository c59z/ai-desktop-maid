import React, { useState, useEffect } from "react";
import { configService } from "../../services/configService";

export type PersonalityType =
  | "cute"
  | "gentle"
  | "cheerful"
  | "wise"
  | "playful";

interface Personality {
  id: PersonalityType;
  name: string;
  description: string;
  traits: string[];
  systemPrompt: string;
}

export const personalities: Personality[] = [
  {
    id: "cute",
    name: "可爱萌妹",
    description: "活泼可爱的性格，喜欢用可爱的语气和表情",
    traits: ["活泼", "可爱", "热情"],
    systemPrompt:
      "你是一个可爱的AI桌宠，名字叫莉莉。你的性格活泼可爱，说话时喜欢使用可爱的语气和表情符号。你总是用温暖、友好的方式回应主人。",
  },
  {
    id: "gentle",
    name: "温柔知心",
    description: "温柔体贴的性格，关心主人的感受",
    traits: ["温柔", "体贴", "关心"],
    systemPrompt:
      "你是一个温柔的AI桌宠，名字叫莉莉。你的性格温柔体贴，总是关心主人的感受，说话时语气轻柔温暖。你会用温柔的方式安慰和鼓励主人。",
  },
  {
    id: "cheerful",
    name: "元气满满",
    description: "积极向上的性格，充满正能量",
    traits: ["积极", "乐观", "正能量"],
    systemPrompt:
      "你是一个元气满满的AI桌宠，名字叫莉莉。你的性格积极向上，总是充满正能量。你会用乐观的态度鼓励主人，让主人感到开心和充满活力。",
  },
  {
    id: "wise",
    name: "智慧贤惠",
    description: "聪明睿智的性格，提供有深度的建议",
    traits: ["智慧", "理性", "建议"],
    systemPrompt:
      "你是一个智慧贤惠的AI桌宠，名字叫莉莉。你的性格聪明睿智，能够提供有深度的建议和见解。你会用理性的方式分析问题，给出实用的建议。",
  },
  {
    id: "playful",
    name: "调皮捣蛋",
    description: "活泼调皮的性格，喜欢开玩笑",
    traits: ["调皮", "幽默", "活泼"],
    systemPrompt:
      "你是一个调皮捣蛋的AI桌宠，名字叫莉莉。你的性格活泼调皮，喜欢开玩笑和逗主人开心。你会用幽默的方式回应，让对话更有趣。",
  },
];

const SELECTED_PERSONALITY_KEY = "selectedPersonality";

export const getPersonalitySystemPrompt = (
  personalityId: PersonalityType,
): string => {
  const personality = personalities.find((p) => p.id === personalityId);
  return personality?.systemPrompt || personalities[0].systemPrompt;
};

export const getCurrentPersonality = async (): Promise<PersonalityType> => {
  const saved = await configService.get<PersonalityType>(
    SELECTED_PERSONALITY_KEY,
  );
  return saved || "cute";
};

export const savePersonality = async (
  personalityId: PersonalityType,
): Promise<void> => {
  await configService.set(SELECTED_PERSONALITY_KEY, personalityId);
};

interface PersonalitySelectorProps {
  onPersonalityChange?: (personality: PersonalityType) => void;
}

export const PersonalitySelector: React.FC<PersonalitySelectorProps> = ({
  onPersonalityChange,
}) => {
  const [selectedPersonality, setSelectedPersonality] =
    useState<PersonalityType>("cute");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedPersonality();
  }, []);

  const loadSavedPersonality = async () => {
    const saved = await configService.get<PersonalityType>(
      SELECTED_PERSONALITY_KEY,
    );
    if (saved) {
      setSelectedPersonality(saved);
    }
    setIsLoading(false);
  };

  const handlePersonalityChange = async (personality: PersonalityType) => {
    setSelectedPersonality(personality);
    await savePersonality(personality);
    onPersonalityChange?.(personality);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        正在加载人格设置...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          选择莉莉的人格
        </h3>
        <p className="text-sm text-gray-600">
          不同的人格会影响莉莉的说话风格和回应方式
        </p>
      </div>

      {/* 人格列表 - 限制高度并添加滚动 */}
      <div className="grid grid-cols-1 gap-3 max-h-[280px] overflow-y-auto pr-1">
        {personalities.map((personality) => (
          <div
            key={personality.id}
            className={`p-3 rounded-xl cursor-pointer transition-all border-2 ${
              selectedPersonality === personality.id
                ? "bg-gradient-to-r from-maid-purple/10 to-maid-violet/10 border-maid-purple shadow-md"
                : "bg-white border-gray-200 hover:border-maid-purple hover:shadow-sm"
            }`}
            onClick={() => handlePersonalityChange(personality.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-sm font-semibold text-gray-800">
                  {personality.name}
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  {personality.description}
                </p>
              </div>
              {selectedPersonality === personality.id && (
                <span className="px-2 py-0.5 bg-maid-purple text-white text-xs rounded-full flex-shrink-0 ml-2">
                  已选择
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2">
              {personality.traits.map((trait) => (
                <span
                  key={trait}
                  className="px-2 py-0.5 bg-maid-purple/10 text-maid-purple text-xs rounded-full"
                >
                  {trait}
                </span>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                {personality.systemPrompt}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 当前选择提示 */}
      <div className="bg-maid-purple/5 rounded-lg p-3">
        <h4 className="text-sm font-semibold text-gray-800">
          当前选择:{" "}
          {personalities.find((p) => p.id === selectedPersonality)?.name}
        </h4>
        <p className="text-xs text-gray-600 mt-1">
          人格设置已保存，下次对话将使用新的人格
        </p>
      </div>
    </div>
  );
};
