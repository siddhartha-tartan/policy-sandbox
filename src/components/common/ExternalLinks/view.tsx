import { useDisclosure } from "@chakra-ui/hooks";
import { CloseButton, Flex } from "@chakra-ui/react";
import { useEffect, useMemo, useReducer, useState } from "react";
import { PlusThin, Trash } from "react-huge-icons/outline";
import EventBus from "../../../EventBus";
import { userStore } from "../../../store/userStore";
import { UserType } from "../../../utils/constants/constants";
import CustomButton from "../../DesignSystem/CustomButton";
import CustomText from "../../DesignSystem/Typography/CustomText";
import AppInputs from "../../forms/AppInputs";
import { checkFormValidity } from "../../forms/utils/checkFormValidity";
import { FormState } from "../../forms/utils/data";
import { formErrorsReducer } from "../../forms/utils/formErrorReducer";
import { formReducer } from "../../forms/utils/formReducer";
import CustomModal from "../CustomModal";
import useAddLink from "./hooks/useAddLink";
import useDeleteLink from "./hooks/useDeleteLink";
import useGetLinks, { ILink } from "./hooks/useGetLinks";
import useUpdateLink from "./hooks/useUpdateLink";
import { AddLinkFormConfig, linkFormValidators } from "./utils/config";

export const EVENT_OPEN_MANAGE_EXTERNAL_LINKS =
  "EVENT_OPEN_MANAGE_EXTERNAL_LINKS";

const newLink = {
  id: "",
  link_name: "",
  description: "",
  url: "",
  is_active: true,
  edit: true,
};

export default function ManageExternalLinksModal() {
  const { data, isLoading: isLoadingLinks } = useGetLinks();
  const { mutate: addLink, isLoading: isAddingLink } = useAddLink();
  const { mutate: updateLink, isLoading: isUpdatingLink } = useUpdateLink();
  const { mutate: deleteLink } = useDeleteLink();
  const [addFlow, setAddFlow] = useState(false);
  const [links, setLinks] = useState<ILink[]>([]);
  const { userType } = userStore();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [editingLink, setEditingLink] = useState<ILink | null>(null);
  const [formState, dispatchFormValue] = useReducer(formReducer, {});
  const [formErrors, dispatchFormError] = useReducer(formErrorsReducer, {});

  useEffect(() => {
    const openHandler = () => {
      setEditingLink(null);
      setAddFlow(false);
      onOpen();
    };
    EventBus.getInstance().addListener(
      EVENT_OPEN_MANAGE_EXTERNAL_LINKS,
      openHandler
    );

    return () => {
      EventBus.getInstance().removeListener(openHandler);
    };
  }, []);

  useEffect(() => {
    if (data?.length === 0) {
      // setLinks([]);
      return;
    }
    initiliseLinks();
  }, [data]);

  const disableSubmit = useMemo(
    () =>
      formState
        ? checkFormValidity(
            formErrors,
            AddLinkFormConfig?.formFields,
            formState
          )
        : true,
    [formState, formErrors, AddLinkFormConfig?.formFields]
  );

  const initiliseLinks = () => {
    const updatedLinks = data?.map((item) => {
      return { ...item, edit: false };
    });
    setLinks(updatedLinks || []);
  };

  const isAdmin = userType === UserType.ADMIN;

  const handleAddNewLink = () => {
    const id = new Date().getTime().toString();
    const newLinkWithId = { ...newLink, id };
    setLinks([...links, newLinkWithId]);
    setEditingLink(newLinkWithId);
    dispatchFormValue({
      type: FormState.INIT,
      initialValues: newLinkWithId,
    });
    dispatchFormError({ type: FormState.RESET });
    setAddFlow(true);
  };

  return (
    <CustomModal
      w={"440px"}
      borderRadius={"16px"}
      maxH={"600px"}
      overflowY={"auto"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Flex className="rounded-[16px] bg-white p-6 gap-6 w-full h-full overflow-y-auto flex-col">
        <div className="flex flex-row justify-between items-center">
          <CustomText stylearr={[16, 18, 700]}>External Links</CustomText>
          <CloseButton onClick={onClose} />
        </div>
        {isLoadingLinks ? (
          <div className="flex flex-col gap-6 items-center justify-center">
            <CustomText stylearr={[16, 18, 700]}>Loading...</CustomText>
          </div>
        ) : !links || !links?.length ? (
          <div className="flex flex-col gap-6 items-center justify-center">
            <div className="flex flex-col gap-2 items-center justify-center">
              {" "}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.2"
                  d="M12 12.1022V21.75C11.874 21.7494 11.7502 21.7172 11.64 21.6562L3.39 17.1393C3.2722 17.0749 3.17386 16.98 3.10526 16.8646C3.03666 16.7491 3.0003 16.6174 3 16.4831V7.51685C3.0003 7.41181 3.02266 7.308 3.06563 7.21216L12 12.1022Z"
                  fill="#ABAAAD"
                />
                <path
                  d="M20.97 6.20146L12.72 1.68739C12.4996 1.5656 12.2518 1.50171 12 1.50171C11.7482 1.50171 11.5004 1.5656 11.28 1.68739L3.03 6.20333C2.7944 6.33224 2.59772 6.52205 2.46052 6.75292C2.32331 6.98379 2.25061 7.24727 2.25 7.51583V16.4821C2.25061 16.7506 2.32331 17.0141 2.46052 17.245C2.59772 17.4759 2.7944 17.6657 3.03 17.7946L11.28 22.3105C11.5004 22.4323 11.7482 22.4962 12 22.4962C12.2518 22.4962 12.4996 22.4323 12.72 22.3105L20.97 17.7946C21.2056 17.6657 21.4023 17.4759 21.5395 17.245C21.6767 17.0141 21.7494 16.7506 21.75 16.4821V7.51677C21.7499 7.24773 21.6774 6.98366 21.5402 6.75225C21.403 6.52084 21.206 6.3306 20.97 6.20146ZM12 2.99989L19.5319 7.12489L16.7409 8.65302L9.20813 4.52802L12 2.99989ZM12 11.2499L4.46812 7.12489L7.64625 5.38489L15.1781 9.5099L12 11.2499ZM3.75 8.4374L11.25 12.5418V20.5846L3.75 16.483V8.4374ZM20.25 16.4793L12.75 20.5846V12.5455L15.75 10.904V14.2499C15.75 14.4488 15.829 14.6396 15.9697 14.7802C16.1103 14.9209 16.3011 14.9999 16.5 14.9999C16.6989 14.9999 16.8897 14.9209 17.0303 14.7802C17.171 14.6396 17.25 14.4488 17.25 14.2499V10.0827L20.25 8.4374V16.4783V16.4793Z"
                  fill="#ABAAAD"
                />
              </svg>
              <div className="flex flex-col gap-1 items-center justify-center">
                {" "}
                <CustomText stylearr={[12, 18, 600]}>No links yet</CustomText>
                <CustomText stylearr={[12, 18, 500]} color={"#ABAAAD"}>
                  Add your first link to get started
                </CustomText>
              </div>
            </div>

            <CustomButton
              variant="quaternary"
              w={"160px"}
              h={"32px"}
              fontSize={"14px"}
              lineHeight={"24px"}
              gap={0}
              leftIcon={<PlusThin fontSize={"20px"} />}
              onClick={handleAddNewLink}
            >
              Add External Link
            </CustomButton>
          </div>
        ) : (
          <div className="flex flex-col gap-4 h-full overflow-y-auto">
            <div className="flex flex-row justify-between items-center">
              <CustomText stylearr={[14, 20, 600]}>
                Manage Links {links?.length}/5
              </CustomText>
              {isAdmin ? (
                <CustomButton
                  variant="quaternary"
                  w={"120px"}
                  h={"32px"}
                  fontSize={"14px"}
                  lineHeight={"24px"}
                  isDisabled={links?.length >= 5 || !!editingLink}
                  gap={0}
                  leftIcon={<PlusThin fontSize={"20px"} />}
                  onClick={handleAddNewLink}
                >
                  Add New Link
                </CustomButton>
              ) : null}
            </div>
            {links?.map((item, index) => (
              <div key={item.id}>
                {editingLink?.id === item.id ? (
                  <div className="flex flex-col gap-3 px-3 py-4 border rounded-[12px]">
                    <div className="flex flex-row justify-between items-center">
                      <CustomText stylearr={[14, 18, 600]}>
                        External Link {index + 1}
                      </CustomText>
                      <Trash
                        className="cursor-pointer hover:scale-110 transition-all duration-300"
                        onClick={() => {
                          deleteLink(
                            { id: item.id },
                            {
                              onSuccess: () => {
                                setTimeout(() => {
                                  setEditingLink(null);
                                }, 300);
                              },
                            }
                          );
                        }}
                      />
                    </div>
                    <AppInputs
                      formConfig={AddLinkFormConfig}
                      formFields={AddLinkFormConfig.formFields}
                      formValidators={linkFormValidators}
                      formValue={formState}
                      formErrors={formErrors}
                      dispatchValue={dispatchFormValue}
                      dispatchError={dispatchFormError}
                    />
                    <div className="flex flex-row gap-4 justify-end">
                      <CustomButton
                        variant="secondary"
                        fontSize={"14px"}
                        lineHeight={"24px"}
                        fontWeight={600}
                        onClick={() => {
                          // If it's a new link, remove it from the list
                          if (!item.link_name) {
                            setLinks((prev) =>
                              prev.filter((link) => link.id !== item.id)
                            );
                          }
                          setEditingLink(null);
                          dispatchFormValue({
                            type: FormState.INIT,
                            initialValues: {},
                          });
                          dispatchFormError({ type: FormState.RESET });
                        }}
                        w={"79px"}
                        h={"44px"}
                      >
                        Cancel
                      </CustomButton>
                      <CustomButton
                        variant="quaternary"
                        disabled={disableSubmit}
                        fontSize={"14px"}
                        lineHeight={"24px"}
                        fontWeight={600}
                        isLoading={isAddingLink || isUpdatingLink}
                        onClick={() => {
                          if (formState) {
                            const payload = {
                              ...formState,
                              edit: false,
                              is_active: true,
                            };

                            const mutation = addFlow ? addLink : updateLink;
                            mutation(payload as ILink, {
                              onSuccess: () => {
                                setTimeout(() => {
                                  setAddFlow(false);
                                  setEditingLink(null);
                                  dispatchFormValue({
                                    type: FormState.INIT,
                                    initialValues: {},
                                  });
                                  dispatchFormError({ type: FormState.RESET });
                                }, 300);
                              },
                            });
                          }
                        }}
                        w={"127px"}
                        h={"44px"}
                      >
                        Save Changes
                      </CustomButton>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-row justify-between items-center border rounded-[12px] px-3 py-4">
                    <div
                      className="flex flex-col gap-2"
                      style={{ width: isAdmin ? "80%" : "100%" }}
                    >
                      <CustomText stylearr={[14, 18, 600]}>
                        {item?.link_name}
                      </CustomText>
                      <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
                        {item?.description}
                      </CustomText>
                    </div>
                    {isAdmin ? (
                      <CustomButton
                        variant="quinary"
                        w={"58px"}
                        h={"32px"}
                        fontSize={"12px"}
                        lineHeight={"18px"}
                        fontWeight={400}
                        isDisabled={!!editingLink}
                        onClick={() => {
                          setAddFlow(false);
                          setEditingLink(item);
                          dispatchFormValue({
                            type: FormState.INIT,
                            initialValues: item,
                          });
                          dispatchFormError({ type: FormState.RESET });
                        }}
                      >
                        Modify
                      </CustomButton>
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Flex>
    </CustomModal>
  );
}
