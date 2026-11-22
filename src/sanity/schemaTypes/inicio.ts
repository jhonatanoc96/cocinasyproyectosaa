import { defineArrayMember, defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons/Home";

const fotos = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: "array",
    of: [defineArrayMember({ type: "fotografia" })],
    options: { layout: "grid" },
  });

export const inicio = defineType({
  name: "inicio",
  title: "Página de inicio",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Portada", default: true },
    { name: "presentacion", title: "Presentación" },
    { name: "proyectos", title: "Proyectos destacados" },
    { name: "cocinas", title: "Cocinas" },
    { name: "mobiliario", title: "Mobiliario" },
    { name: "diferenciales", title: "Diferenciales" },
    { name: "galeria", title: "Galería" },
    { name: "cta", title: "Llamado a cotizar" },
  ],
  fields: [
    // Hero
    defineField({
      name: "heroEtiqueta",
      title: "Antetítulo",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroTitulo",
      title: "Título",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroTexto",
      title: "Texto",
      type: "text",
      rows: 2,
      group: "hero",
    }),
    defineField({
      name: "heroSlides",
      title: "Carrusel de portada",
      type: "array",
      group: "hero",
      description:
        "Fotos o videos que rotan en la portada. Arrastra para cambiar el orden; la primera es la que carga primero.",
      validation: (rule) => rule.min(1).max(10),
      of: [
        defineArrayMember({
          type: "object",
          name: "slide",
          title: "Diapositiva",
          fields: [
            defineField({
              name: "tipo",
              title: "Tipo",
              type: "string",
              options: {
                list: [
                  { title: "Foto", value: "imagen" },
                  { title: "Video", value: "video" },
                ],
                layout: "radio",
                direction: "horizontal",
              },
              initialValue: "imagen",
            }),
            defineField({
              name: "imagen",
              title: "Foto",
              type: "fotografia",
              hidden: ({ parent }) => parent?.tipo === "video",
              validation: (rule) =>
                rule.custom((value, ctx) =>
                  (ctx.parent as { tipo?: string })?.tipo !== "video" && !value
                    ? "Sube una foto"
                    : true
                ),
            }),
            defineField({
              name: "video",
              title: "Video (mp4)",
              type: "file",
              options: { accept: "video/mp4,video/webm" },
              description:
                "Se reproduce sin sonido y en bucle. Usa videos cortos y livianos (ideal: menos de 15 MB).",
              hidden: ({ parent }) => parent?.tipo !== "video",
              validation: (rule) =>
                rule.custom((value, ctx) =>
                  (ctx.parent as { tipo?: string })?.tipo === "video" && !value
                    ? "Sube un video"
                    : true
                ),
            }),
            defineField({
              name: "poster",
              title: "Imagen mientras carga el video",
              type: "image",
              options: { hotspot: true },
              description: "Recomendada: se ve mientras el video carga.",
              hidden: ({ parent }) => parent?.tipo !== "video",
            }),
          ],
          preview: {
            select: {
              tipo: "tipo",
              imagen: "imagen",
              alt: "imagen.alt",
              poster: "poster",
            },
            prepare: ({ tipo, imagen, alt, poster }) => ({
              title: tipo === "video" ? "Video" : alt || "Foto",
              subtitle: tipo === "video" ? "Video" : "Foto",
              media: tipo === "video" ? poster : imagen,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "heroIntervalo",
      title: "Segundos por diapositiva",
      type: "number",
      group: "hero",
      description:
        "Cada cuánto cambia. Los videos se muestran completos (hasta 30 s).",
      initialValue: 6,
      validation: (rule) => rule.min(3).max(20),
    }),
    defineField({
      name: "heroAutoplay",
      title: "Cambiar automáticamente",
      type: "boolean",
      group: "hero",
      initialValue: true,
    }),

    // Presentación
    defineField({
      name: "presEtiqueta",
      title: "Antetítulo",
      type: "string",
      group: "presentacion",
    }),
    defineField({
      name: "presTitulo",
      title: "Título",
      type: "string",
      group: "presentacion",
    }),
    defineField({
      name: "presTexto",
      title: "Texto",
      type: "text",
      rows: 5,
      group: "presentacion",
    }),
    defineField({
      name: "presImagen",
      title: "Fotografía",
      type: "fotografia",
      group: "presentacion",
    }),
    defineField({
      name: "presImagen2",
      title: "Fotografía secundaria",
      type: "fotografia",
      group: "presentacion",
    }),

    // Proyectos destacados
    defineField({
      name: "proyTitulo",
      title: "Título",
      type: "string",
      group: "proyectos",
    }),
    defineField({
      name: "proyTexto",
      title: "Texto",
      type: "text",
      rows: 2,
      group: "proyectos",
    }),
    defineField({
      name: "proyectos",
      title: "Proyectos a mostrar",
      type: "array",
      group: "proyectos",
      description:
        'Si lo dejas vacío se muestran los proyectos marcados como "Destacar en el inicio".',
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "proyecto" }] }),
      ],
    }),

    // Cocinas
    defineField({
      name: "cocTitulo",
      title: "Título",
      type: "string",
      group: "cocinas",
    }),
    defineField({
      name: "cocTexto",
      title: "Texto",
      type: "text",
      rows: 3,
      group: "cocinas",
    }),
    { ...fotos("cocImagenes", "Fotografías (3 o 4)"), group: "cocinas" },

    // Mobiliario
    defineField({
      name: "mobTitulo",
      title: "Título",
      type: "string",
      group: "mobiliario",
    }),
    defineField({
      name: "mobTexto",
      title: "Texto",
      type: "text",
      rows: 3,
      group: "mobiliario",
      description:
        'Las líneas de mobiliario salen de los "Tipos de trabajo" de la sección Mobiliario.',
    }),

    // Diferenciales
    defineField({
      name: "difTitulo",
      title: "Título",
      type: "string",
      group: "diferenciales",
    }),
    defineField({
      name: "diferenciales",
      title: "Diferenciales",
      type: "array",
      group: "diferenciales",
      description:
        "Solo agrega diferenciales confirmados por la empresa. Si está vacío, la sección no se muestra.",
      of: [
        defineArrayMember({
          type: "object",
          name: "diferencial",
          fields: [
            defineField({ name: "titulo", title: "Título", type: "string" }),
            defineField({
              name: "texto",
              title: "Texto",
              type: "text",
              rows: 2,
            }),
          ],
        }),
      ],
    }),

    // Galería
    defineField({
      name: "galTitulo",
      title: "Título",
      type: "string",
      group: "galeria",
    }),
    {
      ...fotos("galImagenes", "Fotografías", "Arrastra para cambiar el orden."),
      group: "galeria",
    },

    // CTA
    defineField({
      name: "ctaTitulo",
      title: "Título",
      type: "string",
      group: "cta",
    }),
    defineField({
      name: "ctaTexto",
      title: "Texto",
      type: "text",
      rows: 2,
      group: "cta",
    }),
    defineField({
      name: "ctaBoton",
      title: "Texto del botón",
      type: "string",
      group: "cta",
    }),
    defineField({
      name: "ctaImagen",
      title: "Fotografía de fondo",
      type: "fotografia",
      group: "cta",
    }),
  ],
  preview: { prepare: () => ({ title: "Página de inicio" }) },
});
