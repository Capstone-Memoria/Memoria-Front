import { ReactionType } from "@/models/Diary";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ReactionHoverIcon } from "./ReactionIcon";

interface ReactionAddPanelProps {
  open: boolean;
  currentTouchPosition: { x: number; y: number };
  onHoveringReactionChange: (reaction: ReactionType | null) => void;
  selectedReaction: ReactionType | null;
}

interface ReactionRefProperties {
  distance: number | null;
  isHovering: boolean;
  centerPosition: { x: number; y: number } | null;
}

type CenterPositionType = { x: number; y: number } | null;

const ReactionAddPanel = ({
  open,
  currentTouchPosition,
  onHoveringReactionChange,
  selectedReaction,
}: ReactionAddPanelProps) => {
  // 각 리액션의 DOM 참조
  const likeRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const smileRef = useRef<HTMLDivElement>(null);
  const sadRef = useRef<HTMLDivElement>(null);
  const hugRef = useRef<HTMLDivElement>(null);
  const wowRef = useRef<HTMLDivElement>(null);
  const congratsRef = useRef<HTMLDivElement>(null);
  const laughRef = useRef<HTMLDivElement>(null);

  const reactionRefsMap = {
    [ReactionType.LIKE]: likeRef,
    [ReactionType.HEART]: heartRef,
    [ReactionType.SMILE]: smileRef,
    [ReactionType.SAD]: sadRef,
    [ReactionType.HUG]: hugRef,
    [ReactionType.WOW]: wowRef,
    [ReactionType.CONGRATS]: congratsRef,
    [ReactionType.LAUGH]: laughRef,
  };

  // 각 리액션의 상태를 useRef로 관리 (렌더링에 영향을 주지 않음)
  const reactionPropertiesRef = useRef<
    Record<ReactionType, ReactionRefProperties>
  >(
    Object.keys(ReactionType).reduce(
      (acc, type) => {
        acc[type as ReactionType] = {
          distance: null,
          isHovering: false,
          centerPosition: null,
        };
        return acc;
      },
      {} as Record<ReactionType, ReactionRefProperties>
    )
  );

  // 현재 호버링 중인 리액션
  const [currentHovering, setCurrentHovering] = useState<ReactionType | null>(
    null
  );

  // 화면 갱신을 위한 카운터
  const [renderTrigger, setRenderTrigger] = useState(0);

  // 패널이 닫힐 때 리셋
  useEffect(() => {
    if (!open) {
      onHoveringReactionChange(null);
      setCurrentHovering(null);
    }
  }, [open, onHoveringReactionChange]);

  // 터치 위치 변경에 따른 호버링 상태 업데이트
  useEffect(() => {
    if (!open) return;

    // 중심 위치 계산
    const centerPositions: Partial<Record<ReactionType, CenterPositionType>> =
      {};
    Object.keys(ReactionType).forEach((reaction) => {
      const type = reaction as ReactionType;
      const ref = reactionRefsMap[type].current;

      if (ref) {
        const rect = ref.getBoundingClientRect();
        centerPositions[type] = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }
    });

    // 거리 계산 및 호버링 상태 업데이트
    let currentHoveringReaction: ReactionType | null = null;
    let shortestDistance = Infinity;
    let anyHovering = false;
    let shouldUpdate = false;

    const properties = reactionPropertiesRef.current;

    Object.keys(ReactionType).forEach((reaction) => {
      const type = reaction as ReactionType;
      const centerPosition = centerPositions[type];

      if (centerPosition) {
        // 거리 계산
        const distance = Math.sqrt(
          (currentTouchPosition.x - centerPosition.x) ** 2 +
            (currentTouchPosition.y - centerPosition.y) ** 2
        );

        const ref = reactionRefsMap[type].current;
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const isHovering =
            currentTouchPosition.x >= rect.left &&
            currentTouchPosition.x <= rect.right &&
            currentTouchPosition.y >= rect.top &&
            currentTouchPosition.y <= rect.bottom;

          // 가장 가까운 아이콘 찾기
          if (distance < shortestDistance) {
            shortestDistance = distance;
            currentHoveringReaction = type;
          }

          // 상태가 변경되었는지 확인
          const oldProps = properties[type];
          if (
            oldProps.isHovering !== isHovering ||
            oldProps.distance !== distance ||
            oldProps.centerPosition !== centerPosition
          ) {
            // 상태 업데이트
            properties[type] = {
              distance,
              isHovering,
              centerPosition,
            };
            shouldUpdate = true;
          }

          if (isHovering) anyHovering = true;
        }
      }
    });

    // 호버링 상태 업데이트 및 콜백 호출
    if (anyHovering) {
      for (const [type, props] of Object.entries(properties)) {
        if (props.isHovering) {
          const reactionType = type as ReactionType;
          if (currentHovering !== reactionType) {
            setCurrentHovering(reactionType);
            onHoveringReactionChange(reactionType);
          }
          break;
        }
      }
    } else if (currentHovering !== null) {
      setCurrentHovering(null);
      onHoveringReactionChange(null);
    }

    // 상태가 변경되었으면 화면 갱신
    if (shouldUpdate) {
      setRenderTrigger((prev) => prev + 1);
    }
  }, [currentTouchPosition, open, onHoveringReactionChange, currentHovering]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.1 }}
          className={
            "absolute top-0 translate-y-[calc(-100%-12px)] left-1/2 -translate-x-1/2"
          }
        >
          <div className={"flex gap-4"}>
            {Object.keys(ReactionType).map((reaction) => {
              const type = reaction as ReactionType;
              const properties = reactionPropertiesRef.current[type];
              const isSelected = selectedReaction === type;

              return (
                <ReactionHoverIcon
                  key={reaction}
                  reactionType={type}
                  ref={reactionRefsMap[type]}
                  distance={properties.distance}
                  isHovering={properties.isHovering}
                  isSelected={isSelected}
                />
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReactionAddPanel;
