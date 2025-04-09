import api from "@/api";
import Button from "@/components/base/Button";
import Card from "@/components/base/Card";
import Header from "@/components/base/Header";
import Input from "@/components/base/Input";
import PageContainer from "@/components/page/PageContainer";
import { useAuthStore } from "@/stores/AuthenticationStore";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    authStore.logout();
    navigate("/login");
  };

  // 닉네임 변경 상태
  const [nickName, setNickName] = useState(
    authStore.context?.user?.nickName || ""
  );
  const [isEditingNickname, setIsEditingNickname] = useState(false);

  // 비밀번호 변경 상태
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);

  const { mutate: tryUpdateUser } = useMutation({
    mutationFn: (data: {
      email: string;
      nickName?: string;
      password?: string;
    }) =>
      api.user.updateUser(data.email, {
        nickName: data.nickName,
        password: data.password,
      }),
    onSuccess: (res, vars) => {
      authStore.updateContext({
        user: {
          ...res,
        },
      });

      if (vars.password) {
        setIsPasswordChanged(true);
      }
    },
  });

  // 닉네임 변경 핸들러
  const handleNicknameChange = () => {
    tryUpdateUser({
      email: authStore.context!.user!.email,
      nickName: nickName,
    });
    setIsEditingNickname(false);
  };

  const handlePasswordChange = (
    field: keyof typeof passwords,
    value: string
  ) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 비밀번호 변경 관련 핸들러
  const handlePasswordSubmit = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    tryUpdateUser({
      email: authStore.context!.user!.email,
      password: passwords.newPassword,
    });
    setIsChangingPassword(false);
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
  };

  // 카드 스타일 공통 클래스

  return (
    <PageContainer>
      <Header logoType={"back"} />
      <div className={"mt-5 flex flex-col gap-5"}>
        {/* 사용자 정보 카드 */}
        <Card>
          <h2 className={"text-lg font-medium mb-4"}>사용자 정보</h2>
          <div className={"flex flex-col gap-2"}>
            <div className={"flex justify-between items-center"}>
              <span className={"text-gray-500"}>닉네임</span>
              <span>{authStore.context?.user?.nickName}</span>
            </div>
            <div className={"flex justify-between items-center"}>
              <span className={"text-gray-500"}>이메일</span>
              <span>{authStore.context!.user!.email}</span>
            </div>
          </div>
          <div className={"mt-4"}>
            <Button className={"w-full"} onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        </Card>

        {/* 닉네임 변경 카드 */}
        <Card>
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
        </Card>

        {/* 비밀번호 변경 카드 */}
        <Card>
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
            <Button
              onClick={() => {
                setIsChangingPassword(true);
                setIsPasswordChanged(false);
              }}
            >
              비밀번호 변경하기
            </Button>
          )}

          {isPasswordChanged && (
            <div className={"text-green-600 mt-4 flex items-center gap-2"}>
              <IoMdCheckmark />
              비밀번호가 성공적으로 변경되었습니다.
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
};

export default ProfilePage;
