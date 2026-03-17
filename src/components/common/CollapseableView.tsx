import { ChevronDownIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface CollapseableViewProps {
  header: React.ReactNode;
  children: React.ReactNode;
  isInitiallyExpanded?: boolean;
  enableScrollToView?: boolean;
  className?: string;
}

export default function CollapseableView({
  header,
  children,
  isInitiallyExpanded = true,
  enableScrollToView = false,
  className = "",
}: CollapseableViewProps) {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);
  const contentRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const updateContentHeight = () => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  };

  useEffect(() => {
    updateContentHeight();

    // Use ResizeObserver to handle dynamic content changes
    const resizeObserver = new ResizeObserver(updateContentHeight);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [children]);

  useEffect(() => {
    if (isExpanded && enableScrollToView && componentRef.current) {
      setTimeout(() => {
        componentRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 200); // Slightly longer delay to ensure animation completes
    }
  }, [isExpanded, enableScrollToView]);

  return (
    <div
      ref={componentRef}
      className={`flex flex-col gap-6 w-full ${className}`}
    >
      <div className="flex flex-row justify-between items-center select-none">
        {header}
        <motion.div
          className="p-2 rounded-full transition-colors hover:bg-grey-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronDownIcon
            onClick={toggleExpanded}
            className="cursor-pointer"
          />
        </motion.div>
      </div>
      <motion.div
        initial={false}
        animate={{
          maxHeight: isExpanded ? Math.max(contentHeight, 100) : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{
          duration: 0.4,
          ease: [0.04, 0.62, 0.23, 0.98],
          maxHeight: { duration: 0.4 },
          opacity: {
            duration: 0.25,
            delay: isExpanded ? 0.1 : 0,
            ease: "easeInOut",
          },
        }}
        style={{
          overflow: "hidden",
          willChange: "max-height, opacity",
        }}
      >
        <div ref={contentRef} className="pb-2">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
