import { Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";

const serif = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
});

const sans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${serif.variable} ${sans.variable} antialiased`}
      // The inline script below adds "fx" before React hydrates.
      suppressHydrationWarning
    >
      <body>
        {/* Enables scroll animations before first paint (no flash of
            visible-then-hidden content). Without JS nothing is hidden. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('fx')",
          }}
        />
        {children}
      </body>
    </html>
  );
}
