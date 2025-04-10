import DefaultHeader from "@/components/layout/DefaultHeader";
import Page from "@/components/page/Page";

const DiaryMemberPage = () => {
  return (
    <Page.Container>
      <DefaultHeader logoType={"back"} />
      <Page.Content>일기장 멤버 관리 페이지</Page.Content>
    </Page.Container>
  );
};

export default DiaryMemberPage;
