import { Flex, Grid, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { customColors } from "../../../../components/DesignSystem/Colors/CustomColors";
import { systemColors } from "../../../../components/DesignSystem/Colors/SystemColors";
import CustomText from "../../../../components/DesignSystem/Typography/CustomText";
import { POLYCRAFT_SUB_ROUTES } from "../../../../components/Polycraft/constants";
import useGetUserType from "../../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../../utils/constants/constants";
import { formatDateString } from "../../../../utils/helpers/formatDate";
import { IExpiredPolicy } from "../hooks/useGetAnalytics";
import EmptyState from "./EmptyState";

const NeedsAttention = ({ data }: { data: IExpiredPolicy[] }) => {
  const color = customColors.ONYX;
  const userType = useGetUserType();
  const navigate = useNavigate();

  return (
    <VStack spacing={2} w={"full"} alignItems={"center"}>
      {data?.length ? (
        data?.map((item) => (
          <Grid
            className="py-3 w-full px-[6px]"
            templateColumns="1fr 1fr auto"
            alignItems="center"
            key={`attention-${item.validity}${item.id}`}
            style={{ width: "100%" }}
          >
            <Text
              fontSize="sm"
              fontWeight="600"
              maxW={"90%"}
              color={color}
              isTruncated
              title={item.policy_name} // Tooltip for full text on hover
            >
              {item.policy_name}
            </Text>

            <Grid className="flex-col gap-2">
              <CustomText
                stylearr={[12, 16, 500]}
                color={systemColors.black[600]}
              >
                Review Date
              </CustomText>
              <CustomText stylearr={[14, 18, 600]} color={color}>
                {formatDateString(new Date(item?.validity))}
              </CustomText>
            </Grid>

            <Flex>
              <Grid
                className="px-[14px] py-[10px] w-fit rounded-lg items-center cursor-pointer"
                background={"#F3E5F5"}
                onClick={() =>
                  navigate(
                    BASE_ROUTES[userType] +
                      "/polycraft/" +
                      POLYCRAFT_SUB_ROUTES.VIEW_POLICY.replace(
                        ":id",
                        item?.id
                      ).replace(":categoryId", item?.loan_category_id)
                  )
                }
              >
                <CustomText stylearr={[14, 14, 600]} color={"#9C27B0"}>
                  Review
                </CustomText>
              </Grid>
            </Flex>
          </Grid>
        ))
      ) : (
        <EmptyState
          title={"No Needs Attention"}
          subtitle="As user upload policies, they will appear here for you to review and respond to."
        />
      )}
    </VStack>
  );
};

export default NeedsAttention;
