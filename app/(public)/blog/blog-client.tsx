'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Scale, ArrowRight } from 'lucide-react';
import { type Locale } from '@/lib/i18n';
import { SafeDate } from '@/components/safe-format';

interface ArticleData { id: string; slug: string; title: string; excerpt: string; imageUrl: string; publishedAt: string; tags: string[]; }

export function BlogClient({ locale, articles, readMore }: { locale: Locale; articles: ArticleData[]; readMore: string }) {
  const safeArticles = articles ?? [];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {safeArticles.map((article: ArticleData, i: number) => (
        <motion.div key={article.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
          <Link href={`/blog/${article.slug}`} className="group block rounded-xl border border-border/50 bg-card overflow-hidden hover:shadow-lg transition-shadow h-full">
            {article.imageUrl ? (
              <div className="relative aspect-video bg-muted"><Image src={article.imageUrl} alt={article.title ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-300" /></div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-[#1E3A8A]/10 to-[#3B82F6]/10 flex items-center justify-center"><Scale className="h-10 w-10 text-primary/20" /></div>
            )}
            <div className="p-5">
              <p className="text-xs text-muted-foreground mb-2"><SafeDate date={article.publishedAt} options={{ dateStyle: 'long' }} locale={locale === 'ru' ? 'ru-RU' : 'en-US'} /></p>
              <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{article.excerpt}</p>
              {(article.tags?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {(article.tags ?? []).map((tag: string) => <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">#{tag}</span>)}
                </div>
              )}
              <span className="text-sm text-primary font-medium flex items-center gap-1">{readMore}<ArrowRight className="h-3.5 w-3.5" /></span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
