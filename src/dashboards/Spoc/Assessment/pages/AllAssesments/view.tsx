import { ChevronRightIcon } from "@chakra-ui/icons";
import { Flex, HStack, Spinner, StackDivider } from "@chakra-ui/react";
import { CgHashtag } from "react-icons/cg";
import { IoAt } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import useGetAllAssesment, {
  IAllAssement,
} from "../../../../../components/common/Assesment/hooks/useGetAllAssesment";
import { ASSESMENT_SUB_ROUTES } from "../../../../../components/common/Assesment/utils/constants";
import CommonDropdownComponent from "../../../../../components/common/CommonDropdownComponent";
import CommonSearchBar from "../../../../../components/common/CommonSearchBar";
import EmptyState from "../../../../../components/common/EmptyState";
import Pagination from "../../../../../components/common/Pagination";
import StatsBox from "../../../../../components/common/StatsBox";
import { systemColors } from "../../../../../components/DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../../components/DesignSystem/CustomButton";
import CustomText from "../../../../../components/DesignSystem/Typography/CustomText";
import { getStatusOptions } from "../../../../../utils/status";
import { IStats } from "../../../../Admin/Home/utils/config";
import SpocAssesmentTable from "./components/SpocAssesmentTable";

export default function AllAssesments() {
  const {
    data,
    isLoading,
    page,
    setPage,
    setAssesmentName,
    status,
    setStatus,
  }: {
    data: IAllAssement | null;
    isLoading: boolean;
    page: number;
    setPage: (e: number) => void;
    setAssesmentName: (e: string) => void;
    status: string;
    setStatus: (e: string) => void;
  } = useGetAllAssesment();
  const stats: IStats[] = [
    {
      icon: CgHashtag,
      number: data?.completed || 0,
      title: "Assignment  done",
    },
    { icon: IoAt, number: data?.pending || 0, title: "Assignment  pending" },
  ];
  const isEmpty = data && !data?.assesments?.length;
  const navigate = useNavigate();
  const statusOptions = getStatusOptions("AssessmentStatus");
  if (isLoading || !data)
    return (
      <Flex
        p={"24px"}
        bgColor={systemColors.white.absolute}
        borderRadius={"16px"}
        gap={"20px"}
        flexDir={"column"}
      >
        <Flex gap={2} flexDir={"column"}>
          <CustomText stylearr={[24, 31, 700]}>Assessments</CustomText>
        </Flex>
        <Flex w={"full"} justifyContent={"center"}>
          <Spinner />
        </Flex>
      </Flex>
    );

  return (
    <Flex
      w="full"
      flexDir={"column"}
      p={"24px"}
      flexGrow={1}
      gap={"24px"}
      overflowY={"auto"}
      h={"full"}
      alignItems={"center"}
      borderRadius={"16px"}
      bgColor={systemColors.white.absolute}
    >
      <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"}>
        <Flex gap={2} flexDir={"column"}>
          <CustomText stylearr={[24, 32, 700]} color={systemColors.grey[900]}>
            Assessment
          </CustomText>
          <CustomText stylearr={[14, 22, 500]} color={systemColors.grey[600]}>
            Total {data.total} assessments
          </CustomText>
        </Flex>
        <CustomButton
          h="56px"
          fontSize={"16px"}
          onClick={() => navigate(ASSESMENT_SUB_ROUTES.ADD)}
          fontWeight={700}
          rightIcon={<ChevronRightIcon fontSize={"24px"} />}
        >
          Create new assessment
        </CustomButton>
      </Flex>
      <HStack
        divider={<StackDivider borderColor={systemColors.black[100]} />}
        borderRadius={"16px"}
        borderWidth={"1px"}
        borderColor={systemColors.black[100]}
        w={"full"}
      >
        {stats?.map((row, id) => (
          <Flex p={4} key={id} flexGrow={1}>
            <StatsBox data={row} />
          </Flex>
        ))}
      </HStack>
      <Flex
        flexGrow={1}
        w={"full"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDir={"column"}
        gap={"24px"}
      >
        <Flex gap={4} w={"full"}>
          <CommonSearchBar
            flexGrow={1}
            handleChange={setAssesmentName}
            placeholder={"Search by Assessment title"}
          />
          <CommonDropdownComponent
            title=""
            options={statusOptions}
            value={status}
            onChange={setStatus}
            matchWidth={false}
          />
        </Flex>
        {!isEmpty ? (
          <Flex
            flexDir={"column"}
            w={"full"}
            flexGrow={1}
            justifyContent={"space-between"}
          >
            <SpocAssesmentTable data={data?.assesments} />
            <Flex
              w={"full"}
              {...(isEmpty ? { flexGrow: 1 } : {})}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Pagination
                page={page}
                setPage={(e) => {
                  setPage(e);
                }}
                totalPages={data?.total_pages}
              />
            </Flex>
          </Flex>
        ) : (
          <EmptyState
            onButtonClick={() => navigate(ASSESMENT_SUB_ROUTES.ADD)}
          />
        )}
      </Flex>
    </Flex>
  );
}
