import Button from "@/components/base/Button";
import DiaryCoverCarousel from "@/components/diary/DiaryCoverCarousel";
import { HTMLAttributes } from "react";

interface EditDiaryCoverPanelProps extends HTMLAttributes<HTMLDivElement> {
  onCancel?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
}

const EditDiaryCoverPanel: React.FC<EditDiaryCoverPanelProps> = ({
  onCancel,
  onSave,
  isSaving = false,
  ...props
}) => {
  //TODO: 일기장 커버 스타일 목록 가져오기
  return (
    <div {...props}>
      <div className={"mt-2 px-6"}>
        <p className={"text-sm font-normal"}>
          일기장 커버 스타일을 다시 선택해주세요.
        </p>
        <DiaryCoverCarousel
          items={[]}
          className={"w-fit h-full py-8"}
          onSelectChange={() => {}}
        />
      </div>
      <div className={"flex gap-8 justify-center mt-5"}>
        <Button
          size={"sm"}
          className={"w-36 rounded-sm bg-gray-200"}
          variant={"secondary"}
        >
          AI로 배경사진 만들기
        </Button>
        <Button
          size={"sm"}
          className={"w-36 rounded-sm bg-gray-200"}
          variant={"secondary"}
        >
          사진 업로드
        </Button>
      </div>
      <div className={"flex justify-center gap-2 my-6"}>
        <Button
          className={"px-3 rounded-md bg-gray-200 text-black"}
          size={"sm"}
          onClick={() => onCancel?.()}
        >
          취소
        </Button>
        <Button className={"px-3 rounded-md"} size={"sm"}>
          저장
        </Button>
      </div>
    </div>
  );
};

export default EditDiaryCoverPanel;
