import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { CharacterProvider  } from '@/app/context/context';
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Harry Potter Characters",
  description: "Explore the magical characters of Harry Potter",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <header className="w-full p-4 shadow bg-black text-white sticky top-0 z-50 flex items-center px-10">
          <Link
            href="/"
            className="text-xl font-bold font-serif mr-6 transition-transform duration-300 hover:bg-white hover:text-black hover:rounded-full px-3 py-1"
          >
            Explore the World of Harry Potter
          </Link>
          <div className="flex">
            <Link
              href="/characters"
              className="font-serif transition-transform duration-300 hover:bg-white hover:text-black hover:rounded-full px-3 py-1"
            >
              View Characters
            </Link>
          </div>
        </header>

        <CharacterProvider>
          <main className="flex-1">{children}</main>
        </CharacterProvider>

        <footer className="bg-white border-t mt-10 p-4 text-center text-sm text-gray-600 relative">
          <p>© 2025 Characters about Harry Potter | Built with Next.js and HP-API | All rights reserved</p>
          {/* <Button
            variant="outline"
            size="sm"
            className="absolute right-4 bottom-4"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ArrowUp className="w-4 h-4 mr-2" /> Top
          </Button> */}
        </footer>
      </body>
    </html>
  );
}