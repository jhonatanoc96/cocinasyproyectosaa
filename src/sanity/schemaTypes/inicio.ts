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
    {
      ...fotos(
        "heroImagenes",
        "Fotografías de portada",
        "De 3 a 5. En computador se ven las 3 primeras lado a lado; en celular rotan todas."
      ),
      group: "hero",
      validation: (rule) => rule.max(5),
    },

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
