import { ButtonProps, Flex, useDisclosure } from "@chakra-ui/react";
import { userStore } from "../../../../store/userStore";
import CustomButton from "../../../DesignSystem/CustomButton";
import CompareIcon from "../../../../assets/Icons/CompareIcon";
import { FeatureIdentifiers } from "../../../../utils/constants/constants";
import { VersionHistoryItem } from "../../Policy/hooks/useGetPolicyDetails";
import VersionSelectionModal from "./VersionSelectionModal";

type CustomButtonProps = Omit<ButtonProps, "variant"> & {
  variant?: "primary" | "secondary" | "tertiary";
};

interface IProps extends CustomButtonProps {
  title?: string;
  useModal?: boolean;
  versionData?: VersionHistoryItem[];
  onCompareSuccess?: () => void;
}

const ComparePolicyVersionsCta = ({ 
  title, 
  useModal = false, 
  versionData = [], 
  onCompareSuccess,
  onClick,
  ...props 
}: IProps) => {
  const { enabledFeature } = userStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const shouldRenderCta = enabledFeature.includes(
    FeatureIdentifiers.POLICY_COMPARISON
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (useModal) {
      onOpen();
    } else if (onClick) {
      onClick(e);
    }
  };

  return shouldRenderCta ? (
    <>
      <CustomButton
        variant="tertiary"
        className="w-fit font-bold text-sm"
        leftIcon={<CompareIcon />}
        onClick={handleClick}
        {...props}
      >
        {title ? title : "Compare Versions"}
      </CustomButton>
      
      {useModal && (
        <VersionSelectionModal
          isOpen={isOpen}
          onClose={onClose}
          versionData={versionData}
          onCompareSuccess={onCompareSuccess}
        />
      )}
    </>
  ) : (
    <Flex />
  );
};

export default ComparePolicyVersionsCta;
