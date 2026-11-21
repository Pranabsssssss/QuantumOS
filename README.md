# QuantumOS

## Cloudflare Pages deployment

QuantumOS is configured as a static Next.js export for automatic deployment through Cloudflare Pages Git integration. Connect this GitHub repository to a Pages project and set:

- Framework preset: **Next.js (Static HTML Export)**
- Build command: `npm run build`
- Build output directory: `out`

Pages builds and publishes the site automatically when you push to the connected GitHub branch. Leave any custom deploy command empty; Pages handles deployment itself. No Wrangler CLI or Cloudflare API token is required in this project. The music and wallpaper catalogs are generated as static JSON files during the build.

> A web-based operating system experience with a highly polished glassmorphism interface, built for Takumi Delhi 2026.

## 🥇 1st Place — Takumi Delhi 2026

**QuantumOS** is a web-based operating system concept that I built for **Takumi Delhi 2026**, a game development and technology hackathon in Delhi.

The project secured **1st Place / Gold Medal** at the event.

The project was also presented and awarded by **Veditha Reddy, IAS, Director of Education, Delhi**.

---

# 🏆 Achievement

## 🥇 1st Place — Gold Medalist

QuantumOS won **1st position** at **Takumi Delhi 2026**.

The project was developed as a web-based operating system experience, focusing heavily on creating a polished, modern, and interactive desktop environment directly inside the browser.

The project was also recognized and awarded by:

**Veditha Reddy, IAS**  
Director of Education, Delhi

---

# What Is QuantumOS?

QuantumOS is a **web-based operating system** designed to recreate the experience of using a modern desktop operating system directly inside a web browser.

Instead of being an actual low-level operating system kernel, QuantumOS provides a browser-based desktop environment with interactive applications, windows, navigation, system interfaces, and a complete visual operating-system experience.

```text
                    QuantumOS
                        │
                        ▼
                 Browser Desktop
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
       Windows        Apps        System UI
          │             │             │
          └─────────────┼─────────────┘
                        │
                        ▼
                Interactive Web OS
