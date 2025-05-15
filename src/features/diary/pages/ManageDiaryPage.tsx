import api from "@/api";
import Button from "@/components/base/Button";
import Spinner from "@/components/base/Spinner";
import {
  DiaryCoverItem,
  FileDiaryCoverItem,
  PresetDiaryCoverItem,
} from "@/components/diary/DiaryCoverCarousel";
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
    mutationFn: (request: {
      title?: string;
      isPinned?: boolean;
      coverImage?: File;
    }) => {
      if (!diaryId) throw new Error("Diary ID is missing!");
      return api.diaryBook.updateDiaryBook(Number(diaryId), request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchDiaryBookById", diaryId],
      });
      queryClient.invalidateQueries({ queryKey: ["fetchMyDiaryBook"] });
      setOpenedPanel(""); // 성공 시 패널 닫기
    },
    onError: (error) => {
      console.error("일기장 업데이트 실패:", error);
    },
  });

  const { mutate: tryDelete, isPending: isDeleting } = useMutation({
    mutationFn: () => api.diaryBook.deleteDiaryBook(Number(diaryId)),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["fetchDiaryBookById", diaryId] });
      queryClient.invalidateQueries({ queryKey: ["fetchMyDiaryBook"] });
      navigate("/main");
    },
    onError: (error) => {
      console.error("일기장 삭제 실패:", error);
    },
  });

  // 아코디언 패널 상태 관리
  const [openedPanel, setOpenedPanel] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    tryUpdateDiaryBook({
      title,
    });
  };

  const handleEditCoverSave = async (selectedCover: DiaryCoverItem | null) => {
    if (!diaryId) {
      console.error("Diary ID is missing!");
      alert("일기장 ID가 없습니다.");
      return;
    }
    if (isSaving) return; // 중복 클릭 방지

    if (!selectedCover) {
      // 커버가 선택되지 않은 경우 (EditDiaryCoverPanel의 '저장' 버튼 로직에 따라 달라짐)
      alert("일기장 표지를 선택해주세요.");
      return;
    }

    let coverImageFile: File;

    // 선택된 커버 이미지 타입에 따라 파일 준비
    if (selectedCover.type === "uploaded") {
      // 업로드된 이미지인 경우 File 객체 그대로 사용
      coverImageFile = (selectedCover as FileDiaryCoverItem).image;
    } else if (selectedCover.type === "preset") {
      // 프리셋 이미지인 경우 URL에서 File 객체로 변환
      const presetCover = selectedCover as PresetDiaryCoverItem;
      try {
        const response = await fetch(presetCover.imageSrc);
        const blob = await response.blob();
        // File 객체 생성 (CreateDiaryPage와 유사)
        coverImageFile = new File([blob], `preset-cover-${Date.now()}.jpg`, {
          type: blob.type || "image/jpeg", // 타입 명시, 없을 경우 jpeg 폴백
        });
      } catch (error) {
        console.error("프리셋 이미지 변환 중 오류 발생:", error);
        alert("이미지 처리에 실패했습니다. 다시 시도해주세요.");
        return; // 변환 실패 시 저장 중단
      }
    } else {
      // 지원되지 않는 타입 에러 처리
      console.error("지원되지 않는 커버 이미지 타입입니다.");
      alert("지원되지 않는 커버 이미지 타입입니다.");
      return; // 저장 중단
    }

    // 파일이 준비되면 뮤테이션 호출
    tryUpdateDiaryBook({
      coverImage: coverImageFile,
    });

    // Note: 패널 닫기는 tryUpdateDiaryBook의 onSuccess에서 처리됨
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
                  // 패널 내부에서 취소 버튼 클릭 시 호출
                  setOpenedPanel(""); // 아코디언 닫기
                  // EditDiaryCoverPanel 내부에서 업로드된 파일 상태 등 초기화 로직이 있어야 함
                }}
                onSave={handleEditCoverSave} // 새로운 커버 저장 핸들러 연결
                isSaving={isSaving} // 저장 중 상태 전달
                // onMouseLeave={handleCoverSave} // 이 로직은 제거
              />
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
