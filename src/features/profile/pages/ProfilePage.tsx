import api from "@/api";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import Header from "@/components/layout/DefaultHeader";
import Page from "@/components/page/Page";
import { cn } from "@/lib/utils";
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

  const [nickName, setNickName] = useState(
    authStore.context?.user?.nickName || ""
  );
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);

  // 변경하기는 하나만 열기.
  const [openSection, setOpenSection] = useState<
    "nickname" | "password" | null
  >(null);

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

      setNickName(res.nickName);
      if (vars.password) {
        setIsPasswordChanged(true);
      }
    },
  });

  const handleNicknameChange = () => {
    tryUpdateUser({
      email: authStore.context!.user!.email,
      nickName: nickName,
    });
    setOpenSection(null);
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

  const handlePasswordSubmit = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    tryUpdateUser({
      email: authStore.context!.user!.email,
      password: passwords.newPassword,
    });

    setOpenSection(null);
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
  };

  return (
    <Page.Container>
      <Header logoType={"back"} />
      <Page.Content>
        <div className={"flex flex-col gap-5 px-2"}>
          {/* 사용자 정보 */}
          <div className={"pt-7 text-base"}>
            <h2 className={"text-black text-lg font-medium mb-5"}>
              사용자 정보
            </h2>
            <div className={"flex flex-col gap-5"}>
              <div className={"flex justify-between items-center"}>
                <span className={"text-gray-900 font-normal"}>닉네임</span>
                <span className={"text-gray-5"}>
                  {authStore.context?.user?.nickName}
                </span>
              </div>
              <div className={"flex justify-between items-center"}>
                <span className={"text-gray-900 font-normal"}>이메일</span>
                <span className={"text-gray-5"}>
                  {authStore.context?.user?.email}
                </span>
              </div>
            </div>
          </div>

          {/* 구분선 */}
          <div
            className={
              "my-2 border-x-0 border-b-0 flex items-center border border-solid border-gray-4"
            }
          />

          <div>
            <Button
              variant={"text"}
              className={"px-0 py-0 text-base font-normal"}
              onClick={() =>
                setOpenSection((prev) =>
                  prev === "nickname" ? null : "nickname"
                )
              }
            >
              닉네임 변경하기
            </Button>

            <div
              className={cn(
                "transition-all duration-300 ease-in-out overflow-hidden",
                openSection === "nickname"
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              )}
            >
              <div className={"mt-5 flex flex-col gap-4"}>
                <Input
                  className={"w-full"}
                  label={"새 닉네임을 입력해주세요."}
                  labelClassName={"text-black"}
                  placeholder={"새로운 닉네임을 입력하세요"}
                  value={nickName}
                  onChange={(e) => setNickName(e.target.value)}
                />
                <div className={"flex justify-end gap-2"}>
                  <Button
                    onClick={() => setOpenSection(null)}
                    className={"px-3 rounded-md bg-gray-200 text-black"}
                    size={"sm"}
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleNicknameChange}
                    className={"px-3 rounded-md"}
                    size={"sm"}
                  >
                    저장
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Button
              variant={"text"}
              className={"px-0 py-0 text-base font-normal"}
              onClick={() =>
                setOpenSection((prev) =>
                  prev === "password" ? null : "password"
                )
              }
            >
              비밀번호 변경하기
            </Button>

            <div
              className={cn(
                "transition-all duration-300 ease-in-out overflow-hidden",
                openSection === "password"
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              )}
            >
              <div className={"mt-5 flex flex-col gap-4"}>
                <Input
                  className={"w-full"}
                  label={"현재 비밀번호"}
                  labelClassName={"text-black"}
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
                  labelClassName={"text-black"}
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
                  labelClassName={"text-black"}
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
                      setOpenSection(null);
                      setPasswordError("");
                      setPasswords({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    className={"px-3 rounded-md bg-gray-200 text-black"}
                    size={"sm"}
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handlePasswordSubmit}
                    className={"px-3 rounded-md"}
                    size={"sm"}
                  >
                    저장
                  </Button>
                </div>
              </div>
            </div>

            {isPasswordChanged && (
              <div className={"text-green-600 mt-4 flex items-center gap-2"}>
                <IoMdCheckmark />
                비밀번호가 성공적으로 변경되었습니다.
              </div>
            )}
          </div>

          {/* 구분선 */}
          <div
            className={
              "my-2 border-x-0 border-b-0 flex items-center border border-solid border-gray-4"
            }
          />

          <Button
            variant={"text"}
            className={"text-left px-0 py-0 text-base font-normal"}
            onClick={handleLogout}
          >
            로그아웃
          </Button>
          <Button
            variant={"text"}
            className={
              "text-left w-fit px-0 py-0 text-sm text-[#8F8F8F] border-b border-[#8F8F8F] font-normal"
            }
            onClick={handleLogout}
          >
            탈퇴하기
          </Button>
        </div>
      </Page.Content>
    </Page.Container>
  );
};

export default ProfilePage;
