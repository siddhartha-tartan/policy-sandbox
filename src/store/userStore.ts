import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { ILoanCategory } from "../hooks/useGetLoanCategories";
import { UserType } from "../utils/constants/constants";

interface USER_STATE {
  name: string;
  setName: (payload: string) => void;
  homeRoute: string;
  setHomeRoute: (payload: string) => void;
  email: string;
  setEmail: (payload: string) => void;
  phoneNumber: string;
  setPhoneNumber: (payload: string) => void;
  userType: UserType;
  setUserType: (payload: UserType) => void;
  id: string;
  setId: (payload: string) => void;
  empId: string;
  setEmpId: (payload: string) => void;
  organisationId: string;
  setOrganisationId: (payload: string) => void;
  organisationName?: string;
  setOrganisationName: (payload: string) => void;
  loanCategories: ILoanCategory[];
  editableLoanCategories: ILoanCategory[];

  setLoanCategories: (payload: ILoanCategory[]) => void;
  setEditableLoanCategories: (payload: ILoanCategory[]) => void;
  enabledFeature: string[];
  setEnabledFeature: (payload: string[]) => void;
  sourceEmployeeId: string;
  setSoruceEmployeeId: (payload: string) => void;
  dashboardFeatures: string[];
  setDashboardFeatures: (payload: string[]) => void;
}

export const userStore = create<USER_STATE>()(
  devtools(
    persist(
      (set, _) => ({
        name: "",
        homeRoute: "",
        email: "",
        phoneNumber: "",
        userType: "" as UserType,
        id: "",
        empId: "",
        sourceEmployeeId: "",
        organisationId: "",
        organisationName: "",
        dashboardFeatures: [],
        loanCategories: [],
        editableLoanCategories: [],
        enabledFeature: [],
        setName: (payload) =>
          set(() => ({
            name: payload,
          })),
        setHomeRoute: (payload) =>
          set(() => ({
            homeRoute: payload,
          })),
        setEmail: (payload) => set(() => ({ email: payload })),
        setPhoneNumber: (payload) => set(() => ({ phoneNumber: payload })),
        setUserType: (payload) => set(() => ({ userType: payload })),
        setId: (payload) => set(() => ({ id: payload })),
        setEmpId: (payload) => set(() => ({ empId: payload })),
        setLoanCategories: (payload) =>
          set(() => ({ loanCategories: payload })),
        setEditableLoanCategories: (payload) =>
          set(() => ({ editableLoanCategories: payload })),
        setSoruceEmployeeId: (payload) =>
          set(() => ({ sourceEmployeeId: payload })),
        setEnabledFeature: (payload) =>
          set(() => ({ enabledFeature: payload })),
        setDashboardFeatures: (payload) =>
          set(() => ({ dashboardFeatures: payload })),
        setOrganisationId: (payload) =>
          set(() => ({ organisationId: payload })),
        setOrganisationName: (payload) =>
          set(() => ({ organisationName: payload })),
      }),
      {
        name: "UserStore",
      },
    ),
  ),
);
