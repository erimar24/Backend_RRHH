import { Router } from 'express';
import * as controller from "../controllers/candidate";
import { isAuth } from "../middlewares/isAuth";
import { upload } from '../middlewares/upload';

const router = Router();

router.route("/all").get(isAuth, controller.all);
router.route("/allByPosition/:id").get(isAuth, controller.allByPosition);
router.route("/single/:id").get(isAuth, controller.single);
router.route("/create").post(isAuth, upload, controller.create);
router.route("/update/:id").put(isAuth, upload, controller.update);
router.route("/deactivate/:id").put(isAuth, controller.deactivate);

export default router;