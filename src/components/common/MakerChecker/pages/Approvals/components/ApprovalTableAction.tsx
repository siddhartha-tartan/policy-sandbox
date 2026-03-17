import { useSetAtom } from "jotai";
import { Eye, Tick } from "react-huge-icons/outline";
import { CgClose } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import EventBus from "../../../../../../EventBus";
import useGetUserType from "../../../../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../../../../utils/constants/constants";
import CustomButton from "../../../../../DesignSystem/CustomButton";
import useApproveRejectApproval from "../../../common/hooks/useApproveRejectApproval";
import { MAKER_CHECKER_SUB_ROUTES } from "../../../utils/constant";
import { selectionActionRequestIdRow } from "../atom";
import { IApprovalRequest } from "../hooks/useGetApprovalRequests";
import { EVENT_OPEN_REJECT_APPROVAL_MODAL } from "./ApprovalRejectModal";

const ApprovalTableAction = ({
  data,
  isAuditTrailTable,
}: {
  data: IApprovalRequest;
  isAuditTrailTable: boolean;
}) => {
  const setRow = useSetAtom(selectionActionRequestIdRow);
  const navigate = useNavigate();
  const userType = useGetUserType();
  const { mutate, isLoading } = useApproveRejectApproval();
  const ctaProps = {
    height: "30px",
    width: "100px",
    fontSize: "13px",
    lineHeight: "20px",
  };
  return (
    <div className="flex flex-row gap-[10px]">
      <div
        className="w-[30px] h-[30px] flex items-center justify-center rounded-md cursor-pointer 
 bg-[linear-gradient(95deg,_#3762DD_-1.14%,_#1D3577_158.31%)]
 transition-all duration-300 ease-in-out 
 hover:bg-[linear-gradient(95deg,_#1D3577_-1.14%,_#3762DD_158.31%)]
 hover:scale-110"
        onClick={() =>
          isAuditTrailTable
            ? navigate(
                `${
                  BASE_ROUTES[userType]
                }/maker-checker/${MAKER_CHECKER_SUB_ROUTES.AUDIT_TRAIL_DETAIL?.replace(
                  ":id",
                  data?.request_id
                )}`
              )
            : navigate(
                `${
                  BASE_ROUTES[userType]
                }/maker-checker/${MAKER_CHECKER_SUB_ROUTES.TIMELINE?.replace(
                  ":id",
                  data?.request_id
                )}`
              )
        }
      >
        <Eye className="text-white text-[16px]" />
      </div>
      {!isAuditTrailTable && (
        <>
          <CustomButton
            variant={"primary"}
            style={{
              ...ctaProps,
              color: "#27A376",
              background: "#E8F5E9",
              borderColor: "#E8F5E9",
            }}
            _hover={{
              transition: "all 250ms ease-out",
            }}
            isDisabled={isLoading}
            leftIcon={<Tick fontSize={"18px"} fontWeight={700} />}
            onClick={() =>
              mutate({ action_type: "APPROVE", request_id: data?.request_id })
            }
          >
            Approve
          </CustomButton>
          <CustomButton
            variant={"secondary"}
            style={ctaProps}
            className="items-center"
            leftIcon={<CgClose />}
            isDisabled={isLoading}
            onClick={() => {
              setRow(data?.request_id);
              EventBus.getInstance().fireEvent(
                EVENT_OPEN_REJECT_APPROVAL_MODAL
              );
            }}
          >
            Reject
          </CustomButton>
        </>
      )}
    </div>
  );
};

export default ApprovalTableAction;
