export type SubmissionStatus =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Reviewer Assigned"
  | "Awaiting Decision"
  | "Revision Required"
  | "Copyediting"
  | "Production"
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

export interface ReviewAssignment {
  id: string | number;
  article_id: string | number;
  article_title?: string;
  reviewer_name?: string;
  reviewer_institution?: string;
  recommendation?: "accept" | "revision" | "reject" | "";
  comments?: string;
  status: "pending" | "completed";
  created_at: string;
  review_file?: string;
  round?: number;
  article_file_name?: string;
  article_file_url?: string | null;
}

export interface Issue {
  id: string | number;
  volume: string;
  number: string;
  year: number;
  title: string;
  description?: string;
  status: "draft" | "published";
  published_at?: string;
  articlesCount?: number;
}

export interface Article {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  category: string;
  keywords: string[];
  references?: string;
  submittedAt: string;
  publishedAt?: string;
  status: SubmissionStatus;
  doi?: string;
  views?: number;
  downloads?: number;
  issue?: string;
  volume?: string;
  user_id?: number;
  round?: number;
  file_name?: string;
  file_url?: string | null;
  loa_file?: string;
  loa_file_url?: string | null;
  editor_notes?: string;
  review_assignments?: ReviewAssignment[];
  issue_id?: string | number;
  body_text?: string;
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
