import { Switch } from "@chakra-ui/react";
import useEditPolicy from "../../hooks/useEditPolicy";
import { PolicyStatus } from "./Action";
import { useState } from "react";

export default function useDeactivateAction(
  isActive: boolean,
  categoryId: string,
  policyId: string,
  onSuccess: () => void
) {
  const { mutate, isLoading } = useEditPolicy(categoryId, policyId);
  const [value, setValue] = useState<boolean>(isActive);
  const config = {
    icon: (
      <Switch
        size="md"
        colorScheme="blue"
        isChecked={value}
        isDisabled={isLoading}
        onChange={() => {
          mutate(
            {
              status: value ? PolicyStatus.DEACTIVATE : PolicyStatus.ACTIVE,
            },
            {
              onSuccess() {
                setValue((prev) => !prev);
                onSuccess();
              },
            }
          );
        }}
      />
    ),
    title: value ? "Tap to Deactivate" : "Tap to Activate",
    onClick: null,
  };
  return config;
}
