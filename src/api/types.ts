export type UserRole = 'student' | 'employee' | 'admin';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  createdAt: Date;
}

export type PostType = 'leadership' | 'announcement' | 'news';

export interface Post {
  id: string;
  title: string;
  content: string;
  type: PostType;
  authorName: string;
  authorPhoto: string;
  createdAt: Date;
  archived: boolean;
}

export type ReactionType = 'like' | 'love' | 'thumbsup' | 'celebrate' | 'support';

export interface Reaction {
  uid: string;
  type: ReactionType;
}

export interface Policy {
  id: string;
  title: string;
  content: string;
  department: string;
  createdAt: Date;
}

export interface Acknowledgment {
  uid: string;
  userName: string;
  acknowledgedAt: Date;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  attendancePercent: number;
  syllabusPercent: number;
  topics: CourseTopic[];
}

export interface CourseTopic {
  name: string;
  completed: boolean;
}
