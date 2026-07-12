import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import officialsRouter from "./officials";
import newsRouter from "./news";
import whatsNewRouter from "./whatsNew";
import photosRouter from "./photos";
import videosRouter from "./videos";
import bannersRouter from "./banners";
import marqueeRouter from "./marquee";
import uploadRouter from "./upload";
import socialRouter from "./social";
import usersRouter from "./users";
import propertiesRouter from "./properties";
import maintenanceRouter from "./maintenance";
import courtCasesRouter from "./courtCases";
import employeesRouter from "./employees";
import payrollRouter from "./payroll";
import salaryHeadsRouter from "./salaryHeads";
import generateSalaryRouter from "./generateSalary";
import financeRouter from "./finance";
import grievancesRouter from "./grievances";
import grievanceMastersRouter from "./grievanceMasters";
import licRouter from "./lic";
import payrollMastersRouter from "./payrollMasters";
import maintenancePropertiesRouter from "./maintenanceProperties";
import maintenanceRatesRouter from "./maintenanceRates";
import maintenanceReceiptsRouter from "./maintenanceReceipts";
import schemesRouter from "./schemes";
import schemeCardsRouter from "./schemeCards";
import { requireAdmin, requireCmsAccess } from "../middleware/auth.js";
import type { Request, Response, NextFunction } from "express";

const router: IRouter = Router();

// Public
router.use(healthRouter);
router.use(authRouter);

// Grievances: must be BEFORE guardWrites — POST /grievances is public (no auth)
router.use(grievancesRouter);
router.use(grievanceMastersRouter);

// CMS: Public GET, protected writes (superadmin | admin | officer/webmaster)
function guardWrites(req: Request, res: Response, next: NextFunction) {
  if (req.method === "GET") return next();
  return requireCmsAccess(req, res, next);
}
router.use(guardWrites, officialsRouter);
router.use(guardWrites, newsRouter);
router.use(guardWrites, whatsNewRouter);
router.use(guardWrites, photosRouter);
router.use(guardWrites, videosRouter);
router.use(guardWrites, bannersRouter);
router.use(guardWrites, marqueeRouter);
router.use(uploadRouter);
router.use(socialRouter);

// Schemes & Surveys: GET public, writes protected
router.use(guardWrites, schemesRouter);
router.use(guardWrites, schemeCardsRouter);

// Maintenance sub-routes (admin only)
router.use(requireAdmin, maintenancePropertiesRouter);
router.use(requireAdmin, maintenanceRatesRouter);
router.use(requireAdmin, maintenanceReceiptsRouter);

// Admin-only module routes
router.use(usersRouter);
router.use(propertiesRouter);
router.use(maintenanceRouter);
router.use(courtCasesRouter);
router.use(employeesRouter);
router.use(payrollRouter);
router.use(salaryHeadsRouter);
router.use(generateSalaryRouter);
router.use(payrollMastersRouter);
router.use(licRouter);
router.use(financeRouter);

export default router;
