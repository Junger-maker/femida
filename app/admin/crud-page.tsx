'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { UploadButton } from '@/lib/uploadthing';

interface Field {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'richtext' | 'image';
  options?: { value: string; label: string }[];
  required?: boolean;
}

export function CrudPage({
  title,
  apiUrl,
  fields,
  defaultValues,
}: {
  title: string;
  apiUrl: string;
  fields: Field[];
  defaultValues: Record<string, any>;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl);
      if (res.ok) setItems(await res.json());
    } catch {
      /* */
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const isEdit = !!editing?.id;
      const res = await fetch(apiUrl, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      if (res.ok) {
        toast.success(isEdit ? 'Сохранено' : 'Создано');
        setShowForm(false);
        setEditing(null);
        await load();
      } else {
        toast.error('Ошибка сохранения');
      }
    } catch {
      toast.error('Ошибка сервера');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить?')) return;
    try {
      const res = await fetch(apiUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        toast.success('Удалено');
        await load();
      }
    } catch {
      toast.error('Ошибка');
    }
  };

  const startCreate = () => {
    setEditing({ ...(defaultValues ?? {}) });
    setShowForm(true);
  };

  const startEdit = (item: any) => {
    setEditing({ ...(item ?? {}) });
    setShowForm(true);
  };

  const updateField = (key: string, value: any) => {
    setEditing((prev: any) => ({ ...(prev ?? {}), [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">{title}</h1>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Добавить
        </button>
      </div>

      {showForm && (
        <div className="bg-card border rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">
              {editing?.id ? 'Редактирование' : 'Создание'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
              className="p-1 hover:bg-accent rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(fields ?? []).map((field: Field) => (
              <div
                key={field.key}
                className={
                  field.type === 'textarea' ||
                  field.type === 'richtext' ||
                  field.type === 'image'
                    ? 'md:col-span-2'
                    : ''
                }
              >
                <label className="text-sm font-medium mb-1 block">
                  {field.label}
                </label>

                {field.type === 'boolean' ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editing?.[field.key]}
                      onChange={(e) => updateField(field.key, e.target.checked)}
                      className="rounded border-border"
                    />
                    <span className="text-sm">
                      {editing?.[field.key] ? 'Да' : 'Нет'}
                    </span>
                  </label>
                ) : field.type === 'select' ? (
                  <select
                    value={editing?.[field.key] ?? ''}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-lg bg-background text-sm"
                  >
                    {(field.options ?? []).map((opt: any) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' || field.type === 'richtext' ? (
                  <textarea
                    rows={field.type === 'richtext' ? 8 : 3}
                    value={editing?.[field.key] ?? ''}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-lg bg-background text-sm resize-none"
                  />
                ) : field.type === 'number' ? (
                  <input
                    type="number"
                    value={editing?.[field.key] ?? 0}
                    onChange={(e) =>
                      updateField(field.key, parseInt(e.target.value) || 0)
                    }
                    className="w-full px-4 py-2.5 border rounded-lg bg-background text-sm"
                  />
                ) : field.type === 'image' ? (
                  <div className="space-y-3">
                    {editing?.[field.key] && (
                      <div className="relative w-full max-w-xs">
                        <img
                          src={editing[field.key]}
                          alt="preview"
                          className="rounded-lg border object-cover max-h-48 w-full"
                        />
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-2 items-start">
  <UploadButton
    endpoint="imageUploader"
    onClientUploadComplete={(res) => {
      if (res?.[0]?.ufsUrl) {
        updateField(field.key, res[0].ufsUrl);
        toast.success('Изображение загружено');
      }
    }}
    onUploadError={(error) => {
      toast.error(`Ошибка: ${error.message}`);
    }}
    appearance={{
      button:
        'bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 ut-ready:bg-primary ut-uploading:cursor-not-allowed',
      allowedContent: 'hidden',
    }}
    content={{
      button({ ready, isUploading }) {
        if (isUploading) return 'Загрузка...';
        if (ready) return 'Выбрать файл';
        return 'Загрузка...';
      },
    }}
  />
  <input
    type="text"
    value={editing?.[field.key] ?? ''}
    onChange={(e) => updateField(field.key, e.target.value)}
    placeholder="Или вставьте URL"
    className="flex-1 px-4 py-2.5 border rounded-lg bg-background text-sm"
  />
</div>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={editing?.[field.key] ?? ''}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    required={field.required}
                    className="w-full px-4 py-2.5 border rounded-lg bg-background text-sm"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Сохранить
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium border hover:bg-accent transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {(fields ?? []).slice(0, 4).map((f: Field) => (
                  <th
                    key={f.key}
                    className="px-4 py-3 text-left font-medium text-muted-foreground"
                  >
                    {f.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {(items ?? []).map((item: any) => (
                <tr
                  key={item?.id}
                  className="border-t hover:bg-accent/30 transition-colors"
                >
                  {(fields ?? []).slice(0, 4).map((f: Field) => (
                    <td key={f.key} className="px-4 py-3 max-w-[200px] truncate">
                      {f.type === 'boolean'
                        ? item?.[f.key]
                          ? '✓'
                          : '✗'
                        : String(item?.[f.key] ?? '')}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-1.5 rounded hover:bg-accent"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item?.id)}
                        className="p-1.5 rounded hover:bg-destructive/10 text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(items?.length ?? 0) === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Нет записей
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}