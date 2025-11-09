import { Inter, Lusitana } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// export a secondary font (Lusitana) with latin subset and weights 400 and 700
export const lusitana = Lusitana({
  subsets: ['latin'],
  weight: ['400', '700'],
  // optional variable for CSS if you use it in globals
  // variable: '--font-lusitana',
});