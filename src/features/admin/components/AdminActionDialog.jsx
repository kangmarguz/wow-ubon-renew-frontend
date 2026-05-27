import { LoadingInline } from "../../../shared/ui/LoadingInline";

export function AdminActionDialog({
  eyebrow,
  title,
  description,
  children,
  cancelLabel = "ยกเลิก",
  confirmLabel,
  confirmPendingLabel,
  confirmTone = "danger",
  isPending = false,
  isConfirmDisabled = false,
  onCancel,
  onConfirm
}) {
  const confirmClassName =
    confirmTone === "success"
      ? "bg-[#2e5a43] hover:bg-[#234634]"
      : "bg-[#8f4e4e] hover:bg-[#763f3f]";

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#2b2119]/35 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[1.8rem] border border-[#e2d5c7] bg-white p-6 shadow-[0_24px_60px_rgba(74,55,37,0.18)]">
        {eyebrow ? <div className="text-xs tracking-[0.22em] text-[#9a836d]">{eyebrow}</div> : null}
        <h3 className="mt-2 text-2xl font-semibold text-[#3f3328]">{title}</h3>
        {description ? <div className="mt-2 text-sm leading-7 text-[#74685e]">{description}</div> : null}
        {children ? <div className="mt-5">{children}</div> : null}

        <div className="mt-5 flex flex-col gap-3 md:flex-row md:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[#d6c7b8] px-5 py-2.5 text-sm font-semibold text-[#6f5e4f] transition hover:border-[#b08c6f] hover:text-[#4c3b2d]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isPending || isConfirmDisabled}
            onClick={onConfirm}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${confirmClassName}`}
          >
            {isPending ? <LoadingInline label={confirmPendingLabel || confirmLabel} size={16} /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
