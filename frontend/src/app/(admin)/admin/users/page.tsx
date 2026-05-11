import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockAuthors } from "@/lib/mock-data";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { cn } from "@/lib/utils";

export const metadata = { title: "Manajemen Pengguna" };

const roleLabel: Record<string, { label: string; className: string }> = {
  Author: { label: "Penulis", className: "bg-blue-100 text-blue-800" },
  Reviewer: { label: "Peninjau", className: "bg-purple-100 text-purple-800" },
  Editor: { label: "Editor", className: "bg-amber-100 text-amber-850" },
  Admin: { label: "Admin", className: "bg-rose-100 text-rose-850" },
};

export default function UsersPage() {
  return (
    <div className="flex flex-col h-full w-full bg-background">
      <DashboardNavbar
        title="Manajemen Pengguna"
        subtitle="Kelola pengguna terdaftar, peran, dan hak akses."
        icon={Users}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-6xl w-full mx-auto">
          <div
            className="bg-card rounded-2xl overflow-hidden transition-all duration-300 neo-border neo-shadow"
          >
            <div className="px-6 py-4 border-b-[3px] border-sidebar-border bg-purple-50/50 dark:bg-purple-950/20">
              <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                {mockAuthors.length} pengguna terdaftar
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-purple-50/30 dark:bg-purple-950/10 hover:bg-purple-50/30 border-b-2 border-sidebar-border">
                  {["Nama", "Email", "Institusi", "Peran", "Artikel", "Bergabung"].map((h) => (
                    <TableHead
                      key={h}
                      className="font-black text-[10px] uppercase tracking-wider text-muted-foreground py-4"
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y-2 divide-sidebar-border">
                {mockAuthors.map((user) => {
                  const roleConfig = roleLabel[user.role] ?? {
                    label: user.role,
                    className: "bg-gray-100 text-gray-800",
                  };
                  return (
                    <TableRow key={user.id} className="hover:bg-purple-50/30 dark:hover:bg-purple-950/5 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center bg-purple-100 text-purple-700 text-xs font-black shadow-[2px_2px_0px_0px_#000000] shrink-0"
                          >
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <h3 className="text-[13px] font-black text-foreground">
                            {user.name}
                          </h3>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                          {user.email}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-[12px] font-semibold text-foreground/80">
                          {user.institution}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] font-extrabold px-2.5 py-0.5 border-2 border-black rounded-lg uppercase tracking-wider",
                            roleConfig.className
                          )}
                        >
                          {roleConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-[12px] font-black text-foreground">
                          {user.articleCount}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                          {new Date(user.joinedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
