'use client';

import { motion } from 'framer-motion';
import { Scale, Shield, Gavel, Users, FileText, ChevronDown, Briefcase, BookOpen, Building, HandCoins } from 'lucide-react';
import { useState } from 'react';
import { type Locale } from '@/lib/i18n';

interface ServiceData { id: string; title: string; description: string; iconName: string; }

const iconMap: Record<string, any> = { scale: Scale, shield: Shield, gavel: Gavel, users: Users, filetext: FileText, briefcase: Briefcase, bookopen: BookOpen, building: Building, handcoins: HandCoins };

export function ServicesClient({ locale, services, stagesTitle }: { locale: Locale; services: ServiceData[]; stagesTitle: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const safeServices = services ?? [];

  const stages = locale === 'ru'
    ? ['Консультация', 'Анализ ситуации', 'Разработка стратегии', 'Ведение дела', 'Результат']
    : ['Consultation', 'Analysis', 'Strategy', 'Case Management', 'Result'];

  return (
    <>
      <div className="space-y-3 mb-16">
        {safeServices.map((service: ServiceData, i: number) => {
          const Icon = iconMap[service.iconName?.toLowerCase()] ?? Scale;
          const isOpen = openId === service.id;
          return (
            <motion.div key={service.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="border border-border/50 rounded-xl bg-card overflow-hidden">
              <button onClick={() => setOpenId(isOpen ? null : service.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-accent/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-[#3B82F6]" />
                </div>
                <span className="font-display font-semibold text-lg flex-1">{service.title}</span>
                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && service.description && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-5 pb-5">
                  <p className="text-muted-foreground leading-relaxed pl-14">{service.description}</p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Timeline */}
      <SectionHeadingSimple title={stagesTitle} />
      <div className="relative pl-8 border-l-2 border-[#3B82F6]/30 space-y-10 mb-8">
        {stages.map((stage, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="relative">
            <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-[#3B82F6] border-4 border-white" />
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <span className="text-xs font-medium text-[#3B82F6] mb-1 block">{locale === 'ru' ? `Этап ${i + 1}` : `Stage ${i + 1}`}</span>
              <h3 className="font-display font-semibold">{stage}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

function SectionHeadingSimple({ title }: { title: string }) {
  return (
    <div className="text-center mb-10">
      <h2 className="font-display text-3xl font-bold tracking-tight">{title}</h2>
      <div className="mt-4 mx-auto w-16 h-1 bg-primary rounded-full" />
    </div>
  );
}
