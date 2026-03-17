import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import EventBus from "../../EventBus";
import { userStore } from "../../store/userStore";
import { API_BASE_URL, IS_HR_PORTAL } from "../../utils/constants/endpoints";
import {
  getDefaultColorConfig,
  getHrPortalColorConfig,
} from "../../utils/getHrPortalColorConfig";
import CustomButton from "../DesignSystem/CustomButton";

export const EVENT_OPEN_CHANGE_PASS_MODAL = "EVENT_OPEN_CHANGE_PASS_MODAL";

function PasswordInput({
  label,
  value,
  onChange,
  showPassword,
  toggleShowPassword,
  placeholder,
}: Readonly<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
  placeholder: string;
}>) {
  const colorConfig = IS_HR_PORTAL
    ? getHrPortalColorConfig()
    : getDefaultColorConfig();

  return (
    <FormControl>
      <FormLabel
        color={IS_HR_PORTAL ? colorConfig.textPrimary : "gray.700"}
        fontWeight="500"
      >
        {label}
      </FormLabel>
      <InputGroup>
        <Input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          borderColor={IS_HR_PORTAL ? colorConfig.border : "gray.200"}
          _hover={{
            borderColor: IS_HR_PORTAL ? colorConfig.primary : "gray.300",
          }}
          _focus={{
            borderColor: IS_HR_PORTAL ? colorConfig.primary : "blue.500",
            boxShadow: IS_HR_PORTAL
              ? `0 0 0 1px ${colorConfig.primary}`
              : "0 0 0 1px #3182ce",
          }}
        />
        <InputRightElement>
          <Button
            variant="ghost"
            onClick={toggleShowPassword}
            color={IS_HR_PORTAL ? colorConfig.textSecondary : "gray.500"}
            _hover={{
              color: IS_HR_PORTAL ? colorConfig.primary : "gray.700",
              bg: IS_HR_PORTAL ? colorConfig.backgroundHover : "gray.100",
            }}
          >
            {showPassword ? <ViewOffIcon /> : <ViewIcon />}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
}

export default function ChangePassModal() {
  const colorConfig = IS_HR_PORTAL
    ? getHrPortalColorConfig()
    : getDefaultColorConfig();
  const { id } = userStore();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [error, setError] = useState("");
  const accessToken = localStorage.getItem("accessToken");

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid:
        hasMinLength &&
        hasUppercase &&
        hasLowercase &&
        hasNumber &&
        hasSpecialChar,
      checks: {
        hasMinLength,
        hasUppercase,
        hasLowercase,
        hasNumber,
        hasSpecialChar,
      },
    };
  };

  useEffect(() => {
    EventBus.getInstance().addListener(EVENT_OPEN_CHANGE_PASS_MODAL, onOpen);
    return () => EventBus.getInstance().removeListener(onOpen);
  }, [onOpen]);

  useEffect(() => {
    const { isValid } = validatePassword(newPassword);
    setIsPasswordValid(isValid);
    setError("");
  }, [newPassword]);

  const handlePasswordSubmit = async () => {
    if (!isPasswordValid) {
      setError("Password does not meet the requirements.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/update_password`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          user_id: id,
          current_password: btoa(currentPassword),
          new_password: btoa(newPassword),
          confirm_password: btoa(confirmPassword),
        }),
      });

      if (response.ok) {
        onClose();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to change password.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const { checks } = validatePassword(newPassword);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="blackAlpha.300" />
      <ModalContent
        bg={IS_HR_PORTAL ? colorConfig.conversationBg : "white"}
        border={IS_HR_PORTAL ? `1px solid ${colorConfig.border}` : "none"}
        borderRadius="12px"
      >
        <ModalHeader
          bg={IS_HR_PORTAL ? colorConfig.backgroundLight : "white"}
          borderTopRadius="12px"
          borderBottom={
            IS_HR_PORTAL
              ? `1px solid ${colorConfig.border}`
              : "1px solid #E2E8F0"
          }
        >
          <Flex align="center">
            <Text
              fontSize="lg"
              fontWeight="bold"
              mr={2}
              color={IS_HR_PORTAL ? colorConfig.textPrimary : "gray.800"}
            >
              🔒 Change Password
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton
          color={IS_HR_PORTAL ? colorConfig.textSecondary : "gray.600"}
          _hover={{
            bg: IS_HR_PORTAL ? colorConfig.backgroundHover : "gray.100",
          }}
        />
        <ModalBody pb={6}>
          <Text
            mb={4}
            color={IS_HR_PORTAL ? colorConfig.textSecondary : "gray.600"}
            fontSize="sm"
          >
            Please confirm a new password for your account.
          </Text>
          <VStack spacing={4} align="stretch">
            <PasswordInput
              key={"current-password"}
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              showPassword={showCurrentPassword}
              toggleShowPassword={() => setShowCurrentPassword((prev) => !prev)}
              placeholder="Enter current password"
            />
            <PasswordInput
              key={"new-password"}
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              showPassword={showNewPassword}
              toggleShowPassword={() => setShowNewPassword((prev) => !prev)}
              placeholder="Enter new password"
            />
            <PasswordInput
              key={"confirm-password"}
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              showPassword={showConfirmPassword}
              toggleShowPassword={() => setShowConfirmPassword((prev) => !prev)}
              placeholder="Re-enter new password"
            />
            <Box>
              <Text
                color={IS_HR_PORTAL ? colorConfig.textPrimary : "gray.700"}
                fontWeight="500"
                mb={2}
              >
                Password Requirements:
              </Text>
              <VStack align="start" mt={2} spacing={2}>
                <Checkbox
                  isChecked={checks.hasMinLength}
                  colorScheme={IS_HR_PORTAL ? "red" : "blue"}
                  borderColor={IS_HR_PORTAL ? colorConfig.border : "#CBD5E0"}
                  sx={{
                    "& .chakra-checkbox__control[data-checked]": {
                      bg: IS_HR_PORTAL ? colorConfig.checkbox : "#3182ce",
                      borderColor: IS_HR_PORTAL
                        ? colorConfig.checkbox
                        : "#3182ce",
                    },
                  }}
                  isReadOnly
                >
                  <Text
                    color={
                      IS_HR_PORTAL ? colorConfig.textSecondary : "gray.600"
                    }
                    fontSize="sm"
                  >
                    At least 8 characters
                  </Text>
                </Checkbox>
                <Checkbox
                  isChecked={checks.hasUppercase}
                  colorScheme={IS_HR_PORTAL ? "red" : "blue"}
                  borderColor={IS_HR_PORTAL ? colorConfig.border : "#CBD5E0"}
                  sx={{
                    "& .chakra-checkbox__control[data-checked]": {
                      bg: IS_HR_PORTAL ? colorConfig.checkbox : "#3182ce",
                      borderColor: IS_HR_PORTAL
                        ? colorConfig.checkbox
                        : "#3182ce",
                    },
                  }}
                  isReadOnly
                >
                  <Text
                    color={
                      IS_HR_PORTAL ? colorConfig.textSecondary : "gray.600"
                    }
                    fontSize="sm"
                  >
                    One uppercase letter
                  </Text>
                </Checkbox>
                <Checkbox
                  isChecked={checks.hasLowercase}
                  colorScheme={IS_HR_PORTAL ? "red" : "blue"}
                  borderColor={IS_HR_PORTAL ? colorConfig.border : "#CBD5E0"}
                  sx={{
                    "& .chakra-checkbox__control[data-checked]": {
                      bg: IS_HR_PORTAL ? colorConfig.checkbox : "#3182ce",
                      borderColor: IS_HR_PORTAL
                        ? colorConfig.checkbox
                        : "#3182ce",
                    },
                  }}
                  isReadOnly
                >
                  <Text
                    color={
                      IS_HR_PORTAL ? colorConfig.textSecondary : "gray.600"
                    }
                    fontSize="sm"
                  >
                    One lowercase letter
                  </Text>
                </Checkbox>
                <Checkbox
                  isChecked={checks.hasNumber}
                  colorScheme={IS_HR_PORTAL ? "red" : "blue"}
                  borderColor={IS_HR_PORTAL ? colorConfig.border : "#CBD5E0"}
                  sx={{
                    "& .chakra-checkbox__control[data-checked]": {
                      bg: IS_HR_PORTAL ? colorConfig.checkbox : "#3182ce",
                      borderColor: IS_HR_PORTAL
                        ? colorConfig.checkbox
                        : "#3182ce",
                    },
                  }}
                  isReadOnly
                >
                  <Text
                    color={
                      IS_HR_PORTAL ? colorConfig.textSecondary : "gray.600"
                    }
                    fontSize="sm"
                  >
                    One number
                  </Text>
                </Checkbox>
                <Checkbox
                  isChecked={checks.hasSpecialChar}
                  colorScheme={IS_HR_PORTAL ? "red" : "blue"}
                  borderColor={IS_HR_PORTAL ? colorConfig.border : "#CBD5E0"}
                  sx={{
                    "& .chakra-checkbox__control[data-checked]": {
                      bg: IS_HR_PORTAL ? colorConfig.checkbox : "#3182ce",
                      borderColor: IS_HR_PORTAL
                        ? colorConfig.checkbox
                        : "#3182ce",
                    },
                  }}
                  isReadOnly
                >
                  <Text
                    color={
                      IS_HR_PORTAL ? colorConfig.textSecondary : "gray.600"
                    }
                    fontSize="sm"
                  >
                    One special character
                  </Text>
                </Checkbox>
              </VStack>
            </Box>
            {error && (
              <Text
                color={IS_HR_PORTAL ? "#DC2626" : "red.500"}
                fontSize="sm"
                bg={IS_HR_PORTAL ? "#FEF2F2" : "red.50"}
                p={2}
                borderRadius="6px"
                border={
                  IS_HR_PORTAL ? "1px solid #FECACA" : "1px solid #FED7D7"
                }
              >
                {error}
              </Text>
            )}
            <CustomButton
              onClick={handlePasswordSubmit}
              isDisabled={!isPasswordValid}
              width="100%"
              className="mb-2"
            >
              Confirm Password
            </CustomButton>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
