import api from "@/api";
import Input from "@/components/base/Input";
import Tiptap from "@/components/editor/Tiptap";
import Page from "@/components/page/Page";
import DiaryBookDrawer from "@/features/diary/components/DiaryBookDrawer";
import DiaryBookSelectButton from "@/features/diary/components/DiaryBookSelectButton";
import EmotionDrawer from "@/features/diary/components/EmotionDrawer";
import ImageSlider from "@/features/diary/components/ImageSlider";
import WriteDiaryPageHeader from "@/features/diary/components/WriteDiaryPageHeader";
import WriteDiaryToolbar from "@/features/diary/components/WriteDiaryToolbar";
import { EmotionType } from "@/models/Diary";
import { useAuthStore } from "@/stores/AuthenticationStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Editor } from "@tiptap/react";
import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { MdOutlineAddReaction } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import SettingsBar, { Settings } from "../components/write-diary/SettingsBar";

// 텍스트 정렬 상태 타입
export type TextAlignment = "left" | "center" | "right";

const WriteDiaryPage = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const [searchParams] = useSearchParams();
  const diaryBookId = searchParams.get("diaryBookId");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor | null>(null);

  // 상태 관리
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEmotionDrawerOpen, setIsEmotionDrawerOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(
    null
  );
  const [diaryTitle, setDiaryTitle] = useState("");
  const [content, setContent] = useState("");

  // 키보드 및 에디터 포커스 상태
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // 초기 뷰포트 높이 저장
  const initialViewportHeightRef = useRef<number>(window.innerHeight);

  // 이미지 관련 상태
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<
    Array<{ url: string; file: File }>
  >([]);

  // iOS 여부 감지
  const isIOS = useMemo(() => {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as { MSStream: unknown }).MSStream
    );
  }, []);

  // 기본 키보드 높이
  const DEFAULT_KEYBOARD_HEIGHT = useMemo(() => (isIOS ? 380 : 330), [isIOS]);

  // 이미지 경로 생성 함수
  const getEmotionImagePath = (emotionName: string) => {
    return new URL(
      `../../../assets/images/emotions/${emotionName.toLowerCase()}.png`,
      import.meta.url
    ).href;
  };

  // 설정 상태 관리
  const [settings, setSettings] = useState<Settings>({
    aiCharacter: null,
    useRandomAICharacter: true,
    musicCreationEnabled: true,
  });

  // 일기장 목록 조회
  const { data, isLoading } = useQuery({
    queryKey: ["fetchMyDiaryBook"],
    queryFn: () =>
      api.diaryBook.fetchMyDiaryBook({
        size: 10,
        page: 0, // TODO: pagination
      }),
  });

  // AI 캐릭터 목록 조회
  const { data: aiCharacters = [], isLoading: isLoadingCharacters } = useQuery({
    queryKey: ["fetchAiCharacters", diaryBookId],
    queryFn: () => {
      if (!diaryBookId) return Promise.resolve([]);
      return api.aiCharacter.fethAiCharactersByDiaryBookId(Number(diaryBookId));
    },
    enabled: !!diaryBookId,
  });

  // 저장 버튼 활성화 여부
  const canSubmit = useMemo(() => {
    return !!diaryTitle && diaryTitle.trim() !== "";
  }, [diaryTitle]);

  // 초기 드로어 표시 설정
  useEffect(() => {
    if (diaryBookId === null) {
      setIsMenuOpen(true);
    } else if (!selectedEmotion) {
      setIsEmotionDrawerOpen(true);
    }
  }, [diaryBookId, selectedEmotion]);

  // 초기 뷰포트 높이 설정
  useEffect(() => {
    initialViewportHeightRef.current = window.innerHeight;

    const handleOrientationChange = () => {
      setTimeout(() => {
        initialViewportHeightRef.current = window.innerHeight;
      }, 300);
    };

    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  // 키보드 및 에디터 포커스 관리
  useEffect(() => {
    const editorNode = editorContainerRef.current;
    let resizeTimeoutId: number | null = null;

    const handleFocusIn = (event: FocusEvent) => {
      if ((event.target as HTMLElement)?.closest?.(".ProseMirror")) {
        setIsEditorFocused(true);
      }
    };

    const handleFocusOut = (event: FocusEvent) => {
      setTimeout(() => {
        const activeEl = document.activeElement;
        if (
          !editorNode?.contains(activeEl) &&
          !activeEl?.closest(".toolbar-button")
        ) {
          setIsEditorFocused(false);
        }
      }, 100);
    };

    const handleVisualViewportResize = () => {
      if (!window.visualViewport) return;

      const currentViewportHeight = window.visualViewport.height;
      const heightDifference =
        initialViewportHeightRef.current - currentViewportHeight;

      if (heightDifference > 100) {
        // 키보드가 열린 상태로 설정
        if (!isKeyboardOpen) {
          setIsKeyboardOpen(true);
        }

        // 키보드 높이로 하단바 위치 설정 (약간의 여백 추가)
        setKeyboardHeight(heightDifference + 5);

        if (!isEditorFocused && editorRef.current?.isFocused) {
          setIsEditorFocused(true);
        }

        // 키보드가 열릴 때 현재 선택된 위치가 가려지지 않도록 스크롤 자동 조정
        setTimeout(() => {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (range) {
              const rect = range.getBoundingClientRect();

              // 커서 위치가 키보드나 하단바에 가려질 경우 스크롤 조정
              if (rect.bottom > window.innerHeight - heightDifference - 100) {
                window.scrollBy({
                  top:
                    rect.bottom - (window.innerHeight - heightDifference - 150),
                  behavior: "smooth",
                });
              }
            }
          }
        }, 100);
      } else {
        if (isKeyboardOpen) setIsKeyboardOpen(false);
        setKeyboardHeight(0);
      }
    };

    const debouncedResizeHandler = () => {
      if (resizeTimeoutId) clearTimeout(resizeTimeoutId);
      resizeTimeoutId = window.setTimeout(handleVisualViewportResize, 50);
    };

    if (editorNode) {
      editorNode.addEventListener("focusin", handleFocusIn);
      editorNode.addEventListener("focusout", handleFocusOut);
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", debouncedResizeHandler);
      handleVisualViewportResize(); // 초기 상태 체크
    }

    // 메타 태그 설정
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (
      viewportMeta &&
      !viewportMeta
        .getAttribute("content")
        ?.includes("interactive-widget=resizes-content")
    ) {
      viewportMeta.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, height=device-height, interactive-widget=resizes-content"
      );
    }

    return () => {
      if (editorNode) {
        editorNode.removeEventListener("focusin", handleFocusIn);
        editorNode.removeEventListener("focusout", handleFocusOut);
      }
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          debouncedResizeHandler
        );
      }
      if (resizeTimeoutId) clearTimeout(resizeTimeoutId);
    };
  }, [isKeyboardOpen, isEditorFocused]);

  // 선택된 일기장
  const selectedDiaryBook = useMemo(() => {
    return data?.content.find((diary) => diary.id === Number(diaryBookId));
  }, [data, diaryBookId]);

  // 일기장 드로어 열기
  const openDrawer = () => {
    setIsMenuOpen(true);
  };

  // 감정 선택 핸들러
  const handleEmotionSelect = (emotionType: EmotionType) => {
    setSelectedEmotion(emotionType);
    setIsEmotionDrawerOpen(false);
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

    setUploadedImages((prev) => [...prev, ...files]);

    const newImagePreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setImagePreviewUrls((prev) => [...prev, ...newImagePreviews]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 이미지 제거 핸들러
  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(imagePreviewUrls[index].url);
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 일기 저장
  const submitMutation = useMutation({
    mutationFn: () =>
      api.diary.createDiary(Number(diaryBookId), {
        title: diaryTitle,
        content: content,
        images: uploadedImages,
        emotion: selectedEmotion || undefined,
        desiredCharacterId: settings.useRandomAICharacter
          ? undefined
          : settings.aiCharacter?.id,
        isAICommentEnabled:
          settings.useRandomAICharacter || settings.aiCharacter !== null,
        isAIMusicEnabled: settings.musicCreationEnabled,
      }),
    onSuccess: () => {
      navigate(`/diary-book/${diaryBookId}`, {
        replace: true,
      });
    },
  });

  const handleSubmit = () => {
    submitMutation.mutate();
  };

  const isSubmitting = submitMutation.isPending;

  // 설정 변경 핸들러
  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  // 에디터 준비 콜백
  const handleEditorReady = useCallback((currentEditor: Editor) => {
    editorRef.current = currentEditor;

    // DOM 이벤트 방식으로 키보드 이벤트 처리
    const editorDOM = currentEditor.view.dom;
    editorDOM.addEventListener("keydown", (event) => {
      // 엔터 키가 눌렸을 때
      if (event.key === "Enter") {
        // 약간의 지연 후에 현재 커서 위치로 스크롤 조정
        setTimeout(() => {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (range) {
              // 현재 커서 위치의 DOM 요소를 가져옴
              const rect = range.getBoundingClientRect();

              // 커서가 화면 아래쪽에 있으면 그쪽으로 스크롤
              if (rect.bottom > window.innerHeight - 200) {
                // 부드럽게 커서 위치로 스크롤
                window.scrollBy({
                  top: Math.min(100, rect.bottom - (window.innerHeight - 200)),
                  behavior: "smooth",
                });
              }
            }
          }
        }, 50); // 약간의 지연을 두어 DOM이 업데이트된 후 스크롤 처리
      }
    });

    if (currentEditor.isFocused) {
      setIsEditorFocused(true);
    }
  }, []);

  // 에디터 내용 업데이트
  const handleContentUpdate = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  // 오늘 날짜
  const today = DateTime.now().toLocaleString(DateTime.DATE_MED);

  // 키보드 토글 함수
  const toggleKeyboard = () => {
    if (isKeyboardOpen) {
      editorRef.current?.commands.blur();
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      setIsKeyboardOpen(false);
      setIsEditorFocused(false);
      setKeyboardHeight(0);
    } else {
      editorRef.current?.chain().focus("end").run();
      setIsEditorFocused(true);
      setIsKeyboardOpen(true);
      setKeyboardHeight(DEFAULT_KEYBOARD_HEIGHT - 5);
    }
  };

  // 에디터 컨테이너 하단 패딩 계산
  const editorContainerPaddingBottom = useMemo(() => {
    if (isKeyboardOpen && isEditorFocused) {
      const toolbarApproxHeight = 60;
      return `${keyboardHeight + toolbarApproxHeight}px`;
    }
    return "80px";
  }, [isKeyboardOpen, isEditorFocused, keyboardHeight]);

  // 감정 드로어가 열릴 때 하단바를 숨김
  useEffect(() => {
    if (isEmotionDrawerOpen) {
      // 감정 드로어가 열리면 키보드를 닫고 하단바를 숨김
      if (isKeyboardOpen) {
        editorRef.current?.commands.blur();
        setIsKeyboardOpen(false);
        setIsEditorFocused(false);
        setKeyboardHeight(0);
      }
    }
  }, [isEmotionDrawerOpen, isKeyboardOpen]);

  return (
    <Page.Container className={"h-full flex flex-col overflow-x-hidden"}>
      <WriteDiaryPageHeader
        onBackClick={() => navigate(-1)}
        canSubmit={canSubmit}
        onSubmitClick={handleSubmit}
      />
      <SwitchTransition mode={"out-in"}>
        <CSSTransition
          key={isSubmitting ? "loading" : "content"}
          timeout={300}
          classNames={"fade"}
          nodeRef={nodeRef}
        >
          <div ref={nodeRef} className={"flex-1 flex flex-col relative"}>
            {isSubmitting ? (
              <div
                className={
                  "flex flex-col items-center justify-center h-full text-lg font-medium gap-4"
                }
              >
                <FiUploadCloud
                  className={"text-6xl animate-bounce text-gray-600"}
                />
                <div className={"text-lg text-gray-600"}>
                  일기를 업로드 중이에요
                </div>
              </div>
            ) : (
              <div className={"flex flex-col py-6 px-4 flex-1 gap-2"}>
                <DiaryBookSelectButton
                  isLoading={isLoading}
                  selectedDiaryBookTitle={selectedDiaryBook?.title}
                  onClick={openDrawer}
                />

                {/* 날짜와 감정 선택 영역 */}
                <div className={"flex items-center mt-2"}>
                  <div className={"text-black text-base"}>{today}</div>
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
                        className={"size-7 object-contain"}
                      />
                    ) : (
                      <MdOutlineAddReaction
                        className={"size-5 text-gray-500"}
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

                {/* AI 설정 바 */}
                <SettingsBar
                  settings={settings}
                  onChange={handleSettingsChange}
                  aiCharacters={aiCharacters}
                  isLoadingCharacters={isLoadingCharacters}
                  diaryBookId={diaryBookId ? Number(diaryBookId) : undefined}
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
                  style={{
                    paddingBottom: editorContainerPaddingBottom,
                    transition: "padding-bottom 0.2s ease-out",
                  }}
                >
                  <Tiptap
                    content={content}
                    placeholder={"입력하세요."}
                    onContentUpdate={handleContentUpdate}
                    onEditorReady={handleEditorReady}
                  />
                </div>

                {/* 하단 툴바 */}
                <WriteDiaryToolbar
                  isKeyboardOpen={isKeyboardOpen}
                  isEditorFocused={isEditorFocused}
                  keyboardHeight={keyboardHeight}
                  editor={editorRef.current}
                >
                  <WriteDiaryToolbar.ButtonGroup>
                    <WriteDiaryToolbar.ImageButton
                      onClick={handleImageUploadClick}
                      editor={editorRef.current}
                    />
                    <WriteDiaryToolbar.BoldButton
                      onClick={() => {}}
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
                  <WriteDiaryToolbar.KeyboardButton
                    onClick={toggleKeyboard}
                    isKeyboardOpen={isKeyboardOpen}
                  />
                </WriteDiaryToolbar>
              </div>
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
      <DiaryBookDrawer
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        selectedDiaryBookId={selectedDiaryBook?.id}
      />
      <EmotionDrawer
        isOpen={isEmotionDrawerOpen}
        onOpenChange={setIsEmotionDrawerOpen}
        onSelectEmotion={handleEmotionSelect}
        selectedEmotion={selectedEmotion}
      />
    </Page.Container>
  );
};

export default WriteDiaryPage;
