import { FlexProps } from "@chakra-ui/layout";
import { Box, Flex } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import BreadCrumbs, { BREAD_CRUMB_PROPS } from "./BreadCrumbs";

interface IProps extends FlexProps {
  children: React.ReactNode;
  breadCrumbsData?: BREAD_CRUMB_PROPS[];
}

export default function PageLayout({
  children,
  breadCrumbsData = [],
  ...props
}: IProps) {
  return (
    <AnimatePresence mode="wait">
      <Flex
        gap={4}
        h="full"
        w="full"
        overflowY={"auto"}
        flexDir={"column"}
        pt={"16px"}
        {...props}
      >
        <BreadCrumbs data={breadCrumbsData} px={"16px"} />
        <Box flexGrow={1} className="h-full" overflowY={"auto"} px={"24px"}>
          {children}
        </Box>
      </Flex>
    </AnimatePresence>
  );
}
