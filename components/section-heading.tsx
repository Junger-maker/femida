export function SectionHeading({ title, subtitle, className = '' }: { title: string; subtitle?: string; className?: string }) {
  return (
    <div className={`text-center mb-10 ${className}`}>
      <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
      <div className="mt-4 mx-auto w-16 h-1 bg-primary rounded-full" />
    </div>
  );
}
