import { defineField, defineType } from "sanity";
import { PlayIcon } from "@sanity/icons/Play";

/**
 * Reusable video: used in projects and in the Cocinas / Mobiliario pages.
 * Like photos, its work category decides whether it also shows up in the
 * Cocinas or Mobiliario sections.
 */
export const video = defineType({
  name: "video",
  title: "Video",
  type: "object",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "archivo",
      title: "Archivo de video",
      type: "file",
      options: { accept: "video/mp4,video/webm,video/quicktime" },
      description:
        "MP4 recomendado. Mientras más liviano, más rápido carga (ideal: menos de 30 MB).",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "titulo", title: "Título", type: "string" }),
    defineField({
      name: "formato",
      title: "Formato",
      type: "string",
      options: {
        list: [
          { title: "Vertical (celular)", value: "vertical" },
          { title: "Horizontal", value: "horizontal" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "vertical",
    }),
    defineField({
      name: "poster",
      title: "Imagen de vista previa",
      type: "image",
      options: { hotspot: true },
      description:
        "Se muestra antes de reproducir. Sin imagen se ve el primer cuadro del video.",
    }),
    defineField({
      name: "categoria",
      title: "Tipo de trabajo",
      type: "reference",
      to: [{ type: "categoria" }],
      description:
        "Opcional. Si lo indicas, el video también aparece en la página de Cocinas o Mobiliario.",
    }),
  ],
  preview: {
    select: { title: "titulo", media: "poster", subtitle: "categoria.titulo" },
    prepare: ({ title, media, subtitle }) => ({
      title: title || "Video",
      subtitle,
      media: media ?? PlayIcon,
    }),
  },
});
