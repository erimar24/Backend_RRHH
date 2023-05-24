import { Router } from 'express';
import * as controller from "../controllers/vacant";
import { isAuth } from '../middlewares/isAuth';

const router = Router();

router.route('/all').get(isAuth, controller.all);
router.route("/single/:id").get(isAuth, controller.single);
router.route("/create").post(isAuth, controller.create);
router.route("/update/:id").put(isAuth, controller.update); 
router.route("/deactivate/:id").put(isAuth, controller.deactivate);


export default router;