'use client';
import { CrudPage } from '../crud-page';

export function ServicesAdmin() {
  return (
    <CrudPage title="Услуги" apiUrl="/api/admin/services"
      fields={[
        { key: 'titleRu', label: 'Название (RU)', type: 'text', required: true },
        { key: 'titleEn', label: 'Title (EN)', type: 'text' },
        { key: 'descriptionRu', label: 'Описание (RU)', type: 'textarea' },
        { key: 'descriptionEn', label: 'Description (EN)', type: 'textarea' },
        { key: 'iconName', label: 'Иконка (lucide)', type: 'text' },
        { key: 'sortOrder', label: 'Порядок', type: 'number' },
        { key: 'published', label: 'Опубликован', type: 'boolean' },
      ]}
      defaultValues={{ titleRu: '', titleEn: '', descriptionRu: '', descriptionEn: '', iconName: 'scale', sortOrder: 0, published: true }}
    />
  );
}
