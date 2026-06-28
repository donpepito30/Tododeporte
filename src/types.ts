export interface Team {
  name: string;
  flag: string;
  shortName: string;
  color: string;
  secondaryColor: string;
  lineup: {
    goalkeeper: string;
    defenders: string[];
    midfielders: string[];
    attackers: string[];
    formation: string;
  };
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  time: string;
  stadium: string;
  stage: string;
  hypeText: string;
  imageUrl?: string;
  matchNumber?: number;
  city?: string;
  liveStats?: {
    possessionHome: number;
    possessionAway: number;
    shotsHome: number;
    shotsAway: number;
    foulsHome: number;
    foulsAway: number;
    cornersHome: number;
    cornersAway: number;
    yellowHome: number;
    yellowAway: number;
  };
}

export interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  message: string;
  time: string;
  isUser?: boolean;
}

export interface CommentaryEvent {
  minute: number;
  type: 'goal' | 'card' | 'shot' | 'corner' | 'substitution' | 'info';
  description: string;
  team?: 'home' | 'away';
}
