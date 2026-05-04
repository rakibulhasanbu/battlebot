export const SCHEMA = `
CREATE TABLE IF NOT EXISTS robots (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  weapon_type TEXT NOT NULL DEFAULT 'other',
  weight_class TEXT NOT NULL DEFAULT 'heavyweight',
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  team TEXT NOT NULL DEFAULT 'Unknown',
  image_url TEXT NOT NULL DEFAULT '',
  seasons TEXT NOT NULL DEFAULT '',
  scraped_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS fights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  robot_slug TEXT NOT NULL,
  opponent_slug TEXT NOT NULL,
  opponent_name TEXT NOT NULL DEFAULT '',
  result TEXT NOT NULL CHECK(result IN ('win','loss','draw')),
  season TEXT NOT NULL DEFAULT '',
  method TEXT NOT NULL DEFAULT '',
  scraped_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (robot_slug) REFERENCES robots(slug)
);

CREATE TABLE IF NOT EXISTS reddit_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  num_comments INTEGER NOT NULL DEFAULT 0,
  robot_mentions TEXT NOT NULL DEFAULT '',
  sentiment REAL NOT NULL DEFAULT 0,
  url TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '',
  scraped_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS youtube_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  robot_slug TEXT NOT NULL,
  video_url TEXT NOT NULL DEFAULT '',
  video_title TEXT NOT NULL DEFAULT '',
  comment_text TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  sentiment REAL NOT NULL DEFAULT 0,
  scraped_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS predictions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  robot_a_slug TEXT NOT NULL,
  robot_b_slug TEXT NOT NULL,
  prediction_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(robot_a_slug, robot_b_slug)
);

CREATE INDEX IF NOT EXISTS idx_fights_robot ON fights(robot_slug);
CREATE INDEX IF NOT EXISTS idx_reddit_scraped ON reddit_posts(scraped_at);
CREATE INDEX IF NOT EXISTS idx_youtube_robot ON youtube_comments(robot_slug);
CREATE INDEX IF NOT EXISTS idx_predictions_slugs ON predictions(robot_a_slug, robot_b_slug);
`;
