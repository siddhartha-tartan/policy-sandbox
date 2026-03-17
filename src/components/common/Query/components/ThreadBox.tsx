import { CloseIcon } from "@chakra-ui/icons";
import { FlexProps } from "@chakra-ui/layout";
import { Avatar, Box, Flex, Stack } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useState } from "react";
import { FileAdd } from "react-huge-icons/solid";
import EventBus from "../../../../EventBus";
import useGetUserType from "../../../../hooks/useGetUserType";
import { UserType } from "../../../../utils/constants/constants";
import {
  formatDateString,
  formatTime,
} from "../../../../utils/helpers/formatDate";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomButton from "../../../DesignSystem/CustomButton";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import { IComments, IThread } from "../hooks/useGetThread";
import { discussionAtom, replyAtom } from "../queryAtom";
import { EVENT_OPEN_CREATE_FAQ_MODAL } from "./CreateFaqModal";
import ReplyBar from "./ReplyBar";

const DateTimeComponent = ({ created_at }: { created_at: string | number }) => (
  <Flex className="flex-col items-end justify-end	gap-[2px] grow w-[200px]">
    <CustomText stylearr={[12, 19, 400]} textAlign={"end"}>
      {formatDateString(new Date(created_at))}
    </CustomText>
    <CustomText stylearr={[12, 19, 400]} textAlign={"end"}>
      {formatTime(new Date(created_at))}
    </CustomText>
  </Flex>
);

interface IPropComment extends FlexProps, IComments {}
const Comment = ({
  author,
  type,
  comment,
  created_at,
  ...props
}: IPropComment) => (
  <Flex
    p={"20px"}
    borderWidth={"1px"}
    borderRadius="12px"
    w={"full"}
    flexDir={"row"}
    gap={2}
    justifyContent={"space-between"}
    bg={systemColors.white.absolute}
    {...props}
  >
    <Flex flexDir={"column"}>
      <Stack direction="row" spacing={4}>
        <Avatar
          w={"28px"}
          h={"28px"}
          size="xs"
          bgColor={systemColors.black.absolute}
          color={systemColors.white.absolute}
          name={author}
        />
        <Box>
          <CustomText
            color={systemColors.black[800]}
            stylearr={[18, 24, 700]}
            fontWeight="bold"
          >
            {author}{" "}
            {type && (
              <CustomText
                px={2}
                stylearr={[18, 24, 500]}
                color={systemColors.black[400]}
                as="span"
                fontWeight="normal"
              >
                {" "}
                • {type}
              </CustomText>
            )}
          </CustomText>
        </Box>
      </Stack>
      <CustomText
        color={systemColors.black[800]}
        mt={1}
        stylearr={[18, 26, 500]}
        wordBreak={"break-all"}
      >
        {comment}
      </CustomText>
    </Flex>
    <DateTimeComponent created_at={created_at} />
  </Flex>
);

export default function ThreadBox({ data }: { data: IThread }) {
  const [hide, setHide] = useState<boolean>(false);
  const userType = useGetUserType();
  const hasComments = data?.comments && data?.comments?.length > 0;
  const canReply = [UserType.SPOC, UserType.ADMIN].includes(userType);
  const [reply, setReply] = useAtom(replyAtom);
  const [replyThread, setReplyThread] = useState<string>("");
  const [discussionId, setDiscussionId] = useAtom(discussionAtom);
  const isSpoc = userType === UserType.SPOC;
  return (
    <Flex gap={3} w={"full"} className="">
      <Flex flexDir={"column"} alignItems={"center"}>
        <Avatar
          bgColor={systemColors.black.absolute}
          color={systemColors.white.absolute}
          w={"47px"}
          size="md"
          h={"47px"}
          name={data.author}
        />
        {(hasComments || canReply) && (
          <Flex pt={2} h={"full"} flexDir={"column"} alignItems={"center"}>
            <Flex h={"full"} w={"1px"} bgColor={"#D9D9D9"} />
            <Flex
              minW={"10px"}
              minH={"10px"}
              maxW={"10px"}
              maxH={"10px"}
              bgColor={"#D9D9D9"}
              borderRadius={"999px"}
            />
          </Flex>
        )}
      </Flex>
      <Flex gap={5} flexDir={"column"} w="full" flexWrap={"wrap"}>
        <Flex
          flexDir={"row"}
          gap={2}
          justifyContent={"space-between"}
          pr={"12px"}
        >
          <Box>
            <CustomText
              color={systemColors.black[800]}
              stylearr={[18, 24, 700]}
              fontWeight="bold"
            >
              {data.author}{" "}
              {data.type && (
                <CustomText
                  stylearr={[18, 24, 500]}
                  color={systemColors.black[400]}
                  as="span"
                  fontWeight="normal"
                >
                  {" "}
                  • {data.type}
                </CustomText>
              )}
            </CustomText>
            <CustomText
              color={systemColors.black[800]}
              stylearr={[18, 26, 500]}
              wordBreak={"break-all"}
            >
              {data.question}
            </CustomText>
          </Box>

          {discussionId || !isSpoc ? (
            <DateTimeComponent created_at={data?.created_at} />
          ) : (
            <>
              {hasComments && (
                <Flex
                  onClick={() => {
                    //@ts-ignore
                    if (data?.comments?.length > 1) {
                      setDiscussionId(data);
                    } else {
                      EventBus.getInstance().fireEvent(
                        EVENT_OPEN_CREATE_FAQ_MODAL,
                        {
                          question: data?.question,
                          answer: data?.comments?.[0]?.comment,
                        }
                      );
                    }
                  }}
                  className="gap-2 items-center cursor-pointer"
                >
                  <FileAdd color="#3762DD" />
                  <CustomText stylearr={[16, 24, 700]} color={"#3762DD"}>
                    Create FAQ
                  </CustomText>
                </Flex>
              )}
            </>
          )}
        </Flex>

        {hasComments && (
          <>
            {hide ? (
              <></>
            ) : (
              <Flex gap={"16px"} flexDir={"column"}>
                {discussionId?.id === data?.id && (
                  <Flex
                    style={{ background: "#0074FF26" }}
                    color={"#304FFE"}
                    className="w-full p-5 rounded-[12px] justify-between items-center"
                  >
                    <CustomText stylearr={[18, 26, 600]}>
                      Select a comment to use as the answer
                    </CustomText>
                    <CloseIcon
                      fontSize={"12px"}
                      className="cursor-pointer"
                      onClick={() => setDiscussionId(null)}
                    />
                  </Flex>
                )}
                {data?.comments?.map((comment, index) => (
                  <Comment
                    key={index}
                    {...comment}
                    className={`${
                      discussionId?.id === data?.id
                        ? "hover:bg-[#0074FF26] transition-all cursor-pointer"
                        : ""
                    }`}
                    onClick={() => {
                      if (discussionId?.id === data?.id) {
                        EventBus.getInstance().fireEvent(
                          EVENT_OPEN_CREATE_FAQ_MODAL,
                          { question: data?.question, answer: comment?.comment }
                        );
                      }
                    }}
                  />
                ))}
              </Flex>
            )}
            <Flex gap={3} alignItems={"center"}>
              <CustomText
                className="underline underline-offset-1"
                stylearr={[18, 24, 700]}
                cursor={"pointer"}
                onClick={() => setHide((e) => !e)}
              >
                {!hide ? "Hide" : "View"} Replies
              </CustomText>
              <CustomText stylearr={[18, 24, 400]} color={"#9A9A9A"}>
                {" "}
                • {data?.comments?.length} replies
              </CustomText>
            </Flex>
          </>
        )}
        {canReply && (
          <>
            {reply === data?.id ? (
              <ReplyBar
                val={replyThread}
                setVal={setReplyThread}
                discussionId={data?.id}
              />
            ) : (
              <CustomButton
                onClick={() => setReply(data?.id)}
                w={"fit-content"}
                px={"24px"}
                variant="tertiary"
              >
                Reply in thread
              </CustomButton>
            )}
          </>
        )}
      </Flex>
    </Flex>
  );
}
