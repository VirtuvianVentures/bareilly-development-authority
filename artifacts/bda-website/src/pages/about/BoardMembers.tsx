import { useMemo } from "react";
import { AboutPageLayout } from "./AboutPageLayout";

const STORAGE_KEY = "bda_board_members_v1";

export const SEED_BOARD_MEMBERS = [
  { id: 1,  name: "श्री भूपेंद्र एस. चौधरी आई.ए.एस.", post: "आयुक्त/अध्यक्ष, बरेली मण्डल/बरेली विकास प्राधिकरण", role: "अध्यक्ष" },
  { id: 2,  name: "श्रीमती सौम्या पाण्डेय आई.ए.एस.", post: "उपाध्यक्ष, बरेली विकास प्राधिकरण, बरेली", role: "उपाध्यक्ष" },
  { id: 3,  name: "श्री अविनाश सिंह आई.ए.एस.", post: "जिलाधिकारी, बरेली", role: "सदस्य" },
  { id: 4,  name: "श्री संजीव कुमार मौर्य आई.ए.एस.", post: "नगर आयुक्त नगर निगम , बरेली", role: "सदस्य" },
  { id: 5,  name: "श्री -------- सहयुक्त नगर नियोजक", post: "मुख्य नगर एवं ग्राम नियोजक नगर एवं ग्राम नियोजक विभाग, उ0प्र0 लखनऊ के प्रतिनिधि", role: "सदस्य" },
  { id: 6,  name: "श्री -------- अपर निदेशक कोषागार एवं पेंशन, बरेली मण्डल बरेली", post: "सचिव, वित्त विभाग, उ0प्र0 शासन के प्रतिनिधि", role: "सदस्य" },
  { id: 7,  name: "", post: "प्रबन्ध निदेशक उ0प्र0 जल निगम, लखनऊ के प्रतिनिधि।", role: "सदस्य" },
  { id: 8,  name: "", post: "अधीक्षण अभियन्ता, उ0प्र0 पावर कारपोरेशन, बरेली", role: "सदस्य" },
  { id: 9,  name: "श्री", post: "संयुक्त आयुक्त आयुक्त उद्योग, उद्योग विभाग, बरेली", role: "सदस्य" },
  { id: 10, name: "श्री", post: "पार्षद/सदस्य नगर निगम/प्राधिकरण बोर्ड", role: "सदस्य" },
  { id: 11, name: "श्री", post: "पार्षद/सदस्य नगर निगम/प्राधिकरण बोर्ड", role: "सदस्य" },
  { id: 12, name: "श्री", post: "पार्षद/सदस्य नगर निगम/प्राधिकरण बोर्ड", role: "सदस्य" },
  { id: 13, name: "श्री", post: "पार्षद/सदस्य नगर निगम/प्राधिकरण बोर्ड", role: "सदस्य" },
  { id: 14, name: "श्री", post: "नामित सदस्य", role: "सदस्य" },
  { id: 15, name: "श्री", post: "नामित सदस्य", role: "सदस्य" },
  { id: 16, name: "श्री", post: "नामित सदस्य", role: "सदस्य" },
  { id: 17, name: "श्रीमती वन्दिता श्रीवास्तव पी.सी.एस.", post: "सचिव, बरेली विकास प्राधिकरण, बरेली", role: "सचिव" },
];

function loadMembers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as typeof SEED_BOARD_MEMBERS;
  } catch {}
  return SEED_BOARD_MEMBERS;
}

export default function BoardMembers() {
  const members = useMemo(() => loadMembers(), []);

  return (
    <AboutPageLayout title="Board Members" titleHi="बोर्ड सदस्य">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm" lang="hi">
          <thead>
            <tr className="bg-gray-100 border border-gray-300">
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700 w-20">क्रम सं.</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">नाम</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">पदनाम</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700 w-28">भूमिका</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, idx) => (
              <tr key={member.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border border-gray-300 px-4 py-2 text-gray-600">{idx + 1}.</td>
                <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">{member.name}</td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">{member.post}</td>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">{member.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AboutPageLayout>
  );
}
