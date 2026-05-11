import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="pt-16" style={{ backgroundColor: "#FAFAFA", minHeight: "100vh" }}>
        {children}
      </div>
      <Footer />
    </>
  );
}
