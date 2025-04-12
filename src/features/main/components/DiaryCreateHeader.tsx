import Button from "@/components/base/Button";
import Page from "@/components/page/Page";
import { HTMLAttributes } from "react";
import { useNavigate } from "react-router-dom";

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
      <Button
        variant={"text"}
        size={"sm"}
        onClick={handleBack}
        className={"text-base font-normal"}
      >
        취소
      </Button>
      <div className={"text-lg font-normal"}>새 일기장</div>
      <Button
        variant={"text"}
        disabled={!success}
        size={"sm"}
        onClick={handleSuccess}
        className={"text-base font-normal"}
      >
        완료
      </Button>
    </Page.Header>
  );
};

export default DiaryCreateHeader;
