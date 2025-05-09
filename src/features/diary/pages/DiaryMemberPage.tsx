import api from "@/api";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import DefaultHeader from "@/components/layout/DefaultHeader";
import Page from "@/components/page/Page";
import { cn } from "@/lib/utils";
import { DiaryBookMemer } from "@/models/DiaryBook"; // Import DiaryBookMemer type
import { useAuthStore } from "@/stores/AuthenticationStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FaCrown } from "react-icons/fa";
import { IoMdAdd, IoMdClose, IoMdCopy } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";

const DiaryMemberPage = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const { diaryId } = useParams();
  const diaryBookId = Number(diaryId); // Ensure diaryId is a number
  const queryClient = useQueryClient();

  // State for invite link generation
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [isGeneratingInvite, setIsGeneratingInvite] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  // State for direct invite
  const [directInviteEmail, setDirectInviteEmail] = useState("");
  const [inviteSuccessMessage, setInviteSuccessMessage] = useState<
    string | null
  >(null);

  // Fetch members query
  const {
    data: memberData,
    isLoading: isLoadingMembers,
    error: memberError,
  } = useQuery<DiaryBookMemer[], Error>({
    // Specify types for useQuery
    queryKey: ["fetchDiaryBookMembers", diaryBookId], // Include diaryBookId in queryKey
    queryFn: () => api.diaryBook.fetchDiaryMembers(diaryBookId),
    enabled: !!diaryBookId, // Only run query if diaryBookId is valid
  });

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);

  // Check if current user is admin
  const amIAdmin = useMemo(() => {
    return memberData?.some(
      (member) =>
        member.user.email === authStore.context?.user?.email &&
        member.permission === "ADMIN"
    );
  }, [memberData, authStore.context?.user?.email]);

  // --- Mutations ---

  // Update member permission mutation
  const updatePermissionMutation = useMutation({
    mutationFn: api.diaryBook.updateDiaryMemberPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchDiaryBookMembers", diaryBookId],
      });
      // Optionally show success message
    },
    onError: (error) => {
      console.error("Failed to update permission:", error);
      // Optionally show error message
      alert(`권한 변경 실패: ${error.message}`);
    },
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: ({
      diaryBookId,
      memberId,
    }: {
      diaryBookId: number;
      memberId: number;
    }) => api.diaryBook.diaryMemberDelete(diaryBookId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchDiaryBookMembers", diaryBookId],
      });
      // Optionally show success message
      alert("멤버를 내보냈습니다.");
    },
    onError: (error) => {
      console.error("Failed to remove member:", error);
      // Optionally show error message
      alert(`멤버 내보내기 실패: ${error.message}`);
    },
  });

  // Generate invite link mutation
  // ✅ 수정 부분만 발췌
  const generateInviteMutation = useMutation({
    mutationFn: () => api.invitation.createInviteCode(diaryBookId),
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
  });

  // Direct invite mutation
  const directInviteMutation = useMutation({
    mutationFn: (email: string) =>
      api.invitation.directInvite(diaryBookId, email),
    onSuccess: (data, email) => {
      setInviteSuccessMessage(`'${email}'님에게 초대 요청을 보냈습니다.`);
      setDirectInviteEmail(""); // Clear input field
      setTimeout(() => setInviteSuccessMessage(null), 3000); // Clear message after 3 seconds
    },
    onError: (error) => {
      console.error("Failed to send direct invite:", error);
      alert(`직접 초대 실패: ${error.message}`);
      setInviteSuccessMessage(null);
    },
  });

  // --- Event Handlers ---

  const handleToggleAdmin = (memberId: number, currentPermission: string) => {
    if (!amIAdmin) return;
    const newPermission = currentPermission === "ADMIN" ? "MEMBER" : "ADMIN";
    updatePermissionMutation.mutate({
      diaryBookId,
      memberId,
      permission: newPermission,
    });
  };

  const handleRemoveMember = (memberId: number) => {
    if (!amIAdmin) return;
    if (window.confirm("정말로 이 멤버를 내보내시겠습니까?")) {
      removeMemberMutation.mutate({ diaryBookId, memberId });
    }
  };

  const handleGenerateInvite = () => {
    generateInviteMutation.mutate();
  };

  const handleCopyLink = () => {
    if (inviteLink) {
      navigator.clipboard
        .writeText(inviteLink)
        .then(() => {
          setIsLinkCopied(true);
          setTimeout(() => setIsLinkCopied(false), 2000); // Hide message after 2s
        })
        .catch((err) => {
          console.error("Failed to copy link:", err);
          alert("링크 복사에 실패했습니다.");
        });
    }
  };

  const handleDirectInvite = () => {
    if (!directInviteEmail.trim() || !/\S+@\S+\.\S+/.test(directInviteEmail)) {
      alert("유효한 이메일 주소를 입력해주세요.");
      return;
    }
    directInviteMutation.mutate(directInviteEmail.trim());
  };

  // --- Render Logic ---

  if (isLoadingMembers) {
    return (
      <Page.Container>
        <DefaultHeader logoType={"back"} />
        <Page.Content className={"flex justify-center items-center h-full"}>
          <p>멤버 정보를 불러오는 중...</p>{" "}
          {/* Replace with Spinner if available */}
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
      <Page.Content className={"px-6 py-4"}>
        <h1 className={"text-xl font-medium mb-6"}>멤버 관리</h1>

        {/* Member List Card */}
        <div className={"mb-6 rounded-md bg-white shadow-sm p-4"}>
          <div className={"flex justify-between items-center mb-4"}>
            <h2 className={"text-lg font-medium"}>멤버 목록</h2>
            {amIAdmin && (
              <Button
                variant={"text"}
                size={"sm"}
                onClick={() => setIsEditMode(!isEditMode)}
                className={"text-gray-600 hover:text-black"}
                disabled={
                  updatePermissionMutation.isPending ||
                  removeMemberMutation.isPending
                } // Disable while mutating
              >
                {isEditMode ? "완료" : "관리자 변경"}
              </Button>
            )}
          </div>
          <div className={"flex flex-col gap-1"}>
            {memberData?.map((member) => (
              <div
                key={member.id}
                className={
                  "flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                }
              >
                {/* Member Info */}
                <div className={"flex items-center gap-3"}>
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gray-200" // TODO: Add dynamic bg color based on user?
                    )}
                  >
                    <span className={"text-gray-600 text-lg font-medium"}>
                      {member.user.nickName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className={"flex items-center gap-1.5"}>
                      <span className={"font-medium"}>
                        {member.user.nickName}
                      </span>
                      {member.permission === "ADMIN" && (
                        <FaCrown
                          className={"text-yellow-500 text-sm"}
                          title={"관리자"}
                        />
                      )}
                    </div>
                    <span className={"text-xs text-gray-500"}>
                      {member.user.email}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className={"flex items-center"}>
                  {amIAdmin &&
                  member.user.email !== authStore.context?.user?.email ? ( // Only show buttons for other members if admin
                    isEditMode ? ( // Edit Mode: Toggle Admin
                      <Button
                        variant={"text"}
                        size={"sm"}
                        onClick={() =>
                          handleToggleAdmin(member.id, member.permission)
                        }
                        disabled={updatePermissionMutation.isPending} // Disable while mutating
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
                        {updatePermissionMutation.isPending &&
                        updatePermissionMutation.variables?.memberId ===
                          member.id
                          ? "변경중..."
                          : member.permission === "ADMIN"
                            ? "관리자 해제"
                            : "관리자 지정"}
                      </Button>
                    ) : (
                      // Normal Mode: Remove Member
                      <Button
                        variant={"text"}
                        size={"sm"}
                        className={"text-gray-400 hover:text-red-500"}
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={removeMemberMutation.isPending} // Disable while mutating
                        title={"멤버 내보내기"}
                      >
                        {removeMemberMutation.isPending &&
                        removeMemberMutation.variables?.memberId ===
                          member.id ? (
                          "삭제중..."
                        ) : (
                          <IoMdClose size={20} />
                        )}
                      </Button>
                    )
                  ) : member.user.email === authStore.context?.user?.email &&
                    isEditMode ? ( // Show "(나)" for self in edit mode
                    <span className={"text-xs text-gray-400 mr-2"}>(나)</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invite via Link Card */}
        <div className={"mb-6 rounded-md bg-white shadow-sm p-4"}>
          <h2 className={"text-lg font-medium mb-4"}>멤버 초대 (링크)</h2>
          {isGeneratingInvite && inviteLink ? ( // Show link section if generated
            <div className={"flex flex-col gap-4"}>
              <div
                className={"flex items-center gap-2 bg-gray-100 p-3 rounded-md"}
              >
                <span className={"text-sm flex-1 break-all"}>{inviteLink}</span>
                <Button
                  variant={"text"}
                  size={"sm"}
                  onClick={handleCopyLink}
                  title={"링크 복사"} // ESLint 오류 수정: 중괄호 사용
                >
                  <IoMdCopy />
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
                  onClick={() => {
                    setIsGeneratingInvite(false);
                    setInviteLink(null);
                  }} // Close the link section
                >
                  닫기
                </Button>
                <Button
                  size={"sm"}
                  onClick={handleGenerateInvite} // Generate a new link
                  disabled={generateInviteMutation.isPending}
                >
                  {generateInviteMutation.isPending
                    ? "생성중..."
                    : "새 링크 생성"}
                </Button>
              </div>
            </div>
          ) : (
            // Show generate button initially
            <div>
              <p className={"text-sm text-gray-500 mb-4"}>
                멤버를 초대하려면 초대 링크를 생성하여 공유하세요.
                <br />
                초대 링크는 7일간 유효합니다. (유효기간은 백엔드 설정에 따름)
              </p>
              <Button
                size={"md"}
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
        <div className={"mb-6 rounded-md bg-white shadow-sm p-4"}>
          <h2 className={"text-lg font-medium mb-4"}>멤버 직접 초대</h2>
          <p className={"text-sm text-gray-500 mb-4"}>
            이메일 주소를 입력하여 멤버를 직접 초대하세요.
            <br />
            상대방에게 초대 알림이 전송됩니다.
          </p>
          <div className={"flex flex-col gap-3"}>
            <div className={"flex items-center gap-2"}>
              <Input
                type={"email"}
                placeholder={"초대할 멤버의 이메일 주소"}
                value={directInviteEmail}
                onChange={(e) => setDirectInviteEmail(e.target.value)}
                className={"flex-1"}
                aria-label={"초대할 멤버 이메일"}
                disabled={directInviteMutation.isPending}
              />
              <Button
                size={"md"}
                onClick={handleDirectInvite}
                disabled={
                  !directInviteEmail.trim() || directInviteMutation.isPending
                } // Disable if email is empty or mutation is pending
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
    </Page.Container>
  );
};

export default DiaryMemberPage;
