import express from 'express';

/**
 * Creates page-data routes for WMAC -> CE integration
 * @param {import('../PageDataController.js').PageDataController} controller
 */
export function createPageDataRoutes(controller) {
  const router = express.Router();
  router.post('/content-engine/v1/page-data', (req, res) =>
    controller.postPageData(req, res)
  );
  return router;
}
