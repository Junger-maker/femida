'use client';
import { CrudPage } from '../crud-page';

export function ProjectsAdmin() {
  return (
    <CrudPage title="Проекты" apiUrl="/api/admin/projects"
      fields={[
        { key: 'slug', label: 'Slug (URL)', type: 'text', required: true },
        { key: 'titleRu', label: 'Название (RU)', type: 'text', required: true },
        { key: 'titleEn', label: 'Title (EN)', type: 'text' },
        { key: 'category', label: 'Категория', type: 'select', options: [
          { value: 'residential', label: 'Жилые споры' },
          { value: 'commercial', label: 'Коммерческие' },
          { value: 'public', label: 'Публичные' },
          { value: 'interior', label: 'Интерьеры' },
        ]},
        { key: 'year', label: 'Год', type: 'number' },
        { key: 'descriptionRu', label: 'Описание (RU)', type: 'textarea' },
        { key: 'descriptionEn', label: 'Description (EN)', type: 'textarea' },
        { key: 'contentRu', label: 'Контент (RU) HTML', type: 'richtext' },
        { key: 'contentEn', label: 'Content (EN) HTML', type: 'richtext' },
        { key: 'imageUrl', label: 'Изображение', type: 'image' },
        { key: 'published', label: 'Опубликован', type: 'boolean' },
      ]}
      defaultValues={{ slug: '', titleRu: '', titleEn: '', category: 'residential', year: 2024, descriptionRu: '', descriptionEn: '', contentRu: '', contentEn: '', imageUrl: '', published: true }}
    />
  );
}
