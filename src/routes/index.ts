import { Router} from 'express';
import { apiRoute } from './api';

export const defaultRoute = Router();

defaultRoute.use('/api', apiRoute);