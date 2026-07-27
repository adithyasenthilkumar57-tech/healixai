import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: {
    default: "HealixAI – AI-Powered Healthcare for Everyone",
    template: "%s | HealixAI",
  },
  description:
    "HealixAI helps patients understand their health, detect risks early, and access trusted healthcare through intelligent AI. Features include CuraAI chatbot, symptom checker, medical report analyzer, hospital finder, and more.",
  keywords: [
    "AI healthcare",
    "health chatbot",
    "symptom checker",
    "medical AI",
    "CuraAI",
    "health platform",
    "Tamil healthcare",
    "telemedicine",
  ],
  authors: [{ name: "HealixAI Team" }],
  creator: "HealixAI",
  publisher: "HealixAI",
  metadataBase: new URL("https://healixai.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://healixai.com",
    siteName: "HealixAI",
    title: "HealixAI – AI-Powered Healthcare for Everyone",
    description:
      "Intelligent healthcare assistance powered by AI. Symptom checker, medical chatbot, report analyzer, and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HealixAI – AI Healthcare Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HealixAI – AI-Powered Healthcare for Everyone",
    description:
      "Intelligent healthcare assistance powered by AI.",
    creator: "@healixai",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
