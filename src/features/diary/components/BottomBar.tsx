import api from "@/api";
import { cn } from "@/lib/utils";
import { Reaction, ReactionType } from "@/models/Diary";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HTMLAttributes, useEffect, useState } from "react";
import { BsChatFill } from "react-icons/bs";
import { RiMailFill } from "react-icons/ri"; // Changed to Mail icon
import ReactionAddPanel from "./reactions/ReactionAddPanel";
import { ReactionIcon } from "./reactions/ReactionIcon";

interface BottomBarProps extends HTMLAttributes<HTMLDivElement> {
  onCommentClick?: () => void;
  diaryBookId: number;
  diaryId: number;
}

interface GroupedReaction {
  reactionType: ReactionType;
  count: number;
}

const BottomBar: React.FC<BottomBarProps> = ({
  onCommentClick,
  diaryBookId,
  diaryId,
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

  const { data: reactions = [], isFetching } = useQuery({
    queryKey: ["fetchReactions", diaryBookId, diaryId],
    queryFn: () => api.reaction.fetchReactions(diaryBookId, diaryId),
  });

  const { data: commentCount = 0, isFetching: isFetchingComments } = useQuery({
    queryKey: ["fetchCommentsCount", diaryBookId, diaryId],
    queryFn: () => api.comment.fetchCommentsCount(diaryBookId, diaryId),
  });

  const { data: aiComments, isLoading: isLoadingAiComments } = useQuery({
    queryKey: ["fetchAiComments", diaryId],
    queryFn: () => api.aiCharacter.fetchAiComments(Number(diaryId)),
    enabled: !!diaryId,
  });

  useEffect(() => {
    if (reactions.length > 0) {
      const foundUserReaction = reactions[0];
      setUserReaction(foundUserReaction || null);
    } else {
      setUserReaction(null);
    }
  }, [reactions]);

  const handleReactionMutation = useMutation({
    mutationFn: (reactionType: ReactionType | undefined) =>
      api.reaction.handleReaction(diaryBookId, diaryId, reactionType),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchReactions", diaryBookId, diaryId],
      });
    },
  });

  const handleReactionSelect = (reactionType: ReactionType) => {
    if (userReaction?.reactionType === reactionType) {
      handleReactionMutation.mutate(undefined);
    } else {
      handleReactionMutation.mutate(reactionType);
    }
    setOpen(false);
  };

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
    // 터치 시작 위치와 현재 위치의 차이를 계산
    const deltaX = currentTouchPosition.x - touchStartPosition.x;
    const deltaY = currentTouchPosition.y - touchStartPosition.y;
    // 차이를 20으로 나누어 바의 위치를 계산
    const barPosition = {
      x: deltaX / 20,
      y: deltaY / 20,
    };
    return barPosition;
  };

  return (
    <div
      {...props}
      className={cn(
        "fixed bottom-0 left-1/2 -translate-x-1/2 w-full",
        props.className
      )}
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
          "h-14 flex items-center px-3 gap-4 font-light border m-4 rounded-xl shadow-lg relative touch-none transition-all bg-white",
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
          {isFetching || handleReactionMutation.isPending ? (
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
          {isLoadingAiComments ? (
            <div
              className={"w-5 h-5 bg-gray-200 rounded-full animate-pulse"}
            ></div>
          ) : (
            aiComments &&
            aiComments.length > 0 && (
              <RiMailFill className={"text-lg"} />
            )
          )}
          <BsChatFill className={""} />
          {isFetchingComments ? (
            <div
              className={"w-4 h-4 bg-gray-200 rounded-full animate-pulse"}
            ></div>
          ) : (
            <div>{commentCount}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
