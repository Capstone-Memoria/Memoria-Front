import * as aiApi from "@/api/ai";
import Button from "@/components/base/Button";
import Modal from "@/components/base/Modal";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaBook,
  FaCalendarAlt,
  FaClock,
  FaMusic,
  FaPlay,
  FaTrash,
} from "react-icons/fa";

// ai.ts에서 타입 import
type QueueItemResponse = Awaited<
  ReturnType<typeof aiApi.getMusicQueue>
>["pendingItems"][0];

const MusicQueueTab = () => {
  const queryClient = useQueryClient();
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<string | null>(
    null
  );

  // 음악 큐 데이터 조회
  const { data: queueData, isLoading } = useQuery({
    queryKey: ["musicQueue"],
    queryFn: aiApi.getMusicQueue,
    refetchInterval: 2000, // 2초마다 자동 새로고침
  });

  // 순서 변경 뮤테이션
  const reorderMutation = useMutation({
    mutationFn: aiApi.reorderMusicQueueItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["musicQueue"] });
    },
  });

  // 삭제 뮤테이션
  const deleteMutation = useMutation({
    mutationFn: aiApi.deleteMusicQueueItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["musicQueue"] });
      setDeleteConfirmItem(null);
    },
  });

  // 순서 변경 핸들러
  const handleReorder = (itemUuid: string, direction: "up" | "down") => {
    if (!queueData) return;

    const allItems = [...queueData.pendingItems];
    const currentIndex = allItems.findIndex((item) => item.uuid === itemUuid);

    if (currentIndex === -1) return;

    let newPosition: number;
    if (direction === "up" && currentIndex > 0) {
      newPosition = currentIndex - 1;
    } else if (direction === "down" && currentIndex < allItems.length - 1) {
      newPosition = currentIndex + 1;
    } else {
      return; // 이동할 수 없는 경우
    }

    reorderMutation.mutate({
      itemUuid,
      newPosition,
    });
  };

  // 삭제 확인 핸들러
  const handleDelete = (itemUuid: string) => {
    setDeleteConfirmItem(itemUuid);
  };

  // 삭제 실행
  const confirmDelete = () => {
    if (deleteConfirmItem) {
      deleteMutation.mutate(deleteConfirmItem);
    }
  };

  // 시간 포맷팅
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("ko-KR");
  };

  // 감정 한글 변환
  const getEmotionText = (emotion?: string) => {
    const emotionMap: Record<string, string> = {
      HAPPY: "기쁨",
      SAD: "슬픔",
      ANGRY: "화남",
      DISGUSTED: "혐오",
      RELAXED: "편안함",
      BORED: "지루함",
      LOVING: "사랑",
      KIND: "친절함",
      AMBITIOUS: "야망",
      SUPERSAD: "매우 슬픔",
      BAD: "나쁨",
      SICK: "아픔",
    };
    return emotion ? emotionMap[emotion] || emotion : "알 수 없음";
  };

  // 큐 아이템 렌더링
  const renderQueueItem = (
    item: QueueItemResponse,
    index: number,
    isProcessing: boolean = false
  ) => (
    <motion.div
      key={item.uuid}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "bg-white p-4 rounded-lg shadow-sm border",
        isProcessing ? "border-yellow-300 bg-yellow-50" : "border-gray-200"
      )}
    >
      <div className={"flex items-start justify-between gap-4"}>
        <div className={"flex items-start gap-3 flex-1"}>
          <div
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
              isProcessing ? "bg-yellow-100" : "bg-purple-100"
            )}
          >
            {isProcessing ? (
              <FaPlay className={"text-yellow-600"} />
            ) : (
              <FaMusic className={"text-purple-600"} />
            )}
          </div>

          <div className={"flex-1 min-w-0"}>
            {/* 일기 기본 정보 */}
            <div className={"flex items-center gap-2 mb-2"}>
              <FaBook className={"text-gray-500 text-sm"} />
              <span className={"font-semibold text-gray-900 truncate"}>
                {item.diary?.title || `일기 #${item.diary?.id}`}
              </span>
              <span
                className={cn(
                  "text-xs px-2 py-1 rounded-full flex-shrink-0",
                  isProcessing
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-purple-100 text-purple-700"
                )}
              >
                {isProcessing ? "처리중" : "대기중"}
              </span>
              {!isProcessing && (
                <span className={"text-xs text-gray-500 flex-shrink-0"}>
                  #{index + 1}
                </span>
              )}
            </div>

            {/* 일기 상세 정보 */}
            <div className={"text-sm text-gray-600 space-y-1"}>
              <div className={"flex items-center gap-2"}>
                <FaCalendarAlt className={"text-gray-400 text-xs"} />
                <span>
                  일기 작성:{" "}
                  {item.diary?.createdAt
                    ? new Date(
                        item.diary.createdAt.toString()
                      ).toLocaleDateString("ko-KR")
                    : "알 수 없음"}
                </span>
              </div>
              {item.diary?.emotion && (
                <div className={"flex items-center gap-2"}>
                  <span className={"text-xs"}>😊</span>
                  <span>감정: {getEmotionText(item.diary.emotion)}</span>
                </div>
              )}
              {item.diary?.content && (
                <p
                  className={"text-gray-500 text-xs overflow-hidden"}
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                    lineHeight: "1.4em",
                    maxHeight: "2.8em",
                  }}
                >
                  {item.diary.content}
                </p>
              )}

              {/* 기술적 정보 */}
              <div className={"pt-2 border-t border-gray-100 space-y-1"}>
                <p>요청 시간: {formatTime(item.requestedAt)}</p>
                <p>
                  UUID: <span className={"font-mono text-xs"}>{item.uuid}</span>
                </p>
                {item.retryCountDown > 0 && (
                  <p className={"text-orange-600"}>
                    재시도 횟수: {item.retryCountDown}
                  </p>
                )}
                {isProcessing && item.processingNodeUrl && (
                  <p>
                    처리 노드:{" "}
                    <span className={"font-mono text-xs"}>
                      {item.processingNodeUrl}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className={"flex items-center gap-2 flex-shrink-0"}>
          {!isProcessing && (
            <>
              <Button
                size={"sm"}
                variant={"secondary"}
                onClick={() => handleReorder(item.uuid, "up")}
                disabled={index === 0 || reorderMutation.isPending}
                className={"p-2"}
              >
                <FaArrowUp className={"text-gray-600"} />
              </Button>
              <Button
                size={"sm"}
                variant={"secondary"}
                onClick={() => handleReorder(item.uuid, "down")}
                disabled={
                  index === (queueData?.pendingItems.length ?? 0) - 1 ||
                  reorderMutation.isPending
                }
                className={"p-2"}
              >
                <FaArrowDown className={"text-gray-600"} />
              </Button>
            </>
          )}
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={() => handleDelete(item.uuid)}
            disabled={deleteMutation.isPending}
            className={"p-2 text-red-600 hover:bg-red-50"}
          >
            <FaTrash />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={"space-y-6"}>
      {/* 헤더 */}
      <div>
        <h2 className={"text-xl font-bold text-gray-900"}>음악 생성 큐 관리</h2>
        <p className={"text-gray-600 mt-1"}>
          음악 생성 작업의 큐를 관리하고 순서를 조정할 수 있습니다
        </p>
      </div>

      {/* 통계 카드 */}
      <div className={"grid grid-cols-2 gap-4"}>
        <div className={"bg-white p-4 rounded-lg shadow-sm border"}>
          <div className={"flex items-center justify-between"}>
            <div>
              <p className={"text-sm text-gray-600"}>대기중인 작업</p>
              <p className={"text-2xl font-bold text-purple-600"}>
                {queueData?.totalPendingCount ?? 0}
              </p>
            </div>
            <FaClock className={"text-purple-500 text-xl"} />
          </div>
        </div>
        <div className={"bg-white p-4 rounded-lg shadow-sm border"}>
          <div className={"flex items-center justify-between"}>
            <div>
              <p className={"text-sm text-gray-600"}>처리중인 작업</p>
              <p className={"text-2xl font-bold text-yellow-600"}>
                {queueData?.totalProcessingCount ?? 0}
              </p>
            </div>
            <FaPlay className={"text-yellow-500 text-xl"} />
          </div>
        </div>
      </div>

      {/* 처리중인 작업들 */}
      {queueData && queueData.processingItems.length > 0 && (
        <div className={"space-y-3"}>
          <h3
            className={
              "text-lg font-semibold text-gray-900 flex items-center gap-2"
            }
          >
            <FaPlay className={"text-yellow-500"} />
            처리중인 작업 ({queueData.processingItems.length})
          </h3>
          <div className={"space-y-3"}>
            <AnimatePresence>
              {queueData.processingItems.map((item, index) =>
                renderQueueItem(item, index, true)
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* 대기중인 작업들 */}
      <div className={"space-y-3"}>
        <h3
          className={
            "text-lg font-semibold text-gray-900 flex items-center gap-2"
          }
        >
          <FaClock className={"text-purple-500"} />
          대기중인 작업 ({queueData?.totalPendingCount ?? 0})
        </h3>

        {isLoading ? (
          <div className={"space-y-3"}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={
                  "bg-white p-4 rounded-lg shadow-sm border animate-pulse"
                }
              >
                <div className={"flex items-center justify-between"}>
                  <div className={"flex items-center gap-3"}>
                    <div className={"w-10 h-10 bg-gray-200 rounded-lg"}></div>
                    <div className={"space-y-2"}>
                      <div className={"h-4 bg-gray-200 rounded w-32"}></div>
                      <div className={"h-3 bg-gray-200 rounded w-48"}></div>
                    </div>
                  </div>
                  <div className={"flex gap-2"}>
                    <div className={"w-8 h-8 bg-gray-200 rounded"}></div>
                    <div className={"w-8 h-8 bg-gray-200 rounded"}></div>
                    <div className={"w-8 h-8 bg-gray-200 rounded"}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !queueData || queueData.pendingItems.length === 0 ? (
          <div
            className={"bg-white p-8 rounded-lg shadow-sm border text-center"}
          >
            <FaMusic className={"mx-auto text-4xl text-gray-400 mb-3"} />
            <p className={"text-gray-600"}>
              대기중인 음악 생성 작업이 없습니다
            </p>
            <p className={"text-sm text-gray-500 mt-1"}>
              새로운 일기를 작성하면 음악 생성 작업이 큐에 추가됩니다
            </p>
          </div>
        ) : (
          <div className={"space-y-3"}>
            <AnimatePresence>
              {queueData.pendingItems.map((item, index) =>
                renderQueueItem(item, index, false)
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      <Modal
        open={deleteConfirmItem !== null}
        onClose={() => setDeleteConfirmItem(null)}
      >
        <div className={"p-6 space-y-4"}>
          <div className={"text-center"}>
            <FaTrash className={"mx-auto text-4xl text-red-500 mb-3"} />
            <h3 className={"text-lg font-semibold mb-2"}>작업 삭제</h3>
            <p className={"text-gray-600"}>
              정말로 이 음악 생성 작업을 큐에서 삭제하시겠습니까?
            </p>
            {deleteConfirmItem &&
              (() => {
                const item = [
                  ...(queueData?.pendingItems || []),
                  ...(queueData?.processingItems || []),
                ].find((item) => item.uuid === deleteConfirmItem);
                return item ? (
                  <div className={"mt-3 p-3 bg-gray-50 rounded-lg"}>
                    <p className={"font-medium text-gray-900"}>
                      {item.diary?.title || `일기 #${item.diary?.id}`}
                    </p>
                    <p className={"text-sm text-gray-500 mt-1 font-mono"}>
                      UUID: {deleteConfirmItem}
                    </p>
                  </div>
                ) : (
                  <p className={"text-sm text-gray-500 mt-2 font-mono"}>
                    UUID: {deleteConfirmItem}
                  </p>
                );
              })()}
          </div>

          <div className={"flex gap-3"}>
            <Button
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              variant={"danger"}
              className={"flex-1"}
            >
              {deleteMutation.isPending ? "삭제 중..." : "삭제"}
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => setDeleteConfirmItem(null)}
              className={"flex-1"}
            >
              취소
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MusicQueueTab;
