import { useLang } from "@/components/providers";

export function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
}) {
  const { lang } = useLang();
  return (
    <div className="mb-12 max-w-2xl md:mb-16">
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {intro ? (
        <p className="mt-4 text-[15px] leading-relaxed text-muted" lang={lang}>
          {intro}
        </p>
      ) : null}
    </div>
  );
}
