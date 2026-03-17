import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MOCK_WORKFLOWS } from "../../../../../../mock/mockData";
import { IAddWorkFlow, IWorkFlowLevel } from "./useAddWorkFlow";
import { IWorkFlow } from "./useGetWorkFlows";

export const getWorkFlowByIdKey = "/workflows/:id";

export default function useGetWorkFlowById() {
  const { id } = useParams();
  const [data, setData] = useState<IWorkFlow | null>(null);
  const [workFlowData, setWorkFlowData] = useState<Omit<IAddWorkFlow, "levels"> | null>(null);
  const [levelData, setLevelData] = useState<IWorkFlowLevel[]>([]);

  useEffect(() => {
    if (!id) return;
    const wf = MOCK_WORKFLOWS.find((w) => w.id === id);
    if (wf) {
      const mockWf: IWorkFlow = {
        id: wf.id,
        domain_id: "dom-001",
        domain_name: "Policy Portal",
        modules: [{ module_id: wf.module_id, module_name: wf.module_name, module_code: wf.module_name.toLowerCase().replace(" ", "_") }],
        name: wf.name,
        is_active: wf.status === "active",
        levels_count: wf.levels.length,
        user_count: wf.levels.reduce((sum, l) => sum + l.user_ids.length, 0),
        created_at: wf.created_at,
        updated_at: wf.updated_at,
        created_by: "mock-user-001",
        updated_by: "mock-user-001",
        config: {
          entity_types: wf.entity_types,
          levels: wf.levels.map((l) => ({
            level_number: l.level,
            approval_type: "ALL",
            required_approvals: l.user_ids.length,
            users: l.users.map((u) => ({
              user_id: u.id,
              name: u.name,
              employee_id: "EMP-001",
              role: l.user_type,
            })),
          })),
        },
      };
      setData(mockWf);
      setWorkFlowData({
        name: mockWf.name,
        module_id: mockWf.modules.map((m) => m.module_id),
        entity_types: mockWf.config.entity_types,
      });
      setLevelData(mockWf.config.levels);
    }
  }, [id]);

  return {
    data,
    isLoading: false,
    workFlowData,
    levelData,
  };
}
