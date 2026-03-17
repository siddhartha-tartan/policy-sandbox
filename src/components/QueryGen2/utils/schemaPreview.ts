import { LAP_DB, LAP_SCHEMA } from "../../../mock/lapDatabase";

export interface ColumnPreview {
  name: string;
  sampleValues: string[];
}

export interface TablePreview {
  name: string;
  description: string;
  rowCount: number;
  columns: ColumnPreview[];
}

export function getSchemaPreview(): TablePreview[] {
  const dbMap: Record<string, unknown[]> = {
    branches: LAP_DB.branches,
    employees: LAP_DB.employees,
    customers: LAP_DB.customers,
    properties: LAP_DB.properties,
    credit_bureau_reports: LAP_DB.credit_bureau_reports,
    loan_applications: LAP_DB.loan_applications,
    loans: LAP_DB.loans,
    disbursements: LAP_DB.disbursements,
    emi_schedule: LAP_DB.emi_schedule,
    collections: LAP_DB.collections,
  };

  return LAP_SCHEMA.tables.map((table) => {
    const data = dbMap[table.name] || [];
    const sampleRows = data.slice(0, 3) as Record<string, unknown>[];

    const columns: ColumnPreview[] = table.columns.map((col) => ({
      name: col,
      sampleValues: sampleRows.map((row) => {
        const val = row[col];
        if (val === null || val === undefined) return "—";
        if (typeof val === "number") return val.toLocaleString("en-IN");
        return String(val).length > 28 ? String(val).substring(0, 25) + "…" : String(val);
      }),
    }));

    return {
      name: table.name,
      description: table.description,
      rowCount: table.row_count,
      columns,
    };
  });
}
