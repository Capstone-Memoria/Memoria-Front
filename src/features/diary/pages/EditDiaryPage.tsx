import api from "@/api";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import Tiptap from "@/components/editor/Tiptap";
import Page from "@/components/page/Page";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

const EditDiaryPage = () => {
  const navigate = useNavigate();
  const { diaryBookId, diaryId } = useParams<{
    diaryBookId: string;
    diaryId: string;
  }>();

  const [isMenuOpen, setIsMenuOpen] = useState(false); // 일기장 선택 Drawer 상태 (수정 페이지에서는 필요 없을 수 있지만 일단 유지)
  const [diaryTitle, setDiaryTitle] = useState("");
  const [content, setContent] = useState("");

  /* Server-State */
  const { data: diaryData, isLoading: isDiaryLoading } = useQuery({
    queryKey: ["fetchDiary", diaryBookId, diaryId],
    queryFn: () => api.diary.fetchDiary(Number(diaryBookId), Number(diaryId)),
    enabled: !!diaryBookId && !!diaryId,
  });

  const { data: diaryBookData, isLoading: isDiaryBookLoading } = useQuery({
    queryKey: ["fetchMyDiaryBook"],
    queryFn: () =>
      api.diaryBook.fetchMyDiaryBook({
        size: 10,
        page: 1,
      }),
  });

  /* Effects */
  useEffect(() => {
    if (diaryData) {
      setDiaryTitle(diaryData.title);
      setContent(diaryData.content);
    }
  }, [diaryData]);

  /* Memos */
  const canSubmit = useMemo(() => {
    return !!diaryTitle && diaryTitle.trim() !== "";
  }, [diaryTitle]);

  const selectedDiaryBook = useMemo(() => {
    return diaryBookData?.content.find(
      (book) => book.id === diaryData?.diaryBookId
    );
  }, [diaryBookData, diaryData]);

  const openDrawer = () => {
    setIsMenuOpen(true); // 일기장 변경은 지원하지 않으므로 이 기능은 필요 없을 수 있습니다.
  };

  /* Mutations */
  const updateMutation = useMutation({
    mutationFn: () =>
      api.diary.updateDiary(Number(diaryBookId), Number(diaryId), {
        title: diaryTitle,
        content: content,
      }),
    onSuccess: () => {
      navigate(`/diary/${diaryBookId}/diary/${diaryId}`);
    },
  });

  const handleSubmit = () => {
    updateMutation.mutate();
  };

  return (
    <Page.Container className={"h-full flex flex-col"}>
      <Page.Header>
        <div className={"text-2xl pr-4"}>
          <MdOutlineKeyboardBackspace onClick={() => navigate(-1)} />
        </div>
        <div className={"text-lg"}>일기 수정하기</div>
        <Button
          variant={"text"}
          disabled={!canSubmit || isDiaryLoading || updateMutation.isPending}
          size={"sm"}
          className={"text-sm font-normal"}
          onClick={handleSubmit}
        >
          완료
        </Button>
      </Page.Header>
      <Page.Content className={"flex flex-col gap-6 flex-1"}>
        {isDiaryLoading || isDiaryBookLoading ? (
          <div className={"space-y-6"}>
            {/* 일기장 정보 로딩 스켈레톤 */}
            <div className={"h-12 bg-gray-200 animate-pulse rounded-3xl"}></div>

            {/* 제목 로딩 스켈레톤 */}
            <div
              className={"h-8 bg-gray-200 animate-pulse rounded w-3/4"}
            ></div>

            {/* 내용 로딩 스켈레톤 */}
            <div className={"flex-1 space-y-2"}>
              <div
                className={"h-4 bg-gray-200 animate-pulse rounded w-full"}
              ></div>
              <div
                className={"h-4 bg-gray-200 animate-pulse rounded w-full"}
              ></div>
              <div
                className={"h-4 bg-gray-200 animate-pulse rounded w-5/6"}
              ></div>
              <div
                className={"h-4 bg-gray-200 animate-pulse rounded w-2/3"}
              ></div>
              <div
                className={"h-4 bg-gray-200 animate-pulse rounded w-full"}
              ></div>
            </div>
          </div>
        ) : (
          <>
            <div
              className={
                "w-full flex justify-between items-center mt-2 bg-gray-100 rounded-3xl px-4 py-2"
              }
            >
              {selectedDiaryBook?.title || "일기장 정보 없음"}
            </div>
            <div className={"flex flex-col gap-2"}>
              <Input
                className={"w-full text-2xl"}
                placeholder={"일기 제목"}
                value={diaryTitle}
                onChange={(e) => setDiaryTitle(e.target.value)}
              />
            </div>
            <div className={"flex-1 rounded-lg"}>
              <Tiptap
                content={content}
                onContentUpdate={(content) => setContent(content)}
              />
            </div>
          </>
        )}
      </Page.Content>
    </Page.Container>
  );
};

export default EditDiaryPage;
