import { Router } from 'express';
import * as adminController from '../controllers/admin';
import asyncRoute from '../helpers/async';
import { admin, auth } from '../middleware/auth';

const router = Router();

router.get('/catalog', asyncRoute(adminController.listCatalog));
router.use(auth, admin);
router.get('/users', asyncRoute(adminController.listUsers));
router.put('/users/:id', asyncRoute(adminController.updateUser));
router.post('/catalog', asyncRoute(adminController.saveCatalog));
router.put('/catalog/:id', asyncRoute(adminController.saveCatalog));
router.delete('/catalog/:id', asyncRoute(adminController.deleteCatalog));

export default router;
