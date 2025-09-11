/**
 * Transform a Multisport provider item into CE's unified Fixture model
 * @param {any} providerItem
 */
export function toUnifiedFixture(providerItem) {
  const matchId =
    providerItem.MatchID ??
    providerItem.matchId ??
    providerItem.match_id ??
    providerItem.MatchId ??
    providerItem.Id ??
    providerItem.id;
  const sportId =
    providerItem.SportID ??
    providerItem.sportId ??
    providerItem.sport_id ??
    providerItem.SportId ??
    providerItem.sport;
  const leagueId =
    providerItem.LeagueID ??
    providerItem.leagueId ??
    providerItem.league_id ??
    providerItem.LeagueId ??
    providerItem.league;
  const startTimeRaw =
    providerItem.StartTime ??
    providerItem.startTime ??
    providerItem.start_time ??
    providerItem.MatchTime ??
    providerItem.datetime ??
    providerItem.DateTime;
  const gameState =
    providerItem.GameState ??
    providerItem.gameState ??
    providerItem.state ??
    providerItem.Status ??
    providerItem.status;
  const homeName =
    providerItem.HomeTeam ??
    providerItem.homeTeam ??
    providerItem.home_team ??
    providerItem.Home ??
    providerItem.home;
  const awayName =
    providerItem.AwayTeam ??
    providerItem.awayTeam ??
    providerItem.away_team ??
    providerItem.Away ??
    providerItem.away;
  const venue =
    providerItem.Venue ??
    providerItem.venue ??
    providerItem.Stadium ??
    providerItem.stadium;

  let startTime;
  try {
    startTime = new Date(startTimeRaw).toISOString();
  } catch {
    startTime = undefined;
  }

  return {
    id: matchId !== null && matchId !== undefined ? String(matchId) : undefined,
    provider: 'multisport',
    sportId:
      sportId !== null && sportId !== undefined ? String(sportId) : undefined,
    leagueId:
      leagueId !== null && leagueId !== undefined
        ? String(leagueId)
        : undefined,
    startTime,
    status:
      gameState !== null && gameState !== undefined
        ? String(gameState)
        : undefined,
    homeTeam: { id: undefined, name: homeName },
    awayTeam: { id: undefined, name: awayName },
    venue: venue || undefined,
  };
}
