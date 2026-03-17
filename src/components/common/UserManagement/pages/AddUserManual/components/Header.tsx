import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useGetUserType from "../../../../../../hooks/useGetUserType";
import {
  BASE_MODULE_ROUTE,
  BASE_ROUTES,
} from "../../../../../../utils/constants/constants";
import CustomButton from "../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import useAddUsers, { IAddUser } from "../../../hooks/useAddUsers";
import { USER_SUB_ROUTES } from "../../../utils/constant";

export default function Header({
  addUser,
  isDisabled,
  users,
}: {
  addUser: () => void;
  isDisabled: boolean;

  users: IAddUser[];
}) {
  const navigate = useNavigate();
  const userType = useGetUserType();
  const successCallback = () =>
    navigate(
      `${BASE_ROUTES[userType]}/${BASE_MODULE_ROUTE.USER}/${USER_SUB_ROUTES.BASE}`
    );
  const { mutate, isLoading } = useAddUsers(successCallback, false);

  const handleSubmit = useCallback(() => {
    mutate(users);
  }, [users]);

  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-col gap-2">
        <CustomText stylearr={[20, 28, 500]} color={"#101828"}>
          User Addition
        </CustomText>
        <CustomText stylearr={[12, 18, 400]} color={"#101828"}>
          Onboard team members with role and access controls
        </CustomText>
      </div>
      <div className="flex flex-row gap-4">
        <CustomButton
          variant={"quinary"}
          className="w-[136px] h-[40px] text-sm rounded-[8px]"
          onClick={addUser}
        >
          Add More
        </CustomButton>
        <CustomButton
          variant="quaternary"
          className="w-[89px] h-[40px] text-sm rounded-[8px]"
          isLoading={isLoading}
          isDisabled={isDisabled || isLoading}
          onClick={handleSubmit}
        >
          Submit
        </CustomButton>
      </div>
    </div>
  );
}
