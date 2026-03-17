import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import EventBus from "../../../../../EventBus";
import CustomModal from "../../../../common/CustomModal";
import FileUpload from "./FileUpload";
import ImportOptions from "./ImportOptions";
import UploadError from "./UploadError";

export const EVENT_OPEN_IMPORT_DESTINATION_VARIABLE =
  "EVENT_OPEN_IMPORT_DESTINATION_VARIABLE";

export default function ImportDestinationVariableModal() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [step, setStep] = useState<number>(0);
  useEffect(() => {
    EventBus.getInstance().addListener(
      EVENT_OPEN_IMPORT_DESTINATION_VARIABLE,
      () => {
        setStep(0);
        onOpen();
      }
    );
    return () => {
      EventBus.getInstance().removeListener(onOpen);
    };
  }, []);

  const stepRenderer = () => {
    switch (step) {
      case 0: {
        return <ImportOptions onClose={onClose} onSelect={() => setStep(1)} />;
      }
      case 1: {
        return (
          <FileUpload
            onError={() => setStep(2)}
            onBack={() => setStep(0)}
            onClose={onClose}
          />
        );
      }
      case 2: {
        return <UploadError onBack={() => setStep(1)} />;
      }
      default: {
        return <ImportOptions onClose={onClose} onSelect={() => setStep(1)} />;
      }
    }
  };

  return (
    <CustomModal
      borderRadius={"16px"}
      isOpen={isOpen}
      onClose={() => {}}
      position={"absolute"}
      left={"55%"}
      top={"52%"}
    >
      {stepRenderer()}
    </CustomModal>
  );
}
