import DefaultHeader from "@/components/layout/DefaultHeader";
import Page from "@/components/page/Page";

const EditDiaryPage = () => {
  return (
    <Page.Container>
      <DefaultHeader logoType={"back"} />
      <Page.Content>일기장 정보 수정 페이지</Page.Content>
    </Page.Container>
  );
};

export default EditDiaryPage;
