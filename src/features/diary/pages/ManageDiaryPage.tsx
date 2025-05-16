import api from "@/api";
import Button from "@/components/base/Button";
import Spinner from "@/components/base/Spinner";
import { DiaryCoverItem } from "@/components/diary/DiaryCover";
import Page from "@/components/page/Page";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Sticker } from "@/models/Sticker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  MdOutlineKeyboardBackspace,
  MdOutlineModeEditOutline,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import EditDiaryCoverPanel from "../components/EditDiaryCoverPanel";
import EditDiaryTitlePanel from "../components/EditDiaryTitlePanel";
import DiaryDecorateDialog from "../components/stickers/DiaryDecorateDialog";

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

  const { mutate: tryUpdateStickers, isPending: isStickerSaving } = useMutation(
    {
      mutationFn: (stickers: Sticker[]) => {
        if (!diaryId) throw new Error("Diary ID is missing!");
        return api.diaryBook.updateStickers(Number(diaryId), stickers);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["fetchDiaryBookById", diaryId],
        });
        setIsDecorateDialogOpen(false); // 성공 시 다이얼로그 닫기
      },
      onError: (error) => {
        console.error("스티커 업데이트 실패:", error);
        alert("스티커 업데이트에 실패했습니다.");
      },
    }
  );

  // 아코디언 패널 상태 관리
  const [openedPanel, setOpenedPanel] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDecorateDialogOpen, setIsDecorateDialogOpen] = useState(false);
  const [currentStickers, setCurrentStickers] = useState<Sticker[]>([]);

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setCurrentStickers(data.stickers || []);
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
      alert("일기장 표지를 선택해주세요.");
      return;
    }

    let coverImageFile: File;

    if (selectedCover.type === "file") {
      coverImageFile = selectedCover.image;
    } else if (selectedCover.type === "preset") {
      try {
        const response = await fetch(selectedCover.imageSrc);
        const blob = await response.blob();
        coverImageFile = new File([blob], `preset-cover-${Date.now()}.jpg`, {
          type: blob.type || "image/jpeg",
        });
      } catch (error) {
        console.error("프리셋 이미지 변환 중 오류 발생:", error);
        alert("이미지 처리에 실패했습니다. 다시 시도해주세요.");
        return;
      }
    } else {
      console.error("지원되지 않는 커버 이미지 타입입니다.");
      alert("지원되지 않는 커버 이미지 타입입니다.");
      return;
    }

    tryUpdateDiaryBook({
      coverImage: coverImageFile,
    });
  };

  const handleStickerSave = (updatedStickers: Sticker[]) => {
    tryUpdateStickers(updatedStickers);
  };

  const selectedCoverForDialog: DiaryCoverItem | null = data?.coverImage
    ? {
        type: "uploaded",
        imageId: data.coverImage.id.toString(),
        coverColor: "bg-gray-200", // 기본 커버 색상, DiaryBook에 coverColor 필드가 없으므로 기본값 사용
      }
    : {
        type: "empty",
        coverColor: "bg-gray-200",
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
                onCancel={() => {
                  setOpenedPanel("");
                }}
                onSave={handleEditCoverSave}
                isSaving={isSaving}
              />
            </AccordionContent>
          </AccordionItem>

          {/* 스티커 편집 */}
          <AccordionItem value={"edit-stickers"}>
            <AccordionTrigger
              className={"flex justify-between items-center"}
              onClick={() => setIsDecorateDialogOpen(true)}
            >
              <div className={"text-base"}>일기장 꾸미기 (스티커)</div>
              <MdOutlineModeEditOutline />
            </AccordionTrigger>
            {/* AccordionContent는 Dialog로 대체되므로 비워두거나 간단한 안내 메시지 표시 가능 */}
            <AccordionContent>
              <p className={"text-sm text-gray-500"}>
                위 버튼을 클릭하여 스티커를 수정하세요.
              </p>
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
      <DiaryDecorateDialog
        open={isDecorateDialogOpen}
        onOpenChange={setIsDecorateDialogOpen}
        selectedCover={selectedCoverForDialog}
        initialStickers={currentStickers}
        onSave={handleStickerSave}
      />
    </Page.Container>
  );
};

export default ManageDiaryPage;
