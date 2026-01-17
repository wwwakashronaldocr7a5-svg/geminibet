
import { Match, SportType } from "../types";

/**
 * Enhanced service to simulate real-time data updates.
 * Includes sport-specific scoring probabilities and reactive odds adjustments.
 */
export const fetchOddsUpdates = (currentMatches: Match[]): Match[] => {
  return currentMatches.map((match) => {
    if (match.status !== 'LIVE') return match;

    const updatedMatch = { ...match };
    let scoreChanged = false;
    let scoringTeam: 'home' | 'away' | null = null;

    // 1. Determine scoring probability based on sport
    let scoringProb = 0.02; // Default (Soccer/UFC)
    if (match.sport === SportType.Basketball) scoringProb = 0.45;
    if (match.sport === SportType.Tennis) scoringProb = 0.25;
    if (match.sport === SportType.Esports) scoringProb = 0.15;
    if (match.sport === SportType.Cricket) scoringProb = 0.30;

    // 2. Simulate Score Change
    if (Math.random() < scoringProb) {
      const scoreUpdate = { ...(match.score || { home: 0, away: 0 }) };
      scoringTeam = Math.random() > 0.5 ? 'home' : 'away';
      
      if (match.sport === SportType.Basketball) {
        scoreUpdate[scoringTeam] += (Math.random() > 0.7 ? 3 : 2);
      } else if (match.sport === SportType.Cricket) {
        scoreUpdate[scoringTeam] += (Math.random() > 0.8 ? 6 : Math.random() > 0.5 ? 4 : 1);
      } else {
        scoreUpdate[scoringTeam] += 1;
      }
      
      updatedMatch.score = scoreUpdate;
      scoreChanged = true;
    }

    // 3. Update Odds
    const currentOdds = { ...match.odds };

    // Function to calculate a realistic swing
    // Percentage-based movement feels more natural than flat addition
    const getSwing = (val: number, isWinner: boolean, isLoser: boolean) => {
      let multiplier = 1 + (Math.random() * 0.04 - 0.02); // Normal 2% drift
      
      if (scoreChanged) {
        if (isWinner) multiplier *= 0.85; // Favorite odd drops if they score
        if (isLoser) multiplier *= 1.25;  // Underdog odd spikes if opponent scores
      }

      return Math.max(1.01, parseFloat((val * multiplier).toFixed(2)));
    };

    updatedMatch.odds = {
      homeWin: getSwing(currentOdds.homeWin, scoringTeam === 'home', scoringTeam === 'away'),
      awayWin: getSwing(currentOdds.awayWin, scoringTeam === 'away', scoringTeam === 'home'),
      draw: currentOdds.draw ? getSwing(currentOdds.draw, false, scoreChanged) : undefined,
    };

    // 4. Update Game Clock / Start Time (Simulation of time passing)
    if (match.startTime.includes("'")) {
      const matchMinute = parseInt(match.startTime.match(/\d+/)?.[0] || "0");
      if (matchMinute < 90) {
        updatedMatch.startTime = `LIVE ${matchMinute + 1}'`;
      } else {
        updatedMatch.startTime = "LIVE 90+'";
      }
    }

    return updatedMatch;
  });
};
