'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield, Gavel, Users, Scale, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { type Locale } from '@/lib/i18n';
import { SafeDate } from '@/components/safe-format';

interface SlideData { id: string; title: string; subtitle: string; imageUrl: string; linkUrl: string; }
interface ArticleData { id: string; slug: string; title: string; excerpt: string; imageUrl: string; publishedAt: string; tags: string[]; }

export function HomeClient({ locale, slides, articles, translations }: {
  locale: Locale;
  slides: SlideData[];
  articles: ArticleData[];
  translations: Record<string, string>;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const safeSlides = slides ?? [];
  const safeArticles = articles ?? [];

  const nextSlide = useCallback(() => {
    if (safeSlides.length > 0) setCurrentSlide((p) => (p + 1) % safeSlides.length);
  }, [safeSlides.length]);

  const prevSlide = useCallback(() => {
    if (safeSlides.length > 0) setCurrentSlide((p) => (p - 1 + safeSlides.length) % safeSlides.length);
  }, [safeSlides.length]);

  useEffect(() => {
    if (safeSlides.length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, safeSlides.length]);

  const features = [
    { icon: Shield, title: locale === 'ru' ? 'Защита прав' : 'Rights Protection', desc: locale === 'ru' ? 'Полная юридическая поддержка' : 'Full legal support' },
    { icon: Gavel, title: locale === 'ru' ? 'Судебные дела' : 'Court Cases', desc: locale === 'ru' ? 'Представительство в суде' : 'Court representation' },
    { icon: Users, title: locale === 'ru' ? 'Консультации' : 'Consultations', desc: locale === 'ru' ? 'Экспертные консультации' : 'Expert consultations' },
    { icon: Scale, title: locale === 'ru' ? 'Медиация' : 'Mediation', desc: locale === 'ru' ? 'Досудебное урегулирование' : 'Pre-trial settlement' },
  ];

  return (
    <>
      {/* Hero Slider */}
      <section className="relative bg-[#1E3A8A] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A] via-[#1E3A8A] to-[#3B82F6]/30" />
        <div className="relative mx-auto max-w-[1200px] px-4 py-20 md:py-32">
          {safeSlides.length > 0 ? (
            <div className="relative">
              <motion.div key={currentSlide} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }}>
                <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4">
                  {safeSlides[currentSlide]?.title ?? ''}
                </h1>
                <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-8">
                  {safeSlides[currentSlide]?.subtitle ?? ''}
                </p>
              </motion.div>
              {safeSlides.length > 1 && (
                <div className="flex items-center gap-2 mt-6">
                  <button onClick={prevSlide} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"><ChevronLeft className="h-5 w-5" /></button>
                  {safeSlides.map((_: SlideData, i: number) => (
                    <button key={i} onClick={() => setCurrentSlide(i)} className={`w-3 h-3 rounded-full transition-colors ${i === currentSlide ? 'bg-white' : 'bg-white/30'}`} />
                  ))}
                  <button onClick={nextSlide} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"><ChevronRight className="h-5 w-5" /></button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4">{translations?.heroTitle ?? ''}</h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-8">{translations?.heroSubtitle ?? ''}</p>
            </div>
          )}
          <Link href="/contacts" className="inline-flex items-center gap-2 bg-white text-[#1E3A8A] font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors mt-4">
            {translations?.heroCta ?? ''}<ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-[1200px] px-4">
          <h2 className="text-center font-display text-3xl font-bold tracking-tight mb-10">{translations?.popularTitle ?? ''}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl bg-background hover:shadow-lg transition-shadow border border-border/50 text-center">
                <div className="mx-auto w-14 h-14 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center mb-4">
                  <f.icon className="h-7 w-7 text-[#3B82F6]" />
                </div>
                <h3 className="font-display font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About snippet */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-[1200px] px-4 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h2 className="font-display text-3xl font-bold tracking-tight mb-4">{translations?.aboutTitle ?? ''}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{translations?.aboutText ?? ''}</p>
            <Link href="/about" className="inline-flex items-center gap-2 bg-primary text-white font-medium px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
              {translations?.aboutCta ?? ''}<ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-72 h-72 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center">
              <Scale className="h-32 w-32 text-white/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      {safeArticles.length > 0 && (
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-[1200px] px-4">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-display text-3xl font-bold tracking-tight">{translations?.newsTitle ?? ''}</h2>
              <Link href="/blog" className="text-primary font-medium text-sm flex items-center gap-1 hover:underline">
                {translations?.newsAll ?? ''}<ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {safeArticles.map((article: ArticleData, i: number) => (
                <motion.div key={article.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Link href={`/blog/${article.slug}`} className="group block rounded-xl border border-border/50 bg-card overflow-hidden hover:shadow-lg transition-shadow">
                    {article.imageUrl ? (
                      <div className="relative aspect-video bg-muted"><Image src={article.imageUrl} alt={article.title ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-300" /></div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-[#1E3A8A]/10 to-[#3B82F6]/10 flex items-center justify-center"><Scale className="h-10 w-10 text-primary/20" /></div>
                    )}
                    <div className="p-5">
                      <p className="text-xs text-muted-foreground mb-2"><SafeDate date={article.publishedAt} options={{ dateStyle: 'long' }} locale={locale === 'ru' ? 'ru-RU' : 'en-US'} /></p>
                      <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-[#1E3A8A] text-white text-center">
        <div className="mx-auto max-w-[1200px] px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">{translations?.heroCta ?? ''}</h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">{translations?.heroSubtitle ?? ''}</p>
          <Link href="/contacts" className="inline-flex items-center gap-2 bg-white text-[#1E3A8A] font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors">
            {translations?.heroCta ?? ''}<ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
