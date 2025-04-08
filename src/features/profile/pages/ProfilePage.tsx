import api from "@/api";
import Button from "@/components/base/Button";
import Header from "@/components/base/Header";
import Input from "@/components/base/Input";
import PageContainer from "@/components/page/PageContainer";
import { useAuthStore } from "@/stores/AuthenticationStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const ProfilePage = () => {
  const authStore = useAuthStore();
  const userEmail = authStore.context?.user?.email ?? "";
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["user", userEmail],
    queryFn: () => api.user.getUser(userEmail),
    enabled: !!userEmail,
  });

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

  const { mutate: tryUpdateUser } = useMutation({
    mutationFn: (data: {
      userEmail: string;
      nickName?: string;
      password?: string;
    }) =>
      api.user.updateUser(
        data.userEmail,
        data.nickName ?? "",
        data.password ?? ""
      ),
    onSuccess: (_, variables) => {
      // 사용자 정보 다시 불러오기
      queryClient.invalidateQueries({
        queryKey: ["user", variables.userEmail],
      });
    },
  });

  // 닉네임 변경 핸들러
  const handleNicknameChange = () => {
    if (!userEmail) return;

    tryUpdateUser({
      userEmail,
      nickName,
    });
    alert("닉네임이 변경되었습니다.");
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
    if (!userEmail) return;

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    tryUpdateUser({
      userEmail: userEmail,
      password: passwords.newPassword,
    });

    alert("비밀번호가 변경되었습니다.");
    setIsChangingPassword(false);
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
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
              <span>{userEmail}</span>
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
