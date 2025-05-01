import api from "@/api";
import { CommentTree } from "@/models/Comment";
import { useAuthStore } from "@/stores/AuthenticationStore";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useContext, useEffect, useRef, useState } from "react";
import { BsPersonFill } from "react-icons/bs";
import { MdDeleteSweep } from "react-icons/md";
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
    queryClient,
  } = useContext(CommentDrawerContext);

  // 인증 상태 가져오기
  const authStore = useAuthStore();

  // 현재 사용자의 이메일
  const currentUserEmail = authStore.context?.user?.email;

  // 이 댓글이 현재 사용자의 댓글인지 확인
  const isOwnComment = comment.createdBy?.email === currentUserEmail;

  // 상태 관리
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // ref 관리
  const isDeleteApiCompletedRef = useRef(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 댓글 삭제 mutation
  const deleteCommentMutation = useMutation({
    mutationFn: () =>
      api.comment.deleteComment(diaryBookId, diaryId, comment.id),
    onSuccess: () => {
      isDeleteApiCompletedRef.current = true;

      if (!isAnimating) {
        refetchComments();
      }
      queryClient.invalidateQueries({
        queryKey: ["fetchCommentsCount", diaryBookId, diaryId],
      });
    },
    onError: (error) => {
      console.error("댓글 삭제 실패", error);
      alert("댓글 삭제에 실패했습니다.");
      setIsAnimating(false);
      setIsDeleting(false);
    },
  });

  // 댓글 선택 처리
  const handleClick = () => {
    if (selectedComment?.id === comment.id) {
      setSelectedComment(undefined);
    } else {
      setSelectedComment(comment);
    }
  };

  // 터치 이벤트 핸들러 - 본인 댓글인 경우에만 처리
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isOwnComment) return;
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping || !isOwnComment) return;
    const currentX = e.touches[0].clientX;
    const distance = currentX - startX;
    setSwipeDistance(distance < 0 ? Math.abs(distance) : 0);
  };

  const handleTouchEnd = () => {
    if (!isOwnComment) return;
    setIsSwiping(false);
    const shouldDelete = swipeDistance > 60;
    setSwipeDistance(0);

    if (shouldDelete) {
      // 삭제 애니메이션 시작
      setIsDeleting(true);
      setIsAnimating(true);
      isDeleteApiCompletedRef.current = false;

      // 애니메이션 타이머 설정
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);

        if (isDeleteApiCompletedRef.current) {
          refetchComments();
        }
      }, 600);

      // 삭제 API 호출
      deleteCommentMutation.mutate();
    }
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        className={"gap-2 relative"}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={
            "flex-1 px-4 py-3 bg-gray-100 rounded-lg active:scale-95 transition-all"
          }
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
          {comment.deleted ? (
            <div className={"mt-3 text-gray-500"}>삭제된 댓글입니다</div>
          ) : (
            <div className={"mt-3"}>{comment.content}</div>
          )}
        </div>
        {isOwnComment && !comment.deleted && (
          <div
            className={
              "absolute right-0 top-0 min-w-2 h-full bg-red-400 rounded-md flex items-center justify-center text-white"
            }
            style={{
              width: !isDeleting ? `${Math.abs(swipeDistance)}px` : "100%",
              transition: isSwiping
                ? "none"
                : "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <AnimatePresence>
              {(swipeDistance > 60 || isDeleting) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <MdDeleteSweep className={"text-2xl"} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
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
