import Button from "@/components/base/Button";
import Page from "@/components/page/Page";
import { HTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  logoType?: "default" | "back";
  isSubmitable: boolean;
  isCreating?: boolean;
  onSubmit?: () => void;
}

const DiaryCreateHeader: React.FC<HeaderProps> = ({
  isSubmitable,
  isCreating,
  onSubmit,
  ...props
}) => {
  /* Properties */
  const navigate = useNavigate();

  /* Handlers */
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Page.Header {...props}>
      <Button
        variant={"text"}
        size={"sm"}
        onClick={handleBack}
        className={"text-sm font-normal"}
      >
        취소
      </Button>
      <div className={"text-base font-normal"}>새 일기장</div>
      <Button
        variant={"text"}
        disabled={!isSubmitable}
        size={"sm"}
        className={"text-sm font-normal"}
        onClick={() => {
          if (isCreating) return;
          onSubmit?.();
        }}
      >
        완료
      </Button>
    </Page.Header>
  );
};

export default DiaryCreateHeader;
