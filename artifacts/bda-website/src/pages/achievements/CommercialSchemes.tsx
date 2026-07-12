import { AchievementsPageLayout } from "./AchievementsPageLayout";

const SCHEMES = [
  {
    id: 1,
    title: "प्रियदर्शिनी नगर शाॅपिंग काम्प्लेक्स",
    image: "https://bdainfo.org/Webmedia/slider-1.jpg",
    description:
      "यह योजना शहर के बीचोबीच स्टेडियम के पीछे स्थित है। इस योजना के अन्तर्गत भवनों, भूखण्डों, कार्यालय व दुकानों का निर्माण कराकर कब्जा दिया जा चुका है। वर्तमान में इस काम्प्लेक्स में पासपोर्ट कार्यालय, यूनियन बैंक ऑफ इंडिया , राष्ट्रीय सांख्किी विभाग कार्यालय चल रहे हैं।",
  },
];

export default function CommercialSchemes() {
  return (
    <AchievementsPageLayout title="Commercial Schemes" titleHi="व्यावसायिक योजनाएं">
      <div className="space-y-6">
        {SCHEMES.map((scheme) => (
          <div key={scheme.id} className="flex flex-col md:flex-row gap-6 border border-gray-100 rounded p-4 shadow-sm bg-gray-50/40">
            <div className="md:w-64 flex-shrink-0">
              <img
                src={scheme.image}
                alt={scheme.title}
                className="w-full h-44 object-cover rounded border border-gray-200"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#1a3a6e] mb-2" lang="hi">{scheme.title}</h3>
              <p className="text-gray-700 leading-relaxed text-sm" lang="hi">{scheme.description}</p>
            </div>
          </div>
        ))}
      </div>
    </AchievementsPageLayout>
  );
}
