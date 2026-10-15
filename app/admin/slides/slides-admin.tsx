'use client';

import { CrudPage } from '../crud-page';

export function SlidesAdmin() {
  return (
    <CrudPage
      title="Слайды"
      apiUrl="/api/admin/slides"
      fields={[
        { key: 'titleRu', label: 'Заголовок (RU)', type: 'text', required: true },
        { key: 'titleEn', label: 'Заголовок (EN)', type: 'text' },
        { key: 'subtitleRu', label: 'Подзаголовок (RU)', type: 'text' },
        { key: 'subtitleEn', label: 'Подзаголовок (EN)', type: 'text' },
        { key: 'imageUrl', label: 'URL изображения', type: 'text' },
        { key: 'linkUrl', label: 'URL ссылки', type: 'text' },
        { key: 'sortOrder', label: 'Порядок', type: 'number' },
        { key: 'published', label: 'Опубликован', type: 'boolean' },
      ]}
      defaultValues={{ titleRu: '', titleEn: '', subtitleRu: '', subtitleEn: '', imageUrl: '', linkUrl: '', sortOrder: 0, published: true }}
    />
  );
}
