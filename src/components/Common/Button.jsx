// variant = primary, secondary, success, danger, warning, outline, ghost, dark
// size = sm, md, lg

const variantClasses = {
  primary:
    "bg-gradient-to-br from-primary to-primary-light text-white border-transparent hover:-translate-y-0.5 hover:shadow-md",
  secondary:
    "bg-primary-surface text-text-accent border-transparent hover:-translate-y-0.5 hover:bg-emerald-100",
  success:
    "bg-status-open text-white border-transparent hover:-translate-y-0.5 hover:shadow-md",
  warning:
    "bg-accent-yellow text-white border-transparent hover:-translate-y-0.5 hover:shadow-md",
  danger:
    "bg-accent-red text-white border-transparent hover:-translate-y-0.5 hover:shadow-md",
  outline:
    "bg-transparent text-primary border border-slate-200 hover:bg-primary-surface hover:-translate-y-0.5",
  ghost:
    "bg-transparent text-slate-700 border-transparent hover:bg-background-secondary",
  dark:
    "bg-background-dark text-white border-transparent hover:-translate-y-0.5 hover:shadow-md",
};

const sizeClasses = {
  sm: "py-2 px-3 text-[0.85rem] rounded-lg",
  md: "py-3 px-4 text-[0.95rem] rounded-xl",
  lg: "py-3.5 px-5 text-[1.05rem] rounded-xl",
};

const Button = ({
  children,
  href,
  onClick,
  icon,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  className = "",
  target,
  rel,
  ...props
}) => {
  const chosenVariant = variantClasses[variant] || variantClasses.primary;
  const chosenSize = sizeClasses[size] || sizeClasses.md;

  const buttonClass = `
    relative w-full inline-flex items-center justify-center gap-2 font-primary font-semibold leading-none border no-underline whitespace-nowrap cursor-pointer select-none transition-all duration-200 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-lighter disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none
    ${chosenVariant}
    ${chosenSize}
    ${className}
  `.trim();

  if (href) {
    return (
      <a
        href={href}
        className={buttonClass}
        target={target}
        rel={rel}
        {...props}
      >
        {icon}
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={buttonClass}
      onClick={onClick}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;