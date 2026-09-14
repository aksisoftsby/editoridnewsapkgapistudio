import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 1. Headline: Megaphone / Breaking Star
export const SvgHeadline: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

// 2. Nasional: Gedung Parlemen / Istana Negara
export const SvgNasional: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M2 9.5L12 4L22 9.5H2Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M4 10V18M8 10V18M12 10V18M16 10V18M20 10V18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M2 18H22M1 21H23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 3. Hukum: Neraca Keadilan / Timbangan Hukum
export const SvgHukum: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3V21M6 21H18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M4 7L12 5L20 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 14C2 16.5 4 17.5 6 17.5C8 17.5 10 16.5 10 14L6 7L2 14Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M14 14C14 16.5 16 17.5 18 17.5C20 17.5 22 16.5 22 14L18 7L14 14Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

// 4. Politik: Sidang Rakyat / Rapat Perwakilan
export const SvgPolitik: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="9" cy="7" r="3" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3 19V17C3 14.7909 4.79086 13 7 13H11C13.2091 13 15 14.7909 15 17V19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="17" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M16 13.5C17.7 13.9 19 15.3 19 17V19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 5. Bisnis: Grafik Pertumbuhan / Trend Finansial
export const SvgBisnis: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="13" width="4" height="8" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" />
    <rect x="10" y="8" width="4" height="13" rx="1" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.8" />
    <rect x="17" y="4" width="4" height="17" rx="1" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.8" />
    <path d="M4 10L10 5L14 8L20 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 2H20V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 6. Nusantara / Regional: Kepulauan Peta Indonesia
export const SvgNusantara: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="12" cy="9" r="3" fill="currentColor" />
  </svg>
);

// 7. Sepak Bola: Bola Sepak
export const SvgSepakBola: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <polygon points="12,8 15,10.5 14,14 10,14 9,10.5" fill="currentColor" fillOpacity="0.35" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 3V8M15 10.5L20 9M14 14L18 19M10 14L6 19M9 10.5L4 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 8. Internasional: Globe Bola Dunia
export const SvgInternasional: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.8" />
    <ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3.5 9H20.5M3.5 15H20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 9. Iptek / Teknologi: CPU Microchip Processor
export const SvgIptek: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="5" y="5" width="14" height="14" rx="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" />
    <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 2V5M15 2V5M9 19V22M15 19V22M2 9H5M2 15H5M19 9H22M19 15H22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 10. Pendidikan: Toga Wisuda & Topi Akademik
export const SvgPendidikan: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <polygon points="12,4 22,9 12,14 2,9" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M6 11V16C6 18.5 8.7 20 12 20C15.3 20 18 18.5 18 16V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M22 9V17M20 17H24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 11. Medika dan Kesehatan: Detak Jantung ECG
export const SvgKesehatan: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M7 11.5H9.5L11 8.5L13 14.5L14.5 11.5H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 12. Gaya Hidup: Cangkir Kopi & Lifestyle
export const SvgGayaHidup: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M18 8H19C20.1 8 21 8.9 21 10V11C21 12.1 20.1 13 19 13H18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M4 8H18V14C18 16.8 15.8 19 13 19H9C6.2 19 4 16.8 4 14V8Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <line x1="2" y1="21" x2="20" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M6 3V5M10 3V5M14 3V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 13. Otomotif: Mobil & Roda Mesin
export const SvgOtomotif: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M5 11L7.5 5.5H16.5L19 11M3 11H21V17H3V11Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="7" cy="17" r="2.5" fill="currentColor" />
    <circle cx="17" cy="17" r="2.5" fill="currentColor" />
  </svg>
);

// 14. Trending Topik: Api Membara
export const SvgTrending: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2C10.5 5.5 7 7.5 7 11.5C7 14.5 9.2 17 12 17C14.8 17 17 14.5 17 11.5C17 9 15.5 6.5 12 2Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 12C11 12 10 12.8 10 14C10 15.2 10.8 16 12 16C13.2 16 14 15.2 14 14C14 12.8 13 12 12 12Z" fill="currentColor" />
  </svg>
);

// 15. Berita Pilihan Editor: Badge Verifikasi Pena
export const SvgPilihanEditor: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L15 5H19V9L22 12L19 15V19H15L12 22L9 19H5V15L2 12L5 9V5H9L12 2Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 16. Kabar dari Istana: Lambang Istana / Kepresidenan
export const SvgIstana: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L3 7V9H21V7L12 2Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M5 9V17M9 9V17M15 9V17M19 9V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <rect x="2" y="17" width="20" height="4" rx="1" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

// 17. Energi dan Mineral: Petir & Kilang
export const SvgEnergi: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

// 18. Infotainment dan Gosip Artis: Lensa Kamera & Bintang
export const SvgInfotainment: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M23 19C23 20.1 22.1 21 21 21H3C1.9 21 1 20.1 1 19V8C1 6.9 1.9 6 3 6H7L9 3H15L17 6H21C22.1 6 23 6.9 23 8V19Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

// 19. Kriminal: Borgol
export const SvgKriminal: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="7" cy="14" r="4" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="17" cy="14" r="4" stroke="currentColor" strokeWidth="1.8" />
    <path d="M11 14H13M7 10V8C7 6.9 7.9 6 9 6H15C16.1 6 17 6.9 17 8V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 20. Bursa dan Keuangan: Koin Rupiah / Keuangan
export const SvgBursa: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M10 8H13.5C14.3 8 15 8.7 15 9.5C15 10.3 14.3 11 13.5 11H10V16M10 11H14L15.5 16M8 8V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 21. Musik dan Film: Nada Not Balok & Klapper
export const SvgMusikFilm: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M9 18V5L20 3V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6" cy="18" r="3" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="17" cy="16" r="3" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

// 22. Cafe & Kuliner: Sendok Garpu Piring
export const SvgKuliner: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="8" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9 8V12M11 8V12M10 8V16M14 8C14 10 15 11 15 16M14 8C14 9.5 13 11 13 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// 23. Ketahanan Pangan: Bulir Padi
export const SvgKetahananPangan: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 22V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 14C10 12 8 13 7 14C6 15 7 17 9 17C11 17 12 15 12 14Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 10C14 8 16 9 17 10C18 11 17 13 15 13C13 13 12 11 12 10Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 6C10 4 8 5 7 6C6 7 7 9 9 9C11 9 12 7 12 6Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 3C13 1.5 15 2 15.5 3C16 4 15 5 14 5C13 5 12 4 12 3Z" fill="currentColor" />
  </svg>
);

// 24. Wawancara Khusus: Mikrofon Reporter
export const SvgWawancara: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M5 10V11C5 14.9 8.1 18 12 18C15.9 18 19 14.9 19 11V10M12 18V22M8 22H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 25. Properti: Rumah Arsitektur
export const SvgProperti: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 10.5L12 3L21 10.5V20C21 20.6 20.6 21 20 21H4C3.4 21 3 20.6 3 20V10.5Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <rect x="9" y="13" width="6" height="8" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

// 26. Editor TV: Televisi / Video Broadcast
export const SvgEditorTv: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="7" width="20" height="14" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M17 3L12 7L7 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <polygon points="10,11 15,14 10,17" fill="currentColor" />
  </svg>
);

// 27. Sport Mania / Olahraga Piala
export const SvgSportMania: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 9V4H18V9C18 12.3 15.3 15 12 15C8.7 15 6 12.3 6 9Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M6 6H3C2.4 6 2 6.4 2 7V8C2 10.2 3.8 12 6 12M18 6H21C21.6 6 22 6.4 22 7V8C22 10.2 20.2 12 18 12" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 15V19M8 19H16M7 21H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 28. Pesta Demokrasi: Kotak Suara Pemilu
export const SvgPestaDemokrasi: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="9" width="18" height="12" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 9V6C8 4.9 8.9 4 10 4H14C15.1 4 16 4.9 16 6V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9 13H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 29. Regional / Daerah (Jawa Tengah, Jabar, Jatim, Papua, Sumbar, dll.)
export const SvgDaerah: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M21 10C21 17 12 22 12 22C12 22 3 17 3 10C3 5.03 7.03 1 12 1C16.97 1 21 5.03 21 10Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="3" fill="currentColor" />
  </svg>
);

// 30. Indeks / Menu Umum
export const SvgIndeks: React.FC<IconProps> = ({ className = 'w-6 h-6', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="4" width="18" height="16" rx="2" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.8" />
    <line x1="7" y1="9" x2="17" y2="9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="7" y1="13" x2="17" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="7" y1="17" x2="12" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * Intelligent mapper matching exact slug OR exact name from WordPress JSON API
 * https://editor.id/wp-json/wp/v2/categories
 */
export function getCategorySvgIcon(key: string = '', className?: string, size?: number) {
  const norm = key
    .toLowerCase()
    .replace(/&amp;/g, '&')
    .replace(/[^a-z0-9]/g, '');

  if (norm.includes('headline')) return <SvgHeadline className={className} size={size} />;
  if (norm.includes('nasional')) return <SvgNasional className={className} size={size} />;
  if (norm.includes('hukum') || norm.includes('kriminal')) return <SvgHukum className={className} size={size} />;
  if (norm.includes('politik') || norm.includes('demokrasi')) return <SvgPolitik className={className} size={size} />;
  if (norm.includes('bisnis') || norm.includes('bursa') || norm.includes('keuangan') || norm.includes('pajak')) return <SvgBisnis className={className} size={size} />;
  if (norm.includes('nusantara') || norm.includes('regional') || norm.includes('megapolitan')) return <SvgNusantara className={className} size={size} />;
  if (norm.includes('sepakbola') || norm.includes('pialadunia')) return <SvgSepakBola className={className} size={size} />;
  if (norm.includes('internasional') || norm.includes('dunia')) return <SvgInternasional className={className} size={size} />;
  if (norm.includes('iptek') || norm.includes('teknologi') || norm.includes('techno') || norm.includes('digital')) return <SvgIptek className={className} size={size} />;
  if (norm.includes('pendidikan') || norm.includes('mahasiswa')) return <SvgPendidikan className={className} size={size} />;
  if (norm.includes('kesehatan') || norm.includes('medika')) return <SvgKesehatan className={className} size={size} />;
  if (norm.includes('gayahidup') || norm.includes('lifestyle')) return <SvgGayaHidup className={className} size={size} />;
  if (norm.includes('otomotif')) return <SvgOtomotif className={className} size={size} />;
  if (norm.includes('trending')) return <SvgTrending className={className} size={size} />;
  if (norm.includes('pilihan') || norm.includes('topstories') || norm.includes('lensa')) return <SvgPilihanEditor className={className} size={size} />;
  if (norm.includes('istana') || norm.includes('jokowi') || norm.includes('kepaladaerah')) return <SvgIstana className={className} size={size} />;
  if (norm.includes('energi') || norm.includes('mineral')) return <SvgEnergi className={className} size={size} />;
  if (norm.includes('infotainment') || norm.includes('gosip')) return <SvgInfotainment className={className} size={size} />;
  if (norm.includes('sport') || norm.includes('olahraga')) return <SvgSportMania className={className} size={size} />;
  if (norm.includes('musik') || norm.includes('film')) return <SvgMusikFilm className={className} size={size} />;
  if (norm.includes('cafe') || norm.includes('kuliner') || norm.includes('masak')) return <SvgKuliner className={className} size={size} />;
  if (norm.includes('pangan') || norm.includes('ketahanan')) return <SvgKetahananPangan className={className} size={size} />;
  if (norm.includes('wawancara')) return <SvgWawancara className={className} size={size} />;
  if (norm.includes('properti')) return <SvgProperti className={className} size={size} />;
  if (norm.includes('tv') || norm.includes('editortv')) return <SvgEditorTv className={className} size={size} />;
  if (norm.includes('jawa') || norm.includes('papua') || norm.includes('sumbar') || norm.includes('sumsel') || norm.includes('sumut') || norm.includes('sulut') || norm.includes('kalimantan') || norm.includes('borneo') || norm.includes('tangsel')) {
    return <SvgDaerah className={className} size={size} />;
  }

  return <SvgIndeks className={className} size={size} />;
}
