import styles from "../../style/Common/Button.module.css";

const Button = ({
  children,
  href,
  onClick,
  icon,
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
  target,
  rel,
  ...props
}) => {
  const buttonClass = `
    ${styles.btn}
    ${styles[`btn-${variant}`]}
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