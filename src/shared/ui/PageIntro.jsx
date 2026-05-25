import { cn } from "../lib/cn";

export function PageIntro({
  eyebrow,
  title,
  description,
  className,
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
  eyebrowProps,
  titleProps,
  descriptionProps,
  ...restProps
}) {
  return (
    <div className={cn("mb-8", className)} {...restProps}>
      {eyebrow ? (
        <div
          className={cn("mb-2 text-xs uppercase tracking-[0.35em] text-ember", eyebrowClassName)}
          {...eyebrowProps}
        >
          {eyebrow}
        </div>
      ) : null}
      <h1 className={cn("font-display text-4xl text-forest md:text-5xl", titleClassName)} {...titleProps}>
        {title}
      </h1>
      {description ? (
        <p
          className={cn("mt-3 max-w-3xl text-base leading-7 text-ink/70", descriptionClassName)}
          {...descriptionProps}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
