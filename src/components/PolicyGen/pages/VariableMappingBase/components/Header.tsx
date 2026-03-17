import { Flex } from "@chakra-ui/react";
import { IoIosArrowBack } from "react-icons/io";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <Flex className="flex-row gap-2">
      <IoIosArrowBack
        fontSize={"24px"}
        style={{ marginTop: "5px", cursor: "pointer" }}
        onClick={() => navigate(-1)}
      />
      <Flex className="flex-col gap-2">
        <CustomText stylearr={[24, 32, 700]} color={systemColors.primary}>
          Variable Mapping{" "}
        </CustomText>{" "}
        <CustomText stylearr={[14, 18, 500]} color={systemColors.primary}>
          Seamlessly upload and map your variables to our variables.
        </CustomText>
      </Flex>
    </Flex>
  );
};

export default Header;
