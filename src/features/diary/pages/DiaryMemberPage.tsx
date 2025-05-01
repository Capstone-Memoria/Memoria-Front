import api from "@/api";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import DefaultHeader from "@/components/layout/DefaultHeader";
import Page from "@/components/page/Page";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/AuthenticationStore";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react"; // Added useEffect, useMemo from Updated upstream
import { FaCrown } from "react-icons/fa";
import { IoMdAdd, IoMdClose, IoMdCopy } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";

// 멤버 더미 데이터
interface Member {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  profileImg?: string;
  profileBgColor?: string; // Keep profileBgColor property in Member interface
}

const profileBgColors = [
  "bg-red-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-yellow-200",
  "bg-purple-200",
  "bg-pink-200",
  "bg-indigo-200",
  "bg-teal-200",
  "bg-orange-200",
  "bg-cyan-200",
  "bg-lime-200",
  "bg-emerald-200",
  "bg-sky-200",
  "bg-violet-200",
  "bg-fuchsia-200",
  "bg-rose-200",
];

const DiaryMemberPage = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const { diaryId } = useParams();

  const {
    data: memberData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["fetchDiaryBookMembers"],
    queryFn: () => api.diaryBook.fetchDiaryMembers(Number(diaryId)),
  });

  // Add state and logic for edit mode from Stashed changes
  const [isEditMode, setIsEditMode] = useState(false);

  const amIAdmin = useMemo(() => {
    return memberData?.some(
      (member) =>
        member.user.email === authStore.context?.user?.email &&
        member.permission === "ADMIN"
    );
  }, [memberData, authStore.context?.user?.email]);

  return (
    <Page.Container>
      <DefaultHeader logoType={"back"} />
      <Page.Content className={"px-6 py-4"}>
        <h1 className={"text-xl font-medium mb-6"}>멤버 관리</h1>
        {/* 멤버 목록 카드 - Using the structure from Stashed changes */}
        <div className={"mb-6 rounded-md bg-white shadow-sm p-4"}>
          {/* Header: Member list title + Admin Change button (visible to admin) */}
          <div className={"flex justify-between items-center mb-4"}>
            <h2 className={"text-lg font-medium"}>멤버 목록</h2>
            {/* Show Admin Change button only if current user is admin */}
            {amIAdmin && (
              <Button
                variant={"text"}
                size={"sm"}
                onClick={() => setIsEditMode(!isEditMode)} // Toggle edit mode
                className={"text-gray-600 hover:text-black"}
              >
                {isEditMode ? "완료" : "관리자 변경"}{" "}
                {/* Button text based on edit mode */}
              </Button>
            )}
          </div>

          {/* Member List - Using the structure and rendering logic from Stashed changes */}
          <div className={"flex flex-col gap-1"}>
            {" "}
            {/* Using gap-1 from Stashed changes */}
            {memberData?.map((member) => (
              <div
                key={member.id}
                className={
                  "flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                }
              >
                {/* Member Info (Left) */}
                <div className={"flex items-center gap-3"}>
                  {/* Profile Image/Initials - Using rendering logic from Stashed changes */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gray-200"
                    )}
                  >
                    <span className={"text-white text-lg font-medium"}>
                      {member.user.nickName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {/* Name, Email, Admin Icon */}
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

                {/* Member Action Buttons (Right) - Using logic from Stashed changes */}
                <div className={"flex items-center"}>
                  {/* Logic based on current user's role and edit mode */}
                  {amIAdmin ? ( // If current user is admin
                    isEditMode ? ( // Admin + Edit mode
                      // For other members (not current user), show admin toggle button
                      member.user.email !== authStore.context?.user?.email ? (
                        <Button
                          variant={"text"}
                          size={"sm"}
                          // onClick={() => handleToggleAdmin(member.id)}
                          className={cn(
                            "text-sm",
                            member.permission === "ADMIN"
                              ? "text-orange-500 hover:text-orange-700" // Style for 'Remove Admin'
                              : "text-blue-500 hover:text-blue-700" // Style for 'Make Admin'
                          )}
                          title={
                            member.permission === "ADMIN"
                              ? "관리자 권한 해제"
                              : "관리자로 지정"
                          }
                        >
                          {member.permission === "ADMIN"
                            ? "관리자 해제"
                            : "관리자 지정"}
                        </Button>
                      ) : (
                        // For the current admin user in edit mode
                        <span className={"text-xs text-gray-400 mr-2"}>
                          (나)
                        </span>
                      )
                    ) : // Admin + Normal mode
                    // For other members (not current user), show remove button
                    member.user.email !== authStore.context?.user?.email ? (
                      <Button
                        variant={"text"} // Icon button style
                        size={"sm"}
                        className={"text-gray-400 hover:text-red-500"} // Default gray, red on hover
                        // onClick={() => handleRemoveMember(member.id)}
                        title={"멤버 내보내기"}
                      >
                        <IoMdClose size={20} />
                      </Button>
                    ) : // For the current admin user in normal mode (no button needed)
                    null
                  ) : // If current user is a regular member (no buttons needed)
                  null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 멤버 초대 카드 - Keep structure as it is similar in both */}
        <div className={"mb-6 rounded-md bg-white shadow-sm p-4"}>
          <h2 className={"text-lg font-medium mb-4"}>멤버 초대</h2>
          {false ? (
            <div className={"flex flex-col gap-4"}>
              <div
                className={"flex items-center gap-2 bg-gray-100 p-3 rounded-md"}
              >
                <span className={"text-sm flex-1 break-all"}>inviteLink</span>
                <Button
                  variant={"text"}
                  size={"sm"}

                  // onClick={handleCopyLink}
                >
                  <IoMdCopy />
                </Button>
              </div>
              {false && (
                <p className={"text-xs text-green-500"}>
                  링크가 클립보드에 복사되었습니다!
                </p>
              )}
              <div className={"flex gap-2 justify-end"}>
                <Button
                  variant={"secondary"}
                  size={"sm"}
                  // onClick={() => setIsGeneratingInvite(false)}
                >
                  닫기
                </Button>
                <Button
                  size={"sm"}
                  // onClick={handleGenerateInvite}
                >
                  새 링크 생성
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
                size={"md"}
                className={"flex items-center gap-2"}
                // onClick={handleGenerateInvite}
              >
                <IoMdAdd />
                초대 링크 생성
              </Button>
            </div>
          )}
        </div>

        {/* 멤버 직접 초대 카드 - Keep structure as it is similar in both */}
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
                // value={directInviteEmail}
                // onChange={(e) => setDirectInviteEmail(e.target.value)}
                className={"flex-1"}
                aria-label={"초대할 멤버 이메일"}
              />
              <Button
                size={"md"}
                // onClick={handleDirectInvite}
                // disabled={!directInviteEmail.trim()} // Disable if email is empty
              >
                초대 보내기
              </Button>
            </div>
            {false && (
              <p className={"text-xs text-green-600 mt-1"}>
                'invitedEmail' 주소로 초대 요청을 보냈습니다. (실제 전송은 구현
                예정)
              </p>
            )}
          </div>
        </div>
      </Page.Content>
    </Page.Container>
  );
};

export default DiaryMemberPage;
