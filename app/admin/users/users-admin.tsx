'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
};

export function UsersAdmin() {
  const [items, setItems] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<UserRow> & { password?: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) setItems(await res.json());
      else if (res.status === 403) toast.error('Нет доступа');
    } catch {
      toast.error('Ошибка загрузки');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const startCreate = () => {
    setEditing({ email: '', name: '', role: 'editor', password: '' });
    setShowForm(true);
  };

  const startEdit = (item: UserRow) => {
    setEditing({ ...item, password: '' });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!editing?.email) {
      toast.error('Укажите email (логин)');
      return;
    }
    if (!editing.id && !editing.password) {
      toast.error('Укажите пароль');
      return;
    }

    setSaving(true);
    try {
      const isEdit = !!editing.id;
      const res = await fetch('/api/admin/users', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(isEdit ? 'Сохранено' : 'Пользователь создан');
        setShowForm(false);
        setEditing(null);
        await load();
      } else {
        toast.error(data.error || 'Ошибка');
      }
    } catch {
      toast.error('Ошибка сервера');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить учётку?')) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Удалено');
        await load();
      } else {
        toast.error(data.error || 'Ошибка');
      }
    } catch {
      toast.error('Ошибка');
    }
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
        <h1 className="font-display text-2xl font-bold">Учётки</h1>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Добавить
        </button>
      </div>

      {showForm && (
        <div className="bg-card border rounded-xl p-6 mb-6 max-w-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{editing?.id ? 'Редактирование' : 'Новая учётка'}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-1 hover:bg-accent rounded">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Имя</label>
            <input
              type="text"
              value={editing?.name ?? ''}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg bg-background text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Логин (email) *</label>
            <input
              type="email"
              required
              value={editing?.email ?? ''}
              onChange={(e) => setEditing({ ...editing, email: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg bg-background text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Пароль {editing?.id ? '(оставьте пустым, чтобы не менять)' : '*'}
            </label>
            <input
              type="text"
              value={editing?.password ?? ''}
              onChange={(e) => setEditing({ ...editing, password: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg bg-background text-sm"
              placeholder={editing?.id ? '••••••••' : 'Задайте пароль'}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Роль</label>
            <select
              value={editing?.role ?? 'editor'}
              onChange={(e) => setEditing({ ...editing, role: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg bg-background text-sm"
            >
              <option value="editor">Сотрудник (урезанный доступ)</option>
              <option value="admin">Администратор (полный доступ)</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Сохранить
            </button>
            <button
              onClick={() => { setShowForm(false); setEditing(null); }}
              className="px-4 py-2 rounded-lg text-sm border hover:bg-accent"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Имя</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Логин</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Роль</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t hover:bg-accent/30">
                <td className="px-4 py-3">{item.name || '—'}</td>
                <td className="px-4 py-3">{item.email}</td>
                <td className="px-4 py-3">
                  {item.role === 'admin' ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-white">Админ</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted">Сотрудник</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => startEdit(item)} className="p-1.5 rounded hover:bg-accent">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  Нет учёток
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
