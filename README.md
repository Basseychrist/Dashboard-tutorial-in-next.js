# Next.js App Router Course - Starter

This is the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.

---

## Project Structure & Module Explanations

Below is a detailed line-by-line breakdown of what each key file and function does.

### app/layout.tsx
**Root layout that wraps all pages in the App Router.**

```
import '@/app/ui/global.css';
  → Imports global styles once at the app root (required in App Router; global CSS cannot be imported elsewhere).

import { inter } from '@/app/ui/fonts';
  → Imports a pre-configured Inter font instance. Exports a .className property for font application.

export default function RootLayout({ children }: { children: React.ReactNode; })
  → The root layout component; all routes render inside this wrapper.

<html lang="en">
  → Root HTML element with language set to English for accessibility and SEO.

<body className={`${inter.className} antialiased`}>{children}</body>
  → Applies Inter font to the entire body via ${inter.className}.
  → antialiased class smooths font rendering via Tailwind.
  → {children} is a placeholder for all nested pages/routes.
```

**Why**: Global styles and fonts are only loaded once here, not on every page.

---

### app/page.tsx
**Home page with hero images and welcome copy.**

```
import AcmeLogo from '@/app/ui/acme-logo';
  → Small presentational SVG component for the header.

import { lusitana } from '@/app/ui/fonts';
  → Secondary font (Lusitana) with weights 400 and 700.

<main className="flex min-h-screen flex-col p-6">
  → Main container; flex column layout, takes full viewport height, padded on all sides.

<Image
  src="/hero-desktop.png"
  width={1000}
  height={760}
  className="hidden md:block"
  alt="..."
/>
  → Desktop hero image; hidden on mobile (hidden), visible at md breakpoint and up (md:block).

<Image
  src="/hero-mobile.png"
  width={560}
  height={620}
  className="block md:hidden"
  alt="..."
/>
  → Mobile hero image; visible on small screens (block), hidden at md and up (md:hidden).

<p className={lusitana.className}>
  → Paragraph uses Lusitana font only on this element (scoped font).
```

**Why**: Demonstrates responsive images (swap at breakpoint) and per-element font usage.

---

### app/ui/fonts.ts
**Exports optimized Google Fonts.**

```
import { Inter, Lusitana } from 'next/font/google';
  → Imports font loaders from Next.js; fonts are optimized and bundled at build time.

export const inter = Inter({
  subsets: ['latin'],
});
  → Inter font instance with Latin characters only (reduces file size).
  → Exports .className (e.g., "inter__a1b2c3") to apply the font.

export const lusitana = Lusitana({
  subsets: ['latin'],
  weight: ['400', '700'],
});
  → Lusitana font instance with normal (400) and bold (700) weights.
  → Only specified weights are loaded (reduces file size).
```

**Why**: `next/font/google` prevents FOUT (flash of unstyled text) and optimizes font loading.

---

### app/ui/global.css
**Global stylesheet imported at root layout.**

Contains:
- Tailwind CSS directives (@tailwind base, components, utilities).
- Any app-wide resets or custom utility classes.

**Why**: Included once, available everywhere; no duplicate CSS on each page.

---

### app/ui/button.tsx
**Reusable Button component with default styles and composition.**

```
import clsx from 'clsx';
  → Utility to merge class strings and conditionals; prevents repeated className logic.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
  → ButtonProps re-uses all native HTML button attributes (onClick, disabled, etc.).
  → children is required prop for button text/content.

export function Button({ children, className, ...rest }: ButtonProps)
  → Destructures children, className, and spreads all other props.
  → ...rest captures onClick, disabled, type, etc., to forward to <button>.

className={clsx(
  'flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white ...',
  className,
)}
  → clsx merges base Tailwind classes with any extra className passed by caller.
  → Allows override of default styles if needed.

<button {...rest} ... >
  → Spreads remaining native HTML attributes onto the button element.
```

**Why**: Single source of truth for button styling; any component using Button gets consistent look & behavior.

---

### app/ui/dashboard/nav-links.tsx
**Client-side navigation sidebar with active-link highlighting.**

```
'use client';
  → Marks this as a client component (uses browser hooks like usePathname).

import { usePathname } from 'next/navigation';
  → Hook to get current route path on the client.

import clsx from 'clsx';
  → Used to conditionally add active-link styles.

const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Invoices', href: '/dashboard/invoices', icon: DocumentDuplicateIcon },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
];
  → Array of navigation items; each has a name, href, and icon component.
  → Would normally come from a database in a real app.

export default function NavLinks() {
  const pathname = usePathname();
    → Calls React hook to get current pathname (e.g., '/dashboard/invoices').

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
          → Assign icon component to variable so it can be used as JSX.

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] ... hover:bg-sky-100 hover:text-blue-600 ...',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            → clsx: apply 'bg-sky-100 text-blue-600' only when pathname matches link.href.
            → This highlights the active link without server-side rendering.

            <LinkIcon className="w-6" />
              → Render icon SVG component; set width to 6 units (Tailwind).

            <p className="hidden md:block">{link.name}</p>
              → Show link label on desktop (hidden on mobile, block on md+).
```

**Why**: Client-side active highlighting avoids server round-trips on every navigation. Responsive design hides labels on mobile.

---

### app/ui/table.tsx
**Renders tabular data (invoices, customers, etc.).**

Uses `clsx` to conditionally style rows:
```
className={clsx('border-b', isSelected && 'bg-gray-100')}
  → Add 'bg-gray-100' only if isSelected is true; always include border-b.
```

**Why**: `clsx` keeps conditional logic readable; avoids ternary chains in JSX.

---

### app/ui/status.tsx
**Small badge component to show status (pending, active, etc.).**

Uses `clsx` to toggle color classes:
```
className={clsx(
  'inline-flex items-center',
  status === 'pending' ? 'text-yellow-500' : 'text-green-600'
)}
  → Apply yellow text if pending, green if active.
```

**Why**: Encapsulates status UI in one component; easy to reuse and maintain.

---

## tsconfig.json
**TypeScript configuration with path aliases.**

```
"baseUrl": ".",
"paths": {
  "@/*": ["./*"]
}
  → Enables imports like @/app/ui/button instead of ../../../app/ui/button.
  → @/ resolves to the project root.
```

**Why**: Cleaner imports; easier refactoring if you move files around.

---

## Common Errors & Debugging

| Error | Cause | Solution |
|-------|-------|----------|
| "Cannot find module '@/app/ui/global.css'" | Path alias misconfigured or tsconfig not reloaded. | Check tsconfig.json path aliases; restart TypeScript server in editor. |
| "links is not defined" | Variable declared in wrong scope or missing import. | Ensure `const links = [...]` is declared before it's used in the component. |
| "usePathname is not a hook" | File missing `'use client'` directive. | Add `'use client';` at the top of files that use browser hooks. |
| Global CSS not applied | Global CSS imported outside root layout. | Import global CSS only in app/layout.tsx. |

---

## How to Run

1. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Start dev server**
   ```bash
   npm run dev
   ```

3. **Open browser**
   ```
   http://localhost:3000
   ```

4. **Test responsive images**
   - Open DevTools (F12) → Device Toolbar
   - Verify desktop image shows on large screens, mobile image on small screens

---

## Key Takeaways

- **Root Layout**: Global CSS and fonts belong here; all pages render inside `{children}`.
- **Fonts**: Use `next/font/google` for optimization; each font export has `.className` property.
- **clsx**: Merge conditional classes cleanly; avoid ternary chains in JSX.
- **'use client'**: Required for files that use React hooks (usePathname, useState, etc.).
- **Responsive Images**: Use Tailwind breakpoint classes (hidden/md:block, block/md:hidden) to swap images.
- **Path Aliases**: @/ shorthand makes imports cleaner and projects easier to refactor.
# Dashboard-tutorial-in-next.js
