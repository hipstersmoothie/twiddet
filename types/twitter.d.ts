import { TreeNode } from 'react-treeview';

export interface Url {
  url: string;
  expanded_url: string;
  display_url: string;
  indices: number[];
}

export interface UrlList {
  urls: Url[];
}

export interface VanityUrl {
  type: string;
  string_value: string;
  scribe_key: string;
}

export interface ImageValue {
  url: string;
  width: number;
  height: number;
}

export interface ThumbnailImage {
  type: string;
  image_value: ImageValue;
}

export interface Rgb {
  red: number;
  green: number;
  blue: number;
}

export interface Palette {
  percentage: number;
  rgb: Rgb;
}

export interface ImageColorValue {
  palette: Palette[];
}

export interface ThumbnailImageColor {
  type: string;
  image_color_value: ImageColorValue;
}

export interface BindingValues {
  vanity_url: VanityUrl;
  domain: VanityUrl;
  title: VanityUrl;
  description: VanityUrl;
  thumbnail_image_small: ThumbnailImage;
  thumbnail_image: ThumbnailImage;
  thumbnail_image_large: ThumbnailImage;
  thumbnail_image_x_large: ThumbnailImage;
  thumbnail_image_color: ThumbnailImageColor;
  thumbnail_image_original: ThumbnailImage;
  card_url: VanityUrl;
}

export interface Device {
  name: string;
  version: string;
}

export interface Audience {
  name: string;
}

export interface Platform {
  device: Device;
  audience: Audience;
}

export interface CardPlatform {
  platform: Platform;
}

export interface Card {
  name: string;
  url: string;
  card_type_url: string;
  binding_values: BindingValues;
  card_platform: CardPlatform;
}

export interface SelfThread {
  id_str: string;
}

export interface Tweet {
  created_at: string;
  id_str: string;
  full_text: string;
  display_text_range: number[];
  entities: UrlList;
  source: string;
  in_reply_to_status_id_str: string;
  in_reply_to_user_id_str: string;
  in_reply_to_screen_name: string;
  user_id_str: string;
  retweet_count: number;
  favorite_count: number;
  reply_count: number;
  conversation_id_str: string;
  possibly_sensitive_editable: boolean;
  card: Card;
  lang: string;
  self_thread: SelfThread;
  user: User;
}

export interface UrlMap {
  urls: Url[];
}

export interface Description {}

export interface Entities {
  url: UrlMap;
  description: Description;
}

export interface ProfileImageExtensionsMediaColor {
  palette: Palette[];
}

export interface R {
  missing?: any;
}

export interface MediaStats {
  r: R;
  ttl: number;
}

export interface ProfileImageExtensions {
  mediaStats: MediaStats;
}

export interface User {
  id_str: string;
  name: string;
  screen_name: string;
  location: string;
  description: string;
  url: string;
  entities: Entities;
  followers_count: number;
  fast_followers_count: number;
  normal_followers_count: number;
  friends_count: number;
  listed_count: number;
  created_at: string;
  favourites_count: number;
  statuses_count: number;
  media_count: number;
  lang: string;
  profile_image_url_https: string;
  profile_banner_url: string;
  profile_image_extensions_media_availability?: any;
  profile_image_extensions_alt_text?: any;
  profile_image_extensions_media_color: ProfileImageExtensionsMediaColor;
  profile_image_extensions: ProfileImageExtensions;
  profile_banner_extensions_media_availability?: any;
  profile_banner_extensions_alt_text?: any;
  profile_banner_extensions_media_color: ProfileImageExtensionsMediaColor;
  profile_banner_extensions: ProfileImageExtensions;
  profile_link_color: string;
  pinned_tweet_ids: number[];
  pinned_tweet_ids_str: string[];
  has_custom_timelines: boolean;
  profile_interstitial_type: string;
  business_profile_state: string;
  translator_type: string;
}

export interface TweetReference {
  tweet: {
    id: string;
    displayType: 'SelfThread' | 'Tweet';
  };
}

export interface ConversationComponent {
  conversationTweetComponent: TweetReference;
}

export interface ConversationThread {
  conversationThread: {
    conversationComponents: ConversationComponent[];
  };
}

export interface Operation {
  operation: {
    cursor: {
      value: string;
      cursorType: 'Bottom';
    };
  };
}

export type ConversationContent = TweetReference | ConversationThread;

export interface DataEntry {
  item: {
    content: ConversationContent;
  };
}

export interface ConversationEntry {
  entryId: string;
  sortIndex: string;
  content: DataEntry | Operation;
}

export interface Instruction {
  addEntries: {
    entries: ConversationEntry[];
  };
}

export interface TweetMap {
  [index: string]: Tweet;
}

export interface UserMap {
  [index: string]: User;
}

export interface GlobalObjects {
  tweets: TweetMap;
  users: UserMap;
}

export interface Conversation {
  globalObjects: GlobalObjects;
  timeline: {
    instructions: Instruction[];
  };
}

export type TweetTree = TreeNode<Tweet>;
