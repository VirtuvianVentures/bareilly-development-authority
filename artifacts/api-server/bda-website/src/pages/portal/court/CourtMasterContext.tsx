import { createContext, useContext, useState, ReactNode } from "react";

export interface Division {
  id: number;
  nameEn: string;
  nameHi: string;
  hq: string;
  code: string;
  status: "active" | "inactive";
}

export interface District {
  id: number;
  nameEn: string;
  nameHi: string;
  divisionId: number;
  code: string;
  status: "active" | "inactive";
}

export interface CourtType {
  id: number;
  nameEn: string;
  nameHi: string;
  abv: string;
  status: "active" | "inactive";
}

export interface Court {
  id: number;
  nameEn: string;
  nameHi: string;
  courtTypeId: number;
  abv: string;
  status: "active" | "inactive";
}

export interface CaseType {
  id: number;
  nameEn: string;
  nameHi: string;
  courtTypeId: number;
  status: "active" | "inactive";
}

const CASE_TYPE_BASE: { nameEn: string; nameHi: string }[] = [
  { nameEn: "Land Acquisition Cases",           nameHi: "भूमि अधिग्रहण मामले" },
  { nameEn: "Property / Title Disputes",        nameHi: "संपत्ति/शीर्षक विवाद" },
  { nameEn: "Plot / Flat Allotment Cases",       nameHi: "प्लॉट/फ्लैट आवंटन मामले" },
  { nameEn: "Lease Disputes",                   nameHi: "पट्टा विवाद" },
  { nameEn: "Unauthorized Construction Cases",  nameHi: "अनाधिकृत निर्माण मामले" },
  { nameEn: "Encroachment Cases",               nameHi: "अतिक्रमण मामले" },
  { nameEn: "Building Plan Approval Cases",     nameHi: "भवन योजना अनुमोदन मामले" },
  { nameEn: "Consumer Cases",                   nameHi: "उपभोक्ता मामले" },
  { nameEn: "Recovery of Dues Cases",           nameHi: "बकाया वसूली मामले" },
  { nameEn: "Contract Disputes",                nameHi: "अनुबंध विवाद" },
  { nameEn: "Tender / Auction Disputes",        nameHi: "निविदा/नीलामी विवाद" },
  { nameEn: "Service Matters (Employment Cases)", nameHi: "सेवा संबंधी मामले (रोजगार)" },
  { nameEn: "Environmental & Land Use Cases",   nameHi: "पर्यावरण एवं भूमि उपयोग मामले" },
  { nameEn: "Civil Suits",                      nameHi: "दीवानी वाद" },
  { nameEn: "Criminal Cases",                   nameHi: "आपराधिक मामले" },
  { nameEn: "Writ Petitions",                   nameHi: "रिट याचिकाएँ" },
  { nameEn: "Public Interest Litigation (PIL)", nameHi: "जनहित याचिका (PIL)" },
  { nameEn: "Appeals & Revisions",              nameHi: "अपील एवं पुनरीक्षण" },
];

const SEED_CASE_TYPES: CaseType[] = [1, 2, 3, 4, 5, 6, 7, 8, 9].flatMap((courtTypeId, ctIdx) =>
  CASE_TYPE_BASE.map((base, baseIdx) => ({
    id: ctIdx * 100 + baseIdx + 1,
    nameEn: base.nameEn,
    nameHi: base.nameHi,
    courtTypeId,
    status: "active" as const,
  }))
);

const SEED_DIVISIONS: Division[] = [
  { id: 1,  nameEn: "Agra",        nameHi: "आगरा",       hq: "Agra",        code: "AGR", status: "active" },
  { id: 2,  nameEn: "Aligarh",     nameHi: "अलीगढ़",     hq: "Aligarh",     code: "ALG", status: "active" },
  { id: 3,  nameEn: "Ayodhya",     nameHi: "अयोध्या",    hq: "Ayodhya",     code: "AYD", status: "active" },
  { id: 4,  nameEn: "Azamgarh",    nameHi: "आज़मगढ़",    hq: "Azamgarh",    code: "AZM", status: "active" },
  { id: 5,  nameEn: "Bareilly",    nameHi: "बरेली",      hq: "Bareilly",    code: "BRL", status: "active" },
  { id: 6,  nameEn: "Basti",       nameHi: "बस्ती",      hq: "Basti",       code: "BST", status: "active" },
  { id: 7,  nameEn: "Chitrakoot",  nameHi: "चित्रकूट",   hq: "Banda",       code: "CTK", status: "active" },
  { id: 8,  nameEn: "Devipatan",   nameHi: "देवीपाटन",   hq: "Gonda",       code: "DVP", status: "active" },
  { id: 9,  nameEn: "Gorakhpur",   nameHi: "गोरखपुर",    hq: "Gorakhpur",   code: "GKP", status: "active" },
  { id: 10, nameEn: "Jhansi",      nameHi: "झाँसी",      hq: "Jhansi",      code: "JHS", status: "active" },
  { id: 11, nameEn: "Kanpur",      nameHi: "कानपुर",     hq: "Kanpur",      code: "KNP", status: "active" },
  { id: 12, nameEn: "Lucknow",     nameHi: "लखनऊ",       hq: "Lucknow",     code: "LKO", status: "active" },
  { id: 13, nameEn: "Meerut",      nameHi: "मेरठ",       hq: "Meerut",      code: "MRT", status: "active" },
  { id: 14, nameEn: "Mirzapur",    nameHi: "मिर्ज़ापुर",  hq: "Mirzapur",    code: "MZP", status: "active" },
  { id: 15, nameEn: "Moradabad",   nameHi: "मुरादाबाद",  hq: "Moradabad",   code: "MRD", status: "active" },
  { id: 16, nameEn: "Prayagraj",   nameHi: "प्रयागराज",  hq: "Prayagraj",   code: "PRG", status: "active" },
  { id: 17, nameEn: "Saharanpur",  nameHi: "सहारनपुर",   hq: "Saharanpur",  code: "SHP", status: "active" },
  { id: 18, nameEn: "Varanasi",    nameHi: "वाराणसी",    hq: "Varanasi",    code: "VNS", status: "active" },
];

const SEED_DISTRICTS: District[] = [
  /* Agra (1) */
  { id: 101, nameEn: "Agra",              nameHi: "आगरा",              divisionId: 1,  code: "AGR", status: "active" },
  { id: 102, nameEn: "Firozabad",         nameHi: "फिरोज़ाबाद",        divisionId: 1,  code: "FRZ", status: "active" },
  { id: 103, nameEn: "Mainpuri",          nameHi: "मैनपुरी",           divisionId: 1,  code: "MNP", status: "active" },
  { id: 104, nameEn: "Mathura",           nameHi: "मथुरा",             divisionId: 1,  code: "MTH", status: "active" },
  /* Aligarh (2) */
  { id: 201, nameEn: "Aligarh",           nameHi: "अलीगढ़",            divisionId: 2,  code: "ALG", status: "active" },
  { id: 202, nameEn: "Etah",              nameHi: "एटा",               divisionId: 2,  code: "ETA", status: "active" },
  { id: 203, nameEn: "Hathras",           nameHi: "हाथरस",             divisionId: 2,  code: "HTH", status: "active" },
  { id: 204, nameEn: "Kasganj",           nameHi: "काशगंज",            divisionId: 2,  code: "KSG", status: "active" },
  /* Ayodhya (3) */
  { id: 301, nameEn: "Ayodhya",           nameHi: "अयोध्या",           divisionId: 3,  code: "AYD", status: "active" },
  { id: 302, nameEn: "Ambedkar Nagar",    nameHi: "अंबेडकर नगर",       divisionId: 3,  code: "ABN", status: "active" },
  { id: 303, nameEn: "Barabanki",         nameHi: "बाराबंकी",          divisionId: 3,  code: "BBK", status: "active" },
  { id: 304, nameEn: "Amethi",            nameHi: "अमेठी",             divisionId: 3,  code: "AMT", status: "active" },
  { id: 305, nameEn: "Sultanpur",         nameHi: "सुल्तानपुर",        divisionId: 3,  code: "SLT", status: "active" },
  /* Azamgarh (4) */
  { id: 401, nameEn: "Azamgarh",          nameHi: "आज़मगढ़",            divisionId: 4,  code: "AZM", status: "active" },
  { id: 402, nameEn: "Ballia",            nameHi: "बलिया",             divisionId: 4,  code: "BLL", status: "active" },
  { id: 403, nameEn: "Mau",               nameHi: "मऊ",                divisionId: 4,  code: "MAU", status: "active" },
  /* Bareilly (5) */
  { id: 501, nameEn: "Bareilly",          nameHi: "बरेली",             divisionId: 5,  code: "BRL", status: "active" },
  { id: 502, nameEn: "Budaun",            nameHi: "बदायूँ",            divisionId: 5,  code: "BDN", status: "active" },
  { id: 503, nameEn: "Pilibhit",          nameHi: "पीलीभीत",           divisionId: 5,  code: "PLB", status: "active" },
  { id: 504, nameEn: "Shahjahanpur",      nameHi: "शाहजहाँपुर",        divisionId: 5,  code: "SJP", status: "active" },
  /* Basti (6) */
  { id: 601, nameEn: "Basti",             nameHi: "बस्ती",             divisionId: 6,  code: "BST", status: "active" },
  { id: 602, nameEn: "Sant Kabir Nagar",  nameHi: "संत कबीर नगर",      divisionId: 6,  code: "SKN", status: "active" },
  { id: 603, nameEn: "Siddharthnagar",    nameHi: "सिद्धार्थनगर",      divisionId: 6,  code: "SDN", status: "active" },
  /* Chitrakoot (7) */
  { id: 701, nameEn: "Banda",             nameHi: "बांदा",             divisionId: 7,  code: "BND", status: "active" },
  { id: 702, nameEn: "Chitrakoot",        nameHi: "चित्रकूट",          divisionId: 7,  code: "CTK", status: "active" },
  { id: 703, nameEn: "Hamirpur",          nameHi: "हमीरपुर",           divisionId: 7,  code: "HMP", status: "active" },
  { id: 704, nameEn: "Mahoba",            nameHi: "महोबा",             divisionId: 7,  code: "MHB", status: "active" },
  /* Devipatan (8) */
  { id: 801, nameEn: "Bahraich",          nameHi: "बहराइच",            divisionId: 8,  code: "BHR", status: "active" },
  { id: 802, nameEn: "Balarampur",        nameHi: "बलरामपुर",          divisionId: 8,  code: "BRM", status: "active" },
  { id: 803, nameEn: "Gonda",             nameHi: "गोंडा",             divisionId: 8,  code: "GND", status: "active" },
  { id: 804, nameEn: "Shravasti",         nameHi: "श्रावस्ती",          divisionId: 8,  code: "SHV", status: "active" },
  /* Gorakhpur (9) */
  { id: 901, nameEn: "Deoria",            nameHi: "देवरिया",           divisionId: 9,  code: "DRA", status: "active" },
  { id: 902, nameEn: "Gorakhpur",         nameHi: "गोरखपुर",           divisionId: 9,  code: "GKP", status: "active" },
  { id: 903, nameEn: "Kushinagar",        nameHi: "कुशीनगर",           divisionId: 9,  code: "KSN", status: "active" },
  { id: 904, nameEn: "Maharajganj",       nameHi: "महाराजगंज",         divisionId: 9,  code: "MRJ", status: "active" },
  /* Jhansi (10) */
  { id: 1001, nameEn: "Jalaun",           nameHi: "जालौन",             divisionId: 10, code: "JLN", status: "active" },
  { id: 1002, nameEn: "Jhansi",           nameHi: "झाँसी",             divisionId: 10, code: "JHS", status: "active" },
  { id: 1003, nameEn: "Lalitpur",         nameHi: "ललितपुर",           divisionId: 10, code: "LTP", status: "active" },
  /* Kanpur (11) */
  { id: 1101, nameEn: "Auraiya",          nameHi: "औरैया",             divisionId: 11, code: "ARA", status: "active" },
  { id: 1102, nameEn: "Etawah",           nameHi: "इटावा",             divisionId: 11, code: "ETW", status: "active" },
  { id: 1103, nameEn: "Farrukhabad",      nameHi: "फर्रुखाबाद",        divisionId: 11, code: "FKB", status: "active" },
  { id: 1104, nameEn: "Kannauj",          nameHi: "कन्नौज",            divisionId: 11, code: "KNJ", status: "active" },
  { id: 1105, nameEn: "Kanpur Dehat",     nameHi: "कानपुर देहात",      divisionId: 11, code: "KND", status: "active" },
  { id: 1106, nameEn: "Kanpur Nagar",     nameHi: "कानपुर नगर",        divisionId: 11, code: "KNN", status: "active" },
  /* Lucknow (12) */
  { id: 1201, nameEn: "Hardoi",           nameHi: "हरदोई",             divisionId: 12, code: "HRD", status: "active" },
  { id: 1202, nameEn: "Lakhimpur Kheri",  nameHi: "लखीमपुर खीरी",     divisionId: 12, code: "LKH", status: "active" },
  { id: 1203, nameEn: "Lucknow",          nameHi: "लखनऊ",             divisionId: 12, code: "LKO", status: "active" },
  { id: 1204, nameEn: "Raebareli",        nameHi: "रायबरेली",          divisionId: 12, code: "RBL", status: "active" },
  { id: 1205, nameEn: "Sitapur",          nameHi: "सीतापुर",           divisionId: 12, code: "STP", status: "active" },
  { id: 1206, nameEn: "Unnao",            nameHi: "उन्नाव",            divisionId: 12, code: "UNN", status: "active" },
  /* Meerut (13) */
  { id: 1301, nameEn: "Baghpat",          nameHi: "बागपत",             divisionId: 13, code: "BGP", status: "active" },
  { id: 1302, nameEn: "Bulandshahr",      nameHi: "बुलंदशहर",          divisionId: 13, code: "BLD", status: "active" },
  { id: 1303, nameEn: "Gautam Buddha Nagar", nameHi: "गौतम बुद्ध नगर", divisionId: 13, code: "GBN", status: "active" },
  { id: 1304, nameEn: "Ghaziabad",        nameHi: "गाज़ियाबाद",        divisionId: 13, code: "GZB", status: "active" },
  { id: 1305, nameEn: "Hapur",            nameHi: "हापुड़",            divisionId: 13, code: "HPR", status: "active" },
  { id: 1306, nameEn: "Meerut",           nameHi: "मेरठ",              divisionId: 13, code: "MRT", status: "active" },
  /* Mirzapur (14) */
  { id: 1401, nameEn: "Mirzapur",         nameHi: "मिर्ज़ापुर",         divisionId: 14, code: "MZP", status: "active" },
  { id: 1402, nameEn: "Sant Ravidas Nagar (Bhadohi)", nameHi: "संत रविदास नगर (भदोही)", divisionId: 14, code: "BDH", status: "active" },
  { id: 1403, nameEn: "Sonbhadra",        nameHi: "सोनभद्र",           divisionId: 14, code: "SNB", status: "active" },
  /* Moradabad (15) */
  { id: 1501, nameEn: "Amroha",           nameHi: "अमरोहा",            divisionId: 15, code: "AMR", status: "active" },
  { id: 1502, nameEn: "Bijnor",           nameHi: "बिजनौर",            divisionId: 15, code: "BJN", status: "active" },
  { id: 1503, nameEn: "Moradabad",        nameHi: "मुरादाबाद",         divisionId: 15, code: "MRD", status: "active" },
  { id: 1504, nameEn: "Rampur",           nameHi: "रामपुर",            divisionId: 15, code: "RMP", status: "active" },
  { id: 1505, nameEn: "Sambhal",          nameHi: "संभल",              divisionId: 15, code: "SMB", status: "active" },
  /* Prayagraj (16) */
  { id: 1601, nameEn: "Fatehpur",         nameHi: "फतेहपुर",           divisionId: 16, code: "FTP", status: "active" },
  { id: 1602, nameEn: "Kaushambi",        nameHi: "कौशाम्बी",          divisionId: 16, code: "KSM", status: "active" },
  { id: 1603, nameEn: "Pratapgarh",       nameHi: "प्रतापगढ़",         divisionId: 16, code: "PTG", status: "active" },
  { id: 1604, nameEn: "Prayagraj",        nameHi: "प्रयागराज",         divisionId: 16, code: "PRG", status: "active" },
  /* Saharanpur (17) */
  { id: 1701, nameEn: "Muzaffarnagar",    nameHi: "मुज़फ्फरनगर",       divisionId: 17, code: "MZN", status: "active" },
  { id: 1702, nameEn: "Saharanpur",       nameHi: "सहारनपुर",          divisionId: 17, code: "SHP", status: "active" },
  { id: 1703, nameEn: "Shamli",           nameHi: "शामली",             divisionId: 17, code: "SML", status: "active" },
  /* Varanasi (18) */
  { id: 1801, nameEn: "Chandauli",        nameHi: "चंदौली",            divisionId: 18, code: "CDL", status: "active" },
  { id: 1802, nameEn: "Ghazipur",         nameHi: "ग़ाज़ीपुर",         divisionId: 18, code: "GZP", status: "active" },
  { id: 1803, nameEn: "Jaunpur",          nameHi: "जौनपुर",            divisionId: 18, code: "JNP", status: "active" },
  { id: 1804, nameEn: "Varanasi",         nameHi: "वाराणसी",           divisionId: 18, code: "VNS", status: "active" },
];

const SEED_COURTS: Court[] = [
  /* courtTypeId ref: 1=High Court, 2=Lower Court, 3=District Court, 4=Supreme Court,
     5=Consumer Forum, 6=National Green Tribunal, 7=Sealing Land, 8=LARA Court, 9=BDA */
  { id: 1,  nameEn: "High Court (Lucknow)",           nameHi: "उच्च न्यायालय (लखनऊ)",           courtTypeId: 1, abv: "HCL",          status: "active" },
  { id: 2,  nameEn: "CIVIL",                          nameHi: "सिविल",                           courtTypeId: 2, abv: "CIVIL",        status: "active" },
  { id: 3,  nameEn: "High Court (Allahabad)",         nameHi: "उच्च न्यायालय (इलाहाबाद)",        courtTypeId: 1, abv: "HCA",          status: "active" },
  { id: 4,  nameEn: "DJ",                             nameHi: "डी.जे.",                          courtTypeId: 2, abv: "DJ",           status: "active" },
  { id: 5,  nameEn: "LABOUR",                         nameHi: "श्रम न्यायालय",                   courtTypeId: 2, abv: "LABOUR",       status: "active" },
  { id: 6,  nameEn: "ETC",                            nameHi: "ई.टी.सी.",                        courtTypeId: 2, abv: "ETC",          status: "active" },
  { id: 7,  nameEn: "Supreme Court",                  nameHi: "सर्वोच्च न्यायालय",               courtTypeId: 4, abv: "SC",           status: "active" },
  { id: 8,  nameEn: "District Judge",                 nameHi: "जिला न्यायाधीश",                  courtTypeId: 3, abv: "DJ",           status: "active" },
  { id: 9,  nameEn: "Uttaranchal Court",              nameHi: "उत्तरांचल न्यायालय",               courtTypeId: 5, abv: "UC",           status: "active" },
  { id: 10, nameEn: "National Green Tribunal",        nameHi: "राष्ट्रीय हरित अधिकरण",           courtTypeId: 6, abv: "NGT",          status: "active" },
  { id: 11, nameEn: "Lower Court",                   nameHi: "निचली अदालत",                     courtTypeId: 2, abv: "LC",           status: "active" },
  { id: 12, nameEn: "Consumer Forum",                nameHi: "उपभोक्ता फोरम",                   courtTypeId: 5, abv: "CF",           status: "active" },
  { id: 13, nameEn: "Additional District Judge",     nameHi: "अतिरिक्त जिला न्यायाधीश",         courtTypeId: 3, abv: "ADJ",          status: "active" },
  { id: 14, nameEn: "LARA Court",                    nameHi: "लारा न्यायालय",                   courtTypeId: 3, abv: "LARA",         status: "active" },
  { id: 15, nameEn: "Civil Judge",                   nameHi: "सिविल जज",                        courtTypeId: 3, abv: "CJ",           status: "active" },
  { id: 16, nameEn: "Other",                         nameHi: "अन्य",                            courtTypeId: 3, abv: "OJ",           status: "active" },
  { id: 17, nameEn: "BDA",                           nameHi: "बी.डी.ए.",                        courtTypeId: 9, abv: "BDA",          status: "active" },
  { id: 18, nameEn: "Appeal Officer (Commissioner)", nameHi: "अपील अधिकारी (आयुक्त)",           courtTypeId: 9, abv: "AO(C)",        status: "active" },
  { id: 19, nameEn: "Govt. Revision",               nameHi: "सरकारी पुनरीक्षण",                courtTypeId: 9, abv: "Govt. Revision", status: "active" },
];

const SEED_COURT_TYPES: CourtType[] = [
  { id: 1, nameEn: "High Court",                  nameHi: "उच्च न्यायालय",           abv: "HC",         status: "active" },
  { id: 2, nameEn: "Lower Court",                 nameHi: "निचली अदालत",             abv: "LC",         status: "active" },
  { id: 3, nameEn: "District Court",              nameHi: "जिला न्यायालय",            abv: "DC",         status: "active" },
  { id: 4, nameEn: "Supreme Court",               nameHi: "सर्वोच्च न्यायालय",        abv: "SC",         status: "active" },
  { id: 5, nameEn: "Consumer Forum",              nameHi: "उपभोक्ता फोरम",           abv: "CF",         status: "active" },
  { id: 6, nameEn: "National Green Tribunal",     nameHi: "राष्ट्रीय हरित अधिकरण",    abv: "NGT",        status: "active" },
  { id: 7, nameEn: "Sealing Land",                nameHi: "सीलिंग भूमि न्यायालय",     abv: "High Court", status: "active" },
  { id: 8, nameEn: "LARA Court",                  nameHi: "लारा न्यायालय",            abv: "LARA",       status: "active" },
  { id: 9, nameEn: "Bareilly Development Authority", nameHi: "बरेली विकास प्राधिकरण", abv: "BDA",        status: "active" },
];

export interface Advocate {
  id: number;
  nameEn: string;
  nameHi: string;
  barCouncilNo: string;
  enrollmentDate: string;
  mobile: string;
  email: string;
  courtId: number;
  address: string;
  status: "active" | "inactive";
}

export const SEED_ADVOCATES: Advocate[] = [
  {
    id: 1,
    nameEn: "Rajesh Kumar Sharma",
    nameHi: "राजेश कुमार शर्मा",
    barCouncilNo: "UP/1234/2015",
    enrollmentDate: "2015-03-10",
    mobile: "9876543210",
    email: "rajesh.sharma@advocate.com",
    courtId: 2,
    address: "123, Civil Lines, Bareilly, UP - 243001",
    status: "active",
  },
  {
    id: 2,
    nameEn: "Sunita Devi Gupta",
    nameHi: "सुनीता देवी गुप्ता",
    barCouncilNo: "UP/5678/2018",
    enrollmentDate: "2018-07-22",
    mobile: "9812345678",
    email: "sunita.gupta@advocate.com",
    courtId: 1,
    address: "45, Subhash Nagar, Bareilly, UP - 243005",
    status: "active",
  },
];

interface CourtMasterContextType {
  divisions: Division[];
  setDivisions: React.Dispatch<React.SetStateAction<Division[]>>;
  districts: District[];
  setDistricts: React.Dispatch<React.SetStateAction<District[]>>;
  courtTypes: CourtType[];
  setCourtTypes: React.Dispatch<React.SetStateAction<CourtType[]>>;
  courts: Court[];
  setCourts: React.Dispatch<React.SetStateAction<Court[]>>;
  caseTypes: CaseType[];
  setCaseTypes: React.Dispatch<React.SetStateAction<CaseType[]>>;
  advocates: Advocate[];
  setAdvocates: React.Dispatch<React.SetStateAction<Advocate[]>>;
}

const CourtMasterContext = createContext<CourtMasterContextType | null>(null);

export function CourtMasterProvider({ children }: { children: ReactNode }) {
  const [divisions, setDivisions] = useState<Division[]>(SEED_DIVISIONS);
  const [districts, setDistricts] = useState<District[]>(SEED_DISTRICTS);
  const [courtTypes, setCourtTypes] = useState<CourtType[]>(SEED_COURT_TYPES);
  const [courts, setCourts] = useState<Court[]>(SEED_COURTS);
  const [caseTypes, setCaseTypes] = useState<CaseType[]>(SEED_CASE_TYPES);
  const [advocates, setAdvocates] = useState<Advocate[]>(SEED_ADVOCATES);

  return (
    <CourtMasterContext.Provider value={{ divisions, setDivisions, districts, setDistricts, courtTypes, setCourtTypes, courts, setCourts, caseTypes, setCaseTypes, advocates, setAdvocates }}>
      {children}
    </CourtMasterContext.Provider>
  );
}

export function useCourtMasters() {
  const ctx = useContext(CourtMasterContext);
  if (!ctx) throw new Error("useCourtMasters must be used inside CourtMasterProvider");
  return ctx;
}
