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
| Página de inicio | Carrusel de portada (fotos o videos, segundos por diapositiva, autoplay), presentación, destacados, cocinas, mobiliario, diferenciales, galería, llamado a cotizar |
| Proyectos y galerías | Visibles / Ocultos / Archivados / Todos. Cada proyecto: estado, título, textos, portada, galería ordenable, videos, destacar en inicio |
| Tipos de trabajo | Cocinas, closets, baños, paneles… Cada uno pertenece a la sección **Cocinas** o **Mobiliario** |
| Cotizador | Textos y campos del formulario `/cotizar` y los mensajes de WhatsApp por tipo (general, cocina, mobiliario, desde un proyecto con `{proyecto}`) |
| Páginas | Cocinas y Mobiliario (+ videos propios), Proyectos, Nosotros (historia, cifras, frase, proceso, compromisos), Contacto, Términos, Privacidad |
| Configuración del sitio | Nombre, descripción, NIT, WhatsApp, teléfono, correo, dirección + mapa, horario, redes (solo se muestran las configuradas), SEO |

- Cada foto y video tiene **tipo de trabajo**: decide si aparece también en Cocinas o Mobiliario.
- Un proyecto **oculto** o **archivado** desaparece de todo el sitio (listas, inicio, Cocinas/Mobiliario, su URL da 404). Se vuelve a mostrar cambiando el estado a *Visible*.
- Todos los botones de cotizar llevan a `/cotizar?tipo=cocina|mobiliario` o `?proyecto=…`; el formulario arma el mensaje y abre WhatsApp. Nada se guarda en el sitio.
- Los textos con `[PENDIENTE…]` se resaltan en el sitio hasta que se reemplacen.
- **Publicar en el Studio se ve al instante**: un webhook de Sanity llama a `/api/revalidate` (firmado con `SANITY_REVALIDATE_SECRET`), que expira la caché.

## Contenido inicial

`npm run seed` (requiere `SANITY_WRITE_TOKEN`) sube las fotos y videos de `media/` y crea el contenido
inicial. **Reemplaza** proyectos, tipos de trabajo, inicio y páginas (no usarlo después de que el cliente
edite); configuración, cotizador y páginas legales solo se crean si no existen. La foto `media/fotos/foto-19.jpg` es una nota manuscrita con precios y
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
- Webhook: en sanity.io/manage → API → Webhooks, "Revalidar sitio" → `https://<dominio>/api/revalidate`.
  Al cambiar de dominio, actualizar su URL, `NEXT_PUBLIC_SITE_URL` y los CORS.

## Pendiente antes de publicar

- Número de WhatsApp y datos de contacto en *Configuración del sitio* (sin WhatsApp, los botones
  de cotizar llevan a `/contacto` y la sección de contacto del inicio no se muestra).
- Diferenciales confirmados por la empresa (la sección se oculta mientras esté vacía).
- Al desplegar: `NEXT_PUBLIC_SITE_URL` y agregar el dominio a los orígenes CORS del proyecto en
  sanity.io/manage (con credenciales) para que el Studio funcione en producción.
