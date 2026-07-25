// AccountContext.jsx — Multi-account state management for Banfico OBIE AISP
import { createContext, useContext, useEffect, useState } from "react";
import { fetchAccounts } from "./obieApi";
import { mapAccount, FALLBACK_ACCOUNTS_DATA } from "../pages/User Side/Banking Data/Bankingdata";

const AccountContext = createContext(null);

const defaultAccountContext = {
  accounts: FALLBACK_ACCOUNTS_DATA.map(mapAccount),
  selectedAccountId: "6a62009ac47905bfc3f196cd",
  selectedAccount: mapAccount(FALLBACK_ACCOUNTS_DATA[0]),
  setSelectedAccountId: () => {},
  loading: false,
  error: null,
  reloadAccounts: () => {},
};

export function AccountProvider({ children }) {
  const [accounts, setAccounts] = useState(() => FALLBACK_ACCOUNTS_DATA.map(mapAccount));
  const [selectedAccountId, setSelectedAccountId] = useState(() => localStorage.getItem("banfico_selected_account_id") || "6a62009ac47905bfc3f196cd");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchAccounts();
      if (Array.isArray(list) && list.length > 0) {
        setAccounts(list);
        const exists = list.some((a) => a.accountId === selectedAccountId);
        if (!selectedAccountId || !exists) {
          const firstId = list[0].accountId;
          setSelectedAccountId(firstId);
          localStorage.setItem("banfico_selected_account_id", firstId);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleSelectAccount = (id) => {
    setSelectedAccountId(id);
    localStorage.setItem("banfico_selected_account_id", id);
  };

  const selectedAccount = accounts.find((a) => a.accountId === selectedAccountId) || accounts[0];

  const value = {
    accounts: accounts.length > 0 ? accounts : FALLBACK_ACCOUNTS_DATA.map(mapAccount),
    selectedAccountId: selectedAccount?.accountId || selectedAccountId || "6a62009ac47905bfc3f196cd",
    selectedAccount,
    setSelectedAccountId: handleSelectAccount,
    loading,
    error,
    reloadAccounts: loadAccounts,
  };

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export const useAccount = () => useContext(AccountContext) || defaultAccountContext;
