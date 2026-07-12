import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import NotFound from "@/pages/not-found";

// Public pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Objectives from "@/pages/about/Objectives";
import BdaOfficers from "@/pages/about/BdaOfficers";
import BoardMembers from "@/pages/about/BoardMembers";
import GeographicalArea from "@/pages/about/GeographicalArea";
import OrganisationStructure from "@/pages/about/OrganisationStructure";
import Schemes from "@/pages/Schemes";
import Achievements from "@/pages/Achievements";
import Media from "@/pages/Media";
import Contact from "@/pages/Contact";
import RaiseQuery from "@/pages/RaiseQuery";
import NewRegistration from "@/pages/NewRegistration";
import RulesActs from "@/pages/RulesActs";

// Portal auth
import AdminLogin from "@/pages/admin/AdminLogin";

// Portal home + modules
import PortalHome from "@/pages/portal/PortalHome";
import UserManagement from "@/pages/portal/UserManagement";
import PropertyModule from "@/pages/portal/PropertyModule";
import MaintenanceModule from "@/pages/portal/MaintenanceModule";
import CourtModule from "@/pages/portal/CourtModule";
import { CourtMasterProvider } from "@/pages/portal/court/CourtMasterContext";
import CourtDivisionMaster from "@/pages/portal/court/CourtDivisionMaster";
import CourtDistrictMaster from "@/pages/portal/court/CourtDistrictMaster";
import CourtTypeMaster from "@/pages/portal/court/CourtTypeMaster";
import CourtCourtMaster from "@/pages/portal/court/CourtCourtMaster";
import CourtCaseTypeMaster from "@/pages/portal/court/CourtCaseTypeMaster";
import CourtAdvocateMaster from "@/pages/portal/court/CourtAdvocateMaster";
import CourtPetitionerCategoryMaster from "@/pages/portal/court/CourtPetitionerCategoryMaster";
import CourtSubCategoryMaster from "@/pages/portal/court/CourtSubCategoryMaster";
import CourtEnforcementForms from "@/pages/portal/court/CourtEnforcementForms";
import PayrollModule from "@/pages/portal/PayrollModule";
import DesignationMaster from "@/pages/portal/payroll/DesignationMaster";
import QualificationMaster from "@/pages/portal/payroll/QualificationMaster";
import BranchMaster from "@/pages/portal/payroll/BranchMaster";
import BankMaster from "@/pages/portal/payroll/BankMaster";
import HouseTypeMaster from "@/pages/portal/payroll/HouseTypeMaster";
import PayBillGroupMaster from "@/pages/portal/payroll/PayBillGroupMaster";
import DAMaster from "@/pages/portal/payroll/DAMaster";
import GroupMaster from "@/pages/portal/payroll/GroupMaster";
import AllowanceMaster from "@/pages/portal/payroll/AllowanceMaster";
import DeductionMaster from "@/pages/portal/payroll/DeductionMaster";
import LeaveMaster from "@/pages/portal/payroll/LeaveMaster";
import GenerateSalary from "@/pages/portal/payroll/GenerateSalary";
import DepartmentalPayBill from "@/pages/portal/payroll/DepartmentalPayBill";
import LICEntry from "@/pages/portal/payroll/LICEntry";
import LICReport from "@/pages/portal/payroll/LICReport";
import SalaryReport from "@/pages/portal/payroll/SalaryReport";
import SalaryGeneratedMaster from "@/pages/portal/payroll/SalaryGeneratedMaster";
import SalarySlip from "@/pages/portal/payroll/SalarySlip";
import EmployeeDetails from "@/pages/portal/payroll/EmployeeDetails";
import FinanceModule from "@/pages/portal/FinanceModule";
import GrievanceModule from "@/pages/portal/GrievanceModule";
import GrievanceSectionMaster from "@/pages/portal/GrievanceSectionMaster";
import GrievanceRoleMaster from "@/pages/portal/GrievanceRoleMaster";
import GrievanceSubjectMaster from "@/pages/portal/GrievanceSubjectMaster";

// Web Master (CMS) — existing admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminOfficials from "@/pages/admin/AdminOfficials";
import AdminNews from "@/pages/admin/AdminNews";
import AdminTenders from "@/pages/admin/AdminTenders";
import AdminWhatsNew from "@/pages/admin/AdminWhatsNew";
import AdminPhotos from "@/pages/admin/AdminPhotos";
import AdminVideos from "@/pages/admin/AdminVideos";
import AdminBanners from "@/pages/admin/AdminBanners";
import AdminMarquee from "@/pages/admin/AdminMarquee";
import AdminSchemes from "@/pages/admin/AdminSchemes";
import AdminBdaOfficers from "@/pages/admin/AdminBdaOfficers";
import AdminBoardMembers from "@/pages/admin/AdminBoardMembers";
import HousingSchemes from "@/pages/achievements/HousingSchemes";
import CommercialSchemes from "@/pages/achievements/CommercialSchemes";
import InvestorsList from "@/pages/achievements/InvestorsList";
import AdminHousingSchemes from "@/pages/admin/AdminHousingSchemes";
import AdminInvestorsList from "@/pages/admin/AdminInvestorsList";
import AdminImportantLinks from "@/pages/admin/AdminImportantLinks";
import AITools from "@/pages/portal/AITools";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* ── PORTAL: all routes listed individually (no nesting) ── */}
      <Route path="/portal/login" component={AdminLogin} />
      <Route path="/portal" component={PortalHome} />
      <Route path="/portal/users" component={UserManagement} />
      <Route path="/portal/property" component={PropertyModule} />
      <Route path="/portal/maintenance" component={MaintenanceModule} />
      <Route path="/portal/court">{() => <CourtMasterProvider><CourtModule /></CourtMasterProvider>}</Route>
      <Route path="/portal/court/masters/division">{() => <CourtMasterProvider><CourtDivisionMaster /></CourtMasterProvider>}</Route>
      <Route path="/portal/court/masters/district">{() => <CourtMasterProvider><CourtDistrictMaster /></CourtMasterProvider>}</Route>
      <Route path="/portal/court/masters/court-type">{() => <CourtMasterProvider><CourtTypeMaster /></CourtMasterProvider>}</Route>
      <Route path="/portal/court/masters/court">{() => <CourtMasterProvider><CourtCourtMaster /></CourtMasterProvider>}</Route>
      <Route path="/portal/court/masters/case-type">{() => <CourtMasterProvider><CourtCaseTypeMaster /></CourtMasterProvider>}</Route>
      <Route path="/portal/court/masters/case-related">{() => <CourtMasterProvider><CourtAdvocateMaster /></CourtMasterProvider>}</Route>
      <Route path="/portal/court/masters/petitioner-category">{() => <CourtMasterProvider><CourtPetitionerCategoryMaster /></CourtMasterProvider>}</Route>
      <Route path="/portal/court/masters/sub-category">{() => <CourtMasterProvider><CourtSubCategoryMaster /></CourtMasterProvider>}</Route>
      <Route path="/portal/court/freshCase">{() => <CourtMasterProvider><CourtEnforcementForms /></CourtMasterProvider>}</Route>
      <Route path="/portal/payroll" component={PayrollModule} />
      <Route path="/portal/payroll/masters/designations" component={DesignationMaster} />
      <Route path="/portal/payroll/masters/qualifications" component={QualificationMaster} />
      <Route path="/portal/payroll/masters/branches" component={BranchMaster} />
      <Route path="/portal/payroll/masters/banks" component={BankMaster} />
      <Route path="/portal/payroll/masters/house-type" component={HouseTypeMaster} />
      <Route path="/portal/payroll/masters/paybill-group" component={PayBillGroupMaster} />
      <Route path="/portal/payroll/masters/da" component={DAMaster} />
      <Route path="/portal/payroll/masters/group" component={GroupMaster} />
      <Route path="/portal/payroll/masters/allowances" component={AllowanceMaster} />
      <Route path="/portal/payroll/masters/deductions" component={DeductionMaster} />
      <Route path="/portal/payroll/masters/leaves" component={LeaveMaster} />
      <Route path="/portal/payroll/generate-salary" component={GenerateSalary} />
      <Route path="/portal/payroll/dept-pay-bill" component={DepartmentalPayBill} />
      <Route path="/portal/payroll/transaction/lic-entry" component={LICEntry} />
      <Route path="/portal/payroll/reports/salary-report"    component={SalaryReport} />
      <Route path="/portal/payroll/reports/salary-generated" component={SalaryGeneratedMaster} />
      <Route path="/portal/payroll/reports/salary-slip"      component={SalarySlip} />
      <Route path="/portal/payroll/reports/employee-details" component={EmployeeDetails} />
      <Route path="/portal/payroll/reports/lic-report" component={LICReport} />
      <Route path="/portal/finance" component={FinanceModule} />
      <Route path="/portal/grievance" component={GrievanceModule} />
      <Route path="/portal/ai-tools" component={AITools} />
      <Route path="/portal/grievance-admin/sections" component={GrievanceSectionMaster} />
      <Route path="/portal/grievance-admin/roles" component={GrievanceRoleMaster} />
      <Route path="/portal/grievance-admin/subjects" component={GrievanceSubjectMaster} />

      {/* Web Master / CMS */}
      <Route path="/portal/webmaster" component={AdminDashboard} />
      <Route path="/portal/webmaster/banners" component={AdminBanners} />
      <Route path="/portal/webmaster/marquee" component={AdminMarquee} />
      <Route path="/portal/webmaster/officials" component={AdminOfficials} />
      <Route path="/portal/webmaster/news" component={AdminNews} />
      <Route path="/portal/webmaster/tenders" component={AdminTenders} />
      <Route path="/portal/webmaster/whats-new" component={AdminWhatsNew} />
      <Route path="/portal/webmaster/photos" component={AdminPhotos} />
      <Route path="/portal/webmaster/videos" component={AdminVideos} />
      <Route path="/portal/webmaster/schemes" component={AdminSchemes} />
      <Route path="/portal/webmaster/bda-officers" component={AdminBdaOfficers} />
      <Route path="/portal/webmaster/board-members" component={AdminBoardMembers} />
      <Route path="/portal/webmaster/housing-schemes" component={AdminHousingSchemes} />
      <Route path="/portal/webmaster/investors-list" component={AdminInvestorsList} />
      <Route path="/portal/webmaster/important-links" component={AdminImportantLinks} />

      {/* Legacy /admin/* → /portal/* redirects */}
      <Route path="/admin/login"><Redirect to="/portal/login" /></Route>
      <Route path="/admin/banners"><Redirect to="/portal/webmaster/banners" /></Route>
      <Route path="/admin/marquee"><Redirect to="/portal/webmaster/marquee" /></Route>
      <Route path="/admin/officials"><Redirect to="/portal/webmaster/officials" /></Route>
      <Route path="/admin/news"><Redirect to="/portal/webmaster/news" /></Route>
      <Route path="/admin/tenders"><Redirect to="/portal/webmaster/tenders" /></Route>
      <Route path="/admin/whats-new"><Redirect to="/portal/webmaster/whats-new" /></Route>
      <Route path="/admin/photos"><Redirect to="/portal/webmaster/photos" /></Route>
      <Route path="/admin/videos"><Redirect to="/portal/webmaster/videos" /></Route>
      <Route path="/admin"><Redirect to="/portal/webmaster" /></Route>

      {/* ── PUBLIC SITE: each route wrapped in Layout ── */}
      <Route path="/">{() => <Layout><Home /></Layout>}</Route>
      <Route path="/about">{() => <Layout><Objectives /></Layout>}</Route>
      <Route path="/about/objectives">{() => <Layout><Objectives /></Layout>}</Route>
      <Route path="/about/bda-officers">{() => <Layout><BdaOfficers /></Layout>}</Route>
      <Route path="/about/board-members">{() => <Layout><BoardMembers /></Layout>}</Route>
      <Route path="/about/geographical-area">{() => <Layout><GeographicalArea /></Layout>}</Route>
      <Route path="/about/organisation-structure">{() => <Layout><OrganisationStructure /></Layout>}</Route>
      <Route path="/achievements/housing-schemes">{() => <Layout><HousingSchemes /></Layout>}</Route>
      <Route path="/achievements/commercial-schemes">{() => <Layout><CommercialSchemes /></Layout>}</Route>
      <Route path="/achievements/investors-list">{() => <Layout><InvestorsList /></Layout>}</Route>
      <Route path="/schemes">{() => <Layout><Schemes /></Layout>}</Route>
      <Route path="/achievements">{() => <Layout><Achievements /></Layout>}</Route>
      <Route path="/rules-acts">{() => <Layout><RulesActs /></Layout>}</Route>
      <Route path="/media">{() => <Layout><Media /></Layout>}</Route>
      <Route path="/contact">{() => <Layout><Contact /></Layout>}</Route>
      <Route path="/raise-query">{() => <Layout><RaiseQuery /></Layout>}</Route>
      <Route path="/new-registration">{() => <Layout><NewRegistration /></Layout>}</Route>

      {/* Fallback */}
      <Route>{() => <Layout><NotFound /></Layout>}</Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
