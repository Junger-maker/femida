'use client';
import { CrudPage } from '../crud-page';

export function TeamAdmin() {
  return (
    <CrudPage
      title="Команда"
      apiUrl="/api/admin/team"
      fields={[
        { key: 'nameRu', label: 'Имя (RU)', type: 'text', required: true },
        { key: 'nameEn', label: 'Name (EN)', type: 'text' },
        { key: 'positionRu', label: 'Должность (RU)', type: 'text', required: true },
        { key: 'positionEn', label: 'Position (EN)', type: 'text' },
        { key: 'bioRu', label: 'Био (RU)', type: 'textarea' },
        { key: 'bioEn', label: 'Bio (EN)', type: 'textarea' },
        { key: 'imageUrl', label: 'Фото', type: 'image' },
        { key: 'loginEmail', label: 'Логин (email для входа в админку)', type: 'text' },
        { key: 'loginPassword', label: 'Пароль (для входа в админку)', type: 'text' },
        { key: 'sortOrder', label: 'Порядок', type: 'number' },
        { key: 'published', label: 'Опубликован', type: 'boolean' },
      ]}
      defaultValues={{
        nameRu: '',
        nameEn: '',
        positionRu: '',
        positionEn: '',
        bioRu: '',
        bioEn: '',
        imageUrl: '',
        loginEmail: '',
        loginPassword: '',
        sortOrder: 0,
        published: true,
      }}
    />
  );
}
