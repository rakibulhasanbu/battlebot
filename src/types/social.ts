export interface YoutubeVideo {
  video_id: string;
  url: string;
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  channel: string;
  channel_url: string;
  duration_s: number;
  date_posted: string;
}

export interface RedditPost {
  post_id: string;
  url: string;
  title: string;
  upvotes: number;
  comments: number;
  author: string;
  community: string;
  date_posted: string;
}

export interface SocialData {
  redditMentions7d: number;
  avgRedditSentiment: number;
  totalYoutubeLikes: number;
  youtubeCommentCount: number;
  foughtRecently: boolean;
  topRedditPosts: RedditPost[];
  topYoutubeVideos: YoutubeVideo[];
}
