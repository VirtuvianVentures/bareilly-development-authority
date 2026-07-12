import React from "react";
import { Building2, Megaphone, FileCheck, Heart, ShieldCheck, MessageSquareText } from "lucide-react";

const links = [
  {
    title: "Online Property Information System",
    icon: Building2,
    href: "http://bdapms.in/",
    external: true,
  },
  {
    title: "जन सुनवायी (IGRS)",
    icon: Megaphone,
    href: "http://jansunwai.up.nic.in/",
    external: true,
    lang: "hi",
  },
  {
    title: "Online Building Plan Approval",
    icon: FileCheck,
    href: "https://upobpas.in/BPAMSClient/Default.aspx?oc=GDA",
    external: true,
  },
  {
    title: "JANHIT PORTAL",
    icon: Heart,
    href: "https://janhit.upda.in/",
    external: true,
  },
  {
    title: "Apply for NOC",
    icon: ShieldCheck,
    href: "https://noc.bdainfo.org/",
    external: true,
  },
  {
    title: "Query Form",
    icon: MessageSquareText,
    href: "/raise-query",
    external: false,
  },
];

export function QuickLinks() {
  return (
    <div className="bg-gray-100 py-6 border-y border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target={link.external ? "_blank" : "_self"}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md hover:border-orange-500 border border-transparent transition-all group text-center"
              data-testid={`quick-link-${i}`}
            >
              <div className="bg-blue-50 text-[#1a3a6e] p-3 rounded-full mb-3 group-hover:bg-[#1a3a6e] group-hover:text-white transition-colors">
                <link.icon className="h-8 w-8" />
              </div>
              <span className="text-sm font-semibold text-gray-800" lang={link.lang}>{link.title}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
