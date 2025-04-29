import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { CommentTree } from "@/models/Comment";
import { AnimatePresence, motion } from "motion/react";
import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BsArrowReturnRight, BsPersonFill } from "react-icons/bs";
import { MdArrowUpward, MdClose } from "react-icons/md";
import CommentItem from "./CommentItem";

interface CommentDrawerProps {
  open: boolean;
  onClose: () => void;
  comments: CommentTree[];
}

interface CommentDrawerContextProps {
  selectedComment: CommentTree | undefined;
  setSelectedComment: (comment: CommentTree | undefined) => void;
}

export const CommentDrawerContext = createContext<CommentDrawerContextProps>({
  selectedComment: undefined,
  setSelectedComment: () => {},
});

const CommentDrawer: React.FC<CommentDrawerProps> = ({
  open,
  onClose,
  comments,
}) => {
  const allCommentsLength = useMemo(() => {
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
      //내용이 한줄이면 height 스타일 제거
      if (commentInput.split("\n").length === 1) {
        textareaRef.current.style.height = "24px";
      } else {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height =
          textareaRef.current.scrollHeight + "px";
      }
    }
  }, [commentInput]);

  return (
    <CommentDrawerContext.Provider
      value={{ selectedComment, setSelectedComment }}
    >
      <Drawer open={open} onOpenChange={onClose}>
        <DrawerContent className={"min-h-[97%] flex flex-col "}>
          <div className={"px-4 pt-6"}>
            <div className={"text-center text-sm text-gray-500 mb-4"}>
              {allCommentsLength}개의 댓글
            </div>
            <div>
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          </div>
          <div className={"flex-1"} />
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
            <div
              className={cn(
                "bg-gray-300 h-8 w-16 rounded-full text-white text-base relative transition-colors flex items-center justify-center overflow-hidden",
                {
                  "text-white": canSubmit,
                  "text-gray-500": !canSubmit,
                }
              )}
            >
              <div
                className={cn(
                  "bg-green-500 rounded-full absolute aspect-square transition-all",
                  {
                    "w-0": !canSubmit,
                    "w-full": canSubmit,
                  }
                )}
              />
              <MdArrowUpward className={"z-10"} />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </CommentDrawerContext.Provider>
  );
};

export default CommentDrawer;
