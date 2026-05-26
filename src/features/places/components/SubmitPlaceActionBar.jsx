import { Link } from "react-router-dom";

export function SubmitPlaceActionBar({ isEditMode, isSubmitting, submitLabel, submitHint, backLinkTo }) {
  return (
    <div className="space-y-4 rounded-[1.6rem] border border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(250,244,236,0.9))] p-4 md:p-5">
      <div className="rounded-[1.3rem] border border-white/70 bg-white/55 px-4 py-3 text-sm leading-6 text-[#7b6f64]">
        {submitHint}
      </div>

      <div className="rounded-[1.35rem] border border-[#e3d6c8] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(74,55,37,0.06)]">
        <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          {isEditMode ? (
            <Link
              to={backLinkTo}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#d7c5b4] bg-white/90 px-5 py-3 text-sm font-semibold text-[#6f5e4f] transition hover:border-[#b08c6f] hover:bg-white hover:text-[#4c3b2d]"
            >
              ย้อนกลับ
            </Link>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-[48px] min-w-[220px] items-center justify-center rounded-full bg-[#3f3328] px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(63,51,40,0.14)] transition hover:bg-[#2f251d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
