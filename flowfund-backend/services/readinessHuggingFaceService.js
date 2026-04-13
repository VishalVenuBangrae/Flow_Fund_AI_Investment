'use strict';

/**
 * Investment readiness scoring via Hugging Face Inference API only.
 * Chatbot continues using Gemini in chatController.
 */

function modelName() {
  // Hugging Face Inference Providers use router-based, OpenAI-compatible chat completions.
  // Include a provider suffix (e.g. ":hf-inference") so routing is deterministic.
  return (process.env.HF_READINESS_MODEL || 'google/gemma-2-2b-it:hf-inference').trim();
}

function buildPrompt(features) {
  const {
    monthly_income,
    monthly_expenses,
    savings_rate,
    volatility_score,
    cash_buffer_months,
  } = features;

  return `You are a financial education scoring engine.
Given ONLY the metrics below, assign a single investment readiness score from 0 to 100.

Metrics:
- monthly_income_this_month: ${monthly_income}
- monthly_expenses_this_month: ${monthly_expenses}
- savings_rate_percent: ${savings_rate}
- expense_volatility_stddev_3mo: ${volatility_score}
- cash_buffer_months: ${cash_buffer_months}

Rules:
- Reward positive income, higher savings rate, larger cash buffer, and lower volatility.
- Keep score low when income is missing, expenses dominate, or buffer is weak.
- Do not mention stocks or trading.

Return ONLY strict JSON with keys:
{"score": <integer 0..100>, "recommendation": "<2-4 short educational sentences>"}.
No markdown, no backticks, no extra keys.`;
}

function extractChatText(payload) {
  // OpenAI-compatible chat completions:
  // { choices: [{ message: { content: "..." } }] }
  const text = payload?.choices?.[0]?.message?.content;
  return typeof text === 'string' ? text.trim() : '';
}

function parseJsonObject(text) {
  if (!text) return null;
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  const candidate = text.slice(start, end + 1);
  try {
    return JSON.parse(candidate);
  } catch (_) {
    return null;
  }
}

async function scoreFromFeatures(features) {
  const token = (process.env.HF_API_TOKEN || '').trim();
  if (!token) {
    return { ok: false, reason: 'no_hf_api_token' };
  }

  const model = modelName();
  const url = 'https://router.huggingface.co/v1/chat/completions';

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: 'Reply with one strict JSON object only. No markdown or extra text.',
          },
          { role: 'user', content: buildPrompt(features) },
        ],
        max_tokens: 220,
      }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      return { ok: false, reason: `hf_http_${resp.status}:${body.slice(0, 200)}` };
    }

    const payload = await resp.json();
    const text = extractChatText(payload);
    const parsed = parseJsonObject(text);
    if (!parsed) return { ok: false, reason: 'invalid_json' };

    let score = parseInt(parsed.score, 10);
    if (!Number.isFinite(score)) return { ok: false, reason: 'invalid_score' };
    score = Math.max(0, Math.min(100, score));

    const recommendation =
      typeof parsed.recommendation === 'string' && parsed.recommendation.trim()
        ? parsed.recommendation.trim().slice(0, 2000)
        : '';
    if (!recommendation) return { ok: false, reason: 'invalid_recommendation' };

    return { ok: true, score, recommendation };
  } catch (err) {
    console.warn('[READINESS_HF]', err.message);
    return { ok: false, reason: err.message || 'hf_call_failed' };
  }
}

module.exports = { scoreFromFeatures, modelName };

