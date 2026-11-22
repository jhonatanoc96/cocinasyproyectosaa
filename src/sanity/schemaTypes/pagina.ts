import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons/Document";

/** Inner page (Cocinas, Mobiliario, Proyectos, Nosotros, Contacto) — one fixed document each. */
export const pagina = defineType({
  name: "pagina",
  title: "Página",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "etiqueta", title: "Antetítulo", type: "string" }),
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Introducción",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "imagen",
      title: "Imagen principal",
      type: "fotografia",
    }),
    defineField({
      name: "texto",
      title: "Texto",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Subtítulo", value: "h3" },
          ],
        }),
      ],
    }),
    defineField({
      name: "imagenes",
      title: "Fotografías adicionales",
      type: "array",
      of: [defineArrayMember({ type: "fotografia" })],
      options: { layout: "grid" },
    }),
  ],
  preview: { select: { title: "titulo", media: "imagen" } },
});
