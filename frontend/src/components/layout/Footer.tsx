import Link from "next/link";
import { BookOpen, ArrowUpRight } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer
      className="border-t-[3px] border-black bg-zinc-950 text-zinc-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg border-2 border-zinc-700 flex items-center justify-center bg-zinc-900 text-zinc-100 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.15)]"
              >
                <BookOpen className="w-4 h-4 text-white stroke-[2.5px]" />
              </div>
              <span className="font-black text-[14px] uppercase tracking-wider text-white">
                {SITE_NAME}
              </span>
            </div>
            <p className="text-[12px] font-bold text-zinc-400 leading-relaxed uppercase tracking-wider">
              Platform modern untuk penerbitan akademik, tinjauan sejawat,
              dan diseminasi akses terbuka.
            </p>
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.15em] mb-4 text-primary">
              Tautan Cepat
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Tentang Kami", href: "/about" },
                { label: "Kirim Naskah", href: "/submit" },
                { label: "Dewan Editorial", href: "/about" },
                { label: "Arsip", href: "/issues" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[12px] font-bold text-zinc-400 uppercase tracking-wider hover:text-white flex items-center gap-1 group transition-colors"
                  >
                    {item.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity stroke-[2.5px]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.15em] mb-4 text-primary">
              Kebijakan
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Kebijakan Privasi", href: "/kebijakan" },
                { label: "Panduan Penulis", href: "/panduan-penulis" },
                { label: "Kebijakan Tinjauan Sejawat", href: "/kebijakan" },
                { label: "Kebijakan Akses Terbuka", href: "/kebijakan" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[12px] font-bold text-zinc-400 uppercase tracking-wider hover:text-white flex items-center gap-1 group transition-colors"
                  >
                    {item.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity stroke-[2.5px]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          className="mt-12 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
            © {new Date().getFullYear()} {SITE_NAME}. Hak cipta dilindungi.
          </p>
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
            Didukung oleh Open Journal Systems
          </p>
        </div>
      </div>
    </footer>
  );
}
