import { mockArticles, mockCategories, mockAuthors } from "./mock-data";
import type { Article, Category } from "@/types";

const API_BASE = "http://localhost:3001/api";

function getHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("auth_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  
  return headers;
}

// Helper fetch wrapper
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_user");
      if (!window.location.pathname.includes("/masuk")) {
        window.location.href = "/masuk";
      }
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// ----------------------------------------
// AUTH API
// ----------------------------------------
export async function login(email: string, password: string) {
  try {
    const data = await request<{ token: string; user: any }>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    sessionStorage.setItem("auth_token", data.token);
    sessionStorage.setItem("auth_user", JSON.stringify(data.user));
    return data;
  } catch (error) {
    // Mock authentication fallback for testing when backend is offline
    if (email && password === "password123") {
      const matchedMock = mockAuthors.find(a => a.email === email);
      if (matchedMock) {
        const mockUser = {
          id: matchedMock.id,
          email: matchedMock.email,
          first_name: matchedMock.name.split(" ")[0],
          last_name: matchedMock.name.split(" ").slice(1).join(" ") || "User",
          institution: matchedMock.institution,
          role: matchedMock.role.toLowerCase(),
        };
        const mockToken = btoa(mockUser.id.toString());
        sessionStorage.setItem("auth_token", mockToken);
        sessionStorage.setItem("auth_user", JSON.stringify(mockUser));
        console.warn("Backend offline: Falling back to Mock Auth.");
        return { token: mockToken, user: mockUser };
      }
    }
    throw error;
  }
}

export async function register(userData: any) {
  try {
    const data = await request<{ token: string; user: any }>("/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    sessionStorage.setItem("auth_token", data.token);
    sessionStorage.setItem("auth_user", JSON.stringify(data.user));
    return data;
  } catch (error) {
    // Fallback: Mock registration for testing
    const mockUser = {
      id: "mock-" + Date.now(),
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name || "User",
      institution: userData.institution,
      role: userData.role || "author",
    };
    const mockToken = btoa(mockUser.id.toString());
    sessionStorage.setItem("auth_token", mockToken);
    sessionStorage.setItem("auth_user", JSON.stringify(mockUser));
    console.warn("Backend offline: Falling back to Mock Register.");
    return { token: mockToken, user: mockUser };
  }
}

export function logout() {
  sessionStorage.removeItem("auth_token");
  sessionStorage.removeItem("auth_user");
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  const userJson = sessionStorage.getItem("auth_user");
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

// ----------------------------------------
// CATEGORIES API
// ----------------------------------------
export async function fetchCategories(): Promise<Category[]> {
  try {
    return await request<Category[]>("/categories");
  } catch (err) {
    console.warn("Using mock categories fallback", err);
    return mockCategories;
  }
}

export async function fetchCategory(slugOrId: string): Promise<{ category: Category; articles: Article[] }> {
  try {
    return await request<{ category: Category; articles: Article[] }>(`/categories/${slugOrId}`);
  } catch (err) {
    console.warn(`Using mock category fallback for ${slugOrId}`, err);
    const category = mockCategories.find((c) => c.slug === slugOrId || c.id === slugOrId);
    if (!category) throw new Error("Kategori tidak ditemukan");
    const articles = mockArticles.filter((a) => a.category === category.name && a.status === "Published");
    return { category, articles };
  }
}

// ----------------------------------------
// ARTICLES API
// ----------------------------------------
export async function fetchArticles(params: { q?: string; category?: string; scope?: string } = {}): Promise<Article[]> {
  try {
    const query = new URLSearchParams();
    if (params.q) query.append("q", params.q);
    if (params.category) query.append("category", params.category);
    if (params.scope) query.append("scope", params.scope);
    
    return await request<Article[]>(`/articles?${query.toString()}`);
  } catch (err: any) {
    if (err.message && (err.message.includes("Failed to fetch") || err.message.includes("fetch failed") || err.message.includes("network error"))) {
      console.warn("Using mock articles fallback", err);
      let list = mockArticles;
      
      if (params.scope === "dashboard") {
        // Return author specific mock articles
        list = mockArticles.filter(a => a.authors.includes("Andi Prasetyo"));
      }
      
      if (params.q) {
        const q = params.q.toLowerCase();
        list = list.filter(a => a.title.toLowerCase().includes(q) || a.abstract.toLowerCase().includes(q));
      }
      
      if (params.category) {
        list = list.filter(a => a.category === params.category);
      }
      
      // Only return published unless scope is dashboard or admin
      if (params.scope !== "dashboard" && params.scope !== "admin") {
        list = list.filter(a => a.status === "Published");
      }
      
      return list;
    }
    throw err;
  }
}

export async function fetchArticle(id: string): Promise<Article> {
  try {
    return await request<Article>(`/articles/${id}`);
  } catch (err: any) {
    // Fall back to mock only if it's a network/connection failure
    if (err.message && (err.message.includes("Failed to fetch") || err.message.includes("fetch failed") || err.message.includes("network error"))) {
      console.warn(`Using mock article fallback for ID ${id}`, err);
      const article = mockArticles.find((a) => a.id === id);
      if (!article) throw new Error("Artikel tidak ditemukan");
      return article;
    }
    // Propagate API response errors (403, 401, 404, etc.)
    throw err;
  }
}

export async function createArticle(articleData: Partial<Article>) {
  return await request<Article>("/articles", {
    method: "POST",
    body: JSON.stringify(articleData),
  });
}

export async function updateArticleStatus(
  id: string,
  status: string,
  notes?: string,
  revision_notes?: string,
  revised_file_name?: string,
  reviewer_ids?: string[],
  issue_id?: string | number,
  file_name?: string,
  loa_file?: string
) {
  return await request<Article>(`/articles/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status, notes, revision_notes, revised_file_name, reviewer_ids, issue_id, file_name, loa_file }),
  });
}

// Upload real file to backend storage
export async function uploadArticleFile(
  articleId: string,
  file: File,
  fileType: 'final' | 'loa' | 'copyedit'
): Promise<{ success: boolean; filename: string; url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('file_type', fileType);

  const token = typeof window !== "undefined" ? sessionStorage.getItem("auth_token") : null;
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}/articles/${articleId}/upload_file`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Upload failed: ${response.status}`);
  }

  return response.json();
}

export async function updateArticle(id: string, articleData: Partial<Article>) {
  return await request<Article>(`/articles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(articleData),
  });
}

// ----------------------------------------
// REVIEW ASSIGNMENTS API
// ----------------------------------------
export async function fetchReviewAssignments(): Promise<any[]> {
  try {
    return await request<any[]>("/review_assignments");
  } catch (err) {
    console.warn("Using mock review assignments", err);
    return [];
  }
}

export async function fetchReviewAssignment(id: string | number): Promise<any> {
  return await request<any>(`/review_assignments/${id}`);
}

export async function updateReviewAssignment(id: string | number, data: { recommendation: string; comments: string; review_file?: string }) {
  return await request<any>(`/review_assignments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ----------------------------------------
// ISSUES API
// ----------------------------------------
export async function fetchIssues(): Promise<any[]> {
  try {
    return await request<any[]>("/issues");
  } catch (err) {
    console.warn("Using mock issues", err);
    return [];
  }
}

export async function fetchIssue(id: string | number): Promise<any> {
  return await request<any>(`/issues/${id}`);
}

export async function createIssue(data: any) {
  return await request<any>("/issues", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateIssue(id: string | number, data: any) {
  return await request<any>(`/issues/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteIssue(id: string | number) {
  return await request<any>(`/issues/${id}`, {
    method: "DELETE",
  });
}

export async function publishIssue(id: string | number) {
  return await request<any>(`/issues/${id}/publish`, {
    method: "POST",
  });
}

export async function trackArticleView(id: string) {
  try {
    return await request<{ success: boolean; views: number }>(`/articles/${id}/view`, { method: "POST" });
  } catch {
    return { success: false, views: 0 };
  }
}

export async function trackArticleDownload(id: string) {
  try {
    return await request<{ success: boolean; downloads: number }>(`/articles/${id}/download`, { method: "POST" });
  } catch {
    return { success: false, downloads: 0 };
  }
}

// ----------------------------------------
// BOOKMARKS API
// ----------------------------------------
export async function fetchBookmarks(): Promise<any[]> {
  try {
    return await request<any[]>("/bookmarks");
  } catch (err) {
    console.warn("Using mock bookmarks fallback", err);
    // Andi Prasetyo has one bookmark by default (article 3)
    const b3 = mockArticles.find(a => a.id === "3");
    return b3 ? [{ id: "mock-b1", article: b3 }] : [];
  }
}

export async function addBookmark(articleId: string) {
  try {
    return await request<any>("/bookmarks", {
      method: "POST",
      body: JSON.stringify({ article_id: articleId }),
    });
  } catch (err) {
    console.warn("Mock bookmark add");
    const article = mockArticles.find(a => a.id === articleId);
    return { success: true, id: "mock-" + Date.now(), article };
  }
}

export async function removeBookmark(bookmarkIdOrArticleId: string) {
  try {
    return await request<any>(`/bookmarks/${bookmarkIdOrArticleId}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.warn("Mock bookmark delete");
    return { success: true };
  }
}

// ----------------------------------------
// MESSAGES API
// ----------------------------------------
export async function fetchMessages(): Promise<{ received: any[]; sent: any[] }> {
  try {
    return await request<{ received: any[]; sent: any[] }>("/messages");
  } catch (err) {
    console.warn("Using mock messages fallback", err);
    return {
      received: [
        {
          id: "1",
          sender: { name: "Prof. Hendra Wijaya", email: "hendra@ugm.ac.id" },
          subject: "Revisi Naskah: AI yang Dapat Dijelaskan",
          body: "Halo Andi, naskah Anda tentang 'AI yang Dapat Dijelaskan dalam Penilaian Risiko Kredit' memerlukan beberapa revisi minor pada bagian metode evaluasi. Silakan unggah revisi sebelum akhir minggu ini.",
          read: false,
          createdAt: "2025-04-19 09:12:00"
        }
      ],
      sent: [
        {
          id: "2",
          receiver: { name: "Prof. Hendra Wijaya", email: "hendra@ugm.ac.id" },
          subject: "Pertanyaan mengenai Format Tabel",
          body: "Terima kasih Prof. Hendra atas masukannya. Saya ingin menanyakan apakah format tabel pada halaman 4 sudah sesuai dengan panduan atau harus disesuaikan kembali?",
          read: true,
          createdAt: "2025-04-19 14:30:00"
        }
      ]
    };
  }
}

export async function sendMessage(data: { receiver_email?: string; receiver_id?: string; subject: string; body: string }) {
  return await request<any>("/messages", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ----------------------------------------
// USERS API (Admin)
// ----------------------------------------
export async function fetchUsers(): Promise<any[]> {
  try {
    return await request<any[]>("/users");
  } catch (err) {
    console.warn("Using mock users fallback", err);
    return [];
  }
}

// ----------------------------------------
// PROFILE API
// ----------------------------------------
export async function updateProfile(data: { first_name?: string; last_name?: string; email?: string; institution?: string; bio?: string; orcid?: string; avatar?: string; password?: string }) {
  return await request<{ user: any }>("/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function fetchProfile(): Promise<any> {
  try {
    const data = await request<{ user: any }>("/profile");
    return data.user;
  } catch (err) {
    console.warn("Profile fetch failed, using local storage", err);
    return getCurrentUser();
  }
}

// ----------------------------------------
// SETTINGS API (System Settings)
// ----------------------------------------
export async function fetchSetting(key: string): Promise<string | null> {
  try {
    const data = await request<{ key: string; value: string | null }>(`/settings/${key}`);
    return data.value;
  } catch (err) {
    console.warn(`Failed to fetch setting ${key} from database`, err);
    return null;
  }
}

export async function updateSetting(key: string, value: string): Promise<boolean> {
  try {
    await request<any>(`/settings/${key}`, {
      method: "PATCH",
      body: JSON.stringify({ value }),
    });
    return true;
  } catch (err) {
    console.error(`Failed to save setting ${key} to database`, err);
    return false;
  }
}

// ----------------------------------------
// NOTIFICATIONS API
// ----------------------------------------
export interface NotificationItem {
  id: string;
  kind: string;
  title: string;
  body: string;
  read: boolean;
  link: string;
  metadata: Record<string, any>;
  createdAt: string;
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  try {
    return await request<NotificationItem[]>("/notifications");
  } catch (err) {
    console.warn("Failed to fetch notifications", err);
    return [];
  }
}

export async function fetchUnreadCount(): Promise<number> {
  try {
    const data = await request<{ unread_count: number }>("/notifications/unread_count");
    return data.unread_count;
  } catch (err) {
    console.warn("Failed to fetch unread count", err);
    return 0;
  }
}

export async function markNotificationRead(id: string): Promise<boolean> {
  try {
    await request<any>(`/notifications/${id}/read`, { method: "PATCH" });
    return true;
  } catch (err) {
    console.warn("Failed to mark notification read", err);
    return false;
  }
}

export async function markAllNotificationsRead(): Promise<boolean> {
  try {
    await request<any>("/notifications/read_all", { method: "POST" });
    return true;
  } catch (err) {
    console.warn("Failed to mark all notifications read", err);
    return false;
  }
}
