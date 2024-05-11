import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Providers from "@/lib/query-provider"
import { GlobalNav } from "@/components/GlobalNav"
import "./globals.css"
import { ThemeProvider } from "../lib/theme-provider"
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "버닝 - 후잉 연동 자산 관리 시스템",
  description: "후잉 가계부 데이터를 활용한 자산 관리 시스템",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "")} >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* <Theme appearance="light"> */}
            <div className="flex min-h-screen w-full flex-col">
              <GlobalNav />
              <div className="flex p-2 lg:py-6 lg:px-12 min-h-64">
                {children}
              </div>
              <ToastContainer />
            </div>
            {/* </Theme> */}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
