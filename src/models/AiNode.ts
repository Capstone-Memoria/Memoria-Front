export type AiNodeType = "IMAGE" | "MUSIC";

export interface AiNode {
  id: number;
  type: AiNodeType;
  url: string;
  available: boolean;
}
