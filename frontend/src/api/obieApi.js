// obieApi.js — OBIE AISP v4.0 GET API Fetchers
import {
  mapAccount,
  mapBalance,
  mapTx,
  enrich,
  FALLBACK_ACCOUNTS_DATA,
  getAccountBalanceFallback,
  getAccountTxFallback,
} from "../pages/User Side/Banking Data/Bankingdata";
import { getValidToken } from "./auth";

const getBaseUrl = () => {
  const domain = import.meta.env.VITE_API_DOMAIN || import.meta.env.VITE_AUTH_DOMAIN || "obiebank-sbx.banfico.io";
  const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  return `https://core-api.${cleanDomain}/api/obie-aisp/v4.0`;
};

async function get(path) {
  let token = import.meta.env.VITE_API_TOKEN;
  if (!token) {
    try {
      token = await getValidToken();
    } catch {
      // ignore token error
    }
  }

  const headers = {
    Accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${getBaseUrl()}${path}`, { headers });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  return res.json();
}

// 1. GET /accounts?type=domestic
export const fetchAccounts = async () => {
  try {
    const data = await get("/accounts?type=domestic");
    const accounts = data?.Data?.Account;
    if (Array.isArray(accounts) && accounts.length > 0) {
      return accounts.map(mapAccount);
    }
  } catch (err) {
    console.warn("[OBIE API] fetchAccounts fallback:", err.message);
  }
  return FALLBACK_ACCOUNTS_DATA.map(mapAccount);
};

// 2. GET /accounts/{accountId}
export const fetchAccount = async (id) => {
  try {
    const data = await get(`/accounts/${id}`);
    const account = data?.Data?.Account?.[0];
    if (account) {
      return mapAccount(account);
    }
  } catch (err) {
    console.warn(`[OBIE API] fetchAccount(${id}) fallback:`, err.message);
  }
  const match = FALLBACK_ACCOUNTS_DATA.find((a) => a.AccountId === id) || FALLBACK_ACCOUNTS_DATA[0];
  return mapAccount(match);
};

// 3. GET /accounts/{accountId}/balances
export const fetchBalance = async (id) => {
  try {
    const data = await get(`/accounts/${id}/balances`);
    const balance = data?.Data?.Balance?.[0];
    if (balance) {
      return mapBalance(balance);
    }
  } catch (err) {
    console.warn(`[OBIE API] fetchBalance(${id}) fallback:`, err.message);
  }
  return mapBalance(getAccountBalanceFallback(id));
};

// 4. GET /accounts/{accountId}/transactions
export const fetchTransactions = async (id) => {
  try {
    const data = await get(`/accounts/${id}/transactions`);
    const transactions = data?.Data?.Transaction;
    if (Array.isArray(transactions) && transactions.length > 0) {
      return {
        transactions: enrich(transactions.map(mapTx)),
        pagination: data?.Data?.Pagination ?? { total: transactions.length, pageIndex: 0, pageSize: 50 },
      };
    }
  } catch (err) {
    console.warn(`[OBIE API] fetchTransactions(${id}) fallback:`, err.message);
  }

  const rawFallback = getAccountTxFallback(id);
  const mapped = enrich(rawFallback.map(mapTx));
  return {
    transactions: mapped,
    pagination: { total: mapped.length, pageIndex: 0, pageSize: 50 },
  };
};
