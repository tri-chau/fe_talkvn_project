import { twMerge } from "tailwind-merge";
import Show from "./condition/Show";
import { XIcon } from "./icons/XIcon";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode;
  className?: string;
  hideXIcon?: boolean;
};

export function Modal({
  isOpen,
  onClose,
  content,
  className,
  hideXIcon = false,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-opacity-80 bg-black flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="h-full w-full relative flex items-center justify-center">
        <div
          className={twMerge("h-[760px] w-full mx-24 relative", className)}
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
        <Show when={!hideXIcon}>
          <button
            className="absolute text-xl top-8 right-8 text-white hover:text-gray-300"
            onClick={onClose}
          >
            <XIcon className="text-white h-6 w-6" />
          </button>
        </Show>
      </div>
    </div>
  );
}
