import { redirect } from 'next/navigation';

export default function SignupPage() {
  // Публичная регистрация отключена.
  // Учётки создаёт только администратор в разделе «Учётки».
  redirect('/admin/login');
}
