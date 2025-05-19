import { RefObject, useCallback, useEffect, useRef, useState } from "react";

// --- 설정 상수 ---
const MAX_SCALE = 1.1; // 중앙 최대 크기
const MIN_SCALE = 0.7; // 양옆 최소 크기
const MAX_OPACITY = 1.0; // 중앙 최대 투명도
const MIN_OPACITY = 0.7; // 양옆 최소 투명도
const SCALE_EFFECT_RANGE_FACTOR = 1.5; // 스케일링/투명도 효과 범위 (아이템 너비 배수)
const TRANSITION_DURATION = 300; // 애니메이션 지속 시간 (ms)
const VELOCITY_THRESHOLD = 0.3; // 스와이프 속도 임계값
const VELOCITY_FACTOR = 150; // 속도 기반 이동 픽셀 계산 계수

interface UseCarouselInteractionProps {
  itemCount: number;
  onSelect?: (index: number) => void;
}

interface UseCarouselInteractionReturn {
  currentIndex: number;
  potentialIndex: number; // 추가: 드래그 중 예상 인덱스
  isDragging: boolean;
  isAnimating: boolean;
  containerRef: RefObject<HTMLDivElement>;
  itemRef: RefObject<HTMLDivElement>;
  getTranslateX: () => number;
  calculateItemStyle: (itemIndex: number) => {
    transform: string;
    opacity: number;
  };
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  handleMouseLeave: () => void;
  handleIndicatorClick: (index: number) => void;
}

export const useCarouselInteraction = ({
  itemCount,
  onSelect,
}: UseCarouselInteractionProps): UseCarouselInteractionReturn => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [potentialIndex, setPotentialIndex] = useState(0); // 추가: 예상 인덱스 상태
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [actualItemWidth, setActualItemWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null); // 첫 번째 아이템 측정용
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastMoveTimestampRef = useRef<number>(0);
  const lastMoveClientXRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);

  // --- 요소 크기 측정 ---
  useEffect(() => {
    const measureElements = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
      if (itemRef.current) {
        const style = window.getComputedStyle(itemRef.current);
        const marginLeft = parseFloat(style.marginLeft);
        const marginRight = parseFloat(style.marginRight);
        setActualItemWidth(
          itemRef.current.offsetWidth + marginLeft + marginRight
        );
      }
    };

    const timeoutId = setTimeout(measureElements, 50);
    window.addEventListener("resize", measureElements);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", measureElements);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [itemCount]);

  // --- 초기 선택 콜백 호출 ---
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSelect && actualItemWidth > 0 && currentIndex === 0) {
        // 초기 potentialIndex도 0으로 설정 (currentIndex와 동기화)
        setPotentialIndex(0);
        onSelect(0);
      }
    }, 100);
    return () => clearTimeout(timer);
    // 초기화 로직이므로 currentIndex, potentialIndex 의존성 제거
  }, [onSelect, actualItemWidth]);

  // --- 애니메이션 관리 ---
  const startAnimation = useCallback((callback?: () => void) => {
    setIsAnimating(true);
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      animationTimeoutRef.current = null;
      if (callback) callback();
    }, TRANSITION_DURATION);
  }, []);

  const stopAnimation = useCallback(() => {
    setIsAnimating(false);
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    if (containerRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _ = containerRef.current.offsetHeight;
    }
  }, []);

  // --- 위치 계산 ---
  const getTranslateX = useCallback(() => {
    if (!containerWidth || actualItemWidth === 0) return 0;
    const centerOffset = (containerWidth - actualItemWidth) / 2;
    return centerOffset - currentIndex * actualItemWidth + offsetX;
  }, [containerWidth, actualItemWidth, currentIndex, offsetX, itemCount]);

  // --- 개별 아이템 스타일 계산 ---
  const calculateItemStyle = useCallback(
    (itemIndex: number) => {
      if (!containerWidth || actualItemWidth === 0) {
        return { transform: `scale(${MIN_SCALE})`, opacity: MIN_OPACITY };
      }

      const containerCenter = containerWidth / 2;
      const currentTranslateX = getTranslateX();
      const itemLeftEdgeInContainer =
        currentTranslateX + itemIndex * actualItemWidth;
      const itemCenterInContainer =
        itemLeftEdgeInContainer + actualItemWidth / 2;

      const distance = Math.abs(itemCenterInContainer - containerCenter);
      const effectiveScaleRange = actualItemWidth * SCALE_EFFECT_RANGE_FACTOR;

      let scale = MIN_SCALE;
      let opacity = MIN_OPACITY;

      if (distance < effectiveScaleRange) {
        const proximityFactor = 1 - distance / effectiveScaleRange;
        scale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * proximityFactor;
        opacity = MIN_OPACITY + (MAX_OPACITY - MIN_OPACITY) * proximityFactor;
      }

      return {
        transform: `scale(${scale})`,
        opacity: opacity,
      };
    },
    [containerWidth, actualItemWidth, getTranslateX, itemCount]
  );

  // --- 드래그/터치 공통 로직 ---
  const handleDragStart = useCallback(
    (clientX: number) => {
      if (isAnimating) {
        stopAnimation();
      }
      setStartX(clientX);
      setIsDragging(true);
      setOffsetX(0);
      // 드래그 시작 시 potentialIndex는 현재 currentIndex와 동일하게 설정
      setPotentialIndex(currentIndex);

      lastMoveTimestampRef.current = Date.now();
      lastMoveClientXRef.current = clientX;
      velocityRef.current = 0;
    },
    [isAnimating, stopAnimation, currentIndex] // currentIndex 의존성 추가
  );

  const handleDragMove = useCallback(
    (clientX: number) => {
      if (!isDragging || actualItemWidth === 0) return;

      const currentX = clientX;
      const currentTime = Date.now();
      const deltaTime = currentTime - lastMoveTimestampRef.current;
      const deltaX = currentX - lastMoveClientXRef.current;

      if (deltaTime > 10) {
        velocityRef.current = deltaX / deltaTime;
        lastMoveTimestampRef.current = currentTime;
        lastMoveClientXRef.current = currentX;
      }

      let diff = currentX - startX;

      if (
        (currentIndex === 0 && diff > 0) ||
        (currentIndex === itemCount - 1 && diff < 0)
      ) {
        diff /= 3;
      }
      setOffsetX(diff);

      // --- 예상 인덱스 계산 및 업데이트 ---
      // 현재 offset을 기반으로 중앙에 올 것으로 예상되는 인덱스 계산
      // (현재 인덱스 - 이동 오프셋 / 아이템 너비) 를 반올림
      const currentOffset = diff; // 저항이 적용된 diff 사용
      let estimatedIndex = currentIndex - currentOffset / actualItemWidth;
      estimatedIndex = Math.round(estimatedIndex);
      // 계산된 인덱스를 유효 범위 (0 ~ itemCount - 1) 내로 제한
      estimatedIndex = Math.max(0, Math.min(itemCount - 1, estimatedIndex));

      // 이전 potentialIndex와 다를 경우에만 업데이트 (불필요한 리렌더링 방지)
      setPotentialIndex((prevIndex) => {
        if (prevIndex !== estimatedIndex) {
          return estimatedIndex;
        }
        return prevIndex;
      });
      // ---------------------------------
    },
    [isDragging, startX, currentIndex, itemCount, actualItemWidth]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging || actualItemWidth === 0) return;

    setIsDragging(false);

    const endVelocity = velocityRef.current;
    const currentOffset = offsetX;
    const threshold = actualItemWidth / 4;

    let newIndex = currentIndex;

    if (Math.abs(endVelocity) > VELOCITY_THRESHOLD) {
      const estimatedMovePixels = endVelocity * VELOCITY_FACTOR;
      const itemsToMove = Math.round(estimatedMovePixels / actualItemWidth);

      if (itemsToMove !== 0) {
        newIndex = currentIndex - itemsToMove;
      } else {
        if (Math.abs(currentOffset) > threshold) {
          newIndex = currentOffset > 0 ? currentIndex - 1 : currentIndex + 1;
        }
      }
    } else if (Math.abs(currentOffset) > threshold) {
      newIndex = currentOffset > 0 ? currentIndex - 1 : currentIndex + 1;
    } else {
      newIndex = currentIndex;
    }

    newIndex = Math.max(0, Math.min(itemCount - 1, newIndex));

    setOffsetX(0);

    // 최종 결정된 인덱스로 potentialIndex 업데이트
    setPotentialIndex(newIndex);

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      startAnimation(() => {
        if (onSelect) {
          onSelect(newIndex);
        }
      });
    } else if (currentOffset !== 0) {
      startAnimation();
    }
  }, [
    isDragging,
    offsetX,
    currentIndex,
    itemCount,
    actualItemWidth,
    startAnimation,
    onSelect,
  ]);

  // --- 터치 이벤트 핸들러 ---
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleDragStart(e.touches[0].clientX);
    },
    [handleDragStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleDragMove(e.touches[0].clientX);
    },
    [handleDragMove]
  );

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // --- 마우스 이벤트 핸들러 ---
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handleDragStart(e.clientX);
      e.preventDefault();
    },
    [handleDragStart]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      handleDragMove(e.clientX);
    },
    [handleDragMove]
  );

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      handleDragEnd();
    }
  }, [isDragging, handleDragEnd]);

  // --- 인디케이터 클릭 핸들러 ---
  const handleIndicatorClick = useCallback(
    (index: number) => {
      if (isAnimating || currentIndex === index) return;

      stopAnimation();
      setOffsetX(0);
      // 클릭 시 potentialIndex도 즉시 동기화
      setPotentialIndex(index);
      setCurrentIndex(index);
      startAnimation(() => {
        if (onSelect) {
          onSelect(index);
        }
      });
    },
    [isAnimating, currentIndex, stopAnimation, startAnimation, onSelect]
  );

  return {
    currentIndex,
    potentialIndex, // 반환 값에 추가
    isDragging,
    isAnimating,
    containerRef: containerRef as RefObject<HTMLDivElement>,
    itemRef: itemRef as RefObject<HTMLDivElement>,
    getTranslateX,
    calculateItemStyle,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleIndicatorClick,
  };
};
