import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import CustomSpinner from "../CustomSpinner";
import PageLayout from "../PageLayout";
import BulkFaqModal from "./components/BulkFaqModal";
import EditFaq from "./components/EditFaq";
import FaqHeader from "./components/FaqHeader";
import ViewFaq from "./components/ViewFaq";
import useAddFaq, { IAddFaq } from "./hooks/useAddFaq";
import useDeleteFaq from "./hooks/useDeleteFaq";
import { IResponseFaq, useGetFaqs } from "./hooks/useGetFaqs";
import useUpdateFaq from "./hooks/useUpdateFaq";
import { UserActions } from "./utils/data";

const FaqView = ({
  permissions,
}: {
  permissions: Record<UserActions, boolean>;
}) => {
  const { data, setCategoryId, setSearchQuery, isLoading } = useGetFaqs();
  const [isAddNewClicked, setIsAddNewClicked] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const { mutate: addFaq, isLoading: isAddFaqLoading } = useAddFaq();
  const { mutate: editFaq, isLoading: isEditFaqLoading } = useUpdateFaq();
  const { mutate: deleteFaq, isLoading: isDeleteFaqLoading } = useDeleteFaq();

  const handleAddFaq = (e: IAddFaq) => {
    addFaq([e]);
    setIsAddNewClicked(false);
  };

  const handleEditFaq = (e: IResponseFaq) => {
    editFaq(e);
    setEditIndex(null);
  };

  return (
    <PageLayout>
      <Flex flexDir="column" gridGap="20px" pb="20px">
        <FaqHeader
          addPermission={permissions[UserActions.ADD]}
          isAddNewOpen={isAddNewClicked}
          onClick={() => setIsAddNewClicked(true)}
          setCategoryId={setCategoryId}
          setSearchQuery={setSearchQuery}
        />

        {isLoading ||
        isAddFaqLoading ||
        isEditFaqLoading ||
        isDeleteFaqLoading ? (
          <CustomSpinner height={40} />
        ) : !data?.length && !isAddNewClicked ? (
          // TODO: Add empty state component here
          <React.Fragment />
        ) : (
          <React.Fragment>
            {isAddNewClicked && (
              <EditFaq
                key="new-faq"
                onCancel={() => setIsAddNewClicked(false)}
                onAdd={handleAddFaq}
                onEdit={handleEditFaq}
              />
            )}
            {data?.map((item, idx) =>
              editIndex !== null && idx === editIndex ? (
                <EditFaq
                  key={`${item.id}-${idx}`}
                  data={item}
                  onCancel={() => setEditIndex(null)}
                  onAdd={handleAddFaq}
                  onEdit={handleEditFaq}
                />
              ) : (
                <ViewFaq
                  key={`${item.id}-${new Date().getTime().toString()}`}
                  index={idx}
                  permissions={permissions}
                  data={item}
                  editIndex={editIndex}
                  setEditIndex={setEditIndex}
                  onEdit={handleEditFaq}
                  onDelete={deleteFaq}
                />
              )
            )}
          </React.Fragment>
        )}
      </Flex>
      <BulkFaqModal />
    </PageLayout>
  );
};

export default FaqView;
