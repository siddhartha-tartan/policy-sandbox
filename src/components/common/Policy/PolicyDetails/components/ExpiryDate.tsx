import { formatDateTimeString } from "../../../../../utils/helpers/formatDate";
import { systemColors } from "../../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../../DesignSystem/Typography/CustomText";

const ExpiryDate = ({ value }: { value: string }) => {
  const val = value ? formatDateTimeString(new Date(value)) : "-";
  return (
    <CustomText
      stylearr={[11, 19, 400]}
      color={systemColors.grey[900]}
      {...(val === "-" && { pl: "30%", pr: "65%" })}
    >
      {val}
    </CustomText>
  );
};

export default ExpiryDate;
