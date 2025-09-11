/**
 * SportsDataProvider interface - Outbound port
 * Defines the contract for fetching sports data from external providers
 */
export class SportsDataProvider {
  /**
   * Fetch fixtures from the external sports data provider
   * @param {{ sport: number|string, league?: number|string, timezone?: string, language?: string, gamestate?: number|string }} _params
   * @returns {Promise<Array<Object>>} Unified Fixture array
   */
  async fetchFixtures(_params) {
    throw new Error('Method fetchFixtures() must be implemented');
  }
}
