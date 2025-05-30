import api from "@/api";
import Input from "@/components/base/Input";
import Tiptap from "@/components/editor/Tiptap";
import Page from "@/components/page/Page";
import DiaryBookDrawer from "@/features/diary/components/DiaryBookDrawer";
import DiaryBookSelectButton from "@/features/diary/components/DiaryBookSelectButton";
import EmotionDrawer from "@/features/diary/components/EmotionDrawer";
import ImageSlider from "@/features/diary/components/ImageSlider";
import WriteDiaryPageHeader from "@/features/diary/components/WriteDiaryPageHeader";
import { useAuthStore } from "@/stores/AuthenticationStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiAlignLeft,
  FiCheck,
  FiChevronDown,
  FiImage,
  FiUploadCloud,
} from "react-icons/fi";
import { MdOutlineAddReaction } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import SettingsBar, { Settings } from "../components/write-diary/SettingsBar";

const WriteDiaryPage = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const [searchParams] = useSearchParams();
  const diaryBookId = searchParams.get("diaryBookId");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 저장 회색으로 보이다가 제목 입력하면 검정색으로.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEmotionDrawerOpen, setIsEmotionDrawerOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [diaryTitle, setDiaryTitle] = useState("");
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [content, setContent] = useState("");

  // 이미지 관련 상태
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<
    Array<{ url: string; file: File }>
  >([]);

  // 이미지 경로 생성 함수
  const getEmotionImagePath = (emotionName: string) => {
    return new URL(
      `../../../assets/images/emotions/${emotionName}.png`,
      import.meta.url
    ).href;
  };

  // 설정 상태 관리
  const [settings, setSettings] = useState<Settings>({
    aiCharacter: null,
    useRandomAICharacter: true,
    musicCreationEnabled: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["fetchMyDiaryBook"],
    queryFn: () =>
      api.diaryBook.fetchMyDiaryBook({
        size: 10,
        page: 1,
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

  const canSubmit = useMemo(() => {
    return !!diaryTitle && diaryTitle.trim() !== "";
  }, [diaryTitle]);

  useEffect(() => {
    if (diaryBookId === null) {
      setIsMenuOpen(true);
    } else if (!selectedEmotion) {
      // 일기장이 선택되었지만 감정이 선택되지 않은 경우 감정 선택 드로어 표시
      setIsEmotionDrawerOpen(true);
    }
  }, [diaryBookId, selectedEmotion]);

  const selectedDiaryBook = useMemo(() => {
    return data?.content.find((diary) => diary.id === Number(diaryBookId));
  }, [data, diaryBookId]);

  const openDrawer = () => {
    setIsMenuOpen(true);
  };

  const handleEmotionSelect = (emotionName: string) => {
    setSelectedEmotion(emotionName);
    setIsEmotionDrawerOpen(false);
  };

  // 이미지 관련 핸들러
  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // 파일 목록 업데이트
    setUploadedImages((prev) => [...prev, ...files]);

    // 미리보기 URL 생성
    const newImagePreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setImagePreviewUrls((prev) => [...prev, ...newImagePreviews]);

    // 파일 입력 필드 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 이미지 제거 핸들러
  const handleRemoveImage = (index: number) => {
    // 미리보기 URL 해제
    URL.revokeObjectURL(imagePreviewUrls[index].url);

    // 상태 업데이트
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

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

  const toggleKeyboard = () => {
    setIsKeyboardOpen(!isKeyboardOpen);
    // 실제 키보드를 숨기거나 보이게 하는 코드는 모바일 환경에서 추가 구현 필요
  };

  // 텍스트 정렬 함수
  const handleTextAlign = () => {
    // 에디터 텍스트 정렬 기능 구현
    console.log("텍스트 정렬");
  };

  // 오늘 날짜
  const today = DateTime.now().toLocaleString(DateTime.DATE_MED);

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
              <div className={"flex flex-col py-6 px-4 flex-1 gap-2 pb-16"}>
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
                <div className={"flex flex-col gap-2"}>
                  <Input
                    className={"w-full text-xl"}
                    placeholder={"일기 제목"}
                    onChange={(e) => setDiaryTitle(e.target.value)}
                  />
                </div>

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
                <div className={"flex-1 rounded-lg mt-1"}>
                  <Tiptap
                    content={content}
                    placeholder={"오늘은 무슨일이 있었나요?"}
                    onContentUpdate={(content) => setContent(content)}
                  />
                </div>

                {/* 하단 툴바 */}
                <div
                  className={`flex items-center justify-between py-3 px-4 border-t border-gray-200 bg-white fixed bottom-0 left-0 right-0 z-10 ${
                    isKeyboardOpen ? "mb-[260px]" : ""
                  }`}
                >
                  <div className={"flex items-center gap-6"}>
                    <button
                      onClick={handleImageUploadClick}
                      className={
                        "text-gray-600 hover:text-gray-800 flex items-center justify-center w-10 h-10"
                      }
                    >
                      <FiImage className={"w-5 h-5"} />
                    </button>
                    <button
                      onClick={handleTextAlign}
                      className={
                        "text-gray-600 hover:text-gray-800 flex items-center justify-center w-10 h-10"
                      }
                    >
                      <FiAlignLeft className={"w-5 h-5"} />
                    </button>
                  </div>
                  <button
                    onClick={toggleKeyboard}
                    className={
                      "text-gray-600 hover:text-gray-800 flex items-center justify-center w-10 h-10"
                    }
                  >
                    {isKeyboardOpen ? (
                      <FiCheck className={"w-5 h-5"} />
                    ) : (
                      <FiChevronDown className={"w-5 h-5"} />
                    )}
                  </button>
                </div>
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
