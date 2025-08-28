import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import Navbar from "./components/navbar/navbar";
import RegisterModal from "./components/modals/RegisterModal";
import ToasterProvider from "./Providers/ToasterProvider";
import LoginModal from "./components/modals/LoginModal";
import getCurrentUser from "./actions/getCurrentUser";
import RentModal from "./components/modals/RentModal";
import ClientOnly from "./components/ClientOnly";
import SearchModal from "./components/modals/SearchModal";
import TermsModal from "./components/modals/TermsModal";
import PolicyModal from "./components/modals/PolicyModal";
import NavbarWrapper from "./components/NavbarWrapper";
import ForgotPasswordModal from "./components/modals/ForgotPasswordModal";
import ResetPasswordModal from "./components/modals/ResetPasswordModal";
import I18NProvider from "./Providers/I18nProvider";
const font = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Cozy",
  description: "LIBYAN",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en" dir="ltr">
      <body className={font.className}>
        <ClientOnly>
          <I18NProvider>
            <ToasterProvider />
            <SearchModal />
            <LoginModal />
            <TermsModal />
            <PolicyModal />
            <RentModal />
            <RegisterModal />
            <ForgotPasswordModal />
            <ResetPasswordModal />
            <NavbarWrapper currentUser={currentUser}>{children}</NavbarWrapper>
          </I18NProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
