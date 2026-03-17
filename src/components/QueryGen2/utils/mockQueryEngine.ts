/**
 * Mock Query Engine for LAP Database
 *
 * Pattern-matches natural language queries to return relevant SQL and results
 * from the generated LAP database. Used for demo purposes.
 */

import { LAP_DB } from "../../../mock/lapDatabase";
import { ChartConfig } from "./atom";

export interface QueryResult {
  /** Conversational reply shown in the chat bubble */
  message: string;
  /** Short title used as header in chart / result panels */
  title: string;
  sql_query: string;
  /** Result in Pandas DataFrame format: { column: { rowIndex: value } } */
  result: Record<string, Record<string, unknown>>;
  insights?: string;
  chart_config?: ChartConfig;
}

function toPandasFormat(rows: Record<string, unknown>[]): Record<string, Record<string, unknown>> {
  if (rows.length === 0) return {};
  const columns = Object.keys(rows[0]);
  const df: Record<string, Record<string, unknown>> = {};
  columns.forEach((col) => {
    df[col] = {};
    rows.forEach((row, idx) => {
      df[col][String(idx)] = row[col];
    });
  });
  return df;
}

type QueryMatcher = {
  patterns: RegExp[];
  handler: (query: string) => QueryResult;
};

const matchers: QueryMatcher[] = [
  // ─── Disbursement trends ───
  {
    patterns: [
      /disburs.*month/i, /monthly.*disburs/i, /disbursement.*trend/i,
      /total.*loans.*disbursed.*month/i, /month.*wise.*disburs/i,
    ],
    handler: () => {
      const monthly: Record<string, { count: number; amount: number }> = {};
      LAP_DB.disbursements.forEach((d) => {
        const key = d.disbursement_date.substring(0, 7);
        if (!monthly[key]) monthly[key] = { count: 0, amount: 0 };
        monthly[key].count++;
        monthly[key].amount += d.amount;
      });
      const rows = Object.entries(monthly)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, data]) => ({
          month,
          disbursement_count: data.count,
          total_amount: data.amount,
          avg_ticket_size: Math.round(data.amount / data.count),
        }));

      return {
        message: "Here's the month-wise disbursement data. Each row shows the number of disbursements, total amount disbursed, and average ticket size for that month.",
        title: "Monthly Disbursement Trend",
        sql_query: `SELECT
  DATE_FORMAT(disbursement_date, '%Y-%m') AS month,
  COUNT(*) AS disbursement_count,
  SUM(amount) AS total_amount,
  ROUND(AVG(amount)) AS avg_ticket_size
FROM disbursements
GROUP BY DATE_FORMAT(disbursement_date, '%Y-%m')
ORDER BY month;`,
        result: toPandasFormat(rows),
        chart_config: { type: "bar", title: "Monthly Disbursement Volume", x_axis: "month", y_axis: "total_amount", y_axis_secondary: "disbursement_count" },
      };
    },
  },

  // ─── Loan amount by city ───
  {
    patterns: [
      /loan.*amount.*city/i, /city.*wise.*loan/i, /city.*portfolio/i,
      /loans.*by.*city/i, /city.*distribution/i, /geography.*loan/i, /region.*loan/i,
    ],
    handler: () => {
      const byCity: Record<string, { count: number; amount: number }> = {};
      LAP_DB.loans.forEach((l) => {
        const cust = LAP_DB.customers.find((c) => c.customer_id === l.customer_id);
        if (!cust) return;
        if (!byCity[cust.city]) byCity[cust.city] = { count: 0, amount: 0 };
        byCity[cust.city].count++;
        byCity[cust.city].amount += l.sanctioned_amount;
      });
      const rows = Object.entries(byCity)
        .sort(([, a], [, b]) => b.amount - a.amount)
        .map(([city, data]) => ({
          city,
          loan_count: data.count,
          total_sanctioned: data.amount,
          avg_loan_amount: Math.round(data.amount / data.count),
        }));

      return {
        message: "Here's the city-wise loan portfolio. Each row shows the loan count, total sanctioned amount, and average loan amount for that city, sorted by highest volume first.",
        title: "City-wise Loan Portfolio",
        sql_query: `SELECT
  c.city,
  COUNT(l.loan_id) AS loan_count,
  SUM(l.sanctioned_amount) AS total_sanctioned,
  ROUND(AVG(l.sanctioned_amount)) AS avg_loan_amount
FROM loans l
JOIN customers c ON l.customer_id = c.customer_id
GROUP BY c.city
ORDER BY total_sanctioned DESC;`,
        result: toPandasFormat(rows),
        chart_config: { type: "horizontal_bar", title: "Portfolio by City", x_axis: "city", y_axis: "total_sanctioned" },
      };
    },
  },

  // ─── NPA analysis ───
  {
    patterns: [
      /npa/i, /non.performing/i, /default.*loan/i, /bad.*loan/i,
      /overdue.*loan/i, /delinquen/i, /stressed.*asset/i,
    ],
    handler: () => {
      const statusCounts: Record<string, { count: number; amount: number }> = {};
      LAP_DB.loans.forEach((l) => {
        if (!statusCounts[l.loan_status]) statusCounts[l.loan_status] = { count: 0, amount: 0 };
        statusCounts[l.loan_status].count++;
        statusCounts[l.loan_status].amount += l.sanctioned_amount;
      });

      const totalLoans = LAP_DB.loans.length;
      const rows = Object.entries(statusCounts)
        .sort(([, a], [, b]) => b.count - a.count)
        .map(([status, data]) => ({
          loan_status: status,
          loan_count: data.count,
          total_exposure: data.amount,
          percentage: `${((data.count / totalLoans) * 100).toFixed(1)}%`,
        }));

      return {
        message: "Here's the loan portfolio broken down by status. Each row shows the loan count, total exposure, and percentage share for that status category.",
        title: "NPA & Asset Quality",
        sql_query: `SELECT
  loan_status,
  COUNT(*) AS loan_count,
  SUM(sanctioned_amount) AS total_exposure,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM loans), 1) || '%' AS percentage
FROM loans
GROUP BY loan_status
ORDER BY loan_count DESC;`,
        result: toPandasFormat(rows),
        chart_config: { type: "pie", title: "Loan Status Breakdown", x_axis: "loan_status", y_axis: "loan_count" },
      };
    },
  },

  // ─── Average loan amount by product/property type ───
  {
    patterns: [
      /average.*loan.*amount/i, /avg.*loan/i, /loan.*product/i,
      /ticket.*size/i, /loan.*property.*type/i,
    ],
    handler: () => {
      const byType: Record<string, { count: number; amount: number; rates: number[] }> = {};
      LAP_DB.loans.forEach((l) => {
        const app = LAP_DB.loan_applications.find((a) => a.application_id === l.application_id);
        const prop = app ? LAP_DB.properties.find((p) => p.property_id === app.property_id) : null;
        const key = prop ? `${prop.property_type} - ${prop.property_sub_type}` : "Unknown";
        if (!byType[key]) byType[key] = { count: 0, amount: 0, rates: [] };
        byType[key].count++;
        byType[key].amount += l.sanctioned_amount;
        byType[key].rates.push(l.interest_rate);
      });
      const rows = Object.entries(byType)
        .sort(([, a], [, b]) => b.count - a.count)
        .map(([type, data]) => ({
          property_category: type,
          loan_count: data.count,
          avg_sanctioned_amount: Math.round(data.amount / data.count),
          total_sanctioned: data.amount,
          avg_interest_rate: (data.rates.reduce((a, b) => a + b, 0) / data.rates.length).toFixed(2) + "%",
        }));

      return {
        message: "Here's the average loan amount by property category. Each row shows loan count, average and total sanctioned amounts, and the average interest rate for that property type.",
        title: "Avg Loan by Property Type",
        sql_query: `SELECT
  CONCAT(p.property_type, ' - ', p.property_sub_type) AS property_category,
  COUNT(l.loan_id) AS loan_count,
  ROUND(AVG(l.sanctioned_amount)) AS avg_sanctioned_amount,
  SUM(l.sanctioned_amount) AS total_sanctioned,
  CONCAT(ROUND(AVG(l.interest_rate), 2), '%') AS avg_interest_rate
FROM loans l
JOIN loan_applications la ON l.application_id = la.application_id
JOIN properties p ON la.property_id = p.property_id
GROUP BY p.property_type, p.property_sub_type
ORDER BY loan_count DESC;`,
        result: toPandasFormat(rows),
        chart_config: { type: "bar", title: "Avg Loan Amount by Property Type", x_axis: "property_category", y_axis: "avg_sanctioned_amount" },
      };
    },
  },

  // ─── Application approval/rejection rates ───
  {
    patterns: [
      /approv.*reject/i, /reject.*approv/i, /application.*status/i,
      /approval.*rate/i, /rejection.*rate/i, /conversion.*rate/i,
      /funnel/i, /application.*funnel/i,
    ],
    handler: () => {
      const statusCounts: Record<string, number> = {};
      LAP_DB.loan_applications.forEach((a) => {
        statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
      });
      const total = LAP_DB.loan_applications.length;
      const rows = Object.entries(statusCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([status, count]) => ({
          status,
          application_count: count,
          percentage: `${((count / total) * 100).toFixed(1)}%`,
        }));

      return {
        message: "Here's the application status breakdown. Each row shows the count and percentage share for each application stage.",
        title: "Application Funnel",
        sql_query: `SELECT
  status,
  COUNT(*) AS application_count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM loan_applications), 1) || '%' AS percentage
FROM loan_applications
GROUP BY status
ORDER BY application_count DESC;`,
        result: toPandasFormat(rows),
        chart_config: { type: "pie", title: "Application Funnel", x_axis: "status", y_axis: "application_count" },
      };
    },
  },

  // ─── CIBIL score distribution ───
  {
    patterns: [
      /cibil/i, /credit.*score/i, /bureau.*score/i, /credit.*bureau/i,
      /score.*distribution/i,
    ],
    handler: () => {
      const buckets: Record<string, { count: number; approved: number; rejected: number }> = {
        "300-549 (Poor)": { count: 0, approved: 0, rejected: 0 },
        "550-649 (Below Avg)": { count: 0, approved: 0, rejected: 0 },
        "650-749 (Good)": { count: 0, approved: 0, rejected: 0 },
        "750-799 (Very Good)": { count: 0, approved: 0, rejected: 0 },
        "800-900 (Excellent)": { count: 0, approved: 0, rejected: 0 },
      };

      LAP_DB.credit_bureau_reports.forEach((cbr) => {
        const app = LAP_DB.loan_applications.find((a) => a.customer_id === cbr.customer_id);
        const bucket = cbr.score < 550 ? "300-549 (Poor)" :
          cbr.score < 650 ? "550-649 (Below Avg)" :
          cbr.score < 750 ? "650-749 (Good)" :
          cbr.score < 800 ? "750-799 (Very Good)" : "800-900 (Excellent)";
        buckets[bucket].count++;
        if (app) {
          if (["Approved", "Disbursed"].includes(app.status)) buckets[bucket].approved++;
          if (app.status === "Rejected") buckets[bucket].rejected++;
        }
      });

      const rows = Object.entries(buckets).map(([range, data]) => ({
        score_range: range,
        customer_count: data.count,
        approved: data.approved,
        rejected: data.rejected,
        approval_rate: data.approved + data.rejected > 0
          ? `${((data.approved / (data.approved + data.rejected)) * 100).toFixed(0)}%`
          : "N/A",
      }));

      return {
        message: "Here's the CIBIL score distribution along with approval and rejection counts for each range. The approval rate column shows the proportion approved among decided applications in that bracket.",
        title: "CIBIL Score vs Approvals",
        sql_query: `SELECT
  CASE
    WHEN cbr.score < 550 THEN '300-549 (Poor)'
    WHEN cbr.score < 650 THEN '550-649 (Below Avg)'
    WHEN cbr.score < 750 THEN '650-749 (Good)'
    WHEN cbr.score < 800 THEN '750-799 (Very Good)'
    ELSE '800-900 (Excellent)'
  END AS score_range,
  COUNT(DISTINCT cbr.customer_id) AS customer_count,
  SUM(CASE WHEN la.status IN ('Approved','Disbursed') THEN 1 ELSE 0 END) AS approved,
  SUM(CASE WHEN la.status = 'Rejected' THEN 1 ELSE 0 END) AS rejected
FROM credit_bureau_reports cbr
LEFT JOIN loan_applications la ON cbr.customer_id = la.customer_id
GROUP BY score_range
ORDER BY MIN(cbr.score);`,
        result: toPandasFormat(rows),
        chart_config: { type: "bar", title: "CIBIL Score Distribution", x_axis: "score_range", y_axis: "approved", y_axis_secondary: "rejected" },
      };
    },
  },

  // ─── Outstanding principal / portfolio ───
  {
    patterns: [
      /outstanding.*principal/i, /portfolio.*outstanding/i,
      /total.*outstanding/i, /aum/i, /assets.*under/i, /book.*size/i,
    ],
    handler: () => {
      const monthly: Record<string, number> = {};
      LAP_DB.loans.forEach((l) => {
        if (l.loan_status === "Active" || l.loan_status === "NPA") {
          const key = l.disbursement_date.substring(0, 7);
          monthly[key] = (monthly[key] || 0) + l.disbursed_amount;
        }
      });
      const runningTotal: { month: string; cumulative_disbursed: number; active_loans: number }[] = [];
      let cumulative = 0;
      Object.entries(monthly).sort(([a], [b]) => a.localeCompare(b)).forEach(([month, amount]) => {
        cumulative += amount;
        const activeCount = LAP_DB.loans.filter(
          (l) => l.disbursement_date.substring(0, 7) <= month && (l.loan_status === "Active" || l.loan_status === "NPA")
        ).length;
        runningTotal.push({ month, cumulative_disbursed: cumulative, active_loans: activeCount });
      });

      return {
        message: "Here's the portfolio growth trajectory for active and NPA loans. Each row shows the cumulative disbursed amount and number of active loans up to that month.",
        title: "Portfolio Outstanding",
        sql_query: `SELECT
  DATE_FORMAT(disbursement_date, '%Y-%m') AS month,
  SUM(disbursed_amount) OVER (ORDER BY DATE_FORMAT(disbursement_date, '%Y-%m')) AS cumulative_disbursed,
  COUNT(*) OVER (ORDER BY DATE_FORMAT(disbursement_date, '%Y-%m')) AS active_loans
FROM loans
WHERE loan_status IN ('Active', 'NPA')
ORDER BY month;`,
        result: toPandasFormat(runningTotal),
        chart_config: { type: "area", title: "Portfolio Outstanding Growth", x_axis: "month", y_axis: "cumulative_disbursed" },
      };
    },
  },

  // ─── EMI collection / repayment ───
  {
    patterns: [
      /emi.*collect/i, /collection.*efficien/i, /repayment/i,
      /emi.*status/i, /payment.*status/i, /bounced.*emi/i,
      /emi.*overdue/i, /emi.*paid/i,
    ],
    handler: () => {
      const monthly: Record<string, { total: number; paid: number; overdue: number; bounced: number; collected: number }> = {};
      LAP_DB.emi_schedule.forEach((e) => {
        const key = e.due_date.substring(0, 7);
        if (!monthly[key]) monthly[key] = { total: 0, paid: 0, overdue: 0, bounced: 0, collected: 0 };
        monthly[key].total++;
        if (e.status === "Paid") { monthly[key].paid++; monthly[key].collected += e.payment_amount || 0; }
        else if (e.status === "Overdue") monthly[key].overdue++;
        else if (e.status === "Bounced") { monthly[key].bounced++; monthly[key].collected += e.payment_amount || 0; }
      });
      const rows = Object.entries(monthly)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, data]) => ({
          month,
          total_emis: data.total,
          paid: data.paid,
          overdue: data.overdue,
          bounced: data.bounced,
          collection_rate: `${((data.paid / data.total) * 100).toFixed(1)}%`,
          amount_collected: data.collected,
        }));

      return {
        message: "Here's the month-wise EMI collection data. Each row shows total EMIs due, how many were paid, overdue, or bounced, along with the collection rate and amount collected for that month.",
        title: "EMI Collection Trend",
        sql_query: `SELECT
  DATE_FORMAT(due_date, '%Y-%m') AS month,
  COUNT(*) AS total_emis,
  SUM(CASE WHEN status = 'Paid' THEN 1 ELSE 0 END) AS paid,
  SUM(CASE WHEN status = 'Overdue' THEN 1 ELSE 0 END) AS overdue,
  SUM(CASE WHEN status = 'Bounced' THEN 1 ELSE 0 END) AS bounced,
  CONCAT(ROUND(SUM(CASE WHEN status='Paid' THEN 1 ELSE 0 END)*100.0/COUNT(*),1),'%') AS collection_rate,
  SUM(COALESCE(payment_amount, 0)) AS amount_collected
FROM emi_schedule
GROUP BY DATE_FORMAT(due_date, '%Y-%m')
ORDER BY month;`,
        result: toPandasFormat(rows),
        chart_config: { type: "line", title: "EMI Collection Trend", x_axis: "month", y_axis: "paid", y_axis_secondary: "overdue" },
      };
    },
  },

  // ─── LTV ratio distribution ───
  {
    patterns: [/ltv/i, /loan.*to.*value/i, /collateral.*cover/i],
    handler: () => {
      const buckets: Record<string, number> = {
        "< 40%": 0, "40-50%": 0, "50-60%": 0, "60-70%": 0, "> 70%": 0,
      };
      LAP_DB.loans.forEach((l) => {
        const pct = l.ltv_ratio * 100;
        if (pct < 40) buckets["< 40%"]++;
        else if (pct < 50) buckets["40-50%"]++;
        else if (pct < 60) buckets["50-60%"]++;
        else if (pct < 70) buckets["60-70%"]++;
        else buckets["> 70%"]++;
      });
      const rows = Object.entries(buckets).map(([range, count]) => ({
        ltv_range: range,
        loan_count: count,
        percentage: `${((count / LAP_DB.loans.length) * 100).toFixed(1)}%`,
      }));

      return {
        message: "Here's the Loan-to-Value ratio distribution. Each row shows how many loans fall in that LTV range and what percentage of the total portfolio they represent.",
        title: "LTV Distribution",
        sql_query: `SELECT
  CASE
    WHEN ltv_ratio < 0.40 THEN '< 40%'
    WHEN ltv_ratio < 0.50 THEN '40-50%'
    WHEN ltv_ratio < 0.60 THEN '50-60%'
    WHEN ltv_ratio < 0.70 THEN '60-70%'
    ELSE '> 70%'
  END AS ltv_range,
  COUNT(*) AS loan_count,
  ROUND(COUNT(*)*100.0/(SELECT COUNT(*) FROM loans),1)||'%' AS percentage
FROM loans
GROUP BY ltv_range
ORDER BY MIN(ltv_ratio);`,
        result: toPandasFormat(rows),
        chart_config: { type: "bar", title: "LTV Distribution", x_axis: "ltv_range", y_axis: "loan_count" },
      };
    },
  },

  // ─── Branch performance ───
  {
    patterns: [/branch.*perform/i, /branch.*wise/i, /branch.*disb/i, /top.*branch/i],
    handler: () => {
      const byBranch: Record<string, { name: string; city: string; apps: number; loans: number; amount: number; npa: number }> = {};
      LAP_DB.branches.forEach((b) => {
        byBranch[b.branch_id] = { name: b.branch_name, city: b.city, apps: 0, loans: 0, amount: 0, npa: 0 };
      });
      LAP_DB.loan_applications.forEach((a) => {
        if (byBranch[a.branch_id]) byBranch[a.branch_id].apps++;
      });
      LAP_DB.loans.forEach((l) => {
        const app = LAP_DB.loan_applications.find((a) => a.application_id === l.application_id);
        if (app && byBranch[app.branch_id]) {
          byBranch[app.branch_id].loans++;
          byBranch[app.branch_id].amount += l.sanctioned_amount;
          if (l.loan_status === "NPA") byBranch[app.branch_id].npa++;
        }
      });

      const rows = Object.values(byBranch)
        .sort((a, b) => b.amount - a.amount)
        .map((b) => ({
          branch: b.name.replace("Godrej Capital - ", ""),
          city: b.city,
          applications: b.apps,
          loans_sanctioned: b.loans,
          total_disbursed: b.amount,
          npa_count: b.npa,
          conversion_rate: b.apps > 0 ? `${((b.loans / b.apps) * 100).toFixed(1)}%` : "0%",
        }));

      return {
        message: "Here's the branch-wise performance data. Each row shows applications received, loans sanctioned, total disbursed amount, NPA count, and conversion rate for that branch.",
        title: "Branch Performance",
        sql_query: `SELECT
  b.branch_name AS branch,
  b.city,
  COUNT(DISTINCT la.application_id) AS applications,
  COUNT(DISTINCT l.loan_id) AS loans_sanctioned,
  SUM(l.sanctioned_amount) AS total_disbursed,
  SUM(CASE WHEN l.loan_status = 'NPA' THEN 1 ELSE 0 END) AS npa_count,
  ROUND(COUNT(DISTINCT l.loan_id)*100.0/NULLIF(COUNT(DISTINCT la.application_id),0),1)||'%' AS conversion_rate
FROM branches b
LEFT JOIN loan_applications la ON b.branch_id = la.branch_id
LEFT JOIN loans l ON la.application_id = l.application_id
GROUP BY b.branch_id, b.branch_name, b.city
ORDER BY total_disbursed DESC;`,
        result: toPandasFormat(rows),
        chart_config: { type: "horizontal_bar", title: "Branch Performance", x_axis: "branch", y_axis: "total_disbursed" },
      };
    },
  },

  // ─── Employment type analysis ───
  {
    patterns: [
      /employ.*type/i, /salaried.*self/i, /borrower.*profile/i,
      /customer.*segment/i, /customer.*profile/i,
    ],
    handler: () => {
      const byType: Record<string, { count: number; avgIncome: number[]; avgLoan: number[] }> = {};
      LAP_DB.loans.forEach((l) => {
        const cust = LAP_DB.customers.find((c) => c.customer_id === l.customer_id);
        if (!cust) return;
        if (!byType[cust.employment_type]) byType[cust.employment_type] = { count: 0, avgIncome: [], avgLoan: [] };
        byType[cust.employment_type].count++;
        byType[cust.employment_type].avgIncome.push(cust.annual_income);
        byType[cust.employment_type].avgLoan.push(l.sanctioned_amount);
      });
      const rows = Object.entries(byType).map(([type, data]) => ({
        employment_type: type,
        loan_count: data.count,
        avg_annual_income: Math.round(data.avgIncome.reduce((a, b) => a + b, 0) / data.avgIncome.length),
        avg_loan_amount: Math.round(data.avgLoan.reduce((a, b) => a + b, 0) / data.avgLoan.length),
        share: `${((data.count / LAP_DB.loans.length) * 100).toFixed(1)}%`,
      }));

      return {
        message: "Here's the borrower profile by employment type. Each row shows the loan count, average annual income, average loan amount, and portfolio share for that segment.",
        title: "Borrower Segments",
        sql_query: `SELECT
  c.employment_type,
  COUNT(l.loan_id) AS loan_count,
  ROUND(AVG(c.annual_income)) AS avg_annual_income,
  ROUND(AVG(l.sanctioned_amount)) AS avg_loan_amount,
  ROUND(COUNT(*)*100.0/(SELECT COUNT(*) FROM loans),1)||'%' AS share
FROM loans l
JOIN customers c ON l.customer_id = c.customer_id
GROUP BY c.employment_type;`,
        result: toPandasFormat(rows),
        chart_config: { type: "pie", title: "Borrower Segments", x_axis: "employment_type", y_axis: "loan_count" },
      };
    },
  },

  // ─── Rejection reasons ───
  {
    patterns: [/reject.*reason/i, /why.*reject/i, /reason.*reject/i, /decline.*reason/i, /top.*reason/i, /application.*reject/i],
    handler: () => {
      const reasons: Record<string, number> = {};
      LAP_DB.loan_applications.filter((a) => a.status === "Rejected" && a.rejection_reason).forEach((a) => {
        reasons[a.rejection_reason!] = (reasons[a.rejection_reason!] || 0) + 1;
      });
      const rows = Object.entries(reasons)
        .sort(([, a], [, b]) => b - a)
        .map(([reason, count]) => ({
          rejection_reason: reason,
          count,
          percentage: `${((count / Object.values(reasons).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%`,
        }));

      return {
        message: "Here are the reasons for application rejection, ranked by frequency. Each row shows the rejection reason, count, and its percentage share among all rejections.",
        title: "Rejection Reasons",
        sql_query: `SELECT
  rejection_reason,
  COUNT(*) AS count,
  ROUND(COUNT(*)*100.0/SUM(COUNT(*)) OVER(),1)||'%' AS percentage
FROM loan_applications
WHERE status = 'Rejected' AND rejection_reason IS NOT NULL
GROUP BY rejection_reason
ORDER BY count DESC;`,
        result: toPandasFormat(rows),
        chart_config: { type: "horizontal_bar", title: "Rejection Reasons", x_axis: "rejection_reason", y_axis: "count" },
      };
    },
  },

  // ─── Interest rate distribution ───
  {
    patterns: [/interest.*rate/i, /rate.*distribution/i, /roi.*distribut/i, /pricing/i],
    handler: () => {
      const buckets: Record<string, number> = {
        "9.0 - 9.9%": 0, "10.0 - 10.9%": 0, "11.0 - 11.9%": 0, "12.0 - 12.9%": 0, "13.0%+": 0,
      };
      LAP_DB.loans.forEach((l) => {
        if (l.interest_rate < 10) buckets["9.0 - 9.9%"]++;
        else if (l.interest_rate < 11) buckets["10.0 - 10.9%"]++;
        else if (l.interest_rate < 12) buckets["11.0 - 11.9%"]++;
        else if (l.interest_rate < 13) buckets["12.0 - 12.9%"]++;
        else buckets["13.0%+"]++;
      });
      const rows = Object.entries(buckets).map(([range, count]) => ({
        rate_range: range,
        loan_count: count,
        percentage: `${((count / LAP_DB.loans.length) * 100).toFixed(1)}%`,
      }));

      return {
        message: "Here's the interest rate distribution across the portfolio. Each row shows a rate bracket, the number of loans in that range, and the percentage share.",
        title: "Interest Rate Spread",
        sql_query: `SELECT
  CASE
    WHEN interest_rate < 10 THEN '9.0 - 9.9%'
    WHEN interest_rate < 11 THEN '10.0 - 10.9%'
    WHEN interest_rate < 12 THEN '11.0 - 11.9%'
    WHEN interest_rate < 13 THEN '12.0 - 12.9%'
    ELSE '13.0%+'
  END AS rate_range,
  COUNT(*) AS loan_count
FROM loans
GROUP BY rate_range
ORDER BY MIN(interest_rate);`,
        result: toPandasFormat(rows),
        chart_config: { type: "bar", title: "Interest Rate Spread", x_axis: "rate_range", y_axis: "loan_count" },
      };
    },
  },

  // ─── Top customers ───
  {
    patterns: [/top.*customer/i, /largest.*loan/i, /biggest.*borrow/i, /high.*value.*customer/i, /top.*borrow/i],
    handler: () => {
      const custLoans: Record<string, { name: string; city: string; employment: string; totalSanctioned: number; loanCount: number }> = {};
      LAP_DB.loans.forEach((l) => {
        const cust = LAP_DB.customers.find((c) => c.customer_id === l.customer_id);
        if (!cust) return;
        if (!custLoans[l.customer_id]) {
          custLoans[l.customer_id] = {
            name: `${cust.first_name} ${cust.last_name}`,
            city: cust.city,
            employment: cust.employment_type,
            totalSanctioned: 0,
            loanCount: 0,
          };
        }
        custLoans[l.customer_id].totalSanctioned += l.sanctioned_amount;
        custLoans[l.customer_id].loanCount++;
      });
      const rows = Object.entries(custLoans)
        .sort(([, a], [, b]) => b.totalSanctioned - a.totalSanctioned)
        .slice(0, 25)
        .map(([id, data], idx) => ({
          rank: idx + 1,
          customer_id: id,
          customer_name: data.name,
          city: data.city,
          employment_type: data.employment,
          total_sanctioned: data.totalSanctioned,
          loan_count: data.loanCount,
        }));

      return {
        message: "Here are the top 25 borrowers ranked by total sanctioned amount. Each row includes the customer name, city, employment type, total sanctioned value, and number of loans.",
        title: "Top 25 Borrowers",
        sql_query: `SELECT
  ROW_NUMBER() OVER (ORDER BY SUM(l.sanctioned_amount) DESC) AS rank,
  c.customer_id,
  CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
  c.city,
  c.employment_type,
  SUM(l.sanctioned_amount) AS total_sanctioned,
  COUNT(l.loan_id) AS loan_count
FROM loans l
JOIN customers c ON l.customer_id = c.customer_id
GROUP BY c.customer_id
ORDER BY total_sanctioned DESC
LIMIT 25;`,
        result: toPandasFormat(rows),
      };
    },
  },

  // ─── Tenure distribution ───
  {
    patterns: [/tenure/i, /loan.*duration/i, /loan.*period/i, /term.*distribut/i],
    handler: () => {
      const byTenure: Record<number, { count: number; amount: number }> = {};
      LAP_DB.loans.forEach((l) => {
        const years = l.tenure_months / 12;
        if (!byTenure[years]) byTenure[years] = { count: 0, amount: 0 };
        byTenure[years].count++;
        byTenure[years].amount += l.sanctioned_amount;
      });
      const rows = Object.entries(byTenure)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([years, data]) => ({
          tenure_years: `${years} years`,
          loan_count: data.count,
          total_sanctioned: data.amount,
          avg_loan_amount: Math.round(data.amount / data.count),
        }));

      return {
        message: "Here's the tenure-wise distribution. Each row shows the tenure period, number of loans, total sanctioned amount, and average loan amount for that tenure.",
        title: "Tenure Distribution",
        sql_query: `SELECT
  CONCAT(tenure_months / 12, ' years') AS tenure_years,
  COUNT(*) AS loan_count,
  SUM(sanctioned_amount) AS total_sanctioned,
  ROUND(AVG(sanctioned_amount)) AS avg_loan_amount
FROM loans
GROUP BY tenure_months
ORDER BY tenure_months;`,
        result: toPandasFormat(rows),
        chart_config: { type: "bar", title: "Tenure Distribution", x_axis: "tenure_years", y_axis: "loan_count" },
      };
    },
  },

  // ─── Collection actions summary ───
  {
    patterns: [/collection.*action/i, /recovery/i, /collection.*summary/i, /sarfaesi/i, /legal.*notice/i],
    handler: () => {
      const byType: Record<string, Record<string, number>> = {};
      LAP_DB.collections.forEach((c) => {
        if (!byType[c.action_type]) byType[c.action_type] = {};
        byType[c.action_type][c.outcome] = (byType[c.action_type][c.outcome] || 0) + 1;
      });
      const rows = Object.entries(byType).map(([type, outcomes]) => {
        const total = Object.values(outcomes).reduce((a, b) => a + b, 0);
        const resolved = (outcomes["Payment Received"] || 0) + (outcomes["Settled"] || 0) + (outcomes["Partial Payment"] || 0);
        return {
          action_type: type,
          total_actions: total,
          resolved,
          resolution_rate: `${((resolved / total) * 100).toFixed(1)}%`,
        };
      }).sort((a, b) => b.total_actions - a.total_actions);

      return {
        message: "Here's a summary of collection actions by type. Each row shows the total actions taken, how many were resolved, and the resolution rate for that action type.",
        title: "Collection Summary",
        sql_query: `SELECT
  action_type,
  COUNT(*) AS total_actions,
  SUM(CASE WHEN outcome IN ('Payment Received','Settled','Partial Payment') THEN 1 ELSE 0 END) AS resolved,
  ROUND(SUM(CASE WHEN outcome IN ('Payment Received','Settled','Partial Payment') THEN 1 ELSE 0 END)*100.0/COUNT(*),1)||'%' AS resolution_rate
FROM collections
GROUP BY action_type
ORDER BY total_actions DESC;`,
        result: toPandasFormat(rows),
        chart_config: { type: "bar", title: "Collection Actions", x_axis: "action_type", y_axis: "total_actions" },
      };
    },
  },

  // ─── Property valuation analysis ───
  {
    patterns: [/property.*value/i, /valuation/i, /property.*market/i, /collateral.*value/i],
    handler: () => {
      const byCity: Record<string, { count: number; totalValue: number; avgArea: number[]; types: Record<string, number> }> = {};
      LAP_DB.properties.forEach((p) => {
        if (!byCity[p.city]) byCity[p.city] = { count: 0, totalValue: 0, avgArea: [], types: {} };
        byCity[p.city].count++;
        byCity[p.city].totalValue += p.market_value;
        byCity[p.city].avgArea.push(p.carpet_area_sqft);
        byCity[p.city].types[p.property_type] = (byCity[p.city].types[p.property_type] || 0) + 1;
      });
      const rows = Object.entries(byCity)
        .sort(([, a], [, b]) => b.totalValue - a.totalValue)
        .map(([city, data]) => ({
          city,
          property_count: data.count,
          total_market_value: data.totalValue,
          avg_market_value: Math.round(data.totalValue / data.count),
          avg_area_sqft: Math.round(data.avgArea.reduce((a, b) => a + b, 0) / data.avgArea.length),
          avg_rate_per_sqft: Math.round(data.totalValue / data.avgArea.reduce((a, b) => a + b, 0)),
        }));

      return {
        message: "Here's the property valuation data by city. Each row shows property count, total and average market value, average carpet area, and the rate per sqft for that city.",
        title: "Property Valuations",
        sql_query: `SELECT
  city,
  COUNT(*) AS property_count,
  SUM(market_value) AS total_market_value,
  ROUND(AVG(market_value)) AS avg_market_value,
  ROUND(AVG(carpet_area_sqft)) AS avg_area_sqft,
  ROUND(SUM(market_value) / SUM(carpet_area_sqft)) AS avg_rate_per_sqft
FROM properties
GROUP BY city
ORDER BY total_market_value DESC;`,
        result: toPandasFormat(rows),
        chart_config: { type: "bar", title: "Property Rates by City", x_axis: "city", y_axis: "avg_rate_per_sqft" },
      };
    },
  },

  // ─── Purpose-wise breakdown ───
  {
    patterns: [/purpose/i, /loan.*purpose/i, /why.*borrow/i, /reason.*loan/i, /end.*use/i],
    handler: () => {
      const byPurpose: Record<string, { count: number; amount: number }> = {};
      LAP_DB.loan_applications.forEach((a) => {
        if (!byPurpose[a.purpose]) byPurpose[a.purpose] = { count: 0, amount: 0 };
        byPurpose[a.purpose].count++;
        byPurpose[a.purpose].amount += a.applied_amount;
      });
      const rows = Object.entries(byPurpose)
        .sort(([, a], [, b]) => b.count - a.count)
        .map(([purpose, data]) => ({
          loan_purpose: purpose,
          application_count: data.count,
          total_applied_amount: data.amount,
          avg_applied_amount: Math.round(data.amount / data.count),
        }));

      return {
        message: "Here's the purpose-wise breakdown of loan applications. Each row shows the loan purpose, number of applications, total applied amount, and average ticket size for that purpose.",
        title: "Loan Purpose Analysis",
        sql_query: `SELECT
  purpose AS loan_purpose,
  COUNT(*) AS application_count,
  SUM(applied_amount) AS total_applied_amount,
  ROUND(AVG(applied_amount)) AS avg_applied_amount
FROM loan_applications
GROUP BY purpose
ORDER BY application_count DESC;`,
        result: toPandasFormat(rows),
        chart_config: { type: "horizontal_bar", title: "Loan Purpose Breakdown", x_axis: "loan_purpose", y_axis: "application_count" },
      };
    },
  },
];

// ─── Fallback: show recent loan data ───
function getFallbackResult(query: string): QueryResult {
  const recentLoans = LAP_DB.loans
    .sort((a, b) => b.disbursement_date.localeCompare(a.disbursement_date))
    .slice(0, 30)
    .map((l) => {
      const cust = LAP_DB.customers.find((c) => c.customer_id === l.customer_id);
      return {
        loan_id: l.loan_id,
        customer_name: cust ? `${cust.first_name} ${cust.last_name}` : "N/A",
        city: cust?.city || "N/A",
        sanctioned_amount: l.sanctioned_amount,
        interest_rate: `${l.interest_rate}%`,
        tenure_months: l.tenure_months,
        emi_amount: l.emi_amount,
        status: l.loan_status,
        disbursement_date: l.disbursement_date,
      };
    });

  return {
    message: "I wasn't able to match your query to a specific analysis, but here are the 30 most recent LAP loans as a starting point. Try asking about disbursement trends, NPA analysis, CIBIL scores, branch performance, or EMI collections.",
    title: "Recent LAP Loans",
    sql_query: `-- Query: "${query}"
-- Showing recent loan data as a starting point

SELECT
  l.loan_id,
  CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
  c.city,
  l.sanctioned_amount,
  l.interest_rate,
  l.tenure_months,
  l.emi_amount,
  l.loan_status AS status,
  l.disbursement_date
FROM loans l
JOIN customers c ON l.customer_id = c.customer_id
ORDER BY l.disbursement_date DESC
LIMIT 30;`,
    result: toPandasFormat(recentLoans),
  };
}

export function executeQuery(userQuery: string): QueryResult {
  for (const matcher of matchers) {
    for (const pattern of matcher.patterns) {
      if (pattern.test(userQuery)) {
        return matcher.handler(userQuery);
      }
    }
  }
  return getFallbackResult(userQuery);
}
