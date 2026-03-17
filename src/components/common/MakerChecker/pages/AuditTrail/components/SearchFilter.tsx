import { useMemo } from "react";
import CommonDropdownComponent from "../../../../CommonDropdownComponent";
import CommonSearchBar from "../../../../CommonSearchBar";
import { PriorityOptions } from "../../Approvals/components/SearchFilter";
import useGetRequestMakers from "../../Approvals/hooks/useGetRequestMakers";

const commonProps = {
  fontSize: "14px",
  lineHeight: "14px",
  fontWeight: 600,
  color: "#1B2559",
  height: "40px",
  paddingRight: "24px",
  paddingLeft: "24px",
};

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
      </div>
    </div>
  );
};

export default SearchFilter;
