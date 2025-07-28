import type { Metadata } from "next";
import { Nunito } from "next/font/google";
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
const font = Nunito({
  subsets: ["latin"],
});

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
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <SearchModal />
          <LoginModal />
          <TermsModal />
          <PolicyModal />
          <RentModal />
          <RegisterModal />
          <NavbarWrapper currentUser={currentUser}>{children}</NavbarWrapper>
        </ClientOnly>
      </body>
    </html>
  );
}
