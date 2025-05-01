import { cn } from "@/lib/utils";
import { ReactionType } from "@/models/Diary";
import {
  FaHandHoldingHeart,
  FaHeart,
  FaLaugh,
  FaSadCry,
  FaSmile,
  FaSurprise,
  FaThumbsUp,
} from "react-icons/fa";
import { FaHandsClapping } from "react-icons/fa6";

interface ReactionHoverIconProps extends React.HTMLAttributes<HTMLDivElement> {
  reactionType: ReactionType;
  ref?: React.Ref<HTMLDivElement | null>;
  distance: number | null;
  isHovering: boolean;
  isSelected: boolean;
  debug?: boolean;
  baseScale?: number;
}

interface ReactionIconMapProps {
  icon: React.ReactNode;
  color: string;
  backgroundColor: string;
}

const ReactionIconMap: Record<ReactionType, ReactionIconMapProps> = {
  [ReactionType.LIKE]: {
    icon: <FaThumbsUp />,
    color: "text-blue-500",
    backgroundColor: "bg-blue-100",
  },
  [ReactionType.HEART]: {
    icon: <FaHeart />,
    color: "text-red-500",
    backgroundColor: "bg-red-100",
  },
  [ReactionType.SMILE]: {
    icon: <FaSmile />,
    color: "text-yellow-500",
    backgroundColor: "bg-yellow-100",
  },
  [ReactionType.SAD]: {
    icon: <FaSadCry />,
    color: "text-sky-500",
    backgroundColor: "bg-sky-100",
  },
  [ReactionType.HUG]: {
    icon: <FaHandHoldingHeart />,
    color: "text-pink-500",
    backgroundColor: "bg-pink-100",
  },
  [ReactionType.LAUGH]: {
    icon: <FaLaugh />,
    color: "text-yellow-500",
    backgroundColor: "bg-yellow-100",
  },
  [ReactionType.WOW]: {
    icon: <FaSurprise />,
    color: "text-gray-500",
    backgroundColor: "bg-gray-100",
  },
  [ReactionType.CONGRATS]: {
    icon: <FaHandsClapping />,
    color: "text-cyan-500",
    backgroundColor: "bg-cyan-100",
  },
};

const ReactionHoverIcon = ({
  reactionType,
  ref,
  distance,
  isHovering,
  isSelected,
  debug = false,
  baseScale = 1.0,
  ...props
}: ReactionHoverIconProps) => {
  // 맥북 dock처럼 distance에 따라 scale 계산
  const calculateScale = () => {
    if (distance === null) return baseScale;

    // 기본 설정값
    const maxScale = 1.4; // 최대 확대 배율
    const hoverScale = 1.6; // 호버 시 확대 배율
    const minScale = baseScale; // 최소 확대 배율 (기본 크기)
    const maxDistance = 120; // 효과가 적용되는 최대 거리
    const influenceRadius = 80; // 주변 아이콘에 영향을 주는 범위

    if (distance > maxDistance) return minScale;

    // 맥북 독 스타일 효과를 위한 계산식
    // 거리가 가까울수록 스케일이 지수적으로 증가하도록 설정
    let scale = minScale;

    if (distance < influenceRadius) {
      // 거리에 따라 지수적으로 감소하는 효과
      const factor = Math.pow(1 - distance / maxDistance, 2);
      scale = minScale + (maxScale - minScale) * factor;
    }

    // 호버링 상태면 더 큰 스케일 적용
    if (isHovering) {
      return Math.max(scale, hoverScale);
    }

    return Math.max(minScale, Math.min(maxScale, scale));
  };

  const scale = calculateScale();

  // scale 값에 따라 zIndex 계산 (scale이 클수록 높은 zIndex)
  const calculateZIndex = () => {
    if (scale <= 1) return 1;

    // 스케일을 1부터 최대 스케일 범위에서 10부터 100 범위로 매핑
    // 스케일이 클수록 zIndex가 크게 설정
    const minZIndex = 10;
    const maxZIndex = 100;
    const normalizedScale = (scale - 1) / 0.6; // 1.0~1.6 범위를 0~1 범위로 정규화

    return Math.floor(minZIndex + normalizedScale * (maxZIndex - minZIndex));
  };

  const zIndex = calculateZIndex();

  return (
    <div {...props} ref={ref}>
      <div
        className={cn(
          "min-w-8 h-8 rounded-full flex items-center justify-center relative",
          ReactionIconMap[reactionType].backgroundColor,
          ReactionIconMap[reactionType].color,
          isHovering ? "ring-2 ring-offset-1" : "",
          isSelected
            ? `ring-2 ring-offset-2 ${ReactionIconMap[reactionType].color.replace("text-", "ring-")}`
            : ""
        )}
        style={{
          transform: `scale(${scale})`,
          transition:
            "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          zIndex: zIndex,
        }}
      >
        {debug && (
          <div className={"absolute -top-12"}>{distance?.toFixed(1)}</div>
        )}
        {ReactionIconMap[reactionType].icon}
      </div>
    </div>
  );
};

interface ReactionIconProps extends React.HTMLAttributes<HTMLDivElement> {
  reactionType: ReactionType;
  count: number;
}

const ReactionIcon = ({ reactionType, count, ...props }: ReactionIconProps) => {
  return (
    <div
      {...props}
      className={cn(
        "rounded-full flex items-center justify-center relative",
        ReactionIconMap[reactionType].color,
        props.className
      )}
    >
      {ReactionIconMap[reactionType].icon}
      {count > 0 && (
        <div
          className={cn(
            "text-xs absolute -bottom-2 -right-2 size-4 rounded-full flex items-center justify-center",
            ReactionIconMap[reactionType].backgroundColor
          )}
        >
          x{count}
        </div>
      )}
    </div>
  );
};

export { ReactionHoverIcon, ReactionIcon };
