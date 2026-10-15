'use client';
import { useState, useEffect } from 'react';
import { Loader2, Trash2, Mail, Phone, Clock, Eye, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { SafeDate } from '@/components/safe-format';
export function ContactsAdmin() {
const [items, setItems] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const load = async () => {
setLoading(true);
try {
const res = await fetch('/api/admin/contacts');
if (res.ok) setItems(await res.json());
    } catch { /* */ }
setLoading(false);
  };
useEffect(() => { load(); }, []);
const markRead = async (id: string) => {
await fetch('/api/admin/contacts', {
method: 'PUT',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ id, status: 'read' }),
    });
    toast.success('Отмечено как прочитанное');
await load();
  };
const handleDelete = async (id: string) => {
if (!confirm('Удалить?')) return;
await fetch('/api/admin/contacts', {
method: 'DELETE',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ id }),
    });
    toast.success('Удалено');
await load();
  };
if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
return (
<div>
<h1 className="font-display text-2xl font-bold mb-6">Заявки</h1>
<div className="space-y-4">
{(items ?? []).map((item: any) => (
<div key={item?.id} className={`bg-card border rounded-xl p-5 ${item?.status === 'new' ? 'border-primary/30 bg-accent/20' : ''}`}>
<div className="flex items-start justify-between gap-4">
<div className="flex-1">
<div className="flex items-center gap-3 mb-2">
<h3 className="font-semibold">{item?.name ?? ''}</h3>
{item?.status === 'new' && <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-white">Новая</span>}
</div>
<div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
<span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{item?.email ?? ''}</span>
{item?.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{item?.phone}</span>}
<span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /><SafeDate date={item?.createdAt} options={{ dateStyle: 'medium', timeStyle: 'short' }} locale="ru-RU" /></span>
</div>
{item?.subject && <p className="text-sm font-medium mb-1">{item?.subject}</p>}
<p className="text-sm text-muted-foreground">{item?.message ?? ''}</p>
</div>
<div className="flex items-center gap-1">
{item?.status === 'new' && (
<button onClick={() => markRead(item?.id)} className="p-2 rounded hover:bg-accent" title="Отметить как прочитанное">
<CheckCircle className="h-4 w-4 text-green-600" />
</button>
                )}
<button onClick={() => handleDelete(item?.id)} className="p-2 rounded hover:bg-destructive/10">
<Trash2 className="h-4 w-4 text-destructive" />
</button>
</div>
</div>
</div>
        ))}
{(items?.length ?? 0) === 0 && <p className="text-center py-10 text-muted-foreground">Нет заявок</p>}
</div>
</div>
  );
}