import Link from 'next/link';
import { Scale, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <Scale className="h-20 w-20 text-primary/20 mx-auto mb-6" />
        <h1 className="font-display text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Страница не найдена</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-primary text-white font-medium px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          На главную
        </Link>
      </div>
    </div>
  );
}
