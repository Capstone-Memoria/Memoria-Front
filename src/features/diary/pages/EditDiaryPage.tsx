import api from "@/api";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import Tiptap from "@/components/editor/Tiptap";
import Page from "@/components/page/Page";
import ImageUploader from "@/features/diary/components/ImageUploader";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";

const EditDiaryPage = () => {
  const navigate = useNavigate();
  const { diaryBookId, diaryId } = useParams<{
    diaryBookId: string;
    diaryId: string;
  }>();

  const [diaryTitle, setDiaryTitle] = useState("");
  const [content, setContent] = useState("");
  const [toAddImages, setToAddImages] = useState<File[]>([]);
  const [toDeleteImageIds, setToDeleteImageIds] = useState<string[]>([]);
  const nodeRef = useRef<HTMLDivElement>(null);

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

  /* Mutations */
  const updateMutation = useMutation({
    mutationFn: () =>
      api.diary.updateDiary(Number(diaryBookId), Number(diaryId), {
        title: diaryTitle,
        content: content,
        toAddImages: toAddImages, // 새로 추가된 이미지
        toDeleteImageIds: toDeleteImageIds, // 삭제될 이미지 ID
      }),
    onSuccess: () => {
      navigate(`/diary/${diaryBookId}/diary/${diaryId}`, { replace: true });
    },
  });

  const handleSubmit = () => {
    updateMutation.mutate();
  };

  const handleImagesChange = ({
    addedImages,
    deletedImageIds,
  }: {
    addedImages: File[];
    deletedImageIds: string[];
  }) => {
    setToAddImages(addedImages);
    setToDeleteImageIds(deletedImageIds);
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
      <SwitchTransition mode={"out-in"}>
        <CSSTransition
          key={updateMutation.isPending ? "loading" : "content"}
          timeout={300}
          classNames={"fade"}
          nodeRef={nodeRef}
        >
          <div ref={nodeRef} className={"flex-1"}>
            {updateMutation.isPending ? (
              <div
                className={
                  "flex flex-col items-center justify-center h-full text-lg font-medium gap-4"
                }
              >
                <FiUploadCloud
                  className={"text-6xl animate-bounce text-gray-600"}
                />
                <div className={"text-lg text-gray-600"}>
                  일기를 수정 중이에요
                </div>
              </div>
            ) : (
              <Page.Content className={"flex flex-col gap-6 flex-1"}>
                {isDiaryLoading || isDiaryBookLoading ? (
                  <div className={"space-y-6"}>
                    <div
                      className={"h-12 bg-gray-200 animate-pulse rounded-3xl"}
                    ></div>
                    <div
                      className={"h-8 bg-gray-200 animate-pulse rounded w-3/4"}
                    ></div>
                    <div className={"flex-1 space-y-2"}>
                      <div
                        className={
                          "h-4 bg-gray-200 animate-pulse rounded w-full"
                        }
                      ></div>
                      <div
                        className={
                          "h-4 bg-gray-200 animate-pulse rounded w-full"
                        }
                      ></div>
                      <div
                        className={
                          "h-4 bg-gray-200 animate-pulse rounded w-5/6"
                        }
                      ></div>
                      <div
                        className={
                          "h-4 bg-gray-200 animate-pulse rounded w-2/3"
                        }
                      ></div>
                      <div
                        className={
                          "h-4 bg-gray-200 animate-pulse rounded w-full"
                        }
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
                    <ImageUploader
                      initialImages={diaryData?.images}
                      onImagesChange={handleImagesChange}
                    />
                    <div className={"flex-1 rounded-lg"}>
                      <Tiptap
                        content={content}
                        onContentUpdate={(content) => setContent(content)}
                      />
                    </div>
                  </>
                )}
              </Page.Content>
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </Page.Container>
  );
};

export default EditDiaryPage;
