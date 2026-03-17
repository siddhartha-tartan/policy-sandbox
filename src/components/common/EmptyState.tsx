import { Flex, Image } from "@chakra-ui/react";
import location_arrow from "../../assets/Images/location_arrow.png";
import CustomButton from "../DesignSystem/CustomButton";
import CustomText from "../DesignSystem/Typography/CustomText";
import { useNavigate } from "react-router-dom";

interface EmptyStateProps {
  imageSrc?: string;
  message?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

export default function EmptyState({
  imageSrc = location_arrow,
  message = "You haven’t created any assessment yet",
  buttonLabel = "Create new assessment",
  onButtonClick,
}: EmptyStateProps) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      navigate("/default-path"); // Replace "/default-path" with a sensible default route or leave it configurable.
    }
  };

  return (
    <Flex
      gap="20px"
      alignItems="center"
      justifyContent="center"
      flexDir="column"
    >
      <Image src={imageSrc} h="66px" />
      <CustomText stylearr={[20, 32, 600]}>{message}</CustomText>
      <CustomButton
        onClick={handleButtonClick}
        w="fit-content"
        variant="tertiary"
      >
        {buttonLabel}
      </CustomButton>
    </Flex>
  );
}
