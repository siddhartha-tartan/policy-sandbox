import { Divider } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Trash } from "react-huge-icons/outline";
import useGetUserType from "../../../../../hooks/useGetUserType";
import {
  BASE_MODULE_ROUTE,
  BASE_ROUTES,
  UserType,
} from "../../../../../utils/constants/constants";
import { IS_HR_PORTAL } from "../../../../../utils/constants/endpoints";
import { getHrPortalColorConfig } from "../../../../../utils/getHrPortalColorConfig";
import CustomButton from "../../../../DesignSystem/CustomButton";
import GradientText from "../../../GradientText/GradientText";
import PageLayout from "../../../PageLayout";
import { IAddUser } from "../../hooks/useAddUsers";
import styles from "../../utils/styles.module.css";
import Header from "./components/Header";
import UserForm from "./components/UserForm";

export const initUser: IAddUser = {
  source_employee_id: "",
  first_name: "",
  email: "",
  phone_number: "",
  user_type: "" as UserType,
  loan_category_access: null,
  feature_ids: [],
};

export default function AddUserManual() {
  const userType = useGetUserType();
  const [users, setUsers] = useState<IAddUser[]>([initUser]);
  const [errors, setErrors] = useState<boolean[]>([true]);
  const lastUserRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hrPortalColorConfig = getHrPortalColorConfig();

  useEffect(() => {
    setUsers([initUser]);
    setErrors([true]);
  }, []);

  const addUser = () => {
    setUsers([...users, initUser]);
    setErrors([...errors, true]);

    // Wait for the state to update and DOM to render with a longer timeout
    setTimeout(() => {
      if (lastUserRef.current && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const element = lastUserRef.current;

        // Calculate the position to scroll to
        const elementPosition = element.offsetTop;

        // Smooth scroll using the scrollTo method
        container.scrollTo({
          top: elementPosition - 250, // Add some padding at the top
          behavior: "smooth",
        });
      }
    }, 300);
  };

  return (
    <PageLayout
      breadCrumbsData={[
        {
          label: "User Management",
          navigateTo: `${BASE_ROUTES[userType]}/${BASE_MODULE_ROUTE.USER}`,
        },
        {
          label: "Add Employees",
          navigateTo: ``,
        },
      ]}
    >
      <div className="flex flex-col p-6 pb-2 gap-6 bg-white border border-[#FFF] rounded-[16px] w-full h-full h-full overflow-y-auto">
        <Header
          addUser={addUser}
          isDisabled={errors?.some((item) => item)}
          users={users}
        />
        <div
          ref={scrollContainerRef}
          className={`flex flex-col gap-6 overflow-y-auto pr-[2px] pb-2 ${styles.thinScrollbar}`}
          style={{ scrollBehavior: "smooth" }}
        >
          {users?.map((_, id) => (
            <div
              key={`add-user${id}${users?.length}`}
              className="flex flex-col gap-4"
              ref={id === users.length - 1 ? lastUserRef : null}
              style={id === users.length - 1 ? { scrollMarginTop: "20px" } : {}}
            >
              <div className="flex flex-row justify-between h-[34px]">
                <GradientText
                  text={` User ${id + 1}`}
                  gradient={
                    IS_HR_PORTAL
                      ? hrPortalColorConfig.primaryTextGradient
                      : "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)"
                  }
                  className="text-[16px] leading-[20px] font-semibold"
                />
                {users?.length !== 1 && (
                  <CustomButton
                    variant="secondary"
                    w={"110px"}
                    h="34px"
                    leftIcon={
                      <Trash style={{ fontSize: "16px" }} color="#555557" />
                    }
                    style={{
                      fontSize: "14px",
                      lineHeight: "18px",
                      color: "#555557",
                      border: "1px solid #00000014",
                    }}
                    onClick={() => {
                      setUsers(users?.filter((_, i) => i !== id));
                      setErrors(errors?.filter((_, i) => i !== id));
                    }}
                  >
                    Remove
                  </CustomButton>
                )}
              </div>
              <UserForm
                data={users?.[id]}
                setData={(e: IAddUser) => {
                  setUsers((prevUsers) => {
                    const updatedUsers = [...prevUsers];
                    updatedUsers[id] = e;
                    return updatedUsers;
                  });
                }}
                setError={(e: boolean) => {
                  setErrors((prevErrors) => {
                    const updatedErrors = [...prevErrors];
                    updatedErrors[id] = e;
                    return updatedErrors;
                  });
                }}
              />
              {id !== users?.length - 1 && (
                <Divider variant={"dashed"} mt={2} />
              )}
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
