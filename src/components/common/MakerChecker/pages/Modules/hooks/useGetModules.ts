import { MOCK_MODULES } from "../../../../../../mock/mockData";

export interface IModule {
  id: string;
  domain_id: string;
  domain_name: string;
  code: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export const getModulesKey = `/modules`;

export default function useGetModules() {
  const modules: IModule[] = MOCK_MODULES.map((m) => ({
    id: m.id,
    domain_id: "dom-001",
    domain_name: "Policy Portal",
    code: m.name.toLowerCase().replace(" ", "_"),
    name: m.name,
    description: `${m.name} module`,
    is_active: true,
    created_at: "2025-10-01T10:00:00Z",
    updated_at: "2026-01-15T10:00:00Z",
    created_by: "system",
    updated_by: "system",
  }));

  return {
    data: modules,
    isLoading: false,
  };
}
