import { Building, Scale, FileText, Gavel } from "lucide-react";
import { Link } from "wouter";

const rules = [
  {
    title: "New Building Byelaws 2025",
    desc: "Latest guidelines for building construction and planning.",
    icon: Building,
    color: "blue",
    href: "https://bdainfo.org/Webmedia/BuildingBylaws2025.pdf",
  },
  {
    title: "Old Building Byelaws",
    desc: "Previous building regulations and historical acts.",
    icon: FileText,
    color: "teal",
    href: "https://bdainfo.org/Webmedia/Bldg.ByeLawsComp2016.pdf",
  },
  {
    title: "Compounding Byelaws G.O. 86",
    desc: "Rules regarding compounding of unauthorized constructions.",
    icon: Scale,
    color: "green",
    href: "https://bdainfo.org/Webmedia/Compounding%20Bye-laws%20G.O.-09.pdf",
  },
  {
    title: "Compounding Byelaws G.O. 87",
    desc: "Amendments and additions to compounding regulations.",
    icon: Gavel,
    color: "orange",
    href: "https://bdainfo.org/Webmedia/Amendment-BBL2016(31.10.2017).pdf",
  },
];

const colorMap: Record<string, { border: string; icon: string }> = {
  blue:   { border: "border-t-blue-500",   icon: "text-blue-500"   },
  teal:   { border: "border-t-teal-500",   icon: "text-teal-500"   },
  green:  { border: "border-t-green-500",  icon: "text-green-500"  },
  orange: { border: "border-t-orange-500", icon: "text-orange-500" },
};

export default function RulesActs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex text-sm text-gray-500">
          <li><Link href="/" className="hover:text-primary">Home</Link></li>
          <li className="mx-2">/</li>
          <li className="text-gray-900 font-medium">Rules & Acts</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold text-[#1a3a6e] mb-8 border-b-2 border-orange-500 pb-2 inline-block">Rules & Acts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rules.map((rule) => {
          const Icon = rule.icon;
          const { border, icon } = colorMap[rule.color];
          return (
            <a
              key={rule.title}
              href={rule.href}
              target="_blank"
              rel="noreferrer"
              className={`bg-white rounded-lg border border-gray-200 border-t-4 ${border} p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow cursor-pointer`}
            >
              <Icon className={`w-12 h-12 ${icon} mb-4`} />
              <h3 className="font-bold text-lg">{rule.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{rule.desc}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
