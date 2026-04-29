type PageHeaderProps = {
  title: string;
  description?: string;
  subtitle?: string;
};

export function PageHeader({ title, description, subtitle = "HSK Learning App by Duc" }: PageHeaderProps) {
  return (
    <header className="p-8 border-b border-white/10 bg-card flex justify-between items-end">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-[0.3em] text-primary mb-1 font-semibold">
          {subtitle}
        </span>
        <h1 className="text-3xl serif italic font-light tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-xs uppercase tracking-widest opacity-40 mt-2">{description}</p>
        )}
      </div>
    </header>
  );
}
  