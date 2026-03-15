/**
 * Follow-up types (star booking follow-ups).
 */

export type FollowUpRow = {
  _id: string;
  category: "4-5" | "3";
  time: string;
  guestName: string;
  phone: string;
  followUpDate?: string | null;
  followUpNote?: string | null;
  followUpSent?: boolean;
};
