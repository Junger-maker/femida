'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

const DAYS_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const DAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function formatPhone(value: string): string {
  // Оставляем только цифры, убираем ведущую 7/8
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('7') || digits.startsWith('8')) {
    digits = digits.slice(1);
  }
  digits = digits.slice(0, 10);

  let result = '+7';
  if (digits.length > 0) result += ' (' + digits.slice(0, 3);
  if (digits.length >= 3) result += ')';
  if (digits.length > 3) result += ' ' + digits.slice(3, 6);
  if (digits.length > 6) result += '-' + digits.slice(6, 8);
  if (digits.length > 8) result += '-' + digits.slice(8, 10);

  return result;
}

function parsePhoneToDigits(formatted: string): string {
  return formatted.replace(/\D/g, '').replace(/^7/, '');
}

// Простой scroll-picker как на iPhone
function ScrollPicker({
  options,
  value,
  onChange,
  label,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const itemHeight = 40;

  useEffect(() => {
    const idx = options.indexOf(value);
    if (ref.current && idx >= 0) {
      ref.current.scrollTop = idx * itemHeight;
    }
  }, [value, options]);

  const handleScroll = () => {
    if (!ref.current) return;
    const idx = Math.round(ref.current.scrollTop / itemHeight);
    const clamped = Math.max(0, Math.min(idx, options.length - 1));
    if (options[clamped] !== value) {
      onChange(options[clamped]);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {label && <span className="text-xs text-muted-foreground mb-1">{label}</span>}
      <div className="relative h-[120px] w-16 overflow-hidden">
        {/* Подсветка центра */}
        <div className="absolute inset-x-0 top-[40px] h-10 border-y border-primary/30 bg-primary/5 pointer-events-none z-10" />
        <div
          ref={ref}
          onScroll={handleScroll}
          className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
          style={{ scrollSnapType: 'y mandatory' }}
        >
          <div style={{ height: 40 }} />
          {options.map((opt) => (
            <div
              key={opt}
              className={`h-10 flex items-center justify-center text-sm snap-center ${
                opt === value ? 'font-semibold text-foreground' : 'text-muted-foreground'
              }`}
            >
              {opt}
            </div>
          ))}
          <div style={{ height: 40 }} />
        </div>
      </div>
    </div>
  );
}

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

const HOURS = Array.from({ length: 24 }, (_, i) => pad(i));
const MINUTES = Array.from({ length: 12 }, (_, i) => pad(i * 5)); // каждые 5 минут

export function ContactsInfoAdmin() {
  const [form, setForm] = useState({
    addressRu: '',
    addressEn: '',
    phone: '+7',
    email: '',
    workHoursRu: '',
    workHoursEn: '',
    mapLat: 55.765,
    mapLng: 37.6,
  });

  // Состояние для пикера часов
  const [dayFrom, setDayFrom] = useState(0); // Пн
  const [dayTo, setDayTo] = useState(4);   // Пт
  const [startH, setStartH] = useState('09');
  const [startM, setStartM] = useState('00');
  const [endH, setEndH] = useState('18');
  const [endM, setEndM] = useState('00');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Собираем строку часов работы
  useEffect(() => {
    const fromRu = DAYS_RU[dayFrom];
    const toRu = DAYS_RU[dayTo];
    const fromEn = DAYS_EN[dayFrom];
    const toEn = DAYS_EN[dayTo];

    const time = `${startH}:${startM} — ${endH}:${endM}`;

    const ru =
      dayFrom === dayTo
        ? `${fromRu}: ${time}`
        : `${fromRu}-${toRu}: ${time}`;

    const en =
      dayFrom === dayTo
        ? `${fromEn}: ${startH}:${startM} — ${endH}:${endM}`
        : `${fromEn}-${toEn}: ${startH}:${startM} — ${endH}:${endM}`;

    setForm((prev) => ({ ...prev, workHoursRu: ru, workHoursEn: en }));
  }, [dayFrom, dayTo, startH, startM, endH, endM]);

  useEffect(() => {
    fetch('/api/admin/contacts-info')
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) {
          setForm({
            addressRu: data.addressRu || '',
            addressEn: data.addressEn || '',
            phone: data.phone ? formatPhone(data.phone) : '+7',
            email: data.email || '',
            workHoursRu: data.workHoursRu || '',
            workHoursEn: data.workHoursEn || '',
            mapLat: data.mapLat ?? 55.765,
            mapLng: data.mapLng ?? 37.6,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePhoneChange = (raw: string) => {
    setForm({ ...form, phone: formatPhone(raw) });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/contacts-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          phone: form.phone, // уже в красивом формате
        }),
      });
      if (res.ok) {
        toast.success('Контакты сохранены');
      } else {
        toast.error('Ошибка сохранения');
      }
    } catch {
      toast.error('Ошибка сервера');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Контактные данные</h1>
      </div>

      <div className="bg-card border rounded-xl p-6 max-w-3xl space-y-6">
        {/* Адрес */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Адрес (RU)</label>
            <input
              type="text"
              value={form.addressRu}
              onChange={(e) => setForm({ ...form, addressRu: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg bg-background text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Address (EN)</label>
            <input
              type="text"
              value={form.addressEn}
              onChange={(e) => setForm({ ...form, addressEn: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg bg-background text-sm"
            />
          </div>
        </div>

        {/* Телефон + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Телефон</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="+7 (___) ___-__-__"
              className="w-full px-4 py-2.5 border rounded-lg bg-background text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">E-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg bg-background text-sm"
            />
          </div>
        </div>

        {/* Часы работы — пикер */}
        <div>
          <label className="text-sm font-medium mb-3 block">Часы работы</label>

          <div className="border rounded-xl p-4 bg-muted/30 space-y-4">
            {/* Дни */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-muted-foreground">Дни:</span>
              <select
                value={dayFrom}
                onChange={(e) => setDayFrom(Number(e.target.value))}
                className="px-3 py-1.5 border rounded-lg bg-background text-sm"
              >
                {DAYS_RU.map((d, i) => (
                  <option key={i} value={i}>{d}</option>
                ))}
              </select>
              <span className="text-sm">—</span>
              <select
                value={dayTo}
                onChange={(e) => setDayTo(Number(e.target.value))}
                className="px-3 py-1.5 border rounded-lg bg-background text-sm"
              >
                {DAYS_RU.map((d, i) => (
                  <option key={i} value={i}>{d}</option>
                ))}
              </select>
            </div>

            {/* Время — scroll pickers */}
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-1">
                <ScrollPicker options={HOURS} value={startH} onChange={setStartH} label="Час" />
                <span className="text-xl font-bold mt-5">:</span>
                <ScrollPicker options={MINUTES} value={startM} onChange={setStartM} label="Мин" />
              </div>

              <span className="text-muted-foreground mt-5">—</span>

              <div className="flex items-center gap-1">
                <ScrollPicker options={HOURS} value={endH} onChange={setEndH} label="Час" />
                <span className="text-xl font-bold mt-5">:</span>
                <ScrollPicker options={MINUTES} value={endM} onChange={setEndM} label="Мин" />
              </div>
            </div>

            {/* Превью */}
            <p className="text-center text-sm font-medium text-primary">
              {form.workHoursRu}
            </p>
          </div>
        </div>

        {/* Координаты */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Широта (mapLat)</label>
            <input
              type="number"
              step="any"
              value={form.mapLat}
              onChange={(e) => setForm({ ...form, mapLat: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 border rounded-lg bg-background text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Долгота (mapLng)</label>
            <input
              type="number"
              step="any"
              value={form.mapLng}
              onChange={(e) => setForm({ ...form, mapLng: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 border rounded-lg bg-background text-sm"
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Координаты: правый клик на{' '}
          <a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer" className="underline">
            OpenStreetMap
          </a>
        </p>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Сохранить
        </button>
      </div>
    </div>
  );
}