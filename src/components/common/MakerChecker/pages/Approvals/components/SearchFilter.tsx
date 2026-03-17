import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useGetUserType from "../../../../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../../../../utils/constants/constants";
import CustomButton from "../../../../../DesignSystem/CustomButton";
import CommonDropdownComponent from "../../../../CommonDropdownComponent";
import CommonSearchBar from "../../../../CommonSearchBar";
import { MAKER_CHECKER_SUB_ROUTES } from "../../../utils/constant";
import useGetRequestMakers from "../hooks/useGetRequestMakers";

const commonProps = {
  fontSize: "14px",
  lineHeight: "14px",
  fontWeight: 600,
  color: "#1B2559",
  height: "40px",
  paddingRight: "24px",
  paddingLeft: "24px",
};

export const PriorityOptions = [
  { label: "High", value: "HIGH" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Low", value: "LOW" },
];

interface IProps {
  setSearch: (e: string) => void;
  priority: string;
  setPriority: (e: string) => void;
  requestedBy: string;
  setRequestedBy: (e: string) => void;
}

const SearchFilter = ({
  setSearch,
  priority,
  setPriority,
  requestedBy,
  setRequestedBy,
}: IProps) => {
  const { data } = useGetRequestMakers();
  const navigate = useNavigate();
  const userType = useGetUserType();

  const requestedByOptions = useMemo(() => {
    return data?.map((item) => ({ label: item?.name, value: item?.user_id }));
  }, [data]);

  return (
    <div className="flex flex-row justify-between h-[40px]">
      <CommonSearchBar
        placeholder="Search for a specific request..."
        handleChange={setSearch}
        className="w-[450px]"
      />
      <div className="flex flex-row gap-6">
        <CommonDropdownComponent
          title={"Priority"}
          options={PriorityOptions}
          value={priority}
          onChange={setPriority}
          style={commonProps}
          isResetAble={true}
        />
        <CommonDropdownComponent
          title={"Requested By"}
          options={requestedByOptions}
          value={requestedBy}
          onChange={setRequestedBy}
          style={commonProps}
          isResetAble={true}
        />
        <CustomButton
          variant="secondary"
          style={commonProps}
          onClick={() =>
            navigate(
              `${BASE_ROUTES[userType]}/maker-checker/${MAKER_CHECKER_SUB_ROUTES.AUDIT_TRAIL}`
            )
          }
        >
          View Audit Trail
        </CustomButton>
      </div>
    </div>
  );
};

export default SearchFilter;
