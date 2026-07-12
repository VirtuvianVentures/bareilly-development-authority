import { AboutPageLayout } from "./AboutPageLayout";

export default function OrganisationStructure() {
  return (
    <AboutPageLayout title="Organisation Structure" titleHi="संगठन संरचना">
      <div className="border border-gray-200 rounded overflow-hidden">
        <img
          src="https://bdainfo.org/webmedia/BDAStructure.png"
          alt="BDA Organisation Structure"
          className="w-full h-auto"
        />
      </div>
    </AboutPageLayout>
  );
}
