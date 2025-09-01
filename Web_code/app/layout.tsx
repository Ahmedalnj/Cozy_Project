import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./animations.css";
import "./dubai-font.css";
// import Navbar from "./components/navbar/navbar";
import RegisterModal from "./components/forms/modals/RegisterModal";
import ToasterProvider from "./Providers/ToasterProvider";
import LoginModal from "./components/forms/modals/LoginModal";
import getCurrentUser from "./actions/getCurrentUser";
import RentModal from "./components/listings/modals/RentModal";
import ClientOnly from "./components/ui/ClientOnly";
import SearchModal from "./components/listings/modals/SearchModal";
import TermsModal from "./components/forms/modals/TermsModal";
import PolicyModal from "./components/forms/modals/PolicyModal";
import NavbarWrapper from "./components/navigation/NavbarWrapper";
import ForgotPasswordModal from "./components/forms/modals/ForgotPasswordModal";
import ResetPasswordModal from "./components/forms/modals/ResetPasswordModal";
import I18NProvider from "./Providers/I18nProvider";
import LanguageInitializer from "./components/layout/LanguageInitializer";

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
    <html>
      <body className={font.className}>
        <I18NProvider>
          <ClientOnly>
            <LanguageInitializer />
            <ToasterProvider />
            <SearchModal />
            <LoginModal />
            <RegisterModal />
            <TermsModal />
            <PolicyModal />
            <RentModal />
            <ForgotPasswordModal />
            <ResetPasswordModal />
            <NavbarWrapper currentUser={currentUser}>{children}</NavbarWrapper>
          </ClientOnly>
        </I18NProvider>
      </body>
    </html>
  );
}
