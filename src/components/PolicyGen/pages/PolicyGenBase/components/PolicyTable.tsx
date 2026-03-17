import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  StackDivider,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useGetUserType from "../../../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../../../utils/constants/constants";
import { formatDateString } from "../../../../../utils/helpers/formatDate";
import { getPolicyFinalStatus } from "../../../../../utils/helpers/policyStatusHelper";
import ViewAction from "../../../../common/Actions/ViewAction";
import CustomTable from "../../../../common/CustomTable";
import GradientText from "../../../../common/GradientText/GradientText";
import Pagination from "../../../../common/Pagination";
import { POLICYGEN_SUB_ROUTES } from "../../../../common/PolicyGen/utils/constants";
import Status from "../../../../common/Status";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import { Policy, PolicyData } from "../../../../Polycraft/hooks/useGetPolicies";
import { selectedVersionAtom } from "../atom";

const MotionChevronIcon = motion(ChevronDownIcon);

// Custom hook for policy navigation
const usePolicyNavigation = () => {
  const router = useNavigate();
  const userType = useGetUserType();
  const selectedVersions = useAtomValue(selectedVersionAtom);

  const navigateToPolicy = useCallback(
    (policy: Policy) => {
      const selectedVersion = selectedVersions?.[policy.id] || "";
      router(
        `${
          BASE_ROUTES[userType]
        }/policygen/${POLICYGEN_SUB_ROUTES.POLICY_DETAILS.replace(
          ":categoryId",
          policy.subcategory_id || policy.loan_category_id
        )
          .replace(":policyId", policy.id)
          .replace(":fileId", selectedVersion)}`
      );
    },
    [router, userType, selectedVersions]
  );

  return { navigateToPolicy };
};

// Basic text cell component
const TextCell = ({ value }: { value: string }) => (
  <CustomText stylearr={[12, 20, 500]} color={systemColors.grey[900]}>
    {value}
  </CustomText>
);

// Component for category cell
const CategoryCell = ({ categoryName }: { categoryName: string }) => {
  return (
    <CustomText stylearr={[12, 20, 500]} color={systemColors.grey[900]}>
      {categoryName || "N/A"}
    </CustomText>
  );
};

// Component for date cell
const DateCell = ({ dateString }: { dateString: string }) => {
  return (
    <Flex flexDir={"column"}>
      {dateString ? (
        <CustomText stylearr={[12, 20, 500]} color={systemColors.grey[900]}>
          {formatDateString(new Date(dateString))}
        </CustomText>
      ) : (
        <CustomText stylearr={[12, 20, 500]} color={systemColors.grey[900]}>
          -
        </CustomText>
      )}
    </Flex>
  );
};

// Component for version selection cell
export const VersionCell = ({ policy }: { policy: Policy }) => {
  const versions = policy?.policy_files || [];
  const [selectedVersions, setSelectedVersions] = useAtom(selectedVersionAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const selectedVersion = selectedVersions?.[policy.id] || "";
  const selectedVersionNumber =
    versions?.find((item) => item.id === selectedVersion)?.version || "";

  const handleVersionSelect = (versionId: string) => {
    setSelectedVersions((prev) => ({
      ...prev,
      [policy.id]: versionId,
    }));
    onClose();
  };
  return (
    <Popover
      key={`version-${policy.id}`}
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom-start"
    >
      <PopoverTrigger>
        <span onClick={onOpen}>
          <Flex className="flex w-fit gap-2 cursor-pointer border rounded-lg py-2 px-4 bg-[linear-gradient(231deg,rgba(55,98,221,0)_13.46%,rgba(55,98,221,0.2)_194.11%)] border-[#3762DD]">
            <GradientText
              text={`V${selectedVersionNumber}`}
              gradient="linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)"
              className="text-xs font-semibold font-[Manrope] cursor-pointer"
            />
            <MotionChevronIcon
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </Flex>
        </span>
      </PopoverTrigger>

      <PopoverContent className="border-none p-0 m-0 w-fit focus-visible:ring-0">
        <VStack
          spacing={2}
          className="rounded-lg w-[63px] gap-1 max-h-[200px] overflow-y-auto shadow-[0px_5px_15px_0px_rgba(0,0,0,0.15)]"
          borderColor="#E5E6E6"
          divider={<StackDivider />}
        >
          {versions?.map((version, id) => (
            <Flex
              key={`version-${id}`}
              className="w-full rounded-lg p-3 justify-center cursor-pointer hover:bg-[linear-gradient(231deg,rgba(55,98,221,0)_13.46%,rgba(55,98,221,0.2)_194.11%)]"
              onClick={() => handleVersionSelect(version.id)}
            >
              <CustomText
                stylearr={[12, 20, 600]}
                color={systemColors.grey[900]}
              >
                {`V${version.version}`}
              </CustomText>
            </Flex>
          ))}
        </VStack>
      </PopoverContent>
    </Popover>
  );
};

// Component for policy name cell
const PolicyNameCell = ({ policy }: { policy: Policy }) => {
  const { navigateToPolicy } = usePolicyNavigation();

  const handleViewClick = () => {
    navigateToPolicy(policy);
  };

  return (
    <GradientText
      text={policy.policy_name}
      gradient="linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)"
      className="text-xs font-semibold font-[Manrope] cursor-pointer"
      onClick={handleViewClick}
    />
  );
};

// Component for actions cell
const ActionsCell = ({ policy }: { policy: Policy }) => {
  const { navigateToPolicy } = usePolicyNavigation();

  const handleViewClick = () => {
    navigateToPolicy(policy);
  };

  return (
    <div className="flex justify-end">
      <ViewAction cursor={"pointer"} onClick={handleViewClick} />
    </div>
  );
};

export default function PolicyTable({
  data,
  setPageSize,
  pageSize,
  page,
  setPage,
}: {
  data: PolicyData;
  setPageSize: (e: number) => void;
  pageSize: number;
  setPage: (e: number) => void;
  page: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedVersions = useAtomValue(selectedVersionAtom);

  const columns: ColumnDef<Policy>[] = useMemo(
    () => [
      {
        accessorKey: "policy_name",
        header: "Policy Name",
        size: 150,
        enableSorting: false,
        cell: ({ row }) => <PolicyNameCell policy={row.original} />,
      },
      {
        accessorKey: "created_by",
        header: "Policy Manager",
        size: 150,
        enableSorting: false,
        cell: ({ row }) => <TextCell value={row.getValue("created_by")} />,
      },
      {
        accessorKey: "loan_category_name",
        header: "Category",
        size: 150,
        enableSorting: false,
        cell: ({ row }) => (
          <CategoryCell categoryName={row.getValue("loan_category_name")} />
        ),
      },
      {
        accessorKey: "created_at",
        header: "Created on",
        size: 150,
        enableSorting: false,
        cell: ({ row }) => <DateCell dateString={row.getValue("created_at")} />,
      },
      {
        accessorKey: "versions",
        header: "Version",
        size: 150,
        enableSorting: false,
        cell: ({ row }) => <VersionCell policy={row.original} />,
      },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: false,
        cell: ({ row }) => {
          const policy = row.original;
          const selectedVersion = selectedVersions?.[policy.id] || "";
          const finalStatus = getPolicyFinalStatus(policy, selectedVersion);

          return <Status minW={"150px"} status={finalStatus} />;
        },
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionsCell policy={row.original} />,
      },
    ],
    [selectedVersions]
  );

  return (
    <div
      className={`w-full rounded-[16px] flex flex-col gap-3 overflow-y-auto`}
      ref={containerRef}
    >
      <CustomTable
        columns={columns}
        data={data?.data}
        lastAlignRight={true}
        stickyHeader={true}
      />

      <Pagination
        page={page}
        setPage={(e) => {
          if (e != page) {
            containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
          }
          setPage(e);
        }}
        totalPages={data?.total_pages}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalCount={data?.policy_count}
      />
    </div>
  );
}
