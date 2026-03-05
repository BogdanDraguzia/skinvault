interface Props {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  children?: React.ReactNode; // for password toggle button slot
}

export default function FloatingInput({
  label, type = 'text', value, onChange,
  autoComplete, required = true, disabled, children,
}: Props) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder=" "
        required={required}
        disabled={disabled}
        className="peer w-full px-4 pt-5 pb-2 rounded-lg input-glass text-sm disabled:opacity-50"
      />
      <label className="absolute left-4 top-3.5 text-slate-500 text-xs transition-all pointer-events-none peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[#06b6d4] peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:text-xs">
        {label}
      </label>
      {children}
    </div>
  );
}
