import { FriendshipStatus } from "../resources/User";

export interface CarouselMedia {
  key: string;
  image: string;
}

export interface FeedUser {
  id: number;
  username: string;
  profilePictureUrl: string | null;
  friendshipStatus: FriendshipStatus;
  isVerified: boolean;
}

export interface FeedCaption {
  text: string | null;
}

export interface Feed {
  id: number;
  location: {
    name: string;
    shortName: string;
  };
  posted: string;

  caption: FeedCaption;

  carouselMedia?: Array<CarouselMedia>;
  carouselMediaCount?: number;

  key?: string;

  image?: string;

  reactionsCount: number;
  commentsCount: number;

  emojiLineReactions?: Array<{
    key: string;
    emoji: string;
  }>;

  comments: Array<{
    childCommentCount: number | null;
    commentLikeCount: number;
    text: string;
    user: FeedUser;
    hasLikedComment: boolean;

    createdAt: Date;
  }>;

  hasReacted: boolean;
  reaction?: {
    emoji: string;
    key: string;
  };

  user: FeedUser;

  isSeen: boolean; // Indica se la storia è stata vista dall'utente

  productType: "feed" | "carousel" | null;
}
