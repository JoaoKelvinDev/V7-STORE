import { Link, useLocation } from 'react-router-dom';
import { categories } from '@/data/catalog';
import { ChevronDown } from 'lucide-react';

export function RichNavigationMenu() {
  const location = useLocation();

  return (
    <div className="flex items-center gap-1">
      <details key={location.key} className="group relative">
        <summary className="pressable flex cursor-pointer list-none items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium hover:bg-accent sm:px-4">Coleções <ChevronDown className="menu-chevron h-3.5 w-3.5" aria-hidden="true" /></summary>
        <div className="menu-panel absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-border bg-popover p-2 shadow-lg">
          {categories.map(category => (
            <Link key={category.id} to={`/catalogo?categoria=${category.slug}`} className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">{category.name}</Link>
          ))}
        </div>
      </details>
      <Link to="/catalogo" className="hidden rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent sm:block">Ver tudo</Link>
    </div>
  );
}
