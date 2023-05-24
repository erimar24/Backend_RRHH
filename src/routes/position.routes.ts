import { Router } from 'express';
import * as controller from "../controllers/position";
import { isAuth } from "../middlewares/isAuth";

const router = Router();

router.route("/all").get(controller.all);
router.route("/single/:id").get(controller.single);
router.route("/create").post(controller.create);
router.route("/update/:id").put(controller.update);
router.route("/deactivate/:id").put(controller.deactivate);

export default router;