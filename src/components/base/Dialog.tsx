import Button from "@/components/base/Button";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

interface DialogProps {
  open: boolean;
  title: string;
  description?: string;

  onConfirm: () => void;
  onClose: () => void;

  confirmLabel?: string;
  cancelLabel?: string; // ← 이게 있으면 confirm+cancel, 없으면 OK만
}

const Dialog = ({
  open,
  title,
  description,
  onConfirm,
  onClose,
  confirmLabel = "확인",
  cancelLabel, // 없으면 alert 모드
}: DialogProps) => {
  if (!open) return null;

  return createPortal(
    <div
      className={
        "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs"
      }
      onClick={onClose}
    >
      <div
        role={cancelLabel ? "dialog" : "alertdialog"}
        aria-modal={"true"}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-[90%] max-w-sm sm:max-w-md min-w-[16rem] rounded-3xl bg-white p-10 shadow-sm",
          "flex flex-col gap-4 text-center"
        )}
      >
        <div className={"flex flex-col gap-1"}>
          <h3 className={"text-lg font-semibold text-gray-900"}>{title}</h3>
          {description && (
            <p className={"text-base text-gray-600 whitespace-pre-wrap"}>
              {description}
            </p>
          )}
        </div>

        {/* 버튼 */}
        {cancelLabel ? (
          /* Confirm + Cancel = confirm dialog */
          <div className={"flex gap-3 pt-2"}>
            <Button
              className={"flex-1 text-lg"}
              size={"sm"}
              variant={"text"}
              onClick={onClose}
            >
              {cancelLabel}
            </Button>
            <Button
              className={"flex-1 text-green-500 text-lg"}
              size={"sm"}
              variant={"text"}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        ) : (
          /* Single OK = alert dialog */
          <Button className={"w-full"} size={"sm"} onClick={onClose}>
            {confirmLabel}
          </Button>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Dialog;
