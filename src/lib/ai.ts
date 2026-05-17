import OpenAI from "openai";
import type { ResearchStock } from "@/lib/types";

let openai: OpenAI | null = null;

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  if (!openai) {
    openai = new OpenAI({ apiKey });
  }

  return openai;
}

export function deterministicExplanation(stock: ResearchStock) {
  return `${stock.symbol} is labeled ${stock.recommendationLabel}, not as a buy call, because the scoring engine finds a ${stock.longTermScore}/100 long-term score and a ${stock.shortTermScore}/100 short-term score. The strongest visible factor is ${stock.bestFor.toLowerCase()} suitability, while the main caution is ${stock.whyNot[0].toLowerCase()} Confidence is ${stock.confidence.toLowerCase()} because data coverage and source agreement are part of the score.`;
}

export async function generateStockExplanation(stock: ResearchStock) {
  const client = getOpenAI();

  if (!client) {
    return deterministicExplanation(stock);
  }

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "You explain stock research scores using only provided data. You do not give personalized financial advice, price targets, guaranteed returns, or buy/sell instructions.",
      },
      {
        role: "user",
        content: JSON.stringify({
          symbol: stock.symbol,
          label: stock.recommendationLabel,
          longTermScore: stock.longTermScore,
          shortTermScore: stock.shortTermScore,
          confidence: stock.confidence,
          riskLevel: stock.riskLevel,
          bullCase: stock.bullCase,
          bearCase: stock.bearCase,
          whyNot: stock.whyNot,
        }),
      },
    ],
  });

  return response.output_text || deterministicExplanation(stock);
}
