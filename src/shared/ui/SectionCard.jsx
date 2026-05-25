import { cn } from "../lib/cn";

export function SectionCard({
  title,
  description,
  children,
  className,
  headerClassName,
  titleClassName,
  descriptionClassName,
  contentClassName,
  headerProps,
  titleProps,
  descriptionProps,
  contentProps,
  ...restProps
}) {
  return (
    <section
      className={cn("rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-card backdrop-blur", className)}
      {...restProps}
    >
      <div className={cn("mb-5", headerClassName)} {...headerProps}>
        <h2 className={cn("font-display text-2xl text-forest", titleClassName)} {...titleProps}>
          {title}
        </h2>
        {description ? (
          <p
            className={cn("mt-2 max-w-2xl text-sm leading-6 text-ink/70", descriptionClassName)}
            {...descriptionProps}
          >
            {description}
          </p>
        ) : null}
      </div>
      <div className={contentClassName} {...contentProps}>
        {children}
      </div>
    </section>
  );
}
