import Button from "@/components/base/Button";
import Page from "@/components/page/Page";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

interface WriteDiaryPageHeaderProps {
  onBackClick: () => void;
  canSubmit: boolean;
  onSubmitClick: () => void;
}

const WriteDiaryPageHeader = ({
  onBackClick,
  canSubmit,
  onSubmitClick,
}: WriteDiaryPageHeaderProps) => {
  return (
    <Page.Header>
      <div className={"text-2xl pr-4"}>
        <MdOutlineKeyboardBackspace onClick={onBackClick} />
      </div>
      <div className={"text-lg"}>일기 작성하기</div>
      <Button
        variant={"text"}
        disabled={!canSubmit}
        size={"sm"}
        className={"text-sm font-normal"}
        onClick={onSubmitClick}
      >
        완료
      </Button>
    </Page.Header>
  );
};

export default WriteDiaryPageHeader;
