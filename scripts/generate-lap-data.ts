/**
 * Godrej Capital - Loan Against Property (LAP) Mock Database Generator
 *
 * Generates realistic data for an NBFC LAP portfolio with:
 * - 25 branches across major Indian metro/tier-1 cities
 * - ~100 employees (RMs, credit officers, branch managers)
 * - ~2500 customers with Indian demographics
 * - ~2500 properties (collateral)
 * - ~2500 credit bureau reports
 * - ~2000 loan applications
 * - ~1200 sanctioned loans
 * - ~2000 disbursement tranches
 * - ~15000 EMI records (12-18 months)
 * - ~500 collection actions
 *
 * Run: npx tsx scripts/generate-lap-data.ts
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import {
  BASELINE_POLICY,
  evaluatePolicy,
  getPrimaryRejectionReason,
  PolicySnapshot,
} from "../src/components/QueryGen2/utils/policyEngine";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Seed-based PRNG for reproducibility ────────────────────────────────────
let _seed = 42;
function seededRandom(): number {
  _seed = (_seed * 16807 + 0) % 2147483647;
  return (_seed - 1) / 2147483646;
}
function randInt(min: number, max: number): number {
  return Math.floor(seededRandom() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}
function pickWeighted<T>(arr: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = seededRandom() * total;
  for (let i = 0; i < arr.length; i++) {
    r -= weights[i];
    if (r <= 0) return arr[i];
  }
  return arr[arr.length - 1];
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function gaussianRandom(mean: number, stddev: number): number {
  const u1 = seededRandom();
  const u2 = seededRandom();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * stddev;
}

// ─── Date utilities ─────────────────────────────────────────────────────────
function randomDate(start: Date, end: Date): Date {
  const t = start.getTime() + seededRandom() * (end.getTime() - start.getTime());
  return new Date(t);
}
function addMonths(d: Date, months: number): Date {
  const r = new Date(d);
  r.setMonth(r.getMonth() + months);
  return r;
}
function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}
function fmt(d: Date): string {
  return d.toISOString().split("T")[0];
}

function yearsBetween(startDate: Date, endDate: Date): number {
  const diffMs = endDate.getTime() - startDate.getTime();
  return Math.max(0, diffMs / (365.25 * 24 * 60 * 60 * 1000));
}

// ─── Reference data ─────────────────────────────────────────────────────────

const INDIAN_FIRST_NAMES_MALE = [
  "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
  "Shaurya", "Atharva", "Advait", "Pranav", "Kabir", "Dhruv", "Ritvik", "Aarush", "Kian", "Darsh",
  "Rohan", "Rahul", "Amit", "Vikram", "Suresh", "Rajesh", "Manoj", "Deepak", "Sanjay", "Ankit",
  "Gaurav", "Nikhil", "Pankaj", "Sachin", "Ashish", "Ravi", "Ajay", "Kunal", "Mohit", "Harsh",
  "Tushar", "Varun", "Akash", "Pradeep", "Naveen", "Rakesh", "Dinesh", "Hemant", "Yogesh", "Lalit",
  "Manish", "Tarun", "Vinod", "Sandeep", "Harish", "Ramesh", "Gopal", "Kishore", "Jayesh", "Nilesh",
  "Pramod", "Ashok", "Bharat", "Chetan", "Devendra", "Ganesh", "Hitesh", "Jitendra", "Kamlesh", "Mukesh",
];
const INDIAN_FIRST_NAMES_FEMALE = [
  "Saanvi", "Aanya", "Aadhya", "Aaradhya", "Ananya", "Pari", "Anika", "Navya", "Angel", "Diya",
  "Myra", "Sara", "Iraa", "Ahana", "Anvi", "Prisha", "Riya", "Aarohi", "Anaya", "Pihu",
  "Neha", "Priya", "Pooja", "Swati", "Anjali", "Kavita", "Sunita", "Meena", "Rekha", "Seema",
  "Nisha", "Divya", "Komal", "Sneha", "Pallavi", "Shruti", "Deepa", "Rashmi", "Geeta", "Lata",
  "Shalini", "Archana", "Bharti", "Chhaya", "Durga", "Ekta", "Farha", "Garima", "Heena", "Isha",
];
const INDIAN_LAST_NAMES = [
  "Sharma", "Verma", "Gupta", "Singh", "Kumar", "Patel", "Reddy", "Nair", "Iyer", "Rao",
  "Joshi", "Desai", "Mehta", "Shah", "Thakur", "Mishra", "Pandey", "Tiwari", "Chauhan", "Yadav",
  "Agarwal", "Bansal", "Chopra", "Dhawan", "Goel", "Jain", "Kapoor", "Malhotra", "Saxena", "Bhatia",
  "Pillai", "Menon", "Kulkarni", "Patil", "Deshpande", "Naik", "Shetty", "Hegde", "Bhat", "Kamath",
  "Das", "Bose", "Ghosh", "Mukherjee", "Chatterjee", "Sengupta", "Dutta", "Roy", "Banerjee", "Sarkar",
  "Rathore", "Solanki", "Parmar", "Trivedi", "Dave", "Bhatt", "Parekh", "Kothari", "Sinha", "Prasad",
];

const EMPLOYER_NAMES_SALARIED = [
  "Tata Consultancy Services", "Infosys Limited", "Wipro Technologies", "HCL Technologies",
  "Tech Mahindra", "Reliance Industries", "HDFC Bank", "ICICI Bank", "State Bank of India",
  "Bajaj Finance", "Larsen & Toubro", "Mahindra & Mahindra", "Bharti Airtel", "ITC Limited",
  "Hindustan Unilever", "Maruti Suzuki", "Asian Paints", "Titan Company", "Godrej Industries",
  "Adani Group", "Kotak Mahindra Bank", "Axis Bank", "Yes Bank", "IndusInd Bank",
  "Cipla", "Sun Pharma", "Dr. Reddy's", "Grasim Industries", "UltraTech Cement",
  "JSW Steel", "Power Grid Corporation", "NTPC", "ONGC", "Indian Oil Corporation",
  "Central Government", "State Government", "Indian Railways", "Indian Army", "Indian Navy",
];
const BUSINESS_TYPES = [
  "Textile Trading", "Construction Materials", "Auto Parts Dealer", "Grocery Wholesale",
  "Garment Manufacturing", "Jewellery Shop", "Restaurant Chain", "Real Estate Developer",
  "IT Services Firm", "Pharma Distribution", "Electronics Retail", "Dairy Products",
  "Agriculture Trading", "Transport & Logistics", "Steel Trading", "Chemical Manufacturing",
  "Printing Press", "Furniture Manufacturing", "Event Management", "Healthcare Clinic",
];

interface BranchDef {
  city: string;
  state: string;
  region: string;
  pincode_prefix: string;
}
const BRANCH_LOCATIONS: BranchDef[] = [
  { city: "Mumbai", state: "Maharashtra", region: "West", pincode_prefix: "400" },
  { city: "Thane", state: "Maharashtra", region: "West", pincode_prefix: "400" },
  { city: "Navi Mumbai", state: "Maharashtra", region: "West", pincode_prefix: "400" },
  { city: "Pune", state: "Maharashtra", region: "West", pincode_prefix: "411" },
  { city: "Delhi", state: "Delhi", region: "North", pincode_prefix: "110" },
  { city: "Gurugram", state: "Haryana", region: "North", pincode_prefix: "122" },
  { city: "Noida", state: "Uttar Pradesh", region: "North", pincode_prefix: "201" },
  { city: "Bangalore", state: "Karnataka", region: "South", pincode_prefix: "560" },
  { city: "Hyderabad", state: "Telangana", region: "South", pincode_prefix: "500" },
  { city: "Chennai", state: "Tamil Nadu", region: "South", pincode_prefix: "600" },
  { city: "Kolkata", state: "West Bengal", region: "East", pincode_prefix: "700" },
  { city: "Ahmedabad", state: "Gujarat", region: "West", pincode_prefix: "380" },
  { city: "Surat", state: "Gujarat", region: "West", pincode_prefix: "395" },
  { city: "Jaipur", state: "Rajasthan", region: "North", pincode_prefix: "302" },
  { city: "Lucknow", state: "Uttar Pradesh", region: "North", pincode_prefix: "226" },
  { city: "Chandigarh", state: "Chandigarh", region: "North", pincode_prefix: "160" },
  { city: "Indore", state: "Madhya Pradesh", region: "Central", pincode_prefix: "452" },
  { city: "Nagpur", state: "Maharashtra", region: "Central", pincode_prefix: "440" },
  { city: "Coimbatore", state: "Tamil Nadu", region: "South", pincode_prefix: "641" },
  { city: "Kochi", state: "Kerala", region: "South", pincode_prefix: "682" },
  { city: "Visakhapatnam", state: "Andhra Pradesh", region: "South", pincode_prefix: "530" },
  { city: "Bhubaneswar", state: "Odisha", region: "East", pincode_prefix: "751" },
  { city: "Patna", state: "Bihar", region: "East", pincode_prefix: "800" },
  { city: "Vadodara", state: "Gujarat", region: "West", pincode_prefix: "390" },
  { city: "Nashik", state: "Maharashtra", region: "West", pincode_prefix: "422" },
];

const DESIGNATIONS = ["Relationship Manager", "Senior RM", "Credit Officer", "Branch Manager", "Collections Officer"];
const EMPLOYMENT_TYPES = ["Salaried", "Self-Employed Professional", "Self-Employed Business"];
const PROPERTY_TYPES = ["Residential", "Commercial"];
const PROPERTY_SUB_TYPES_RESIDENTIAL = ["Flat/Apartment", "Independent House", "Villa", "Row House", "Builder Floor"];
const PROPERTY_SUB_TYPES_COMMERCIAL = ["Office Space", "Shop/Showroom", "Warehouse", "Industrial Shed"];
const OWNERSHIP_TYPES = ["Freehold", "Leasehold"];
const LOAN_PURPOSES = [
  "Business Expansion", "Working Capital", "Debt Consolidation",
  "Child Education", "Medical Emergency", "Home Renovation",
  "Marriage Expenses", "Equipment Purchase", "Property Purchase", "Personal Needs",
];
const APPLICATION_STATUSES = ["Submitted", "Under Review", "Approved", "Rejected", "Withdrawn", "Disbursed"];
const LOAN_STATUSES = ["Active", "Closed", "NPA", "Written Off", "Foreclosed"];
const DISBURSEMENT_MODES = ["NEFT", "RTGS", "Demand Draft"];
const BANK_NAMES = [
  "HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra Bank",
  "Bank of Baroda", "Punjab National Bank", "Canara Bank", "Union Bank of India", "Indian Bank",
];
const BUREAU_NAMES = ["CIBIL", "Experian", "CRIF High Mark"];
const COLLECTION_ACTIONS = ["Phone Call", "SMS Reminder", "Email Notice", "Field Visit", "Legal Notice", "SARFAESI Notice"];
const COLLECTION_OUTCOMES = ["Promise to Pay", "Partial Payment", "No Response", "Dispute Raised", "Payment Received", "Settled"];

const REJECTION_REASONS = [
  "Low CIBIL score", "Insufficient income", "Property title unclear",
  "High existing obligations", "Incomplete documentation", "Negative area",
  "Overvalued property", "Business vintage < 3 years", "High FOIR",
  "Legal dispute on property",
];

const LOCALITY_NAMES: Record<string, string[]> = {
  Mumbai: ["Andheri West", "Bandra East", "Borivali West", "Powai", "Goregaon East", "Malad West", "Vikhroli", "Chembur", "Dadar West", "Worli"],
  Thane: ["Ghodbunder Road", "Majiwada", "Manpada", "Pokhran Road", "Hiranandani Meadows", "Kolshet Road"],
  "Navi Mumbai": ["Vashi", "Kharghar", "Panvel", "Airoli", "Belapur", "Nerul"],
  Pune: ["Hinjewadi", "Kothrud", "Wakad", "Baner", "Aundh", "Viman Nagar", "Hadapsar", "Magarpatta"],
  Delhi: ["Dwarka", "Rohini", "Janakpuri", "Lajpat Nagar", "Saket", "Vasant Kunj", "Pitampura", "Karol Bagh"],
  Gurugram: ["Sector 49", "Sector 56", "Golf Course Road", "Sohna Road", "MG Road", "Sector 82"],
  Noida: ["Sector 62", "Sector 137", "Sector 150", "Greater Noida West", "Sector 76", "Sector 44"],
  Bangalore: ["Whitefield", "Electronic City", "Marathahalli", "HSR Layout", "Koramangala", "JP Nagar", "Yelahanka", "Hebbal"],
  Hyderabad: ["Gachibowli", "Madhapur", "Kondapur", "Kukatpally", "Banjara Hills", "Manikonda", "Miyapur"],
  Chennai: ["Anna Nagar", "Velachery", "OMR", "T. Nagar", "Adyar", "Porur", "Tambaram", "Sholinganallur"],
  Kolkata: ["Salt Lake", "New Town", "Rajarhat", "Behala", "Garia", "Ballygunge", "Howrah"],
  Ahmedabad: ["SG Highway", "Prahlad Nagar", "Satellite", "Bodakdev", "Thaltej", "Vastrapur", "Navrangpura"],
  Surat: ["Adajan", "Vesu", "Piplod", "Athwa", "City Light", "Pal"],
  Jaipur: ["Vaishali Nagar", "Malviya Nagar", "Mansarovar", "C-Scheme", "Tonk Road", "Jagatpura"],
  Lucknow: ["Gomti Nagar", "Hazratganj", "Aliganj", "Indira Nagar", "Mahanagar"],
  Chandigarh: ["Sector 17", "Sector 22", "Sector 35", "Sector 43", "Mohali Phase 5"],
  Indore: ["Vijay Nagar", "Scheme 78", "AB Road", "Palasia", "South Tukoganj"],
  Nagpur: ["Dharampeth", "Sadar", "Civil Lines", "Ramdaspeth", "Manewada"],
  Coimbatore: ["RS Puram", "Gandhipuram", "Peelamedu", "Saravanampatti", "Singanallur"],
  Kochi: ["Edappally", "Kakkanad", "Palarivattom", "Vyttila", "Aluva"],
  Visakhapatnam: ["Madhurawada", "Gajuwaka", "MVP Colony", "Seethammadhara", "Rushikonda"],
  Bhubaneswar: ["Saheed Nagar", "Patia", "Chandrasekharpur", "Jaydev Vihar", "Nayapalli"],
  Patna: ["Boring Road", "Kankarbagh", "Bailey Road", "Rajendra Nagar", "Patliputra Colony"],
  Vadodara: ["Alkapuri", "Gotri", "Manjalpur", "Karelibaug", "Akota"],
  Nashik: ["College Road", "Gangapur Road", "Indira Nagar", "Cidco", "Panchavati"],
};

// ─── Generators ─────────────────────────────────────────────────────────────

function generatePAN(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let pan = "";
  for (let i = 0; i < 5; i++) pan += pick(letters.split(""));
  for (let i = 0; i < 4; i++) pan += randInt(0, 9);
  pan += pick(letters.split(""));
  return pan;
}

function generatePhone(): string {
  const prefixes = ["98", "97", "96", "95", "94", "93", "91", "90", "88", "87", "86", "85", "70", "73", "74", "75", "76", "77", "78", "79"];
  return pick(prefixes) + String(randInt(10000000, 99999999));
}

function generateAccountNumber(): string {
  return String(randInt(1000, 9999)) + String(randInt(10000000, 99999999));
}

function computeEMI(principal: number, annualRate: number, tenureMonths: number): number {
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / tenureMonths;
  const emi = (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
  return Math.round(emi);
}

// ─── Main generation ────────────────────────────────────────────────────────

interface Branch { branch_id: string; branch_name: string; city: string; state: string; region: string; branch_type: string; opened_date: string; }
interface Employee { employee_id: string; employee_name: string; designation: string; branch_id: string; joining_date: string; is_active: boolean; }
interface Customer { customer_id: string; first_name: string; last_name: string; date_of_birth: string; gender: string; pan_number: string; phone_number: string; email: string; city: string; state: string; pincode: string; employment_type: string; employer_name: string; annual_income: number; employment_start_date: string; created_at: string; }
interface Property { property_id: string; customer_id: string; property_type: string; property_sub_type: string; address: string; city: string; state: string; pincode: string; carpet_area_sqft: number; market_value: number; registered_value: number; construction_year: number; ownership_type: string; }
interface CreditBureauReport { report_id: string; customer_id: string; bureau_name: string; score: number; report_date: string; existing_loans_count: number; inquiries_last_6m: number; inquiries_last_12m: number; total_outstanding: number; delinquency_flag: string; dpd_max_12m: number; }
interface LoanApplication { application_id: string; customer_id: string; property_id: string; employee_id: string; branch_id: string; applied_amount: number; purpose: string; application_date: string; applicant_age_years: number; applicant_annual_income: number; applicant_employment_tenure_years: number; applicant_bureau_score: number; applicant_inquiries_last_6m: number; applicant_total_outstanding: number; applicant_foir: number; applicant_ltv: number; status: string; rejection_reason: string | null; approved_date: string | null; }
interface Loan { loan_id: string; application_id: string; customer_id: string; sanctioned_amount: number; disbursed_amount: number; interest_rate: number; tenure_months: number; emi_amount: number; disbursement_date: string; maturity_date: string; ltv_ratio: number; loan_status: string; npa_date: string | null; closure_date: string | null; }
interface Disbursement { disbursement_id: string; loan_id: string; tranche_number: number; amount: number; disbursement_date: string; disbursement_mode: string; bank_account_number: string; bank_name: string; }
interface EMIRecord { emi_id: string; loan_id: string; emi_number: number; due_date: string; emi_amount: number; principal_component: number; interest_component: number; payment_date: string | null; payment_amount: number | null; status: string; dpd: number; penalty_amount: number; }
interface CollectionAction { collection_id: string; loan_id: string; action_date: string; action_type: string; action_by: string; outcome: string; remarks: string; next_followup_date: string | null; }

function generate() {
  const DATA_START = new Date("2023-01-01");
  const DATA_END = new Date("2025-12-31");
  const TODAY = new Date("2026-03-12");

  // ─── Branches ───
  const branches: Branch[] = BRANCH_LOCATIONS.map((loc, i) => ({
    branch_id: `BR${String(i + 1).padStart(3, "0")}`,
    branch_name: `Godrej Capital - ${loc.city}`,
    city: loc.city,
    state: loc.state,
    region: loc.region,
    branch_type: i < 8 ? "Hub" : i < 16 ? "Spoke" : "Satellite",
    opened_date: fmt(randomDate(new Date("2019-01-01"), new Date("2023-06-01"))),
  }));

  // ─── Employees ───
  const employees: Employee[] = [];
  for (let i = 0; i < 100; i++) {
    const branch = branches[i % branches.length];
    const isMale = seededRandom() > 0.35;
    const firstName = isMale ? pick(INDIAN_FIRST_NAMES_MALE) : pick(INDIAN_FIRST_NAMES_FEMALE);
    const lastName = pick(INDIAN_LAST_NAMES);

    let designation: string;
    if (i < 25) designation = "Branch Manager";
    else if (i < 45) designation = "Credit Officer";
    else if (i < 85) designation = "Relationship Manager";
    else designation = "Collections Officer";

    employees.push({
      employee_id: `EMP${String(i + 1).padStart(4, "0")}`,
      employee_name: `${firstName} ${lastName}`,
      designation,
      branch_id: branch.branch_id,
      joining_date: fmt(randomDate(new Date("2019-06-01"), new Date("2024-01-01"))),
      is_active: seededRandom() > 0.05,
    });
  }
  const rms = employees.filter((e) => e.designation === "Relationship Manager" || e.designation === "Senior RM");
  const collectionOfficers = employees.filter((e) => e.designation === "Collections Officer");

  // ─── Customers ───
  const customers: Customer[] = [];
  for (let i = 0; i < 2500; i++) {
    const isMale = seededRandom() > 0.3;
    const firstName = isMale ? pick(INDIAN_FIRST_NAMES_MALE) : pick(INDIAN_FIRST_NAMES_FEMALE);
    const lastName = pick(INDIAN_LAST_NAMES);
    const branchLoc = pick(BRANCH_LOCATIONS);
    const empType = pickWeighted(EMPLOYMENT_TYPES, [45, 20, 35]);

    let income: number;
    if (empType === "Salaried") {
      income = Math.round(gaussianRandom(1200000, 600000) / 10000) * 10000;
      income = Math.max(300000, Math.min(5000000, income));
    } else {
      income = Math.round(gaussianRandom(1800000, 1000000) / 10000) * 10000;
      income = Math.max(400000, Math.min(15000000, income));
    }

    const employer = empType === "Salaried"
      ? pick(EMPLOYER_NAMES_SALARIED)
      : empType === "Self-Employed Business"
      ? pick(BUSINESS_TYPES)
      : `${firstName} ${lastName} & Associates`;

    const dob = randomDate(new Date("1960-01-01"), new Date("1998-12-31"));
    const createdAt = randomDate(DATA_START, DATA_END);
    const ageAtCreate = yearsBetween(dob, createdAt);
    const maxWorkingYears = Math.max(1, Math.floor(ageAtCreate - 18));
    const employmentTenureYears = Math.min(
      maxWorkingYears,
      empType === "Salaried"
        ? randInt(1, 18)
        : empType === "Self-Employed Professional"
        ? randInt(1, 16)
        : randInt(1, 22)
    );
    const employmentStartDate = addMonths(
      createdAt,
      -employmentTenureYears * 12 - randInt(0, 10)
    );

    customers.push({
      customer_id: `CUST${String(i + 1).padStart(5, "0")}`,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: fmt(dob),
      gender: isMale ? "Male" : "Female",
      pan_number: generatePAN(),
      phone_number: generatePhone(),
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randInt(1, 99)}@${pick(["gmail.com", "yahoo.co.in", "outlook.com", "hotmail.com"])}`,
      city: branchLoc.city,
      state: branchLoc.state,
      pincode: branchLoc.pincode_prefix + String(randInt(10, 99)).padStart(2, "0") + String(randInt(0, 9)),
      employment_type: empType,
      employer_name: employer,
      annual_income: income,
      employment_start_date: fmt(employmentStartDate),
      created_at: fmt(createdAt),
    });
  }

  // ─── Properties ───
  const properties: Property[] = [];
  for (let i = 0; i < 2500; i++) {
    const cust = customers[i];
    const branchLoc = BRANCH_LOCATIONS.find((b) => b.city === cust.city)!;
    const propType = pickWeighted(PROPERTY_TYPES, [75, 25]);
    const subType = propType === "Residential" ? pick(PROPERTY_SUB_TYPES_RESIDENTIAL) : pick(PROPERTY_SUB_TYPES_COMMERCIAL);

    let area: number, marketValuePerSqft: number;
    if (propType === "Residential") {
      area = randInt(500, 3000);
      const cityTier = ["Mumbai", "Delhi", "Bangalore", "Gurugram"].includes(cust.city) ? "metro" :
        ["Pune", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Thane", "Navi Mumbai", "Noida"].includes(cust.city) ? "tier1" : "tier2";
      marketValuePerSqft = cityTier === "metro" ? randInt(8000, 25000) :
        cityTier === "tier1" ? randInt(4000, 15000) : randInt(2500, 8000);
    } else {
      area = randInt(300, 5000);
      marketValuePerSqft = randInt(5000, 20000);
    }

    const marketValue = Math.round((area * marketValuePerSqft) / 100000) * 100000;
    const registeredValue = Math.round(marketValue * (0.7 + seededRandom() * 0.2) / 100000) * 100000;
    const localities = LOCALITY_NAMES[cust.city] || ["Main Road Area"];

    properties.push({
      property_id: `PROP${String(i + 1).padStart(5, "0")}`,
      customer_id: cust.customer_id,
      property_type: propType,
      property_sub_type: subType,
      address: `${randInt(1, 500)}, ${pick(localities)}, ${cust.city}`,
      city: cust.city,
      state: cust.state,
      pincode: cust.pincode,
      carpet_area_sqft: area,
      market_value: marketValue,
      registered_value: registeredValue,
      construction_year: randInt(1985, 2024),
      ownership_type: pickWeighted(OWNERSHIP_TYPES, [80, 20]),
    });
  }

  // ─── Credit Bureau Reports ───
  const creditReports: CreditBureauReport[] = [];
  for (let i = 0; i < 2500; i++) {
    const cust = customers[i];
    const score = Math.round(
      gaussianRandom(720, 80)
    );
    const clampedScore = Math.max(300, Math.min(900, score));
    const existingLoans = clampedScore > 750 ? randInt(0, 3) : clampedScore > 650 ? randInt(1, 5) : randInt(2, 8);
    const inquiriesLast6m = clampedScore > 760 ? randInt(0, 2) : clampedScore > 680 ? randInt(1, 4) : randInt(3, 8);
    const outstanding = existingLoans * randInt(100000, 2000000);

    creditReports.push({
      report_id: `CBR${String(i + 1).padStart(5, "0")}`,
      customer_id: cust.customer_id,
      bureau_name: pick(BUREAU_NAMES),
      score: clampedScore,
      report_date: cust.created_at,
      existing_loans_count: existingLoans,
      inquiries_last_6m: inquiriesLast6m,
      inquiries_last_12m: inquiriesLast6m + randInt(0, 5),
      total_outstanding: outstanding,
      delinquency_flag: clampedScore < 650 ? (seededRandom() > 0.4 ? "Y" : "N") : (seededRandom() > 0.9 ? "Y" : "N"),
      dpd_max_12m: clampedScore < 650 ? randInt(0, 180) : clampedScore < 750 ? randInt(0, 30) : 0,
    });
  }

  // ─── Loan Applications ───
  const loanApplications: LoanApplication[] = [];
  const custIndices = shuffle(Array.from({ length: 2500 }, (_, i) => i));
  const applicantCount = 2000;

  for (let i = 0; i < applicantCount; i++) {
    const custIdx = custIndices[i];
    const cust = customers[custIdx];
    const prop = properties[custIdx];
    const cbr = creditReports[custIdx];
    const branchIdx = BRANCH_LOCATIONS.findIndex((b) => b.city === cust.city);
    const branch = branches[branchIdx >= 0 ? branchIdx : 0];
    const rm = pick(rms);

    const ltv = 0.4 + seededRandom() * 0.3; // 40-70% LTV
    const appliedAmount = Math.round((prop.market_value * ltv) / 100000) * 100000;
    const appDate = randomDate(new Date(cust.created_at), addMonths(new Date(cust.created_at), 2));
    const applicantAgeYears = Number(yearsBetween(new Date(cust.date_of_birth), appDate).toFixed(1));
    const applicantEmploymentTenureYears = Number(
      yearsBetween(new Date(cust.employment_start_date), appDate).toFixed(1)
    );
    const monthlyIncome = cust.annual_income / 12;
    const existingMonthlyObligation =
      cbr.existing_loans_count * randInt(1500, 6000) +
      cbr.total_outstanding * (0.0005 + seededRandom() * 0.0008);
    const indicativeEmi = computeEMI(appliedAmount, 11.25, 180);
    const applicantFoir = Number(
      (
        (existingMonthlyObligation + indicativeEmi) /
        Math.max(monthlyIncome, 1)
      ).toFixed(2)
    );
    const applicantLtv = Number((appliedAmount / prop.market_value).toFixed(2));
    const applicationSnapshot: PolicySnapshot = {
      application_id: `APP${String(i + 1).padStart(5, "0")}`,
      age_years: applicantAgeYears,
      annual_income: cust.annual_income,
      employment_tenure_years: applicantEmploymentTenureYears,
      bureau_score: cbr.score,
      inquiries_last_6m: cbr.inquiries_last_6m,
      total_outstanding: cbr.total_outstanding,
      foir: applicantFoir,
      ltv: applicantLtv,
    };
    const evaluation = evaluatePolicy(applicationSnapshot, BASELINE_POLICY);

    let status: string;
    let rejectionReason: string | null = null;
    let approvedDate: string | null = null;

    if (evaluation.eligible) {
      status = pickWeighted(["Disbursed", "Approved", "Under Review"], [68, 20, 12]);
      if (status === "Approved" || status === "Disbursed") approvedDate = fmt(addDays(appDate, randInt(7, 25)));
    } else {
      status = pickWeighted(["Rejected", "Under Review", "Withdrawn"], [82, 10, 8]);
      rejectionReason =
        status === "Rejected"
          ? getPrimaryRejectionReason(evaluation) || pick(REJECTION_REASONS)
          : null;
    }

    loanApplications.push({
      application_id: `APP${String(i + 1).padStart(5, "0")}`,
      customer_id: cust.customer_id,
      property_id: prop.property_id,
      employee_id: rm.employee_id,
      branch_id: branch.branch_id,
      applied_amount: appliedAmount,
      purpose: pick(LOAN_PURPOSES),
      application_date: fmt(appDate),
      applicant_age_years: applicantAgeYears,
      applicant_annual_income: cust.annual_income,
      applicant_employment_tenure_years: applicantEmploymentTenureYears,
      applicant_bureau_score: cbr.score,
      applicant_inquiries_last_6m: cbr.inquiries_last_6m,
      applicant_total_outstanding: cbr.total_outstanding,
      applicant_foir: applicantFoir,
      applicant_ltv: applicantLtv,
      status,
      rejection_reason: rejectionReason,
      approved_date: approvedDate,
    });
  }

  // ─── Loans (from Approved/Disbursed applications) ───
  const loans: Loan[] = [];
  const disbursedApps = loanApplications.filter((a) => a.status === "Disbursed");
  const approvedOnlyApps = loanApplications.filter((a) => a.status === "Approved");

  const allLoanApps = [...disbursedApps, ...approvedOnlyApps.slice(0, Math.floor(approvedOnlyApps.length * 0.3))];

  for (let i = 0; i < allLoanApps.length; i++) {
    const app = allLoanApps[i];
    const prop = properties.find((p) => p.property_id === app.property_id)!;
    const custIncome = customers.find((c) => c.customer_id === app.customer_id)!.annual_income;

    const sanctionedAmount = Math.round(app.applied_amount * (0.85 + seededRandom() * 0.15) / 100000) * 100000;
    const interestRate = Math.round((9 + seededRandom() * 4) * 100) / 100; // 9-13%
    const tenureMonths = pick([60, 84, 120, 144, 180, 240]); // 5-20 years
    const emi = computeEMI(sanctionedAmount, interestRate, tenureMonths);

    // Ensure FOIR < 60% for realism
    const monthlyIncome = custIncome / 12;
    const adjustedEmi = Math.min(emi, Math.round(monthlyIncome * 0.55));
    const finalSanctioned = adjustedEmi < emi ? Math.round(sanctionedAmount * (adjustedEmi / emi) / 100000) * 100000 : sanctionedAmount;
    const finalEmi = computeEMI(finalSanctioned, interestRate, tenureMonths);

    const disbDate = new Date(app.approved_date!);
    disbDate.setDate(disbDate.getDate() + randInt(3, 15));

    const ltv = Math.round((finalSanctioned / prop.market_value) * 100) / 100;

    // Determine loan status based on time
    let loanStatus: string;
    let npaDate: string | null = null;
    let closureDate: string | null = null;

    const monthsSinceDisbursement = Math.floor((TODAY.getTime() - disbDate.getTime()) / (30.44 * 24 * 60 * 60 * 1000));

    if (monthsSinceDisbursement >= tenureMonths) {
      loanStatus = "Closed";
      closureDate = fmt(addMonths(disbDate, tenureMonths));
    } else if (seededRandom() < 0.06) {
      loanStatus = "NPA";
      npaDate = fmt(addMonths(disbDate, randInt(6, Math.min(monthsSinceDisbursement, 24))));
    } else if (seededRandom() < 0.02) {
      loanStatus = "Foreclosed";
      closureDate = fmt(addMonths(disbDate, randInt(12, Math.min(monthsSinceDisbursement, 36))));
    } else if (seededRandom() < 0.01) {
      loanStatus = "Written Off";
      npaDate = fmt(addMonths(disbDate, randInt(6, 18)));
    } else {
      loanStatus = "Active";
    }

    loans.push({
      loan_id: `LOAN${String(i + 1).padStart(5, "0")}`,
      application_id: app.application_id,
      customer_id: app.customer_id,
      sanctioned_amount: finalSanctioned,
      disbursed_amount: app.status === "Disbursed" ? finalSanctioned : 0,
      interest_rate: interestRate,
      tenure_months: tenureMonths,
      emi_amount: finalEmi,
      disbursement_date: fmt(disbDate),
      maturity_date: fmt(addMonths(disbDate, tenureMonths)),
      ltv_ratio: Math.min(ltv, 0.75),
      loan_status: loanStatus,
      npa_date: npaDate,
      closure_date: closureDate,
    });
  }

  // ─── Disbursements ───
  const disbursements: Disbursement[] = [];
  let disbId = 1;
  for (const loan of loans) {
    if (loan.disbursed_amount === 0) continue;
    const tranches = seededRandom() < 0.7 ? 1 : seededRandom() < 0.8 ? 2 : 3;
    let remaining = loan.disbursed_amount;

    for (let t = 1; t <= tranches; t++) {
      const amount = t === tranches ? remaining : Math.round(remaining * (0.4 + seededRandom() * 0.3) / 100000) * 100000;
      remaining -= amount;
      if (remaining < 0) remaining = 0;

      disbursements.push({
        disbursement_id: `DISB${String(disbId++).padStart(5, "0")}`,
        loan_id: loan.loan_id,
        tranche_number: t,
        amount: amount || loan.disbursed_amount,
        disbursement_date: t === 1 ? loan.disbursement_date : fmt(addDays(new Date(loan.disbursement_date), t * randInt(15, 45))),
        disbursement_mode: pick(DISBURSEMENT_MODES),
        bank_account_number: generateAccountNumber(),
        bank_name: pick(BANK_NAMES),
      });
    }
  }

  // ─── EMI Schedule ───
  const emiRecords: EMIRecord[] = [];
  let emiId = 1;
  for (const loan of loans) {
    if (loan.disbursed_amount === 0) continue;

    const r = loan.interest_rate / 12 / 100;
    let outstandingPrincipal = loan.disbursed_amount;
    const disbDate = new Date(loan.disbursement_date);
    const closureOrNpa = loan.npa_date ? new Date(loan.npa_date) : loan.closure_date ? new Date(loan.closure_date) : null;

    const maxEmis = Math.min(loan.tenure_months, 36); // Generate up to 36 months for data volume

    for (let m = 1; m <= maxEmis; m++) {
      const dueDate = addMonths(disbDate, m);
      if (dueDate > TODAY) break;

      const interestComponent = Math.round(outstandingPrincipal * r);
      const principalComponent = loan.emi_amount - interestComponent;
      outstandingPrincipal = Math.max(0, outstandingPrincipal - principalComponent);

      let status: string;
      let paymentDate: string | null = null;
      let paymentAmount: number | null = null;
      let dpd = 0;
      let penalty = 0;

      if (closureOrNpa && dueDate > closureOrNpa) {
        if (loan.loan_status === "Foreclosed" || loan.loan_status === "Closed") break;
        // NPA/Written Off: EMIs after NPA date are overdue
        status = "Overdue";
        dpd = Math.floor((TODAY.getTime() - dueDate.getTime()) / (24 * 60 * 60 * 1000));
        penalty = Math.round(loan.emi_amount * 0.02 * Math.ceil(dpd / 30));
      } else if (seededRandom() < 0.03) {
        // Bounced EMI
        status = "Bounced";
        dpd = randInt(5, 60);
        paymentDate = fmt(addDays(dueDate, dpd));
        paymentAmount = loan.emi_amount;
        penalty = Math.round(loan.emi_amount * 0.02);
      } else if (seededRandom() < 0.04) {
        // Late payment
        dpd = randInt(1, 15);
        paymentDate = fmt(addDays(dueDate, dpd));
        paymentAmount = loan.emi_amount;
        status = "Paid";
        penalty = dpd > 7 ? Math.round(loan.emi_amount * 0.01) : 0;
      } else {
        // On-time payment
        status = "Paid";
        paymentDate = fmt(addDays(dueDate, randInt(-2, 2)));
        paymentAmount = loan.emi_amount;
      }

      emiRecords.push({
        emi_id: `EMI${String(emiId++).padStart(6, "0")}`,
        loan_id: loan.loan_id,
        emi_number: m,
        due_date: fmt(dueDate),
        emi_amount: loan.emi_amount,
        principal_component: principalComponent > 0 ? principalComponent : 0,
        interest_component: interestComponent,
        payment_date: paymentDate,
        payment_amount: paymentAmount,
        status,
        dpd,
        penalty_amount: penalty,
      });
    }
  }

  // ─── Collections ───
  const collectionActions: CollectionAction[] = [];
  let collId = 1;
  const npaLoans = loans.filter((l) => l.loan_status === "NPA" || l.loan_status === "Written Off");
  const overdueEmis = emiRecords.filter((e) => e.status === "Overdue" || e.status === "Bounced");

  const loanIdsWithIssues = new Set([
    ...npaLoans.map((l) => l.loan_id),
    ...overdueEmis.map((e) => e.loan_id),
  ]);

  for (const loanId of loanIdsWithIssues) {
    const actionsCount = randInt(1, 5);
    const loan = loans.find((l) => l.loan_id === loanId)!;
    const startDate = loan.npa_date ? new Date(loan.npa_date) : new Date(loan.disbursement_date);

    for (let a = 0; a < actionsCount; a++) {
      const actionDate = addDays(startDate, a * randInt(7, 30));
      if (actionDate > TODAY) break;

      const officer = pick(collectionOfficers.length > 0 ? collectionOfficers : employees);
      const actionType = a === 0 ? "Phone Call" : a === 1 ? "SMS Reminder" : pick(COLLECTION_ACTIONS);

      collectionActions.push({
        collection_id: `COLL${String(collId++).padStart(5, "0")}`,
        loan_id: loanId,
        action_date: fmt(actionDate),
        action_type: actionType,
        action_by: officer.employee_id,
        outcome: pick(COLLECTION_OUTCOMES),
        remarks: `Follow-up #${a + 1} for ${loanId}`,
        next_followup_date: a < actionsCount - 1 ? fmt(addDays(actionDate, randInt(7, 21))) : null,
      });
    }
  }

  return {
    branches,
    employees,
    customers,
    properties,
    credit_bureau_reports: creditReports,
    loan_applications: loanApplications,
    loans,
    disbursements,
    emi_schedule: emiRecords,
    collections: collectionActions,
  };
}

// ─── Run and write output ───────────────────────────────────────────────────

const data = generate();

const stats = {
  branches: data.branches.length,
  employees: data.employees.length,
  customers: data.customers.length,
  properties: data.properties.length,
  credit_bureau_reports: data.credit_bureau_reports.length,
  loan_applications: data.loan_applications.length,
  loans: data.loans.length,
  disbursements: data.disbursements.length,
  emi_schedule: data.emi_schedule.length,
  collections: data.collections.length,
};

console.log("\n📊 Godrej Capital - LAP Database Generated");
console.log("─".repeat(45));
Object.entries(stats).forEach(([table, count]) => {
  console.log(`  ${table.padEnd(25)} ${String(count).padStart(6)} rows`);
});
console.log("─".repeat(45));
console.log(`  ${"TOTAL".padEnd(25)} ${String(Object.values(stats).reduce((a, b) => a + b, 0)).padStart(6)} rows`);

// Write to TypeScript file that can be imported by the app
const outputPath = path.resolve(__dirname, "../src/mock/lapDatabase.ts");

const tsContent = `// AUTO-GENERATED — Do not edit manually.
// Generated by: scripts/generate-lap-data.ts
// Run: npx tsx scripts/generate-lap-data.ts

export interface Branch { branch_id: string; branch_name: string; city: string; state: string; region: string; branch_type: string; opened_date: string; }
export interface Employee { employee_id: string; employee_name: string; designation: string; branch_id: string; joining_date: string; is_active: boolean; }
export interface Customer { customer_id: string; first_name: string; last_name: string; date_of_birth: string; gender: string; pan_number: string; phone_number: string; email: string; city: string; state: string; pincode: string; employment_type: string; employer_name: string; annual_income: number; employment_start_date: string; created_at: string; }
export interface Property { property_id: string; customer_id: string; property_type: string; property_sub_type: string; address: string; city: string; state: string; pincode: string; carpet_area_sqft: number; market_value: number; registered_value: number; construction_year: number; ownership_type: string; }
export interface CreditBureauReport { report_id: string; customer_id: string; bureau_name: string; score: number; report_date: string; existing_loans_count: number; inquiries_last_6m: number; inquiries_last_12m: number; total_outstanding: number; delinquency_flag: string; dpd_max_12m: number; }
export interface LoanApplication { application_id: string; customer_id: string; property_id: string; employee_id: string; branch_id: string; applied_amount: number; purpose: string; application_date: string; applicant_age_years: number; applicant_annual_income: number; applicant_employment_tenure_years: number; applicant_bureau_score: number; applicant_inquiries_last_6m: number; applicant_total_outstanding: number; applicant_foir: number; applicant_ltv: number; status: string; rejection_reason: string | null; approved_date: string | null; }
export interface Loan { loan_id: string; application_id: string; customer_id: string; sanctioned_amount: number; disbursed_amount: number; interest_rate: number; tenure_months: number; emi_amount: number; disbursement_date: string; maturity_date: string; ltv_ratio: number; loan_status: string; npa_date: string | null; closure_date: string | null; }
export interface Disbursement { disbursement_id: string; loan_id: string; tranche_number: number; amount: number; disbursement_date: string; disbursement_mode: string; bank_account_number: string; bank_name: string; }
export interface EMIRecord { emi_id: string; loan_id: string; emi_number: number; due_date: string; emi_amount: number; principal_component: number; interest_component: number; payment_date: string | null; payment_amount: number | null; status: string; dpd: number; penalty_amount: number; }
export interface CollectionAction { collection_id: string; loan_id: string; action_date: string; action_type: string; action_by: string; outcome: string; remarks: string; next_followup_date: string | null; }

export interface LAPDatabase {
  branches: Branch[];
  employees: Employee[];
  customers: Customer[];
  properties: Property[];
  credit_bureau_reports: CreditBureauReport[];
  loan_applications: LoanApplication[];
  loans: Loan[];
  disbursements: Disbursement[];
  emi_schedule: EMIRecord[];
  collections: CollectionAction[];
}

export const LAP_DB: LAPDatabase = ${JSON.stringify(data, null, 2)};

// Schema metadata for QueryGen context
export const LAP_SCHEMA = {
  tables: [
    {
      name: "branches",
      description: "Godrej Capital branch offices across India",
      columns: ["branch_id", "branch_name", "city", "state", "region", "branch_type", "opened_date"],
      row_count: ${stats.branches},
    },
    {
      name: "employees",
      description: "Staff including RMs, credit officers, branch managers, and collections officers",
      columns: ["employee_id", "employee_name", "designation", "branch_id", "joining_date", "is_active"],
      row_count: ${stats.employees},
    },
    {
      name: "customers",
      description: "LAP borrower/applicant master data",
      columns: ["customer_id", "first_name", "last_name", "date_of_birth", "gender", "pan_number", "phone_number", "email", "city", "state", "pincode", "employment_type", "employer_name", "annual_income", "employment_start_date", "created_at"],
      row_count: ${stats.customers},
    },
    {
      name: "properties",
      description: "Collateral property details pledged for LAP",
      columns: ["property_id", "customer_id", "property_type", "property_sub_type", "address", "city", "state", "pincode", "carpet_area_sqft", "market_value", "registered_value", "construction_year", "ownership_type"],
      row_count: ${stats.properties},
    },
    {
      name: "credit_bureau_reports",
      description: "CIBIL/Experian/CRIF credit scores and bureau data",
      columns: ["report_id", "customer_id", "bureau_name", "score", "report_date", "existing_loans_count", "inquiries_last_6m", "inquiries_last_12m", "total_outstanding", "delinquency_flag", "dpd_max_12m"],
      row_count: ${stats.credit_bureau_reports},
    },
    {
      name: "loan_applications",
      description: "LAP application tracking from submission to decision",
      columns: ["application_id", "customer_id", "property_id", "employee_id", "branch_id", "applied_amount", "purpose", "application_date", "applicant_age_years", "applicant_annual_income", "applicant_employment_tenure_years", "applicant_bureau_score", "applicant_inquiries_last_6m", "applicant_total_outstanding", "applicant_foir", "applicant_ltv", "status", "rejection_reason", "approved_date"],
      row_count: ${stats.loan_applications},
    },
    {
      name: "loans",
      description: "Sanctioned and active LAP loan accounts",
      columns: ["loan_id", "application_id", "customer_id", "sanctioned_amount", "disbursed_amount", "interest_rate", "tenure_months", "emi_amount", "disbursement_date", "maturity_date", "ltv_ratio", "loan_status", "npa_date", "closure_date"],
      row_count: ${stats.loans},
    },
    {
      name: "disbursements",
      description: "Tranche-wise loan disbursement records",
      columns: ["disbursement_id", "loan_id", "tranche_number", "amount", "disbursement_date", "disbursement_mode", "bank_account_number", "bank_name"],
      row_count: ${stats.disbursements},
    },
    {
      name: "emi_schedule",
      description: "Monthly EMI payment schedule and actual payment tracking",
      columns: ["emi_id", "loan_id", "emi_number", "due_date", "emi_amount", "principal_component", "interest_component", "payment_date", "payment_amount", "status", "dpd", "penalty_amount"],
      row_count: ${stats.emi_schedule},
    },
    {
      name: "collections",
      description: "Recovery and collection actions for overdue/NPA accounts",
      columns: ["collection_id", "loan_id", "action_date", "action_type", "action_by", "outcome", "remarks", "next_followup_date"],
      row_count: ${stats.collections},
    },
  ],
  relationships: [
    { from: "employees.branch_id", to: "branches.branch_id" },
    { from: "properties.customer_id", to: "customers.customer_id" },
    { from: "credit_bureau_reports.customer_id", to: "customers.customer_id" },
    { from: "loan_applications.customer_id", to: "customers.customer_id" },
    { from: "loan_applications.property_id", to: "properties.property_id" },
    { from: "loan_applications.employee_id", to: "employees.employee_id" },
    { from: "loan_applications.branch_id", to: "branches.branch_id" },
    { from: "loans.application_id", to: "loan_applications.application_id" },
    { from: "loans.customer_id", to: "customers.customer_id" },
    { from: "disbursements.loan_id", to: "loans.loan_id" },
    { from: "emi_schedule.loan_id", to: "loans.loan_id" },
    { from: "collections.loan_id", to: "loans.loan_id" },
    { from: "collections.action_by", to: "employees.employee_id" },
  ],
};
`;

fs.writeFileSync(outputPath, tsContent, "utf-8");
console.log(`\n✅ Written to: ${outputPath}`);
console.log(`   File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
