// Status.tsx
import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";
import { systemColors } from "../DesignSystem/Colors/SystemColors";

export enum StatusTypes {
  DRAFTED = "DRAFTED",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  SCHEDULE = "SCHEDULE",
  CANCELLED = "CANCELLED",
  PENDING = "PENDING",
  ABSENT = "ABSENT",
  ACTIVE = "ACTIVE",
  DELETED = "DELETED",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  INACTIVE = "INACTIVE",
  PAUSED = "PAUSED",
  COMPLETELY_ATTESTED = "COMPLETELY ATTESTED",
  ATTESTATION_PENDING = "ATTESTATION PENDING",
  ATTEMPTED = "ATTEMPTED",
  MISSED = "MISSED",
  PASSED = "PASSED",
  DEACTIVATED = "DEACTIVATED",
  REJECTED = "REJECTED",
  SUCCESSFUL = "SUCCESSFUL",
  "PENDING REVIEW" = "PENDING REVIEW",
  "DRAFT" = "DRAFT",
  "APPROVED" = "APPROVED",
  "IN-REVIEW" = "IN-REVIEW",
  UPLOADING = "UPLOADING",
}

interface StatusProps extends BoxProps {
  status?: StatusTypes; // Make status optional
}

const defaultStatus = StatusTypes.INACTIVE; // Set a default status

// Helper function to convert string to title case
const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const statusMapping: Record<StatusTypes, BoxProps> = {
  [StatusTypes.DRAFTED]: {
    bgColor: systemColors.black[200],
    textColor: systemColors.black[500],
  },
  [StatusTypes.ONGOING]: {
    bgColor: systemColors.orange[50],
    textColor: systemColors.orange[600],
  },
  [StatusTypes.COMPLETED]: {
    bgColor: "#E0F2F1",
    textColor: "#00796B",
  },
  [StatusTypes.SUCCESSFUL]: {
    bgColor: "#E0F2F1",
    textColor: "#00796B",
  },
  [StatusTypes.SCHEDULE]: {
    bgColor: "#E0F2F1",
    textColor: "#00796B",
  },
  [StatusTypes.ATTEMPTED]: {
    bgColor: "#E0F2F1",
    textColor: "#00796B",
  },
  [StatusTypes.CANCELLED]: {
    bgColor: "#FFD8D4",
    textColor: "#BF360C",
  },
  [StatusTypes.PENDING]: {
    bgColor: systemColors.orange[50],
    textColor: systemColors.orange[600],
  },
  [StatusTypes.ABSENT]: {
    bgColor: "red.50",
    textColor: "red.500",
  },
  [StatusTypes.ACTIVE]: {
    bgColor: "#E0F2F1",
    textColor: "#00796B",
  },
  [StatusTypes.DELETED]: {
    bgColor: "red.50",
    textColor: "red.500",
  },
  [StatusTypes.DEACTIVATED]: {
    bgColor: "red.50",
    textColor: "red.500",
  },
  [StatusTypes.SUCCESS]: {
    bgColor: "#E0F2F1",
    textColor: "#00796B",
  },
  [StatusTypes.FAILED]: {
    bgColor: "#FFD8D4",
    textColor: "#E64A19",
  },
  [StatusTypes.PASSED]: {
    bgColor: "#E0F2F1",
    textColor: "#00796B",
  },
  [StatusTypes.MISSED]: {
    bgColor: systemColors.orange[50],
    textColor: systemColors.orange[600],
  },

  [StatusTypes.INACTIVE]: {
    bgColor: "#FFD8D4",
    textColor: "#E64A19",
  },
  [StatusTypes.PAUSED]: {
    bgColor: "yellow.50",
    textColor: "yellow.600",
  },
  [StatusTypes.COMPLETELY_ATTESTED]: {
    bgColor: "#E0F2F1",
    textColor: "#00796B",
  },
  [StatusTypes.ATTESTATION_PENDING]: {
    bgColor: systemColors.orange[50],
    textColor: systemColors.orange[600],
  },
  [StatusTypes.REJECTED]: {
    bgColor: "red.50",
    textColor: "red.500",
  },
  [StatusTypes["PENDING REVIEW"]]: {
    bgColor: "#E1F5FE",
    textColor: "#536DFE",
  },
  [StatusTypes["DRAFT"]]: {
    bgColor: systemColors.yellow[50],
    textColor: systemColors.yellow[600],
  },
  [StatusTypes["APPROVED"]]: {
    bgColor: "#E0F2F1",
    textColor: "#00796B",
  },
  [StatusTypes["IN-REVIEW"]]: {
    bgColor: systemColors.orange[50],
    textColor: systemColors.orange[600],
  },
  [StatusTypes.UPLOADING]: {
    bgColor: systemColors.orange[50],
    textColor: systemColors.orange[600],
  },
};
const Status: React.FC<StatusProps> = ({ status, ...props }) => {
  // Use the status if it matches, otherwise fall back to defaultStatus
  const uppercaseStatus = (status || defaultStatus).toUpperCase();
  //@ts-ignore
  const statusProperties = statusMapping[uppercaseStatus];
  return (
    <Box
      className={
        "flex flex-row gap-2 justify-center items-center px-3 h-5 rounded-[8px] text-center"
      }
      style={{
        background: statusProperties?.bgColor,
        color: statusProperties?.textColor,
        fontSize: "12px",
        lineHeight: "16px",
        fontWeight: 600,
      }}
      w={"100px"}
      minW={"100px"}
      {...props}
    >
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{ background: statusProperties?.textColor }}
      ></span>
      <span> {toTitleCase(status || defaultStatus)}</span>
    </Box>
  );
};

export default Status;
