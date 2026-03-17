import {
  Flex,
  Text,
  Textarea,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { systemColors } from "../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../DesignSystem/CustomButton";
import CustomModal from "../../common/CustomModal";

interface EditConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: { priority: string; comment: string }) => void;
  isLoading: boolean;
}

// Define priority options with their colors
const priorityOptions = [
  { value: "HIGH", color: "#E53E3E" }, // Red for high
  { value: "MEDIUM", color: "#F9A825" }, // Orange for medium
  { value: "LOW", color: "#38A169" }, // Green for low
];

const EditConfirmationModal: React.FC<EditConfirmationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading,
}) => {
  const [modalState, setModalState] = useState({
    priority: "MEDIUM",
    comment: "",
  });

  const updateState = (key: string, newValue: any) => {
    setModalState((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  // Get the current priority color
  const getCurrentPriorityColor = () => {
    const option = priorityOptions.find(
      (opt) => opt.value === modalState.priority
    );
    return option?.color || "#000000";
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      className="p-6 pt-8 w-[500px] "
    >
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-3 justify-center items-center">
          <div className="font-bold text-[22px] text-[#141414]">
            Send Policy for Request
          </div>
          <Text
            mb={4}
            color="gray.600"
            className="text-sm flex justify-center items-center text-center font-medium"
          >
            Please select the priority level and add any relevant comments.{" "}
            <br />
            On approval a new version would be automatically created.{" "}
          </Text>
        </div>
        <div>
          <Flex flexDirection="column" className="flex gap-6">
            <Flex className="flex justify-between items-center">
              <Text fontWeight="medium" className="font-semibold text-sm">
                Select Request Priority
              </Text>

              {/* Custom Menu Dropdown */}
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  size="sm"
                  width="120px"
                  borderColor="gray.300"
                  variant="outline"
                  borderRadius="6px"
                  fontWeight="medium"
                  _focus={{ boxShadow: "outline" }}
                  textAlign="left"
                  px={3}
                >
                  <Flex alignItems="center">
                    <Box
                      width="8px"
                      height="8px"
                      borderRadius="50%"
                      backgroundColor={getCurrentPriorityColor()}
                      mr={2}
                    />
                    <Text color={getCurrentPriorityColor()}>
                      {modalState?.priority
                        ? modalState.priority.charAt(0).toUpperCase() +
                          modalState.priority.slice(1).toLowerCase()
                        : ""}
                    </Text>
                  </Flex>
                </MenuButton>
                <MenuList minWidth="140px">
                  {priorityOptions.map((option) => (
                    <MenuItem
                      key={option.value}
                      onClick={() => updateState("priority", option?.value)}
                    >
                      <Flex alignItems="center">
                        <Box
                          width="8px"
                          height="8px"
                          borderRadius="50%"
                          backgroundColor={option?.color}
                          mr={2}
                        />
                        <Text color={option.color}>
                          {" "}
                          {option?.value
                            ? option.value.charAt(0).toUpperCase() +
                              option.value.slice(1).toLowerCase()
                            : ""}
                        </Text>
                      </Flex>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Flex>

            <Flex flexDirection="column" gap={2}>
              <Text
                fontWeight="medium"
                className="text-[#141414] text-sm font-normal"
              >
                Additional Comments (Optional)
              </Text>
              <Textarea
                placeholder="Add any relevant comments about this policy..."
                value={modalState?.comment}
                onChange={(e) => updateState("comment", e.target.value)}
                borderColor="gray.300"
                className="placeholder:font-medium placeholder:text-sm"
                resize="vertical"
              />
            </Flex>
          </Flex>
        </div>

        <div>
          <Flex w="full" gap="24px">
            <CustomButton
              borderRadius="8px"
              className="text-sm font-medium"
              borderColor={systemColors.black[200]}
              variant="tertiary"
              flex={1}
              onClick={onClose}
            >
              Cancel
            </CustomButton>
            <CustomButton
              bgColor={systemColors.grey[900]}
              className="text-sm font-semibold"
              style={{
                background: `linear-gradient(95.11deg, #3762DD -1.14%, #1D3577 158.31%)`,
              }}
              borderRadius="8px"
              flex={1}
              isLoading={isLoading}
              onClick={() => {
                onSave(modalState);
              }}
            >
              Confirm
            </CustomButton>
          </Flex>
        </div>
      </div>
    </CustomModal>
  );
};

export default EditConfirmationModal;
