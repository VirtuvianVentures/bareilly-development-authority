import { PayrollSimpleMaster } from "./PayrollSimpleMaster";
export default function HouseTypeMaster() {
  return <PayrollSimpleMaster apiEndpoint="house-types" title="House Type Master" columnLabel="House Type" placeholder="e.g. Type-I, Type-II" />;
}
