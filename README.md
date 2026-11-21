# QuantumOS

## Cloudflare Pages deployment

QuantumOS is configured as a static Next.js export for Cloudflare Pages. For a custom build/deploy setup, use:

- Build command: `npm run build`
- Deploy command: `npm run deploy`
- Build output directory: `out`

The deploy script runs `wrangler pages deploy out --project-name quantumos`. It publishes the static export from `out` as a Pages deployment; it does not run an OpenNext/Worker deployment. Wrangler is pinned in this repository so the build does not download an unpinned CLI.

Because this setup invokes Wrangler from a custom deploy command, configure `CLOUDFLARE_API_TOKEN` as a secret in the Cloudflare build environment. Give the token **Account → Cloudflare Pages → Edit** access for the account that owns the `quantumos` project. Do not put the token in this repository. The music and wallpaper catalogs are generated as static JSON files during the build.

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
