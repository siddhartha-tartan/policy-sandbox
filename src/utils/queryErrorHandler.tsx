import {
  CloseButton,
  createStandaloneToast,
  Flex,
  Image,
  Text,
  theme,
} from "@chakra-ui/react";
import WarningImage from "../assets/Images/WarningImage.png";
import { systemColors } from "../components/DesignSystem/Colors/SystemColors";
type Error = { message: string };
const toast = createStandaloneToast({ theme }).toast;

export function queryErrorHandler(err: Error | unknown) {
  const toastId = new Date().getTime().toString();

  let title: string = "";

  if (err instanceof Error) {
    //@ts-ignore
    title = err?.response?.data?.message || err.message;
  } else if (typeof err === "string") {
    title = err;
  } else {
    title = "Error connecting to server";
  }

  toast.closeAll();
  toast({
    id: toastId,
    position: "top-right",
    duration: 5000,
    render: () => (
      <Flex
        p={"16px"}
        borderRadius={"12px"}
        bg={systemColors.white.absolute}
        boxShadow={
          "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)"
        }
        flexDir={"row"}
        right={5}
        top={5}
        pos={"absolute"}
        gridGap={"20px"}
        alignItems={"center"}
        zIndex={10000}
        w={"-webkit-fit-content"}
      >
        <Image
          w={"40px"}
          h={"40px"}
          src={WarningImage} // Change to an appropriate image if needed
        />
        <Flex direction={"column"} justifyContent="center">
          <Text
            color={systemColors.grey[900]}
            fontSize={"14px"}
            fontWeight={"600"}
            lineHeight={"24px"}
          >
            {title}
          </Text>
        </Flex>
        <CloseButton onClick={() => toast.close(toastId)} />
      </Flex>
    ),
  });
}
