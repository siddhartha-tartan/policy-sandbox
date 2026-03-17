import {
  chakra,
  Divider,
  Flex,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../../DesignSystem/CustomButton";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import CustomModal from "../../../CustomModal";
import { isAbfl } from "../../../../../utils/constants/endpoints";

export default function ImportantMessageModal({
  isOpen,
  onClose,
  onProceed,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  isLoading: boolean;
}) {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <Flex
        w={"500px"}
        gap={"24px"}
        flexDir={"column"}
        p={"24px"}
        borderRadius={"16px"}
      >
        <Flex
          gap={3}
          flexDir={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <CustomText stylearr={[24, 38, 700]}>Important Message!</CustomText>
          <CustomText stylearr={[16, 25, 500]}>
            You need to take the following points into consideration
          </CustomText>
        </Flex>
        <UnorderedList gap={"20px"} fontSize={"14px"} lineHeight={"22px"}>
          {isAbfl ? (
            <>
              <ListItem>
                This assessment is not part of the L&D assessment, and CAD
                allotment is not dependent on it.
              </ListItem>
              <ListItem mt={"20px"}>
                <chakra.span fontWeight={700}>
                  Do Not Refresh the Page:
                </chakra.span>{" "}
                Refreshing the page may result in losing your progress or
                submission.
              </ListItem>
              <ListItem mt={"20px"}>
                <chakra.span fontWeight={700}>
                  Test Cannot Be Paused:
                </chakra.span>
                The assessment must be completed in one sitting.
              </ListItem>
              <ListItem mt={"20px"}>
                <chakra.span fontWeight={700}>No Retakes:</chakra.span>Once you
                submit your assessment, you will not be able to make any
                changes.
              </ListItem>
              <ListItem mt={"20px"}>
                <chakra.span fontWeight={700}>
                  Ensure your device is fully charged.
                </chakra.span>
                Use a reliable internet connection to avoid disruptions.
              </ListItem>
            </>
          ) : (
            <>
              <ListItem>
                <chakra.span fontWeight={700}>
                  Do Not Refresh the Page:
                </chakra.span>{" "}
                Refreshing the page may result in losing your progress or
                submission.
              </ListItem>
              <ListItem mt={"20px"}>
                <chakra.span fontWeight={700}>
                  Test Cannot Be Paused:
                </chakra.span>{" "}
                The assessment must be completed in one sitting.
              </ListItem>
              <ListItem mt={"20px"}>
                <chakra.span fontWeight={700}>No Retakes:</chakra.span> Once you
                submit your assessment, you will not be able to make any
                changes.
              </ListItem>
              <ListItem mt={"20px"}>
                <chakra.span fontWeight={700}>
                  Ensure your device is fully charged.
                </chakra.span>{" "}
                Use a reliable internet connection to avoid disruptions.
              </ListItem>
            </>
          )}
        </UnorderedList>
        <Divider />
        <Flex w={"full"} gap={"24px"}>
          <CustomButton
            borderRadius={"10px"}
            flex={1}
            onClick={onClose}
            borderColor={systemColors.black[900]}
            variant="tertiary"
          >
            Go Back
          </CustomButton>
          <CustomButton
            isLoading={isLoading}
            borderRadius={"10px"}
            flex={1}
            onClick={onProceed}
          >
            Start Assessment
          </CustomButton>
        </Flex>
      </Flex>
    </CustomModal>
  );
}
