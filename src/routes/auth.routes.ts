import { Router } from 'express';
import * as controller from "../controllers/authentication"

const router: Router = Router();

router.route("/signin").post(controller.signIn);

export default router;

