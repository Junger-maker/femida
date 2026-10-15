'use client';
import { CrudPage } from '../crud-page';

export function ArticlesAdmin() {
  return (
    <CrudPage title="Статьи" apiUrl="/api/admin/articles"
      fields={[
        { key: 'slug', label: 'Slug (URL)', type: 'text', required: true },
        { key: 'titleRu', label: 'Заголовок (RU)', type: 'text', required: true },
        { key: 'titleEn', label: 'Title (EN)', type: 'text' },
        { key: 'excerptRu', label: 'Анонс (RU)', type: 'textarea' },
        { key: 'excerptEn', label: 'Excerpt (EN)', type: 'textarea' },
        { key: 'contentRu', label: 'Контент (RU) HTML', type: 'richtext' },
        { key: 'contentEn', label: 'Content (EN) HTML', type: 'richtext' },
        { key: 'imageUrl', label: 'URL изображения', type: 'text' },
        { key: 'tags', label: 'Теги (JSON)', type: 'text' },
        { key: 'published', label: 'Опубликован', type: 'boolean' },
      ]}
      defaultValues={{ slug: '', titleRu: '', titleEn: '', excerptRu: '', excerptEn: '', contentRu: '', contentEn: '', imageUrl: '', tags: '[]', published: true }}
    />
  );
}
