const Button = ({
  children,
  type = "button",
  variant = "primary",
  fullWidth = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary:
      "bg-[#9B7847] text-white hover:bg-[#826238] focus-visible:ring-[#9B7847]",

    secondary:
      "border border-[#D9CBB8] bg-transparent text-[#29251F] hover:bg-[#F5F0E8]",

    dark:
      "bg-[#29251F] text-white hover:bg-[#403A31]",

    ghost:
      "bg-transparent text-[#29251F] hover:bg-[#F5F0E8]",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;