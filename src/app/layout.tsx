import Drawer from "@/components/root/drawer/drawer";
import Header from "@/components/root/header/header";
import "@/styles/global.css";
import { Inter } from "next/font/google";
import Providers from "@/app/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bridge AGH",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Header />
          <Drawer>
            <div className="main h-full grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12" style={{height: "inherit"}}>
              {children}
            </div>
          </Drawer>
        </Providers>
      </body>
    </html>
  );
}
