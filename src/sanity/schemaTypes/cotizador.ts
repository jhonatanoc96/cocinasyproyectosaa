import { defineArrayMember, defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons/Envelope";

/**
 * Quote form (/cotizar): texts, form fields and the predefined WhatsApp
 * messages. The WhatsApp number lives in "Configuración del sitio".
 */
export const cotizador = defineType({
  name: "cotizador",
  title: "Cotizador",
  type: "document",
  icon: EnvelopeIcon,
  groups: [
    { name: "textos", title: "Textos", default: true },
    { name: "mensajes", title: "Mensajes de WhatsApp" },
    { name: "campos", title: "Campos del formulario" },
  ],
  fields: [
    defineField({
      name: "etiqueta",
      title: "Antetítulo",
      type: "string",
      group: "textos",
    }),
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      group: "textos",
    }),
    defineField({
      name: "intro",
      title: "Introducción",
      type: "text",
      rows: 3,
      group: "textos",
    }),
    defineField({
      name: "imagen",
      title: "Fotografía",
      type: "fotografia",
      group: "textos",
    }),
    defineField({
      name: "etiquetaTipo",
      title: "Pregunta del tipo de proyecto",
      type: "string",
      group: "textos",
      initialValue: "¿Qué quiere cotizar?",
    }),
    defineField({
      name: "opcionCocina",
      title: "Opción: cocina",
      type: "string",
      group: "textos",
      initialValue: "Cocina",
    }),
    defineField({
      name: "opcionMobiliario",
      title: "Opción: mobiliario",
      type: "string",
      group: "textos",
      initialValue: "Mobiliario",
    }),
    defineField({
      name: "opcionGeneral",
      title: "Opción: otro proyecto",
      type: "string",
      group: "textos",
      initialValue: "Otro proyecto",
    }),
    defineField({
      name: "textoBoton",
      title: "Texto del botón",
      type: "string",
      group: "textos",
      initialValue: "Continuar en WhatsApp",
    }),
    defineField({
      name: "nota",
      title: "Nota bajo el botón",
      type: "text",
      rows: 2,
      group: "textos",
    }),

    defineField({
      name: "mensajeGeneral",
      title: "Mensaje: otro proyecto",
      type: "text",
      rows: 2,
      group: "mensajes",
      description:
        'Se usa en "Cotizar proyecto" del menú, el inicio, Nosotros y Proyectos.',
    }),
    defineField({
      name: "mensajeCocina",
      title: "Mensaje: cocina",
      type: "text",
      rows: 2,
      group: "mensajes",
      description: "Se usa al cotizar desde la página de Cocinas.",
    }),
    defineField({
      name: "mensajeMobiliario",
      title: "Mensaje: mobiliario",
      type: "text",
      rows: 2,
      group: "mensajes",
      description: "Se usa al cotizar desde la página de Mobiliario.",
    }),
    defineField({
      name: "mensajeProyecto",
      title: "Mensaje: desde un proyecto",
      type: "text",
      rows: 2,
      group: "mensajes",
      description:
        "Se usa al cotizar desde un proyecto. Escribe {proyecto} donde quieras el nombre del proyecto.",
    }),
    defineField({
      name: "encabezadoDatos",
      title: "Encabezado de los datos del cliente",
      type: "string",
      group: "mensajes",
      description:
        "Si el cliente llena algún campo, sus datos se agregan al mensaje debajo de este encabezado.",
      initialValue: "Mis datos:",
    }),

    defineField({
      name: "campos",
      title: "Campos",
      type: "array",
      group: "campos",
      description:
        "Todos son opcionales para el cliente. Arrastra para cambiar el orden.",
      of: [
        defineArrayMember({
          type: "object",
          name: "campo",
          fields: [
            defineField({
              name: "etiqueta",
              title: "Etiqueta",
              type: "string",
              description: "También es el nombre del dato en el mensaje.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "tipo",
              title: "Tipo",
              type: "string",
              options: {
                list: [
                  { title: "Texto corto", value: "texto" },
                  { title: "Teléfono", value: "telefono" },
                  { title: "Correo", value: "correo" },
                  { title: "Texto largo", value: "parrafo" },
                ],
              },
              initialValue: "texto",
            }),
            defineField({
              name: "placeholder",
              title: "Texto de ayuda",
              type: "string",
            }),
            defineField({
              name: "ancho",
              title: "Ancho",
              type: "string",
              options: {
                list: [
                  { title: "Mitad", value: "medio" },
                  { title: "Completo", value: "completo" },
                ],
                layout: "radio",
                direction: "horizontal",
              },
              initialValue: "medio",
            }),
          ],
          preview: { select: { title: "etiqueta", subtitle: "tipo" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Cotizador" }) },
});
