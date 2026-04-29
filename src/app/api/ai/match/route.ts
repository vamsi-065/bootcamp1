import { NextRequest, NextResponse } from "next/server";
import { generateImageEmbedding } from "@/lib/ai/embedding";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key'

const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    // 1. Generate Embedding
    const embedding = await generateImageEmbedding(imageUrl);

    // 2. Query Supabase for similar found items
    const { data: matches, error } = await supabase.rpc('match_items', {
      query_embedding: embedding,
      match_threshold: 0.5, // 50% similarity threshold
      match_count: 5
    });

    if (error) {
      console.error("Supabase RPC error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ matches });
  } catch (error: any) {
    console.error("AI Match API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
