import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function PasswordField({
  label,
  error,
  inputProps,
  inputClassName,
  placeholder,
  helperText,
  autoComplete
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <div className="relative">
        <input
          type={isVisible ? "text" : "password"}
          className={inputClassName}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          aria-label={isVisible ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#6f5e4f] transition hover:bg-[#f4ebdf] hover:text-[#4c3b2d]"
        >
          {isVisible ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
        </button>
      </div>
      {helperText ? <span className="mt-2 block text-xs leading-6 text-[#8a7a6a]">{helperText}</span> : null}
      {error ? <span className="mt-1 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}
