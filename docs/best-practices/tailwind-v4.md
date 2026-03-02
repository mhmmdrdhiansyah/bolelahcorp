# Tailwind CSS v4 - Next.js Latest

## ⚠️ Important: Tailwind v4 is Different!

Next.js terbaru menggunakan **Tailwind CSS v4** yang cara konfigurasinya **sangat berbeda** dari v3.

## Perbedaan Utama

| Fitur | Tailwind v3 | Tailwind v4 |
|-------|-------------|-------------|
| Config file | `tailwind.config.ts` | `@theme` di CSS |
| Custom colors | `colors: { navy: '#...' }` | `--color-navy: #...` di `@theme` |
| Penggunaan | `bg-navy`, `text-coral` | `style={{ color: 'var(--color-navy)' }}` |

## Konfigurasi yang Benar (Tailwind v4)

### app/globals.css

```css
@import "tailwindcss";

/* Define custom colors di @theme */
@theme {
  --color-navy: #1D3557;
  --color-steel: #457B9D;
  --color-coral: #E63946;
  --color-off-white: #F1FAEE;
  --color-mist: #A8DADC;
}

/* Base styles */
@layer base {
  body {
    background-color: var(--color-navy);
    color: var(--color-off-white);
  }
}
```

### Penggunaan di Components

```tsx
// ❌ SALAH - bg-navy tidak akan jalan di Tailwind v4
<div className="bg-navy text-coral">...</div>

// ✅ BENAR - pakai style inline atau CSS variables
<div style={{
  backgroundColor: 'var(--color-navy)',
  color: 'var(--color-coral)'
}}>
  ...
</div>

// ✅ BENAR - pakai hex langsung
<div style={{ backgroundColor: '#1D3557', color: '#E63946' }}>
  ...
</div>
```

## Tailwind Utility Classes yang Masih Bisa Dipakai

Class bawaan Tailwind ini **masih bisa** digunakan tanpa masalah:

```tsx
// Layout - OK ✅
<div className="flex flex-col gap-4 grid grid-cols-3">

// Spacing - OK ✅
<div className="p-4 m-2 px-6 py-3">

// Typography - OK ✅
<h1 className="text-xl font-bold text-center">

// Border - OK ✅
<div className="border-2 rounded-lg">

// Responsive - OK ✅
<div className="md:grid-cols-2 lg:grid-cols-3">

// States - OK ✅
<button className="hover:scale-105 active:scale-95">
```

## Cara Paling Mudah untuk Project Ini

Karena Tailwind v4 masih baru dan berbeda, untuk project ini kita gunakan pendekatan:

1. **Layout/Spacing/Utility** → Pakai Tailwind classes
2. **Custom Colors** → Pakai inline `style={{}}` atau hex values

```tsx
export default function Card() {
  return (
    // Layout pake Tailwind classes
    <div className="flex flex-col gap-4 p-6 rounded-xl shadow-lg"
         // Colors pake inline style
         style={{ backgroundColor: '#457B9D' }}>
      <h3 className="text-xl font-bold" style={{ color: '#F1FAEE' }}>
        Title
      </h3>
      <p style={{ color: '#A8DADC' }}>Description</p>
      <button
        className="px-6 py-3 rounded-lg font-medium"
        style={{ backgroundColor: '#E63946', color: '#F1FAEE' }}>
        Button
      </button>
    </div>
  )
}
```

## Color Palette Reference (PRD)

Simpan ini untuk copy-paste:

```tsx
const colors = {
  navy: '#1D3557',      // Background utama
  steel: '#457B9D',     // Cards, secondary
  coral: '#E63946',     // CTA, highlights
  offWhite: '#F1FAEE',  // Text color
  mist: '#A8DADC',      // Accents, borders
}
```

## Error yang Sering Terjadi

| Error | Penyebab | Solusi |
|-------|----------|--------|
| `Cannot apply unknown utility class 'bg-navy'` | Custom class di @apply belum defined | Jangan pakai custom class di @apply |
| `border-border` not found | Variable belum defined | Hapus atau define dulu |

## Links

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs/v4-beta)
