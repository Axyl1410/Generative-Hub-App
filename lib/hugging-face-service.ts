import { HfInference } from "@huggingface/inference";

export class HuggingFaceService {
  private inference: HfInference;
  private readonly defaultModel = "gpt2-medium";

  constructor(apiKey: string) {
    this.inference = new HfInference(apiKey);
  }

  async generateCollectionDescription(
    name: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    imageData?: File
  ): Promise<string> {
    try {
      // Tạo prompt ngắn gọn
      const prompt = `Write a brief NFT collection description for "${name}":`;

      const result = await this.inference.textGeneration({
        model: this.defaultModel,
        inputs: prompt,
        parameters: {
          max_length: 30,
          max_new_tokens: 20,
          temperature: 0.9,
          top_p: 0.6,
          early_stopping: true,
          num_return_sequences: 1,
          return_full_text: false,
        },
      });

      return this.formatDescription(result.generated_text);
    } catch (error) {
      throw new Error(
        "Failed to generate description. Please try again." + error
      );
    }
  }

  private formatDescription(text: string): string {
    // Clean up output
    let cleaned = text
      .trim()
      .replace(/[\n\r]/g, " ")
      .replace(/\s+/g, " ");

    // Ensure proper length
    if (cleaned.length > 100) {
      cleaned = cleaned.substring(0, 97) + "...";
    }

    // Add period if missing
    if (!cleaned.endsWith(".")) {
      cleaned += ".";
    }

    // Capitalize first letter
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
}
