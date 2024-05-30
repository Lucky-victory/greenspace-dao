import React from "react";
import { HeaderNav } from "../HeaderNav";
import Footer from "../Footer";

const DaoLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <HeaderNav />
      <div className="w-full min-h-[50vh] bg-[#0C0F1A] py-10">{children}</div>
      <Footer />
    </>
  );
};

export default DaoLayout;
