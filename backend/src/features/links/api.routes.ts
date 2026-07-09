import { Router } from 'express';
import { createLink } from './controller.js';

const apilinksroute = Router();

apilinksroute.post('/links' , createLink);



export default apilinksroute;