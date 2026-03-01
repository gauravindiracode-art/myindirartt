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

export interface SocialPost {
  id: string;
  content: string;
  mediaURL: string | null;
  mediaType: 'image' | 'video' | null;
  authorUid: string;
  authorName: string;
  authorPhoto: string;
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface SocialReport {
  uid: string;
  reason: string;
  reportedAt: Date;
}

export interface Acknowledgment {
  uid: string;
  userName: string;
  acknowledgedAt: Date;
}

export type AcknowledgmentAudience = 'student' | 'employee' | 'both';

export interface AcknowledgmentPost {
  id: string;
  title: string;
  content: string;
  targetAudience: AcknowledgmentAudience;
  createdAt: Date;
  authorName: string;
}

export interface AcknowledgmentResponse {
  uid: string;
  userName: string;
  userRole: UserRole;
  acknowledgedAt: Date;
}

export interface CourseTopic {
  name: string;
  completed: boolean;
}

export interface Program {
  id: string;
  name: string;
  fullName: string;
  totalYears: number;
}

export interface StudentProfile {
  program: Program;
  currentYear: number;
  currentSemester: 1 | 2;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  instructor: string;
  credits: number;
  internal: number;
  external: number;
  total: number;
  grade: string;
  attendancePercent: number;
  syllabusPercent: number;
  topics: CourseTopic[];
}

export interface Semester {
  year: number;
  semester: 1 | 2;
  subjects: Subject[];
  sgpa: number;
  result: 'pass' | 'current';
}
