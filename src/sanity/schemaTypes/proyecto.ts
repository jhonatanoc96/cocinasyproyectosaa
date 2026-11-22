import { defineArrayMember, defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons/Home";

export const proyecto = defineType({
  name: "proyecto",
  title: "Proyecto",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "contenido", title: "Contenido", default: true },
    { name: "galeria", title: "Galería" },
    { name: "datos", title: "Datos (opcionales)" },
  ],
  fields: [
    defineField({
      name: "estado",
      title: "Estado",
      type: "string",
      group: "contenido",
      options: {
        list: [
          { title: "Visible en el sitio", value: "visible" },
          { title: "Oculto (no aparece en el sitio)", value: "oculto" },
          { title: "Archivado", value: "archivado" },
        ],
        layout: "radio",
      },
      description:
        "Oculto y archivado no aparecen en el sitio. Archivado además lo saca de la lista principal del CMS. Puedes volver a mostrarlo cuando quieras.",
      initialValue: "visible",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      group: "contenido",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      group: "contenido",
      options: { source: "titulo", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "resumen",
      title: "Resumen",
      type: "text",
      rows: 2,
      group: "contenido",
      description: "Una o dos líneas. Se muestra en las tarjetas de proyecto.",
    }),
    defineField({
      name: "descripcion",
      title: "Descripción",
      type: "array",
      group: "contenido",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
        }),
      ],
    }),
    defineField({
      name: "portada",
      title: "Foto de portada",
      type: "fotografia",
      group: "contenido",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "destacado",
      title: "Destacar en el inicio",
      type: "boolean",
      group: "contenido",
      initialValue: false,
    }),
    defineField({
      name: "orden",
      title: "Orden",
      type: "number",
      group: "contenido",
      description: "Número menor aparece primero.",
      initialValue: 10,
    }),
    defineField({
      name: "galeria",
      title: "Galería de fotos",
      type: "array",
      group: "galeria",
      description:
        "Arrastra para cambiar el orden. Puedes subir varias fotos a la vez.",
      of: [defineArrayMember({ type: "fotografia" })],
      options: { layout: "grid" },
    }),
    defineField({
      name: "videos",
      title: "Videos",
      type: "array",
      group: "galeria",
      of: [defineArrayMember({ type: "video" })],
    }),
    defineField({
      name: "categorias",
      title: "Tipos de trabajo",
      type: "array",
      group: "datos",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "categoria" }] }),
      ],
    }),
    defineField({
      name: "ubicacion",
      title: "Ubicación",
      type: "string",
      group: "datos",
      description: "Solo si el cliente autoriza mostrarla.",
    }),
    defineField({ name: "anio", title: "Año", type: "number", group: "datos" }),
  ],
  orderings: [
    {
      title: "Orden",
      name: "orden",
      by: [{ field: "orden", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "titulo",
      media: "portada",
      destacado: "destacado",
      fotos: "galeria",
      estado: "estado",
    },
    prepare: ({ title, media, destacado, fotos, estado }) => ({
      title,
      media,
      subtitle: [
        estado === "oculto" ? "Oculto" : estado === "archivado" ? "Archivado" : null,
        `${Array.isArray(fotos) ? fotos.length : 0} fotos`,
        destacado ? "★ Destacado" : null,
      ]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
