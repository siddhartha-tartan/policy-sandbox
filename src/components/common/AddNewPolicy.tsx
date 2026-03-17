import { PlusThin } from "react-huge-icons/outline";
import CustomButton from "../DesignSystem/CustomButton";
import { useNavigate } from "react-router-dom";
import useGetUserType from "../../hooks/useGetUserType";
import { POLICY_ROUTES, UserType } from "../../utils/constants/constants";

export default function AddNewPolicy() {
  const navigate = useNavigate();
  const userType = useGetUserType();
  if (userType === UserType.SPOC)
    return (
      <CustomButton
        fontWeight={700}
        h="56px"
        px={"24px"}
        borderRadius={"10px"}
        onClick={() => {
          navigate(`${POLICY_ROUTES[userType]}/add`);
        }}
        leftIcon={<PlusThin fontSize={"20px"} />}
      >
        Add New Policy
      </CustomButton>
    );

  return null;
}
