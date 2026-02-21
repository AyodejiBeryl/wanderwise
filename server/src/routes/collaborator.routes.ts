import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  inviteCollaborator,
  getCollaborators,
  removeCollaborator,
  getSharedTrips,
} from '../controllers/collaborator.controller.js';

const router = Router();
router.use(authenticate);

// GET /api/collaborators/shared - Get trips shared with me
router.get('/shared', getSharedTrips);

// POST /api/collaborators/:tripId/invite - Invite a collaborator
router.post('/:tripId/invite', inviteCollaborator);

// GET /api/collaborators/:tripId - Get collaborators for a trip
router.get('/:tripId', getCollaborators);

// DELETE /api/collaborators/:tripId/:collaboratorId - Remove a collaborator
router.delete('/:tripId/:collaboratorId', removeCollaborator);

export default router;
