import { AboutPageLayout } from "./AboutPageLayout";

export default function GeographicalArea() {
  return (
    <AboutPageLayout title="Geographical Area" titleHi="भौगोलिक क्षेत्र">
      <h3 className="text-lg font-bold text-[#1a3a6e] mb-4">Bareilly Master Plan - 2031</h3>
      <div className="border border-gray-200 rounded overflow-hidden">
        <img
          src="https://bdainfo.org/webmedia/bareillyMP2031.png"
          alt="Bareilly Master Plan 2031"
          className="w-full h-auto"
        />
      </div>
    </AboutPageLayout>
  );
}
