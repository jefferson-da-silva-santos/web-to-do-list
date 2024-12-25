import { Router } from "express";
import { insertUser, selectAllColumnsUsers, selectAllUsers } from "../controller/userController.js";


const router = Router();

router.get('/all', selectAllUsers);
router.get('/all/:columns', selectAllColumnsUsers);
router.post('/insert', insertUser);

export default router;