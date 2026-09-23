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
  "Honda BeAT 110": { oli: "Federal Racing 10W-30 MB (0.65L)", banDepan: "80/90-14", banBelakang: "90/90-14", aki: "GTZ5S / YTZ5S (MF 12V 3.5Ah)", busi: "NGK CPR8EA-9", foto: "/motor1.jpeg", volumeOli: "0.65L", catatan: "Matic kecil, JASO MB" },
  "Honda Vario 125": { oli: "MPX1 10W-30 MB (0.8L) / Enduro Matic G 10W-30", banDepan: "90/80-14", banBelakang: "100/80-14", aki: "GTZ6V (MF 12V 5Ah)", busi: "NGK CPR8EA-9", foto: "/motor1.jpeg" },
  "Honda Vario 160": { oli: "MPX1 10W-30 MB (0.8L) / Enduro Matic G 10W-30", banDepan: "100/80-14", banBelakang: "120/70-14", aki: "GTZ6V / YTZ6V (MF)", busi: "NGK CPR8EA-9", foto: "/motor1.jpeg" },
  "Honda Scoopy 110": { oli: "MPX1 10W-30 MB (0.65L)", banDepan: "100/90-12", banBelakang: "110/90-12", aki: "GTZ5S", busi: "NGK CPR8EA-9", foto: "/motor2.jpeg" },
  "Honda Genio 110": { oli: "MPX1 10W-30 MB (0.65L)", banDepan: "80/90-14", banBelakang: "90/90-14", aki: "GTZ5S", busi: "NGK CPR8EA-9", foto: "/motor3.jpeg" },
  "Honda PCX 160": { oli: "MPX1 10W-30 MB (0.8L) / Motul 3100 10W-30", banDepan: "110/70-14", banBelakang: "130/70-13", aki: "GTZ7S / YTZ7S", busi: "NGK CPR8EA-9", foto: "/motor4.jpeg" },
  "Honda ADV 160": { oli: "MPX1 10W-30 MB (0.8L)", banDepan: "110/80-14", banBelakang: "130/70-13", aki: "GTZ6V", busi: "NGK CPR8EA-9", foto: "/motor1.jpeg" },
  "Honda CB150R": { oli: "Shell AX7 10W-40 MA2 (1.0L) / Motul 3100 Gold", banDepan: "100/80-17", banBelakang: "130/70-17", aki: "GTZ5S", busi: "NGK CPR8EA-9", foto: "/motor2.jpeg" },
  "Honda Supra GTR 150": { oli: "Federal Racing 10W-30 MA2 (1.0L)", banDepan: "90/80-17", banBelakang: "120/70-17", aki: "GTZ5S", busi: "NGK CR8E", foto: "/motor3.jpeg" },
  "Yamaha NMAX 155": { oli: "Yamalube Matic 10W-40 MB (0.9L) / Federal Racing 10W-30", banDepan: "110/70-13", banBelakang: "130/70-13", aki: "GTZ7V / YTZ7V", busi: "NGK CPR8EA-9", foto: "/motor4.jpeg" },
  "Yamaha Aerox 155": { oli: "Yamalube Matic 10W-40 MB (0.9L)", banDepan: "110/80-14", banBelakang: "140/70-14", aki: "GTZ7V", busi: "NGK CPR8EA-9", foto: "/motor1.jpeg" },
  "Yamaha Mio M3 125": { oli: "Yamalube Matic 10W-40 MB (0.8L)", banDepan: "80/80-14", banBelakang: "90/80-14", aki: "GTZ5S", busi: "NGK CPR8EA-9", foto: "/motor1.jpeg" },
  "Yamaha Lexi 125": { oli: "Yamalube Matic 10W-40 MB (0.9L)", banDepan: "90/90-14", banBelakang: "100/90-14", aki: "GTZ6V", busi: "NGK CPR8EA-9", foto: "/motor4.jpeg" },
  "Yamaha Fazzio 125": { oli: "Yamalube Matic 10W-40 MB (0.8L)", banDepan: "110/70-12", banBelakang: "110/70-12", aki: "GTZ6V", busi: "NGK CPR8EA-9", foto: "/motor1.jpeg" },
  "Yamaha Vixion 150": { oli: "Shell AX7 10W-40 MA2 (1.0L) / Yamalube Sport 10W-40", banDepan: "90/80-17", banBelakang: "120/70-17", aki: "GTZ4V / YTZ4V", busi: "NGK CR8E", foto: "/motor2.jpeg" },
  "Yamaha R15": { oli: "Yamalube Sport 10W-40 MA2 (1.0L) / Motul 3100", banDepan: "100/80-17", banBelakang: "140/70-17", aki: "GTZ4V", busi: "NGK CR9E", foto: "/motor3.jpeg" },
  "Yamaha XMAX 250": { oli: "Yamalube Matic 10W-40 MB (1.6L) / Motul 5100", banDepan: "120/70-15", banBelakang: "140/70-14", aki: "GTZ8V", busi: "NGK CPR8EA-9", foto: "/motor2.jpeg" },
  "Suzuki Address 110": { oli: "Ecstar Matic 10W-30 MB (0.65L)", banDepan: "80/90-14", banBelakang: "90/90-14", aki: "GTZ5S", busi: "NGK CPR8EA-9", foto: "/motor3.jpeg" },
  "Suzuki GSX-R150": { oli: "Ecstar R9000 10W-40 MA2 (1.3L)", banDepan: "90/80-17", banBelakang: "130/70-17", aki: "GTZ6V", busi: "NGK CR8E", foto: "/motor2.jpeg" },
  "Vespa Sprint 150": { oli: "Motul 5100 10W-40 MB (1.1L) / Enduro Matic", banDepan: "110/70-12", banBelakang: "120/70-12", aki: "GTZ8V", busi: "NGK CR8EKB", foto: "/motor1.jpeg" },
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
