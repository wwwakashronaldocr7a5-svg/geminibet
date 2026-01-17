
import React from 'react';
import { 
  Trophy, 
  Dribbble, 
  Gamepad2, 
  Activity, 
  Sword, 
  Target 
} from 'lucide-react';
import { SportType, Match } from './types';

export const SPORTS_CONFIG = [
  { id: SportType.Soccer, icon: <Trophy className="w-5 h-5" />, label: 'Soccer' },
  { id: SportType.Basketball, icon: <Dribbble className="w-5 h-5" />, label: 'Basketball' },
  { id: SportType.Esports, icon: <Gamepad2 className="w-5 h-5" />, label: 'Esports' },
  { id: SportType.Tennis, icon: <Activity className="w-5 h-5" />, label: 'Tennis' },
  { id: SportType.UFC, icon: <Sword className="w-5 h-5" />, label: 'UFC' },
  { id: SportType.Cricket, icon: <Target className="w-5 h-5" />, label: 'Cricket' },
];

export const MOCK_MATCHES: Match[] = [
  {
    id: 'm1',
    sport: SportType.Soccer,
    league: 'Premier League',
    homeTeam: 'Arsenal',
    awayTeam: 'Man City',
    startTime: 'LIVE 74\'',
    status: 'LIVE',
    score: { home: 1, away: 1 },
    odds: { homeWin: 3.20, draw: 2.10, awayWin: 1.85 }
  },
  {
    id: 'm2',
    sport: SportType.Soccer,
    league: 'La Liga',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    startTime: 'Today, 21:00',
    status: 'UPCOMING',
    odds: { homeWin: 1.95, draw: 3.40, awayWin: 3.10 }
  },
  {
    id: 'm3',
    sport: SportType.Basketball,
    league: 'NBA',
    homeTeam: 'LA Lakers',
    awayTeam: 'Golden State Warriors',
    startTime: 'LIVE Q3 08:12',
    status: 'LIVE',
    score: { home: 88, away: 92 },
    odds: { homeWin: 2.40, awayWin: 1.55 }
  },
  {
    id: 'm4',
    sport: SportType.Esports,
    league: 'LEC Spring',
    homeTeam: 'G2 Esports',
    awayTeam: 'Fnatic',
    startTime: 'Tomorrow, 18:00',
    status: 'UPCOMING',
    odds: { homeWin: 1.65, awayWin: 2.15 }
  },
  {
    id: 'm5',
    sport: SportType.Soccer,
    league: 'Serie A',
    homeTeam: 'Inter Milan',
    awayTeam: 'Juventus',
    startTime: 'Today, 19:30',
    status: 'UPCOMING',
    odds: { homeWin: 2.10, draw: 3.10, awayWin: 2.80 }
  },
  {
    id: 'm6',
    sport: SportType.Tennis,
    league: 'Wimbledon',
    homeTeam: 'Carlos Alcaraz',
    awayTeam: 'Novak Djokovic',
    startTime: 'LIVE Set 2 4-4',
    status: 'LIVE',
    score: { home: 1, away: 0 },
    odds: { homeWin: 1.75, awayWin: 2.05 }
  }
];
