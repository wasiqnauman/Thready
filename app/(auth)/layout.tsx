import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "../globals.css";
export const metadata = {
  title: "Thready",
  description: "A Threads App clone made in Next.js for learning purposes",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.className} bg-dark-1`}>
        <body>
          <div className="w-full flex min-h-screen justify-center items-center">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
