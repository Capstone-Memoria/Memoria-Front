import Header from "@/components/base/Header";
import PageContainer from "@/components/page/PageContainer";

const ProfilePage = () => {
  return (
    <PageContainer>
      <Header />
      <div className={"mt-5"}>
        <p>닉네임 변경</p>
        <p>비밀번호 변경</p>
      </div>
    </PageContainer>
  );
};

export default ProfilePage;
