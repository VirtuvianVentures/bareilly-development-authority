import { useMemo } from "react";
import { AboutPageLayout } from "./AboutPageLayout";

const STORAGE_KEY = "bda_officers_v1";

export const SEED_OFFICERS = [
  { id: 1,  name: "श्रीमती सौम्या पाण्डेय (आई0 ए0 एस0)", designation: "उपाध्यक्ष" },
  { id: 2,  name: "श्रीमती वन्दिता श्रीवास्तव (पी0 सी0 एस0)", designation: "सचिव" },
  { id: 3,  name: "श्री शिवधनी सिंह यादव", designation: "मुख्य वित्त एवं लेखाधिकारी" },
  { id: 4,  name: "श्री दीपक कुमार", designation: "संयुक्त सचिव" },
  { id: 5,  name: "श्रीमती नीलम श्रीवास्तव", designation: "विशेष कार्याधिकारी" },
  { id: 6,  name: "श्री अजीत कुमार सिंह", designation: "विशेष कार्याधिकारी" },
  { id: 7,  name: "श्री अजय कुमार सिंह", designation: "मुख्य नगर नियोजक" },
  { id: 8,  name: "श्री योगेन्द्र कुमार", designation: "अधिशासी अभियन्ता" },
  { id: 9,  name: "श्री रजत सिंह", designation: "सहायक अभियन्ता" },
  { id: 10, name: "श्री संदीप कुमार", designation: "सहायक अभियन्ता" },
  { id: 11, name: "श्री अजय कुमार यादव", designation: "सहायक अभियन्ता" },
  { id: 12, name: "श्री धर्मवीर सिंह", designation: "सहायक अभियन्ता" },
  { id: 13, name: "श्री मनोज कुमार सिंह", designation: "सहायक अभियन्ता" },
  { id: 14, name: "श्री गजेन्द्र पाल शर्मा", designation: "सहायक अभियन्ता" },
];

function loadOfficers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as typeof SEED_OFFICERS;
  } catch {}
  return SEED_OFFICERS;
}

export default function BdaOfficers() {
  const officers = useMemo(() => loadOfficers(), []);

  return (
    <AboutPageLayout title="BDA Officers" titleHi="बी.डी.ए. अधिकारी">
      <div className="overflow-x-auto">
        <p className="text-center font-semibold text-gray-700 mb-4">
          कार्यालय बरेली विकास प्राधिकरण, बरेली
        </p>
        <table className="w-full border-collapse text-sm" lang="hi">
          <thead>
            <tr className="bg-gray-100 border border-gray-300">
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700 w-20">क्र0 सं0.</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">अधिकारी का नाम</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">पदनाम</th>
            </tr>
          </thead>
          <tbody>
            {officers.map((officer, idx) => (
              <tr key={officer.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border border-gray-300 px-4 py-2 text-gray-600">{idx + 1}.</td>
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">{officer.name}</td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">{officer.designation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AboutPageLayout>
  );
}
