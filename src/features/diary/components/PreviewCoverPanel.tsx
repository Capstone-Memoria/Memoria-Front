import Button from "@/components/base/Button";

interface PreviewCoverPanelProps {
  onBack: () => void;
}

export const PreviewCoverPanel = ({ onBack }: PreviewCoverPanelProps) => {
  return (
    <div className={"flex flex-col flex-1 gap-4"}>
      <div className={"text-xl text-center mt-4"}>커버 이미지 미리보기</div>

      <div className={"flex-1 flex"}>
        <div
          className={
            "w-full flex-1 bg-gray-200 rounded-lg flex items-center justify-center"
          }
        >
          <span className={"text-gray-400"}>이미지 로딩 중...</span>
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
            // TODO: 이미지 선택 로직 구현
          }}
        >
          이 이미지로 선택
        </Button>
      </div>
    </div>
  );
};
