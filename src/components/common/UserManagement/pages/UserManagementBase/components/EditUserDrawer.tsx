import { Divider, Flex, Portal, useDisclosure } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import EventBus from "../../../../../../EventBus";
import { UserType } from "../../../../../../utils/constants/constants";
import CustomButton from "../../../../../DesignSystem/CustomButton";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import AppInputs from "../../../../../forms/AppInputs";
import { IUser } from "../../../hooks/useGetUsers";
import useUpdateUser from "../../../hooks/useUpdateUser";
import UserForm from "../../AddUserManual/components/UserForm";
import { selectedEditUserAtom } from "../utils/atom";
import { queryPermissionField, UserStatusField } from "../utils/config";

export const EVENT_OPEN_EDIT_USER_DRAWER = "EVENT_OPEN_EDIT_USER_DRAWER";

const MotionFlex = motion(Flex);
export default function EditUserDrawer() {
  const selectedEditUser = useAtomValue(selectedEditUserAtom);
  const [data, setData] = useState<IUser | null>(null);
  const [error, setError] = useState<boolean>(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { mutate, isLoading } = useUpdateUser();

  useEffect(() => {
    const handleOpenDrawer = (userData?: IUser) => {
      if (userData) {
        setData(userData);
      } else {
        setData(selectedEditUser);
      }
      onOpen();
    };

    EventBus.getInstance().addListener(
      EVENT_OPEN_EDIT_USER_DRAWER,
      handleOpenDrawer
    );

    return () => {
      EventBus.getInstance().removeListener(handleOpenDrawer);
    };
  }, [selectedEditUser, onOpen]);

  const handleSubmit = () => {
    if (data) {
      mutate(data, {
        onSuccess() {
          onClose();
        },
      });
    }
  };

  // Safe update function to handle null data
  const safeUpdateData = (inputKey: string, value: any) => {
    setData((prevData) => {
      if (!prevData) return null;
      return { ...prevData, [inputKey]: value };
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          {/* Overlay */}
          <MotionFlex
            className="fixed top-0 left-0 right-0 bottom-0 bg-[#00000066] z-50	"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />

          {/* Drawer */}
          <MotionFlex
            className="fixed right-4 bottom-4 top-4 bg-white z-[51] flex flex-col w-[600px]  border rounded-[8px]"
            boxShadow="0px 4px 30px rgba(0, 0, 0, 0.1)"
            flexDirection="column"
            initial={{ x: "100vh", opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100vh", opacity: 1 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              bounce: 0.1,
            }}
          >
            <div className="flex flex-col py-6 gap-6 h-full overflow-y-auto">
              <div className="flex px-6 justify-between items-center">
                <CustomText stylearr={[20, 28, 500]}>Edit Details</CustomText>
                <IoClose fontSize={"20px"} onClick={onClose} />
              </div>
              <div className="flex flex-col gap-6 px-6 h-full overflow-y-auto">
                <AppInputs
                  formConfig={{ formFields: [UserStatusField] }}
                  formFields={[UserStatusField]}
                  formValue={data}
                  dispatchValue={(value) => {
                    safeUpdateData(value.inputKey, value.value);
                  }}
                />
                <Divider variant={"dashed"} />
                {data?.id && (
                  <UserForm
                    key={data?.id}
                    data={data}
                    setData={(updatedData) => {
                      setData(updatedData as IUser);
                    }}
                    setError={setError}
                    isEdit={true}
                  />
                )}
                {data?.user_type === UserType.STAFF_USER ||
                data?.user_type === UserType.QUERY_STAFF_USER ? (
                  <>
                    <Divider variant={"dashed"} />
                    <AppInputs
                      formConfig={{ formFields: [queryPermissionField] }}
                      formFields={[queryPermissionField]}
                      formValue={data}
                      dispatchValue={(value) => {
                        safeUpdateData(value.inputKey, value.value);
                      }}
                    />
                  </>
                ) : (
                  <></>
                )}
                <div className="flex flex-row gap-4 justify-end h-[40px]">
                  <CustomButton
                    variant={"secondary"}
                    className="w-[160px] text-sm font-semibold"
                    onClick={onClose}
                  >
                    Cancel
                  </CustomButton>
                  <CustomButton
                    variant={"quaternary"}
                    isDisabled={error || isLoading || !data}
                    isLoading={isLoading}
                    onClick={handleSubmit}
                    className="w-[160px] text-sm font-semibold"
                  >
                    Save
                  </CustomButton>
                </div>
              </div>
            </div>
          </MotionFlex>
        </Portal>
      )}
    </AnimatePresence>
  );
}
