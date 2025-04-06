import Button from "@/components/base/Button";
import Header from "@/components/base/Header";
import PageContainer from "@/components/page/PageContainer";
import { useAuthStore } from "@/stores/AuthenticationStore";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    authStore.logout();
    navigate("/login");
  };

  return (
    <PageContainer>
      <Header />
      <div className={"mt-5"}>
        안녕하세요, {authStore.context?.user?.nickName}님
      </div>
      <div className={"mt-4"}>
        <Button onClick={handleLogout}>로그아웃</Button>
      </div>
    </PageContainer>
  );
};

export default MainPage;
