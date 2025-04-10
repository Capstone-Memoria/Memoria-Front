import Page from "@/components/page/Page";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaPencilAlt, FaRegCalendar } from "react-icons/fa";

import { IoMdArrowBack, IoMdMore, IoMdPeople } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const ViewDiaryPage = () => {
  /* Properties */
  const navigate = useNavigate();

  return (
    <Page.Container>
      <Page.Header>
        <div className={"text-2xl"}>
          <IoMdArrowBack onClick={() => navigate(-1)} />
        </div>
        <div>일기장 제목</div>
        <div className={"flex"}>
          <div className={"p-2 flex items-center justify-center"}>
            <FaRegCalendar />
          </div>
          <div className={"p-2"}>
            <Popover>
              <PopoverTrigger asChild>
                <IoMdMore />
              </PopoverTrigger>
              <PopoverContent className={"p-0 overflow-hidden"}>
                {[
                  {
                    label: "일기장 정보 수정",
                    icon: <FaPencilAlt />,
                  },
                  {
                    label: "멤버 관리",
                    icon: <IoMdPeople />,
                  },
                ].map((it) => (
                  <div
                    key={it.label}
                    className={
                      "flex items-center gap-4 hover:bg-gray-50 p-4 transition-colors select-none"
                    }
                  >
                    <div className={"text-sm"}>{it.icon}</div>
                    <div>{it.label}</div>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Page.Header>
      <Page.Content>PageContent</Page.Content>
      <Page.Footer>Footer</Page.Footer>
    </Page.Container>
  );
};

export default ViewDiaryPage;
