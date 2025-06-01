import api from "@/api";
import Tiptap from "@/components/editor/Tiptap";

import Input from "@/components/base/Input";
import Page from "@/components/page/Page";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";
import DiaryBookDrawer from "@/features/diary/components/DiaryBookDrawer";
import DiaryBookSelectButton from "@/features/diary/components/DiaryBookSelectButton";
import EmotionDrawer from "@/features/diary/components/EmotionDrawer";
import ImageSlider from "@/features/diary/components/ImageSlider";
import WriteDiaryPageHeader from "@/features/diary/components/WriteDiaryPageHeader";
import { EmotionType } from "@/models/Diary";
import { useAuthStore } from "@/stores/AuthenticationStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Editor } from "@tiptap/react";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ImageIcon,
  ItalicIcon,
  Keyboard,
  KeyboardOff,
} from "lucide-react";
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

  // 키보드 및 에디터 포커스 관리 - VisualViewport API 활용
  useEffect(() => {
    const editorNode = editorContainerRef.current;

    // 에디터 포커스 이벤트 핸들러
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

    // VisualViewport 리사이즈 핸들러
    const handleVisualViewportResize = (event: Event) => {
      if (!window.visualViewport) return;

      // window.innerHeight와 visualViewport.height의 차이로 키보드 높이 계산
      const resizeHeight = window.innerHeight - window.visualViewport.height;

      if (resizeHeight > 100) {
        // 키보드가 열린 상태로 설정
        if (!isKeyboardOpen) {
          setIsKeyboardOpen(true);
        }
        setKeyboardHeight(resizeHeight);

        if (!isEditorFocused && editorRef.current?.isFocused) {
          setIsEditorFocused(true);
        }
      } else {
        if (isKeyboardOpen) setIsKeyboardOpen(false);
        setKeyboardHeight(0);
      }
    };

    // 이벤트 리스너 등록
    if (editorNode) {
      editorNode.addEventListener("focusin", handleFocusIn);
      editorNode.addEventListener("focusout", handleFocusOut);
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        "resize",
        handleVisualViewportResize
      );
      // 초기 상태 확인
      handleVisualViewportResize({
        currentTarget: window.visualViewport,
      } as unknown as Event);
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

    // VirtualKeyboard API 사용 (지원하는 브라우저에서만)
    if ("virtualKeyboard" in navigator) {
      // TypeScript에서 VirtualKeyboard API를 인식하지 못하므로 타입을 정의합니다
      interface VirtualKeyboard {
        overlaysContent: boolean;
      }

      interface NavigatorWithVirtualKeyboard extends Navigator {
        virtualKeyboard: VirtualKeyboard;
      }

      (
        navigator as NavigatorWithVirtualKeyboard
      ).virtualKeyboard.overlaysContent = true;
    }

    return () => {
      if (editorNode) {
        editorNode.removeEventListener("focusin", handleFocusIn);
        editorNode.removeEventListener("focusout", handleFocusOut);
      }
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          handleVisualViewportResize
        );
      }
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
                      "flex items-center justify-center w-fit px-1 py-0.5 rounded-md border border-gray-200 ml-auto"
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
                    paddingBottom:
                      isKeyboardOpen && isEditorFocused
                        ? `${keyboardHeight + 70}px`
                        : "80px",
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
              </div>
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>

      {/* 하단 툴바 - 항상 페이지 하단에 고정 */}
      <div
        className={"fixed left-0 right-0 z-50"}
        style={{
          bottom: isIOS
            ? `calc(${keyboardHeight * 1.1}px)` // iOS에서는 10% 더 올림
            : `calc(${keyboardHeight * 1.2}px)`, // Android에서는 20% 더 올림
          transition: "bottom 0.3s ease-out",
          backgroundColor: "white",
          borderTop: "1px solid #eaeaea",
          boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Toolbar
          variant={"fixed"}
          style={{
            width: "100%",
          }}
          onTouchMove={(e) => e.preventDefault()}
          onWheel={(e) => e.stopPropagation()}
        >
          <ToolbarGroup>
            <button className={"p-2 rounded"} onClick={handleImageUploadClick}>
              <ImageIcon className={"w-4 h-4"} />
            </button>
          </ToolbarGroup>

          <ToolbarSeparator />

          <ToolbarGroup>
            <button
              className={`p-2 rounded ${editorRef.current?.isActive("bold") ? "bg-gray-200" : ""}`}
              onClick={() =>
                editorRef.current?.chain().focus().toggleBold().run()
              }
            >
              <BoldIcon className={"w-4 h-4"} />
            </button>
            <button
              className={`p-2 rounded ${editorRef.current?.isActive("italic") ? "bg-gray-200" : ""}`}
              onClick={() =>
                editorRef.current?.chain().focus().toggleItalic().run()
              }
            >
              <ItalicIcon className={"w-4 h-4"} />
            </button>
          </ToolbarGroup>

          <ToolbarSeparator />

          <ToolbarGroup>
            <button
              className={`p-2 rounded ${editorRef.current?.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""}`}
              onClick={() =>
                editorRef.current?.chain().focus().setTextAlign("left").run()
              }
            >
              <AlignLeftIcon className={"w-4 h-4"} />
            </button>
            <button
              className={`p-2 rounded ${editorRef.current?.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""}`}
              onClick={() =>
                editorRef.current?.chain().focus().setTextAlign("center").run()
              }
            >
              <AlignCenterIcon className={"w-4 h-4"} />
            </button>
            <button
              className={`p-2 rounded ${editorRef.current?.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""}`}
              onClick={() =>
                editorRef.current?.chain().focus().setTextAlign("right").run()
              }
            >
              <AlignRightIcon className={"w-4 h-4"} />
            </button>
          </ToolbarGroup>

          <div className={"flex-1"} />

          <ToolbarGroup>
            <button className={"p-2 rounded"} onClick={toggleKeyboard}>
              {isKeyboardOpen ? (
                <KeyboardOff className={"w-4 h-4"} />
              ) : (
                <Keyboard className={"w-4 h-4"} />
              )}
            </button>
          </ToolbarGroup>
        </Toolbar>
      </div>

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
