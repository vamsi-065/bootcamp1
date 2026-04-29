import { pipeline, env } from "@xenova/transformers";

// Configuration for local environment
env.allowLocalModels = false;
env.useBrowserCache = true;

class EmbeddingPipeline {
  static instance: any = null;

  static async getInstance() {
    if (this.instance === null) {
      // Use CLIP model for multimodal embeddings (Image + Text)
      // Produces 512-dim vectors compatible with Supabase vector(512)
      this.instance = await pipeline('feature-extraction', 'Xenova/clip-vit-base-patch32');
    }
    return this.instance;
  }
}

/**
 * Generates a 512-dimensional vector for an image
 */
export async function generateImageEmbedding(imagePath: string): Promise<number[]> {
  const extractor = await EmbeddingPipeline.getInstance();
  
  const output = await extractor(imagePath, {
    pooling: 'mean',
    normalize: true,
  });

  return Array.from(output.data as any);
}

/**
 * Generates a 512-dimensional vector for a text description
 * Enables semantic search between text reports and found items
 */
export async function generateTextEmbedding(text: string): Promise<number[]> {
  const extractor = await EmbeddingPipeline.getInstance();
  
  const output = await extractor(text, {
    pooling: 'mean',
    normalize: true,
  });

  return Array.from(output.data as any);
}
