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
import EditDiaryCoverPanel from "../components/EditDiaryCoverPanel";
import EditDiaryTitlePanel from "../components/EditDiaryTitlePanel";

const ManageDiaryPage = () => {
  const navigate = useNavigate();
  const { diaryId } = useParams();

  const queryClient = useQueryClient();

  // server side
  const { data, isFetching: isDiaryBookFetching } = useQuery({
    queryKey: ["fetchDiaryBookById", diaryId],
    queryFn: () => api.diary.fetchDiaryBookById(Number(diaryId)),
  });

  const {
    mutate: trySave,
    isPending: isSaving,
    error,
  } = useMutation({
    mutationFn: () => api.diary.updateDiaryBook(Number(diaryId), { title }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchDiaryBookById", diaryId],
      });
    },
  });

  const { mutate: tryDelete, isPending } = useMutation({
    mutationFn: () => api.diary.deleteDiaryBook(Number(diaryId)),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchDiaryBookById", diaryId],
      });
      navigate("/main");
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

  // 저장 핸들러
  const handleSave = () => {
    trySave();
    setOpenedPanel("");
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
                }}
                onSave={handleSave}
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
                  disabled={isPending}
                >
                  {isPending ? <Spinner className={"text-white"} /> : "네"}
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
