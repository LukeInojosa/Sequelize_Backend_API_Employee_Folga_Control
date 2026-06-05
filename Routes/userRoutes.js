import {Router} from 'express';
import { userController } from '../Controlers/index.js';

const router = Router();

router
    .post('/user', userController.createUser)
    .get('/user', userController.getAllUsers)

export default router