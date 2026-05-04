import { getDb } from './client';
import { upsertRobot } from './queries';

const SEED_ROBOTS = [
  { slug: 'tombstone', name: 'Tombstone', weapon_type: 'horizontal-spinner' as const, wins: 26, losses: 10, team: 'Ray Billings', image_url: '/robots/tombstone.jpg', seasons: 'I-VII' },
  { slug: 'witch-doctor', name: 'Witch Doctor', weapon_type: 'vertical-spinner' as const, wins: 22, losses: 12, team: 'Witch Doctor Team', image_url: '/robots/witch-doctor.jpg', seasons: 'II-VII' },
  { slug: 'bite-force', name: 'Bite Force', weapon_type: 'vertical-spinner' as const, wins: 28, losses: 6, team: 'Paul Ventimiglia', image_url: '/robots/bite-force.jpg', seasons: 'I-VI' },
  { slug: 'end-game', name: 'End Game', weapon_type: 'vertical-spinner' as const, wins: 24, losses: 8, team: 'Jack Barker', image_url: '/robots/end-game.jpg', seasons: 'IV-VII' },
  { slug: 'hydra', name: 'Hydra', weapon_type: 'flipper' as const, wins: 20, losses: 10, team: 'Jake Ewert', image_url: '/robots/hydra.jpg', seasons: 'IV-VII' },
  { slug: 'whiplash', name: 'Whiplash', weapon_type: 'vertical-spinner' as const, wins: 21, losses: 9, team: 'Matt Vasquez', image_url: '/robots/whiplash.jpg', seasons: 'III-VII' },
  { slug: 'ribbot', name: 'Ribbot', weapon_type: 'vertical-spinner' as const, wins: 16, losses: 10, team: 'David Jin', image_url: '/robots/ribbot.jpg', seasons: 'V-VII' },
  { slug: 'sawblaze', name: 'SawBlaze', weapon_type: 'hammer' as const, wins: 18, losses: 12, team: 'Jamison Go', image_url: '/robots/sawblaze.jpg', seasons: 'II-VII' },
  { slug: 'hypershock', name: 'HyperShock', weapon_type: 'vertical-spinner' as const, wins: 17, losses: 13, team: 'Will Bales', image_url: '/robots/hypershock.jpg', seasons: 'I-VII' },
  { slug: 'huge', name: 'HUGE', weapon_type: 'vertical-spinner' as const, wins: 15, losses: 9, team: 'Jonathan Schultz', image_url: '/robots/huge.jpg', seasons: 'III-VII' },
  { slug: 'lucky', name: 'Lucky', weapon_type: 'flipper' as const, wins: 14, losses: 10, team: 'Lucky Robotics', image_url: '/robots/lucky.jpg', seasons: 'III-VII' },
  { slug: 'tantrum', name: 'Tantrum', weapon_type: 'vertical-spinner' as const, wins: 19, losses: 9, team: 'Seems Reasonable Robotics', image_url: '/robots/tantrum.jpg', seasons: 'V-VII' },
  { slug: 'valkyrie', name: 'Valkyrie', weapon_type: 'full-body-spinner' as const, wins: 16, losses: 10, team: 'Leanne Cushing', image_url: '/robots/valkyrie.jpg', seasons: 'IV-VII' },
  { slug: 'minotaur', name: 'Minotaur', weapon_type: 'drum-spinner' as const, wins: 25, losses: 9, team: 'Daniel Freitas', image_url: '/robots/minotaur.jpg', seasons: 'II-VII' },
  { slug: 'icewave', name: 'ICEwave', weapon_type: 'horizontal-spinner' as const, wins: 12, losses: 8, team: 'Marc DeVidts', image_url: '/robots/icewave.jpg', seasons: 'I-III' },
  { slug: 'lockjaw', name: 'Lock-Jaw', weapon_type: 'vertical-spinner' as const, wins: 18, losses: 12, team: 'Donald Hutson', image_url: '/robots/lockjaw.jpg', seasons: 'I-VII' },
  { slug: 'beta', name: 'Beta', weapon_type: 'hammer' as const, wins: 10, losses: 10, team: 'John Reid', image_url: '/robots/beta.jpg', seasons: 'III-VII' },
  { slug: 'bloodsport', name: 'Bloodsport', weapon_type: 'horizontal-spinner' as const, wins: 17, losses: 9, team: 'Justin Marple', image_url: '/robots/bloodsport.jpg', seasons: 'IV-VII' },
  { slug: 'captain-shrederator', name: 'Captain Shrederator', weapon_type: 'full-body-spinner' as const, wins: 10, losses: 14, team: 'Brian Nave', image_url: '/robots/captain-shrederator.jpg', seasons: 'I-VII' },
  { slug: 'rotator', name: 'Rotator', weapon_type: 'horizontal-spinner' as const, wins: 16, losses: 10, team: 'Victor Soto', image_url: '/robots/rotator.jpg', seasons: 'III-VII' },
];

export function seedDatabase(): void {
  const db = getDb();
  const count = (db.prepare('SELECT COUNT(*) as c FROM robots').get() as { c: number }).c;
  if (count === 0) {
    for (const robot of SEED_ROBOTS) {
      upsertRobot({ ...robot, weight_class: 'heavyweight', image_url: '' });
    }
  } else {
    // clear any local image paths that can't be served
    db.prepare(
      `UPDATE robots SET image_url = '' WHERE image_url LIKE '/robots/%'`
    ).run();
  }
}
