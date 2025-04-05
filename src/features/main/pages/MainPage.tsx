import Button from "@/components/base/Button";
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
      <div>안녕하세요, {authStore.context?.user?.nickName}님</div>
      <div className={"mt-4"}>
        <Button onClick={handleLogout}>로그아웃</Button>
      </div>
    </PageContainer>
  );
};

export default MainPage;
