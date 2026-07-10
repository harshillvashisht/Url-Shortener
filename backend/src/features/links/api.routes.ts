import { Router } from 'express';
import { createLink, getlinks , deleteLink } from './controller.js';

const apilinksroute = Router();

apilinksroute.post('/links' , createLink);
apilinksroute.get('/links' , getlinks);
apilinksroute.delete('/links/:id', deleteLink);



export default apilinksroute;