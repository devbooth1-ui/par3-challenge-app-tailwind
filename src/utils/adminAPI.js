// src/utils/adminAPI.js
const API_BASE = import.meta.env.VITE_ADMIN_API_URL || '';

async function fetchJSON(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json().catch(() => ({}));
}

export const getPlayers = () => fetchJSON('/api/players');
export const addPlayer = (payload) =>
  fetchJSON('/api/players', { method: 'POST', body: JSON.stringify(payload) });

export const getClaims = () => fetchJSON('/api/claims');
export const createClaim = (payload) =>
  fetchJSON('/api/claims', { method: 'POST', body: JSON.stringify(payload) });

export const createPaymentIntent = (amount = 800) =>
  fetchJSON('/api/payments', { method: 'POST', body: JSON.stringify({ amount }) });

export default { getPlayers, addPlayer, getClaims, createClaim, createPaymentIntent };

export const adminAPI = { getPlayers, addPlayer, getClaims, createClaim, createPaymentIntent };
