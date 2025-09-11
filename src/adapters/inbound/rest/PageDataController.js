import { pageDataRequestSchema } from '../../outbound/external-services/multisport/schemas.js';

/**
 * PageDataController - orchestrates WMAC page-data requests
 */
export class PageDataController {
  /**
   * @param {{ fixtureService: import('../../../application/ports/inbound/FixtureService.js').FixtureService }} deps
   */
  constructor({ fixtureService }) {
    this.fixtureService = fixtureService;
  }

  postPageData = async (req, res) => {
    try {
      const body = pageDataRequestSchema.parse(req.body);

      if (
        body.content_type === 'fixtures' &&
        body.data_source_id === 'si-multisport'
      ) {
        const data = await this.fixtureService.getFixtures(body.params);
        return res.status(200).json({ success: true, data });
      }

      return res
        .status(400)
        .json({
          success: false,
          error: 'Unsupported content_type or data_source_id',
        });
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  };
}
