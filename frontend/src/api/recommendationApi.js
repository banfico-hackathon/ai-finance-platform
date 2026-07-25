// recommendationApi.js — Service calling Django REST Gemini Spending Recommendation API
import axios from "axios";

const RECOMMENDATIONS_URL = import.meta.env.VITE_RECOMMENDATIONS_URL || "http://localhost:8001/api/recommendations/";

/**
 * Fetch AI spending recommendations based on user transaction categories and balances
 * @param {Object} spendingData - { totalOut: number, totalIn: number, categories: Array<{name: string, total: number}> }
 * @returns {Promise<Array<{id: string, title: string, category: string, impact: string, type: string, summary: string, actionText: string}>>}
 */
export async function fetchSpendingRecommendations(spendingData) {
  try {
    const response = await axios.post(RECOMMENDATIONS_URL, spendingData, {
      headers: { "Content-Type": "application/json" },
      timeout: 15000,
    });

    if (response.data && response.data.recommendations) {
      return response.data.recommendations;
    }
  } catch (err) {
    console.warn("[Recommendation API] Django REST server unavailable, using dynamic fallback heuristics:", err.message);
  }

  // Smart Heuristic Fallbacks based on user categories if offline
  const categories = spendingData?.categories || [];
  const dining = categories.find(c => c.name.toLowerCase().includes('dining') || c.name.toLowerCase().includes('food'));
  const subs = categories.find(c => c.name.toLowerCase().includes('sub'));

  return [
    {
      id: "rec-fallback-1",
      title: "Audit Unused Subscriptions",
      category: "Subscriptions",
      impact: subs ? `Save $${Math.round(subs.total * 0.2)}/mo` : "Save $35.00/mo",
      type: "saving",
      summary: subs 
        ? `You spent $${subs.total} on subscriptions recently. Auditing unused streaming services can save $35/mo.`
        : "Cancel unmonitored streaming or app subscriptions to optimize monthly cashflow.",
      actionText: "Audit Subscriptions"
    },
    {
      id: "rec-fallback-2",
      title: "Auto-Sweep Surplus to High-Yield Vault",
      category: "Vault Sweep",
      impact: "+$140.00 auto-sweep",
      type: "vault",
      summary: "Your checking account buffer is healthy. Automatically sweep excess cash into your 4.30% APY savings vault.",
      actionText: "Enable Auto-Sweep"
    },
    {
      id: "rec-fallback-3",
      title: "Optimize Dining & Takeout",
      category: "Dining",
      impact: dining ? `Save $${Math.round(dining.total * 0.15)}/mo` : "Reduce 15%",
      type: "alert",
      summary: dining
        ? `Dining is currently your highest variable category at $${dining.total}. Setting a category limit frees up extra cash.`
        : "Dining out accounted for a significant portion of variable outflow this month.",
      actionText: "Set Category Cap"
    }
  ];
}

