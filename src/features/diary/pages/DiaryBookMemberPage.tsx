// src/pages/DiaryBookMemberPage.tsx
import api from "@/api";
import Button from "@/components/base/Button";
import Dialog from "@/components/base/Dialog";
import Input from "@/components/base/Input";
import DefaultHeader from "@/components/layout/DefaultHeader";
import Page from "@/components/page/Page";
import { cn } from "@/lib/utils";
import { DiaryBookMemer } from "@/models/DiaryBook";
import { useAuthStore } from "@/stores/AuthenticationStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FaCrown } from "react-icons/fa";
import { IoMdAdd, IoMdClose, IoMdCopy } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";

const DiaryBookMemberPage = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const { diaryBookId } = useParams<{ diaryBookId: string }>();
  const queryClient = useQueryClient();

  // Invite Link States
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [isGeneratingInvite, setIsGeneratingInvite] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  // Admin Help Tooltip
  const [showAdminHelp, setShowAdminHelp] = useState(false);

  // Direct Invite States
  const [directInviteEmail, setDirectInviteEmail] = useState("");
  const [inviteSuccessMessage, setInviteSuccessMessage] = useState<
    string | null
  >(null);

  // Member Removal Confirmation
  const [memberToRemove, setMemberToRemove] = useState<DiaryBookMemer | null>(
    null
  );

  // Alert Dialog
  const [alertMsg, setAlertMsg] = useState<{
    title: string;
    description?: string;
  } | null>(null);

  // “관리자 변경” 모드 여부
  const [isEditMode, setIsEditMode] = useState(false);

  // ─── Queries ─────────────────────────────────────────────────────────────────

  const {
    data: memberData,
    isLoading: isLoadingMembers,
    error: memberError,
  } = useQuery<DiaryBookMemer[], Error>({
    queryKey: ["fetchDiaryBookMembers", diaryBookId],
    queryFn: () => api.diaryBook.fetchDiaryMembers(Number(diaryBookId)),
    enabled: !!diaryBookId,
  });

  const { data: diaryBook } = useQuery({
    queryKey: ["fetchDiaryBook", diaryBookId],
    queryFn: () => api.diaryBook.fetchDiaryBookById(Number(diaryBookId)),
    enabled: !!diaryBookId,
  });

  // 현재 로그인 사용자가 ADMIN인지
  const amIAdmin = useMemo(() => {
    return memberData?.some(
      (member) =>
        member.user.email === authStore.context?.user?.email &&
        member.permission === "ADMIN"
    );
  }, [memberData, authStore.context?.user?.email]);

  // ─── Mutations ────────────────────────────────────────────────────────────────

  // MEMBER → ADMIN
  const promoteAdminMutation = useMutation({
    mutationFn: (newAdminId: number) =>
      api.diaryBook.addDiaryBookAdmin(Number(diaryBookId), newAdminId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchDiaryBookMembers", diaryBookId],
      });
      setAlertMsg({ title: "새로운 관리자가 지정되었습니다." });
    },
    onError: (error: Error) => {
      setAlertMsg({ title: "새 관리자 지정 실패", description: error.message });
    },
  });

  // ADMIN → MEMBER (POST remove-admin)
  const demoteAdminMutation = useMutation({
    mutationFn: (toRemoveId: number) =>
      api.diaryBook.removeDiaryBookAdmin(Number(diaryBookId), toRemoveId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchDiaryBookMembers", diaryBookId],
      });
      setAlertMsg({ title: "관리자 권한이 해제되었습니다." });
    },
    onError: (error: Error) => {
      setAlertMsg({ title: "권한 해제 실패", description: error.message });
    },
  });

  // 단순 멤버 추방(삭제)
  const removeMemberMutation = useMutation({
    mutationFn: (memberId: number) =>
      api.diaryBook.diaryMemberDelete(Number(diaryBookId), memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchDiaryBookMembers", diaryBookId],
      });
      setAlertMsg({ title: "멤버가 내보내졌습니다." });
    },
    onError: (error: Error) => {
      setAlertMsg({ title: "멤버 내보내기 실패", description: error.message });
    },
  });

  // Invite Link 생성
  const generateInviteMutation = useMutation({
    mutationFn: () => api.invitation.createInviteCode(Number(diaryBookId)),
    onSuccess: (data) => {
      const { inviteCode, diaryBook } = data;
      const inviter = authStore.context!.user!.nickName;
      const fullInviteLink =
        `${window.location.origin}/code-invite/${inviteCode}` +
        `?diaryName=${encodeURIComponent(diaryBook.title)}` +
        `&inviter=${encodeURIComponent(inviter)}`;
      setInviteLink(fullInviteLink);
      setIsGeneratingInvite(true);
      setIsLinkCopied(false);
    },
    onError: (error: Error) => {
      setAlertMsg({ title: "초대 링크 생성 실패", description: error.message });
    },
  });

  // Direct Invite by Email
  const directInviteMutation = useMutation({
    mutationFn: (email: string) =>
      api.invitation.directInvite(Number(diaryBookId), email),
    onSuccess: (_data, email) => {
      setInviteSuccessMessage(`'${email}'님에게 초대 요청을 보냈습니다.`);
      setDirectInviteEmail("");
      setTimeout(() => setInviteSuccessMessage(null), 3000);
    },
    onError: (error: Error) => {
      setAlertMsg({ title: "직접 초대 실패", description: error.message });
      setInviteSuccessMessage(null);
    },
  });

  // ─── Handlers ─────────────────────────────────────────────────────────────────

  // MEMBER → ADMIN
  const handlePromoteAdmin = (member: DiaryBookMemer) => {
    if (!amIAdmin) return;
    promoteAdminMutation.mutate(member.id);
  };

  // ADMIN → MEMBER (권한 강등)
  const handleDemoteAdmin = (member: DiaryBookMemer) => {
    if (!amIAdmin) return;
    demoteAdminMutation.mutate(member.id);
  };

  // 멤버 추방용
  const handleRemoveMember = (member: DiaryBookMemer) => {
    if (!amIAdmin) return;
    setMemberToRemove(member);
  };

  const confirmRemove = () => {
    if (!memberToRemove) return;
    removeMemberMutation.mutate(memberToRemove.id);
    setMemberToRemove(null);
  };

  // Invite Link 생성
  const handleGenerateInvite = () => {
    generateInviteMutation.mutate();
  };

  // Invite Link 복사
  const handleCopyLink = () => {
    if (inviteLink) {
      navigator.clipboard
        .writeText(inviteLink)
        .then(() => {
          setIsLinkCopied(true);
          setTimeout(() => setIsLinkCopied(false), 2000);
        })
        .catch((err) => {
          setAlertMsg({
            title: "링크 복사에 실패했습니다.",
            description: err.message,
          });
        });
    }
  };

  // Direct Invite by Email
  const handleDirectInvite = () => {
    if (!directInviteEmail.trim() || !/\S+@\S+\.\S+/.test(directInviteEmail)) {
      setAlertMsg({ title: "유효한 이메일 주소를 입력해주세요." });
      return;
    }
    directInviteMutation.mutate(directInviteEmail.trim());
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  if (isLoadingMembers) {
    return (
      <Page.Container>
        <DefaultHeader logoType={"back"} />
        <Page.Content className={"flex justify-center items-center h-full"}>
          <p>멤버 정보를 불러오는 중...</p>
        </Page.Content>
      </Page.Container>
    );
  }

  if (memberError) {
    return (
      <Page.Container>
        <DefaultHeader logoType={"back"} />
        <Page.Content className={"px-6 py-4 text-red-500"}>
          멤버 정보를 불러오는데 실패했습니다: {memberError.message}
        </Page.Content>
      </Page.Container>
    );
  }

  return (
    <Page.Container>
      <DefaultHeader logoType={"back"} />
      <Page.Content className={"px-6 py-8"}>
        <h1 className={"text-xl font-medium mb-6"}>
          {diaryBook?.title} | 멤버 관리
        </h1>

        {/* ── Member List Card ───────────────────────────────────────────────── */}
        <div className={"mb-6 rounded-md bg-white p-4"}>
          <div className={"flex justify-between items-center mb-4"}>
            <p>멤버 목록</p>
            {amIAdmin && (
              <div className={"relative flex items-center gap-3"}>
                {/* 관리자 변경 버튼 */}
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  disabled={
                    promoteAdminMutation.isPending ||
                    demoteAdminMutation.isPending ||
                    removeMemberMutation.isPending
                  }
                  className={
                    "text-xs text-gray-600 underline underline-offset-4"
                  }
                >
                  {isEditMode ? "완료" : "관리자 변경"}
                </button>

                {/* 물음표 버튼 */}
                <button
                  onClick={() => setShowAdminHelp(!showAdminHelp)}
                  className={
                    "size-4 rounded-full border border-gray-400 flex items-center justify-center text-xs font-bold text-gray-600"
                  }
                >
                  ?
                </button>

                {/* 도움말 툴팁 */}
                {showAdminHelp && (
                  <div
                    className={
                      "absolute top-[120%] right-0 z-10 w-[240px] bg-green-600 text-white text-sm p-3 rounded-md shadow-md"
                    }
                  >
                    <div
                      className={
                        "absolute -top-2 right-3 w-0 h-0 border-l-8 border-r-8 border-b-[8px] border-l-transparent border-r-transparent border-b-green-600"
                      }
                    />
                    일기장의 관리자만 멤버 삭제 및 추가가 가능합니다.
                    <br />
                    관리자 변경을 통해 관리자를 설정해보세요.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={"flex flex-col gap-1"}>
            {memberData?.map((member) => (
              <div
                key={member.id}
                className={
                  "flex items-center justify-between py-4 border-b border-gray-400 last:border-b-0"
                }
              >
                {/* ── 좌측: Avatar · Nickname · Email ── */}
                <div className={"flex items-center gap-3"}>
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gray-200"
                    )}
                  >
                    <span className={"text-black-600 text-lg font-medium"}>
                      {member.user.nickName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className={"flex items-center gap-1.5"}>
                      <span className={"font-medium text-[15px]"}>
                        {member.user.nickName}
                      </span>
                      {member.permission === "ADMIN" && (
                        <FaCrown
                          className={"text-yellow-500 text-sm"}
                          title={"관리자"}
                        />
                      )}
                    </div>
                    <span className={"text-xs text-gray-400 mt-[2px] block"}>
                      {member.user.email}
                    </span>
                  </div>
                </div>

                {/* ── 우측: Edit 모드일 때만 보이는 버튼들 ── */}
                <div className={"flex items-center gap-2"}>
                  {amIAdmin &&
                    member.user.email !== authStore.context?.user?.email &&
                    isEditMode && (
                      <Button
                        variant={"text"}
                        size={"sm"}
                        onClick={() =>
                          member.permission === "ADMIN"
                            ? handleDemoteAdmin(member)
                            : handlePromoteAdmin(member)
                        }
                        disabled={
                          promoteAdminMutation.isPending ||
                          demoteAdminMutation.isPending
                        }
                        className={cn(
                          "text-sm",
                          member.permission === "ADMIN"
                            ? "text-orange-500 hover:text-orange-700"
                            : "text-blue-500 hover:text-blue-700"
                        )}
                        title={
                          member.permission === "ADMIN"
                            ? "관리자 권한 해제"
                            : "관리자로 지정"
                        }
                      >
                        {member.permission === "ADMIN"
                          ? demoteAdminMutation.isPending &&
                            demoteAdminMutation.variables === member.id
                            ? "해제중..."
                            : "관리자 해제"
                          : promoteAdminMutation.isPending &&
                              promoteAdminMutation.variables === member.id
                            ? "지정중..."
                            : "관리자 지정"}
                      </Button>
                    )}
                  {/* Edit 모드가 아닐 때 보이는 “추방” 버튼(원하면) */}
                  {!isEditMode &&
                    amIAdmin &&
                    member.user.email !== authStore.context?.user?.email && (
                      <Button
                        variant={"text"}
                        size={"sm"}
                        className={"text-gray-400 hover:text-red-500"}
                        onClick={() => handleRemoveMember(member)}
                        disabled={removeMemberMutation.isPending}
                        title={"멤버 내보내기"}
                      >
                        {removeMemberMutation.isPending &&
                        removeMemberMutation.variables === member.id ? (
                          "삭제중..."
                        ) : (
                          <IoMdClose size={20} />
                        )}
                      </Button>
                    )}
                  {/* 본인일 경우, Edit 모드에서 (나) 표시 */}
                  {member.user.email === authStore.context?.user?.email &&
                    isEditMode && (
                      <span className={"text-xs text-gray-400 mr-2"}>(나)</span>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* ──────────────────────────────────────────────────────────────────────── */}

        {/* Invite via Link Card */}
        <div className={"mb-6 rounded-md bg-white p-4"}>
          <p className={"mb-4"}>멤버 초대 링크</p>
          {isGeneratingInvite && inviteLink ? (
            <div className={"flex flex-col gap-4"}>
              <div
                className={"flex items-center gap-2 bg-gray-100 p-3 rounded-md"}
              >
                <span className={"text-sm flex-1 break-all"}>{inviteLink}</span>
                <Button
                  variant={"text"}
                  size={"sm"}
                  onClick={handleCopyLink}
                  title={"링크 복사"}
                >
                  <IoMdCopy className={"size-5"} />
                </Button>
              </div>
              {isLinkCopied && (
                <p className={"text-xs text-green-500"}>
                  링크가 클립보드에 복사되었습니다!
                </p>
              )}
              <div className={"flex gap-2 justify-end"}>
                <Button
                  variant={"secondary"}
                  size={"sm"}
                  className={"text-xs rounded-md"}
                  onClick={() => {
                    setIsGeneratingInvite(false);
                    setInviteLink(null);
                  }}
                >
                  닫기
                </Button>
                <Button
                  size={"sm"}
                  onClick={handleGenerateInvite}
                  disabled={generateInviteMutation.isPending}
                  className={"text-xs rounded-md"}
                >
                  {generateInviteMutation.isPending
                    ? "생성중..."
                    : "새 링크 생성"}
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className={"text-sm text-gray-500 mb-4"}>
                멤버를 초대하려면 초대 링크를 생성하여 공유하세요.
                <br />
                초대 링크는 7일간 유효합니다.
              </p>
              <Button
                size={"sm"}
                className={"flex items-center gap-2"}
                onClick={handleGenerateInvite}
                disabled={generateInviteMutation.isPending}
              >
                {generateInviteMutation.isPending ? (
                  "생성중..."
                ) : (
                  <>
                    <IoMdAdd />
                    초대 링크 생성
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Direct Invite Card */}
        <div className={"mb-6 rounded-md bg-white p-4"}>
          <p className={"mb-4"}>멤버 직접 초대</p>
          <p className={"text-sm text-gray-500 mb-4"}>
            이메일 주소를 입력하여 멤버를 직접 초대하세요.
            <br />
            상대방에게 초대 알림이 전송됩니다.
          </p>
          <div className={"flex flex-col gap-3"}>
            <div className={"flex flex-col gap-4"}>
              <Input
                type={"email"}
                placeholder={"초대할 멤버의 이메일 주소"}
                value={directInviteEmail}
                onChange={(e) => setDirectInviteEmail(e.target.value)}
                className={"w-full"}
                aria-label={"초대할 멤버 이메일"}
                disabled={directInviteMutation.isPending}
              />
              <Button
                size={"md"}
                onClick={handleDirectInvite}
                className={"text-base rounded-md"}
                disabled={
                  !directInviteEmail.trim() || directInviteMutation.isPending
                }
              >
                {directInviteMutation.isPending ? "전송중..." : "초대 보내기"}
              </Button>
            </div>
            {inviteSuccessMessage && (
              <p className={"text-xs text-green-600 mt-1"}>
                {inviteSuccessMessage}
              </p>
            )}
          </div>
        </div>
      </Page.Content>

      {/* Member Removal Confirmation Dialog */}
      <Dialog
        open={!!memberToRemove}
        title={`${memberToRemove?.user.nickName} 님을 일기장에서 삭제하시겠어요?`}
        confirmLabel={"멤버 삭제"}
        cancelLabel={"취소"}
        onConfirm={confirmRemove}
        onClose={() => setMemberToRemove(null)}
      />

      {/* Alert Dialog */}
      <Dialog
        open={!!alertMsg}
        title={alertMsg?.title ?? ""}
        description={alertMsg?.description}
        onConfirm={() => setAlertMsg(null)}
        onClose={() => setAlertMsg(null)}
      />
    </Page.Container>
  );
};

export default DiaryBookMemberPage;
