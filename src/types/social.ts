export interface RedditPost {
  id: number;
  title: string;
  score: number;
  num_comments: number;
  robot_mentions: string;
  sentiment: number;
  url: string;
  author: string;
  scraped_at: string;
}

export interface YouTubeComment {
  id: number;
  robot_slug: string;
  video_url: string;
  video_title: string;
  comment_text: string;
  likes: number;
  sentiment: number;
  scraped_at: string;
}

export interface SocialData {
  redditMentions7d: number;
  avgRedditSentiment: number;
  totalYoutubeLikes: number;
  youtubeCommentCount: number;
  foughtRecently: boolean;
  topRedditPosts: RedditPost[];
  topYoutubeComments: YouTubeComment[];
}
