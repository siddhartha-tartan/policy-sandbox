import { Flex, Spinner } from "@chakra-ui/react";
import { useEffect } from "react";
import { BsSendFill } from "react-icons/bs";
import { PiQuestionLight } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import useGetUserType from "../../../../hooks/useGetUserType";
import { BASE_ROUTES } from "../../../../utils/constants/constants";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../DesignSystem/CustomButton";
import CustomTextarea from "../../CustomTextarea";
import useReply from "../hooks/useReply";

export default function ReplyBar({
  val,
  setVal,
  showFaqCta = false,
  discussionId = "",
}: {
  val: string;
  setVal: (e: string) => void;
  showFaqCta?: boolean;
  discussionId?: string;
}) {
  useEffect(() => {
    const textarea = document.getElementById(
      "autoResizeTextarea"
    ) as HTMLTextAreaElement;

    if (textarea) {
      const handleInput = () => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      };

      textarea.addEventListener("input", handleInput);

      return () => {
        textarea.removeEventListener("input", handleInput);
      };
    }
  }, []);
  const userType = useGetUserType();
  const { mutate, isLoading } = useReply();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  return (
    <Flex w={"full"} gap={"24px"} alignItems={"center"}>
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        w={"full"}
        h={"full"}
        flexGrow={1}
        borderWidth={"1px"}
        py={"12px"}
        gap={"24px"}
        borderRadius={"16px"}
        px={"24px"}
        borderColor={systemColors.grey[100]}
      >
        <CustomTextarea
          placeholder="Write Answer here..."
          p={0}
          m={0}
          id="autoResizeTextarea"
          minH={"auto"}
          resize={"none"}
          value={val}
          onChange={(e) => {
            const value = e.target.value.trimStart();
            setVal(value);
          }}
          fontSize={"14px"}
          color={systemColors.black.absolute}
          border={"none"}
          _focusVisible={{ border: "none", outline: "none" }}
        />
        <Flex
          minW={"40px"}
          minH={"40px"}
          maxW={"40px"}
          maxH={"40px"}
          borderRadius={"999px"}
          justifyContent={"center"}
          alignItems={"center"}
          bgColor={"#27A376"}
          cursor={val ? "pointer" : "not-allowed"}
          filter={!val ? "brightness(0.8)" : "auto"}
          _hover={{
            filter: "brightness(1.1)",
            transition: "all 0.1s ease-in-out",
          }}
          onClick={() => {
            if (!isLoading && val) {
              mutate(
                { id: discussionId, content: val.trim() },
                {
                  onSuccess() {
                    setVal("");
                  },
                }
              );
            }
          }}
        >
          {isLoading ? (
            <Spinner fontSize={"18px"} color={systemColors.white.absolute} />
          ) : (
            <BsSendFill fontSize={"18px"} color={systemColors.white.absolute} />
          )}
        </Flex>
      </Flex>
      {showFaqCta && (
        <CustomButton
          gap={2}
          h={"76px"}
          onClick={() => {
            navigate(`${BASE_ROUTES[userType]}/faq?loan_category_id=${id}`);
          }}
          px={"24px"}
          rightIcon={<PiQuestionLight size={24} />}
        >
          View FAQs
        </CustomButton>
      )}
    </Flex>
  );
}
