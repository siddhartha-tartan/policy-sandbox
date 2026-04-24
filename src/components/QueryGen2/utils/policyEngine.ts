export interface PolicySnapshot {
  application_id: string;
  age_years: number;
  annual_income: number;
  employment_tenure_years: number;
  bureau_score: number;
  inquiries_last_6m: number;
  total_outstanding: number;
  foir: number;
  ltv: number;
}

export interface UnderwritingPolicy {
  min_age_years: number;
  max_age_years: number;
  min_annual_income: number;
  min_employment_tenure_years: number;
  min_bureau_score: number;
  max_inquiries_last_6m: number;
  max_total_outstanding: number;
  max_foir: number;
  max_ltv: number;
}

export type PolicyField =
  | "min_age_years"
  | "max_age_years"
  | "min_annual_income"
  | "min_employment_tenure_years"
  | "min_bureau_score"
  | "max_inquiries_last_6m"
  | "max_total_outstanding"
  | "max_foir"
  | "max_ltv";

export interface PolicyChange {
  field: PolicyField;
  label: string;
  oldValue: number;
  newValue: number;
}

export interface PolicyScenarioParseOptions {
  fallbackField?: PolicyField;
  fallbackOldValue?: number;
}

export interface PolicyFailure {
  field: PolicyField;
  label: string;
  actual: number;
  threshold: number;
  comparator: ">=" | "<=";
}

export interface PolicyEvaluation {
  eligible: boolean;
  failures: PolicyFailure[];
}

export interface PolicySimulationResult {
  baseline_financed: number;
  revised_financed: number;
  delta_count: number;
  delta_pct: number;
  total_applicants: number;
  newly_financed: number;
  no_longer_financed: number;
  baseline_rejection_mix: Record<string, number>;
  revised_rejection_mix: Record<string, number>;
}

export interface PolicyRulePreview {
  label: string;
  value: string;
}

export const BASELINE_POLICY: UnderwritingPolicy = {
  min_age_years: 23,
  max_age_years: 60,
  min_annual_income: 600000,
  min_employment_tenure_years: 2,
  min_bureau_score: 680,
  max_inquiries_last_6m: 4,
  max_total_outstanding: 6000000,
  max_foir: 1.2,
  max_ltv: 0.72,
};

const FIELD_LABELS: Record<PolicyField, string> = {
  min_age_years: "Minimum age",
  max_age_years: "Maximum age",
  min_annual_income: "Minimum annual income",
  min_employment_tenure_years: "Minimum employment tenure",
  min_bureau_score: "Minimum bureau score",
  max_inquiries_last_6m: "Maximum inquiries in last 6 months",
  max_total_outstanding: "Maximum total outstanding",
  max_foir: "Maximum FOIR",
  max_ltv: "Maximum LTV",
};

const FIELD_PATTERNS: Array<{ field: PolicyField; label: string; patterns: RegExp[] }> = [
  {
    field: "min_bureau_score",
    label: FIELD_LABELS.min_bureau_score,
    patterns: [/(bureau|cibil|credit score)/i],
  },
  {
    field: "min_annual_income",
    label: FIELD_LABELS.min_annual_income,
    patterns: [/(income|salary)/i],
  },
  {
    field: "min_employment_tenure_years",
    label: FIELD_LABELS.min_employment_tenure_years,
    patterns: [/(employment tenure|job tenure|tenure)/i],
  },
  {
    field: "max_inquiries_last_6m",
    label: FIELD_LABELS.max_inquiries_last_6m,
    patterns: [/(inquiries|enquiries|inquiry total|bureau inquiries)/i],
  },
  {
    field: "max_total_outstanding",
    label: FIELD_LABELS.max_total_outstanding,
    patterns: [/(total outstanding|outstanding|existing obligations|debt)/i],
  },
  {
    field: "min_age_years",
    label: FIELD_LABELS.min_age_years,
    patterns: [/(minimum age|min age|age at least|age >=)/i],
  },
  {
    field: "max_age_years",
    label: FIELD_LABELS.max_age_years,
    patterns: [/(maximum age|max age|age cap|age <=)/i],
  },
];

const RULE_DEFINITIONS: Array<{
  field: PolicyField;
  label: string;
  comparator: ">=" | "<=";
  getValue: (snapshot: PolicySnapshot) => number;
}> = [
  {
    field: "min_age_years",
    label: FIELD_LABELS.min_age_years,
    comparator: ">=",
    getValue: (snapshot) => snapshot.age_years,
  },
  {
    field: "max_age_years",
    label: FIELD_LABELS.max_age_years,
    comparator: "<=",
    getValue: (snapshot) => snapshot.age_years,
  },
  {
    field: "min_annual_income",
    label: FIELD_LABELS.min_annual_income,
    comparator: ">=",
    getValue: (snapshot) => snapshot.annual_income,
  },
  {
    field: "min_employment_tenure_years",
    label: FIELD_LABELS.min_employment_tenure_years,
    comparator: ">=",
    getValue: (snapshot) => snapshot.employment_tenure_years,
  },
  {
    field: "min_bureau_score",
    label: FIELD_LABELS.min_bureau_score,
    comparator: ">=",
    getValue: (snapshot) => snapshot.bureau_score,
  },
  {
    field: "max_inquiries_last_6m",
    label: FIELD_LABELS.max_inquiries_last_6m,
    comparator: "<=",
    getValue: (snapshot) => snapshot.inquiries_last_6m,
  },
  {
    field: "max_total_outstanding",
    label: FIELD_LABELS.max_total_outstanding,
    comparator: "<=",
    getValue: (snapshot) => snapshot.total_outstanding,
  },
  {
    field: "max_foir",
    label: FIELD_LABELS.max_foir,
    comparator: "<=",
    getValue: (snapshot) => snapshot.foir,
  },
  {
    field: "max_ltv",
    label: FIELD_LABELS.max_ltv,
    comparator: "<=",
    getValue: (snapshot) => snapshot.ltv,
  },
];

export function evaluatePolicy(
  snapshot: PolicySnapshot,
  policy: UnderwritingPolicy = BASELINE_POLICY
): PolicyEvaluation {
  const failures = RULE_DEFINITIONS.flatMap((rule) => {
    const actual = rule.getValue(snapshot);
    const threshold = policy[rule.field];
    const passed =
      rule.comparator === ">=" ? actual >= threshold : actual <= threshold;

    return passed
      ? []
      : [
          {
            field: rule.field,
            label: rule.label,
            actual,
            threshold,
            comparator: rule.comparator,
          },
        ];
  });

  return {
    eligible: failures.length === 0,
    failures,
  };
}

export function getPrimaryFailureLabel(
  evaluation: PolicyEvaluation
): string | null {
  return evaluation.failures[0]?.label ?? null;
}

export function getPrimaryRejectionReason(
  evaluation: PolicyEvaluation
): string | null {
  const failure = evaluation.failures[0];

  if (!failure) return null;

  switch (failure.field) {
    case "min_bureau_score":
      return "Low bureau score";
    case "min_annual_income":
      return "Insufficient income";
    case "min_employment_tenure_years":
      return "Insufficient employment tenure";
    case "max_inquiries_last_6m":
      return "High recent bureau inquiries";
    case "max_total_outstanding":
      return "High existing obligations";
    case "min_age_years":
    case "max_age_years":
      return "Age outside policy range";
    case "max_foir":
      return "High FOIR";
    case "max_ltv":
      return "High LTV";
    default:
      return failure.label;
  }
}

export function simulatePolicy(
  applications: PolicySnapshot[],
  revisedPolicy: UnderwritingPolicy,
  baselinePolicy: UnderwritingPolicy = BASELINE_POLICY
): PolicySimulationResult {
  let baseline_financed = 0;
  let revised_financed = 0;
  let newly_financed = 0;
  let no_longer_financed = 0;

  const baseline_rejection_mix: Record<string, number> = {};
  const revised_rejection_mix: Record<string, number> = {};

  applications.forEach((application) => {
    const baseline = evaluatePolicy(application, baselinePolicy);
    const revised = evaluatePolicy(application, revisedPolicy);

    if (baseline.eligible) {
      baseline_financed += 1;
    } else {
      const reason = getPrimaryRejectionReason(baseline) || "Other";
      baseline_rejection_mix[reason] = (baseline_rejection_mix[reason] || 0) + 1;
    }

    if (revised.eligible) {
      revised_financed += 1;
    } else {
      const reason = getPrimaryRejectionReason(revised) || "Other";
      revised_rejection_mix[reason] = (revised_rejection_mix[reason] || 0) + 1;
    }

    if (!baseline.eligible && revised.eligible) {
      newly_financed += 1;
    }

    if (baseline.eligible && !revised.eligible) {
      no_longer_financed += 1;
    }
  });

  const delta_count = revised_financed - baseline_financed;
  const delta_pct =
    baseline_financed === 0
      ? 0
      : Number(((delta_count / baseline_financed) * 100).toFixed(1));

  return {
    baseline_financed,
    revised_financed,
    delta_count,
    delta_pct,
    total_applicants: applications.length,
    newly_financed,
    no_longer_financed,
    baseline_rejection_mix,
    revised_rejection_mix,
  };
}

function looksLikeWhatIfPrompt(query: string): boolean {
  return /(what if|if i change|if we change|impact of|how many.*(approved|finance|financed|qualify)|change.*from.*to)/i.test(
    query
  );
}

function detectPolicyField(query: string): {
  field: PolicyField;
  label: string;
} | null {
  for (const candidate of FIELD_PATTERNS) {
    if (candidate.patterns.some((pattern) => pattern.test(query))) {
      return { field: candidate.field, label: candidate.label };
    }
  }

  return null;
}

function normalizeNumericToken(rawValue: string): number | null {
  const lower = rawValue.toLowerCase().replace(/,/g, "").trim();
  const numericMatch = lower.match(/-?\d+(\.\d+)?/);

  if (!numericMatch) return null;

  let value = Number(numericMatch[0]);

  if (Number.isNaN(value)) return null;

  if (/(crore|cr)\b/.test(lower)) {
    value *= 10000000;
  } else if (/(lakh|lac|lakhs|lacs)\b/.test(lower)) {
    value *= 100000;
  } else if (/(k)\b/.test(lower) && !/(score)/.test(lower)) {
    value *= 1000;
  } else if (/(%|percent)\b/.test(lower)) {
    value /= 100;
  }

  return value;
}

function extractScenarioValues(query: string): {
  oldValue: number | null;
  newValue: number;
} | null {
  const fromToMatch = query.match(
    /from\s+([a-z0-9.,%\s]+?)\s+to\s+([a-z0-9.,%\s]+?)(?:[?.!,]|$)/i
  );

  if (fromToMatch) {
    const oldValue = normalizeNumericToken(fromToMatch[1]);
    const newValue = normalizeNumericToken(fromToMatch[2]);
    if (oldValue !== null && newValue !== null) {
      return { oldValue, newValue };
    }
  }

  const toMatch = query.match(
    /\b(?:to|at|becomes?|be|set to|increase to|decrease to|raise to|lower to)\b\s+([a-z0-9.,%\s]+?)(?:[?.!,]|$)/i
  );
  const numbers = query.match(/\d+(?:,\d+)*(?:\.\d+)?(?:\s*(?:crore|cr|lakh|lac|lakhs|lacs|k|%|percent))?/gi);

  if (toMatch) {
    const newValue = normalizeNumericToken(toMatch[1]);
    const inferredOld =
      numbers && numbers.length > 1 ? normalizeNumericToken(numbers[0]) : null;
    if (newValue !== null) {
      return {
        oldValue: inferredOld,
        newValue,
      };
    }
  }

  if (numbers && numbers.length >= 2) {
    const oldValue = normalizeNumericToken(numbers[0]);
    const newValue = normalizeNumericToken(numbers[1]);
    if (oldValue !== null && newValue !== null) {
      return { oldValue, newValue };
    }
  }

  if (numbers && numbers.length === 1) {
    const newValue = normalizeNumericToken(numbers[0]);
    if (newValue !== null) {
      return {
        oldValue: null,
        newValue,
      };
    }
  }

  return null;
}

export function parsePolicyScenario(
  query: string,
  baselinePolicy: UnderwritingPolicy = BASELINE_POLICY,
  options: PolicyScenarioParseOptions = {}
): PolicyChange | null {
  if (!looksLikeWhatIfPrompt(query)) return null;

  const detectedField = detectPolicyField(query);
  const resolvedField = detectedField?.field ?? options.fallbackField;

  if (!resolvedField) return null;

  const values = extractScenarioValues(query);
  const baselineValue = baselinePolicy[resolvedField];

  if (!values) {
    return null;
  }

  const oldValue =
    values.oldValue ??
    (resolvedField === options.fallbackField && options.fallbackOldValue !== undefined
      ? options.fallbackOldValue
      : baselineValue);

  return {
    field: resolvedField,
    label: FIELD_LABELS[resolvedField],
    oldValue,
    newValue: values.newValue,
  };
}

export function applyPolicyChange(
  policy: UnderwritingPolicy,
  change: PolicyChange
): UnderwritingPolicy {
  return {
    ...policy,
    [change.field]: change.newValue,
  };
}

export function formatPolicyValue(field: PolicyField, value: number): string {
  if (field === "min_annual_income" || field === "max_total_outstanding") {
    return `Rs ${Math.round(value).toLocaleString("en-IN")}`;
  }

  if (field === "max_foir" || field === "max_ltv") {
    return `${(value * 100).toFixed(0)}%`;
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function getBaselinePolicyRules(): PolicyRulePreview[] {
  return [
    {
      label: "Allowed age range",
      value: `${formatPolicyValue("min_age_years", BASELINE_POLICY.min_age_years)}-${formatPolicyValue(
        "max_age_years",
        BASELINE_POLICY.max_age_years
      )} years`,
    },
    {
      label: "Minimum annual income",
      value: formatPolicyValue(
        "min_annual_income",
        BASELINE_POLICY.min_annual_income
      ),
    },
    {
      label: "Minimum employment tenure",
      value: `${formatPolicyValue(
        "min_employment_tenure_years",
        BASELINE_POLICY.min_employment_tenure_years
      )} years`,
    },
    {
      label: "Minimum bureau score",
      value: formatPolicyValue(
        "min_bureau_score",
        BASELINE_POLICY.min_bureau_score
      ),
    },
    {
      label: "Maximum inquiries in last 6 months",
      value: formatPolicyValue(
        "max_inquiries_last_6m",
        BASELINE_POLICY.max_inquiries_last_6m
      ),
    },
    {
      label: "Maximum total outstanding",
      value: formatPolicyValue(
        "max_total_outstanding",
        BASELINE_POLICY.max_total_outstanding
      ),
    },
    {
      label: "Maximum FOIR",
      value: formatPolicyValue("max_foir", BASELINE_POLICY.max_foir),
    },
    {
      label: "Maximum LTV",
      value: formatPolicyValue("max_ltv", BASELINE_POLICY.max_ltv),
    },
  ];
}
