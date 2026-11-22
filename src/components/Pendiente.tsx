import { Children, type ReactNode } from "react";
import { PortableText, type PortableTextComponents } from "next-sanity";
import type { PortableTextBlock } from "next-sanity";

const PATRON = /(\[PENDIENTE[^\]]*\])/gi;
const ES_PENDIENTE = /^\[PENDIENTE/i;

/** Highlights "[PENDIENTE: …]" placeholders so they're easy to spot and replace. */
export function Texto({ children }: { children?: string | null }) {
  if (!children) return null;
  const partes = children.split(PATRON);
  if (partes.length === 1) return <>{children}</>;
  return (
    <>
      {partes.map((p, i) =>
        ES_PENDIENTE.test(p) ? (
          <mark key={i} className="pendiente">
            {p}
          </mark>
        ) : (
          p
        )
      )}
    </>
  );
}

function marcar(children: ReactNode): ReactNode {
  return Children.map(children, (c) =>
    typeof c === "string" ? <Texto>{c}</Texto> : c
  );
}

const COMPONENTES: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{marcar(children)}</p>,
    h2: ({ children }) => <h2>{marcar(children)}</h2>,
    h3: ({ children }) => <h3>{marcar(children)}</h3>,
  },
  listItem: {
    bullet: ({ children }) => <li>{marcar(children)}</li>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = (value as { href?: string })?.href ?? "#";
      const externo = /^https?:/.test(href);
      return (
        <a
          href={href}
          {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
};

/** Portable text with the site's styles and highlighted placeholders. */
export function TextoRico({ value }: { value?: PortableTextBlock[] }) {
  if (!value?.length) return null;
  return <PortableText value={value} components={COMPONENTES} />;
}
