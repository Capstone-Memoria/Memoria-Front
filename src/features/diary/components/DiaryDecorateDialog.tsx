import { StickerItem } from "@/api/diary-book";
import DiaryCover from "@/components/diary/DiaryCover";
import {
  DiaryCoverItem,
  PresetDiaryCoverItem,
  UploadedDiaryCoverItem,
} from "@/components/diary/DiaryCoverCarousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
        setContainerSize({ width, height });
      }
    };

    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);

    return () => {
      window.removeEventListener("resize", updateContainerSize);
    };
  }, []);

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
  const constrainPosition = (
    x: number,
    y: number,
    scale: number = 1
  ): { x: number; y: number } => {
    // 스티커의 실제 크기 계산 (기본 크기 64px에 scale 적용)
    const stickerWidth = 64 * scale;
    const stickerHeight = 64 * scale;

    // 컨테이너 크기 대비 스티커 크기의 비율 계산
    const stickerWidthPercent = (stickerWidth / containerSize.width) * 100;
    const stickerHeightPercent = (stickerHeight / containerSize.height) * 100;

    // 스티커의 중심점이 이동할 수 있는 최소/최대 범위 계산
    const minX = stickerWidthPercent / 2;
    const maxX = 100 - stickerWidthPercent / 2;
    const minY = stickerHeightPercent / 2;
    const maxY = 100 - stickerHeightPercent / 2;

    // 위치 제한 적용
    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y)),
    };
  };

  // 스티커 선택 함수
  const handleStickerSelect = (
    id: string,
    e: React.MouseEvent | React.TouchEvent
  ) => {
    e.stopPropagation();
    setSelectedStickerId(id);
    // 선택된 스티커의 z-index를 최상위로 변경
    setStickers(
      stickers.map((sticker) =>
        sticker.id === id
          ? {
              ...sticker,
              zIndex: Math.max(...stickers.map((s) => s.zIndex), 0) + 1,
            }
          : sticker
      )
    );
  };

  // 스티커 삭제 함수
  const handleDeleteSticker = (id: string, e: React.MouseEvent) => {
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
      if ("touches" in e) {
        // 터치 이벤트의 경우 preventDefault 호출하지 않음
        e.stopPropagation();
      } else {
        // 마우스 이벤트의 경우에만 preventDefault 호출
        e.preventDefault();
        e.stopPropagation();
      }

      setIsDragging(true);
      setSelectedStickerId(stickerId);
      setDragMode(mode);

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

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
      }
    },
    [stickers]
  );

  // 드래그 이동 핸들러
  const handleDragMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent | TouchEvent | MouseEvent) => {
      if (
        !isDragging ||
        !selectedStickerId ||
        !dragMode ||
        !stickerInitialStateRef.current
      )
        return;

      if ("stopPropagation" in e) {
        e.stopPropagation();
      }

      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY =
        "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      const deltaX = clientX - dragStartRef.current.x;
      const deltaY = clientY - dragStartRef.current.y;

      const containerElement = containerRef.current;
      if (!containerElement) return;

      const containerRect = containerElement.getBoundingClientRect();

      const moveFactorX = 100 / containerRect.width;
      const moveFactorY = 100 / containerRect.height;

      setStickers(
        stickers.map((sticker) => {
          if (sticker.id !== selectedStickerId) return sticker;

          switch (dragMode) {
            case "move": {
              const newX =
                stickerInitialStateRef.current!.x + deltaX * moveFactorX;
              const newY =
                stickerInitialStateRef.current!.y + deltaY * moveFactorY;

              // 스티커가 컨테이너를 벗어나지 않도록 제한
              const { x, y } = constrainPosition(newX, newY, sticker.scale);
              return { ...sticker, x, y };
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

              return {
                ...sticker,
                rotation: stickerInitialStateRef.current!.rotation + angleDelta,
              };
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

              // 크기 변경 시에도 위치 제한 적용
              const { x, y } = constrainPosition(
                sticker.x,
                sticker.y,
                newScale
              );
              return { ...sticker, scale: newScale, x, y };
            }

            default:
              return sticker;
          }
        })
      );
    },
    [isDragging, selectedStickerId, dragMode, stickers]
  );

  // 드래그 종료 핸들러
  const handleDragEnd = useCallback(
    (e: React.MouseEvent | React.TouchEvent | TouchEvent | MouseEvent) => {
      if ("stopPropagation" in e) {
        e.stopPropagation();
      }

      if (isDragging && selectedStickerId) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push([...stickers]);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }

      setIsDragging(false);
      setDragMode(null);
      stickerInitialStateRef.current = null;
    },
    [stickers, history, historyIndex]
  );

  // 전역 이벤트 리스너
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMove = (e: TouchEvent | MouseEvent) => {
        handleDragMove(e);
      };

      const handleGlobalEnd = (e: TouchEvent | MouseEvent) => {
        handleDragEnd(e);
      };

      // 터치 이벤트
      document.addEventListener("touchmove", handleGlobalMove, {
        passive: true,
      });
      document.addEventListener("touchend", handleGlobalEnd);

      // 마우스 이벤트
      document.addEventListener("mousemove", handleGlobalMove);
      document.addEventListener("mouseup", handleGlobalEnd);

      return () => {
        document.removeEventListener("touchmove", handleGlobalMove);
        document.removeEventListener("touchend", handleGlobalEnd);
        document.removeEventListener("mousemove", handleGlobalMove);
        document.removeEventListener("mouseup", handleGlobalEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

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
      >
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
              className={"relative w-full max-w-[min(60vh,400px)] aspect-[3/4]"}
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
                    zIndex: sticker.zIndex,
                  }}
                  onClick={(e) => handleStickerSelect(sticker.id, e)}
                >
                  {/* 스티커 본체 */}
                  <div
                    className={"relative touch-none"}
                    onMouseDown={(e) => handleDragStart(e, sticker.id, "move")}
                    onTouchStart={(e) => handleDragStart(e, sticker.id, "move")}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
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
                            "absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-500 hover:text-white text-red-500 z-20 transform-none"
                          }
                          onClick={(e) => handleDeleteSticker(sticker.id, e)}
                        >
                          <FaTimes size={12} />
                        </div>

                        {/* 회전 컨트롤 */}
                        <div
                          className={
                            "absolute -top-8 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center cursor-grab touch-none z-10 scale-100"
                          }
                          onMouseDown={(e) =>
                            handleDragStart(e, sticker.id, "rotate")
                          }
                          onTouchStart={(e) =>
                            handleDragStart(e, sticker.id, "rotate")
                          }
                          onTouchMove={handleDragMove}
                          onTouchEnd={handleDragEnd}
                        >
                          <MdRotate90DegreesCcw size={14} />
                        </div>

                        {/* 크기 조절 컨트롤 */}
                        <div
                          className={
                            "absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center cursor-nwse-resize touch-none z-10 scale-100"
                          }
                          onMouseDown={(e) =>
                            handleDragStart(e, sticker.id, "resize")
                          }
                          onTouchStart={(e) =>
                            handleDragStart(e, sticker.id, "resize")
                          }
                          onTouchMove={handleDragMove}
                          onTouchEnd={handleDragEnd}
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
        <Drawer open={stickerDrawerOpen} onOpenChange={setStickerDrawerOpen}>
          <DrawerContent className={"min-h-[70vh] px-4 pb-8"}>
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
                      <button
                        key={sticker!.id}
                        className={
                          "aspect-square p-2 rounded-lg hover:bg-gray-100"
                        }
                        onClick={() => addSticker(sticker!)}
                        aria-label={`${sticker!.category} 스티커 추가`}
                      >
                        <img
                          src={sticker!.imageUrl}
                          alt={"스티커"}
                          className={"w-full h-full object-contain"}
                        />
                      </button>
                    ))
                : STICKER_DATA.filter(
                    (s) => s.category === selectedCategory
                  ).map((sticker) => (
                    <button
                      key={sticker.id}
                      className={
                        "aspect-square p-2 rounded-lg hover:bg-gray-100"
                      }
                      onClick={() => addSticker(sticker)}
                      aria-label={`${sticker.category} 스티커 추가`}
                    >
                      <img
                        src={sticker.imageUrl}
                        alt={"스티커"}
                        className={"w-full h-full object-contain"}
                      />
                    </button>
                  ))}
            </div>
          </DrawerContent>
        </Drawer>
      </DialogContent>
    </Dialog>
  );
};
