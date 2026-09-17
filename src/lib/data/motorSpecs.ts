export type MotorSpec = {
  oli: string;
  banDepan: string;
  banBelakang: string;
  aki: string;
  busi: string;
  foto: string;
  volumeOli?: string;
  catatan?: string;
};

export const motorSpecs: Record<string, MotorSpec> = {
  "Honda BeAT 110": { oli: "Federal Racing 10W-30 MB (0.65L)", banDepan: "80/90-14", banBelakang: "90/90-14", aki: "GTZ5S / YTZ5S (MF 12V 3.5Ah)", busi: "NGK CPR8EA-9", foto: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80", volumeOli: "0.65L", catatan: "Matic kecil, JASO MB" },
  "Honda Vario 125": { oli: "MPX1 10W-30 MB (0.8L) / Enduro Matic G 10W-30", banDepan: "90/80-14", banBelakang: "100/80-14", aki: "GTZ6V (MF 12V 5Ah)", busi: "NGK CPR8EA-9", foto: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80" },
  "Honda Vario 160": { oli: "MPX1 10W-30 MB (0.8L) / Enduro Matic G 10W-30", banDepan: "100/80-14", banBelakang: "120/70-14", aki: "GTZ6V / YTZ6V (MF)", busi: "NGK CPR8EA-9", foto: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80" },
  "Honda Scoopy 110": { oli: "MPX1 10W-30 MB (0.65L)", banDepan: "100/90-12", banBelakang: "110/90-12", aki: "GTZ5S", busi: "NGK CPR8EA-9", foto: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=600&q=80" },
  "Honda Genio 110": { oli: "MPX1 10W-30 MB (0.65L)", banDepan: "80/90-14", banBelakang: "90/90-14", aki: "GTZ5S", busi: "NGK CPR8EA-9", foto: "https://images.unsplash.com/photo-1558980664-2506f92884c5?w=600&q=80" },
  "Honda PCX 160": { oli: "MPX1 10W-30 MB (0.8L) / Motul 3100 10W-30", banDepan: "110/70-14", banBelakang: "130/70-13", aki: "GTZ7S / YTZ7S", busi: "NGK CPR8EA-9", foto: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&q=80" },
  "Honda ADV 160": { oli: "MPX1 10W-30 MB (0.8L)", banDepan: "110/80-14", banBelakang: "130/70-13", aki: "GTZ6V", busi: "NGK CPR8EA-9", foto: "https://images.unsplash.com/photo-1609630875170-59d7a3865ca9?w=600&q=80" },
  "Honda CB150R": { oli: "Shell AX7 10W-40 MA2 (1.0L) / Motul 3100 Gold", banDepan: "100/80-17", banBelakang: "130/70-17", aki: "GTZ5S", busi: "NGK CPR8EA-9", foto: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80" },
  "Honda Supra GTR 150": { oli: "Federal Racing 10W-30 MA2 (1.0L)", banDepan: "90/80-17", banBelakang: "120/70-17", aki: "GTZ5S", busi: "NGK CR8E", foto: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80" },
  "Yamaha NMAX 155": { oli: "Yamalube Matic 10W-40 MB (0.9L) / Federal Racing 10W-30", banDepan: "110/70-13", banBelakang: "130/70-13", aki: "GTZ7V / YTZ7V", busi: "NGK CPR8EA-9", foto: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&q=80" },
  "Yamaha Aerox 155": { oli: "Yamalube Matic 10W-40 MB (0.9L)", banDepan: "110/80-14", banBelakang: "140/70-14", aki: "GTZ7V", busi: "NGK CPR8EA-9", foto: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80" },
  "Yamaha Mio M3 125": { oli: "Yamalube Matic 10W-40 MB (0.8L)", banDepan: "80/80-14", banBelakang: "90/80-14", aki: "GTZ5S", busi: "NGK CPR8EA-9", foto: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80" },
  "Yamaha Lexi 125": { oli: "Yamalube Matic 10W-40 MB (0.9L)", banDepan: "90/90-14", banBelakang: "100/90-14", aki: "GTZ6V", busi: "NGK CPR8EA-9", foto: "https://images.unsplash.com/photo-1511919884226-fd3ec7956e9d?w=600&q=80" },
  "Yamaha Fazzio 125": { oli: "Yamalube Matic 10W-40 MB (0.8L)", banDepan: "110/70-12", banBelakang: "110/70-12", aki: "GTZ6V", busi: "NGK CPR8EA-9", foto: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80" },
  "Yamaha Vixion 150": { oli: "Shell AX7 10W-40 MA2 (1.0L) / Yamalube Sport 10W-40", banDepan: "90/80-17", banBelakang: "120/70-17", aki: "GTZ4V / YTZ4V", busi: "NGK CR8E", foto: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80" },
  "Yamaha R15": { oli: "Yamalube Sport 10W-40 MA2 (1.0L) / Motul 3100", banDepan: "100/80-17", banBelakang: "140/70-17", aki: "GTZ4V", busi: "NGK CR9E", foto: "https://images.unsplash.com/photo-1558980664-2506f92884c5?w=600&q=80" },
  "Yamaha XMAX 250": { oli: "Yamalube Matic 10W-40 MB (1.6L) / Motul 5100", banDepan: "120/70-15", banBelakang: "140/70-14", aki: "GTZ8V", busi: "NGK CPR8EA-9", foto: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80" },
  "Suzuki Address 110": { oli: "Ecstar Matic 10W-30 MB (0.65L)", banDepan: "80/90-14", banBelakang: "90/90-14", aki: "GTZ5S", busi: "NGK CPR8EA-9", foto: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80" },
  "Suzuki GSX-R150": { oli: "Ecstar R9000 10W-40 MA2 (1.3L)", banDepan: "90/80-17", banBelakang: "130/70-17", aki: "GTZ6V", busi: "NGK CR8E", foto: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80" },
  "Vespa Sprint 150": { oli: "Motul 5100 10W-40 MB (1.1L) / Enduro Matic", banDepan: "110/70-12", banBelakang: "120/70-12", aki: "GTZ8V", busi: "NGK CR8EKB", foto: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80" },
};

// helper for lookup with fallback
export function getMotorSpec(brand: string, model: string): MotorSpec | undefined {
  const key = `${brand} ${model}`;
  if (motorSpecs[key]) return motorSpecs[key];
  // try without cc suffix: "Vario 160" -> "Vario"
  const short = `${brand} ${model.split(" ")[0]}`;
  // try partial match: includes model
  for (const k of Object.keys(motorSpecs)) {
    if (k.toLowerCase().includes(model.toLowerCase()) || model.toLowerCase().includes(k.split(" ").slice(1).join(" ").toLowerCase())) {
      return motorSpecs[k];
    }
  }
  return undefined;
}
