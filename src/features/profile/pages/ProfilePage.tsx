import Button from "@/components/base/Button";
import Header from "@/components/base/Header";
import Input from "@/components/base/Input";
import PageContainer from "@/components/page/PageContainer";
import { useAuthStore } from "@/stores/AuthenticationStore";
import { useState } from "react";

const ProfilePage = () => {
  const authStore = useAuthStore();
  const user = authStore.context?.user;

  // 닉네임 변경 상태
  const [nickName, setNickName] = useState(user?.nickName || "");
  const [isEditingNickname, setIsEditingNickname] = useState(false);

  // 비밀번호 변경 상태
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // 닉네임 변경 핸들러
  const handleNicknameChange = () => {
    // API 연결은 아직 하지 않음
    console.log("닉네임 변경:", nickName);
    setIsEditingNickname(false);
    // 성공 메시지 표시
    alert("닉네임이 변경되었습니다.");
  };

  // 비밀번호 변경 관련 핸들러
  const handlePasswordChange = (
    field: keyof typeof passwords,
    value: string
  ) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 비밀번호 변경 제출 핸들러
  const handlePasswordSubmit = () => {
    // 비밀번호 유효성 검사
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (passwords.newPassword.length < 6) {
      setPasswordError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    // API 연결은 아직 하지 않음
    console.log("비밀번호 변경:", passwords);
    setIsChangingPassword(false);
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    // 성공 메시지 표시
    alert("비밀번호가 변경되었습니다.");
  };

  // 카드 스타일 공통 클래스
  const cardClass = "bg-white rounded-xl p-5 shadow-sm mb-4";

  return (
    <PageContainer>
      <Header />
      <div className={"mt-5 flex flex-col gap-5"}>
        {/* 사용자 정보 카드 */}
        <div className={cardClass}>
          <h2 className={"text-lg font-medium mb-4"}>사용자 정보</h2>
          <div className={"flex flex-col gap-2"}>
            <div className={"flex justify-between items-center"}>
              <span className={"text-gray-500"}>닉네임</span>
              <span>{user?.nickName}</span>
            </div>
            <div className={"flex justify-between items-center"}>
              <span className={"text-gray-500"}>이메일</span>
              <span>{user?.email}</span>
            </div>
          </div>
        </div>

        {/* 닉네임 변경 카드 */}
        <div className={cardClass}>
          <h2 className={"text-lg font-medium mb-4"}>닉네임 변경</h2>
          {isEditingNickname ? (
            <div className={"flex flex-col gap-4"}>
              <Input
                className={"w-full"}
                label={"새 닉네임"}
                placeholder={"새로운 닉네임을 입력하세요"}
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
              />
              <div className={"flex justify-end gap-2"}>
                <Button
                  onClick={() => setIsEditingNickname(false)}
                  className={"bg-gray-200 text-black"}
                  size={"sm"}
                >
                  취소
                </Button>
                <Button onClick={handleNicknameChange} size={"sm"}>
                  저장
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setIsEditingNickname(true)}>
              닉네임 변경하기
            </Button>
          )}
        </div>

        {/* 비밀번호 변경 카드 */}
        <div className={cardClass}>
          <h2 className={"text-lg font-medium mb-4"}>비밀번호 변경</h2>
          {isChangingPassword ? (
            <div className={"flex flex-col gap-4"}>
              <Input
                className={"w-full"}
                label={"현재 비밀번호"}
                type={"password"}
                placeholder={"현재 비밀번호를 입력하세요"}
                value={passwords.currentPassword}
                onChange={(e) =>
                  handlePasswordChange("currentPassword", e.target.value)
                }
              />
              <Input
                className={"w-full"}
                label={"새 비밀번호"}
                type={"password"}
                placeholder={"새 비밀번호를 입력하세요"}
                value={passwords.newPassword}
                onChange={(e) =>
                  handlePasswordChange("newPassword", e.target.value)
                }
              />
              <Input
                className={"w-full"}
                label={"새 비밀번호 확인"}
                type={"password"}
                placeholder={"새 비밀번호를 다시 입력하세요"}
                value={passwords.confirmPassword}
                onChange={(e) =>
                  handlePasswordChange("confirmPassword", e.target.value)
                }
                helperText={passwordError}
                isError={!!passwordError}
              />
              <div className={"flex justify-end gap-2"}>
                <Button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordError("");
                    setPasswords({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className={"bg-gray-200 text-black"}
                  size={"sm"}
                >
                  취소
                </Button>
                <Button onClick={handlePasswordSubmit} size={"sm"}>
                  변경
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setIsChangingPassword(true)}>
              비밀번호 변경하기
            </Button>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default ProfilePage;
