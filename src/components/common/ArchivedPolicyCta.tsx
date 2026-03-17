import { useNavigate } from "react-router-dom";
import useGetUserType from "../../hooks/useGetUserType";
import { POLICY_ROUTES } from "../../utils/constants/constants";
import CustomButton from "../DesignSystem/CustomButton";

export default function ArchivedPolicyCta() {
  const navigate = useNavigate();
  const userType = useGetUserType();
  return (
    <CustomButton
      fontWeight={700}
      h="56px"
      px={"24px"}
      borderRadius={"10px"}
      variant={"secondary"}
      onClick={() => {
        navigate(`${POLICY_ROUTES[userType]}/archive`);
      }}
    >
      Archived Policies
    </CustomButton>
  );
}
