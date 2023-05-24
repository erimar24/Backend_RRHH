import { Router } from 'express';
import * as controller from "../controllers/users";
import { isAuth } from "../middlewares/isAuth";

const router: Router = Router();

router.route("/all").get(isAuth, controller.all);
router.route("/single/:id").get(isAuth, controller.single);
router.route("/create").post(controller.create);
router.route("/update/:id").put(isAuth, controller.update);
router.route("/deactivate/:id").put(isAuth, controller.deactivate);

export default router;

