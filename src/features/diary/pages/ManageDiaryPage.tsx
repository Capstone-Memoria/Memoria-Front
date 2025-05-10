import api from "@/api";
import Button from "@/components/base/Button";
import Spinner from "@/components/base/Spinner";
import Page from "@/components/page/Page";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  MdOutlineKeyboardBackspace,
  MdOutlineModeEditOutline,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import CharacterManagePanel from "../components/CharacterManagePanel";
import EditDiaryCoverPanel from "../components/EditDiaryCoverPanel";
import EditDiaryTitlePanel from "../components/EditDiaryTitlePanel";

const ManageDiaryPage = () => {
  const navigate = useNavigate();
  const { diaryId } = useParams<{ diaryId: string }>();

  const queryClient = useQueryClient();

  // server side
  const { data, isFetching: isDiaryBookFetching } = useQuery({
    queryKey: ["fetchDiaryBookById", diaryId],
    queryFn: () => api.diaryBook.fetchDiaryBookById(Number(diaryId)),
    enabled: !!diaryId,
  });

  const { mutate: tryUpdateDiaryBook, isPending: isSaving } = useMutation({
    // mutationFn은 FormData를 인자로 받도록 수정
    mutationFn: (formData: FormData) => api.diaryBook.updateDiaryBook(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchDiaryBookById", diaryId], // diaryId를 포함한 queryKey 무효화
      });
      // 필요하다면 성공 알림 표시
      setOpenedPanel(""); // 성공 시 패널 닫기
    },
    onError: (error) => {
      console.error("일기장 업데이트 실패:", error);
      // 필요하다면 에러 알림 표시
    },
  });

  const { mutate: tryDelete, isPending: isDeleting } = useMutation({
    // isPending 변수명 변경 (isSaving과 충돌 방지)
    mutationFn: () => api.diaryBook.deleteDiaryBook(Number(diaryId)),
    onSuccess: () => {
      // 삭제 성공 시 캐시 무효화보다는 제거가 더 적절할 수 있음
      queryClient.removeQueries({ queryKey: ["fetchDiaryBookById", diaryId] });
      queryClient.invalidateQueries({ queryKey: ["fetchMyDiaryBook"] }); // 목록 캐시 무효화 (선택 사항)
      navigate("/main", { replace: true }); // 또는 다른 적절한 경로로 이동
    },
    onError: (error) => {
      console.error("일기장 삭제 실패:", error);
      // 필요하다면 에러 알림 표시
    },
  });

  // 아코디언 패널 상태 관리
  const [openedPanel, setOpenedPanel] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null); // 커버 이미지 파일 상태 추가

  useEffect(() => {
    if (data) {
      setTitle(data.title);
    }
  }, [data]);

  // 삭제 핸들러
  const handleDelete = () => {
    tryDelete();
  };

  const handleTitleSave = () => {
    if (!diaryId) {
      console.error("Diary ID is missing!");
      return;
    }
    const formData = new FormData();
    formData.append("diaryBookId", diaryId);
    formData.append("title", title);

    tryUpdateDiaryBook(formData);
  };

  const handleCoverSave = () => {
    if (!diaryId || !coverImageFile) {
      console.error("Diary ID or cover image file is missing!");
      return;
    }

    const formData = new FormData();
    formData.append("diaryBookId", diaryId);
    formData.append("coverImage", coverImageFile);

    tryUpdateDiaryBook(formData);
    setCoverImageFile(null); // 커버 이미지 파일 초기화
  };

  return (
    <Page.Container className={"h-full flex flex-col"}>
      <Page.Header className={"grid grid-cols-3 items-center"}>
        <div className={"text-2xl"}>
          <MdOutlineKeyboardBackspace onClick={() => navigate(-1)} />
        </div>
        <div className={"flex justify-center"}>일기장 관리</div>
        <div />
      </Page.Header>
      <Page.Content className={"px-6 py-4 flex-1 flex flex-col"}>
        <h2 className={"text-black text-lg font-semibold pt-5"}>일기장 관리</h2>
        <Accordion
          type={"single"}
          collapsible
          onValueChange={setOpenedPanel}
          value={openedPanel}
        >
          {/* 일기장 제목 */}
          <AccordionItem value={"edit-title"}>
            <AccordionTrigger className={"flex justify-between items-center"}>
              <div className={"text-base"}>일기장 제목</div>
              <div className={"flex items-center gap-2"}>
                {isSaving || isDiaryBookFetching ? (
                  <Spinner />
                ) : (
                  <div className={"text-gray-5"}>{data?.title}</div>
                )}
                <MdOutlineModeEditOutline />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <EditDiaryTitlePanel
                title={title}
                setTitle={setTitle}
                onCancel={() => {
                  setOpenedPanel("");
                  if (data) setTitle(data.title);
                }}
                onSave={handleTitleSave}
                isSaving={isSaving}
              />
            </AccordionContent>
          </AccordionItem>

          {/*  일기장 표지 */}
          <AccordionItem value={"edit-cover"}>
            <AccordionTrigger className={"flex justify-between items-center"}>
              <div className={"text-base"}>일기장 표지</div>
            </AccordionTrigger>
            <AccordionContent>
              <EditDiaryCoverPanel
                // currentCoverImageUrl={data?.coverImageUrl}
                // selectedFile={coverImageFile}
                // setSelectedFile={setCoverImageFile}
                onCancel={() => {
                  setOpenedPanel("");
                  setCoverImageFile(null);
                }}
                onMouseLeave={handleCoverSave}
                isSaving={isSaving}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value={"manage-character"}>
            <AccordionTrigger className={"flex justify-between items-center"}>
              <div className={"text-base"}>일기장 캐릭터 관리</div>
            </AccordionTrigger>
            <AccordionContent>
              <CharacterManagePanel diaryId={Number(diaryId)} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className={"flex-1"} />
        <div className={"flex justify-center pb-8"}>
          <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DrawerTrigger asChild>
              <Button
                variant={"text"}
                className={"p-0 text-sm text-red-400 border-b border-b-red-400"}
              >
                일기장 삭제하기
              </Button>
            </DrawerTrigger>
            <DrawerContent className={"pb-8 px-5 gap-13 text-center"}>
              <div className={"flex flex-col gap-2 p-4"}>
                정말 일기장을 삭제 하시겠습니까?
              </div>
              <div className={"grid grid-cols-2 gap-x-7"}>
                <Button
                  variant={"danger"}
                  onClick={handleDelete}
                  className={"flex items-center justify-center"}
                  disabled={isDeleting}
                >
                  {isDeleting ? <Spinner className={"text-white"} /> : "네"}
                </Button>

                <Button
                  variant={"secondary"}
                  onClick={() => setIsMenuOpen(false)}
                >
                  취소
                </Button>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </Page.Content>
    </Page.Container>
  );
};

export default ManageDiaryPage;
