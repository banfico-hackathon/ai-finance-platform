// bankingData.js — single source of truth for account, balance, and transaction mock data (OBIE-shaped) plus derivation helpers
// Direction is now driven by CreditDebitIndicator: outgoing bills are "Debit", incoming money is "Credit".

export const ACCOUNT = {
  accountId: "6a62009ac47905bfc3f196cd",
  nickname: "Bills",
  description: "For paying bills",
  holder: "Nivas Ganesan",
  currency: "GBP",
  category: "Personal",
  typeCode: "CACC", // current account
  status: "Enabled",
  openingDate: "2002-01-05",
  identification: "68130781747936", // sort code (6) + account number (8)
  servicer: "ServicerName",
};

export const BALANCE = {
  current: 329.06, // CLAV
  available: 401.0, // credit line "Available"
  preAgreed: 501.0, // credit line "Pre-Agreed"
  totalValue: 720.39,
  local: { amount: 400.0, currency: "USD" },
  currency: "GBP",
  asOf: "2026-07-25T06:55:38.237Z",
};

// CreditDebitIndicator corrected to reflect the real money flow.
export const RAW_TX = [
  { id: "…19cb8", reference: "Ref 514012092412", info: "Paid the gas bill", merchant: "Lubowitz, Krajcik and Olson", mcc: "1711", amount: 284.58, currency: "GBP", date: "2026-07-25T06:55:38.237Z", valueDate: "2026-07-25T06:55:38.237Z", indicator: "Debit", status: "PDNG", balanceAfter: 613.64, card: "MasterCard", auth: "PIN", txnCode: "IssuedCreditTransfer / AutomaticTransfer", propCode: "Transfer · CoreBank", purpose: "CASH" },
  { id: "…19855", reference: "Ref 090920347150", info: "Utility bill payment", merchant: "Shanahan LLC", mcc: "1711", amount: 449.99, currency: "GBP", date: "2026-07-25T05:37:18.328Z", valueDate: "2026-07-25T05:37:18.328Z", indicator: "Debit", status: "PDNG", balanceAfter: 779.05, card: "MasterCard", auth: "PIN", txnCode: "IssuedCreditTransfer / AutomaticTransfer", propCode: "Transfer · CoreBank", purpose: "CASH" },
  { id: "…19854", reference: "Ref 494352222219", info: "Utility bill payment", merchant: "Stiedemann, Spinka and Nolan", mcc: "1711", amount: 436.39, currency: "GBP", date: "2026-07-25T05:36:22.517Z", valueDate: "2026-07-25T05:36:22.517Z", indicator: "Debit", status: "PDNG", balanceAfter: 765.45, card: "MasterCard", auth: "PIN", txnCode: "IssuedCreditTransfer / AutomaticTransfer", propCode: "Transfer · CoreBank", purpose: "CASH" },
  { id: "…19848", reference: "Ref 573095832327", info: "Online subscription", merchant: "Schowalter Group", mcc: "1711", amount: 342.9, currency: "GBP", date: "2026-07-25T05:32:51.471Z", valueDate: "2026-07-25T05:32:51.471Z", indicator: "Debit", status: "PDNG", balanceAfter: 671.96, card: "MasterCard", auth: "PIN", txnCode: "IssuedCreditTransfer / AutomaticTransfer", propCode: "Transfer · CoreBank", purpose: "CASH" },
  { id: "…19786", reference: "Ref 611024897057", info: "Monthly rent transfer", merchant: "Kuhlman Inc", mcc: "1711", amount: 339.12, currency: "GBP", date: "2026-07-24T09:30:55.667Z", valueDate: "2026-07-24T09:30:55.667Z", indicator: "Debit", status: "PDNG", balanceAfter: 668.18, card: "MasterCard", auth: "PIN", txnCode: "IssuedCreditTransfer / AutomaticTransfer", propCode: "Transfer · CoreBank", purpose: "CASH" },
  { id: "…19780", reference: "Ref 306371566574", info: "Paid the gas bill", merchant: "Hansen, Kshlerin and Koelpin", mcc: "1711", amount: 387.98, currency: "GBP", date: "2026-07-24T06:14:10.537Z", valueDate: "2026-07-24T06:14:10.537Z", indicator: "Debit", status: "PDNG", balanceAfter: 717.04, card: "MasterCard", auth: "PIN", txnCode: "IssuedCreditTransfer / AutomaticTransfer", propCode: "Transfer · CoreBank", purpose: "CASH" },
  { id: "…1977a", reference: "Ref 368994284904", info: "Utility bill payment", merchant: "Baumbach, Anderson and Kiehn", mcc: "1711", amount: 140.78, currency: "GBP", date: "2026-07-23T12:41:33.096Z", valueDate: "2026-07-23T12:41:33.096Z", indicator: "Debit", status: "PDNG", balanceAfter: 469.84, card: "MasterCard", auth: "PIN", txnCode: "IssuedCreditTransfer / AutomaticTransfer", propCode: "Transfer · CoreBank", purpose: "CASH" },
  { id: "…19779", reference: "Ref 055362407406", info: "Grocery shopping", merchant: "Schiller - Larkin", mcc: "1711", amount: 415.11, currency: "GBP", date: "2026-07-23T12:41:32.591Z", valueDate: "2026-07-23T12:41:32.591Z", indicator: "Debit", status: "PDNG", balanceAfter: 744.17, card: "MasterCard", auth: "PIN", txnCode: "IssuedCreditTransfer / AutomaticTransfer", propCode: "Transfer · CoreBank", purpose: "CASH" },
  { id: "…19778", reference: "Ref 448862676998", info: "Monthly rent transfer", merchant: "Stokes Inc", mcc: "1711", amount: 327.42, currency: "GBP", date: "2026-07-23T12:41:32.092Z", valueDate: "2026-07-23T12:41:32.092Z", indicator: "Debit", status: "PDNG", balanceAfter: 656.48, card: "MasterCard", auth: "PIN", txnCode: "IssuedCreditTransfer / AutomaticTransfer", propCode: "Transfer · CoreBank", purpose: "CASH" },
  { id: "…19777", reference: "Ref 332529325012", info: "Online subscription", merchant: "Jacobs, Donnelly and Wilderman", mcc: "1711", amount: 142.43, currency: "GBP", date: "2026-07-23T12:41:31.593Z", valueDate: "2026-07-23T12:41:31.593Z", indicator: "Debit", status: "PDNG", balanceAfter: 471.49, card: "MasterCard", auth: "PIN", txnCode: "IssuedCreditTransfer / AutomaticTransfer", propCode: "Transfer · CoreBank", purpose: "CASH" },
  { id: "…19776", reference: "Ref 328681292410", info: "Online subscription", merchant: "Braun, Lesch and Langworth", mcc: "1711", amount: 430.44, currency: "GBP", date: "2026-07-23T12:41:30.307Z", valueDate: "2026-07-23T12:41:30.307Z", indicator: "Debit", status: "PDNG", balanceAfter: 759.5, card: "MasterCard", auth: "PIN", txnCode: "IssuedCreditTransfer / AutomaticTransfer", propCode: "Transfer · CoreBank", purpose: "CASH" },
  { id: "…19775", reference: "Ref 782201304208", info: "Paid the gas bill", merchant: "Wolff - Murphy", mcc: "1711", amount: 57.44, currency: "GBP", date: "2026-07-23T12:32:09.323Z", valueDate: "2026-07-23T12:32:09.323Z", indicator: "Debit", status: "PDNG", balanceAfter: 386.5, card: "MasterCard", auth: "PIN", txnCode: "IssuedCreditTransfer / AutomaticTransfer", propCode: "Transfer · CoreBank", purpose: "CASH" },
  { id: "…196d2", reference: "Ref 2", info: "Cash from Aubrey", merchant: "Aubrey", mcc: "5874", amount: 20.0, currency: "GBP", date: "2017-04-05T10:43:07.000Z", valueDate: "2017-04-05T10:45:22.000Z", indicator: "Credit", status: "BOOK", balanceAfter: 230.0, card: "VISA", auth: "Contactless", txnCode: "ReceivedCreditTransfer / DomesticCreditTransfer", propCode: "Transfer · AlphaBank", purpose: "RETL" },
];

/* ---------------- formatters ---------------- */
const GBP = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
const USD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function money(n) {
  return GBP.format(n);
}
export function moneyUSD(n) {
  return USD.format(n);
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
export function maskAccount(id) {
  return { sort: `${id.slice(0, 2)}-${id.slice(2, 4)}-${id.slice(4, 6)}`, last: id.slice(-4) };
}

/* ---------------- classification (description-based; MCC is uniform 1711 in this data) ---------------- */
export function categorize(info) {
  const s = info.toLowerCase();
  if (s.includes("gas") || s.includes("utility")) return "Utilities";
  if (s.includes("subscription")) return "Subscriptions";
  if (s.includes("rent")) return "Housing";
  if (s.includes("grocery") || s.includes("groceries")) return "Groceries";
  if (s.includes("cash from") || s.includes("salary") || s.includes("payroll") || s.includes("refund")) return "Income";
  return "Other";
}

/* ---------------- enriched list (single rule used by every page) ---------------- */
export function getTransactions() {
  return RAW_TX.map((t) => ({
    ...t,
    dir: t.indicator === "Credit" ? "in" : "out",
    cat: categorize(t.info),
  }));
}

export function sumBy(list, predicate) {
  return list.filter(predicate).reduce((s, t) => s + t.amount, 0);
}

export function byCategory(list) {
  const map = {};
  list.forEach((t) => {
    map[t.cat] = map[t.cat] || { name: t.cat, total: 0, count: 0 };
    map[t.cat].total += t.amount;
    map[t.cat].count += 1;
  });
  const total = list.reduce((s, t) => s + t.amount, 0) || 1;
  return Object.values(map)
    .map((c) => ({ ...c, pct: Math.round((c.total / total) * 100) }))
    .sort((a, b) => b.total - a.total);
}

export function byDay(list) {
  const map = {};
  list.forEach((t) => {
    const key = t.date.slice(0, 10);
    map[key] = (map[key] || 0) + t.amount;
  });
  return Object.entries(map)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

export function byMerchant(list) {
  const map = {};
  list.forEach((t) => {
    map[t.merchant] = map[t.merchant] || { name: t.merchant, total: 0, count: 0, cat: t.cat };
    map[t.merchant].total += t.amount;
    map[t.merchant].count += 1;
  });
  return Object.values(map).sort((a, b) => b.total - a.total);
}