import { StickerItem } from "@/api/diary-book";
import DiaryCover from "@/components/diary/DiaryCover";
import {
  DiaryCoverItem,
  PresetDiaryCoverItem,
  UploadedDiaryCoverItem,
} from "@/components/diary/DiaryCoverCarousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaSave,
  FaSmile,
  FaTimes,
} from "react-icons/fa";
import { MdRotate90DegreesCcw } from "react-icons/md";
import { RiZoomInLine } from "react-icons/ri";

interface DiaryDecorateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCover: DiaryCoverItem | null;
  onSave?: (stickers: StickerItem[]) => void;
}

// 스티커 카테고리 정의
type StickerCategory = "emoji" | "nature" | "music" | "recent";

interface StickerData {
  id: string;
  imageUrl: string;
  category: StickerCategory;
}

// 기본 스티커 데이터
const STICKER_DATA: StickerData[] = [
  {
    id: "emoji-smile",
    imageUrl:
      "https://cdn.pixabay.com/photo/2014/04/03/11/56/smiley-312633_640.png",
    category: "emoji",
  },
  {
    id: "emoji-heart",
    imageUrl:
      "https://cdn.pixabay.com/photo/2014/04/03/10/32/heart-311372_640.png",
    category: "emoji",
  },
  {
    id: "nature-flower",
    imageUrl:
      "https://cdn.pixabay.com/photo/2014/04/02/10/54/flower-304967_640.png",
    category: "nature",
  },
  {
    id: "nature-butterfly",
    imageUrl:
      "https://cdn.pixabay.com/photo/2014/04/03/10/31/butterfly-311046_640.png",
    category: "nature",
  },
  {
    id: "nature-sun",
    imageUrl:
      "https://cdn.pixabay.com/photo/2014/04/03/10/32/sun-311427_640.png",
    category: "nature",
  },
  {
    id: "music-note",
    imageUrl:
      "https://cdn.pixabay.com/photo/2014/04/03/10/32/music-311376_640.png",
    category: "music",
  },
  {
    id: "emoji-crown",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/03/31/15/41/crown-1293157_640.png",
    category: "emoji",
  },
  {
    id: "emoji-arrow",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/03/31/15/29/arrow-1293162_640.png",
    category: "emoji",
  },
  {
    id: "nature-bird",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/03/31/23/37/bird-1297727_640.png",
    category: "nature",
  },
];

const CATEGORY_LABELS: Record<StickerCategory, string> = {
  emoji: "이모지",
  nature: "자연",
  music: "음악",
  recent: "최근 사용",
};

// 스티커 조작 모드 타입
type StickerMode = "move" | "rotate" | "resize";

export const DiaryDecorateDialog = ({
  open,
  onOpenChange,
  selectedCover,
  onSave,
}: DiaryDecorateDialogProps) => {
  const [stickers, setStickers] = useState<StickerItem[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(
    null
  );
  const [stickerDrawerOpen, setStickerDrawerOpen] = useState(false);
  const [history, setHistory] = useState<StickerItem[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedCategory, setSelectedCategory] =
    useState<StickerCategory>("emoji");
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

      // 무한대 값 확인
      if (!isFinite(x) || !isFinite(y)) {
        console.log("constrainPosition: 무한대 값 감지됨, 기본값으로 설정");
        return { x: 50, y: 50 }; // 기본값으로 중앙 위치 반환
      }

      // 컨테이너 크기가 유효한지 확인
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

      // 스티커의 실제 크기 계산 (기본 크기 64px에 scale 적용)
      const stickerWidth = 64 * scale;
      const stickerHeight = 64 * scale;
      console.log("스티커 크기:", stickerWidth, stickerHeight);

      // 컨테이너 크기 대비 스티커 크기의 비율 계산
      const stickerWidthPercent = (stickerWidth / currentContainerWidth) * 100;
      const stickerHeightPercent =
        (stickerHeight / currentContainerHeight) * 100;
      console.log(
        "스티커 크기 (%):",
        stickerWidthPercent,
        stickerHeightPercent
      );

      if (!isFinite(stickerWidthPercent) || !isFinite(stickerHeightPercent)) {
        console.log("스티커 크기 백분율이 무한대, 기본값으로 설정");
        return { x: 50, y: 50 };
      }

      // 스티커의 중심점이 이동할 수 있는 최소/최대 범위 계산
      const minX = stickerWidthPercent / 2;
      const maxX = 100 - stickerWidthPercent / 2;
      const minY = stickerHeightPercent / 2;
      const maxY = 100 - stickerHeightPercent / 2;
      console.log("위치 제한 (min/max):");
      console.log("minX:", minX, "maxX:", maxX);
      console.log("minY:", minY, "maxY:", maxY);

      // 위치 제한 적용
      const constrainedX = Math.max(minX, Math.min(maxX, x));
      const constrainedY = Math.max(minY, Math.min(maxY, y));
      console.log("제한된 위치 (계산됨):", constrainedX, constrainedY);

      // 무한대 값 다시 확인
      const finalX = isFinite(constrainedX) ? constrainedX : 50;
      const finalY = isFinite(constrainedY) ? constrainedY : 50;
      console.log("최종 반환 위치:", { x: finalX, y: finalY });

      return { x: finalX, y: finalY };
    },
    [containerSize] // containerSize가 변경될 때마다 이 함수도 새로 생성되도록 의존성 추가
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
              const centerX = containerRect.left + containerRect.width / 2;
              const centerY = containerRect.top + containerRect.height / 2;

              const startAngle = Math.atan2(
                dragStartRef.current.y - centerY,
                dragStartRef.current.x - centerX
              );
              const currentAngle = Math.atan2(
                clientY - centerY,
                clientX - centerX
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
              const startDistance = Math.sqrt(
                Math.pow(
                  dragStartRef.current.y -
                    containerRect.top -
                    containerRect.height / 2,
                  2
                ) +
                  Math.pow(
                    dragStartRef.current.x -
                      containerRect.left -
                      containerRect.width / 2,
                    2
                  )
              );

              const currentDistance = Math.sqrt(
                Math.pow(
                  clientY - containerRect.top - containerRect.height / 2,
                  2
                ) +
                  Math.pow(
                    clientX - containerRect.left - containerRect.width / 2,
                    2
                  )
              );

              const scaleFactor =
                startDistance === 0 ? 1 : currentDistance / startDistance;
              const newScale = Math.max(
                0.5,
                Math.min(3, stickerInitialStateRef.current!.scale * scaleFactor)
              );
              console.log("새 크기:", newScale);

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

  // 변경사항 저장 함수
  const handleSave = () => {
    onSave?.(stickers);
    onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={
          "w-full h-full max-w-none p-0 m-0 rounded-none flex flex-col"
        }
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        aria-labelledby={"dialog-title"}
        aria-describedby={"dialog-description"}
      >
        {/* <VisuallyHidden> */}
        {/* <DialogTitle id={"dialog-title"}>일기장 꾸미기</DialogTitle>
        <DialogDescription id={"dialog-description"}>
          다이어리 커버를 스티커로 꾸며보세요.
        </DialogDescription> */}
        {/* </VisuallyHidden> */}

        {/* 헤더 - 고정 */}
        <div className={"bg-white z-50"}>
          <div className={"flex justify-between items-center p-4"}>
            <button
              className={"p-2 rounded-full hover:bg-gray-100"}
              onClick={() => onOpenChange(false)}
            >
              <FaArrowLeft />
            </button>
            <h3 className={"text-lg font-medium"}>일기장 꾸미기</h3>
            <button
              className={"p-2 rounded-full hover:bg-gray-100"}
              onClick={handleSave}
            >
              <FaSave />
            </button>
          </div>
        </div>

        {/* 메인 컨텐츠 - 스크롤 가능 영역 */}
        <div className={"flex-1 overflow-auto"}>
          <div className={"flex items-center justify-center p-10"}>
            <div
              ref={containerRef}
              className={
                "relative w-full max-w-[min(60vh,400px)] aspect-[3/4] bg-gray-200"
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
                  className={`absolute transition-shadow ${
                    selectedStickerId === sticker.id ? "shadow-lg" : ""
                  }`}
                  style={{
                    left: `${sticker.x}%`,
                    top: `${sticker.y}%`,
                    transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
                    zIndex: sticker.zIndex || 1,
                    touchAction: "none",
                    pointerEvents: "auto",
                  }}
                  onClick={(e) => handleStickerSelect(sticker.id, e)}
                >
                  {/* 스티커 본체 */}
                  <div
                    className={"relative touch-none"}
                    onMouseDown={(e) => handleDragStart(e, sticker.id, "move")}
                    onTouchStart={(e) => handleDragStart(e, sticker.id, "move")}
                  >
                    <img
                      src={sticker.imageUrl}
                      alt={"스티커"}
                      className={"w-16 h-16 pointer-events-none"}
                      draggable={false}
                    />

                    {/* 선택된 스티커일 경우에만 컨트롤 표시 */}
                    {selectedStickerId === sticker.id && (
                      <>
                        {/* 삭제 버튼 */}
                        <div
                          className={
                            "absolute w-6 h-6 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-500 hover:text-white text-red-500 z-20"
                          }
                          style={{
                            top: `-8px`,
                            right: `-8px`,
                            transform: `scale(${1 / sticker.scale})`,
                            transformOrigin: "center",
                            pointerEvents: "auto",
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
                            "absolute w-6 h-6 bg-white rounded-full shadow flex items-center justify-center cursor-grab touch-none z-10"
                          }
                          style={{
                            top: `-32px`,
                            left: `50%`,
                            transform: `translateX(-50%) scale(${1 / sticker.scale})`,
                            transformOrigin: "center",
                            pointerEvents: "auto",
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

                        {/* 크기 조절 컨트롤 */}
                        <div
                          className={
                            "absolute w-6 h-6 bg-white rounded-full shadow flex items-center justify-center cursor-nwse-resize touch-none z-10"
                          }
                          style={{
                            bottom: `-8px`,
                            right: `-8px`,
                            transform: `scale(${1 / sticker.scale})`,
                            transformOrigin: "center",
                            pointerEvents: "auto",
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
                          <RiZoomInLine size={14} />
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
              >
                <FaArrowLeft />
              </button>
              <button
                className={
                  "p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                }
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
              >
                <FaArrowRight />
              </button>
            </div>
            <button
              className={"p-2 rounded-full hover:bg-gray-100"}
              onClick={() => setStickerDrawerOpen(true)}
            >
              <FaSmile />
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
            className={"min-h-[70vh] px-4 pb-8"}
            aria-labelledby={"drawer-title"}
            aria-describedby={"drawer-description"}
          >
            {/* <VisuallyHidden> */}
            <DialogTitle id={"drawer-title"}>스티커 선택</DialogTitle>
            <DialogDescription id={"drawer-description"}>
              꾸미기에 사용할 스티커를 선택하세요.
            </DialogDescription>
            {/* </VisuallyHidden> */}
            {/* 카테고리 선택 */}
            <div
              className={
                "flex justify-between border-b mb-4 overflow-x-auto py-2 sticky top-0 bg-white"
              }
              role={"tablist"}
            >
              {Object.entries(CATEGORY_LABELS).map(([category, label]) => (
                <button
                  key={category}
                  role={"tab"}
                  aria-selected={selectedCategory === category}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-emerald-100 text-emerald-700"
                      : "text-gray-600"
                  }`}
                  onClick={() =>
                    setSelectedCategory(category as StickerCategory)
                  }
                >
                  {label}
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
                          "aspect-square p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
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
                      className={
                        "aspect-square p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                      }
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
      </DialogContent>
    </Dialog>
  );
};
