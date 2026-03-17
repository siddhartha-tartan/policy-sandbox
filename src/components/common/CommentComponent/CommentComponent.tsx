import { Button, Divider, Flex, Image, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CommentSVG from "../../../assets/Icons/comment.svg";
import { formatUserType } from "../../../utils/helpers/formatUserType";
import { customColors } from "../../DesignSystem/Colors/CustomColors";
import { systemColors } from "../../DesignSystem/Colors/SystemColors";
import CustomText from "../../DesignSystem/Typography/CustomText";
import { getTimeAndMonth } from "../../Polycraft/uitls/helper";
import useAddComment from "../MakerChecker/pages/Comments/hooks/useAddComment";
import useGetComments, {
  IComment,
} from "../MakerChecker/pages/Comments/hooks/useGetComments";

interface CommentInputProps {
  value: string;
  onChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const CommentInput = ({
  value,
  onChange,
  onCancel,
  onSubmit,
  isLoading,
}: CommentInputProps) => (
  <div className="px-6 pb-6">
    <div className="bg-[#F8F8F8] rounded-lg p-6">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your comment here..."
        variant="unstyled"
        className="mb-4 placeholder:text-[#424242] placeholder:opacity-100 placeholder:text-sm placeholder:font-normal"
        _placeholder={{ color: "#424242", opacity: 1 }}
      />
      <div className="flex justify-end gap-3 mt-4">
        <Button
          variant="ghost"
          onClick={onCancel}
          fontSize="14px"
          fontWeight="500"
        >
          Cancel
        </Button>
        <Button
          variant="solid"
          onClick={onSubmit}
          isDisabled={!value.trim()}
          fontSize="14px"
          fontWeight="500"
          isLoading={isLoading}
        >
          Submit
        </Button>
      </div>
    </div>
  </div>
);

const EmptyCommentState = ({ onAddComment }: { onAddComment: () => void }) => (
  <div className="flex flex-col gap-4 max-h-[450px] min-h-[350px] justify-center items-center overflow-scroll">
    <div className="flex flex-col gap-2 justify-center items-center">
      <Image className="w-8 h-8" src={CommentSVG} />
      <div>Be the first to comment</div>
    </div>
    <button
      onClick={onAddComment}
      className="font-medium text-sm text-[#3762DD] hover:text-[#1a50e3] hover:font-semibold"
    >
      Add Comment
    </button>
  </div>
);

const CommentHeader = ({
  showAddCta,
  onAddComment,
}: {
  showAddCta: boolean;
  onAddComment: () => void;
}) => (
  <Flex className="flex justify-between w-full items-center gap-[60px] p-6">
    <CustomText stylearr={[18, 24, 700]} color={systemColors.black.absolute}>
      Comments
    </CustomText>
    {showAddCta && (
      <div className="flex gap-2 w-fit cursor-pointer" onClick={onAddComment}>
        <Image src={CommentSVG} />
        <div className="font-medium text-sm text-[#3762DD] hover:text-[#1a50e3] hover:font-semibold">
          Add Comment
        </div>
      </div>
    )}
  </Flex>
);

const CommentedSection = ({ comment }: { comment: IComment }) => (
  <>
    <div className="py-5 px-6 flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex gap-3 items-center">
          <div className="w-9 h-9 bg-[#eaedfe] p-1 rounded-full justify-center items-center flex">
            <div className="text-[#304FFE] font-medium text-base">
              {comment?.user_details?.name
                ?.split(" ")
                .map((n) => n[0].toUpperCase())
                .join("")}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-sm font-bold text-[#424242]">
              {comment?.user_details?.name}
            </div>
            <div className="flex gap-6 list-disc text-[#ABAAAD] text-xs font-normal">
              {formatUserType(comment?.user_details?.role)}
              {comment?.level && (
                <ul className="flex gap-6 list-disc text-[#ABAAAD] text-xs font-normal">
                  <li>{"Level " + comment?.level}</li>
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="text-xs font-normal text-[#ABAAAD]">
          {getTimeAndMonth(comment?.created_at)}
        </div>
      </div>
      <div className="text-sm font-medium text-[#424242]">
        {comment?.comment}
      </div>
    </div>
    <Divider />
  </>
);

const CommentContainer = ({ children }: { children: React.ReactNode }) => (
  <Flex
    borderRadius="16px"
    flexDir="column"
    borderWidth="1px"
    overflowY={"auto"}
    className="h-fit min-w-[371px] max-h-full overflow-y-auto"
    borderColor={customColors.SOFT_PEACH}
  >
    {children}
  </Flex>
);

export const CommentComponent = ({ requestId }: { requestId: string }) => {
  const [id, setId] = useState<string>("");
  const { data: commentsList, isLoading } = useGetComments(id);
  const { mutate: addComment, isLoading: isAddLoading } = useAddComment();
  const [comments, setComments] = useState<IComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);

  useEffect(() => {
    if (requestId) {
      setId(requestId);
    }
  }, [requestId]);

  useEffect(() => {
    if (commentsList?.length) {
      setComments(commentsList);
    }
  }, [commentsList]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addComment(
      { request_id: id, comment: newComment },
      {
        onSuccess() {
          setNewComment("");
          setShowCommentInput(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setShowCommentInput(false);
    setNewComment("");
  };

  if (!requestId || isLoading) return null;

  return (
    <CommentContainer>
      <CommentHeader
        showAddCta={!(comments?.length === 0) && !showCommentInput}
        onAddComment={() => setShowCommentInput(true)}
      />

      {showCommentInput && (
        <CommentInput
          value={newComment}
          onChange={setNewComment}
          onCancel={handleCancel}
          onSubmit={handleAddComment}
          isLoading={isAddLoading}
        />
      )}

      <Divider />

      {!commentsList?.length ? (
        <EmptyCommentState onAddComment={() => setShowCommentInput(true)} />
      ) : (
        <div className="flex flex-col max-h-[450px] overflow-scroll">
          {comments?.map((comment: IComment) => (
            <CommentedSection key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </CommentContainer>
  );
};
