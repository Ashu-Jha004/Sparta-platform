// app/(profile)/layout.tsx
import { LayoutWrapper } from "@/components/layout-wrapper";
import { Layout } from "lucide-react";
import { ReactNode } from "react";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <LayoutWrapper>{children}</LayoutWrapper>

      {/* Footer */}
      <div className=" p-2 text-center text-gray-500">
        © {new Date().getFullYear()} Sparta — All rights reserved
      </div>
    </div>
  );
}
