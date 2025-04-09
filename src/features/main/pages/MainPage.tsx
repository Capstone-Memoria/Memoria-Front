import Header from "@/components/base/Header";
import PageContainer from "@/components/page/PageContainer";
import { useAuthStore } from "@/stores/AuthenticationStore";

const MainPage = () => {
  const authStore = useAuthStore();

  return (
    <PageContainer>
      <Header />
      <div className={"mt-5"}>
        안녕하세요, {authStore.context?.user?.nickName}님
      </div>
    </PageContainer>
  );
};

export default MainPage;
