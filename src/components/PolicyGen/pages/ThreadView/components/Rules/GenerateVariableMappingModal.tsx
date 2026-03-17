import { useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";
import EventBus from "../../../../../../EventBus";
import ProcessingModal from "../../../VariableMappingBase/components/ProcessingModal";

export const EVENT_OPEN_GENERATE_VARIABLE_MAPPING =
  "EVENT_OPEN_GENERATE_VARIABLE_MAPPING";
export const EVENT_CLOSE_GENERATE_VARIABLE_MAPPING =
  "EVENT_CLOSE_GENERATE_VARIABLE_MAPPING";

export default function GenerateVariableMappingModal() {
  const { onOpen, onClose, isOpen } = useDisclosure();

  useEffect(() => {
    EventBus.getInstance().addListener(
      EVENT_OPEN_GENERATE_VARIABLE_MAPPING,
      onOpen
    );
    EventBus.getInstance().addListener(
      EVENT_CLOSE_GENERATE_VARIABLE_MAPPING,
      onClose
    );

    return () => {
      EventBus.getInstance().removeListener(onOpen);
      EventBus.getInstance().removeListener(onClose);
    };
  }, []);

  return <ProcessingModal isOpen={isOpen} />;
}
