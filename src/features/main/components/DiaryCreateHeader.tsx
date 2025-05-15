import Button from "@/components/base/Button";
import Page from "@/components/page/Page";
import { HTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  logoType?: "default" | "back";
  isSubmitable: boolean;
  isCreating?: boolean;
}

const DiaryCreateHeader: React.FC<HeaderProps> = ({
  isSubmitable,
  isCreating,
  ...props
}) => {
  /* Properties */
  const navigate = useNavigate();

  /* Handlers */
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Page.Header className={"flex relative"} {...props}>
      <Button
        variant={"text"}
        size={"sm"}
        onClick={handleBack}
        className={"text-sm font-normal"}
      >
        취소
      </Button>
      <div
        className={"absolute left-1/2 -translate-x-1/2 text-base font-normal"}
      >
        새 일기장
      </div>
    </Page.Header>
  );
};

export default DiaryCreateHeader;
