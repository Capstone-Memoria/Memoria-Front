import api from "@/api";
import { CommentTree } from "@/models/Comment";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { BsPersonFill } from "react-icons/bs";
import { CommentDrawerContext } from "./CommentDrawer";

interface CommentItemProps {
  comment: CommentTree;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const {
    selectedComment,
    setSelectedComment,
    diaryBookId,
    diaryId,
    refetchComments,
  } = useContext(CommentDrawerContext);

  // 댓글 삭제 mutation
  const deleteCommentMutation = useMutation({
    mutationFn: () =>
      api.comment.deleteComment(diaryBookId, diaryId, comment.id),
    onSuccess: () => {
      refetchComments(); // 댓글 목록 새로고침
    },
    onError: (error) => {
      console.error("댓글 삭제 실패", error);
      alert("댓글 삭제에 실패했습니다.");
    },
  });

  const handleClick = () => {
    if (selectedComment?.id === comment.id) {
      setSelectedComment(undefined);
    } else {
      setSelectedComment(comment);
    }
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // 이벤트 버블링 중지
    if (confirm("이 댓글을 삭제하시겠습니까?")) {
      deleteCommentMutation.mutate();
    }
  };

  return (
    <>
      <div
        className={
          "px-4 py-3 bg-gray-100 rounded-lg active:scale-95 transition-all"
        }
        onClick={handleClick}
      >
        <div className={"flex items-center gap-3"}>
          <div
            className={
              "size-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600"
            }
          >
            <BsPersonFill />
          </div>
          <div>{comment.createdBy?.nickName}</div>
          <div className={"flex-1"} />
          <div className={"text-sm text-gray-500"}>
            {comment.createdAt?.toRelative()}
          </div>
        </div>
        <div className={"mt-3"}>{comment.content}</div>
      </div>
      {!comment.deleted && comment.children && comment.children.length > 0 && (
        <div className={"pl-5 flex flex-col gap-2"}>
          {comment.children.map((child) => (
            <CommentItem key={child.id} comment={child} />
          ))}
        </div>
      )}
    </>
  );
};

export default CommentItem;
