export type WeaponType =
  | 'full-body-spinner'
  | 'vertical-spinner'
  | 'horizontal-spinner'
  | 'drum-spinner'
  | 'flipper'
  | 'hammer'
  | 'thwackbot'
  | 'wedge'
  | 'clamper'
  | 'other';

export type WeightClass = 'heavyweight' | 'middleweight' | 'lightweight' | 'antweight';

export interface Robot {
  slug: string;
  name: string;
  weapon_type: WeaponType;
  weight_class: WeightClass;
  wins: number;
  losses: number;
  team: string;
  image_url: string;
  seasons: string;
  scraped_at: string;
}

export interface Fight {
  id: number;
  robot_slug: string;
  opponent_slug: string;
  opponent_name: string;
  result: 'win' | 'loss' | 'draw';
  season: string;
  method: string;
  scraped_at: string;
}

export interface RobotWithStats extends Robot {
  win_rate: number;
  hype_score: number;
  fights: Fight[];
}
