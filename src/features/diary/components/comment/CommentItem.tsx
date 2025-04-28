import { CommentTree } from "@/models/Comment";
import { BsPersonFill } from "react-icons/bs";

interface CommentItemProps {
  comment: CommentTree;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  return (
    <>
      <div className={"px-4 py-3 bg-gray-100 rounded-lg"}>
        <div className={"flex items-center gap-3"}>
          <div
            className={
              "size-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600"
            }
          >
            <BsPersonFill />
          </div>
          <div>{comment.createdBy?.nickName}</div>
          <div className={"flex-1"} />
          <div className={"text-sm text-gray-500"}>
            {comment.createdAt?.toRelative()}
          </div>
        </div>
        <div className={"mt-3"}>{comment.content}</div>
      </div>
      <div className={"pl-5 mt-3"}>
        {comment.children?.map((child) => (
          <CommentItem key={child.id} comment={child} />
        ))}
      </div>
    </>
  );
};

export default CommentItem;
