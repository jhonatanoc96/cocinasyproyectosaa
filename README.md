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

## Pendiente antes de publicar

- Número de WhatsApp y datos de contacto en *Configuración del sitio* (sin WhatsApp, los botones
  de cotizar llevan a `/contacto` y la sección de contacto del inicio no se muestra).
- Diferenciales confirmados por la empresa (la sección se oculta mientras esté vacía).
- Al desplegar: `NEXT_PUBLIC_SITE_URL` y agregar el dominio a los orígenes CORS del proyecto en
  sanity.io/manage (con credenciales) para que el Studio funcione en producción.
