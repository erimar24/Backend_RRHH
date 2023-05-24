import { Router } from 'express';
import * as controller from "../controllers/evaluation";
import { isAuth } from '../middlewares/isAuth';

const router = Router();

router.route("/all/:id").get(isAuth, controller.all);
router.route("/add").post(controller.addCandidate);
router.route("/single/:id").get(isAuth, controller.single);
router.route("/add/:id").put(isAuth, controller.addEvaluation)
router.route("/deactivate/:id").put(isAuth, controller.deactivate)
router.route("/report/:id").get(isAuth, controller.report);

export default router;