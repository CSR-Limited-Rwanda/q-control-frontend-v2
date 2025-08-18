import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";
import { GroupProvider } from "@/context/providers/Group";
import { Toaster } from "react-hot-toast";

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
            {children}
            <Toaster
              position="top-center"
              reverseOrder={false}
              gutter={8}
              containerClassName=""
              containerStyle={{}}
              toastOptions={{
                // Default options for all toasts
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                // Default options for specific types
                success: {
                  duration: 3000,
                  theme: {
                    primary: 'green',
                    secondary: 'black',
                  },
                },
                error: {
                  duration: 5000,
                  theme: {
                    primary: 'red',
                    secondary: 'black',
                  },
                },
              }}
            />
          </GroupProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
