// Bankingdata.js — OBIE AISP v4.0 Mappers, Data Derivations, and Per-Account Fallbacks

/* ---------------------------------------------------------------------------
   Sample OBIE AISP Data (from user's real OBIE AISP payloads)
--------------------------------------------------------------------------- */

export const FALLBACK_ACCOUNTS_DATA = [
  {
    AccountId: "6a62009ac47905bfc3f196cd",
    InternationalAccount: false,
    Status: "Enabled",
    StatusUpdateDateTime: "2019-01-01T06:06:06.000Z",
    Currency: "GBP",
    AccountCategory: "Personal",
    AccountTypeCode: "CACC",
    Description: "For paying bills",
    Nickname: "Bills",
    OpeningDate: "2002-01-05T00:00:00.000Z",
    Account: [
      {
        LEI: "9193001QZMP2PQT4AK86",
        Name: "NIVASGANESAN",
        SchemeName: "UK.OBIE.SortCodeAccountNumber",
        Identification: "68130781747936",
        SecondaryIdentification: "06307",
      },
    ],
    Servicer: { Name: "ServicerName" },
  },
  {
    AccountId: "6a62009ac47905bfc3f196db",
    InternationalAccount: false,
    Status: "Enabled",
    Currency: "GBP",
    AccountCategory: "Personal",
    AccountTypeCode: "CACC",
    Description: "For household expenses",
    Nickname: "Household",
    OpeningDate: "2002-01-05T00:00:00.000Z",
    Account: [
      {
        Name: "NIVASGANESAN",
        SchemeName: "UK.OBIE.SortCodeAccountNumber",
        Identification: "44771563636688",
        SecondaryIdentification: "32463",
      },
    ],
    Servicer: { Name: "ServicerName" },
  },
  {
    AccountId: "6a62009bc47905bfc3f196e9",
    InternationalAccount: false,
    Status: "Enabled",
    Currency: "GBP",
    AccountCategory: "Personal",
    AccountTypeCode: "CACC",
    Description: "Personal savings account",
    Nickname: "Savings",
    OpeningDate: "2002-01-05T00:00:00.000Z",
    Account: [
      {
        Name: "NIVASGANESAN",
        SchemeName: "UK.OBIE.SortCodeAccountNumber",
        Identification: "12540159027301",
        SecondaryIdentification: "41637",
      },
    ],
    Servicer: { Name: "ServicerName" },
  },
  {
    AccountId: "6a6330b9c47905bfc3f19781",
    InternationalAccount: false,
    Status: "Enabled",
    Currency: "GBP",
    AccountCategory: "Personal",
    AccountTypeCode: "CACC",
    Nickname: "Emergency",
    OpeningDate: "2026-07-24T09:30:33.233Z",
    Account: [
      {
        Name: "Blake Beahan",
        SchemeName: "UK.OBIE.SortCodeAccountNumber",
        Identification: "75755381227370",
        SecondaryIdentification: "17204",
      },
    ],
    Servicer: { Name: "ServicerNameSample" },
  },
  {
    AccountId: "6a647202c47905bfc3f19e4c",
    InternationalAccount: false,
    Status: "Enabled",
    Currency: "GBP",
    AccountCategory: "Personal",
    AccountTypeCode: "CACC",
    Nickname: "Holiday Fund",
    OpeningDate: "2026-07-25T08:21:22.639Z",
    Account: [
      {
        Name: "Maria Olson",
        SchemeName: "UK.OBIE.SortCodeAccountNumber",
        Identification: "67250740337826",
        SecondaryIdentification: "59852",
      },
    ],
    Servicer: { Name: "ServicerNameSample" },
  },
  {
    AccountId: "6a647fb1c47905bfc3f19f8b",
    InternationalAccount: false,
    Status: "Enabled",
    Currency: "GBP",
    AccountCategory: "Personal",
    AccountTypeCode: "CACC",
    Nickname: "Rainy Day",
    OpeningDate: "2026-07-25T09:19:46.302Z",
    Account: [
      {
        Name: "Roy Rosenbaum Sr.",
        SchemeName: "UK.OBIE.SortCodeAccountNumber",
        Identification: "08875897133200",
        SecondaryIdentification: "49497",
      },
    ],
    Servicer: { Name: "ServicerNameSample" },
  },
];

// Per-account distinct balances
export function getAccountBalanceFallback(id = "") {
  let baseCurrent = 329.06;
  let baseAvailable = 401.0;
  let basePreAgreed = 501.0;
  let baseTotal = 720.39;
  let baseLocal = 400.0;

  if (id.includes("db")) {
    // Household
    baseCurrent = 1840.5;
    baseAvailable = 2500.0;
    basePreAgreed = 500.0;
    baseTotal = 2340.5;
    baseLocal = 2200.0;
  } else if (id.includes("e9")) {
    // Savings
    baseCurrent = 14250.0;
    baseAvailable = 14250.0;
    basePreAgreed = 0.0;
    baseTotal = 14250.0;
    baseLocal = 17500.0;
  } else if (id.includes("781")) {
    // Emergency
    baseCurrent = 5600.0;
    baseAvailable = 6000.0;
    basePreAgreed = 1000.0;
    baseTotal = 6600.0;
    baseLocal = 7000.0;
  } else if (id.includes("e4c")) {
    // Holiday Fund
    baseCurrent = 2100.8;
    baseAvailable = 2100.8;
    basePreAgreed = 300.0;
    baseTotal = 2400.8;
    baseLocal = 2650.0;
  } else if (id.includes("f8b")) {
    // Rainy Day
    baseCurrent = 4897.96;
    baseAvailable = 5299.96;
    basePreAgreed = 500.0;
    baseTotal = 5397.96;
    baseLocal = 6100.0;
  }

  return {
    AccountId: id,
    CreditDebitIndicator: "Credit",
    Type: "CLAV",
    DateTime: new Date().toISOString(),
    CreditLine: [
      { Type: "Available", Amount: { Amount: baseAvailable.toFixed(2), Currency: "GBP" } },
      { Type: "Pre-Agreed", Amount: { Amount: basePreAgreed.toFixed(2), Currency: "GBP" } },
    ],
    Amount: { Amount: baseCurrent.toFixed(2), Currency: "GBP", SubType: "BCUR" },
    LocalAmount: { Amount: baseLocal.toFixed(2), Currency: "USD", SubType: "LCUR" },
    TotalValue: { Amount: baseTotal.toFixed(2), Currency: "GBP" },
  };
}

// Per-account distinct transactions
export function getAccountTxFallback(id = "") {
  if (id.includes("db")) {
    // Household transactions
    return [
      {
        TransactionId: "tx_h1",
        AccountId: id,
        TransactionReference: "Ref HH8847192",
        CreditDebitIndicator: "Debit",
        Status: "BOOK",
        BookingDateTime: "2026-07-25T08:15:00.000Z",
        ValueDateTime: "2026-07-25T08:15:00.000Z",
        TransactionInformation: "Sainsbury Supermarket",
        Amount: { Amount: "124.50", Currency: "GBP" },
        BankTransactionCode: { Code: "MerchantPayment", SubCode: "CardPayment" },
        ProprietaryBankTransactionCode: { Code: "Purchase", Issuer: "CoreBank" },
        Balance: { Type: "CLAV", Amount: { Amount: "1840.50", Currency: "GBP" }, CreditDebitIndicator: "Credit" },
        MerchantDetails: { MerchantName: "Sainsbury's Stores", MerchantCategoryCode: "5411" },
        CardInstrument: { CardSchemeName: "Visa Debit", AuthorisationType: "PIN" },
      },
      {
        TransactionId: "tx_h2",
        AccountId: id,
        TransactionReference: "Ref HH8847193",
        CreditDebitIndicator: "Debit",
        Status: "BOOK",
        BookingDateTime: "2026-07-24T14:20:00.000Z",
        ValueDateTime: "2026-07-24T14:20:00.000Z",
        TransactionInformation: "British Gas Monthly Direct Debit",
        Amount: { Amount: "185.00", Currency: "GBP" },
        BankTransactionCode: { Code: "DirectDebit", SubCode: "UtilityPayment" },
        ProprietaryBankTransactionCode: { Code: "DirectDebit", Issuer: "CoreBank" },
        Balance: { Type: "CLAV", Amount: { Amount: "1965.00", Currency: "GBP" }, CreditDebitIndicator: "Credit" },
        MerchantDetails: { MerchantName: "British Gas", MerchantCategoryCode: "4900" },
        CardInstrument: { CardSchemeName: "Direct Debit", AuthorisationType: "Automatic" },
      },
      {
        TransactionId: "tx_h3",
        AccountId: id,
        TransactionReference: "Ref HH8847194",
        CreditDebitIndicator: "Credit",
        Status: "BOOK",
        BookingDateTime: "2026-07-23T09:00:00.000Z",
        ValueDateTime: "2026-07-23T09:00:00.000Z",
        TransactionInformation: "Household Contribution Transfer",
        Amount: { Amount: "500.00", Currency: "GBP" },
        BankTransactionCode: { Code: "ReceivedCreditTransfer", SubCode: "DomesticCreditTransfer" },
        ProprietaryBankTransactionCode: { Code: "Transfer", Issuer: "CoreBank" },
        Balance: { Type: "CLAV", Amount: { Amount: "2150.00", Currency: "GBP" }, CreditDebitIndicator: "Credit" },
        MerchantDetails: { MerchantName: "Partner Contribution", MerchantCategoryCode: "5874" },
        CardInstrument: { CardSchemeName: "Faster Payments", AuthorisationType: "Online" },
      },
    ];
  }

  if (id.includes("e9")) {
    // Savings transactions
    return [
      {
        TransactionId: "tx_s1",
        AccountId: id,
        TransactionReference: "Ref SV9920141",
        CreditDebitIndicator: "Credit",
        Status: "BOOK",
        BookingDateTime: "2026-07-25T01:00:00.000Z",
        ValueDateTime: "2026-07-25T01:00:00.000Z",
        TransactionInformation: "Monthly Savings Interest Credit",
        Amount: { Amount: "42.80", Currency: "GBP" },
        BankTransactionCode: { Code: "InterestCredit", SubCode: "SavingsInterest" },
        ProprietaryBankTransactionCode: { Code: "Interest", Issuer: "CoreBank" },
        Balance: { Type: "CLAV", Amount: { Amount: "14250.00", Currency: "GBP" }, CreditDebitIndicator: "Credit" },
        MerchantDetails: { MerchantName: "Banfico Savings Interest", MerchantCategoryCode: "6012" },
        CardInstrument: { CardSchemeName: "Internal Credit", AuthorisationType: "System" },
      },
      {
        TransactionId: "tx_s2",
        AccountId: id,
        TransactionReference: "Ref SV9920142",
        CreditDebitIndicator: "Credit",
        Status: "BOOK",
        BookingDateTime: "2026-07-01T10:00:00.000Z",
        ValueDateTime: "2026-07-01T10:00:00.000Z",
        TransactionInformation: "Payday Auto Savings Deposit",
        Amount: { Amount: "500.00", Currency: "GBP" },
        BankTransactionCode: { Code: "ReceivedCreditTransfer", SubCode: "DomesticCreditTransfer" },
        ProprietaryBankTransactionCode: { Code: "Transfer", Issuer: "CoreBank" },
        Balance: { Type: "CLAV", Amount: { Amount: "14207.20", Currency: "GBP" }, CreditDebitIndicator: "Credit" },
        MerchantDetails: { MerchantName: "Auto Savings Deposit", MerchantCategoryCode: "6012" },
        CardInstrument: { CardSchemeName: "Faster Payments", AuthorisationType: "Online" },
      },
    ];
  }

  if (id.includes("781")) {
    // Emergency transactions
    return [
      {
        TransactionId: "tx_e1",
        AccountId: id,
        TransactionReference: "Ref EM3310491",
        CreditDebitIndicator: "Debit",
        Status: "BOOK",
        BookingDateTime: "2026-07-20T11:45:00.000Z",
        ValueDateTime: "2026-07-20T11:45:00.000Z",
        TransactionInformation: "Auto Repair Emergency Service",
        Amount: { Amount: "320.00", Currency: "GBP" },
        BankTransactionCode: { Code: "IssuedCreditTransfer", SubCode: "AutomaticTransfer" },
        ProprietaryBankTransactionCode: { Code: "Transfer", Issuer: "CoreBank" },
        Balance: { Type: "CLAV", Amount: { Amount: "5600.00", Currency: "GBP" }, CreditDebitIndicator: "Credit" },
        MerchantDetails: { MerchantName: "Kwik Fit Auto Repair", MerchantCategoryCode: "7538" },
        CardInstrument: { CardSchemeName: "Visa Debit", AuthorisationType: "PIN" },
      },
    ];
  }

  if (id.includes("e4c")) {
    // Holiday Fund transactions
    return [
      {
        TransactionId: "tx_hf1",
        AccountId: id,
        TransactionReference: "Ref HF7710928",
        CreditDebitIndicator: "Debit",
        Status: "BOOK",
        BookingDateTime: "2026-07-22T16:30:00.000Z",
        ValueDateTime: "2026-07-22T16:30:00.000Z",
        TransactionInformation: "Flight Deposit Booking",
        Amount: { Amount: "450.00", Currency: "GBP" },
        BankTransactionCode: { Code: "MerchantPayment", SubCode: "CardPayment" },
        ProprietaryBankTransactionCode: { Code: "Purchase", Issuer: "CoreBank" },
        Balance: { Type: "CLAV", Amount: { Amount: "2100.80", Currency: "GBP" }, CreditDebitIndicator: "Credit" },
        MerchantDetails: { MerchantName: "British Airways", MerchantCategoryCode: "4511" },
        CardInstrument: { CardSchemeName: "MasterCard", AuthorisationType: "3D Secure" },
      },
    ];
  }

  if (id.includes("f8b")) {
    // Rainy Day transactions
    return [
      {
        TransactionId: "6a648145c47905bfc3f19f8b_1",
        AccountId: id,
        TransactionReference: "Ref RD275834783913",
        CreditDebitIndicator: "Credit",
        Status: "PDNG",
        BookingDateTime: "2026-07-25T09:26:29.438Z",
        ValueDateTime: "2026-07-25T09:26:29.438Z",
        TransactionInformation: "Monthly rent transfer",
        Amount: { Amount: "357.78", Currency: "GBP" },
        BankTransactionCode: { Code: "IssuedCreditTransfer", SubCode: "AutomaticTransfer" },
        ProprietaryBankTransactionCode: { Code: "Transfer", Issuer: "CoreBank" },
        Balance: { Type: "CLAV", Amount: { Amount: "4268.53", Currency: "GBP" }, CreditDebitIndicator: "Credit" },
        MerchantDetails: { MerchantName: "Hintz, Mitchell and Boehm", MerchantCategoryCode: "1711" },
        CardInstrument: { CardSchemeName: "MasterCard", AuthorisationType: "PIN" },
      },
    ];
  }

  // Default Bills transactions
  return [
    {
      TransactionId: "6a648145c47905bfc3f19f90",
      AccountId: id,
      TransactionReference: "Ref 514012092412",
      CreditDebitIndicator: "Debit",
      Status: "PDNG",
      BookingDateTime: "2026-07-25T06:55:38.237Z",
      ValueDateTime: "2026-07-25T06:55:38.237Z",
      TransactionInformation: "Paid the gas bill",
      Amount: { Amount: "284.58", Currency: "GBP" },
      BankTransactionCode: { Code: "IssuedCreditTransfer", SubCode: "AutomaticTransfer" },
      ProprietaryBankTransactionCode: { Code: "Transfer", Issuer: "CoreBank" },
      Balance: { Type: "CLAV", Amount: { Amount: "613.64", Currency: "GBP" }, CreditDebitIndicator: "Credit" },
      MerchantDetails: { MerchantName: "Lubowitz, Krajcik and Olson", MerchantCategoryCode: "1711" },
      CardInstrument: { CardSchemeName: "MasterCard", AuthorisationType: "PIN" },
    },
    {
      TransactionId: "6a648145c47905bfc3f19f91",
      AccountId: id,
      TransactionReference: "Ref 090920347150",
      CreditDebitIndicator: "Debit",
      Status: "PDNG",
      BookingDateTime: "2026-07-25T05:37:18.328Z",
      ValueDateTime: "2026-07-25T05:37:18.328Z",
      TransactionInformation: "Utility bill payment",
      Amount: { Amount: "449.99", Currency: "GBP" },
      BankTransactionCode: { Code: "IssuedCreditTransfer", SubCode: "AutomaticTransfer" },
      ProprietaryBankTransactionCode: { Code: "Transfer", Issuer: "CoreBank" },
      Balance: { Type: "CLAV", Amount: { Amount: "779.05", Currency: "GBP" }, CreditDebitIndicator: "Credit" },
      MerchantDetails: { MerchantName: "Shanahan LLC", MerchantCategoryCode: "1711" },
      CardInstrument: { CardSchemeName: "MasterCard", AuthorisationType: "PIN" },
    },
    {
      TransactionId: "6a648145c47905bfc3f19f92",
      AccountId: id,
      TransactionReference: "Ref 494352222219",
      CreditDebitIndicator: "Debit",
      Status: "PDNG",
      BookingDateTime: "2026-07-25T05:36:22.517Z",
      ValueDateTime: "2026-07-25T05:36:22.517Z",
      TransactionInformation: "Utility bill payment",
      Amount: { Amount: "436.39", Currency: "GBP" },
      BankTransactionCode: { Code: "IssuedCreditTransfer", SubCode: "AutomaticTransfer" },
      ProprietaryBankTransactionCode: { Code: "Transfer", Issuer: "CoreBank" },
      Balance: { Type: "CLAV", Amount: { Amount: "765.45", Currency: "GBP" }, CreditDebitIndicator: "Credit" },
      MerchantDetails: { MerchantName: "Stiedemann, Spinka and Nolan", MerchantCategoryCode: "1711" },
      CardInstrument: { CardSchemeName: "MasterCard", AuthorisationType: "PIN" },
    },
    {
      TransactionId: "6a648145c47905bfc3f19f93",
      AccountId: id,
      TransactionReference: "Ref 573095832327",
      CreditDebitIndicator: "Debit",
      Status: "PDNG",
      BookingDateTime: "2026-07-25T05:32:51.471Z",
      ValueDateTime: "2026-07-25T05:32:51.471Z",
      TransactionInformation: "Online subscription",
      Amount: { Amount: "342.90", Currency: "GBP" },
      BankTransactionCode: { Code: "IssuedCreditTransfer", SubCode: "AutomaticTransfer" },
      ProprietaryBankTransactionCode: { Code: "Transfer", Issuer: "CoreBank" },
      Balance: { Type: "CLAV", Amount: { Amount: "671.96", Currency: "GBP" }, CreditDebitIndicator: "Credit" },
      MerchantDetails: { MerchantName: "Schowalter Group", MerchantCategoryCode: "1711" },
      CardInstrument: { CardSchemeName: "MasterCard", AuthorisationType: "PIN" },
    },
    {
      TransactionId: "6a648145c47905bfc3f19f94",
      AccountId: id,
      TransactionReference: "Ref 611024897057",
      CreditDebitIndicator: "Debit",
      Status: "PDNG",
      BookingDateTime: "2026-07-24T09:30:55.667Z",
      ValueDateTime: "2026-07-24T09:30:55.667Z",
      TransactionInformation: "Monthly rent transfer",
      Amount: { Amount: "339.12", Currency: "GBP" },
      BankTransactionCode: { Code: "IssuedCreditTransfer", SubCode: "AutomaticTransfer" },
      ProprietaryBankTransactionCode: { Code: "Transfer", Issuer: "CoreBank" },
      Balance: { Type: "CLAV", Amount: { Amount: "668.18", Currency: "GBP" }, CreditDebitIndicator: "Credit" },
      MerchantDetails: { MerchantName: "Kuhlman Inc", MerchantCategoryCode: "1711" },
      CardInstrument: { CardSchemeName: "MasterCard", AuthorisationType: "PIN" },
    },
  ];
}

/* ---------------------------------------------------------------------------
   Required Mappers
--------------------------------------------------------------------------- */

export function mapAccount(a) {
  if (!a) return mapAccount(FALLBACK_ACCOUNTS_DATA[0]);
  const sub = a.Account?.[0] ?? {};
  return {
    accountId: a.AccountId,
    nickname: a.Nickname ?? "Account",
    description: a.Description ?? "",
    holder: sub.Name ?? a.Servicer?.Name ?? "Nivas Ganesan",
    currency: a.Currency ?? "GBP",
    category: a.AccountCategory ?? "Personal",
    typeCode: a.AccountTypeCode ?? "CACC",
    status: a.Status ?? "Enabled",
    openingDate: a.OpeningDate ?? "",
    identification: sub.Identification ?? "",
    servicer: a.Servicer?.Name ?? "",
  };
}

export function mapBalance(b) {
  if (!b) return mapBalance(getAccountBalanceFallback(""));
  const line = (t) => b.CreditLine?.find((c) => c.Type === t)?.Amount?.Amount;
  return {
    current: parseFloat(b.Amount?.Amount ?? 0),
    available: parseFloat(line("Available") ?? 0),
    preAgreed: parseFloat(line("Pre-Agreed") ?? 0),
    totalValue: parseFloat(b.TotalValue?.Amount ?? 0),
    local: { amount: parseFloat(b.LocalAmount?.Amount ?? 0), currency: b.LocalAmount?.Currency ?? "USD" },
    currency: b.Amount?.Currency ?? "GBP",
    asOf: b.DateTime ?? new Date().toISOString(),
  };
}

export function mapTx(t) {
  if (!t) return null;
  return {
    id: t.TransactionId,
    reference: t.TransactionReference ?? "",
    info: t.TransactionInformation ?? "",
    merchant: t.MerchantDetails?.MerchantName ?? t.TransactionInformation ?? "Unknown",
    mcc: t.MerchantDetails?.MerchantCategoryCode ?? "",
    amount: parseFloat(t.Amount?.Amount ?? 0),
    currency: t.Amount?.Currency ?? "GBP",
    date: t.BookingDateTime ?? new Date().toISOString(),
    valueDate: t.ValueDateTime ?? new Date().toISOString(),
    indicator: t.CreditDebitIndicator,            // "Debit" | "Credit"
    status: t.Status,                             // "PDNG" | "BOOK"
    balanceAfter: parseFloat(t.Balance?.Amount?.Amount ?? 0),
    card: t.CardInstrument?.CardSchemeName ?? "",
    auth: t.CardInstrument?.AuthorisationType ?? "",
    txnCode: `${t.BankTransactionCode?.Code ?? ""} / ${t.BankTransactionCode?.SubCode ?? ""}`,
    propCode: `${t.ProprietaryBankTransactionCode?.Code ?? ""} · ${t.ProprietaryBankTransactionCode?.Issuer ?? ""}`,
    purpose: t.PaymentPurposeCode ?? "",
  };
}

export function enrich(txArr) {
  return (txArr || []).filter(Boolean).map((t) => ({
    ...t,
    dir: t.indicator === "Credit" ? "in" : "out",
    cat: categorize(t.info || ""),
  }));
}

export const ACCOUNT = mapAccount(FALLBACK_ACCOUNTS_DATA[0]);
export const BALANCE = mapBalance(getAccountBalanceFallback(FALLBACK_ACCOUNTS_DATA[0].AccountId));
export const RAW_TX = enrich(getAccountTxFallback(FALLBACK_ACCOUNTS_DATA[0].AccountId).map(mapTx));

/* ---------------------------------------------------------------------------
   Formatters & Derivations
--------------------------------------------------------------------------- */

const GBP = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
const USD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function money(n) {
  return GBP.format(n || 0);
}
export function moneyUSD(n) {
  return USD.format(n || 0);
}
export function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
export function fmtDateFull(iso) {
  return new Date(iso).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
export function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
export function maskAccount(id = "") {
  if (!id || id.length < 6) return { sort: "68-13-07", last: id ? id.slice(-4) : "7936" };
  return { sort: `${id.slice(0, 2)}-${id.slice(2, 4)}-${id.slice(4, 6)}`, last: id.slice(-4) };
}

export function categorize(info = "") {
  const s = info.toLowerCase();
  if (s.includes("gas") || s.includes("utility")) return "Utilities";
  if (s.includes("subscription")) return "Subscriptions";
  if (s.includes("rent")) return "Housing";
  if (s.includes("grocery") || s.includes("groceries") || s.includes("supermarket")) return "Groceries";
  if (s.includes("cash from") || s.includes("salary") || s.includes("payroll") || s.includes("refund") || s.includes("interest") || s.includes("deposit")) return "Income";
  return "Other";
}

export function getTransactions() {
  return enrich(getAccountTxFallback(FALLBACK_ACCOUNTS_DATA[0].AccountId).map(mapTx));
}

export function sumBy(list, predicate) {
  return (list || []).filter(predicate).reduce((s, t) => s + t.amount, 0);
}

export function byCategory(list = []) {
  const map = {};
  list.forEach((t) => {
    const c = t.cat || categorize(t.info);
    map[c] = map[c] || { name: c, total: 0, count: 0 };
    map[c].total += t.amount;
    map[c].count += 1;
  });
  const total = list.reduce((s, t) => s + t.amount, 0) || 1;
  return Object.values(map)
    .map((c) => ({ ...c, pct: Math.round((c.total / total) * 100) }))
    .sort((a, b) => b.total - a.total);
}

export function byDay(list = []) {
  const map = {};
  list.forEach((t) => {
    const key = (t.date || "").slice(0, 10);
    if (key) map[key] = (map[key] || 0) + t.amount;
  });
  return Object.entries(map)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

export function byMerchant(list = []) {
  const map = {};
  list.forEach((t) => {
    const m = t.merchant || "Unknown";
    map[m] = map[m] || { name: m, total: 0, count: 0, cat: t.cat };
    map[m].total += t.amount;
    map[m].count += 1;
  });
  return Object.values(map).sort((a, b) => b.total - a.total);
}