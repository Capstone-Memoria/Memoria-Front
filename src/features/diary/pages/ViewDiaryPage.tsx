import Page from "@/components/page/Page";
import { IoMdArrowBack, IoMdCalendar, IoMdMore } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const ViewDiaryPage = () => {
  /* Properties */
  const navigate = useNavigate();

  return (
    <Page.Container>
      <Page.Header>
        <div className={"text-2xl"}>
          <IoMdArrowBack onClick={() => navigate(-1)} />
        </div>
        <div>일기장 제목</div>
        <div className={"flex text-2xl"}>
          <div className={"p-2"}>
            <IoMdCalendar />
          </div>
          <div className={"p-2"}>
            <IoMdMore />
          </div>
        </div>
      </Page.Header>
      <Page.Content>PageContent</Page.Content>
      <Page.Footer>Footer</Page.Footer>
    </Page.Container>
  );
};

export default ViewDiaryPage;
