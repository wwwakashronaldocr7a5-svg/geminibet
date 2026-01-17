
export enum SportType {
  Soccer = 'Soccer',
  Basketball = 'Basketball',
  Tennis = 'Tennis',
  Esports = 'Esports',
  Cricket = 'Cricket',
  UFC = 'UFC'
}

export type BetStatus = 'PENDING' | 'WON' | 'LOST';

export type OddsFormat = 'Decimal' | 'Fractional' | 'American';

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  oddsFormat: OddsFormat;
  language: string;
  memberSince: string;
  isAdmin?: boolean;
}

export interface UserAccount extends UserProfile {
  id: string;
  balance: number;
  status: 'ACTIVE' | 'SUSPENDED';
  isVerified: boolean;
  totalBets: number;
  payoutLimit: number; // Maximum amount a user can withdraw in a single request
}

export interface Match {
  id: string;
  sport: SportType;
  league: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  status: 'LIVE' | 'UPCOMING';
  score?: {
    home: number;
    away: number;
  };
  odds: {
    homeWin: number;
    draw?: number;
    awayWin: number;
  };
}

export interface BetSelection {
  matchId: string;
  selection: '1' | 'X' | '2';
  odd: number;
  homeTeam: string;
  awayTeam: string;
  sport?: SportType;
}

export interface BetHistoryItem {
  id: string;
  selections: BetSelection[];
  totalStake: number;
  totalOdds: number;
  potentialPayout: number;
  status: BetStatus;
  placedAt: Date;
}

export interface AdminStats {
  totalVolume: number;
  grossProfit: number;
  totalPayouts: number;
  netRevenue: number;
  activeUsers: number;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: string;
  upiId?: string;
  requestedAt: Date;
  processedAt?: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes?: string;
}
