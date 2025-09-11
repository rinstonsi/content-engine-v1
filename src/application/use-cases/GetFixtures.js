import { FixtureService } from '../ports/inbound/FixtureService.js';

/**
 * GetFixtures use case - orchestrates fixture retrieval via outbound port
 */
export class GetFixtures extends FixtureService {
  /**
   * @param {import('../ports/outbound/SportsDataProvider.js').SportsDataProvider} sportsDataProvider
   */
  constructor(sportsDataProvider) {
    super();
    this.sportsDataProvider = sportsDataProvider;
  }

  /**
   * @param {{ sport: number|string, league?: number|string, timezone?: string, language?: string, gamestate?: number|string }} params
   */
  async getFixtures(params) {
    return this.sportsDataProvider.fetchFixtures(params);
  }
}
