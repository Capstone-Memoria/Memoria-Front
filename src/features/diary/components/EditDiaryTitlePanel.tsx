import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import React, { HTMLAttributes } from "react";

interface EditDiaryTitlePanelProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  setTitle: (title: string) => void;
  onCancel?: () => void;
}

const EditDiaryTitlePanel: React.FC<EditDiaryTitlePanelProps> = ({
  title,
  setTitle,
  onCancel,
}) => {
  const [isFormValid, setIsFormValid] = React.useState(true);

  React.useEffect(() => {
    setIsFormValid(title.trim().length > 0);
  }, [title]);

  return (
    <div>
      <Input
        className={"w-full text-sm"}
        variant={"white"}
        placeholder={"일기장 제목을 입력하세요"}
        label={"일기장 제목을 입력해주세요."}
        labelClassName={"text-black mb-2 text-sm"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {/* error message */}
      {!isFormValid && (
        <div className={"text-red-500 text-xs mt-1"}>제목을 입력해주세요.</div>
      )}
      {/* 저장 및 취소 버튼 */}
      {/* input에 아무것도 입력 안하면 저장 안되게 */}
      <div className={"flex justify-end gap-2 my-3"}>
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

export default EditDiaryTitlePanel;
