import Button from "@/components/base/Button";
import { ImageIcon } from "lucide-react";

interface PreviewCoverPanelProps {
  onBack: () => void;
  imageBase64?: string;
  isError?: boolean;
  onConfirm?: () => void;
}

export const PreviewCoverPanel = ({
  onBack,
  imageBase64,
  isError,
  onConfirm,
}: PreviewCoverPanelProps) => {
  return (
    <div className={"flex flex-col flex-1 gap-4"}>
      <div className={"text-xl text-center mt-4"}>커버 이미지 미리보기</div>

      <div className={"flex-1 flex"}>
        <div
          className={
            "w-full flex-1 bg-gray-200 rounded-lg flex items-center justify-center"
          }
        >
          {isError ? (
            <div className={"flex flex-col items-center gap-2"}>
              <ImageIcon className={"w-12 h-12 text-red-500"} />
              <span className={"text-red-500"}>
                이미지 로딩 중 에러가 발생했습니다.
              </span>
            </div>
          ) : imageBase64 ? (
            <img
              src={`data:image/png;base64,${imageBase64}`}
              alt={"Preview"}
              className={"max-w-full max-h-full object-contain rounded-lg"}
            />
          ) : (
            <div className={"flex flex-col items-center gap-2"}>
              <ImageIcon className={"w-12 h-12 text-gray-400 animate-bounce"} />
              <span className={"text-gray-400"}>이미지 로딩 중...</span>
            </div>
          )}
        </div>
      </div>

      <div className={"mb-6 flex flex-col gap-3"}>
        <Button
          variant={"secondary"}
          className={"w-full"}
          size={"xl"}
          onClick={onBack}
        >
          다시 만들기
        </Button>
        <Button
          className={"w-full"}
          size={"xl"}
          variant={"blue"}
          onClick={() => {
            if (onConfirm) {
              onConfirm();
            }
          }}
          disabled={!imageBase64 || isError}
        >
          이 이미지로 선택
        </Button>
      </div>
    </div>
  );
};
