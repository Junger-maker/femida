'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { User } from 'lucide-react';
import { type Locale } from '@/lib/i18n';

interface MemberData { id: string; name: string; position: string; bio: string; imageUrl: string; }

export function AboutClient({ locale, team }: { locale: Locale; team: MemberData[] }) {
  const safeTeam = team ?? [];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {safeTeam.map((member: MemberData, i: number) => (
        <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
          className="rounded-xl border border-border/50 bg-card p-6 text-center hover:shadow-lg transition-shadow">
          {member.imageUrl ? (
            <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
              <Image src={member.imageUrl} alt={member.name ?? ''} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary/40" />
            </div>
          )}
          <h3 className="font-display font-semibold text-lg">{member.name}</h3>
          <p className="text-sm text-[#3B82F6] mb-2">{member.position}</p>
          {member.bio && <p className="text-sm text-muted-foreground">{member.bio}</p>}
        </motion.div>
      ))}
    </div>
  );
}
