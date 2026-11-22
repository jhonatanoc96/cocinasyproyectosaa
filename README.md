# Cocinas y Proyectos AA — sitio web

Next.js 16 (App Router, Cache Components) + Sanity CMS (Studio embebido en `/studio`) + Tailwind 4.

## Arranque

```bash
cp .env.example .env.local   # ya trae el projectId fm9l6ri0 / dataset production
npm install
npm run dev                  # http://localhost:3000  ·  CMS: http://localhost:3000/studio
```

## Qué se administra desde el CMS (`/studio`)

| Sección del Studio | Qué controla |
| --- | --- |
| Página de inicio | Portada (3–5 fotos), presentación, proyectos destacados, cocinas, mobiliario, diferenciales, galería, llamado a cotizar |
| Proyectos y galerías | Crear/editar proyectos, portada, galería ordenable (arrastrar), videos, destacar en inicio |
| Tipos de trabajo | Cocinas, closets, baños, paneles… Cada uno pertenece a la sección **Cocinas** o **Mobiliario** |
| Páginas | Textos e imagen de Cocinas, Mobiliario, Proyectos, Nosotros, Contacto |
| Configuración del sitio | Nombre, logo, WhatsApp, teléfono, correo, dirección, horario, redes, SEO |

Cada foto tiene **texto alternativo**, **descripción** y **tipo de trabajo**. El tipo de trabajo decide
en qué página aparece (Cocinas o Mobiliario), así un mismo proyecto puede mezclar espacios.
El punto de enfoque (hotspot) de cada foto controla cómo se recorta.

Los cambios publicados aparecen en el sitio en ~1 minuto.

## Contenido inicial

`npm run seed` (requiere `SANITY_WRITE_TOKEN`) sube las fotos y videos de `media/` y crea el contenido
inicial. Es idempotente. La foto `media/fotos/foto-19.jpg` es una nota manuscrita con precios y
**no se publica** a propósito.

## Servidor (Lightsail)

- Ubuntu 24.04 en `16.59.173.224`: Node 24, nginx (80/443) → `next start` en `127.0.0.1:3000`
  como servicio systemd `cocinas`. Variables en `/home/ubuntu/cocinasyproyectosaa/.env.production`
  (sin tokens).
- SSL de Let's Encrypt sobre la IP (perfil `shortlived`, ~6 días), renovado por el timer
  `snap.certbot.renew` y recarga nginx al renovar. Con dominio: `certbot --nginx -d dominio`.
- **Desplegar:** `npm run deploy`. Compila en local (el servidor tiene 1 GB de RAM y `next build` no
  cabe) y sube el resultado. Requiere cambios commiteados y la llave `.pem` en la raíz (ignorada por git).
- Logs: `sudo journalctl -u cocinas -f`.

## Pendiente antes de publicar

- Número de WhatsApp y datos de contacto en *Configuración del sitio* (sin WhatsApp, los botones
  de cotizar llevan a `/contacto` y la sección de contacto del inicio no se muestra).
- Diferenciales confirmados por la empresa (la sección se oculta mientras esté vacía).
- Al desplegar: `NEXT_PUBLIC_SITE_URL` y agregar el dominio a los orígenes CORS del proyecto en
  sanity.io/manage (con credenciales) para que el Studio funcione en producción.
