import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import DefaultHeader from "@/components/layout/DefaultHeader";
import Page from "@/components/page/Page";
import { cn } from "@/lib/utils";
import { useState } from "react"; // Added useEffect, useMemo from Updated upstream
import { FaCrown } from "react-icons/fa";
import { IoMdAdd, IoMdClose, IoMdCopy } from "react-icons/io";
import { useNavigate } from "react-router-dom";

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

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const DiaryMemberPage = () => {
  const navigate = useNavigate();
  const [isGeneratingInvite, setIsGeneratingInvite] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  const [directInviteEmail, setDirectInviteEmail] = useState("");
  const [directInviteSent, setDirectInviteSent] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState("");

  // Keep members state from both versions (they define the same initial data structure)
  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "기현",
      email: "pkhjack@naver.com",
      role: "member",
      profileImg: "",
      profileBgColor: "bg-blue-300",
    },
    {
      id: "2",
      name: "명현",
      email: "myeonghyeon@gmail.com",
      role: "admin",
      profileImg: "",
      profileBgColor: "bg-green-300",
    }, // 관리자
    {
      id: "3",
      name: "용석",
      email: "yongseok@hanmail.net",
      role: "member",
      profileImg: "",
      profileBgColor: "bg-red-300",
    },
    {
      id: "4",
      name: "정민",
      email: "jeongmin@gmail.com",
      role: "member",
      profileImg: "",
      profileBgColor: "bg-purple-300",
    },
    {
      id: "5",
      name: "진욱",
      email: "jinwook@naver.com",
      role: "member",
      profileImg: "",
      profileBgColor: "bg-indigo-300",
    },
  ]);

  // Add state and logic for edit mode from Stashed changes
  const [isEditMode, setIsEditMode] = useState(false);
  const currentUserId = "2"; // Assuming current user is 명현 (id: "2")
  const currentUser = members.find((m) => m.id === currentUserId);
  const currentUserRole = currentUser?.role;

  // The color assignment logic from Updated upstream using useEffect and useMemo
  // seems intended for dynamic assignment based on profileImg or index,
  // but the rendering code in both versions already uses the profileBgColor
  // property directly from the member object.
  // Given the rendering relies on member.profileBgColor already in the state,
  // and the admin edit mode logic from Stashed changes is integrated with the member list rendering,
  // we will keep the direct use of member.profileBgColor in the rendering
  // and omit the dynamic assignment logic (useEffect and useMemo for colors)
  // as it's not clearly used in the provided rendering context and might conflict.
  /*
  // Omitted from merge as rendering relies on member.profileBgColor directly:
  const [memberBgColors, setMemberBgColors] = useState<Record<string, string>>({});
  useEffect(() => { ... }, []); // color assignment logic
  const memberColors = useMemo(() => { ... }, [members]); // color list logic
  */

  // 초대 링크 생성 핸들러
  const handleGenerateInvite = () => {
    // 실제 구현에서는 API 호출을 통해 초대 링크를 생성해야 합니다.
    const dummyLink = `https://memoria.app/invite/${Math.random().toString(36).substring(2, 15)}`;
    setInviteLink(dummyLink);
    setIsGeneratingInvite(true);
  };

  // 초대 링크 복사 핸들러
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // 멤버 삭제 핸들러 (present in both, keep one version)
  const handleRemoveMember = (memberId: string) => {
    // 실제 구현에서는 API 호출을 통해 멤버를 삭제해야 합니다.
    setMembers(members.filter((member) => member.id !== memberId));
  };

  // Add toggle admin handler from Stashed changes
  const handleToggleAdmin = (memberId: string) => {
    if (memberId === currentUserId && currentUserRole === "admin") {
      // Check if this is the last admin before removing admin role
      const adminCount = members.filter((m) => m.role === "admin").length;
      if (adminCount <= 1) {
        alert("최소 한 명의 관리자는 유지되어야 합니다.");
        return;
      }
    }
    setMembers(
      members.map((member) =>
        member.id === memberId
          ? { ...member, role: member.role === "admin" ? "member" : "admin" }
          : member
      )
    );
  };

  // Direct invite handler (present in both, keep one version)
  const handleDirectInvite = () => {
    if (!directInviteEmail.trim()) return; // Basic validation

    // 알림 api 대기
    console.log(`Sending direct invite to: ${directInviteEmail}`);

    setInvitedEmail(directInviteEmail);
    setDirectInviteEmail("");
    setDirectInviteSent(true);

    setTimeout(() => {
      setDirectInviteSent(false);
      setInvitedEmail("");
    }, 3000);
  };

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
            {currentUserRole === "admin" && (
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
            {members.map((member) => (
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
                      "w-10 h-10 rounded-full flex items-center justify-center overflow-hidden",
                      !member.profileImg && member.profileBgColor
                        ? member.profileBgColor // Use profileBgColor from member object
                        : "bg-gray-200" // Fallback gray
                    )}
                  >
                    {member.profileImg ? (
                      <img /* src={member.profileImg} alt={`${member.name} profile`} className="w-full h-full object-cover" */
                      />
                    ) : (
                      <span className={"text-white text-lg font-medium"}>
                        {member.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  {/* Name, Email, Admin Icon */}
                  <div>
                    <div className={"flex items-center gap-1.5"}>
                      <span className={"font-medium"}>{member.name}</span>
                      {member.role === "admin" && (
                        <FaCrown
                          className={"text-yellow-500 text-sm"}
                          title={"관리자"}
                        />
                      )}
                    </div>
                    <span className={"text-xs text-gray-500"}>
                      {member.email}
                    </span>
                  </div>
                </div>

                {/* Member Action Buttons (Right) - Using logic from Stashed changes */}
                <div className={"flex items-center"}>
                  {/* Logic based on current user's role and edit mode */}
                  {currentUserRole === "admin" ? ( // If current user is admin
                    isEditMode ? ( // Admin + Edit mode
                      // For other members (not current user), show admin toggle button
                      member.id !== currentUserId ? (
                        <Button
                          variant={"text"}
                          size={"sm"}
                          onClick={() => handleToggleAdmin(member.id)}
                          className={cn(
                            "text-sm",
                            member.role === "admin"
                              ? "text-orange-500 hover:text-orange-700" // Style for 'Remove Admin'
                              : "text-blue-500 hover:text-blue-700" // Style for 'Make Admin'
                          )}
                          title={
                            member.role === "admin"
                              ? "관리자 권한 해제"
                              : "관리자로 지정"
                          }
                        >
                          {member.role === "admin"
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
                    member.id !== currentUserId ? (
                      <Button
                        variant={"text"} // Icon button style
                        size={"sm"}
                        className={"text-gray-400 hover:text-red-500"} // Default gray, red on hover
                        onClick={() => handleRemoveMember(member.id)}
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
          {isGeneratingInvite ? (
            <div className={"flex flex-col gap-4"}>
              <div
                className={"flex items-center gap-2 bg-gray-100 p-3 rounded-md"}
              >
                <span className={"text-sm flex-1 break-all"}>{inviteLink}</span>
                <Button variant={"text"} size={"sm"} onClick={handleCopyLink}>
                  <IoMdCopy />
                </Button>
              </div>
              {linkCopied && (
                <p className={"text-xs text-green-500"}>
                  링크가 클립보드에 복사되었습니다!
                </p>
              )}
              <div className={"flex gap-2 justify-end"}>
                <Button
                  variant={"secondary"}
                  size={"sm"}
                  onClick={() => setIsGeneratingInvite(false)}
                >
                  닫기
                </Button>
                <Button size={"sm"} onClick={handleGenerateInvite}>
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
                onClick={handleGenerateInvite}
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
                value={directInviteEmail}
                onChange={(e) => setDirectInviteEmail(e.target.value)}
                className={"flex-1"}
                aria-label={"초대할 멤버 이메일"}
              />
              <Button
                size={"md"}
                onClick={handleDirectInvite}
                disabled={!directInviteEmail.trim()} // Disable if email is empty
              >
                초대 보내기
              </Button>
            </div>
            {directInviteSent && (
              <p className={"text-xs text-green-600 mt-1"}>
                '{invitedEmail}' 주소로 초대 요청을 보냈습니다. (실제 전송은
                구현 예정)
              </p>
            )}
          </div>
        </div>
      </Page.Content>
    </Page.Container>
  );
};

export default DiaryMemberPage;
