/**
 * FixtureService interface - Inbound port
 * Defines the contract for retrieving fixtures through the application layer
 */
export class FixtureService {
  /**
   * Get fixtures using the configured sports data provider(s)
   * @param {{ sport: number|string, league?: number|string, timezone?: string, language?: string, gamestate?: number|string }} _params
   * @returns {Promise<Array<Object>>}
   */
  async getFixtures(_params) {
    throw new Error('Method getFixtures() must be implemented');
  }
}
