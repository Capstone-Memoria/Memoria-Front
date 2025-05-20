import api from "@/api";
import CommentLoadingIndicator from "@/components/ui/CommentLoadingIndicator";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { CommentTree } from "@/models/Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BsArrowReturnRight, BsPersonFill } from "react-icons/bs";
import { IoReturnUpForwardOutline } from "react-icons/io5";
import { MdArrowUpward, MdClose } from "react-icons/md";
import LetterFromAI from "../ai/LetterFromAI";
import CommentItem from "./CommentItem";

interface CommentDrawerProps {
  open: boolean;
  onClose: () => void;
  diaryBookId: number;
  diaryId: number;
}

interface CommentDrawerContextProps {
  selectedComment: CommentTree | undefined;
  setSelectedComment: (comment: CommentTree | undefined) => void;
  diaryBookId: number;
  diaryId: number;
  refetchComments: () => void;
  queryClient: ReturnType<typeof useQueryClient>;
}

export const CommentDrawerContext = createContext<CommentDrawerContextProps>({
  selectedComment: undefined,
  setSelectedComment: () => {},
  diaryBookId: 0,
  diaryId: 0,
  refetchComments: () => {},
  queryClient: {} as ReturnType<typeof useQueryClient>,
});

const CommentDrawer: React.FC<CommentDrawerProps> = ({
  open,
  onClose,
  diaryBookId,
  diaryId,
}) => {
  const {
    data: comments,
    isLoading,
    refetch: refetchComments,
  } = useQuery<CommentTree[]>({
    queryKey: ["fetchComments", diaryBookId, diaryId],
    queryFn: () => api.comment.fetchComments(diaryBookId, diaryId),
    enabled: open,
  });

  const { data: aiComments, isLoading: isLoadingAiComments } = useQuery({
    queryKey: ["fetchAiComments", diaryId],
    queryFn: () => api.aiCharacter.fetchAiComments(Number(diaryId)),
    enabled: open && !!diaryId, // only fetch if drawer is open and diaryId is available
  });

  const queryClient = useQueryClient();

  const allCommentsLength = useMemo(() => {
    if (!comments) return 0;
    const stack: CommentTree[] = [...comments];
    let count = 0;
    while (stack.length > 0) {
      const comment = stack.pop();
      count++;
      if (comment?.children) {
        stack.push(...comment.children);
      }
    }

    return count;
  }, [comments]);

  const [selectedComment, setSelectedComment] = useState<
    CommentTree | undefined
  >(undefined);

  const [commentInput, setCommentInput] = useState("");
  const canSubmit = useMemo(() => {
    return commentInput.trim().length > 0;
  }, [commentInput]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      if (commentInput.split("\n").length <= 1) {
        textareaRef.current.style.height = "24px";
      } else {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height =
          textareaRef.current.scrollHeight + "px";
      }
    }
  }, [commentInput]);

  const [viewportHeight, setViewportHeight] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.visualViewport?.height);
    };

    if (window.visualViewport) {
      updateViewportHeight();
      window.visualViewport.addEventListener("resize", updateViewportHeight);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          updateViewportHeight
        );
      }
    };
  }, []);

  const drawerContentHeight = useMemo(() => {
    if (viewportHeight === undefined) return "97%";
    const windowHeight = window.innerHeight;
    const availableHeight = viewportHeight;
    const offset = windowHeight - availableHeight;
    return `calc(97% - ${offset}px)`;
  }, [viewportHeight]);

  const createCommentMutation = useMutation({
    mutationFn: (content: string) =>
      selectedComment
        ? api.comment.createReply(diaryBookId, diaryId, selectedComment.id, {
            content,
          })
        : api.comment.createComment(diaryBookId, diaryId, { content }),
    onSuccess: () => {
      setCommentInput("");
      setSelectedComment(undefined);
      refetchComments();
      queryClient.invalidateQueries({
        queryKey: ["fetchCommentsCount", diaryBookId, diaryId],
      });
    },
    onError: (error) => {
      console.error("댓글/대댓글 생성 실패", error);
      alert("댓글/대댓글 생성에 실패했습니다.");
    },
  });

  const handleSubmitComment = () => {
    if (canSubmit && !createCommentMutation.isPending) {
      createCommentMutation.mutate(commentInput);
    }
  };

  return (
    <CommentDrawerContext.Provider
      value={{
        selectedComment,
        setSelectedComment,
        diaryBookId,
        diaryId,
        refetchComments,
        queryClient,
      }}
    >
      <Drawer open={open} onOpenChange={onClose} repositionInputs={false}>
        <DrawerContent
          className={"min-h-[97%] flex flex-col"}
          style={{ maxHeight: drawerContentHeight }}
        >
          <div className={"px-4 pt-6 flex-1 flex flex-col"}>
            <div className={"text-center text-sm text-gray-500 mb-4"}>
              {isLoading ? (
                <div className={"h-4 w-20 bg-gray-200 animate-pulse mx-auto"} />
              ) : (
                `${allCommentsLength}개의 댓글`
              )}
            </div>
            <div
              className={"flex flex-col gap-2 flex-[1_1_0] overflow-y-auto"}
              data-vaul-no-drag
            >
              {isLoading || isLoadingAiComments ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className={"mb-4 p-4 bg-gray-100 rounded-lg animate-pulse"}
                  >
                    <div className={"flex items-center gap-3 mb-2"}>
                      <div className={"size-6 bg-gray-300 rounded-full"} />

                      <div className={"h-4 w-24 bg-gray-300 rounded"} />
                      <div className={"flex-1"} />
                      <div className={"h-3 w-16 bg-gray-300 rounded"} />
                    </div>
                    <div className={"h-4 bg-gray-300 rounded w-5/6"} />
                  </div>
                ))
              ) : (
                <LayoutGroup>
                  {aiComments?.map((comment) => (
                    <LetterFromAI aiComment={comment} />
                  ))}
                  <motion.div layout className={"flex flex-col gap-2 mt-2"}>
                    {comments && comments.length > 0
                      ? comments.map((comment) => (
                          <CommentItem key={comment.id} comment={comment} />
                        ))
                      : (!aiComments || aiComments.length === 0) && (
                          <div className={"text-center text-gray-500"}>
                            아직 댓글이 없습니다.
                          </div>
                        )}
                  </motion.div>
                </LayoutGroup>
              )}
            </div>
          </div>
          <AnimatePresence>
            {selectedComment && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  duration: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={
                  "px-4 py-2 grid grid-cols-[auto_1fr_auto] items-center gap-4 bg-gray-100"
                }
              >
                <BsArrowReturnRight />
                <div className={"text-sm text-gray-500 min-w-0"}>
                  <span className={"font-medium"}>
                    {selectedComment.createdBy?.nickName}
                  </span>
                  님에게 답글 남기는 중...
                  <div className={"mt-1"}>
                    <div className={"text-gray-700 text-sm truncate w-full"}>
                      {selectedComment.content}
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedComment(undefined)}>
                  <MdClose className={"text-gray-500"} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <div className={"px-4 py-4 flex items-center"}>
            <div
              className={
                "size-8 bg-gray-200 rounded-full flex items-center justify-center"
              }
            >
              <BsPersonFill />
            </div>
            <textarea
              ref={textareaRef}
              placeholder={
                selectedComment
                  ? "답글을 입력해주세요."
                  : "댓글을 입력해주세요."
              }
              className={"focus:outline-none ml-4 flex-1 h-6"}
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button
              className={cn(
                "bg-gray-300 h-8 w-16 rounded-full text-white text-base relative transition-colors flex items-center justify-center overflow-hidden",
                {
                  "bg-green-500 text-white":
                    canSubmit && !createCommentMutation.isPending,
                  "bg-gray-300 text-gray-500":
                    !canSubmit || createCommentMutation.isPending,
                }
              )}
              onClick={handleSubmitComment}
              disabled={!canSubmit || createCommentMutation.isPending}
            >
              <div
                className={cn(
                  "rounded-full absolute aspect-square transition-all",
                  {
                    "w-0": !canSubmit || createCommentMutation.isPending,
                    "w-full": canSubmit && !createCommentMutation.isPending,
                  }
                )}
              />
              {createCommentMutation.isPending ? (
                <CommentLoadingIndicator />
              ) : selectedComment ? (
                <IoReturnUpForwardOutline className={"z-10 text-xl"} />
              ) : (
                <MdArrowUpward className={"z-10 text-xl"} />
              )}
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </CommentDrawerContext.Provider>
  );
};

export default CommentDrawer;
