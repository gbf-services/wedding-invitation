import { Theme, ThemeId } from './types';

export const themes: Record<ThemeId, Theme> = {
  elegant: {
    id: 'elegant',
    name: 'Elegant',
    nameAr: 'أنيق',
    description: 'Cream background, gold details, elegant typography.',
    descriptionAr: 'خلفية كريمية، تفاصيل ذهبية، طباعة أنيقة.',
    thumbnail: '/thumbnails/elegant.jpg',
    defaults: {
      primaryColor: '#C9A96E',
      secondaryColor: '#F5F0E8',
      fontFamily: 'Playfair Display',
      background: '#FDF8F0',
    },
  },
  luxury: {
    id: 'luxury',
    name: 'Luxury',
    nameAr: 'فاخر',
    description: 'Dark background, gold typography, premium animations.',
    descriptionAr: 'خلفية داكنة، طباعة ذهبية، رسوم متحركة فاخرة.',
    thumbnail: '/thumbnails/luxury.jpg',
    defaults: {
      primaryColor: '#D4AF37',
      secondaryColor: '#1A1A2E',
      fontFamily: 'Cormorant Garamond',
      background: '#0F0F23',
    },
  },
  romantic: {
    id: 'romantic',
    name: 'Romantic',
    nameAr: 'رومانسي',
    description: 'Soft colors, floral elements, romantic typography.',
    descriptionAr: 'ألوان ناعمة، عناصر زهرية، طباعة رومانسية.',
    thumbnail: '/thumbnails/romantic.jpg',
    defaults: {
      primaryColor: '#E8A0BF',
      secondaryColor: '#FFF0F5',
      fontFamily: 'Great Vibes',
      background: '#FFFAF0',
    },
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    nameAr: 'بسيط',
    description: 'Clean white design with sophisticated typography.',
    descriptionAr: 'تصميم أبيض نظيف مع طباعة أنيقة.',
    thumbnail: '/thumbnails/minimal.jpg',
    defaults: {
      primaryColor: '#2C2C2C',
      secondaryColor: '#F8F8F8',
      fontFamily: 'Montserrat',
      background: '#FFFFFF',
    },
  },
  'arabic-luxury': {
    id: 'arabic-luxury',
    name: 'Arabic Luxury',
    nameAr: 'فاخر عربي',
    description: 'Elegant Arabic typography with luxury decorative elements.',
    descriptionAr: 'طباعة عربية أنيقة مع عناصر زخرفية فاخرة.',
    thumbnail: '/thumbnails/arabic-luxury.jpg',
    defaults: {
      primaryColor: '#B8860B',
      secondaryColor: '#1C1C1C',
      fontFamily: 'Amiri',
      background: '#0D0D0D',
    },
  },
};

export function getTheme(id: ThemeId): Theme {
  return themes[id] || themes.elegant;
}
