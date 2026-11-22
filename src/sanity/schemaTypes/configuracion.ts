import { defineArrayMember, defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons/Cog";

export const configuracion = defineType({
  name: "configuracion",
  title: "Configuración del sitio",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "marca", title: "Marca", default: true },
    { name: "contacto", title: "Contacto" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "nombre",
      title: "Nombre comercial",
      type: "string",
      group: "marca",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eslogan",
      title: "Eslogan",
      type: "string",
      group: "marca",
    }),
    defineField({
      name: "logo",
      title: "Logo (opcional)",
      type: "image",
      group: "marca",
      description:
        "Si no hay logo se muestra el nombre con la tipografía del sitio.",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp",
      type: "string",
      group: "contacto",
      description: "Con indicativo de país, solo números. Ej: 573001234567",
      validation: (rule) =>
        rule
          .regex(/^\d{8,15}$/, { name: "número" })
          .warning("Solo números, con indicativo."),
    }),
    defineField({
      name: "mensajeWhatsapp",
      title: "Mensaje inicial de WhatsApp",
      type: "string",
      group: "contacto",
    }),
    defineField({
      name: "telefono",
      title: "Teléfono",
      type: "string",
      group: "contacto",
    }),
    defineField({
      name: "email",
      title: "Correo",
      type: "string",
      group: "contacto",
    }),
    defineField({
      name: "direccion",
      title: "Dirección / taller",
      type: "string",
      group: "contacto",
    }),
    defineField({
      name: "ciudad",
      title: "Ciudad / zona de cobertura",
      type: "string",
      group: "contacto",
    }),
    defineField({
      name: "horario",
      title: "Horario de atención",
      type: "string",
      group: "contacto",
    }),
    defineField({
      name: "redes",
      title: "Redes sociales",
      type: "array",
      group: "contacto",
      of: [
        defineArrayMember({
          type: "object",
          name: "red",
          fields: [
            defineField({
              name: "red",
              title: "Red",
              type: "string",
              options: {
                list: [
                  "Instagram",
                  "Facebook",
                  "TikTok",
                  "YouTube",
                  "Pinterest",
                ],
              },
            }),
            defineField({ name: "url", title: "Enlace", type: "url" }),
          ],
          preview: { select: { title: "red", subtitle: "url" } },
        }),
      ],
    }),
    defineField({
      name: "seoDescripcion",
      title: "Descripción para Google",
      type: "text",
      rows: 2,
      group: "seo",
    }),
    defineField({
      name: "imagenCompartir",
      title: "Imagen al compartir el enlace",
      type: "image",
      group: "seo",
    }),
  ],
  preview: { prepare: () => ({ title: "Configuración del sitio" }) },
});
