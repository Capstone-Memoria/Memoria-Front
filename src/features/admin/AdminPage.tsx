import api from "@/api";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import Modal from "@/components/base/Modal";
import DefaultHeader from "@/components/layout/DefaultHeader";
import Page from "@/components/page/Page";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { AiNode, AiNodeType } from "@/models/AiNode";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { FaImage, FaMusic, FaPlus, FaServer, FaTrash } from "react-icons/fa";
import { MdEdit, MdPowerSettingsNew } from "react-icons/md";
import { RiMore2Fill } from "react-icons/ri";

interface CreateNodeForm {
  url: string;
  type: AiNodeType;
}

interface EditNodeForm {
  url?: string;
  type?: AiNodeType;
}

const AdminPage = () => {
  const queryClient = useQueryClient();

  // States
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<AiNode | null>(null);
  const [deleteConfirmNode, setDeleteConfirmNode] = useState<AiNode | null>(
    null
  );
  const [createForm, setCreateForm] = useState<CreateNodeForm>({
    url: "",
    type: "IMAGE",
  });
  const [editForm, setEditForm] = useState<EditNodeForm>({});

  // Queries
  const {
    data: nodes = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getAllAiNodes"],
    queryFn: api.admin.getAllAiNodes,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: api.admin.createAiNode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllAiNodes"] });
      setIsCreateDrawerOpen(false);
      setCreateForm({ url: "", type: "IMAGE" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EditNodeForm }) =>
      api.admin.updateAiNode(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllAiNodes"] });
      setEditingNode(null);
      setEditForm({});
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.admin.deleteAiNode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllAiNodes"] });
      setDeleteConfirmNode(null);
    },
  });

  // Handlers
  const handleCreateSubmit = () => {
    if (createForm.url.trim()) {
      createMutation.mutate(createForm);
    }
  };

  const handleEditSubmit = () => {
    if (editingNode && Object.keys(editForm).length > 0) {
      updateMutation.mutate({ id: editingNode.id, data: editForm });
    }
  };

  const handleDelete = (node: AiNode) => {
    setDeleteConfirmNode(node);
  };

  const confirmDelete = () => {
    if (deleteConfirmNode) {
      deleteMutation.mutate(deleteConfirmNode.id);
    }
  };

  const getNodeTypeIcon = (type: AiNodeType) => {
    return type === "IMAGE" ? (
      <FaImage className={"text-blue-500"} />
    ) : (
      <FaMusic className={"text-purple-500"} />
    );
  };

  const getNodeTypeLabel = (type: AiNodeType) => {
    return type === "IMAGE" ? "이미지" : "음악";
  };

  return (
    <Page.Container className={"min-h-screen bg-gray-50"}>
      <DefaultHeader logoType={"back"} />

      <Page.Content className={"space-y-6"}>
        {/* Header Section */}
        <div className={"flex items-center justify-between"}>
          <div>
            <h1 className={"text-2xl font-bold text-gray-900"}>AI 노드 관리</h1>
            <p className={"text-gray-600 mt-1"}>AI 서비스 노드를 관리합니다</p>
          </div>
          <Drawer
            open={isCreateDrawerOpen}
            onOpenChange={setIsCreateDrawerOpen}
          >
            <DrawerTrigger asChild>
              <Button className={"flex items-center gap-2"}>
                <FaPlus className={"text-sm"} />
                노드 추가
              </Button>
            </DrawerTrigger>
            <DrawerContent className={"p-6"}>
              <div className={"space-y-4"}>
                <h3 className={"text-lg font-semibold"}>새 AI 노드 추가</h3>

                <div className={"space-y-3"}>
                  <div>
                    <label
                      className={"block text-sm font-medium text-gray-700 mb-1"}
                    >
                      노드 타입
                    </label>
                    <select
                      value={createForm.type}
                      onChange={(e) =>
                        setCreateForm((prev) => ({
                          ...prev,
                          type: e.target.value as AiNodeType,
                        }))
                      }
                      className={
                        "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      }
                    >
                      <option value={"IMAGE"}>이미지</option>
                      <option value={"MUSIC"}>음악</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={"block text-sm font-medium text-gray-700 mb-1"}
                    >
                      노드 URL
                    </label>
                    <Input
                      value={createForm.url}
                      onChange={(e) =>
                        setCreateForm((prev) => ({
                          ...prev,
                          url: e.target.value,
                        }))
                      }
                      placeholder={"https://example.com/api"}
                      className={"w-full"}
                    />
                  </div>
                </div>

                <div className={"flex gap-3 pt-4"}>
                  <Button
                    onClick={handleCreateSubmit}
                    disabled={
                      createMutation.isPending || !createForm.url.trim()
                    }
                    className={"flex-1"}
                  >
                    {createMutation.isPending ? "추가 중..." : "노드 추가"}
                  </Button>
                  <Button
                    variant={"secondary"}
                    onClick={() => setIsCreateDrawerOpen(false)}
                    className={"flex-1"}
                  >
                    취소
                  </Button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Stats Cards */}
        <div className={"grid grid-cols-2 gap-4"}>
          <div className={"bg-white p-4 rounded-lg shadow-sm border"}>
            <div className={"flex items-center justify-between"}>
              <div>
                <p className={"text-sm text-gray-600"}>전체 노드</p>
                <p className={"text-2xl font-bold text-gray-900"}>
                  {nodes.length}
                </p>
              </div>
              <FaServer className={"text-blue-500 text-xl"} />
            </div>
          </div>
          <div className={"bg-white p-4 rounded-lg shadow-sm border"}>
            <div className={"flex items-center justify-between"}>
              <div>
                <p className={"text-sm text-gray-600"}>활성 노드</p>
                <p className={"text-2xl font-bold text-green-600"}>
                  {nodes.filter((node) => node.available).length}
                </p>
              </div>
              <MdPowerSettingsNew className={"text-green-500 text-xl"} />
            </div>
          </div>
        </div>

        {/* Nodes List */}
        <div className={"space-y-3 flex flex-col gap-3 mt-4"}>
          {isLoading ? (
            <div className={"space-y-3"}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={
                    "bg-white p-4 rounded-lg shadow-sm border animate-pulse"
                  }
                >
                  <div className={"flex items-center justify-between"}>
                    <div className={"flex items-center gap-3"}>
                      <div className={"w-10 h-10 bg-gray-200 rounded-lg"}></div>
                      <div className={"space-y-2"}>
                        <div className={"h-4 bg-gray-200 rounded w-32"}></div>
                        <div className={"h-3 bg-gray-200 rounded w-48"}></div>
                      </div>
                    </div>
                    <div className={"w-6 h-6 bg-gray-200 rounded"}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : nodes.length === 0 ? (
            <div
              className={"bg-white p-8 rounded-lg shadow-sm border text-center"}
            >
              <FaServer className={"mx-auto text-4xl text-gray-400 mb-3"} />
              <p className={"text-gray-600"}>등록된 AI 노드가 없습니다</p>
              <p className={"text-sm text-gray-500 mt-1"}>
                새 노드를 추가해 주세요
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {nodes.map((node) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={
                    "bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                  }
                >
                  <div className={"flex items-center justify-between"}>
                    <div className={"flex items-center gap-3"}>
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          node.type === "IMAGE"
                            ? "bg-blue-100"
                            : "bg-purple-100"
                        )}
                      >
                        {getNodeTypeIcon(node.type)}
                      </div>
                      <div>
                        <div className={"flex items-center gap-2"}>
                          <span className={"font-medium text-gray-900"}>
                            {getNodeTypeLabel(node.type)} 노드
                          </span>
                          <span
                            className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              node.available
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            )}
                          >
                            {node.available ? "활성" : "비활성"}
                          </span>
                        </div>
                        <p
                          className={"text-sm text-gray-600 truncate max-w-64"}
                        >
                          {node.url}
                        </p>
                      </div>
                    </div>

                    <Drawer>
                      <DrawerTrigger asChild>
                        <button
                          className={
                            "p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          }
                        >
                          <RiMore2Fill className={"text-gray-600"} />
                        </button>
                      </DrawerTrigger>
                      <DrawerContent className={"p-4"}>
                        <div className={"flex flex-col gap-2"}>
                          <button
                            onClick={() => {
                              setEditingNode(node);
                              setEditForm({ url: node.url, type: node.type });
                            }}
                            className={
                              "flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                            }
                          >
                            <MdEdit className={"text-blue-500"} />
                            <span>노드 수정</span>
                          </button>
                          <button
                            onClick={() => handleDelete(node)}
                            className={
                              "flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-red-600"
                            }
                          >
                            <FaTrash />
                            <span>노드 삭제</span>
                          </button>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </Page.Content>

      {/* Edit Modal */}
      <Modal open={editingNode !== null} onClose={() => setEditingNode(null)}>
        <div className={"p-6 space-y-4"}>
          <h3 className={"text-lg font-semibold"}>노드 수정</h3>

          <div className={"space-y-3"}>
            <div>
              <label className={"block text-sm font-medium text-gray-700 mb-1"}>
                노드 타입
              </label>
              <select
                value={editForm.type || editingNode?.type}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    type: e.target.value as AiNodeType,
                  }))
                }
                className={
                  "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }
              >
                <option value={"IMAGE"}>이미지</option>
                <option value={"MUSIC"}>음악</option>
              </select>
            </div>

            <div>
              <label className={"block text-sm font-medium text-gray-700 mb-1"}>
                노드 URL
              </label>
              <Input
                value={editForm.url || editingNode?.url || ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, url: e.target.value }))
                }
                placeholder={"https://example.com/api"}
                className={"w-full"}
              />
            </div>
          </div>

          <div className={"flex gap-3 pt-4"}>
            <Button
              onClick={handleEditSubmit}
              disabled={updateMutation.isPending}
              className={"flex-1"}
            >
              {updateMutation.isPending ? "수정 중..." : "수정 완료"}
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => setEditingNode(null)}
              className={"flex-1"}
            >
              취소
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirmNode !== null}
        onClose={() => setDeleteConfirmNode(null)}
      >
        <div className={"p-6 space-y-4"}>
          <div className={"text-center"}>
            <FaTrash className={"mx-auto text-4xl text-red-500 mb-3"} />
            <h3 className={"text-lg font-semibold mb-2"}>노드 삭제</h3>
            <p className={"text-gray-600"}>
              정말로 이 노드를 삭제하시겠습니까?
            </p>
            {deleteConfirmNode && (
              <p className={"text-sm text-gray-500 mt-1"}>
                {deleteConfirmNode.url}
              </p>
            )}
          </div>

          <div className={"flex gap-3"}>
            <Button
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              variant={"danger"}
              className={"flex-1"}
            >
              {deleteMutation.isPending ? "삭제 중..." : "삭제"}
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => setDeleteConfirmNode(null)}
              className={"flex-1"}
            >
              취소
            </Button>
          </div>
        </div>
      </Modal>
    </Page.Container>
  );
};

export default AdminPage;
