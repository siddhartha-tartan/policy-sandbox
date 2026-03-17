import { LAP_DB } from "../../../mock/lapDatabase";

export type NudgePriority = "high" | "medium" | "low";
export type NudgeCategory = "risk" | "operations" | "growth" | "collections";

export interface Nudge {
  id: string;
  title: string;
  description: string;
  priority: NudgePriority;
  category: NudgeCategory;
  metric?: string;
  query: string;
  sql_query: string;
}

function fmt(n: number): string {
  return n.toLocaleString("en-IN");
}

function pct(n: number, total: number): string {
  return ((n / total) * 100).toFixed(1);
}

export function generateNudges(): Nudge[] {
  const nudges: Nudge[] = [];
  const totalLoans = LAP_DB.loans.length;

  // ── NPA rate check ──
  const npaLoans = LAP_DB.loans.filter((l) => l.loan_status === "NPA");
  const npaRate = (npaLoans.length / totalLoans) * 100;
  if (npaRate > 3) {
    nudges.push({
      id: "npa-rate",
      title: "NPA Rate Above Threshold",
      description: `${npaLoans.length} loans (${npaRate.toFixed(1)}%) are classified NPA — above the 3% internal threshold. Total NPA exposure is ₹${fmt(npaLoans.reduce((s, l) => s + l.sanctioned_amount, 0))}.`,
      priority: npaRate > 6 ? "high" : "medium",
      category: "risk",
      metric: `${npaRate.toFixed(1)}%`,
      query: "Show NPA analysis and asset quality breakdown",
      sql_query: `SELECT l.loan_status,\n       COUNT(*) AS loan_count,\n       SUM(l.sanctioned_amount) AS total_exposure,\n       ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM loans), 1) AS pct\nFROM loans l\nWHERE l.loan_status = 'NPA'\nGROUP BY l.loan_status;`,
    });
  }

  // ── EMI bounce rate ──
  const recentEmis = LAP_DB.emi_schedule.filter((e) => {
    const d = new Date(e.due_date);
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 3);
    return d >= cutoff;
  });
  const bounced = recentEmis.filter((e) => e.status === "Bounced");
  const bounceRate = recentEmis.length > 0 ? (bounced.length / recentEmis.length) * 100 : 0;
  if (bounceRate > 5) {
    nudges.push({
      id: "bounce-rate",
      title: "High EMI Bounce Rate",
      description: `${bounced.length} EMIs bounced in the last 3 months out of ${fmt(recentEmis.length)} due — a ${bounceRate.toFixed(1)}% bounce rate. This could indicate deteriorating borrower repayment capacity.`,
      priority: bounceRate > 10 ? "high" : "medium",
      category: "collections",
      metric: `${bounceRate.toFixed(1)}%`,
      query: "Plot EMI collection vs overdue month on month",
      sql_query: `SELECT DATE_FORMAT(e.due_date, '%Y-%m') AS month,\n       e.status,\n       COUNT(*) AS emi_count,\n       SUM(e.emi_amount) AS total_amount\nFROM emi_schedule e\nWHERE e.due_date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)\nGROUP BY month, e.status\nORDER BY month;`,
    });
  }

  // ── Overdue EMIs without collection action ──
  const overdueLoans = new Set(
    LAP_DB.emi_schedule.filter((e) => e.status === "Overdue" || e.status === "Bounced").map((e) => e.loan_id)
  );
  const collectionLoans = new Set(LAP_DB.collections.map((c) => c.loan_id));
  const unactioned = [...overdueLoans].filter((id) => !collectionLoans.has(id));
  if (unactioned.length > 0) {
    nudges.push({
      id: "unactioned-overdue",
      title: "Overdue Loans Without Follow-up",
      description: `${unactioned.length} loans have overdue or bounced EMIs but no collection action recorded. These accounts need immediate attention to prevent slippage into NPA.`,
      priority: unactioned.length > 20 ? "high" : "medium",
      category: "collections",
      metric: `${unactioned.length} loans`,
      query: "Show collection actions summary",
      sql_query: `SELECT l.loan_id, c.full_name, l.sanctioned_amount,\n       l.loan_status, e.due_date, e.status AS emi_status\nFROM loans l\nJOIN customers c ON l.customer_id = c.customer_id\nJOIN emi_schedule e ON l.loan_id = e.loan_id\nLEFT JOIN collections col ON l.loan_id = col.loan_id\nWHERE e.status IN ('Overdue', 'Bounced')\n  AND col.loan_id IS NULL\nGROUP BY l.loan_id;`,
    });
  }

  // ── Application rejection rate ──
  const totalApps = LAP_DB.loan_applications.length;
  const rejected = LAP_DB.loan_applications.filter((a) => a.status === "Rejected").length;
  const rejectionRate = (rejected / totalApps) * 100;
  if (rejectionRate > 25) {
    nudges.push({
      id: "rejection-rate",
      title: "High Application Rejection Rate",
      description: `${pct(rejected, totalApps)}% of applications (${rejected} out of ${fmt(totalApps)}) were rejected. A high rejection rate may indicate poor lead quality or overly strict underwriting criteria.`,
      priority: "medium",
      category: "operations",
      metric: `${rejectionRate.toFixed(0)}%`,
      query: "What are the top reasons for application rejection?",
      sql_query: `SELECT la.status,\n       COUNT(*) AS count,\n       ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM loan_applications), 1) AS pct\nFROM loan_applications la\nGROUP BY la.status\nORDER BY count DESC;`,
    });
  }

  // ── Branch with worst conversion ──
  const branchStats: Record<string, { name: string; apps: number; loans: number }> = {};
  LAP_DB.branches.forEach((b) => {
    branchStats[b.branch_id] = { name: b.branch_name.replace("Godrej Capital - ", ""), apps: 0, loans: 0 };
  });
  LAP_DB.loan_applications.forEach((a) => {
    if (branchStats[a.branch_id]) branchStats[a.branch_id].apps++;
  });
  LAP_DB.loans.forEach((l) => {
    const app = LAP_DB.loan_applications.find((a) => a.application_id === l.application_id);
    if (app && branchStats[app.branch_id]) branchStats[app.branch_id].loans++;
  });
  const branchArr = Object.values(branchStats).filter((b) => b.apps > 10);
  const worstBranch = branchArr.sort((a, b) => (a.loans / a.apps) - (b.loans / b.apps))[0];
  if (worstBranch && (worstBranch.loans / worstBranch.apps) < 0.35) {
    const conv = ((worstBranch.loans / worstBranch.apps) * 100).toFixed(1);
    nudges.push({
      id: "worst-branch",
      title: `Low Conversion at ${worstBranch.name}`,
      description: `${worstBranch.name} has the lowest conversion rate at ${conv}% — only ${worstBranch.loans} disbursed out of ${worstBranch.apps} applications. Consider reviewing lead sourcing or underwriting processes at this branch.`,
      priority: "medium",
      category: "operations",
      metric: `${conv}%`,
      query: "Show branch wise performance",
      sql_query: `SELECT b.branch_name,\n       COUNT(DISTINCT la.application_id) AS applications,\n       COUNT(DISTINCT l.loan_id) AS disbursed,\n       ROUND(COUNT(DISTINCT l.loan_id) * 100.0 /\n             NULLIF(COUNT(DISTINCT la.application_id), 0), 1) AS conversion_pct\nFROM branches b\nJOIN loan_applications la ON b.branch_id = la.branch_id\nLEFT JOIN loans l ON la.application_id = l.application_id\nGROUP BY b.branch_id, b.branch_name\nHAVING COUNT(DISTINCT la.application_id) > 10\nORDER BY conversion_pct ASC\nLIMIT 5;`,
    });
  }

  // ── High LTV concentration ──
  const highLtv = LAP_DB.loans.filter((l) => l.ltv_ratio > 0.70);
  const highLtvPct = (highLtv.length / totalLoans) * 100;
  if (highLtvPct > 10) {
    nudges.push({
      id: "high-ltv",
      title: "High LTV Concentration Risk",
      description: `${highLtv.length} loans (${highLtvPct.toFixed(1)}%) have LTV above 70%. High LTV loans carry greater risk in case of property price corrections. Total exposure: ₹${fmt(highLtv.reduce((s, l) => s + l.sanctioned_amount, 0))}.`,
      priority: highLtvPct > 20 ? "high" : "medium",
      category: "risk",
      metric: `${highLtvPct.toFixed(0)}%`,
      query: "Show LTV ratio distribution",
      sql_query: `SELECT\n  CASE\n    WHEN ltv_ratio > 0.80 THEN '>80%'\n    WHEN ltv_ratio > 0.70 THEN '70-80%'\n    WHEN ltv_ratio > 0.60 THEN '60-70%'\n    ELSE '≤60%'\n  END AS ltv_band,\n  COUNT(*) AS loan_count,\n  SUM(sanctioned_amount) AS total_exposure\nFROM loans\nGROUP BY ltv_band\nORDER BY MIN(ltv_ratio) DESC;`,
    });
  }

  // ── Low CIBIL score approvals ──
  const lowCibil = LAP_DB.credit_bureau_reports.filter((c) => c.score < 650);
  const lowCibilApproved = lowCibil.filter((c) => {
    const app = LAP_DB.loan_applications.find((a) => a.customer_id === c.customer_id);
    return app && ["Approved", "Disbursed"].includes(app.status);
  });
  if (lowCibilApproved.length > 10) {
    nudges.push({
      id: "low-cibil-approvals",
      title: "Approvals with Low Credit Scores",
      description: `${lowCibilApproved.length} loans were approved for customers with CIBIL score below 650. These borrowers have a higher probability of default and may need enhanced monitoring.`,
      priority: "medium",
      category: "risk",
      metric: `${lowCibilApproved.length} loans`,
      query: "Show CIBIL score distribution",
      sql_query: `SELECT cb.score AS cibil_score, c.full_name,\n       la.status AS application_status, l.sanctioned_amount\nFROM credit_bureau_reports cb\nJOIN customers c ON cb.customer_id = c.customer_id\nJOIN loan_applications la ON c.customer_id = la.customer_id\nLEFT JOIN loans l ON la.application_id = l.application_id\nWHERE cb.score < 650\n  AND la.status IN ('Approved', 'Disbursed')\nORDER BY cb.score ASC;`,
    });
  }

  // ── Disbursement growth trend ──
  const months = new Map<string, number>();
  LAP_DB.disbursements.forEach((d) => {
    const key = d.disbursement_date.substring(0, 7);
    months.set(key, (months.get(key) || 0) + d.amount);
  });
  const sortedMonths = [...months.entries()].sort(([a], [b]) => a.localeCompare(b));
  if (sortedMonths.length >= 6) {
    const recent3 = sortedMonths.slice(-3).reduce((s, [, v]) => s + v, 0) / 3;
    const prev3 = sortedMonths.slice(-6, -3).reduce((s, [, v]) => s + v, 0) / 3;
    const growth = ((recent3 - prev3) / prev3) * 100;
    if (growth > 15) {
      nudges.push({
        id: "disbursement-growth",
        title: "Disbursement Volume Trending Up",
        description: `Average monthly disbursements grew ${growth.toFixed(0)}% in the last quarter compared to the prior quarter. Strong momentum — ensure credit quality isn't being compromised for volume.`,
        priority: "low",
        category: "growth",
        metric: `+${growth.toFixed(0)}%`,
        query: "Show monthly disbursement trend as a chart",
        sql_query: `SELECT DATE_FORMAT(d.disbursement_date, '%Y-%m') AS month,\n       COUNT(*) AS disbursement_count,\n       SUM(d.amount) AS total_amount,\n       ROUND(AVG(d.amount), 0) AS avg_ticket\nFROM disbursements d\nGROUP BY month\nORDER BY month DESC\nLIMIT 6;`,
      });
    } else if (growth < -15) {
      nudges.push({
        id: "disbursement-decline",
        title: "Disbursement Volume Declining",
        description: `Average monthly disbursements dropped ${Math.abs(growth).toFixed(0)}% in the last quarter. This could indicate pipeline issues, stricter underwriting, or market slowdown.`,
        priority: "medium",
        category: "growth",
        metric: `${growth.toFixed(0)}%`,
        query: "Show monthly disbursement trend as a chart",
        sql_query: `SELECT DATE_FORMAT(d.disbursement_date, '%Y-%m') AS month,\n       COUNT(*) AS disbursement_count,\n       SUM(d.amount) AS total_amount,\n       ROUND(AVG(d.amount), 0) AS avg_ticket\nFROM disbursements d\nGROUP BY month\nORDER BY month DESC\nLIMIT 6;`,
      });
    }
  }

  // ── Single city concentration ──
  const cityLoans: Record<string, number> = {};
  LAP_DB.loans.forEach((l) => {
    const cust = LAP_DB.customers.find((c) => c.customer_id === l.customer_id);
    if (cust) cityLoans[cust.city] = (cityLoans[cust.city] || 0) + l.sanctioned_amount;
  });
  const totalSanctioned = Object.values(cityLoans).reduce((a, b) => a + b, 0);
  const topCity = Object.entries(cityLoans).sort(([, a], [, b]) => b - a)[0];
  if (topCity) {
    const concentration = (topCity[1] / totalSanctioned) * 100;
    if (concentration > 25) {
      nudges.push({
        id: "geo-concentration",
        title: `Portfolio Concentrated in ${topCity[0]}`,
        description: `${concentration.toFixed(0)}% of sanctioned value is concentrated in ${topCity[0]}. Geographic concentration increases exposure to localized economic downturns or property market corrections.`,
        priority: "low",
        category: "risk",
        metric: `${concentration.toFixed(0)}%`,
        query: "Show city wise loan portfolio",
        sql_query: `SELECT c.city,\n       COUNT(l.loan_id) AS loan_count,\n       SUM(l.sanctioned_amount) AS total_sanctioned,\n       ROUND(SUM(l.sanctioned_amount) * 100.0 /\n             (SELECT SUM(sanctioned_amount) FROM loans), 1) AS concentration_pct\nFROM loans l\nJOIN customers c ON l.customer_id = c.customer_id\nGROUP BY c.city\nORDER BY total_sanctioned DESC;`,
      });
    }
  }

  return nudges.sort((a, b) => {
    const order: Record<NudgePriority, number> = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });
}
