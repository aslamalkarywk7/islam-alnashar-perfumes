import type {CategoryRow, ProductRow} from '../types';

export interface CategoryDTO {
  id: number;
  slug: string;
  name_ar: string;
  name_en: string;
  image_url?: string | null;
}

export interface ProductDTO {
  id: number;
  sku: string;
  slug: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  compare_at_price: number | null;
  stock: number;
  brand: string | null;
  images: string[];
  specs: {ar: Record<string, string>; en: Record<string, string>};
  is_featured: boolean;
  rating_avg: number;
  rating_count: number;
  category: {id: number; slug: string; name_ar: string; name_en: string};
  // perfume metadata
  size_ml: number;
  concentration: string;
  notes: {ar: string[]; en: string[]};
  created_at: string;
}

export function toCategoryDTO(row: CategoryRow): CategoryDTO {
  return {
    id: row.id,
    slug: row.slug,
    name_ar: row.name_ar,
    name_en: row.name_en,
    image_url: row.image_url,
  };
}

function parseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function toProductDTO(row: ProductRow, category?: CategoryDTO | null): ProductDTO {
  const images = parseJson<string[]>(row.images, []);
  const notesRaw = parseJson<{ar?: string[]; en?: string[]}>(row.notes, {});
  return {
    id: row.id,
    sku: row.sku,
    slug: row.slug,
    name_ar: row.name_ar,
    name_en: row.name_en,
    description_ar: row.description_ar,
    description_en: row.description_en,
    price: row.price,
    compare_at_price: row.compare_at_price,
    stock: row.stock,
    brand: row.brand,
    images,
    specs: {ar: {}, en: {}},
    is_featured: row.is_featured === 1,
    rating_avg: row.rating_avg,
    rating_count: row.rating_count,
    category: category ?? {id: row.category_id, slug: '', name_ar: '', name_en: ''},
    size_ml: row.size_ml,
    concentration: row.concentration,
    notes: {ar: notesRaw.ar ?? [], en: notesRaw.en ?? []},
    created_at: row.created_at,
  };
}
