import api from "@/api";
import { cn } from "@/lib/utils";
import { Reaction, ReactionType } from "@/models/Diary";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HTMLAttributes, useEffect, useState } from "react";
import { BsChatFill } from "react-icons/bs";
import ReactionAddPanel from "./reactions/ReactionAddPanel";
import { ReactionIcon } from "./reactions/ReactionIcon";

interface BottomBarProps extends HTMLAttributes<HTMLDivElement> {
  onCommentClick?: () => void;
  diaryBookId: number;
  diaryId: number;
  commentCount?: number;
}

interface GroupedReaction {
  reactionType: ReactionType;
  count: number;
}

const BottomBar: React.FC<BottomBarProps> = ({
  onCommentClick,
  diaryBookId,
  diaryId,
  commentCount = 0,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [currentTouchPosition, setCurrentTouchPosition] = useState({
    x: 0,
    y: 0,
  });
  const [touchStartPosition, setTouchStartPosition] = useState({
    x: 0,
    y: 0,
  });
  const [hoveringReaction, setHoveringReaction] = useState<ReactionType | null>(
    null
  );
  const [userReaction, setUserReaction] = useState<Reaction | null>(null);
  const queryClient = useQueryClient();

  // 리액션 데이터 조회
  const { data: reactions = [], isFetching } = useQuery({
    queryKey: ["fetchReactions", diaryBookId, diaryId],
    queryFn: () => api.reaction.fetchReactions(diaryBookId, diaryId),
  });

  // 현재 사용자의 리액션을 찾아서 설정
  useEffect(() => {
    // 실제로는 현재 로그인한 사용자 ID와 비교해야 함
    // 여기서는 임시로 첫 번째 리액션을 사용자 리액션으로 가정
    if (reactions.length > 0) {
      // 실제 구현 시에는 아래 주석된 코드를 사용 (로그인 사용자 정보 필요)
      // const foundUserReaction = reactions.find(reaction => reaction.createdBy.id === currentUser.id);
      const foundUserReaction = reactions[0]; // 임시 구현
      setUserReaction(foundUserReaction || null);
    } else {
      setUserReaction(null);
    }
  }, [reactions]);

  // 리액션 추가 뮤테이션
  const addReactionMutation = useMutation({
    mutationFn: (reactionType: ReactionType) =>
      api.reaction.addReaction(diaryBookId, diaryId, reactionType),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchReactions", diaryBookId, diaryId],
      });
    },
  });

  // 리액션 삭제 뮤테이션
  const deleteReactionMutation = useMutation({
    mutationFn: () => api.reaction.deleteReaction(diaryBookId, diaryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchReactions", diaryBookId, diaryId],
      });
    },
  });

  // 리액션 업데이트 뮤테이션
  const updateReactionMutation = useMutation({
    mutationFn: (reactionType: ReactionType) =>
      api.reaction.updateReaction(diaryBookId, diaryId, reactionType),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchReactions", diaryBookId, diaryId],
      });
    },
  });

  // 리액션 처리 함수
  const handleReactionSelect = (reactionType: ReactionType) => {
    if (!userReaction) {
      // 사용자 리액션이 없으면 새로 추가
      addReactionMutation.mutate(reactionType);
    } else if (userReaction.reactionType === reactionType) {
      // 같은 리액션을 선택하면 삭제
      deleteReactionMutation.mutate();
    } else {
      // 다른 리액션을 선택하면 업데이트
      updateReactionMutation.mutate(reactionType);
    }
    setOpen(false);
  };

  // 리액션 타입별 그룹화
  const groupedReactions = reactions.reduce<GroupedReaction[]>(
    (acc, reaction) => {
      const existingGroup = acc.find(
        (group) => group.reactionType === reaction.reactionType
      );

      if (existingGroup) {
        existingGroup.count += 1;
      } else {
        acc.push({
          reactionType: reaction.reactionType,
          count: 1,
        });
      }

      return acc;
    },
    []
  );

  const handleCalcBarPosition = () => {
    const deltaX = currentTouchPosition.x - touchStartPosition.x;
    const deltaY = currentTouchPosition.y - touchStartPosition.y;
    const barPosition = {
      x: deltaX / 20,
      y: deltaY / 20,
    };
    return barPosition;
  };

  return (
    <div
      {...props}
      className={cn("relative", props.className)}
      style={{
        transform: open
          ? `translate(${handleCalcBarPosition().x}px, ${handleCalcBarPosition().y}px)`
          : "translate(0px, 0px)",
      }}
    >
      <ReactionAddPanel
        open={open}
        currentTouchPosition={currentTouchPosition}
        onHoveringReactionChange={(reaction) => {
          setHoveringReaction(reaction);
        }}
        selectedReaction={userReaction?.reactionType || null}
      />
      <div
        className={cn(
          "h-14 flex items-center px-3 gap-4 font-light border m-4 rounded-xl shadow-lg relative touch-none transition-all",
          {
            "scale-95": open,
          }
        )}
      >
        <div
          className={"flex gap-2 flex-1 select-none h-full items-center"}
          onTouchStart={(e) => {
            setCurrentTouchPosition({
              x: e.touches[0].clientX,
              y: e.touches[0].clientY,
            });
            setTouchStartPosition({
              x: e.touches[0].clientX,
              y: e.touches[0].clientY,
            });
            setOpen(true);
          }}
          onTouchMove={(e) => {
            setCurrentTouchPosition({
              x: e.touches[0].clientX,
              y: e.touches[0].clientY,
            });
          }}
          onTouchEnd={() => {
            if (hoveringReaction) {
              handleReactionSelect(hoveringReaction);
            }
            setOpen(false);
            setHoveringReaction(null);
          }}
        >
          {isFetching || updateReactionMutation.isPending ? (
            <div
              className={
                "flex flex-1 items-center justify-center gap-2 animate-pulse"
              }
            >
              <div className={"w-6 h-6 bg-gray-200 rounded-full"}></div>
              <div className={"w-6 h-6 bg-gray-200 rounded-full"}></div>
            </div>
          ) : groupedReactions.length > 0 ? (
            groupedReactions.map((reaction, index) => {
              return (
                <div
                  key={index}
                  className={`flex flex-1 items-center justify-center gap-2 px-2 py-1 rounded-full`}
                >
                  <ReactionIcon
                    count={reaction.count}
                    className={"text-2xl"}
                    reactionType={reaction.reactionType}
                  />
                </div>
              );
            })
          ) : (
            <div className={"text-sm text-gray-400"}>
              첫 리액션을 남겨보세요
            </div>
          )}
        </div>
        <div className={"h-fit justify-end flex"}>
          <div className={"h-6 bg-gray-500 w-px"} />
        </div>
        <div
          className={"flex items-center gap-2 text-gray-700"}
          onClick={onCommentClick}
        >
          <BsChatFill className={""} />
          <div>{commentCount}</div>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
