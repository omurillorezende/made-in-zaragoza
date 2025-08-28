# Made in Brazil — Zaragoza (Landing Page)

**Produção:** https://made-in-zaragoza.vercel.app/

Landing page estática e responsiva do restaurante **Made in Brazil (Zaragoza)**. Foco em promoções da semana, carta, galeria, localização e conversão via WhatsApp.

---

## ✨ Funcionalidades

- **Hero + CTAs**: chamada principal e botões para abrir a **Carta** e seguir no **Instagram**.
- **Carta (toggle)**: a seção “Carta” abre logo abaixo do botão e exibe a imagem do cardápio.
- **Promoções da semana**:
  - Carrossel horizontal (setas de navegação).
  - Ordenação automática por dia (`data-days`, ex.: `2-4` para Ter–Qui; `3` para Qua).
  - Destaque automático para a promoção do **dia atual** (badge muda para “Hoy”).
- **Noche de música/Karaoke**: slider simples alternando banners.
- **Galería**: rolagem horizontal com links para as imagens em tamanho maior.
- **Ubicación & mapa**: bloco com horários (imagem) e mapa interativo do Google.
- **WhatsApp flutuante**: botão fixo no canto inferior direito para contato rápido.
- **Boas práticas**: lazy‐loading em imagens, Open Graph/Twitter Cards, JSON-LD (`Restaurant`).

---

## 🗂 Estrutura

/
├─ index.html
├─ css/
│ └─ styles.css
├─ js/
│ └─ main.js
└─ images/
├─ logo.png
├─ wpp.jpg
├─ cardapio.jpg
├─ horarios.jpg
├─ musica.jpg
├─ karaoke.jpg
└─ ... (demais imagens da galeria e promoções)
