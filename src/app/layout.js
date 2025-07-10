import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/_main.scss";
import RootProvider from "@/context/RootContext";
import ToastManager from "@/components/toastManager/toastManager";
import SwitchTheme from "@/components/SwitchTheme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Quality Control Tool",
  description: "A Cohesive Management And Consulting Product",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <RootProvider>
          {/* <SwitchTheme /> */}
          <ToastManager />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
