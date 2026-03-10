import ollama from "ollama";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ModelInfo {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
  details?: {
    format?: string;
    family?: string;
    families?: string[];
    parameter_size?: string;
    quantization_level?: string;
  };
}

export class OllamaClient {
  private client: typeof ollama;
  private model: string;

  constructor(model: string = "llama3.2") {
    this.client = ollama;
    this.model = model;
  }

  async chat(messages: Message[]): Promise<string> {
    try {
      const response = await this.client.chat({
        model: this.model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      return response.message?.content || "";
    } catch (error) {
      console.error("Ollama chat error:", error);
      throw error;
    }
  }

  async generate(prompt: string): Promise<string> {
    try {
      const response = await this.client.generate({
        model: this.model,
        prompt,
      });

      return response.response || "";
    } catch (error) {
      console.error("Ollama generate error:", error);
      throw error;
    }
  }

  // 获取当前使用的模型
  getCurrentModel(): string {
    return this.model;
  }

  // 获取所有可用的本地模型列表
  async getLocalModels(): Promise<ModelInfo[]> {
    try {
      const response = await this.client.list();
      return (response.models || []).map((model) => ({
        ...model,
        modified_at:
          model.modified_at instanceof Date
            ? model.modified_at.toISOString()
            : String(model.modified_at),
      }));
    } catch (error) {
      console.error("获取模型列表失败:", error);
      return [];
    }
  }

  // 检查指定的模型是否已安装
  async isModelInstalled(modelName: string): Promise<boolean> {
    try {
      const models = await this.getLocalModels();
      return models.some(
        (model) =>
          model.name === modelName || model.name.startsWith(modelName + ":"),
      );
    } catch (error) {
      console.error("检查模型失败:", error);
      return false;
    }
  }

  // 获取模型详细信息
  async getModelInfo(modelName?: string): Promise<any> {
    const targetModel = modelName || this.model;
    try {
      const response = await this.client.show({ model: targetModel });
      return response;
    } catch (error) {
      console.error("获取模型信息失败:", error);
      return null;
    }
  }

  setModel(model: string): void {
    this.model = model;
  }

  getModel(): string {
    return this.model;
  }
}

export const ollamaClient = new OllamaClient();
