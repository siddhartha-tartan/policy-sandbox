import { Button, Flex, Spinner } from "@chakra-ui/react";
import { useAtomValue, useSetAtom } from "jotai";
import { Suspense, useEffect } from "react";
import { PlusThin } from "react-huge-icons/solid";
import { useNavigate } from "react-router-dom";
import EventBus from "../../../../EventBus";
import DeleteSVG from "../../../../assets/Icons/DeleteSVG";
import useGetPolicyManagerByCategory from "../../../../hooks/useGetPolicyManagersByCategory";
import { userStore } from "../../../../store/userStore";
import {
  BASE_ROUTES,
  POLICY_ROUTES,
  UserType,
} from "../../../../utils/constants/constants";
import CustomButton from "../../../DesignSystem/CustomButton";
import CommonSearchBar from "../../../common/CommonSearchBar";
import PageLayout from "../../../common/PageLayout";
import { POLYCRAFT_SUB_ROUTES } from "../../constants";
import useGetPolicies from "../../hooks/useGetPolicies";
import {
  selectAllAtom,
  selectedRowIdsAtom,
  selectedVersionAtom,
  unSelectedRowIdsAtom,
} from "./atom";
import DeletePolicyConfirmationModal, {
  EVENT_OPEN_POLICY_DELETE_MODAL,
} from "./components/DeletePolicyConfirmationModal";
import { EmptyPolicyList } from "./components/EmptyPolicyList";
import FilterPopover from "./components/FilterPopover";
import PolicyTable from "./components/PolicyTable";

export default function Policies() {
  const { userType } = userStore();
  const navigate = useNavigate();

  const selectAll = useAtomValue(selectAllAtom);
  const selectedRowIds = useAtomValue(selectedRowIdsAtom);
  const unselectedRowIds = useAtomValue(unSelectedRowIdsAtom);

  const { data: spocUsers } = useGetPolicyManagerByCategory();
  const isSpoc = userType === UserType.SPOC;
  const {
    data: policyData,
    setPage,
    setPageSize,
    page,
    pageSize,
    search,
    setSearch,
    isLoading,
    status: policyStatus,
    setStatus: setPolicyStatus,
    categoryIds,
    setCategoryIds,
    policyManagers,
    setPolicyManagers,
  } = useGetPolicies();
  const setSelectedVersion = useSetAtom(selectedVersionAtom);

  useEffect(() => {
    const versions = (policyData?.data?.data || [])?.reduce(
      (acc: Record<string, string>, item) => {
        if (item?.id && item?.policy_files?.[0]?.id) {
          acc[item.id] = item.policy_files[0].id;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    setSelectedVersion(versions);
  }, [policyData]);

  const selectedCount = selectAll
    ? Number(policyData?.data?.policy_count) - unselectedRowIds?.size
    : selectedRowIds?.size;

  return (
    <Suspense>
      <PageLayout>
        <Flex className="gap-6 bg-white p-6 rounded-2xl flex flex-col h-full pb-0 overflow-y-auto">
          <div className="flex justify-between gap-2">
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-2xl text-[#141414]">
                Policy Management
              </div>
              <div className="font-normal text-sm text-[#555557]">
                Manage, view, and edit all your active and inactive policies in
                one place
              </div>
            </div>
            {isSpoc && (
              <CustomButton
                fontWeight={600}
                fontSize={"14px"}
                lineHeight={"21px"}
                px={"20px"}
                py={"10px"}
                borderRadius={"10px"}
                onClick={() => {
                  navigate(`${POLICY_ROUTES[userType]}/add`);
                  navigate(
                    `${BASE_ROUTES[userType]}/polycraft/${POLYCRAFT_SUB_ROUTES.ADD_POLICY}`
                  );
                }}
                leftIcon={<PlusThin fontSize={"18px"} />}
                style={{
                  background: `linear-gradient(95.11deg, #3762DD -1.14%, #1D3577 158.31%)`,
                }}
              >
                Add New Policy
              </CustomButton>
            )}
          </div>

          <Flex className="gap-4 flex justify-between items-center w-full">
            <Flex className=" w-1/2 flex gap-4 ">
              <CommonSearchBar
                flexGrow={1}
                handleChange={setSearch}
                className="bg-white py-2.5 px-4 rounded-lg h-10 placeholder:font-normal placeholder:text-xs placeholder:text-[#555557]"
                placeholder={"Search Policy, Spoc , Product and Categories"}
              />

              <FilterPopover
                owner={policyManagers}
                setOwner={setPolicyManagers}
                status={policyStatus}
                setStatus={setPolicyStatus}
                categoryIds={categoryIds}
                setCategoryIds={setCategoryIds}
                spocUsers={spocUsers}
              />
            </Flex>
            {selectedCount ? (
              <Flex justifyContent="flex-end">
                <Button
                  onClick={() =>
                    EventBus.getInstance().fireEvent(
                      EVENT_OPEN_POLICY_DELETE_MODAL
                    )
                  }
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                  className="border-[#FFD8D4] h-10 rounded-lg bg-[#FFD8D433] py-2.5 px-5"
                  leftIcon={<DeleteSVG />}
                >
                  Delete {selectedCount}{" "}
                  {selectedCount === 1 ? "Policy" : "Policies"}
                </Button>
              </Flex>
            ) : null}
          </Flex>
          {policyData?.data?.data?.length && !isLoading ? (
            <PolicyTable
              data={policyData?.data}
              setPageSize={setPageSize}
              pageSize={pageSize}
              page={page}
              setPage={setPage}
            />
          ) : (
            <Flex className="w-full h-full justify-center items-center">
              {isLoading ? <Spinner /> : <EmptyPolicyList />}
            </Flex>
          )}

          <DeletePolicyConfirmationModal
            search={search}
            categoryIds={categoryIds}
            policyManagers={policyManagers}
            status={policyStatus}
            selectedCount={selectedCount}
          />
        </Flex>
      </PageLayout>
    </Suspense>
  );
}
