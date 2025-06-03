import DefaultHeader from "@/components/layout/DefaultHeader";
import Page from "@/components/page/Page";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FaMusic, FaServer } from "react-icons/fa";
import AiNodesTab from "./components/AiNodesTab";
import MusicQueueTab from "./components/MusicQueueTab";

type TabType = "nodes" | "musicQueue";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("nodes");

  const tabs = [
    {
      id: "nodes" as TabType,
      label: "AI 노드 관리",
      icon: FaServer,
      component: AiNodesTab,
    },
    {
      id: "musicQueue" as TabType,
      label: "음악 큐 관리",
      icon: FaMusic,
      component: MusicQueueTab,
    },
  ];

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || AiNodesTab;

  return (
    <Page.Container className={"min-h-screen bg-gray-50"}>
      <DefaultHeader logoType={"back"} />

      <Page.Content className={"space-y-6"}>
        {/* Page Header */}
        <div>
          <h1 className={"text-2xl font-bold text-gray-900"}>
            관리자 대시보드
          </h1>
          <p className={"text-gray-600 mt-1"}>
            AI 서비스 및 작업 큐를 관리합니다
          </p>
        </div>

        {/* Tab Navigation */}
        <div className={"bg-white rounded-lg border shadow-sm"}>
          <div className={"flex border-b"}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative",
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Icon
                    className={cn(
                      "text-base",
                      activeTab === tab.id ? "text-blue-600" : "text-gray-500"
                    )}
                  />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className={"p-6"}>
            <ActiveComponent />
          </div>
        </div>
      </Page.Content>
    </Page.Container>
  );
};

export default AdminPage;
