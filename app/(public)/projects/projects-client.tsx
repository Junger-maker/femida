'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Scale, Filter } from 'lucide-react';
import { type Locale } from '@/lib/i18n';

interface ProjectData { id: string; slug: string; title: string; description: string; category: string; year: number; imageUrl: string; }

const CATEGORIES = ['all', 'residential', 'commercial', 'public', 'interior'] as const;

export function ProjectsClient({ locale, projects, translations }: {
  locale: Locale;
  projects: ProjectData[];
  translations: Record<string, string>;
}) {
  const [filter, setFilter] = useState<string>('all');
  const [showCount, setShowCount] = useState(6);
  const safeProjects = projects ?? [];

  const filtered = filter === 'all' ? safeProjects : safeProjects.filter((p: ProjectData) => p.category === filter);
  const visible = filtered.slice(0, showCount);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => { setFilter(cat); setShowCount(6); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1
              ${filter === cat ? 'bg-primary text-white' : 'bg-muted text-foreground hover:bg-accent'}`}>
            {cat === 'all' && <Filter className="h-3.5 w-3.5" />}
            {translations?.[cat] ?? cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((project: ProjectData, i: number) => (
          <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <Link href={`/projects/${project.slug}`} className="group block rounded-xl border border-border/50 bg-card overflow-hidden hover:shadow-lg transition-shadow">
              {project.imageUrl ? (
                <div className="relative aspect-[4/3] bg-muted"><Image src={project.imageUrl} alt={project.title ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-300" /></div>
              ) : (
                <div className="aspect-[4/3] bg-gradient-to-br from-[#1E3A8A]/10 to-[#3B82F6]/10 flex items-center justify-center"><Scale className="h-10 w-10 text-primary/20" /></div>
              )}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{translations?.[project.category] ?? project.category}</span>
                  <span className="text-xs text-muted-foreground">{project.year}</span>
                </div>
                <h3 className="font-display font-semibold text-lg group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {visible.length < filtered.length && (
        <div className="text-center mt-8">
          <button onClick={() => setShowCount((c) => c + 6)}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
            {translations?.more ?? ''}
          </button>
        </div>
      )}
    </>
  );
}
