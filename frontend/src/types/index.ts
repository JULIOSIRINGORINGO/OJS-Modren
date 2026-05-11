export type SubmissionStatus =
  | "Draft"
  | "Under Review"
  | "Revision Required"
  | "Accepted"
  | "Published"
  | "Rejected";

export type UserRole = "Admin" | "Editor" | "Reviewer" | "Author" | "Reader";

export interface Author {
  id: string;
  name: string;
  email: string;
  institution: string;
  role: UserRole;
  avatarUrl?: string;
  articleCount: number;
  joinedAt: string;
}

export interface Article {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  category: string;
  keywords: string[];
  submittedAt: string;
  publishedAt?: string;
  status: SubmissionStatus;
  doi?: string;
  views?: number;
  downloads?: number;
  issue?: string;
  volume?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
}

export interface JournalStats {
  totalSubmissions: number;
  published: number;
  underReview: number;
  rejected: number;
}
