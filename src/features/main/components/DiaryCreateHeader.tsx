import { HTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";
import Page from "@/components/page/Page";
import Button from "@/components/base/Button";

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  logoType?: "default" | "back";
  success: boolean;
}

const DiaryCreateHeader: React.FC<HeaderProps> = ({ success, ...props }) => {
  /* Properties */
  const navigate = useNavigate();

  /* Handlers */
  const handleBack = () => {
    navigate(-1);
  };

  const handleSuccess = () => {};

  return (
    <Page.Header {...props}>
      <div className={"text-sm font-normal"} onClick={handleBack}>
        취소
      </div>
      <div className={"text-base font-medium"}>새 일기장</div>
      <Button
        variant={"text"}
        disabled={!success}
        size={"sm"}
        onClick={handleSuccess}
      >
        완료
      </Button>
    </Page.Header>
  );
};

export default DiaryCreateHeader;
