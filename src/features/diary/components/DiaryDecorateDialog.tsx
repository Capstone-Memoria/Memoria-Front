import { StickerItem } from "@/api/diary-book";
import DiaryCover from "@/components/diary/DiaryCover";
import {
  DiaryCoverItem,
  PresetDiaryCoverItem,
  UploadedDiaryCoverItem,
} from "@/components/diary/DiaryCoverCarousel";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BsArrowsMove } from "react-icons/bs";
import { FaClock, FaSmile, FaTimes } from "react-icons/fa";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { MdRotate90DegreesCcw } from "react-icons/md";
import { RiArrowGoBackLine, RiArrowGoForwardLine } from "react-icons/ri";

interface DiaryDecorateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCover: DiaryCoverItem | null;
  onSave?: (stickers: StickerItem[]) => void;
}

// 스티커 카테고리 정의
type StickerCategory =
  | "recent"
  | "alphabet"
  | "shape"
  | "character"
  | "character2";

interface StickerData {
  id: string;
  imageUrl: string;
  category: StickerCategory;
}

// 기본 스티커 데이터 (카테고리 값 수정)
const STICKER_DATA: StickerData[] = [
  {
    id: "alphabet-a",
    imageUrl: "/stickers/alphabet/A.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-b",
    imageUrl: "/stickers/alphabet/B.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-c",
    imageUrl: "/stickers/alphabet/C.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-d",
    imageUrl: "/stickers/alphabet/D.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-e",
    imageUrl: "/stickers/alphabet/E.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-f",
    imageUrl: "/stickers/alphabet/F.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-g",
    imageUrl: "/stickers/alphabet/G.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-h",
    imageUrl: "/stickers/alphabet/H.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-i",
    imageUrl: "/stickers/alphabet/I.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-j",
    imageUrl: "/stickers/alphabet/J.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-k",
    imageUrl: "/stickers/alphabet/K.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-l",
    imageUrl: "/stickers/alphabet/L.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-m",
    imageUrl: "/stickers/alphabet/M.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-n",
    imageUrl: "/stickers/alphabet/N.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-o",
    imageUrl: "/stickers/alphabet/O.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-p",
    imageUrl: "/stickers/alphabet/P.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-q",
    imageUrl: "/stickers/alphabet/Q.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-r",
    imageUrl: "/stickers/alphabet/R.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-s",
    imageUrl: "/stickers/alphabet/S.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-t",
    imageUrl: "/stickers/alphabet/T.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-u",
    imageUrl: "/stickers/alphabet/U.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-v",
    imageUrl: "/stickers/alphabet/V.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-w",
    imageUrl: "/stickers/alphabet/W.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-x",
    imageUrl: "/stickers/alphabet/X.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-y",
    imageUrl: "/stickers/alphabet/Y.PNG",
    category: "alphabet",
  },
  {
    id: "alphabet-z",
    imageUrl: "/stickers/alphabet/Z.PNG",
    category: "alphabet",
  },
  {
    id: "shape-circle",
    imageUrl: "https://via.placeholder.com/64/ADD8E6/000000?text=●",
    category: "shape",
  },
  {
    id: "shape-square",
    imageUrl: "https://via.placeholder.com/64/ADD8E6/000000?text=■",
    category: "shape",
  },
  {
    id: "character-1",
    imageUrl:
      "https://cdn.pixabay.com/photo/2017/09/01/00/15/png-2702691_640.png",
    category: "character",
  },
  {
    id: "character-2",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/03/31/19/58/avatar-1295429_640.png",
    category: "character",
  },
  {
    id: "character2-1",
    imageUrl:
      "https://cdn.pixabay.com/photo/2014/04/03/11/56/smiley-312633_640.png",
    category: "character2",
  },
  {
    id: "character2-2",
    imageUrl:
      "https://cdn.pixabay.com/photo/2014/04/03/10/32/heart-311372_640.png",
    category: "character2",
  },
  // ... 다른 스티커 데이터 추가 가능 ...
];

const CATEGORY_ORDER: StickerCategory[] = [
  "recent",
  "alphabet",
  "shape",
  "character",
  "character2",
];

const CATEGORY_LABELS: Record<StickerCategory, string | React.ReactElement> = {
  recent: <FaClock size={20} />,
  alphabet: "알파벳",
  shape: "도형",
  character: "캐릭터",
  character2: "캐릭터2",
};

// 스티커 조작 모드 타입
type StickerMode = "move" | "rotate" | "resize";

export const DiaryDecorateDialog = ({
  open,
  onOpenChange,
  selectedCover,
  onSave,
}: DiaryDecorateDialogProps) => {
  const [isClosing, setIsClosing] = useState(false);

  // 애니메이션 스타일 추가
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @keyframes dialogEnter {
        0% {
          opacity: 0;
          transform: scale(0.95);
          pointer-events: none;
        }
        100% {
          opacity: 1;
          transform: scale(1);
          pointer-events: all;
        }
      }
      
      @keyframes dialogExit {
        0% {
          opacity: 1;
          transform: scale(1);
        }
        100% {
          opacity: 0;
          transform: scale(0.95);
          pointer-events: none;
        }
      }
      
      @keyframes overlayEnter {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 0.4;
        }
      }
      
      @keyframes overlayExit {
        0% {
          opacity: 0.4;
        }
        50% {
          opacity: 0;
        }
        100% {
          opacity: 0;
        }
      }
      
      .dialog-animation-enter {
        animation: dialogEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        transform-origin: center;
        will-change: opacity, transform;
      }
      
      .dialog-animation-exit {
        animation: dialogExit 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        transform-origin: center;
        will-change: opacity, transform;
      }
      
      .overlay-animation-enter {
        animation: overlayEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      
      .overlay-animation-exit {
        animation: overlayExit 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
    `;

    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  const [stickers, setStickers] = useState<StickerItem[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(
    null
  );
  const [stickerDrawerOpen, setStickerDrawerOpen] = useState(false);
  const [history, setHistory] = useState<StickerItem[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedCategory, setSelectedCategory] =
    useState<StickerCategory>("alphabet");
  const [recentStickers, setRecentStickers] = useState<string[]>([]);

  // 컨테이너 크기 상태
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // 드래그 관련 상태
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<StickerMode | null>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const stickerInitialStateRef = useRef<{
    x: number;
    y: number;
    rotation: number;
    scale: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 컨테이너 크기 업데이트
  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        if (width > 1 && height > 1) {
          console.log(
            "Container size updated (useEffect - open/resize):",
            width,
            height
          );
          setContainerSize({ width, height });
        }
      }
    };

    if (open) {
      // 다이얼로그가 열린 후 크기 측정 (애니메이션 시간 고려)
      const timer = setTimeout(() => {
        updateContainerSize();
      }, 150); // 다이얼로그 애니메이션 시간과 유사하게 설정
      return () => clearTimeout(timer);
    }
  }, [open]); // open 상태가 변경될 때마다 실행

  // 창 크기 변경 시 컨테이너 크기 업데이트
  useEffect(() => {
    const updateContainerSizeOnResize = () => {
      if (open && containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        if (width > 1 && height > 1) {
          console.log("Container size updated (window resize):", width, height);
          setContainerSize({ width, height });
        }
      }
    };
    window.addEventListener("resize", updateContainerSizeOnResize);
    return () => {
      window.removeEventListener("resize", updateContainerSizeOnResize);
    };
  }, [open]);

  // 최근 사용한 스티커 로드
  useEffect(() => {
    const savedRecentStickers = localStorage.getItem("recentStickers");
    if (savedRecentStickers) {
      try {
        const parsed = JSON.parse(savedRecentStickers);
        if (Array.isArray(parsed)) {
          setRecentStickers(parsed);
        }
      } catch (e) {
        console.error("최근 사용한 스티커 로드 실패:", e);
        localStorage.removeItem("recentStickers");
      }
    }
  }, []);

  // 스티커 추가 함수
  const addSticker = (sticker: StickerData) => {
    const newSticker: StickerItem = {
      id: `sticker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      imageUrl: sticker.imageUrl,
      x: 50,
      y: 50,
      rotation: 0,
      scale: 1,
      zIndex: stickers.length + 1,
    };

    const newStickers = [...stickers, newSticker];

    // 히스토리에 현재 상태 추가
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newStickers);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    setStickers(newStickers);
    setSelectedStickerId(newSticker.id);
    setStickerDrawerOpen(false);

    // 최근 사용한 스티커에 추가
    const newRecentStickers = [
      sticker.id,
      ...recentStickers.filter((id) => id !== sticker.id),
    ].slice(0, 15); // 최대 15개까지만 저장
    setRecentStickers(newRecentStickers);

    try {
      localStorage.setItem("recentStickers", JSON.stringify(newRecentStickers));
    } catch (e) {
      console.error("최근 사용한 스티커 저장 실패:", e);
    }
  };

  // 스티커 위치 제한 함수
  const constrainPosition = useCallback(
    (x: number, y: number, scale: number = 1): { x: number; y: number } => {
      console.log("constrainPosition 입력값:", { x, y, scale });
      console.log("constrainPosition 현재 containerSize:", containerSize);

      if (!isFinite(x) || !isFinite(y)) {
        console.log("constrainPosition: 무한대 값 감지됨, 기본값으로 설정");
        return { x: 50, y: 50 };
      }

      const currentContainerWidth = containerSize.width;
      const currentContainerHeight = containerSize.height;

      if (currentContainerWidth <= 1 || currentContainerHeight <= 1) {
        console.log(
          "constrainPosition: 컨테이너 크기가 유효하지 않음, 기본값 반환",
          currentContainerWidth,
          currentContainerHeight
        );
        return { x: 50, y: 50 };
      }

      // Convert current center (percentage) to pixels
      const currentX_px = (x / 100) * currentContainerWidth;
      const currentY_px = (y / 100) * currentContainerHeight;

      const stickerOriginalWidth = 64;
      const stickerOriginalHeight = 64;
      const scaledStickerWidth = stickerOriginalWidth * scale;
      const scaledStickerHeight = stickerOriginalHeight * scale;
      console.log(
        "스티커 실제 크기 (scaled):",
        scaledStickerWidth,
        scaledStickerHeight
      );

      // Calculate pixel boundaries for the sticker's center based on its edges
      const minX_px = scaledStickerWidth / 2;
      const maxX_px = currentContainerWidth - scaledStickerWidth / 2;
      const minY_px = scaledStickerHeight / 2;
      const maxY_px = currentContainerHeight - scaledStickerHeight / 2;
      console.log("중심점 픽셀 제한 (min/max):");
      console.log("minX_px:", minX_px, "maxX_px:", maxX_px);
      console.log("minY_px:", minY_px, "maxY_px:", maxY_px);

      // Constrain the center pixel coordinates
      let constrainedX_px = Math.max(minX_px, Math.min(maxX_px, currentX_px));
      let constrainedY_px = Math.max(minY_px, Math.min(maxY_px, currentY_px));
      console.log("제한된 중심 픽셀 위치:", constrainedX_px, constrainedY_px);

      // Handle cases where sticker is larger than container
      if (minX_px > maxX_px) {
        // Sticker wider than container
        console.log("스티커 너비가 컨테이너 너비보다 큼, 중앙 정렬");
        constrainedX_px = currentContainerWidth / 2;
      }
      if (minY_px > maxY_px) {
        // Sticker taller than container
        console.log("스티커 높이가 컨테이너 높이보다 큼, 중앙 정렬");
        constrainedY_px = currentContainerHeight / 2;
      }

      // Convert constrained pixel coordinates back to percentage
      const finalX = (constrainedX_px / currentContainerWidth) * 100;
      const finalY = (constrainedY_px / currentContainerHeight) * 100;

      const safeFinalX = isFinite(finalX) ? finalX : 50;
      const safeFinalY = isFinite(finalY) ? finalY : 50;
      console.log("최종 반환 위치 (%):", { x: safeFinalX, y: safeFinalY });

      return { x: safeFinalX, y: safeFinalY };
    },
    [containerSize]
  );

  // 스티커 선택 함수
  const handleStickerSelect = (
    id: string,
    e: React.MouseEvent | React.TouchEvent
  ) => {
    e.stopPropagation();
    setSelectedStickerId(id);
    console.log("스티커 선택됨:", id);

    // 선택된 스티커의 z-index를 최상위로 변경
    setStickers((prevStickers) => {
      const maxZIndex =
        Math.max(...prevStickers.map((s) => s.zIndex || 0), 0) + 1;
      console.log("새 z-index:", maxZIndex);

      return prevStickers.map((sticker) =>
        sticker.id === id
          ? {
              ...sticker,
              zIndex: maxZIndex,
            }
          : sticker
      );
    });
  };

  // 스티커 삭제 함수
  const handleDeleteSticker = (
    id: string,
    e: React.MouseEvent | React.TouchEvent
  ) => {
    e.stopPropagation();
    const newStickers = stickers.filter((sticker) => sticker.id !== id);

    // 히스토리에 현재 상태 추가
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newStickers);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    setStickers(newStickers);
    setSelectedStickerId(null);
  };

  // 드래그 시작 핸들러
  const handleDragStart = useCallback(
    (
      e: React.TouchEvent | React.MouseEvent,
      stickerId: string,
      mode: StickerMode
    ) => {
      console.log(`드래그 시작: mode=${mode}, stickerId=${stickerId}`);

      // 모바일에서는 preventDefault 호출 안함
      if (!("touches" in e)) {
        e.preventDefault();
      }
      e.stopPropagation();

      // 드래그 시작 시 해당 스티커 선택
      setSelectedStickerId(stickerId);
      setDragMode(mode);

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      console.log("시작 좌표:", clientX, clientY);

      dragStartRef.current = { x: clientX, y: clientY };

      // 현재 스티커의 상태 저장
      const sticker = stickers.find((s) => s.id === stickerId);
      if (sticker) {
        stickerInitialStateRef.current = {
          x: sticker.x,
          y: sticker.y,
          rotation: sticker.rotation,
          scale: sticker.scale,
        };
        console.log("초기 스티커 상태:", stickerInitialStateRef.current);

        // z-index 최상위로 설정
        setStickers((prevStickers) => {
          const maxZIndex =
            Math.max(...prevStickers.map((s) => s.zIndex || 0), 0) + 1;
          return prevStickers.map((s) =>
            s.id === stickerId ? { ...s, zIndex: maxZIndex } : s
          );
        });
      }

      // 이벤트 핸들러 등록 전에 isDragging 상태 설정
      setIsDragging(true);
    },
    [stickers]
  );

  // 드래그 이동 핸들러
  const handleDragMove = useCallback(
    (e: TouchEvent | MouseEvent) => {
      if (!selectedStickerId || !dragMode || !stickerInitialStateRef.current) {
        console.log("드래그 이동 조건 불충족:", {
          selectedStickerId,
          dragMode,
        });
        return;
      }

      // 클라이언트 좌표 가져오기
      let clientX, clientY;
      if ("touches" in e) {
        if (e.touches.length === 0) return; // 터치 이벤트가 없으면 리턴
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      if (!dragStartRef.current) {
        console.log("dragStartRef.current is null in handleDragMove");
        return;
      }

      const deltaX = clientX - dragStartRef.current.x;
      const deltaY = clientY - dragStartRef.current.y;
      console.log(`드래그 이동: deltaX=${deltaX}, deltaY=${deltaY}`);

      const containerElement = containerRef.current;
      if (!containerElement) {
        console.log("컨테이너 요소가 없음");
        return;
      }

      const containerRect = containerElement.getBoundingClientRect();
      console.log(
        "컨테이너 크기 (handleDragMove):",
        containerRect.width,
        containerRect.height
      );

      if (containerRect.width <= 1 || containerRect.height <= 1) {
        console.log("컨테이너 크기가 너무 작습니다 (handleDragMove)");
        return;
      }

      // 안전한 이동 계수 계산
      const moveFactorX = 100 / Math.max(1, containerRect.width);
      const moveFactorY = 100 / Math.max(1, containerRect.height);
      console.log("이동 계수:", moveFactorX, moveFactorY);

      // 스티커 업데이트
      setStickers((prevStickers) => {
        const updatedStickers = prevStickers.map((sticker) => {
          if (sticker.id !== selectedStickerId) return sticker;

          let updatedSticker;
          switch (dragMode) {
            case "move": {
              // 안전하게 새 위치 계산
              const newX =
                stickerInitialStateRef.current!.x + deltaX * moveFactorX;
              const newY =
                stickerInitialStateRef.current!.y + deltaY * moveFactorY;

              // 무한대 값 확인
              const safeX = isFinite(newX)
                ? newX
                : stickerInitialStateRef.current!.x;
              const safeY = isFinite(newY)
                ? newY
                : stickerInitialStateRef.current!.y;

              console.log("새 위치 (제한 전):", safeX, safeY);

              // 스티커가 컨테이너를 벗어나지 않도록 제한
              const { x, y } = constrainPosition(safeX, safeY, sticker.scale);
              console.log("제한된 위치:", x, y);
              updatedSticker = { ...sticker, x, y };
              break;
            }

            case "rotate": {
              // 스티커 중심점 계산
              const stickerCenterX =
                (sticker.x / 100) * containerRect.width + containerRect.left;
              const stickerCenterY =
                (sticker.y / 100) * containerRect.height + containerRect.top;

              // 시작 각도와 현재 각도 계산
              const startAngle = Math.atan2(
                dragStartRef.current.y - stickerCenterY,
                dragStartRef.current.x - stickerCenterX
              );
              const currentAngle = Math.atan2(
                clientY - stickerCenterY,
                clientX - stickerCenterX
              );

              const angleDelta = (currentAngle - startAngle) * (180 / Math.PI);
              console.log("회전 각도:", angleDelta);

              updatedSticker = {
                ...sticker,
                rotation: stickerInitialStateRef.current!.rotation + angleDelta,
              };
              break;
            }

            case "resize": {
              // 스티커 중심점 계산
              const stickerCenterX =
                (sticker.x / 100) * containerRect.width + containerRect.left;
              const stickerCenterY =
                (sticker.y / 100) * containerRect.height + containerRect.top;

              // 드래그 시작 지점에서 스티커 중심까지의 벡터
              const startVectorX = dragStartRef.current.x - stickerCenterX;
              const startVectorY = dragStartRef.current.y - stickerCenterY;
              const startLength = Math.sqrt(
                startVectorX * startVectorX + startVectorY * startVectorY
              );

              // 현재 드래그 지점에서 스티커 중심까지의 벡터
              const currentVectorX = clientX - stickerCenterX;
              const currentVectorY = clientY - stickerCenterY;
              const currentLength = Math.sqrt(
                currentVectorX * currentVectorX +
                  currentVectorY * currentVectorY
              );

              // 크기 비율 계산 (부드러운 변화를 위해 제곱근 사용)
              const rawRatio = currentLength / Math.max(0.1, startLength);
              const ratio = Math.pow(rawRatio, 0.7); // 부드러운 느낌을 위해 지수 감소

              // 스냅 기능 (0.5 단위로)
              const isSnap = e.shiftKey; // Shift 키를 누르고 있으면 스냅 활성화

              let newScale = stickerInitialStateRef.current!.scale * ratio;
              if (isSnap) {
                newScale = Math.round(newScale * 2) / 2; // 0.5 단위로 반올림
              }

              // 크기 제한
              newScale = Math.max(0.5, Math.min(4, newScale));

              console.log("크기 조절 정보:", {
                ratio,
                newScale,
                isSnap,
              });

              // 크기 변경 시에도 위치 제한 적용
              const { x, y } = constrainPosition(
                sticker.x,
                sticker.y,
                newScale
              );
              updatedSticker = { ...sticker, scale: newScale, x, y };
              break;
            }

            default:
              updatedSticker = sticker;
          }
          return updatedSticker;
        });
        return updatedStickers;
      });
    },
    [selectedStickerId, dragMode, constrainPosition]
  );

  // 드래그 종료 핸들러
  const handleDragEnd = useCallback(
    (e: TouchEvent | MouseEvent) => {
      console.log("드래그 종료");

      if (!selectedStickerId) {
        console.log("드래그 종료: 선택된 스티커 없음");
        setIsDragging(false);
        setDragMode(null);
        return;
      }

      // 히스토리에 현재 상태 추가
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push([...stickers]);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      // 상태 초기화
      setIsDragging(false);
      setDragMode(null);
    },
    [stickers, history, historyIndex, selectedStickerId]
  );

  // 전역 이벤트 리스너 등록
  useEffect(() => {
    if (isDragging && selectedStickerId) {
      console.log("이벤트 리스너 등록 (useEffect)");

      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault(); // 스크롤 방지
        handleDragMove(e);
      };

      // 터치 이벤트
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleDragEnd);
      document.addEventListener("touchcancel", handleDragEnd);

      // 마우스 이벤트
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);

      return () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleDragEnd);
        document.removeEventListener("touchcancel", handleDragEnd);
        document.removeEventListener("mousemove", handleDragMove);
        document.removeEventListener("mouseup", handleDragEnd);
        console.log("이벤트 리스너 제거 (useEffect)");
      };
    }
  }, [isDragging, selectedStickerId, handleDragMove, handleDragEnd]);

  // 다이얼로그 닫기 애니메이션 처리
  useEffect(() => {
    if (!open && !isClosing) return;

    if (open) {
      setIsClosing(false);
    }
  }, [open]);

  // 애니메이션이 있는 닫기 함수
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onOpenChange(false);
      setIsClosing(false);
    }, 200); // 애니메이션 시간 조정
  };

  // 저장 함수
  const handleSave = () => {
    onSave?.(stickers);
    handleClose();
  };

  // 뒤로가기 함수
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setStickers(history[historyIndex - 1]);
    }
  };

  // 앞으로가기 함수
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setStickers(history[historyIndex + 1]);
    }
  };

  // 초기 히스토리 설정
  useEffect(() => {
    if (open && history.length === 0) {
      setHistory([[...stickers]]);
      setHistoryIndex(0);
    }
  }, [open, stickers]);

  if (!open && !isClosing) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 ${isClosing ? "overlay-animation-exit" : "overlay-animation-enter"}`}
      />

      {/* 메인 다이얼로그 컨텐츠 */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-white overflow-hidden ${isClosing ? "dialog-animation-exit" : "dialog-animation-enter"}`}
        style={{ height: "100dvh", width: "100%" }}
      >
        {/* 헤더 - 고정 */}
        <div className={"bg-white"}>
          <div className={"flex justify-between items-center p-4"}>
            <button
              className={"p-2 mr-1 rounded-full hover:bg-gray-100"}
              onClick={handleClose}
            >
              <HiArrowNarrowLeft className={"text-2xl"} />
            </button>
            <h3 className={"text-lg font-medium"}>일기장 꾸미기</h3>
            <button
              className={"p-2 rounded-full hover:bg-gray-100"}
              onClick={handleSave}
            >
              저장
            </button>
          </div>
        </div>

        {/* 메인 컨텐츠 - 스크롤 가능 영역 */}
        <div className={"flex-1 overflow-auto"}>
          <div className={"flex items-center justify-center p-10"}>
            <div
              ref={containerRef}
              className={
                "relative w-full max-w-[min(60vh,400px)] aspect-[3/4] bg-gray-200 overflow-hidden"
              }
              onClick={() => setSelectedStickerId(null)}
            >
              <DiaryCover
                className={"w-full h-full"}
                coverColor={selectedCover?.coverColor}
                imageSrc={
                  selectedCover?.type === "preset"
                    ? (selectedCover as PresetDiaryCoverItem).imageSrc
                    : undefined
                }
                imageFile={
                  selectedCover?.type === "uploaded"
                    ? (selectedCover as UploadedDiaryCoverItem).image
                    : undefined
                }
              />

              {/* 스티커 렌더링 */}
              {stickers.map((sticker) => (
                <div
                  key={sticker.id}
                  className={"absolute pointer-events-auto"}
                  style={{
                    left: `${sticker.x}%`,
                    top: `${sticker.y}%`,
                    transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
                    zIndex: sticker.zIndex || 1,
                    touchAction: "none",
                  }}
                  onClick={(e) => handleStickerSelect(sticker.id, e)}
                >
                  {/* 선택 테두리 (선택된 경우에만) */}
                  {selectedStickerId === sticker.id && (
                    <div
                      className={
                        "absolute border-2 border-blue-500 border-dashed rounded-md pointer-events-none"
                      }
                      style={{
                        width: `calc(${64 * sticker.scale}px + 8px)`,
                        height: `calc(${64 * sticker.scale}px + 8px)`,
                        top: "-4px",
                        left: "-4px",
                      }}
                    ></div>
                  )}
                  {/* 내부 컨테이너: 스티커 이미지 */}
                  <div
                    className={"relative touch-none"}
                    style={{
                      width: `${64 * sticker.scale}px`,
                      height: `${64 * sticker.scale}px`,
                    }}
                    onMouseDown={(e) => handleDragStart(e, sticker.id, "move")}
                    onTouchStart={(e) => handleDragStart(e, sticker.id, "move")}
                  >
                    <img
                      src={sticker.imageUrl}
                      alt={"스티커"}
                      className={
                        "w-full h-full object-contain pointer-events-none"
                      }
                      draggable={false}
                    />

                    {/* 선택된 스티커일 경우에만 컨트롤 표시 */}
                    {selectedStickerId === sticker.id && (
                      <>
                        {/* 삭제 버튼 */}
                        <div
                          className={
                            "absolute w-5 h-5 rounded-full shadow flex items-center justify-center text-white bg-red-500 z-20 pointer-events-auto cursor-pointer"
                          }
                          style={{
                            top: `-15px`,
                            right: `-15px`,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSticker(sticker.id, e);
                          }}
                        >
                          <FaTimes size={12} />
                        </div>

                        {/* 회전 컨트롤 */}
                        <div
                          className={
                            "absolute w-6 h-6 bg-white rounded-full shadow flex items-center justify-center cursor-grab touch-none z-10 pointer-events-auto"
                          }
                          style={{
                            top: `-24px`,
                            left: `50%`,
                            transform: `translateX(-50%)`,
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            handleDragStart(e, sticker.id, "rotate");
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            handleDragStart(e, sticker.id, "rotate");
                          }}
                        >
                          <MdRotate90DegreesCcw size={14} />
                        </div>

                        {/* 크기 조절 컨트롤 - 우측 하단 */}
                        <div
                          className={
                            "absolute w-6 h-6 bg-white rounded-full shadow flex items-center justify-center cursor-nwse-resize touch-none z-10 pointer-events-auto"
                          }
                          style={{
                            bottom: `-10px`,
                            right: `-10px`,
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            handleDragStart(e, sticker.id, "resize");
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            handleDragStart(e, sticker.id, "resize");
                          }}
                        >
                          <BsArrowsMove size={14} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 바 - 고정 */}
        <div className={"fixed bottom-0 left-0 right-0 bg-white border-t z-50"}>
          <div className={"flex justify-between items-center p-4"}>
            <div className={"flex gap-2"}>
              <button
                className={
                  "p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                }
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                aria-label={"뒤로가기"}
              >
                <RiArrowGoBackLine size={20} />
              </button>
              <button
                className={
                  "p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                }
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                aria-label={"앞으로가기"}
              >
                <RiArrowGoForwardLine size={20} />
              </button>
            </div>
            <button
              className={"p-2 rounded-full hover:bg-gray-100"}
              onClick={() => setStickerDrawerOpen(true)}
              aria-label={"스티커 목록 열기"}
            >
              <FaSmile size={20} />
            </button>
          </div>
        </div>

        {/* 스티커 선택 Drawer */}
        <Drawer
          open={stickerDrawerOpen}
          onOpenChange={setStickerDrawerOpen}
          shouldScaleBackground={false}
        >
          <DrawerContent
            className={"h-[50vh] px-4 pb-8"}
            aria-labelledby={"drawer-title"}
            aria-describedby={"drawer-description"}
          >
            {/* 카테고리 선택 */}
            <div
              className={
                "flex justify-around items-center leading-none border-b mb-4 overflow-x-auto overflow-y-hidden py-4 sticky top-0 bg-white"
              }
              role={"tablist"}
            >
              {CATEGORY_ORDER.map((category) => (
                <button
                  key={category}
                  role={"tab"}
                  aria-selected={selectedCategory === category}
                  className={`px-3 py-2 rounded-full whitespace-nowrap flex items-center justify-center ${
                    selectedCategory === category
                      ? "bg-emerald-100 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {CATEGORY_LABELS[category]}
                </button>
              ))}
            </div>

            {/* 스티커 그리드 */}
            <div
              className={"grid grid-cols-5 gap-4 overflow-y-auto"}
              role={"tabpanel"}
            >
              {selectedCategory === "recent"
                ? recentStickers
                    .map((id) => STICKER_DATA.find((s) => s.id === id))
                    .filter(Boolean)
                    .map((sticker) => (
                      <div
                        key={sticker!.id}
                        className={
                          "aspect-square p-2 rounded-lg cursor-pointer"
                        }
                        onClick={() => addSticker(sticker!)}
                        aria-label={`${sticker!.category} 스티커 추가`}
                      >
                        <img
                          src={sticker!.imageUrl}
                          alt={"스티커"}
                          className={"w-full h-full object-contain"}
                        />
                      </div>
                    ))
                : STICKER_DATA.filter(
                    (s) => s.category === selectedCategory
                  ).map((sticker) => (
                    <div
                      key={sticker.id}
                      className={"aspect-square p-2 rounded-lg cursor-pointer"}
                      onClick={() => addSticker(sticker)}
                      aria-label={`${sticker.category} 스티커 추가`}
                    >
                      <img
                        src={sticker.imageUrl}
                        alt={"스티커"}
                        className={"w-full h-full object-contain"}
                      />
                    </div>
                  ))}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
};
