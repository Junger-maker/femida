import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { type Locale, t } from '@/lib/i18n';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, locale }: { items: BreadcrumbItem[]; locale: Locale }) {
  const allItems = [{ label: t('breadcrumb.home', locale), href: '/' }, ...(items ?? [])];
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground" itemScope itemType="https://schema.org/BreadcrumbList">
        {allItems.map((item, i) => (
          <li key={i} className="flex items-center gap-1" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            {i > 0 && <ChevronRight className="h-3 w-3" />}
            {item.href && i < allItems.length - 1 ? (
              <Link href={item.href} className="hover:text-primary transition-colors flex items-center gap-1" itemProp="item">
                {i === 0 && <Home className="h-3 w-3" />}
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span className="text-foreground font-medium" itemProp="name">{item.label}</span>
            )}
            <meta itemProp="position" content={String(i + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
