import { CheckCircleIcon, CopyIcon } from "@chakra-ui/icons";
import { useState, useEffect, useRef } from "react";
import CustomButton from "./DesignSystem/CustomButton";
import CustomText from "./DesignSystem/Typography/CustomText";

interface CopyableTooltipProps {
  children: React.ReactNode;
  content: string;
}

const CopyableTooltip = ({ children, content }: CopyableTooltipProps) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div ref={tooltipRef} className="group relative flex items-center">
      <div onClick={toggleTooltip}>{children}</div>
      <div
        className={`
          absolute right-0 top-7 z-50 w-[max-content] min-w-[180px] max-w-[400px] flex-col rounded-lg border border-gray-200 bg-white p-1 mt-1 transition-opacity duration-200
          ${
            isOpen
              ? "flex opacity-100"
              : "hidden opacity-0 group-hover:flex group-hover:opacity-100"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-2 py-1.5 bg-[#FAFAFA] rounded-md mb-1 border-b border-gray-100">
          <CustomText stylearr={[12, 18, 600]} color="#111827">
            Generated SQL
          </CustomText>
          <CustomButton
            variant="secondary"
            onClick={handleCopy}
            className="font-medium w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded"
          >
            {copied ? (
              <CheckCircleIcon width={14} color={"green"} />
            ) : (
              <CopyIcon width={14} color={"gray"} />
            )}
          </CustomButton>
        </div>

        {/* Content Preview (Scrollable) */}
        <div className="relative rounded bg-gray-900 p-2 font-mono text-[11px] text-gray-300 max-h-[200px] overflow-y-auto custom-scrollbar">
          <p className="leading-relaxed break-all whitespace-pre-wrap">
            {content}
          </p>
        </div>
      </div>

      {/* Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111827;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4B5563;
        }
      `}</style>
    </div>
  );
};

export default CopyableTooltip;
