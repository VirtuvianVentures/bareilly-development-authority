import { useMemo } from "react";
import { AchievementsPageLayout } from "./AchievementsPageLayout";

const STORAGE_KEY = "bda_investors_list_v1";

export interface Investor {
  id: number;
  name: string;
  cost: number;
}

export const SEED_INVESTORS: Investor[] = [
  { id: 1,  name: "सशस्त्र सीमा बल",                              cost: 932.96  },
  { id: 2,  name: "राजर्षि टण्डन मुक्त विश्वविद्यालय",            cost: 141.24  },
  { id: 3,  name: "सेन्ट्रल यू0पी0 गैस लि0",                       cost: 724.65  },
  { id: 4,  name: "मुरलैक्स इन्टरप्राईजेज",                        cost: 1001.78 },
  { id: 5,  name: "एल0आई0सी0",                                     cost: 377.53  },
  { id: 6,  name: "बी0पी0ए0 कोवेन्चर्स एण्ड नेटवर्क",             cost: 141.12  },
  { id: 7,  name: "रूहेलखण्ड एजुकेशन चैरिटेबल ट्रस्ट",           cost: 1785.08 },
  { id: 8,  name: "ट्राइएज मेडिकल इन्स्टीटयूट प्रा0लि0",          cost: 1173.49 },
  { id: 9,  name: "इण्डियन मेडिकल एसोसिएशन",                      cost: 861.39  },
  { id: 10, name: "राजश्री एजुकेशन ट्रस्ट",                       cost: 1378.60 },
  { id: 11, name: "स्टेट बैंक ऑफ इण्डिया",                        cost: 1291.88 },
  { id: 12, name: "अर्बन कॉम्परेटिव बैंक",                        cost: 689.70  },
  { id: 13, name: "डी0 मार्ट",                                     cost: 64.33   },
  { id: 14, name: "लखनऊ पब्लिक चैरिटेबल ट्रस्ट",                 cost: 1279.56 },
  { id: 15, name: "ग्रोवर ट्रेड लिंक प्रा0लि0",                   cost: 982.53  },
  { id: 16, name: "राजश्री एजुकेशनल ट्रस्ट",                      cost: 699.34  },
  { id: 17, name: "खण्डेलवाल डिस्ट्रीब्यूटर प्रा0लि0",            cost: 1734.79 },
  { id: 18, name: "मैत्री हैल्थ केयर",                            cost: 724.50  },
  { id: 19, name: "चक्रवर्ती कपिल रमेश",                          cost: 753.00  },
  { id: 20, name: "केजेएस नोएडा हॉस्पिटलिटी",                     cost: 1471.61 },
  { id: 21, name: "मै0 रिजेन्सी हॉस्पिटल लि0",                    cost: 5602.71 },
  { id: 22, name: "एस0एल0 ढींगरा मेमोरियल चेरिटेबिल ट्रस्ट",     cost: 513.36  },
  { id: 23, name: "इन्टेलिजेंस ब्यूरो",                           cost: 2598.00 },
];

function loadInvestors(): Investor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED_INVESTORS;
}

export default function InvestorsList() {
  const investors = useMemo(() => loadInvestors(), []);
  const total = investors.reduce((s, i) => s + i.cost, 0);

  return (
    <AchievementsPageLayout title="Investors List" titleHi="निवेशक सूची">
      <p className="text-center font-bold text-gray-800 mb-5 text-base" lang="hi">
        प्राधिकरण की रामगंगा नगर योजना में प्रमुख निवेश
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm" lang="hi">
          <thead>
            <tr className="bg-[#1a3a6e] text-white">
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold w-20">क्रमांक</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">योजना का नाम</th>
              <th className="border border-gray-300 px-4 py-2 text-right font-semibold w-36">लागत (लाख में)</th>
            </tr>
          </thead>
          <tbody>
            {investors.map((inv, idx) => (
              <tr key={inv.id} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50/40"}>
                <td className="border border-gray-300 px-4 py-1.5 text-center text-gray-600">{idx + 1}</td>
                <td className="border border-gray-300 px-4 py-1.5 text-gray-800">{inv.name}</td>
                <td className="border border-gray-300 px-4 py-1.5 text-right text-gray-700">{inv.cost.toFixed(2)}</td>
              </tr>
            ))}
            {/* Total row */}
            <tr className="bg-orange-50 font-bold">
              <td className="border border-gray-300 px-4 py-2" colSpan={2} lang="hi">कुल योग</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-[#c8580a]">{total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </AchievementsPageLayout>
  );
}
