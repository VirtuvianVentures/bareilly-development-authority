import { useMemo } from "react";
import { AchievementsPageLayout } from "./AchievementsPageLayout";

const STORAGE_KEY = "bda_housing_schemes_v1";

export interface SchemeItem {
  label: string;
  count?: number;
  isSubheader?: boolean;
  isTotal?: boolean;
}

export interface HousingScheme {
  id: number;
  name: string;
  items: SchemeItem[];
}

export const SEED_HOUSING_SCHEMES: HousingScheme[] = [
  { id: 1, name: "Tirbinath Residential Scheme", items: [
    { label: "EWS Houses", count: 196 },
    { label: "LIG Houses", count: 171 },
    { label: "MIG Houses", count: 148 },
    { label: "HIG Houses", count: 33 },
    { label: "Plot (residential)", count: 1 },
    { label: "Shops", count: 137 },
    { label: "Total", count: 687, isTotal: true },
  ]},
  { id: 2, name: "Harunagla Resi. Scheme", items: [
    { label: "EWS Houses", count: 128 },
    { label: "LIG Houses", count: 76 },
    { label: "MIG Houses", count: 46 },
    { label: "Plot HIG", count: 3 },
    { label: "Plot EWS", count: 7 },
    { label: "Plot (commercial)", count: 1 },
    { label: "Total", count: 261, isTotal: true },
  ]},
  { id: 3, name: "Priyadarshini Nagar Resi Schem", items: [
    { label: "LIG Houses", count: 68 },
    { label: "MIG Houses", count: 77 },
    { label: "HIG Houses", count: 13 },
    { label: "Plot (residential)", count: 78 },
    { label: "Shops", count: 34 },
    { label: "Office hall", count: 42 },
    { label: "Total", count: 310, isTotal: true },
  ]},
  { id: 4, name: "Deendayalpuram Resi. Scheme", items: [
    { label: "HIG Houses", count: 53 },
    { label: "Plot residential (P1 & P2)", count: 243 },
    { label: "Shoping area plot", count: 132 },
    { label: "Commercial plot", count: 24 },
    { label: "Nursery school plot", count: 3 },
    { label: "Office plot", count: 3 },
    { label: "Convenient shoping", count: 2 },
    { label: "Semi finished shop", count: 8 },
    { label: "Total", count: 468, isTotal: true },
  ]},
  { id: 5, name: "Tulapur residential scheme", items: [
    { label: "EWS Houses", count: 99 },
    { label: "LIG Houses", count: 68 },
    { label: "MIG Houses", count: 8 },
    { label: "Total", count: 175, isTotal: true },
  ]},
  { id: 6, name: "Bhaorao Devras Yojna Biharman Nagla", items: [
    { label: "Plot residential A categ", count: 46 },
    { label: "Plot residential B categ", count: 44 },
    { label: "LIG Houses", count: 25 },
    { label: "Total", count: 115, isTotal: true },
  ]},
  { id: 7, name: "Ekta Nagar Resi. scheme", items: [
    { label: "EWS Houses", count: 347 },
  ]},
  { id: 8, name: "Biharman Nagla ashrayheen yojna", items: [
    { label: "EWS Houses", count: 128 },
  ]},
  { id: 9, name: "VAMBAY Yojna Tulapur", items: [
    { label: "Houses", count: 478 },
    { label: "Plots EWS", count: 15 },
  ]},
  { id: 10, name: "Ramganga Nagar Resi. Scheme", items: [
    { label: "Sector - 3", isSubheader: true },
    { label: "Residential plot L1 to H3", count: 923 },
    { label: "Educational plot", count: 3 },
    { label: "Nursing Home plot", count: 1 },
    { label: "Commercial plot", count: 20 },
    { label: "Sector - 4 and 5", isSubheader: true },
    { label: "Residential plot LIG", count: 286 },
    { label: "Residential plot EWS", count: 187 },
    { label: "Shops", count: 9 },
    { label: "Total", count: 1429, isTotal: true },
  ]},
  { id: 11, name: "Nainital road office building", items: [
    { label: "Old office shops", count: 27 },
    { label: "Hall-GF/FF/SF", count: 24 },
  ]},
  { id: 12, name: "Transport Nagar Scheme", items: [
    { label: "Transporters plot", count: 1086 },
    { label: "Shops", count: 12 },
    { label: "Commercial plots", count: 16 },
    { label: "Public Utility", count: 16 },
    { label: "Total", count: 1130, isTotal: true },
  ]},
  { id: 13, name: "Kargaina Residential Scheme", items: [
    { label: "EWS houses (Old)", count: 632 },
    { label: "EWS houses (New)", count: 100 },
    { label: "Nursery school plot", count: 1 },
    { label: "Community centre plot", count: 1 },
    { label: "Total", count: 734, isTotal: true },
  ]},
  { id: 14, name: "Rampur Road Residential Scheme", items: [
    { label: "(A) Residential Khand", isSubheader: true },
    { label: "Pocket 'A'", isSubheader: true },
    { label: "Residential plot DP-1", count: 133 },
    { label: "Residential plot DP-2", count: 18 },
    { label: "Pocket 'B'", isSubheader: true },
    { label: "Residential plot DP-1", count: 31 },
    { label: "Residential plot DP-2", count: 9 },
    { label: "(B) Commercial Office Khand", isSubheader: true },
    { label: "Commercial plot", count: 45 },
    { label: "Office plot", count: 29 },
    { label: "(C) Ashrayheen Khand", isSubheader: true },
    { label: "Ashrayheen yojna phase-1", count: 299 },
    { label: "Ashrayheen yojna phase-2", count: 153 },
    { label: "Total", count: 717, isTotal: true },
  ]},
  { id: 15, name: "Lohia Vihar residential scheme", items: [
    { label: "P6-HIG (288 Sqm)", count: 34 },
    { label: "P5-HIG (240 Sqm)", count: 17 },
    { label: "P4-HIG (198 Sqm)", count: 103 },
    { label: "P3-HIG (198 Sqm)", count: 42 },
    { label: "P2-HIG (182 Sqm)", count: 27 },
    { label: "P1-MIG (128 Sqm)", count: 46 },
    { label: "Nursing home plot", count: 1 },
    { label: "Multiplex plot", count: 1 },
    { label: "Commercial Plot", count: 7 },
    { label: "Nursery school plot", count: 1 },
    { label: "Local Shoping plot", count: 7 },
    { label: "Kiosk", count: 3 },
    { label: "Total", count: 289, isTotal: true },
  ]},
  { id: 16, name: "VAMBAY Yojna Saidpur Hawknes", items: [
    { label: "Houses", count: 209, isTotal: true },
  ]},
];

function loadSchemes(): HousingScheme[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED_HOUSING_SCHEMES;
}

function SchemeBlock({ sn, scheme }: { sn: number; scheme: HousingScheme }) {
  return (
    <div className="mb-4">
      <table className="w-full text-sm border-collapse">
        <tbody>
          {/* Scheme header row */}
          <tr>
            <td className="border border-gray-300 px-2 py-1 w-10 align-top text-gray-600 text-xs">{sn}</td>
            <td colSpan={2} className="border border-gray-300 px-2 py-1 font-bold text-[#c8580a]">
              {scheme.name}
            </td>
          </tr>
          {scheme.items.map((item, i) => (
            <tr key={i} className={item.isTotal ? "bg-orange-50" : "even:bg-gray-50/40"}>
              <td className="border border-gray-300 px-2 py-0.5 w-10" />
              <td className={`border border-gray-300 px-3 py-0.5 ${
                item.isSubheader ? "font-semibold text-gray-700 italic text-xs" :
                item.isTotal ? "font-bold text-[#c8580a]" :
                "text-gray-700 pl-4"
              }`}>
                {item.isSubheader ? item.label : item.label}
              </td>
              <td className={`border border-gray-300 px-2 py-0.5 text-right w-20 ${
                item.isTotal ? "font-bold text-[#c8580a]" : "text-gray-700"
              }`}>
                {item.count !== undefined ? item.count : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function HousingSchemes() {
  const schemes = useMemo(() => loadSchemes(), []);
  const col1 = schemes.slice(0, 9);
  const col2 = schemes.slice(9);

  return (
    <AchievementsPageLayout title="Housing Schemes" titleHi="आवासीय योजनाएं">
      <p className="text-center font-semibold text-gray-700 mb-6 text-base">
        विभिन्न आवासीय योजनाओं में निर्मित भवनों की संख्याः
      </p>

      {/* Column headers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Header row */}
        <div className="hidden lg:block">
          <table className="w-full text-sm border-collapse mb-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-1.5 text-left text-xs font-semibold text-gray-700 w-10">SN</th>
                <th className="border border-gray-300 px-2 py-1.5 text-left text-xs font-semibold text-gray-700">Scheme</th>
                <th className="border border-gray-300 px-2 py-1.5 text-right text-xs font-semibold text-gray-700 w-20">Total created</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="hidden lg:block">
          <table className="w-full text-sm border-collapse mb-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-1.5 text-left text-xs font-semibold text-gray-700 w-10">SN</th>
                <th className="border border-gray-300 px-2 py-1.5 text-left text-xs font-semibold text-gray-700">Scheme</th>
                <th className="border border-gray-300 px-2 py-1.5 text-right text-xs font-semibold text-gray-700 w-20">Total created</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Column 1 */}
        <div>
          {col1.map((scheme, idx) => (
            <SchemeBlock key={scheme.id} sn={idx + 1} scheme={scheme} />
          ))}
        </div>

        {/* Column 2 */}
        <div>
          {col2.map((scheme, idx) => (
            <SchemeBlock key={scheme.id} sn={idx + 10} scheme={scheme} />
          ))}
        </div>
      </div>
    </AchievementsPageLayout>
  );
}
