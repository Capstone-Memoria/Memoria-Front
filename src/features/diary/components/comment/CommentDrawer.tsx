import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { CommentTree } from "@/models/Comment";
import React, { useMemo } from "react";
import { BsPersonFill } from "react-icons/bs";
import { MdArrowUpward } from "react-icons/md";
import CommentItem from "./CommentItem";

interface CommentDrawerProps {
  open: boolean;
  onClose: () => void;
  comments: CommentTree[];
}

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

  return (
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
        <div className={"px-4 pb-4 flex items-center"}>
          <div
            className={
              "size-8 bg-gray-200 rounded-full flex items-center justify-center"
            }
          >
            <BsPersonFill />
          </div>
          <input
            type={"text"}
            placeholder={"댓글을 입력해주세요."}
            className={"focus:outline-none ml-4 flex-1"}
          />
          <div
            className={
              "bg-green-500 px-5 py-2 rounded-full text-white text-base"
            }
          >
            <MdArrowUpward />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CommentDrawer;
