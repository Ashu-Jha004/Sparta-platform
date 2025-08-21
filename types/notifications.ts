// types/notifications.ts
export interface Notification {
  id: string;
  title: string;
  message: string;
  type:
    | "match_request"
    | "achievement"
    | "system"
    | "challenge"
    | "payment"
    | "rank_update";
  timestamp: Date;
  read: boolean;
  userId: string;
  actionUrl?: string;
  metadata?: {
    challengerId?: string;
    matchId?: string;
    amount?: number;
    rank?: string;
  };
}

export type NotificationType = Notification["type"];
