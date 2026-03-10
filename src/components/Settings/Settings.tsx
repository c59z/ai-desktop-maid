import React from "react";
import { Modal, Button, Tabs } from "../../common/ui";
import { ModelSelector } from "./ModelSelector";
import { PersonalitySelector } from "./PersonalitySelector";
import { MemoryUsage } from "./MemoryUsage";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: string;
  onModelChange: (model: string) => void;
  localModels: any[];
  isLoadingModels: boolean;
}

export const Settings: React.FC<SettingsProps> = ({
  isOpen,
  onClose,
  currentModel,
  onModelChange,
  localModels,
  isLoadingModels,
}) => {
  const tabs = [
    {
      id: "model",
      label: "模型设置",
      content: (
        <ModelSelector
          currentModel={currentModel}
          onModelChange={onModelChange}
          localModels={localModels}
          isLoadingModels={isLoadingModels}
        />
      ),
    },
    {
      id: "personality",
      label: "人格设置",
      content: <PersonalitySelector />,
    },
    {
      id: "memory",
      label: "记忆管理",
      content: <MemoryUsage />,
    },
  ];

  const footer = (
    <Button onClick={onClose} fullWidth>
      完成
    </Button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="设置"
      footer={footer}
      size="xl"
    >
      <Tabs tabs={tabs} />
    </Modal>
  );
};
