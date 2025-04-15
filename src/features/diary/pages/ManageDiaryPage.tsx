import Button from "@/components/base/Button";
import Page from "@/components/page/Page";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import {
  MdOutlineKeyboardBackspace,
  MdOutlineModeEditOutline,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import EditDiaryCoverPanel from "../components/EditDiaryCoverPanel";
import EditDiaryTitlePanel from "../components/EditDiaryTitlePanel";

const ManageDiaryPage = () => {
  const navigate = useNavigate();
  const [openedPanel, setOpenedPanel] = useState<string>("");

  // 더미 데이터 - 실제로는 API에서 받아올 데이터
  const [diaryData, setDiaryData] = useState({
    id: "1", // 예시 ID
    title: "AO JS 스터디", // 기존 제목
    coverColor: "#4ade80", // 기존 표지 색상 (초록색)
  });

  // 삭제 핸들러
  const handleDelete = () => {
    // API 호출 로직이 여기에 들어갈 예정
    console.log("일기장 삭제:", diaryData.id);
    // 성공 후 이전 페이지로 이동
    navigate(-1);
  };

  // 저장 핸들러
  const handleSave = () => {
    // API 호출 로직이 여기에 들어갈 예정
    console.log("일기장 정보 수정:", diaryData);
    // 성공 후 이전 페이지로 이동
    navigate(-1);
  };

  const handleTitleChange = (title: string) => {
    setDiaryData((prev) => ({
      ...prev,
      title,
    }));
  };

  return (
    <Page.Container>
      <Page.Header className={"grid grid-cols-3 items-center"}>
        <div className={"text-2xl"}>
          <MdOutlineKeyboardBackspace onClick={() => navigate(-1)} />
        </div>
        <div className={"flex justify-center"}>일기장 관리</div>
        <div />
      </Page.Header>
      <Page.Content className={"px-6 py-4"}>
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
                <div className={"text-gray-5"}>{diaryData.title}</div>
                <MdOutlineModeEditOutline />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <EditDiaryTitlePanel
                title={diaryData.title}
                setTitle={handleTitleChange}
                onCancel={() => {
                  setOpenedPanel("");
                }}
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

        <div className={"flex justify-center my-2"}>
          <Button
            variant={"text"}
            onClick={handleDelete}
            className={"p-0 text-sm text-red-400 border-b border-b-red-400"}
          >
            일기장 삭제하기
          </Button>
        </div>
      </Page.Content>
    </Page.Container>
  );
};

export default ManageDiaryPage;
