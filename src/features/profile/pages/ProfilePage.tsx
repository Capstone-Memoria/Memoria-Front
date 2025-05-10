import api from "@/api";
import { directInviteAccept, fetchInvitations } from "@/api/invitation";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import Modal from "@/components/base/Modal";
import SectionMessage from "@/components/base/SectionMessage";
import Spinner from "@/components/base/Spinner";
import Header from "@/components/layout/DefaultHeader";
import Page from "@/components/page/Page";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { DirectInvaitation } from "@/models/DiaryBook";
import { useAuthStore } from "@/stores/AuthenticationStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface UpdateUserVariables {
  email: string;
  nickName?: string;
  currentPassword?: string;
  newPassword?: string;
}

const ProfilePage = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
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
  const [openedPanel, setOpenedPanel] = useState<string>("");
  const [disposed, setDisposed] = useState(false);

  const handleLogout = () => {
    authStore.logout();
    navigate("/login", { replace: true });
  };

  const {
    mutate: tryUpdateUser,
    error,
    isPending,
  } = useMutation({
    mutationFn: (
      data: UpdateUserVariables // variables 타입 사용
    ) => {
      setDisposed(false);
      return api.user.updateUser(data.email, {
        nickName: data.nickName,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
    },
    onSuccess: (res, variables) => {
      authStore.updateContext({
        user: {
          ...res,
        },
      });
      setNickName(res.nickName);

      if (variables.newPassword) {
        // variables 사용
        setIsPasswordChanged(true);
      }
      setTimeout(() => setIsPasswordChanged(false), 5000);
    },
  });

  const handleNicknameChange = () => {
    if (!authStore.context?.user?.email) return; // 이메일 없을 경우 처리
    tryUpdateUser({
      email: authStore.context.user.email,
      nickName: nickName,
    });
    setOpenedPanel("");
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
    if (!authStore.context?.user?.email) return; // 이메일 없을 경우 처리

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    tryUpdateUser({
      email: authStore.context.user.email,
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    });

    setOpenedPanel("");
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError(""); // 이전 에러 메시지 초기화
  };

  const {
    data: invitations,
    isLoading: isLoadingInvitations,
    error: invitationsError,
  } = useQuery<DirectInvaitation[], Error>({
    queryKey: ["invitations"],
    queryFn: fetchInvitations,
    enabled: !!authStore.context?.user, // 사용자가 로그인했을 때만 실행
  });

  const { mutate: acceptInvite } = useMutation({
    mutationFn: (invitationId: number) => directInviteAccept(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      // Optionally, show a success message
    },
    onError: (error) => {
      // Optionally, show an error message
      console.error("Failed to accept invitation:", error);
    },
  });

  const { mutate: declineInvite, isPending: isRejecting } = useMutation({
    mutationFn: (invitationId: number) =>
      api.invitation.declineDirectInvite(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      // Optionally, show a success message
    },
    onError: (error) => {
      // Optionally, show an error message
      console.error("Failed to decline invitation:", error);
    },
  });

  const handleAcceptInvitation = (invitationId: number) => {
    acceptInvite(invitationId);
  };

  const handleRejectInvitation = (invitationId: number) => {
    declineInvite(invitationId);
  };

  return (
    <Page.Container>
      <Header logoType={"back"} />
      <Page.Content>
        {error && !disposed && (
          <SectionMessage
            variant={"error"}
            title={"오류가 발생했습니다."}
            disposable
            onDispose={() => {
              setDisposed(true);
            }}
          >
            {error?.message}
          </SectionMessage>
        )}
        <div className={"flex flex-col gap-5 px-2"}>
          {/* 사용자 정보 */}
          <div className={"pt-7 text-base"}>
            <div className={"flex gap-3 items-center mb-5"}>
              <h2 className={"text-black text-lg font-medium"}>사용자 정보</h2>
              <Spinner className={cn("", { hidden: !isPending })} />
            </div>
            {authStore.context?.user ? ( // 사용자 정보 로딩 확인
              <div className={"flex flex-col gap-5"}>
                <div className={"flex justify-between items-center"}>
                  <span className={"text-gray-900 font-normal"}>닉네임</span>
                  <span className={"text-gray-5"}>
                    {authStore.context.user.nickName}
                  </span>
                </div>
                <div className={"flex justify-between items-center"}>
                  <span className={"text-gray-900 font-normal"}>이메일</span>
                  <span className={"text-gray-5"}>
                    {authStore.context.user.email}
                  </span>
                </div>
              </div>
            ) : (
              <div>사용자 정보를 불러오는 중입니다...</div> // 로딩 상태 표시
            )}
          </div>
          {/* 구분선 */}
          <div
            className={
              "my-2 border-x-0 border-b-0 flex items-center border border-solid border-gray-4"
            }
          />
          {/* 닉네임 변경 */}
          <Accordion
            type={"single"}
            collapsible
            onValueChange={setOpenedPanel}
            value={openedPanel}
            className={"flex flex-col gap-5"}
          >
            <AccordionItem value={"nickname"} className={"border-none"}>
              <AccordionTrigger className={"py-0"}>
                <div className={"text-base font-normal"}>닉네임 변경하기</div>
              </AccordionTrigger>
              <AccordionContent>
                <div className={"flex flex-col gap-4"}>
                  <Input
                    className={"w-full mt-5 text-sm"}
                    variant={"white"}
                    label={"새 닉네임을 입력해주세요."}
                    labelClassName={"text-black mb-2"}
                    placeholder={"새로운 닉네임을 입력하세요"}
                    value={nickName}
                    onChange={(e) => setNickName(e.target.value)}
                  />
                  <div className={"flex justify-end gap-2"}>
                    <Button
                      onClick={() => setOpenedPanel("")}
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
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value={"password"} className={"border-none"}>
              <AccordionTrigger className={"py-0"}>
                <div className={"p-0 text-base font-normal"}>
                  비밀번호 변경하기
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className={"mt-5 flex flex-col gap-4"}>
                  <Input
                    className={"w-full text-sm"}
                    variant={"white"}
                    label={"현재 비밀번호"}
                    labelClassName={"text-black mb-2"}
                    type={"password"}
                    placeholder={"현재 비밀번호를 입력하세요"}
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      handlePasswordChange("currentPassword", e.target.value)
                    }
                  />
                  <Input
                    className={"w-full text-sm"}
                    variant={"white"}
                    label={"새 비밀번호"}
                    labelClassName={"text-black mb-2"}
                    type={"password"}
                    placeholder={"새 비밀번호를 입력하세요"}
                    value={passwords.newPassword}
                    onChange={(e) =>
                      handlePasswordChange("newPassword", e.target.value)
                    }
                  />
                  <Input
                    className={"w-full text-sm"}
                    variant={"white"}
                    label={"새 비밀번호 확인"}
                    labelClassName={"text-black mb-2"}
                    type={"password"}
                    placeholder={"새 비밀번호를 다시 입력하세요"}
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      handlePasswordChange("confirmPassword", e.target.value)
                    }
                    helperText={passwordError}
                    isError={!!passwordError} // passwordError 상태에 따라 에러 표시
                  />
                  <div className={"flex justify-end gap-2"}>
                    <Button
                      onClick={() => {
                        setOpenedPanel("");
                        setPasswordError(""); // 취소 시 에러 초기화
                        setPasswords({
                          // 취소 시 입력 필드 초기화
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
                  {isPasswordChanged && (
                    <div
                      className={"text-green-600 mt-4 flex items-center gap-2"}
                    >
                      <IoMdCheckmark />
                      비밀번호가 성공적으로 변경되었습니다.
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* 구분선 */}
          <div
            className={
              "my-2 border-x-0 border-b-0 flex items-center border border-solid border-gray-4"
            }
          />
          {/* 받은 초대 목록 */}
          <div className={"pt-7 text-base"}>
            <div className={"flex gap-3 items-center mb-5"}>
              <h2 className={"text-black text-lg font-medium"}>
                받은 초대 목록
              </h2>
              <Spinner className={cn("", { hidden: !isLoadingInvitations })} />
            </div>
            {isLoadingInvitations && <div>초대 목록을 불러오는 중...</div>}
            {invitationsError && (
              <SectionMessage variant={"error"} title={"오류 발생"}>
                초대 목록을 불러오는데 실패했습니다: {invitationsError.message}
              </SectionMessage>
            )}
            {!isLoadingInvitations &&
              !invitationsError &&
              invitations &&
              invitations.length > 0 && (
                <div className={"flex flex-col gap-3"}>
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className={
                        "p-4 border border-gray-300 rounded-md flex justify-between items-center"
                      }
                    >
                      <div>
                        <p className={"font-medium"}>
                          {invitation.diaryBook.title}
                        </p>
                        <p className={"text-sm text-gray-600"}>
                          {invitation.inviteBy.nickName}님의 초대
                        </p>
                      </div>
                      <div className={"flex gap-2"}>
                        <Button
                          size={"sm"}
                          onClick={() => handleAcceptInvitation(invitation.id)}
                        >
                          수락
                        </Button>
                        <Button
                          size={"sm"}
                          onClick={() => handleRejectInvitation(invitation.id)}
                          variant={"secondary"}
                        >
                          거절
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            {!isLoadingInvitations &&
              !invitationsError &&
              (!invitations || invitations.length === 0) && (
                <div>받은 초대가 없습니다.</div>
              )}
          </div>
          {/* 구분선 */}
          <div
            className={
              "my-2 border-x-0 border-b-0 flex items-center border border-solid border-gray-4"
            }
          />
          <div className={"flex flex-col gap-5"}>
            <Button
              variant={"text"}
              className={"text-left px-0 py-0 text-base font-normal"}
              onClick={() => setIsLogoutModalOpen(true)}
            >
              로그아웃
            </Button>
            <Button
              variant={"text"}
              className={
                "text-left w-fit px-0 py-0 text-sm text-[#8F8F8F] border-b border-[#8F8F8F] font-normal"
              }
              onClick={() => alert("탈퇴 기능 구현 필요")} // 임시 처리
            >
              탈퇴하기
            </Button>
          </div>
        </div>
      </Page.Content>

      {/* 로그아웃 모달 */}
      <Modal
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        description={"로그아웃 하시겠어요?"}
      >
        <div className={"mt-7 flex justify-between font-medium"}>
          <Button
            variant={"text"}
            size={"md"}
            className={"p-0"}
            onClick={() => {
              setIsLogoutModalOpen(false);
              handleLogout(); // 로그아웃 실행
            }}
          >
            네
          </Button>
          <Button
            variant={"text"}
            className={"text-red-500 p-0"}
            size={"md"}
            onClick={() => setIsLogoutModalOpen(false)} // 모달만 닫기
          >
            아니오
          </Button>
        </div>
      </Modal>
    </Page.Container>
  );
};

export default ProfilePage;
