'use client';

import { useState } from 'react';
import { Send, MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { type Locale } from '@/lib/i18n';

export function ContactsClient({
  locale,
  translations,
  contactInfo,
}: {
  locale: Locale;
  translations: Record<string, string>;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    workHours: string;
    mapLat: number;
    mapLng: number;
  };
}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    honey: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{ email?: string }>({});

  const handlePhoneChange = (value: string) => {
    const onlyDigits = value.replace(/\D/g, '');
    setForm({ ...form, phone: onlyDigits });
  };

  const handleEmailChange = (value: string) => {
    setForm({ ...form, email: value });
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const validate = () => {
    const newErrors: { email?: string } = {};
    if (!form.email.includes('@')) {
      newErrors.email =
        locale === 'ru' ? 'Email должен содержать символ @' : 'Email must contain @';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.honey) return;
    if (!validate()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
        }),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', subject: '', message: '', honey: '' });
        setErrors({});
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const infoItems = [
    { icon: MapPin, label: translations?.addressLabel ?? '', value: contactInfo.address },
    { icon: Phone, label: translations?.phoneLabel ?? '', value: contactInfo.phone },
    { icon: Mail, label: translations?.emailLabel ?? '', value: contactInfo.email },
    { icon: Clock, label: translations?.workHours ?? '', value: contactInfo.workHours },
  ];

  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${contactInfo.mapLng - 0.02}%2C${contactInfo.mapLat - 0.01}%2C${contactInfo.mapLng + 0.02}%2C${contactInfo.mapLat + 0.01}&layer=mapnik&marker=${contactInfo.mapLat}%2C${contactInfo.mapLng}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Form */}
      <div className="bg-card rounded-xl border border-border/50 p-6">
        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-lg font-medium">{translations?.success ?? ''}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="honey"
              value={form.honey}
              onChange={(e) => setForm({ ...form, honey: e.target.value })}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div>
              <label className="text-sm font-medium mb-1 block">
                {translations?.name ?? ''} *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {translations?.email ?? ''} *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.email ? 'border-destructive' : ''
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  {translations?.phone ?? ''}
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  inputMode="numeric"
                  className="w-full px-4 py-2.5 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                {translations?.subject ?? ''}
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                {translations?.message ?? ''} *
              </label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                {translations?.error ?? ''}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {translations?.send ?? ''}
            </button>
          </form>
        )}
      </div>

      {/* Info & Map */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {infoItems.map((item, i) => (
            <div
              key={i}
              className="bg-card border border-border/50 rounded-xl p-4 flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="h-5 w-5 text-[#3B82F6]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium" suppressHydrationWarning>
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl overflow-hidden border border-border/50 aspect-[4/3]">
          <iframe
            title="Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            src={mapSrc}
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}