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
import { cn } from "@/lib/utils";
import { ImageToUploadSticker, ModifyingSticker } from "@/models/Sticker";
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
import DiaryDecorateDialog from "../components/stickers/DiaryDecorateDialog";

const ManageDiaryBookPage = () => {
  const navigate = useNavigate();
  const { diaryBookId } = useParams<{ diaryBookId: string }>();

  const queryClient = useQueryClient();

  // server side
  const { data, isFetching: isDiaryBookFetching } = useQuery({
    queryKey: ["fetchDiaryBookById", diaryBookId],
    queryFn: () => api.diaryBook.fetchDiaryBookById(Number(diaryBookId)),
    enabled: !!diaryBookId,
  });

  const { mutate: tryUpdateDiaryBook, isPending: isSaving } = useMutation({
    mutationFn: (request: {
      title?: string;
      isPinned?: boolean;
      coverImage?: File;
      spineColor?: string;
    }) => {
      if (!diaryBookId) throw new Error("Diary ID is missing!");
      return api.diaryBook.updateDiaryBook(Number(diaryBookId), request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchDiaryBookById", diaryBookId], // diaryId를 포함한 queryKey 무효화
      });
      queryClient.invalidateQueries({ queryKey: ["fetchMyDiaryBook"] });
      setOpenedPanel(""); // 성공 시 패널 닫기
    },
    onError: (error) => {
      console.error("일기장 업데이트 실패:", error);
    },
  });

  const { mutate: tryDelete, isPending: isDeleting } = useMutation({
    // isPending 변수명 변경 (isSaving과 충돌 방지)
    mutationFn: () => api.diaryBook.deleteDiaryBook(Number(diaryBookId)),
    onSuccess: () => {
      // 삭제 성공 시 캐시 무효화보다는 제거가 더 적절할 수 있음
      queryClient.removeQueries({
        queryKey: ["fetchDiaryBookById", diaryBookId],
      });
      queryClient.invalidateQueries({ queryKey: ["fetchMyDiaryBook"] }); // 목록 캐시 무효화 (선택 사항)
      navigate("/main", { replace: true }); // 또는 다른 적절한 경로로 이동
    },
    onError: (error) => {
      console.error("일기장 삭제 실패:", error);
    },
  });

  const { mutate: tryUpdateStickers } = useMutation({
    mutationFn: (stickers: ModifyingSticker[]) => {
      if (!diaryBookId) throw new Error("Diary ID is missing!");
      return api.diaryBook.updateStickers(Number(diaryBookId), stickers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchDiaryBookById", diaryBookId],
      });
      setIsDecorateDialogOpen(false); // 성공 시 다이얼로그 닫기
    },
    onError: (error) => {
      console.error("스티커 업데이트 실패:", error);
      alert("스티커 업데이트에 실패했습니다.");
    },
  });

  // 아코디언 패널 상태 관리
  const [openedPanel, setOpenedPanel] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [selectedSpineColor, setSelectedSpineColor] = useState<string>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDecorateDialogOpen, setIsDecorateDialogOpen] = useState(false);
  const [currentStickers, setCurrentStickers] = useState<ModifyingSticker[]>(
    []
  );

  useEffect(() => {
    const fetchStickers = async () => {
      if (data) {
        setTitle(data.title);
        const stickers: ModifyingSticker[] = [
          ...(data.stickers?.filter((it) => it.type !== "CUSTOM_IMAGE") ?? []),
        ];

        const convertedImageStickers: ImageToUploadSticker[] =
          await Promise.all(
            data.stickers
              ?.filter((it) => it.type === "CUSTOM_IMAGE")
              .map(async (it) => {
                const imageBlob: Blob = await api.image.fetchImage(
                  it.imageFile.id
                );
                const imageFile = new File([imageBlob], it.imageFile.id, {
                  type: imageBlob.type,
                });

                return {
                  uuid: it.uuid,
                  type: "IMAGE_TO_UPLOAD",
                  imageFile: imageFile,
                  posX: it.posX,
                  posY: it.posY,
                  size: it.size,
                  rotation: it.rotation,
                } satisfies ImageToUploadSticker;
              }) ?? []
          );
        const totalStickers: ModifyingSticker[] = [
          ...stickers,
          ...convertedImageStickers,
        ];
        setCurrentStickers(totalStickers);
        setSelectedSpineColor(data.spineColor);
      }
    };
    fetchStickers();
  }, [data]);

  // 삭제 핸들러
  const handleDelete = () => {
    tryDelete();
  };

  const handleTitleSave = () => {
    if (!diaryBookId) {
      console.error("Diary ID is missing!");
      return;
    }

    tryUpdateDiaryBook({
      title,
    });
  };

  const handleEditCoverSave = async (
    selectedCover: DiaryCoverItem | null,
    spineColor: string | undefined
  ) => {
    if (!diaryBookId) {
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
      spineColor: spineColor,
    });
  };

  const handleStickerSave = (updatedStickers: ModifyingSticker[]) => {
    tryUpdateStickers(updatedStickers);
  };

  const selectedCoverForDialog: DiaryCoverItem | null = data?.coverImage
    ? {
        type: "uploaded",
        imageId: data.coverImage.id.toString(),
      }
    : {
        type: "empty",
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

          {/* 일기장 표지 및 책등 색상 */}
          <AccordionItem value={"edit-cover"}>
            <AccordionTrigger className={"flex justify-between items-center"}>
              <div className={"text-base"}>일기장 표지 및 책등 색상</div>
              <div className={"flex items-center gap-2"}>
                {isSaving || isDiaryBookFetching ? (
                  <Spinner />
                ) : (
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border border-gray-300",
                      selectedSpineColor
                    )}
                  />
                )}
                <MdOutlineModeEditOutline />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <EditDiaryCoverPanel
                onCancel={() => {
                  setOpenedPanel("");
                  if (data) setSelectedSpineColor(data.spineColor);
                }}
                onSave={handleEditCoverSave}
                isSaving={isSaving}
                initialSpineColor={selectedSpineColor}
              />
            </AccordionContent>
          </AccordionItem>

          {/* 일기장 캐릭터 관리 */}
          <AccordionItem value={"manage-character"}>
            <AccordionTrigger className={"flex justify-between items-center"}>
              <div className={"text-base"}>일기장 캐릭터 관리</div>
            </AccordionTrigger>
            <AccordionContent>
              <CharacterManagePanel diaryBookId={Number(diaryBookId)} />
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
        spineColor={selectedSpineColor}
      />
    </Page.Container>
  );
};

export default ManageDiaryBookPage;
