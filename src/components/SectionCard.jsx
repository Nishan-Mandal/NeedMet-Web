export default function SectionCard({
  step,
  title,
  subtitle,
  icon,
  children,
  sectionStyle
}) {
  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden" style={sectionStyle}>
      <div className="flex items-center gap-3.5 pt-5 px-6 pb-[18px] bg-primary-surface border-b border-[#bfdbfe]">
        <div className="w-10 h-10 rounded-[10px] bg-primary-surface text-primary flex items-center justify-center shrink-0">
          {icon}
        </div>

        <div>
          <div className="text-[10.5px] font-bold tracking-[0.08em] uppercase text-primary-light mb-[3px]">
            Step {step}
          </div>

          <h2 className="m-0 mb-0.5 font-heading text-[17px] font-bold leading-[1.3] text-text">
            {title}
          </h2>

          {subtitle && (
            <p className="m-0 text-[13px] leading-[1.4] text-text-secondary">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="py-[22px] px-[15px] flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
}