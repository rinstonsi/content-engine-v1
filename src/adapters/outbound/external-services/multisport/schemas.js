import { z } from 'zod';

// Incoming WMAC request schema for Multisport fixtures
export const pageDataRequestSchema = z.object({
  data_source_id: z.literal('si-multisport'),
  content_type: z.literal('fixtures'),
  params: z.object({
    sport: z.union([z.number(), z.string()]),
    league: z.union([z.number(), z.string()]).optional(),
    timezone: z.string().regex(/^-?\d{3,4}$/),
    language: z.string().optional().default('en'),
    gamestate: z.union([z.number(), z.string()]).optional(),
    tournament: z.union([z.number(), z.string()]).optional(),
    client_id: z.string().min(1).optional(),
  }),
});

// Provider payload schemas (approximate; adjust to real payloads as needed)
export const multisportFixtureSchema = z
  .object({
    MatchID: z.union([z.string(), z.number()]),
    SportID: z.union([z.string(), z.number()]).optional(),
    LeagueID: z.union([z.string(), z.number()]).optional(),
    StartTime: z.string(),
    GameState: z.union([z.string(), z.number()]),
    HomeTeam: z.string(),
    AwayTeam: z.string(),
    Venue: z.string().optional(),
  })
  .strip();

export const multisportResponseSchema = z
  .object({ Fixtures: z.array(multisportFixtureSchema) })
  .or(z.array(multisportFixtureSchema));
