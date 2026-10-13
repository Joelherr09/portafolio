export type PlanTier = 'free' | 'pro' | 'institutional';

export type SiteTeamOption = {
  id: string;
  nombre: string;
  siglas: string | null;
  slug: string | null;
  logo_url: string | null;
};

export type BlockDataMap = {
  matches: Record<string, unknown[]>;
  standings: Record<string, unknown | null>;
  rosters: Record<string, unknown[]>;
  tournaments: Record<string, unknown[]>;
  tournamentTeams: Record<string, unknown[]>;
  news: Record<string, unknown[]>;
  coachpro: Record<string, unknown | null>;
  coachproCobro: Record<string, unknown | null>;
};
