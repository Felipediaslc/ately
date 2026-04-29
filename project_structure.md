# 📁 ately - Project Structure

*Generated on: 22/04/2026, 23:13:47*

## 📋 Quick Overview

| Metric | Value |
|--------|-------|
| 📄 Total Files | 168 |
| 📁 Total Folders | 70 |
| 🌳 Max Depth | 5 levels |
| 🛠️ Tech Stack | React, Next.js, TypeScript, CSS, Node.js |

## ⭐ Important Files

- 🟡 🚫 **.gitignore** - Git ignore rules
- 🔵 🔍 **eslint.config.mjs** - ESLint config
- 🟡 ▲ **next.config.ts** - Next.js config
- 🔴 📦 **package.json** - Package configuration
- 🔴 📖 **README.md** - Project documentation
- 🟡 🔷 **tsconfig.json** - TypeScript config

## 📊 File Statistics

### By File Type

- 🖼️ **.png** (PNG images): 58 files (34.5%)
- ⚛️ **.tsx** (React TypeScript files): 53 files (31.5%)
- 🔷 **.ts** (TypeScript files): 32 files (19.0%)
- 🎨 **.svg** (SVG images): 12 files (7.1%)
- 📄 **.mjs** (Other files): 2 files (1.2%)
- ⚙️ **.json** (JSON files): 2 files (1.2%)
- 📖 **.md** (Markdown files): 2 files (1.2%)
- 🖼️ **.jpeg** (JPEG images): 2 files (1.2%)
- 🚫 **.gitignore** (Git ignore): 1 files (0.6%)
- 🖼️ **.ico** (Icon files): 1 files (0.6%)
- 🔤 **.ttf** (TrueType fonts): 1 files (0.6%)
- 🎨 **.css** (Stylesheets): 1 files (0.6%)
- 📄 **.lock** (Other files): 1 files (0.6%)

### By Category

- **Assets**: 74 files (44.0%)
- **React**: 53 files (31.5%)
- **TypeScript**: 32 files (19.0%)
- **Other**: 3 files (1.8%)
- **Config**: 2 files (1.2%)
- **Docs**: 2 files (1.2%)
- **DevOps**: 1 files (0.6%)
- **Styles**: 1 files (0.6%)

### 📁 Largest Directories

- **root**: 168 files
- **public**: 73 files
- **public\image**: 67 files
- **app**: 52 files
- **public\image\imagens**: 41 files

## 🌳 Directory Structure

```
ately/
├── 🟡 🚫 **.gitignore**
├── 🚀 app/
│   ├── 📂 about/
│   │   └── ⚛️ page.tsx
│   ├── 📂 admin/
│   │   ├── ⚛️ layout.tsx
│   │   ├── 📂 login/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 orders/
│   │   │   ├── 📂 [id]/
│   │   │   │   └── ⚛️ page.tsx
│   │   │   └── ⚛️ page.tsx
│   │   ├── ⚛️ page.tsx
│   │   └── 📂 products/
│   │   │   ├── 📂 [id]/
│   │   │   │   └── ⚛️ page.tsx
│   │   │   ├── 📂 new/
│   │   │   │   └── ⚛️ page.tsx
│   │   │   └── ⚛️ page.tsx
│   ├── 🔌 api/
│   │   ├── 📂 admin/
│   │   │   ├── 📂 login/
│   │   │   │   └── 🔷 route.ts
│   │   │   ├── 📂 logout/
│   │   │   │   └── 🔷 route.ts
│   │   │   ├── 📂 me/
│   │   │   ├── 📂 orders/
│   │   │   │   ├── 📂 [id]/
│   │   │   │   │   └── 🔷 route.ts
│   │   │   │   └── 🔷 route.ts
│   │   │   └── 📂 products/
│   │   │   │   ├── 📂 [id]/
│   │   │   │   │   └── 🔷 route.ts
│   │   │   │   └── 🔷 route.ts
│   │   ├── 📂 checkout/
│   │   │   └── 🔷 route.ts
│   │   ├── 📂 orders/
│   │   │   ├── 📂 [id]/
│   │   │   │   └── 📂 status/
│   │   │   │   │   └── 🔷 route.ts
│   │   │   └── 🔷 route.ts
│   │   ├── 📂 products/
│   │   │   ├── 📂 [id]/
│   │   │   │   └── 🔷 route.ts
│   │   │   └── 🔷 route.ts
│   │   ├── 📂 setup-admin/
│   │   │   └── 🔷 route.ts
│   │   └── 📂 webhook/
│   │   │   ├── 📂 mercadopago/
│   │   │   │   └── 🔷 route.ts
│   │   │   └── 📂 rest/
│   ├── 📂 cart/
│   │   └── ⚛️ page.tsx
│   ├── 📂 checkout/
│   │   └── ⚛️ page.tsx
│   ├── 📂 context/
│   │   ├── 📂 cart/
│   │   │   └── ⚛️ CartContext.tsx
│   │   └── ⚛️ FavoritesContext.tsx
│   ├── 🖼️ favicon.ico
│   ├── 📂 favorites/
│   │   └── ⚛️ page.tsx
│   ├── ⚛️ layout.tsx
│   ├── 📚 lib/
│   │   ├── 🔷 auth.ts
│   │   ├── 📂 email/
│   │   │   └── 🔷 template.ts
│   │   ├── 🔷 mongodb.ts
│   │   ├── 🔷 products.ts
│   │   └── 🔷 shipping.ts
│   ├── ⚛️ page.tsx
│   ├── 📂 pedido/
│   │   ├── 📂 falha/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 pendente/
│   │   │   └── ⚛️ page.tsx
│   │   └── 📂 sucesso/
│   │   │   └── ⚛️ page.tsx
│   ├── 📂 products/
│   │   ├── 📂 [id]/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 category/
│   │   │   └── 📂 [slug]/
│   │   │   │   └── ⚛️ page.tsx
│   │   └── ⚛️ page.tsx
│   ├── ⚛️ providers.tsx
│   ├── 📂 server/
│   │   └── 📂 db/
│   │   │   ├── 🔷 connect.ts
│   │   │   └── 📂 models/
│   │   │   │   ├── 🔷 Admin.ts
│   │   │   │   ├── 🔷 Order.ts
│   │   │   │   └── 🔷 Product.ts
│   ├── 📂 types/
│   │   ├── 🔷 cart.ts
│   │   ├── 🔷 FavoriteItem.ts
│   │   └── 🔷 product.ts
│   └── 🔧 utils/
│   │   ├── 🔷 formatMoney.ts
│   │   ├── 🔷 getStatusConfig.ts
│   │   └── 🔷 localStorageHelpers.ts
├── 🧩 components/
│   ├── 📂 Destaque/
│   │   └── ⚛️ page.tsx
│   ├── 📂 filters/
│   │   ├── ⚛️ CategoryFilter.tsx
│   │   ├── ⚛️ PriceFilter.tsx
│   │   ├── ⚛️ QuantitySelector.tsx
│   │   └── ⚛️ SortSelect.tsx
│   ├── 📂 foolter/
│   │   └── ⚛️ page.tsx
│   ├── 📂 frete/
│   │   └── ⚛️ index.tsx
│   ├── 📂 MenuBar/
│   │   ├── ⚛️ MenuItem.tsx
│   │   └── ⚛️ page.tsx
│   ├── ⚛️ OrderStatusCard.tsx
│   ├── 📂 product/
│   │   ├── ⚛️ FavoriteButton.tsx
│   │   ├── ⚛️ FavoriteCard.tsx
│   │   ├── ⚛️ HomeProducts.tsx
│   │   ├── ⚛️ MobileFilterDrawer.tsx
│   │   ├── ⚛️ MobileFilterWrapper.tsx
│   │   ├── ⚛️ ProductCard.tsx
│   │   ├── ⚛️ ProductDetails.tsx
│   │   ├── ⚛️ ProductGrid.tsx
│   │   ├── ⚛️ ProductsClient.tsx
│   │   ├── ⚛️ ProductSkeleton.tsx
│   │   └── ⚛️ ProdutosSection.tsx
│   ├── 📂 promoBar/
│   │   └── ⚛️ page.tsx
│   ├── 📂 Promot/
│   │   └── ⚛️ PromoCarousels.tsx
│   ├── 📂 StickyTopBars/
│   │   └── ⚛️ page.tsx
│   ├── 📂 TickerBar/
│   │   └── ⚛️ page.tsx
│   ├── 🎨 ui/
│   │   ├── ⚛️ AdminHeader.tsx
│   │   ├── ⚛️ Breadcrumb.tsx
│   │   └── ⚛️ MobileFilterButton.tsx
│   ├── ⚛️ UpdateStatusButtons.tsx
│   └── 📂 Whatsapp/
│   │   └── ⚛️ index.tsx
├── 🔵 🔍 **eslint.config.mjs**
├── 🔷 global.d.ts
├── 🔷 middleware.ts
├── 🔷 next-env.d.ts
├── 🟡 ▲ **next.config.ts**
├── 🔴 📦 **package.json**
├── 📄 postcss.config.mjs
├── 📖 project_structure.md
├── 🌐 public/
│   ├── 🎨 file.svg
│   ├── 📂 fonts/
│   │   └── 🔤 InstrumentSans-VariableFont_wdth,wght.ttf
│   ├── 🎨 globe.svg
│   ├── 📂 image/
│   │   ├── 🖼️ (17).png
│   │   ├── 🖼️ banner02Mobile.jpeg
│   │   ├── 🖼️ banner02Mobile.png
│   │   ├── 🖼️ banner2Desktop.png
│   │   ├── 🖼️ bannerDesktop.png
│   │   ├── 🖼️ bannerMobile.png
│   │   ├── 📂 chaveiros/
│   │   │   ├── 🖼️ cha-sc-jesus.png
│   │   │   ├── 🖼️ ns-aparecida.png
│   │   │   ├── 🖼️ ns-das-dores.png
│   │   │   ├── 🖼️ ns-das-gracas.png
│   │   │   ├── 🖼️ sagrado-coracao-jesus.png
│   │   │   ├── 🖼️ sagrado-coracao-maria.png
│   │   │   ├── 🖼️ santa-terezinha.png
│   │   │   └── 🖼️ sao-miguel.png
│   │   ├── 🎨 elo-svgrepo-com.svg
│   │   ├── 🎨 hipercard-svgrepo-com.svg
│   │   ├── 🎨 icons8-pix.svg
│   │   ├── 📂 imagens/
│   │   │   ├── 🖼️ crucifixo-jesus-frente.png
│   │   │   ├── 🖼️ crucifixo-jesus-tras.png
│   │   │   ├── 🖼️ espirito-santo-16cm-frente.png
│   │   │   ├── 🖼️ espirito-santo-16cm-tras.png
│   │   │   ├── 🖼️ espirito-santo-17cm-frente.png
│   │   │   ├── 🖼️ espirito-santo-17cm-tras.png
│   │   │   ├── 🖼️ ns-aparecida-branco-12cm-frente.png
│   │   │   ├── 🖼️ ns-aparecida-branco-12cm-lado.png
│   │   │   ├── 🖼️ ns-aparecida-branco-12cm-tras.png
│   │   │   ├── 🖼️ ns-aparecida-dourado-12cm-frente.png
│   │   │   ├── 🖼️ ns-aparecida-dourado-12cm-lado.png
│   │   │   ├── 🖼️ ns-aparecida-dourado-12cm-tras.png
│   │   │   ├── 🖼️ ns-aparecida-dourado-perolada-40cm-frente.png
│   │   │   ├── 🖼️ ns-aparecida-dourado-perolada-40cm-lado.png
│   │   │   ├── 🖼️ ns-aparecida-dourado-perolada-40cm-tras.png
│   │   │   ├── 🖼️ ns-fatima-frente-30cm.png
│   │   │   ├── 🖼️ ns-fatima-lado-30cm.png
│   │   │   ├── 🖼️ ns-fatima-tras-30cm.png
│   │   │   ├── 🖼️ sagrada-familia-20cm-frente.png
│   │   │   ├── 🖼️ sagrada-familia-20cm-lado.png
│   │   │   ├── 🖼️ sagrada-familia-20cm-tras.png
│   │   │   ├── 🖼️ sagrada-familia-colorido-30cm-frente.png
│   │   │   ├── 🖼️ sagrada-familia-colorido-30cm-lado01.png
│   │   │   ├── 🖼️ sagrada-familia-colorido-30cm-lado02.png
│   │   │   ├── 🖼️ sagrada-familia-colorido-30cm-tras.png
│   │   │   ├── 🖼️ sagrada-familia-coroa-30cm-frente.png
│   │   │   ├── 🖼️ sagrada-familia-coroa-30cm-lado01.png
│   │   │   ├── 🖼️ sagrada-familia-coroa-30cm-lado02.png
│   │   │   ├── 🖼️ sagrada-familia-coroa-30cm-tras.png
│   │   │   ├── 🖼️ sagrada-familia-dourado-10cm-frente.png
│   │   │   ├── 🖼️ sagrada-familia-dourado-10cm-lado.png
│   │   │   ├── 🖼️ sagrada-familia-dourado-10cm-tras.png
│   │   │   ├── 🖼️ santa-maria-floral-rosa-frente.png
│   │   │   ├── 🖼️ santa-maria-floral-rosa-lado.png
│   │   │   ├── 🖼️ santa-maria-floral-rosa-tras.png
│   │   │   ├── 🖼️ santa-teresa-floral-azul-frente.png
│   │   │   ├── 🖼️ santa-teresa-floral-azul-lado.png
│   │   │   ├── 🖼️ santa-teresa-floral-azul-tras.png
│   │   │   ├── 🖼️ sao-miguel-cinza-20cm-frente.png
│   │   │   ├── 🖼️ sao-miguel-cinza-20cm-lado.png
│   │   │   └── 🖼️ sao-miguel-cinza-20cm-tras.png
│   │   ├── 🖼️ logo.jpeg
│   │   ├── 🖼️ logo.png
│   │   ├── 📂 mandalas/
│   │   │   ├── 🖼️ mandala-imaculada-conceicao.png
│   │   │   ├── 🖼️ mandala-ns-aparecida.png
│   │   │   └── 🖼️ mandala-sao-miguel.png
│   │   ├── 🎨 mastercard.svg
│   │   ├── 📂 pingentes/
│   │   ├── 🎨 sd_atelie_logo_v4.svg
│   │   ├── 🎨 sd_atelie_logo_v9.svg
│   │   ├── 📂 tercos/
│   │   └── 🎨 visa.svg
│   ├── 🎨 next.svg
│   ├── 🎨 vercel.svg
│   └── 🎨 window.svg
├── 🔴 📖 **README.md**
├── 🎨 styles/
│   └── 🎨 globals.css
├── 🟡 🔷 **tsconfig.json**
└── 📄 yarn.lock
```

## 📖 Legend

### File Types
- 🚫 DevOps: Git ignore
- ⚛️ React: React TypeScript files
- 🔷 TypeScript: TypeScript files
- 🖼️ Assets: Icon files
- 📄 Other: Other files
- ⚙️ Config: JSON files
- 📖 Docs: Markdown files
- 🎨 Assets: SVG images
- 🔤 Assets: TrueType fonts
- 🖼️ Assets: PNG images
- 🖼️ Assets: JPEG images
- 🎨 Styles: Stylesheets

### Importance Levels
- 🔴 Critical: Essential project files
- 🟡 High: Important configuration files
- 🔵 Medium: Helpful but not essential files
