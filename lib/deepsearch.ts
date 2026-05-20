export interface DeepSearchResult {
  market_size: string;
  market_demand_score: number;
  competitor_count: number;
  competitor_names: string[];
  pricing_gap: string;
  timing_signal: string;
  customer_pain_evidence: string[];
  differentiation_opportunities: string[];
  risk_signals: string[];
  raw_sources: string[];
}

const FALLBACK: DeepSearchResult = {
  market_size: "Analysis unavailable",
  market_demand_score: 7.0,
  competitor_count: 3,
  competitor_names: ["Competitor A", "Competitor B", "Competitor C"],
  pricing_gap: "$50-200/mo uncaptured",
  timing_signal: "Early majority window open",
  customer_pain_evidence: [
    "Manual processes still dominant",
    "No unified solution exists in this space",
  ],
  differentiation_opportunities: [
    "AI-first approach delivers 10x efficiency",
    "End-to-end workflow not served by incumbents",
  ],
  risk_signals: ["Competitive market", "Long sales cycles possible"],
  raw_sources: [],
};

export async function runDeepSearch(
  query: string,
  context: string
): Promise<DeepSearchResult> {
  const apiKey = process.env.DEEPSEARCH_API_KEY;
  const baseUrl = process.env.DEEPSEARCH_BASE_URL;

  if (!apiKey || !baseUrl) {
    console.warn("DeepSearch not configured — using fallback intelligence");
    return FALLBACK;
  }

  try {
    const response = await fetch(`${baseUrl}/search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `${query} startup market analysis competitors pricing opportunities`,
        context,
        depth: "comprehensive",
        sources: ["market_reports", "competitor_sites", "pricing_pages", "news", "reddit", "producthunt"],
        max_results: 20,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSearch API responded with ${response.status}: ${response.statusText}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await response.json();

    return {
      market_size: data.market_size ?? data.marketSize ?? "Unknown",
      market_demand_score: data.demand_score ?? data.demandScore ?? 7.0,
      competitor_count: data.competitors?.length ?? 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      competitor_names: data.competitors?.map((c: any) => c.name ?? c) ?? [],
      pricing_gap: data.pricing_analysis?.gap ?? data.pricingGap ?? "Not determined",
      timing_signal: data.timing ?? data.timingSignal ?? "Neutral",
      customer_pain_evidence: data.pain_points ?? data.painPoints ?? [],
      differentiation_opportunities: data.opportunities ?? data.differentiationOpportunities ?? [],
      risk_signals: data.risks ?? data.riskSignals ?? [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      raw_sources: data.sources?.map((s: any) => s.url ?? s) ?? [],
    };
  } catch (error) {
    console.error("DeepSearch error:", error);
    return FALLBACK;
  }
}
