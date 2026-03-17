import { PlusSquareIcon } from "@chakra-ui/icons";
import { Flex, HStack, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  DocumentText,
  FileWrittenBent,
  Tornado,
  UsersTriple,
} from "react-huge-icons/outline";
import { useNavigate } from "react-router";
import { ASSESMENT_SUB_ROUTES } from "../../../../components/common/Assesment/utils/constants";
import { customColors } from "../../../../components/DesignSystem/Colors/CustomColors";
import CustomText from "../../../../components/DesignSystem/Typography/CustomText";
import { POLYCRAFT_SUB_ROUTES } from "../../../../components/Polycraft/constants";
import { userStore } from "../../../../store/userStore";
import {
  BASE_ROUTES,
  FeatureIdentifiers,
  USER_ROUTES,
  UserType,
} from "../../../../utils/constants/constants";

// Motion wrapper
const MotionFlex = motion(Flex);

const actionableConfig = (enabledFeature: string[]) => [
  {
    title: "Add New Policy",
    description: "Publish New Policies",
    icon: PlusSquareIcon,
    navigateTo: `${BASE_ROUTES[UserType.SPOC]}/polycraft/${
      POLYCRAFT_SUB_ROUTES.ADD_POLICY
    }`,
  },
  {
    title: "View Policies",
    description: "View Centralised Policy Library",
    icon: DocumentText,
    navigateTo: `${BASE_ROUTES[UserType.SPOC]}/polycraft/${
      POLYCRAFT_SUB_ROUTES.POLICIES
    }`,
  },
  {
    title: "Manage Users",
    description: "Manage Teams and People",
    icon: UsersTriple,
    navigateTo: `${USER_ROUTES[UserType.SPOC]}`,
  },
  {
    title: "Create Assessment",
    description: "Measure Employee Awareness",
    icon: FileWrittenBent,
    navigateTo: `${BASE_ROUTES.SPOC}/assessment/${ASSESMENT_SUB_ROUTES.ADD}`,
  },
  ...(enabledFeature?.includes(FeatureIdentifiers.RULESENSE)
    ? [
        {
          title: "Generate Code",
          comp: (
            <Flex className="flex-row gap-2 justify-center items-center">
              <CustomText stylearr={[12, 12, 500]}>
                Turn policies to code
              </CustomText>
              <CustomText
                stylearr={[12, 16, 600]}
                className="px-[6px] py-[2px] rounded"
                bg={"#E8EAF6"}
                color={"indigo.500"}
              >
                Beta
              </CustomText>
            </Flex>
          ),
          icon: Tornado,
          navigateTo: `${BASE_ROUTES.SPOC}/policygen`,
        },
      ]
    : []),
];

const ActionableItems = () => {
  const color = customColors.ONYX;
  const navigate = useNavigate();
  const { enabledFeature } = userStore();
  const config = actionableConfig(enabledFeature);

  return (
    <HStack className="flex-row justify-between gap-3">
      {config?.map((item, index) => (
        <MotionFlex
          key={`actionable-items-${index}`}
          className="py-4 px-3 grow flex-col gap-2 text-center border rounded-2xl"
          cursor={"pointer"}
          bg={"#FFF"}
          onClick={() => navigate(item.navigateTo)}
          whileHover={{
            scale: 1.02,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon
            as={item.icon}
            mx="auto"
            w={"45px"}
            fontSize={"20px"}
            color={color}
          />
          <CustomText
            stylearr={[16, 16, 600]}
            letterSpacing={"0.3px"}
            color={color}
          >
            {item.title}
          </CustomText>
          {item.comp ? (
            item.comp
          ) : (
            <CustomText
              stylearr={[12, 12, 500]}
              letterSpacing={"0.5px"}
              color={color}
            >
              {item.description}
            </CustomText>
          )}
        </MotionFlex>
      ))}
    </HStack>
  );
};

export default ActionableItems;
