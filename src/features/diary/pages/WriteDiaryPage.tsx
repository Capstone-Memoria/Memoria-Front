import api from "@/api";
import Input from "@/components/base/Input";
import Tiptap from "@/components/editor/Tiptap";
import Page from "@/components/page/Page";
import DiaryBookDrawer from "@/features/diary/components/DiaryBookDrawer";
import DiaryBookSelectButton from "@/features/diary/components/DiaryBookSelectButton";
import WriteDiaryPageHeader from "@/features/diary/components/WriteDiaryPageHeader";
import { useAuthStore } from "@/stores/AuthenticationStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dot } from "lucide-react";
import { DateTime } from "luxon";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";

const WriteDiaryPage = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const [searchParams] = useSearchParams();
  const diaryBookId = searchParams.get("diaryBookId");

  // 저장 회색으로 보이다가 제목 입력하면 검정색으로.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [diaryTitle, setDiaryTitle] = useState("");
  const nodeRef = useRef<HTMLDivElement>(null);

  const [content, setContent] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["fetchMyDiaryBook"],
    queryFn: () =>
      api.diaryBook.fetchMyDiaryBook({
        size: 10,
        page: 1, // TODO: pagination
      }),
  });

  const canSubmit = useMemo(() => {
    return !!diaryTitle && diaryTitle.trim() !== "";
  }, [diaryTitle]);

  useEffect(() => {
    if (diaryBookId === null) {
      setIsMenuOpen(true);
    }
  }, []);

  const selectedDiaryBook = useMemo(() => {
    return data?.content.find((diary) => diary.id === Number(diaryBookId));
  }, [data, diaryBookId]);

  const openDrawer = () => {
    setIsMenuOpen(true);
  };

  const submitMutation = useMutation({
    mutationFn: () =>
      api.diary.createDiary(Number(diaryBookId), {
        title: diaryTitle,
        content: content,
      }),
    onSuccess: () => {
      navigate(`/diary/${diaryBookId}`);
    },
  });

  const handleSubmit = () => {
    submitMutation.mutate();
  };

  const isSubmitting = submitMutation.isPending;

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
          <div ref={nodeRef} className={"flex-1"}>
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
              <Page.Content className={"flex flex-col gap-5 flex-1"}>
                <DiaryBookSelectButton
                  isLoading={isLoading}
                  selectedDiaryBookTitle={selectedDiaryBook?.title}
                  onClick={openDrawer}
                />
                <div className={"flex flex-col gap-2"}>
                  <Input
                    className={"w-full text-2xl"}
                    placeholder={"일기 제목"}
                    onChange={(e) => setDiaryTitle(e.target.value)}
                  />
                </div>
                <div className={"flex items-center text-gray-500"}>
                  <div>{DateTime.now().toLocaleString(DateTime.DATE_MED)}</div>
                  <Dot />
                  <div>{authStore.context?.user?.nickName}</div>
                </div>
                <div className={"flex-1 rounded-lg"}>
                  <Tiptap
                    content={content}
                    placeholder={"오늘은 무슨일이 있었나요?"}
                    onContentUpdate={(content) => setContent(content)}
                  />
                </div>
              </Page.Content>
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
      <DiaryBookDrawer
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        selectedDiaryBookId={selectedDiaryBook?.id}
      />
    </Page.Container>
  );
};
export default WriteDiaryPage;
