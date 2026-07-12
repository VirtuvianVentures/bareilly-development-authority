import { Link } from "wouter";

const cards = [
  {
    title: "New Building Byelaws 2025",
    image: "https://bdainfo.org/Webmedia/rules1.jpg",
    href: "https://bdainfo.org/Webmedia/BuildingBylaws2025.pdf",
  },
  {
    title: "Old Building Byelaws",
    image: "https://bdainfo.org/Webmedia/rules2.jpg",
    href: "https://bdainfo.org/Webmedia/Bldg.ByeLawsComp2016.pdf",
  },
  {
    title: "Compounding Byelaws G.O. 86",
    image: "https://bdainfo.org/Webmedia/rules3.jpg",
    href: "https://bdainfo.org/Webmedia/Compounding%20Bye-laws%20G.O.-09.pdf",
  },
  {
    title: "Compounding Byelaws G.O. 87",
    image: "https://bdainfo.org/Webmedia/rules4.jpg",
    href: "https://bdainfo.org/Webmedia/Amendment-BBL2016(31.10.2017).pdf",
  },
];

export function RulesActs() {
  return (
    <div className="bg-[#0f172a] py-12 text-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-8 border-b border-white/20 pb-4">
          <h2 className="text-3xl font-bold text-white">Rules & Acts</h2>
          <Link href="/rules-acts" className="text-sm font-semibold text-orange-400 hover:text-orange-300">View All</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <a
              key={i}
              href={card.href}
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg overflow-hidden shadow-lg hover:-translate-y-1 transition-transform h-40 relative group"
              data-testid={`rules-card-${i}`}
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="font-bold text-base text-white leading-tight">{card.title}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
