# QuantumOS

## Cloudflare Pages deployment

QuantumOS is configured as a static Next.js export for Cloudflare Pages. In the Pages project settings, use `npm run build` as the build command and `out` as the build output directory. The music and wallpaper catalog endpoints are generated as static JSON files during the build.

To deploy from a local terminal, authenticate Wrangler with `npx wrangler login`, create a Pages project named `quantumos` in the Cloudflare dashboard (or with Wrangler), then run `npm run pages:deploy`. To preview the static build locally, run `npm run pages:preview`.

This project uses Cloudflare Pages static hosting; do not use `wrangler deploy` or an OpenNext Worker build for this target. Those commands deploy a Worker and caused the missing self-service binding error shown in the deployment log.

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
