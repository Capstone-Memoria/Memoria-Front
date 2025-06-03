import api from "@/api";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import Tiptap from "@/components/editor/Tiptap";
import Page from "@/components/page/Page";
import EmotionDrawer from "@/features/diary/components/EmotionDrawer";
import ImageSlider from "@/features/diary/components/ImageSlider";
import WriteDiaryToolbar from "@/features/diary/components/WriteDiaryToolbar";
import { EmotionType } from "@/models/Diary";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Editor } from "@tiptap/react";
import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import {
  MdOutlineAddReaction,
  MdOutlineKeyboardBackspace,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";

// 텍스트 정렬 상태 타입
export type TextAlignment = "left" | "center" | "right";

const EditDiaryPage = () => {
  const navigate = useNavigate();
  const { diaryBookId, diaryId } = useParams<{
    diaryBookId: string;
    diaryId: string;
  }>();

  const [diaryTitle, setDiaryTitle] = useState("");
  const [content, setContent] = useState("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<
    Array<{ url: string; file: File }>
  >([]);
  const [toDeleteImageIds, setToDeleteImageIds] = useState<string[]>([]);
  const nodeRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const [isEmotionDrawerOpen, setIsEmotionDrawerOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(
    null
  );
  const [diaryDate, setDiaryDate] = useState<DateTime | null>(null);

  // 키보드 및 에디터 포커스 상태
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  // iOS 여부 감지
  const isIOS = useMemo(() => {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as { MSStream: unknown }).MSStream
    );
  }, []);

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
        page: 0,
      }),
  });

  /* Effects */
  useEffect(() => {
    if (diaryData) {
      setDiaryTitle(diaryData.title);
      setContent(diaryData.content);
      if (diaryData.emotion) {
        setSelectedEmotion(diaryData.emotion as EmotionType);
      }
      if (diaryData.createdAt) {
        const diaryDateTime =
          typeof diaryData.createdAt === "string"
            ? DateTime.fromISO(diaryData.createdAt)
            : diaryData.createdAt;
        setDiaryDate(diaryDateTime);
      }
    }
  }, [diaryData]);

  // 에디터 포커스 상태 관리
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current;

      const handleFocus = () => {
        setIsEditorFocused(true);
        setIsKeyboardOpen(true);
      };

      const handleBlur = () => {
        setIsEditorFocused(false);
      };

      editor.on("focus", handleFocus);
      editor.on("blur", handleBlur);

      return () => {
        editor.off("focus", handleFocus);
        editor.off("blur", handleBlur);
      };
    }
  }, []);

  // 모바일 환경에서 화상 키보드 상태 감지
  useEffect(() => {
    // 화면 크기 변화 감지로 키보드 표시 여부 추정
    const handleResize = () => {
      // 현재 내부 화면 높이
      const currentInnerHeight = window.innerHeight;

      // visualViewport API가 지원되는 경우(모던 브라우저)
      if (window.visualViewport) {
        const isKeyboardLikelyVisible =
          window.visualViewport.height < currentInnerHeight * 0.75;
        if (isKeyboardLikelyVisible !== isKeyboardOpen) {
          setIsKeyboardOpen(isKeyboardLikelyVisible);
        }
      }
    };

    window.addEventListener("resize", handleResize);

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
    }

    return () => {
      window.removeEventListener("resize", handleResize);

      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      }
    };
  }, [isKeyboardOpen]);

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
        emotion: selectedEmotion || undefined,
        toAddImages: uploadedImages, // 새로 추가된 이미지
        toDeleteImageIds: toDeleteImageIds, // 삭제될 이미지 ID
      }),
    onSuccess: () => {
      navigate(`/diary-book/${diaryBookId}/diary/${diaryId}`, {
        replace: true,
      });
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
    setUploadedImages(addedImages);
    setToDeleteImageIds(deletedImageIds);
  };

  // 이미지 업로드 핸들러
  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  // 파일 변경 핸들러
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // 현재 에디터의 상태와 커서 위치 저장
    const currentEditor = editorRef.current;
    const wasEditorFocused = currentEditor?.isFocused;
    const cursorPosition = currentEditor?.state.selection.from;

    setUploadedImages((prev) => [...prev, ...files]);

    const newImagePreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setImagePreviewUrls((prev) => [...prev, ...newImagePreviews]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // 약간의 지연 후에 에디터의 상태와 커서 위치 복원
    setTimeout(() => {
      if (currentEditor && wasEditorFocused && cursorPosition) {
        currentEditor.commands.focus(cursorPosition);
      }
    }, 100);
  };

  // 이미지 제거 핸들러
  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(imagePreviewUrls[index].url);
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 에디터 내용 업데이트
  const handleContentUpdate = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  // 키보드 상태 토글 함수
  const toggleKeyboard = useCallback(() => {
    if (isKeyboardOpen || isEditorFocused) {
      // 키보드가 열려있으면 닫기
      editorRef.current?.commands.blur();
      setIsKeyboardOpen(false);
      setIsEditorFocused(false);

      // 모바일 환경에서 키보드를 확실히 닫기 위해 액티브 요소의 포커스를 해제
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    } else {
      // 키보드가 닫혀있으면 열기
      editorRef.current?.commands.focus();
      setIsKeyboardOpen(true);
      setIsEditorFocused(true);
    }
  }, [isKeyboardOpen, isEditorFocused]);

  // 이미지 경로 생성 함수
  const getEmotionImagePath = (emotionName: string) => {
    return new URL(
      `../../../assets/images/emotions/${emotionName.toLowerCase()}.png`,
      import.meta.url
    ).href;
  };

  const handleEmotionSelect = (emotionType: EmotionType) => {
    setSelectedEmotion(emotionType);
    setIsEmotionDrawerOpen(false);
  };

  return (
    <Page.Container className={"h-full flex flex-col overflow-x-hidden"}>
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
          <div ref={nodeRef} className={"flex-1 flex flex-col relative"}>
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
              <div className={"flex flex-col py-6 px-4 flex-1 gap-2"}>
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

                    {/* 날짜와 감정 선택 영역 */}
                    <div className={"flex items-center"}>
                      <div className={"text-black text-base"}>
                        {diaryDate
                          ?.setLocale("ko")
                          .toFormat("yyyy.MM.dd cccc") || ""}
                      </div>
                      <div
                        className={
                          "flex items-center justify-center w-fit px-1 py-0.5 rounded-md border border-gray-200 cursor-pointer ml-auto"
                        }
                        onClick={() => setIsEmotionDrawerOpen(true)}
                      >
                        {selectedEmotion ? (
                          <img
                            src={getEmotionImagePath(selectedEmotion)}
                            alt={"선택된 감정"}
                            className={"size-8 md:size-9 object-contain"}
                          />
                        ) : (
                          <MdOutlineAddReaction
                            className={"size-6 md:size-7 text-gray-500"}
                          />
                        )}
                      </div>
                    </div>

                    {/* 일기 제목 입력 */}
                    <Input
                      className={"w-full text-xl"}
                      placeholder={"일기 제목"}
                      value={diaryTitle}
                      onChange={(e) => setDiaryTitle(e.target.value)}
                    />

                    {/* 이미지 슬라이더 - 이미지가 있을 때만 표시 */}
                    {imagePreviewUrls.length > 0 && (
                      <ImageSlider
                        images={imagePreviewUrls}
                        onRemoveImage={handleRemoveImage}
                      />
                    )}

                    {/* 이미지 업로드 input (숨김) */}
                    <input
                      type={"file"}
                      accept={"image/*"}
                      multiple
                      onChange={handleFileChange}
                      className={"hidden"}
                      ref={fileInputRef}
                    />

                    {/* 에디터 */}
                    <div
                      className={"flex-1 rounded-lg mt-1"}
                      ref={editorContainerRef}
                    >
                      <Tiptap
                        onEditorReady={(editor) => {
                          editorRef.current = editor;
                        }}
                        content={content}
                        placeholder={"입력하세요."}
                        onContentUpdate={handleContentUpdate}
                      />
                    </div>

                    {/* 하단 툴바 */}
                    <WriteDiaryToolbar>
                      <WriteDiaryToolbar.ButtonGroup>
                        <WriteDiaryToolbar.ImageButton
                          onClick={handleImageUploadClick}
                        />
                        <WriteDiaryToolbar.BoldButton
                          onClick={() => {}}
                          isActive={editorRef.current?.isActive("bold")}
                          editor={editorRef.current}
                        />
                        <WriteDiaryToolbar.ItalicButton
                          onClick={() => {}}
                          editor={editorRef.current}
                        />
                        <WriteDiaryToolbar.Divider />
                        <WriteDiaryToolbar.AlignButton
                          onClick={() => {}}
                          alignment={"left"}
                          editor={editorRef.current}
                        />
                        <WriteDiaryToolbar.AlignButton
                          onClick={() => {}}
                          alignment={"center"}
                          editor={editorRef.current}
                        />
                        <WriteDiaryToolbar.AlignButton
                          onClick={() => {}}
                          alignment={"right"}
                          editor={editorRef.current}
                        />
                      </WriteDiaryToolbar.ButtonGroup>
                      <WriteDiaryToolbar.ButtonGroup className={"ml-auto"}>
                        <WriteDiaryToolbar.KeyboardButton
                          onClick={toggleKeyboard}
                          isKeyboardOpen={isKeyboardOpen || isEditorFocused}
                        />
                      </WriteDiaryToolbar.ButtonGroup>
                    </WriteDiaryToolbar>
                  </>
                )}
              </div>
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
      <EmotionDrawer
        isOpen={isEmotionDrawerOpen}
        onOpenChange={setIsEmotionDrawerOpen}
        onSelectEmotion={handleEmotionSelect}
        selectedEmotion={selectedEmotion}
        date={diaryDate || undefined}
        isEditMode={true}
      />
    </Page.Container>
  );
};

export default EditDiaryPage;
