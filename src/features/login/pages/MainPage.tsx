import Header from "@/components/base/Header";
import PageContainer from "@/components/page/PageContainer";

const MainPage = () => {
  return (
    <PageContainer className={"h-full flex flex-col px-6 pb-6"}>
      <Header />
      <div className={"flex-1 min-h-12"} />
    </PageContainer>
  );
};

export default MainPage;
