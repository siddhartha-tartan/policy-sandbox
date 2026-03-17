import { UserType } from "../utils/constants/constants";

export const MOCK_USER = {
  id: "mock-user-001",
  first_name: "Sandbox",
  last_name: "User",
  email: "sandbox@policysandbox.dev",
  phone_number: "+919876543210",
  source_employee_id: "EMP-001",
  organization_id: "org-mock-001",
  organization_name: "Policy Sandbox Org",
  _metadata: JSON.stringify({
    feature_list: [],
  }),
};

export const MOCK_ORGANISATION_ID = "org-mock-001";

export const MOCK_LOAN_CATEGORIES = [
  {
    id: "cat-001",
    category_type: "Home Loan",
    is_active: true,
    is_disabled: false,
    policy: { count: 1 },
    access_type: "edit" as const,
    subcategories: [
      { id: "sub-001", category_type: "Salaried", is_disabled: false, is_active: true },
      { id: "sub-002", category_type: "Self-Employed", is_disabled: false, is_active: true },
    ],
  },
  {
    id: "cat-002",
    category_type: "Personal Loan",
    is_active: true,
    is_disabled: false,
    policy: { count: 1 },
    access_type: "edit" as const,
    subcategories: [
      { id: "sub-003", category_type: "Standard", is_disabled: false, is_active: true },
    ],
  },
  {
    id: "cat-003",
    category_type: "Vehicle Loan",
    is_active: true,
    is_disabled: false,
    policy: { count: 1 },
    access_type: "view" as const,
    subcategories: [],
  },
];

export const MOCK_ENABLED_FEATURES = [
  { name: "Policies", is_enable: true },
  { name: "QueryGen", is_enable: true },
  { name: "User Management", is_enable: true },
  { name: "Policies ABFL", is_enable: true },
  { name: "PolicyComparison", is_enable: true },
];

export const MOCK_POLICIES = [
  {
    id: "pol-001",
    name: "Home Loan Eligibility Policy",
    description: "Defines eligibility criteria for home loans based on income, credit score, and employment status.",
    status: "approved",
    version: "1.2",
    version_id: "ver-001",
    category_id: "cat-001",
    category_type: "Home Loan",
    created_at: "2025-11-15T10:30:00Z",
    updated_at: "2026-01-20T14:00:00Z",
    created_by: "admin@policysandbox.dev",
    policy_manager: "Sandbox User",
    policy_manager_id: "mock-user-001",
    file_id: "file-001",
    file_name: "home_loan_eligibility.docx",
    versions: [
      { id: "ver-001", version: "1.2", created_at: "2026-01-20T14:00:00Z", status: "approved" },
      { id: "ver-000", version: "1.1", created_at: "2025-12-10T10:00:00Z", status: "archived" },
    ],
  },
  {
    id: "pol-002",
    name: "Personal Loan Interest Rate Policy",
    description: "Guidelines for determining interest rates for personal loans.",
    status: "in_review",
    version: "2.0",
    version_id: "ver-002",
    category_id: "cat-002",
    category_type: "Personal Loan",
    created_at: "2025-12-01T09:00:00Z",
    updated_at: "2026-02-10T11:30:00Z",
    created_by: "admin@policysandbox.dev",
    policy_manager: "Sandbox User",
    policy_manager_id: "mock-user-001",
    file_id: "file-002",
    file_name: "personal_loan_rates.docx",
    versions: [
      { id: "ver-002", version: "2.0", created_at: "2026-02-10T11:30:00Z", status: "in_review" },
      { id: "ver-001b", version: "1.0", created_at: "2025-12-01T09:00:00Z", status: "approved" },
    ],
  },
  {
    id: "pol-003",
    name: "Vehicle Loan Documentation Policy",
    description: "Required documentation for vehicle loan applications.",
    status: "draft",
    version: "1.0",
    version_id: "ver-003",
    category_id: "cat-003",
    category_type: "Vehicle Loan",
    created_at: "2026-02-20T08:00:00Z",
    updated_at: "2026-02-20T08:00:00Z",
    created_by: "sandbox@policysandbox.dev",
    policy_manager: "Sandbox User",
    policy_manager_id: "mock-user-001",
    file_id: "file-003",
    file_name: "vehicle_loan_docs.docx",
    versions: [
      { id: "ver-003", version: "1.0", created_at: "2026-02-20T08:00:00Z", status: "draft" },
    ],
  },
];

const HOME_LOAN_V2 = `
    <h1 style="text-align:center; color:#1a365d;">Home Loan Eligibility Policy</h1>
    <p style="text-align:center; color:#718096;"><em>Version 1.2 | Effective Date: January 20, 2026</em></p>
    <hr/>

    <h2>1. Purpose</h2>
    <p>This policy outlines the eligibility criteria for home loan applicants. It ensures consistent evaluation of borrowers across all branches and regions.</p>

    <h2>2. Scope</h2>
    <p>This policy applies to all home loan applications submitted through retail banking channels, including salaried and self-employed applicants.</p>

    <h2>3. Eligibility Criteria</h2>
    <h3>3.1 Age Requirements</h3>
    <ul>
      <li>Minimum age at the time of application: <strong>21 years</strong></li>
      <li>Maximum age at loan maturity: <strong>65 years</strong> (salaried) / <strong>70 years</strong> (self-employed)</li>
    </ul>

    <h3>3.2 Income Requirements</h3>
    <table style="width:100%; border-collapse:collapse; margin:16px 0;">
      <thead>
        <tr style="background:#edf2f7;">
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Applicant Type</th>
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Minimum Monthly Income</th>
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Max Loan Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Salaried</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">₹25,000</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">₹1,00,00,000</td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Self-Employed</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">₹40,000</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">₹75,00,000</td>
        </tr>
      </tbody>
    </table>

    <h3>3.3 Credit Score</h3>
    <ul>
      <li>Minimum CIBIL score: <strong>700</strong></li>
      <li>Applicants with score between 650–700 may be considered with additional collateral</li>
      <li>Score below 650: <strong>Application rejected</strong></li>
    </ul>

    <h3>3.4 Employment Stability</h3>
    <ol>
      <li>Salaried: Minimum <strong>2 years</strong> of continuous employment</li>
      <li>Self-Employed: Minimum <strong>3 years</strong> of business operation with ITR filings</li>
    </ol>

    <h2>4. Loan-to-Value (LTV) Ratio</h2>
    <p>The maximum LTV ratio shall not exceed:</p>
    <ul>
      <li><strong>80%</strong> for loans up to ₹30 lakhs</li>
      <li><strong>75%</strong> for loans between ₹30 lakhs – ₹75 lakhs</li>
      <li><strong>70%</strong> for loans above ₹75 lakhs</li>
    </ul>

    <h2>5. Required Documents</h2>
    <ol>
      <li>Identity proof (Aadhaar / PAN / Passport)</li>
      <li>Address proof</li>
      <li>Last 6 months bank statements</li>
      <li>Last 3 years ITR (for self-employed)</li>
      <li>Salary slips (last 3 months) for salaried applicants</li>
      <li>Property documents and valuation report</li>
    </ol>

    <h2>6. Approval Authority</h2>
    <p>Loan sanctions are subject to the following approval matrix:</p>
    <table style="width:100%; border-collapse:collapse; margin:16px 0;">
      <thead>
        <tr style="background:#edf2f7;">
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Loan Amount</th>
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Approving Authority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Up to ₹25 lakhs</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Branch Manager</td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">₹25 lakhs – ₹75 lakhs</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Regional Credit Head</td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Above ₹75 lakhs</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Central Credit Committee</td>
        </tr>
      </tbody>
    </table>

    <h2>7. Disclaimer</h2>
    <p><em>This is a sample policy document for demonstration purposes. All values, thresholds, and criteria are fictional and do not represent any real financial institution's policies.</em></p>
  `;

const HOME_LOAN_V1 = `
    <h1 style="text-align:center; color:#1a365d;">Home Loan Eligibility Policy</h1>
    <p style="text-align:center; color:#718096;"><em>Version 1.1 | Effective Date: December 10, 2025</em></p>
    <hr/>

    <h2>1. Purpose</h2>
    <p>This policy outlines the eligibility criteria for home loan applicants.</p>

    <h2>2. Scope</h2>
    <p>This policy applies to all home loan applications submitted through retail banking channels.</p>

    <h2>3. Eligibility Criteria</h2>
    <h3>3.1 Age Requirements</h3>
    <ul>
      <li>Minimum age at the time of application: <strong>21 years</strong></li>
      <li>Maximum age at loan maturity: <strong>60 years</strong> (salaried) / <strong>65 years</strong> (self-employed)</li>
    </ul>

    <h3>3.2 Income Requirements</h3>
    <table style="width:100%; border-collapse:collapse; margin:16px 0;">
      <thead>
        <tr style="background:#edf2f7;">
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Applicant Type</th>
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Minimum Monthly Income</th>
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Max Loan Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Salaried</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">₹20,000</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">₹75,00,000</td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Self-Employed</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">₹30,000</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">₹50,00,000</td>
        </tr>
      </tbody>
    </table>

    <h3>3.3 Credit Score</h3>
    <ul>
      <li>Minimum CIBIL score: <strong>650</strong></li>
      <li>Score below 650: <strong>Application rejected</strong></li>
    </ul>

    <h2>4. Loan-to-Value (LTV) Ratio</h2>
    <p>The maximum LTV ratio shall not exceed:</p>
    <ul>
      <li><strong>90%</strong> for loans up to ₹30 lakhs</li>
      <li><strong>85%</strong> for loans between ₹30 lakhs – ₹75 lakhs</li>
      <li><strong>80%</strong> for loans above ₹75 lakhs</li>
    </ul>

    <h2>5. Required Documents</h2>
    <ol>
      <li>Identity proof (Aadhaar / PAN / Passport)</li>
      <li>Address proof</li>
      <li>Last 3 months bank statements</li>
      <li>Salary slips (last 3 months) for salaried applicants</li>
      <li>Property documents</li>
    </ol>

    <h2>6. Approval Authority</h2>
    <p>Loan sanctions are subject to the following approval matrix:</p>
    <table style="width:100%; border-collapse:collapse; margin:16px 0;">
      <thead>
        <tr style="background:#edf2f7;">
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Loan Amount</th>
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Approving Authority</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Up to ₹50 lakhs</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Branch Manager</td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Above ₹50 lakhs</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Regional Credit Head</td>
        </tr>
      </tbody>
    </table>

    <h2>7. Disclaimer</h2>
    <p><em>This is a sample policy document for demonstration purposes. All values, thresholds, and criteria are fictional and do not represent any real financial institution's policies.</em></p>
  `;

export const MOCK_POLICY_CONTENTS: Record<string, string> = {
  "file-001": HOME_LOAN_V2,
  "ver-001": HOME_LOAN_V2,
  "ver-000": HOME_LOAN_V1,

  "file-002": `
    <h1 style="text-align:center; color:#1a365d;">Personal Loan Interest Rate Policy</h1>
    <p style="text-align:center; color:#718096;"><em>Version 2.0 | Effective Date: February 10, 2026</em></p>
    <hr/>

    <h2>1. Objective</h2>
    <p>This policy establishes the framework for determining interest rates applicable to personal loan products. It aims to maintain competitive pricing while ensuring adequate risk-adjusted returns.</p>

    <h2>2. Base Rate Structure</h2>
    <p>All personal loan interest rates shall be linked to the organization's internal benchmark rate (IBR), currently set at <strong>9.50% per annum</strong>.</p>

    <h2>3. Risk-Based Pricing Grid</h2>
    <table style="width:100%; border-collapse:collapse; margin:16px 0;">
      <thead>
        <tr style="background:#edf2f7;">
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Risk Category</th>
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">CIBIL Score Range</th>
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Spread over IBR</th>
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Effective Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Low Risk</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">750 and above</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">+1.00%</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">10.50%</td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Medium Risk</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">700 – 749</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">+2.50%</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">12.00%</td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">High Risk</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">650 – 699</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">+4.50%</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">14.00%</td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Decline</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Below 650</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">N/A</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Not Eligible</td>
        </tr>
      </tbody>
    </table>

    <h2>4. Tenure-Based Adjustments</h2>
    <ul>
      <li>Loans up to <strong>12 months</strong>: No additional spread</li>
      <li>Loans between <strong>13 – 36 months</strong>: +0.25% additional spread</li>
      <li>Loans between <strong>37 – 60 months</strong>: +0.50% additional spread</li>
    </ul>

    <h2>5. Special Rate Considerations</h2>
    <h3>5.1 Existing Customer Discount</h3>
    <p>Customers with an existing relationship of more than 2 years are eligible for a <strong>0.25% discount</strong> on the applicable rate.</p>

    <h3>5.2 Salary Account Holders</h3>
    <p>Applicants with salary accounts in the organization receive a <strong>0.50% discount</strong> on the applicable rate.</p>

    <h3>5.3 Volume Discount (Corporate Tie-ups)</h3>
    <p>Employees of partner corporations may receive preferential rates as per individual corporate agreements, subject to a maximum discount of <strong>1.00%</strong>.</p>

    <h2>6. Processing Fee</h2>
    <ol>
      <li>Standard processing fee: <strong>2% of loan amount</strong> (minimum ₹1,000)</li>
      <li>Existing customers: <strong>1.5% of loan amount</strong></li>
      <li>Processing fee is non-refundable once the loan is sanctioned</li>
    </ol>

    <h2>7. Rate Reset Mechanism</h2>
    <p>Interest rates on floating-rate personal loans shall be reset on a <strong>quarterly basis</strong>, linked to the prevailing IBR. Borrowers shall be notified at least <strong>15 business days</strong> before any rate change takes effect.</p>

    <h2>8. Disclaimer</h2>
    <p><em>This is a sample policy document for demonstration purposes. All rates, fees, and terms are fictional.</em></p>
  `,

  "ver-002": `
    <h1 style="text-align:center; color:#1a365d;">Personal Loan Interest Rate Policy</h1>
    <p style="text-align:center; color:#718096;"><em>Version 2.0 | Effective Date: February 10, 2026</em></p>
    <hr/>

    <h2>1. Objective</h2>
    <p>This policy establishes the framework for determining interest rates applicable to personal loan products. It aims to maintain competitive pricing while ensuring adequate risk-adjusted returns.</p>

    <h2>2. Base Rate Structure</h2>
    <p>All personal loan interest rates shall be linked to the organization's internal benchmark rate (IBR), currently set at <strong>9.50% per annum</strong>.</p>

    <h2>3. Risk-Based Pricing Grid</h2>
    <table style="width:100%; border-collapse:collapse; margin:16px 0;">
      <thead>
        <tr style="background:#edf2f7;">
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Risk Category</th>
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">CIBIL Score Range</th>
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Spread over IBR</th>
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Effective Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Low Risk</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">750 and above</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">+1.00%</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">10.50%</td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Medium Risk</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">700 – 749</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">+2.50%</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">12.00%</td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">High Risk</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">650 – 699</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">+4.50%</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">14.00%</td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Decline</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Below 650</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">N/A</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Not Eligible</td>
        </tr>
      </tbody>
    </table>

    <h2>4. Tenure-Based Adjustments</h2>
    <ul>
      <li>Loans up to <strong>12 months</strong>: No additional spread</li>
      <li>Loans between <strong>13 – 36 months</strong>: +0.25% additional spread</li>
      <li>Loans between <strong>37 – 60 months</strong>: +0.50% additional spread</li>
    </ul>

    <h2>5. Special Rate Considerations</h2>
    <h3>5.1 Existing Customer Discount</h3>
    <p>Customers with an existing relationship of more than 2 years are eligible for a <strong>0.25% discount</strong> on the applicable rate.</p>

    <h3>5.2 Salary Account Holders</h3>
    <p>Applicants with salary accounts in the organization receive a <strong>0.50% discount</strong> on the applicable rate.</p>

    <h3>5.3 Volume Discount (Corporate Tie-ups)</h3>
    <p>Employees of partner corporations may receive preferential rates as per individual corporate agreements, subject to a maximum discount of <strong>1.00%</strong>.</p>

    <h2>6. Processing Fee</h2>
    <ol>
      <li>Standard processing fee: <strong>2% of loan amount</strong> (minimum ₹1,000)</li>
      <li>Existing customers: <strong>1.5% of loan amount</strong></li>
      <li>Processing fee is non-refundable once the loan is sanctioned</li>
    </ol>

    <h2>7. Rate Reset Mechanism</h2>
    <p>Interest rates on floating-rate personal loans shall be reset on a <strong>quarterly basis</strong>, linked to the prevailing IBR. Borrowers shall be notified at least <strong>15 business days</strong> before any rate change takes effect.</p>

    <h2>8. Disclaimer</h2>
    <p><em>This is a sample policy document for demonstration purposes. All rates, fees, and terms are fictional.</em></p>
  `,

  "ver-001b": `
    <h1 style="text-align:center; color:#1a365d;">Personal Loan Interest Rate Policy</h1>
    <p style="text-align:center; color:#718096;"><em>Version 1.0 | Effective Date: December 1, 2025</em></p>
    <hr/>

    <h2>1. Objective</h2>
    <p>This policy defines the interest rate framework for personal loan products.</p>

    <h2>2. Base Rate Structure</h2>
    <p>All personal loan interest rates shall be linked to the organization's internal benchmark rate (IBR), currently set at <strong>10.00% per annum</strong>.</p>

    <h2>3. Risk-Based Pricing Grid</h2>
    <table style="width:100%; border-collapse:collapse; margin:16px 0;">
      <thead>
        <tr style="background:#edf2f7;">
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Risk Category</th>
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">CIBIL Score Range</th>
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Effective Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Low Risk</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">750 and above</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">11.00%</td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Medium Risk</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">700 – 749</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">13.00%</td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">High Risk</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">650 – 699</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">15.00%</td>
        </tr>
      </tbody>
    </table>

    <h2>4. Processing Fee</h2>
    <ol>
      <li>Standard processing fee: <strong>2.5% of loan amount</strong></li>
      <li>Processing fee is non-refundable once the loan is sanctioned</li>
    </ol>

    <h2>5. Disclaimer</h2>
    <p><em>This is a sample policy document for demonstration purposes. All rates, fees, and terms are fictional.</em></p>
  `,

  "file-003": `
    <h1 style="text-align:center; color:#1a365d;">Vehicle Loan Documentation Policy</h1>
    <p style="text-align:center; color:#718096;"><em>Version 1.0 | Effective Date: February 20, 2026</em></p>
    <hr/>

    <h2>1. Introduction</h2>
    <p>This policy prescribes the mandatory documentation requirements for all vehicle loan applications. Proper documentation is essential for risk assessment, regulatory compliance, and audit readiness.</p>

    <h2>2. Applicant Documents</h2>
    <h3>2.1 Identity Verification</h3>
    <p>At least <strong>two</strong> of the following must be provided:</p>
    <ul>
      <li>PAN Card (mandatory)</li>
      <li>Aadhaar Card</li>
      <li>Voter ID</li>
      <li>Passport</li>
      <li>Driving License</li>
    </ul>

    <h3>2.2 Address Proof</h3>
    <ul>
      <li>Utility bill (not older than 3 months)</li>
      <li>Aadhaar Card</li>
      <li>Passport</li>
      <li>Rent agreement (registered)</li>
    </ul>

    <h3>2.3 Income Documents</h3>
    <table style="width:100%; border-collapse:collapse; margin:16px 0;">
      <thead>
        <tr style="background:#edf2f7;">
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Applicant Type</th>
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Required Documents</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Salaried</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">
            Last 3 months salary slips<br/>
            Last 6 months bank statements<br/>
            Form 16 / ITR (last 2 years)
          </td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Self-Employed</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">
            Last 3 years ITR with computation<br/>
            Last 12 months bank statements<br/>
            Business registration certificate<br/>
            Balance sheet and P&L (audited)
          </td>
        </tr>
      </tbody>
    </table>

    <h2>3. Vehicle Documents</h2>
    <h3>3.1 New Vehicles</h3>
    <ol>
      <li>Proforma invoice from authorized dealer</li>
      <li>Insurance quotation</li>
      <li>Dealer confirmation letter</li>
    </ol>

    <h3>3.2 Used Vehicles</h3>
    <ol>
      <li>Registration Certificate (RC) – original</li>
      <li>Insurance policy (valid)</li>
      <li>Vehicle valuation report from empanelled valuer</li>
      <li>NOC from existing lender (if applicable)</li>
      <li>Pollution Under Control (PUC) certificate</li>
      <li>Vehicle not older than <strong>7 years</strong> from date of first registration</li>
    </ol>

    <h2>4. Document Verification Process</h2>
    <table style="width:100%; border-collapse:collapse; margin:16px 0;">
      <thead>
        <tr style="background:#edf2f7;">
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Step</th>
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Action</th>
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">Responsibility</th>
          <th style="border:1px solid #cbd5e0; padding:8px 12px; text-align:left;">TAT</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">1</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Document collection &amp; checklist verification</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Relationship Manager</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Day 0</td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">2</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">KYC and income verification</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Credit Team</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Day 1–2</td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">3</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Vehicle inspection (used vehicles)</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Empanelled Valuer</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Day 2–3</td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">4</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Final approval &amp; sanction</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Credit Approver</td>
          <td style="border:1px solid #cbd5e0; padding:8px 12px;">Day 3–5</td>
        </tr>
      </tbody>
    </table>

    <h2>5. Document Retention</h2>
    <p>All original documents shall be retained in the branch vault for the tenure of the loan plus <strong>8 years</strong> after closure, as per regulatory requirements.</p>

    <h2>6. Disclaimer</h2>
    <p><em>This is a sample policy document for demonstration purposes. All requirements and processes are fictional.</em></p>
  `,
};

MOCK_POLICY_CONTENTS["ver-003"] = MOCK_POLICY_CONTENTS["file-003"];

export const MOCK_POLICY_COMPARISON: Record<string, Record<string, { additions: string[]; deletions: string[]; updates: string[] }>> = {
  "ver-001_ver-000": {
    "Purpose & Scope": {
      additions: [
        "Added clause ensuring consistent evaluation of borrowers across all branches and regions.",
        "Scope expanded to explicitly include both salaried and self-employed applicants.",
      ],
      deletions: [
        "Original purpose statement was brief and did not mention cross-branch consistency.",
        "Original scope did not explicitly call out applicant types.",
      ],
      updates: [
        "Purpose section expanded from a single sentence to a more comprehensive description of the policy's intent.",
      ],
    },
    "Age Requirements": {
      additions: [
        "Maximum age at loan maturity increased to 65 years for salaried and 70 years for self-employed applicants.",
      ],
      deletions: [
        "Previous maximum age limits of 60 years (salaried) and 65 years (self-employed) removed.",
      ],
      updates: [
        "Age ceiling raised by 5 years for both applicant categories to align with increased retirement ages.",
      ],
    },
    "Income Requirements": {
      additions: [
        "Minimum monthly income for salaried applicants increased to ₹25,000 (from ₹20,000).",
        "Minimum monthly income for self-employed applicants increased to ₹40,000 (from ₹30,000).",
        "Maximum loan amount for salaried increased to ₹1,00,00,000 (from ₹75,00,000).",
        "Maximum loan amount for self-employed increased to ₹75,00,000 (from ₹50,00,000).",
      ],
      deletions: [
        "Previous lower income thresholds of ₹20,000 (salaried) and ₹30,000 (self-employed) removed.",
        "Previous lower loan caps of ₹75,00,000 (salaried) and ₹50,00,000 (self-employed) removed.",
      ],
      updates: [
        "Income thresholds raised to reflect current market conditions and inflation adjustments.",
        "Loan amount ceilings revised upward to accommodate rising property prices.",
      ],
    },
    "Credit Score Criteria": {
      additions: [
        "Minimum CIBIL score requirement raised to 700.",
        "New provision: applicants with CIBIL score between 650–700 may be considered with additional collateral.",
        "Explicit rejection clause added for scores below 650.",
      ],
      deletions: [
        "Previous minimum CIBIL score threshold of 650 replaced with stricter 700 requirement.",
        "No graduated collateral-based consideration existed in previous version.",
      ],
      updates: [
        "Credit score evaluation changed from a binary pass/fail at 650 to a tiered assessment with collateral provisions.",
      ],
    },
    "Employment Stability": {
      additions: [
        "Entirely new section 3.4 'Employment Stability' introduced in Version 1.2.",
        "Salaried applicants must have minimum 2 years of continuous employment.",
        "Self-employed applicants must have minimum 3 years of business operation with ITR filings.",
      ],
      deletions: [],
      updates: [
        "Employment stability requirements were not part of Version 1.1 and represent a significant policy tightening.",
      ],
    },
    "Loan-to-Value (LTV) Ratio": {
      additions: [
        "New stricter LTV ratios: 80% (up to ₹30L), 75% (₹30L–₹75L), 70% (above ₹75L).",
      ],
      deletions: [
        "Previous more lenient LTV ratios removed: 90% (up to ₹30L), 85% (₹30L–₹75L), 80% (above ₹75L).",
      ],
      updates: [
        "LTV ratios reduced by 10 percentage points across all loan amount brackets to mitigate risk exposure.",
      ],
    },
    "Required Documents": {
      additions: [
        "Bank statement requirement extended from 3 months to 6 months.",
        "New requirement: Last 3 years ITR for self-employed applicants.",
        "New requirement: Property valuation report now mandatory alongside property documents.",
      ],
      deletions: [
        "Previous requirement of only 3 months bank statements considered insufficient.",
        "Previous 'Property documents' requirement was less specific (no valuation report required).",
      ],
      updates: [
        "Document checklist expanded from 5 items to 6 items to strengthen due diligence.",
      ],
    },
    "Approval Authority": {
      additions: [
        "New three-tier approval matrix introduced with thresholds at ₹25 lakhs and ₹75 lakhs.",
        "Central Credit Committee added as approving authority for loans above ₹75 lakhs.",
      ],
      deletions: [
        "Previous two-tier approval structure with single threshold at ₹50 lakhs removed.",
        "Regional Credit Head was sole escalation authority for all loans above ₹50 lakhs.",
      ],
      updates: [
        "Approval matrix restructured from 2 tiers to 3 tiers for more granular oversight.",
        "Branch Manager authority reduced from ₹50 lakhs to ₹25 lakhs, introducing tighter controls for higher-value loans.",
      ],
    },
  },
  "ver-000_ver-001": {
    "Purpose & Scope": {
      additions: [],
      deletions: [
        "Clause about consistent evaluation across branches and regions was not present in this version.",
        "Explicit mention of salaried and self-employed applicants not included in scope.",
      ],
      updates: [
        "This is the earlier version with a simpler, more concise purpose and scope statement.",
      ],
    },
    "Age Requirements": {
      additions: [],
      deletions: [
        "Lower maximum age limits: 60 years (salaried) and 65 years (self-employed).",
      ],
      updates: [
        "This version has more conservative age limits compared to Version 1.2.",
      ],
    },
    "Credit Score Criteria": {
      additions: [],
      deletions: [
        "Only a basic minimum CIBIL score of 650 with no collateral-based consideration for borderline applicants.",
      ],
      updates: [
        "Simpler credit assessment without tiered evaluation.",
      ],
    },
    "Employment Stability": {
      additions: [],
      deletions: [
        "No employment stability requirements existed in this version.",
      ],
      updates: [],
    },
    "Loan-to-Value (LTV) Ratio": {
      additions: [],
      deletions: [],
      updates: [
        "More lenient LTV ratios: 90% (up to ₹30L), 85% (₹30L–₹75L), 80% (above ₹75L).",
      ],
    },
    "Approval Authority": {
      additions: [],
      deletions: [],
      updates: [
        "Simpler two-tier approval matrix with threshold at ₹50 lakhs.",
      ],
    },
  },
  "ver-002_ver-001b": {
    "Objective": {
      additions: [
        "Expanded objective to include competitive pricing and risk-adjusted returns.",
      ],
      deletions: [
        "Previous brief objective statement removed.",
      ],
      updates: [
        "Objective section expanded to better articulate policy intent.",
      ],
    },
    "Base Rate Structure": {
      additions: [],
      deletions: [],
      updates: [
        "Internal benchmark rate (IBR) reduced from 10.00% to 9.50% per annum.",
      ],
    },
    "Risk-Based Pricing Grid": {
      additions: [
        "Added 'Spread over IBR' column to the pricing grid for transparency.",
        "Added 'Decline' category for CIBIL scores below 650.",
      ],
      deletions: [],
      updates: [
        "Effective rates reduced across all risk categories due to lower IBR.",
        "Grid restructured with explicit spread information.",
      ],
    },
    "Tenure-Based Adjustments": {
      additions: [
        "Entirely new section introduced for tenure-based rate adjustments.",
        "Loans up to 12 months: no additional spread.",
        "Loans 13–36 months: +0.25% additional spread.",
        "Loans 37–60 months: +0.50% additional spread.",
      ],
      deletions: [],
      updates: [],
    },
    "Special Rate Considerations": {
      additions: [
        "New section with discount provisions for existing customers (0.25%), salary account holders (0.50%), and corporate tie-ups (up to 1.00%).",
      ],
      deletions: [],
      updates: [],
    },
    "Processing Fee": {
      additions: [
        "Added reduced processing fee of 1.5% for existing customers.",
        "Added minimum fee threshold of ₹1,000.",
      ],
      deletions: [],
      updates: [
        "Standard processing fee reduced from 2.5% to 2%.",
      ],
    },
    "Rate Reset Mechanism": {
      additions: [
        "New section: quarterly rate reset linked to IBR with 15 business days advance notice.",
      ],
      deletions: [],
      updates: [],
    },
  },
};

export const MOCK_POLICY_MANAGERS = [
  { id: "mock-user-001", first_name: "Sandbox", last_name: "User", email: "sandbox@policysandbox.dev" },
  { id: "mock-user-002", first_name: "John", last_name: "Manager", email: "john.manager@policysandbox.dev" },
];

export const MOCK_APPROVAL_REQUESTS = {
  pending: [
    {
      id: "apr-001",
      request_id: "apr-001",
      entity_type: "policy",
      entity_id: "pol-002",
      entity_name: "Personal Loan Interest Rate Policy",
      action: "update",
      status: "pending",
      maker_id: "mock-user-001",
      maker_name: "Sandbox User",
      maker_email: "sandbox@policysandbox.dev",
      created_at: "2026-02-10T11:30:00Z",
      module_name: "Policies",
      category_type: "Personal Loan",
    },
    {
      id: "apr-002",
      request_id: "apr-002",
      entity_type: "policy",
      entity_id: "pol-003",
      entity_name: "Vehicle Loan Documentation Policy",
      action: "create",
      status: "pending",
      maker_id: "mock-user-001",
      maker_name: "Sandbox User",
      maker_email: "sandbox@policysandbox.dev",
      created_at: "2026-02-20T08:00:00Z",
      module_name: "Policies",
      category_type: "Vehicle Loan",
    },
  ],
  all: [
    {
      id: "apr-001",
      request_id: "apr-001",
      entity_type: "policy",
      entity_id: "pol-002",
      entity_name: "Personal Loan Interest Rate Policy",
      action: "update",
      status: "pending",
      maker_id: "mock-user-001",
      maker_name: "Sandbox User",
      maker_email: "sandbox@policysandbox.dev",
      created_at: "2026-02-10T11:30:00Z",
      module_name: "Policies",
      category_type: "Personal Loan",
    },
    {
      id: "apr-002",
      request_id: "apr-002",
      entity_type: "policy",
      entity_id: "pol-003",
      entity_name: "Vehicle Loan Documentation Policy",
      action: "create",
      status: "pending",
      maker_id: "mock-user-001",
      maker_name: "Sandbox User",
      maker_email: "sandbox@policysandbox.dev",
      created_at: "2026-02-20T08:00:00Z",
      module_name: "Policies",
      category_type: "Vehicle Loan",
    },
    {
      id: "apr-003",
      request_id: "apr-003",
      entity_type: "policy",
      entity_id: "pol-001",
      entity_name: "Home Loan Eligibility Policy",
      action: "update",
      status: "approved",
      maker_id: "mock-user-001",
      maker_name: "Sandbox User",
      maker_email: "sandbox@policysandbox.dev",
      created_at: "2026-01-15T09:00:00Z",
      module_name: "Policies",
      category_type: "Home Loan",
    },
  ],
};

export const MOCK_APPROVAL_TIMELINE = [
  {
    id: "timeline-001",
    action: "created",
    actor_name: "Sandbox User",
    actor_email: "sandbox@policysandbox.dev",
    created_at: "2026-02-10T11:30:00Z",
    comment: "Submitted for review",
    status: "pending",
  },
  {
    id: "timeline-002",
    action: "approved",
    actor_name: "John Manager",
    actor_email: "john.manager@policysandbox.dev",
    created_at: "2026-02-11T14:00:00Z",
    comment: "Level 1 approved",
    status: "approved",
  },
];

export const MOCK_WORKFLOWS = [
  {
    id: "wf-001",
    name: "Policy Approval Workflow",
    module_id: "mod-001",
    module_name: "Policies",
    entity_types: ["policy"],
    status: "active",
    created_at: "2025-10-01T10:00:00Z",
    updated_at: "2026-01-15T10:00:00Z",
    levels: [
      { level: 1, user_type: "SPOC", user_ids: ["mock-user-001"], users: [{ id: "mock-user-001", name: "Sandbox User" }] },
      { level: 2, user_type: "ADMIN", user_ids: ["mock-user-002"], users: [{ id: "mock-user-002", name: "John Manager" }] },
    ],
  },
  {
    id: "wf-002",
    name: "User Management Workflow",
    module_id: "mod-002",
    module_name: "User Management",
    entity_types: ["user"],
    status: "active",
    created_at: "2025-11-01T10:00:00Z",
    updated_at: "2026-02-01T10:00:00Z",
    levels: [
      { level: 1, user_type: "ADMIN", user_ids: ["mock-user-002"], users: [{ id: "mock-user-002", name: "John Manager" }] },
    ],
  },
];

export const MOCK_MODULES = [
  { id: "mod-001", name: "Policies" },
  { id: "mod-002", name: "User Management" },
];

export const MOCK_COMMENTS = [
  {
    id: "cmt-001",
    request_id: "apr-001",
    comment: "Please review the updated interest rate calculations.",
    created_by: "mock-user-001",
    created_by_name: "Sandbox User",
    created_at: "2026-02-10T12:00:00Z",
  },
  {
    id: "cmt-002",
    request_id: "apr-001",
    comment: "Looks good. Minor formatting changes needed.",
    created_by: "mock-user-002",
    created_by_name: "John Manager",
    created_at: "2026-02-11T09:00:00Z",
  },
];

export const MOCK_APPROVAL_USERS: Record<string, Array<{ id: string; first_name: string; last_name: string; email: string; user_type: string }>> = {
  "cat-001": [
    { id: "mock-user-001", first_name: "Sandbox", last_name: "User", email: "sandbox@policysandbox.dev", user_type: "SPOC" },
    { id: "mock-user-002", first_name: "John", last_name: "Manager", email: "john.manager@policysandbox.dev", user_type: "ADMIN" },
  ],
  "cat-002": [
    { id: "mock-user-001", first_name: "Sandbox", last_name: "User", email: "sandbox@policysandbox.dev", user_type: "SPOC" },
  ],
};

export const MOCK_DB_SOURCES = [
  { value: "loan_db", label: "Loan Database", description: "Primary loan management database" },
  { value: "customer_db", label: "Customer Database", description: "Customer records and profiles" },
  { value: "analytics_db", label: "Analytics Database", description: "Business analytics and reporting data" },
];

export const MOCK_QUERYGEN_RESPONSES: Record<string, { sql: string; result: Record<string, unknown>[] }> = {
  default: {
    sql: `SELECT \n  c.customer_name,\n  l.loan_type,\n  l.loan_amount,\n  l.interest_rate,\n  l.status,\n  l.disbursement_date\nFROM loans l\nJOIN customers c ON l.customer_id = c.id\nWHERE l.status = 'active'\n  AND l.loan_amount > 500000\nORDER BY l.disbursement_date DESC\nLIMIT 10;`,
    result: [
      { customer_name: "Rahul Sharma", loan_type: "Home Loan", loan_amount: 2500000, interest_rate: 8.5, status: "active", disbursement_date: "2026-01-15" },
      { customer_name: "Priya Patel", loan_type: "Home Loan", loan_amount: 1800000, interest_rate: 8.75, status: "active", disbursement_date: "2026-01-10" },
      { customer_name: "Amit Kumar", loan_type: "Personal Loan", loan_amount: 750000, interest_rate: 12.0, status: "active", disbursement_date: "2025-12-20" },
      { customer_name: "Sneha Gupta", loan_type: "Vehicle Loan", loan_amount: 600000, interest_rate: 9.5, status: "active", disbursement_date: "2025-12-15" },
      { customer_name: "Vikram Singh", loan_type: "Home Loan", loan_amount: 3200000, interest_rate: 8.25, status: "active", disbursement_date: "2025-11-28" },
    ],
  },
};

export const MOCK_USERS = [
  {
    id: "mock-user-001",
    first_name: "Sandbox",
    last_name: "User",
    email: "sandbox@policysandbox.dev",
    phone_number: "+919876543210",
    user_type: UserType.SPOC,
    source_employee_id: "EMP-001",
    status: "active",
    is_disabled: false,
    created_at: "2025-06-01T10:00:00Z",
    category_ids: ["cat-001", "cat-002"],
    features: MOCK_ENABLED_FEATURES,
  },
  {
    id: "mock-user-002",
    first_name: "John",
    last_name: "Manager",
    email: "john.manager@policysandbox.dev",
    phone_number: "+919876543211",
    user_type: UserType.ADMIN,
    source_employee_id: "EMP-002",
    status: "active",
    is_disabled: false,
    created_at: "2025-05-15T10:00:00Z",
    category_ids: ["cat-001", "cat-002", "cat-003"],
    features: MOCK_ENABLED_FEATURES,
  },
  {
    id: "mock-user-003",
    first_name: "Alice",
    last_name: "Johnson",
    email: "alice.johnson@policysandbox.dev",
    phone_number: "+919876543212",
    user_type: UserType.SPOC,
    source_employee_id: "EMP-003",
    status: "active",
    is_disabled: false,
    created_at: "2025-07-01T10:00:00Z",
    category_ids: ["cat-001"],
    features: MOCK_ENABLED_FEATURES,
  },
  {
    id: "mock-user-004",
    first_name: "Bob",
    last_name: "Smith",
    email: "bob.smith@policysandbox.dev",
    phone_number: "+919876543213",
    user_type: UserType.STAFF_USER,
    source_employee_id: "EMP-004",
    status: "inactive",
    is_disabled: true,
    created_at: "2025-08-10T10:00:00Z",
    category_ids: ["cat-002"],
    features: [],
  },
];

export const MOCK_REQUEST_MAKERS = [
  { id: "mock-user-001", name: "Sandbox User" },
  { id: "mock-user-002", name: "John Manager" },
];

export interface PolicyChange {
  id: string;
  type: "addition" | "deletion" | "update";
  field: string;
  oldValue?: string;
  newValue?: string;
  htmlContent?: string;
  oldHtmlContent?: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
}

export const MOCK_POLICY_CHANGES: Record<string, PolicyChange[]> = {
  "apr-001": [
    {
      id: "chg-001",
      type: "update",
      field: "Objective",
      oldValue:
        "This policy outlines the interest rate guidelines for personal loans offered by the institution.",
      newValue:
        "This policy establishes the framework for determining interest rates applicable to personal loan products. It aims to maintain competitive pricing while ensuring adequate risk-adjusted returns.",
      oldHtmlContent:
        "<p>This policy outlines the interest rate guidelines for personal loans offered by the institution.</p>",
      htmlContent:
        '<p>This policy establishes the framework for determining interest rates applicable to personal loan products. It aims to maintain competitive pricing while ensuring adequate risk-adjusted returns.</p>',
      status: "pending",
    },
    {
      id: "chg-002",
      type: "update",
      field: "Base Rate Structure",
      oldValue:
        "All personal loan interest rates shall be linked to the organization's internal benchmark rate (IBR), currently set at 10.50% per annum.",
      newValue:
        "All personal loan interest rates shall be linked to the organization's internal benchmark rate (IBR), currently set at 9.50% per annum.",
      oldHtmlContent:
        '<p>All personal loan interest rates shall be linked to the organization\u2019s internal benchmark rate (IBR), currently set at <strong>10.50% per annum</strong>.</p>',
      htmlContent:
        '<p>All personal loan interest rates shall be linked to the organization\u2019s internal benchmark rate (IBR), currently set at <strong>9.50% per annum</strong>.</p>',
      status: "pending",
    },
    {
      id: "chg-003",
      type: "update",
      field: "Existing Customer Discount",
      oldValue:
        "Customers with an existing relationship of more than 3 years are eligible for a 0.15% discount on the applicable rate.",
      newValue:
        "Customers with an existing relationship of more than 2 years are eligible for a 0.25% discount on the applicable rate.",
      oldHtmlContent:
        '<p>Customers with an existing relationship of more than 3 years are eligible for a <strong>0.15% discount</strong> on the applicable rate.</p>',
      htmlContent:
        '<p>Customers with an existing relationship of more than 2 years are eligible for a <strong>0.25% discount</strong> on the applicable rate.</p>',
      status: "pending",
    },
    {
      id: "chg-004",
      type: "addition",
      field: "Rate Reset Mechanism",
      newValue:
        "Interest rates on floating-rate personal loans shall be reset on a quarterly basis, linked to the prevailing IBR. Borrowers shall be notified at least 15 business days before any rate change takes effect.",
      htmlContent:
        '<p>Interest rates on floating-rate personal loans shall be reset on a <strong>quarterly basis</strong>, linked to the prevailing IBR. Borrowers shall be notified at least <strong>15 business days</strong> before any rate change takes effect.</p>',
      status: "pending",
    },
    {
      id: "chg-005",
      type: "deletion",
      field: "Legacy Flat Rate Clause",
      oldValue:
        "For loans under \u20B950,000, a flat processing fee of \u20B9500 and fixed interest rate of 12% shall apply regardless of credit profile.",
      oldHtmlContent:
        '<p>For loans under \u20B950,000, a flat processing fee of \u20B9500 and fixed interest rate of 12% shall apply regardless of credit profile.</p>',
      status: "pending",
    },
    {
      id: "chg-006",
      type: "addition",
      field: "Salary Account Holders",
      newValue:
        "Applicants with salary accounts in the organization receive a 0.50% discount on the applicable rate.",
      htmlContent:
        '<p>Applicants with salary accounts in the organization receive a <strong>0.50% discount</strong> on the applicable rate.</p>',
      status: "pending",
    },
  ],
  "apr-002": [
    {
      id: "chg-101",
      type: "addition",
      field: "Introduction",
      newValue:
        "This policy prescribes the mandatory documentation requirements for all vehicle loan applications. Proper documentation is essential for risk assessment, regulatory compliance, and audit readiness.",
      htmlContent:
        '<p>This policy prescribes the mandatory documentation requirements for all vehicle loan applications. Proper documentation is essential for risk assessment, regulatory compliance, and audit readiness.</p>',
      status: "pending",
    },
    {
      id: "chg-102",
      type: "addition",
      field: "Identity Verification",
      newValue:
        "At least two of the following must be provided:",
      htmlContent:
        '<p>At least <strong>two</strong> of the following must be provided:</p>',
      status: "pending",
    },
    {
      id: "chg-103",
      type: "addition",
      field: "Identity Verification",
      newValue:
        "PAN Card (mandatory) Aadhaar Card Voter ID Passport Driving License",
      htmlContent:
        '<ul><li>PAN Card (mandatory)</li><li>Aadhaar Card</li><li>Voter ID</li><li>Passport</li><li>Driving License</li></ul>',
      status: "pending",
    },
    {
      id: "chg-104",
      type: "addition",
      field: "New Vehicles",
      newValue:
        "Proforma invoice from authorized dealer Insurance quotation Dealer confirmation letter",
      htmlContent:
        '<ol><li>Proforma invoice from authorized dealer</li><li>Insurance quotation</li><li>Dealer confirmation letter</li></ol>',
      status: "pending",
    },
    {
      id: "chg-105",
      type: "addition",
      field: "Document Retention",
      newValue:
        "All original documents shall be retained in the branch vault for the tenure of the loan plus 8 years after closure, as per regulatory requirements.",
      htmlContent:
        '<p>All original documents shall be retained in the branch vault for the tenure of the loan plus <strong>8 years</strong> after closure, as per regulatory requirements.</p>',
      status: "pending",
    },
    {
      id: "chg-106",
      type: "addition",
      field: "Disclaimer",
      newValue:
        "This is a sample policy document for demonstration purposes. All requirements and processes are fictional.",
      htmlContent:
        '<p><em>This is a sample policy document for demonstration purposes. All requirements and processes are fictional.</em></p>',
      status: "pending",
    },
  ],
};
