import React from "react";

interface ButtonGradiantProps {
  text: string;
  [key: string]: unknown;
}

const ButtonGradiant: React.FC<ButtonGradiantProps> = ({ text, ...props }) => {
  return (
    <button
      className="text-md group relative inline-block w-fit rounded-full bg-slate-800 p-[6px] text-xs font-semibold leading-7 text-white no-underline transition-all duration-300 hover:scale-105 hover:shadow-[#C3CAF2] sm:text-base"
      {...props}
    >
      {/* Hiệu ứng nền gradient động */}
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(100%_150%_at_50%_-20%,rgba(56,189,248,0.7)_0%,rgba(56,189,248,0)_80%)] opacity-80 transition-opacity duration-500 group-hover:animate-pulse" />
      </span>

      {/* Nội dung nút */}
      <div className="relative z-10 flex items-center space-x-3 rounded-full bg-zinc-950 px-6 py-2 ring-1 ring-white/10">
        <span>{text}</span>
        <svg
          fill="none"
          height="20"
          viewBox="0 0 24 24"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.75 8.75L14.25 12L10.75 15.25"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
        </svg>
      </div>

      {/* Viền phát sáng chạy liên tục */}
      <span className="animate-glow absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0" />
    </button>
  );
};

export default ButtonGradiant;
