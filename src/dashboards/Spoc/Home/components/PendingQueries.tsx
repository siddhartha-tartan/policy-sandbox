import { ChevronRightIcon } from "@chakra-ui/icons";
import { Divider, Flex } from "@chakra-ui/react";
import { BsDot } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { QUERY_SUB_ROUTES } from "../../../../components/common/Query/utils/constants";
import { systemColors } from "../../../../components/DesignSystem/Colors/SystemColors";
import CustomText from "../../../../components/DesignSystem/Typography/CustomText";
import { BASE_ROUTES } from "../../../../utils/constants/constants";
import getRelativeTime from "../../../../utils/helpers/formatDate";
import { IPendingQuery } from "../hooks/useGetAnalytics";
import EmptyState from "./EmptyState";

const PendingQueries = ({ data }: { data: IPendingQuery[] }) => {
  const navigate = useNavigate();
  return (
    <Flex className="flex-col">
      {data?.length ? (
        <>
          {" "}
          <Flex className="justify-between py-3 px-[6px]">
            {" "}
            <CustomText
              stylearr={[14, 18, 500]}
              color={systemColors.black[600]}
            >
              Name
            </CustomText>
            <CustomText
              stylearr={[14, 18, 500]}
              color={systemColors.black[600]}
            >
              Action
            </CustomText>
          </Flex>
          <Divider />
          {data?.map((item) => (
            <Flex
              key={`query-${item?.id}`}
              className="justify-between py-3 px-[6px]"
            >
              <Flex className="flex-col gap-2">
                <CustomText stylearr={[14, 18, 600]}>
                  {item?.loan_category_name || ""}
                </CustomText>
                <Flex className="flex-row gap items-center">
                  {" "}
                  <CustomText stylearr={[12, 16, 500]}>{`By ${
                    item?.created_by || ""
                  }`}</CustomText>
                  <BsDot size={16} color={systemColors.indigo[400]} />
                  <CustomText stylearr={[12, 16, 500]}>
                    {getRelativeTime(item?.last_message_at)}
                  </CustomText>
                </Flex>
              </Flex>
              <Flex>
                <Flex
                  className="flex-row gap-2 px-[14px] py-[10px] w-fit rounded-lg cursor-pointer items-center"
                  background={systemColors.indigo[50]}
                  onClick={() =>
                    navigate(
                      `${
                        BASE_ROUTES.SPOC
                      }/query/${QUERY_SUB_ROUTES.THREAD.replace(
                        ":id",
                        item?.loan_category_id || ""
                      )}`
                    )
                  }
                >
                  <CustomText
                    stylearr={[14, 14, 600]}
                    color={systemColors.indigo[400]}
                  >
                    Reply
                  </CustomText>
                  <ChevronRightIcon color={systemColors.indigo[400]} />
                </Flex>
              </Flex>
            </Flex>
          ))}
        </>
      ) : (
        <EmptyState
          title={"No Pending Queries"}
          subtitle="As users submit queries, they will appear here for you to review and respond to."
        />
      )}
    </Flex>
  );
};

export default PendingQueries;
