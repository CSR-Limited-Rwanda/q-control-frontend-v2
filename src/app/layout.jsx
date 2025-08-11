import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";
import { GroupProvider } from "@/context/providers/Group";
import ToastManager from "@/components/toastManager/toastManager";

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
        <AuthProvider>
          <GroupProvider>
            {/* <SwitchTheme /> */}
            <ToastManager />
            {children}
          </GroupProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
