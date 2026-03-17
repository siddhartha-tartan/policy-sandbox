import { UserType } from "../../../../utils/constants/constants";

export enum UserActions {
  READ = "READ",
  EDIT = "EDIT",
  ADD = "ADD",
  DELETE = "DELETE",
}

export const getFaqPermissions = (
  userType: UserType
): Record<UserActions, boolean> => {
  if (userType === UserType.SPOC) {
    return {
      [UserActions.READ]: true,
      [UserActions.EDIT]: true,
      [UserActions.ADD]: true,
      [UserActions.DELETE]: true,
    };
  } else {
    return {
      [UserActions.READ]: true,
      [UserActions.EDIT]: false,
      [UserActions.ADD]: false,
      [UserActions.DELETE]: false,
    };
  }
};
