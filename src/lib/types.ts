export type Category = {
  id: string;
  name: string;
  slug: string;
  type: "perawatan" | "edukasi";
  icon?: string;
};

export type Article = {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string;
  published: boolean;
  created_at: string;
};

export type Workshop = {
  id: string;
  name: string;
  slug: string;
  address: string;
  kecamatan: string;
  lat: number;
  lng: number;
  jam_operasional: string;
  layanan: string[];
  kontak: string;
  foto_url: string;
  rating: number;
};

export type MotorProblem = {
  id: string;
  slug: string;
  title: string;
  gejala: string[];
  penyebab: string[];
  langkah: string[];
  is_emergency: boolean;
  category: string;
};

export type MaintenanceRule = {
  id: string;
  motor_type: "matic" | "manual" | "all";
  category: string;
  interval_km: number;
  interval_days: number;
  title: string;
  description: string;
};

export type PartCategory =
  | "oli-mesin" | "oli-gardan" | "oli-samping"
  | "cvt" | "ban" | "busi" | "filter-udara"
  | "rem" | "kampas-rem" | "aki" | "rantai" | "kelistrikan";

export type Part = {
  id: string;
  slug: string;
  category: PartCategory;
  brand: string;
  name: string;
  harga_min: number;
  harga_max: number;
  satuan: string;
  cover_url: string;
  specs: Record<string,string>;
  keunggulan: string[];
  cocok_motor: string[];
  interval_km: number;
  interval_bulan?: number;
  deskripsi: string;
  bengkel_ids: string[];
};

export type Motorcycle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  type: "matic" | "manual" | "kopling";
  cc?: number;
  kilometer: number;
  last_service_date: string;
  notes?: string;
};
