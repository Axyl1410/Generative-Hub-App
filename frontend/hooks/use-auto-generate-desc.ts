import { useCallback, useState } from "react";
import { toast } from "sonner";

interface GenerateDescriptionOptions {
  timeout?: number;
}

export const useGenerateDescription = (
  options: GenerateDescriptionOptions = {}
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { timeout = 1000 } = options;
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDescription = useCallback(
    async (
      name: string,
      category: string = "default"
    ): Promise<string | null> => {
      if (!name) {
        toast.warning("Please enter a name first");
        return null;
      }

      setIsGenerating(true);

      try {
        // Templates cho từng category
        const templates: Record<string, string[]> = {
          art: [
            `The ${name} NFT collection represents a groundbreaking fusion of digital artistry and creative innovation, featuring stunning visual compositions and dynamic elements. Each piece showcases meticulous attention to detail and artistic excellence, creating a unique digital art experience.`,
            `${name} brings forth a revolutionary digital art collection that pushes creative boundaries with its distinctive aesthetic approach. The collection combines innovative techniques with artistic vision to deliver masterpieces that stand out in the NFT space.`,
          ],
          futuristic: [
            `${name} presents a cutting-edge NFT collection where technology meets artistic innovation, featuring futuristic designs and dynamic digital elements. Each creation showcases advanced techniques and forward-thinking aesthetics that define the future of digital art.`,
            `The ${name} collection emerges as a pioneering force in the NFT space, blending advanced digital techniques with visionary artistic expression. Every piece represents a leap into the future of digital creativity.`,
          ],
          mythology: [
            `${name} weaves ancient mythological themes into contemporary digital art, creating a unique NFT collection that bridges past and present. Each piece tells a compelling story through innovative digital interpretations of timeless legends.`,
            `The ${name} collection transforms mythological narratives into stunning digital artworks, combining classical themes with modern artistic techniques. Every creation captures the essence of legendary tales in the digital realm.`,
          ],
          abstract: [
            `${name} presents an abstract NFT collection that challenges conventional artistic boundaries, featuring bold geometric patterns and innovative compositions. Each piece explores unique visual concepts through dynamic digital expression.`,
            `The ${name} collection pushes the boundaries of abstract digital art, creating immersive visual experiences through innovative techniques. Every artwork represents a unique exploration of form, color, and movement.`,
          ],
          nature: [
            `${name} captures the beauty of nature through digital artistry, creating an NFT collection that celebrates organic forms and natural harmony. Each piece transforms natural elements into stunning digital compositions.`,
            `The ${name} collection bridges the natural and digital worlds, featuring artistic interpretations of nature's most beautiful elements. Every creation showcases the perfect balance between organic inspiration and digital innovation.`,
          ],
          luxury: [
            `${name} represents the pinnacle of luxury in the NFT space, featuring sophisticated designs and exclusive artistic elements. Each piece embodies elegance and premium quality in digital art form.`,
            `The ${name} collection sets a new standard for luxury digital art, combining refined aesthetics with exceptional craftsmanship. Every creation showcases the perfect blend of sophistication and artistic innovation.`,
          ],
          default: [
            `${name} presents a unique NFT collection that combines innovative design with artistic excellence, featuring distinctive visual elements and creative vision. Each piece showcases the perfect balance of creativity and digital craftsmanship.`,
            `The ${name} collection stands out in the NFT space through its unique artistic approach and creative excellence. Every artwork represents a perfect harmony of innovative design and digital artistry.`,
          ],
        };

        // Chọn template ngẫu nhiên cho category
        const categoryTemplates = templates[category] || templates.default;
        const selectedTemplate =
          categoryTemplates[
            Math.floor(Math.random() * categoryTemplates.length)
          ];

        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 500));

        return selectedTemplate;
      } catch (error) {
        console.error("Generation error:", error);
        toast.error("Failed to generate description");
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return {
    generateDescription,
    isGenerating,
  };
};
