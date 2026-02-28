import type { Course } from './types';

const DUMMY_COURSES: Course[] = [
  {
    id: '1',
    name: 'Data Structures & Algorithms',
    code: 'CS201',
    instructor: 'Dr. Priya Sharma',
    attendancePercent: 85,
    syllabusPercent: 72,
    topics: [
      { name: 'Arrays & Linked Lists', completed: true },
      { name: 'Stacks & Queues', completed: true },
      { name: 'Trees & BST', completed: true },
      { name: 'Graphs', completed: false },
      { name: 'Dynamic Programming', completed: false },
      { name: 'Sorting Algorithms', completed: true },
    ],
  },
  {
    id: '2',
    name: 'Database Management Systems',
    code: 'CS301',
    instructor: 'Prof. Rakesh Mehta',
    attendancePercent: 92,
    syllabusPercent: 88,
    topics: [
      { name: 'ER Modeling', completed: true },
      { name: 'Relational Algebra', completed: true },
      { name: 'SQL Fundamentals', completed: true },
      { name: 'Normalization', completed: true },
      { name: 'Transactions & Concurrency', completed: false },
      { name: 'Indexing & Hashing', completed: true },
    ],
  },
  {
    id: '3',
    name: 'Operating Systems',
    code: 'CS302',
    instructor: 'Dr. Anita Desai',
    attendancePercent: 78,
    syllabusPercent: 60,
    topics: [
      { name: 'Process Management', completed: true },
      { name: 'CPU Scheduling', completed: true },
      { name: 'Memory Management', completed: true },
      { name: 'Virtual Memory', completed: false },
      { name: 'File Systems', completed: false },
      { name: 'I/O Systems', completed: false },
    ],
  },
  {
    id: '4',
    name: 'Computer Networks',
    code: 'CS401',
    instructor: 'Prof. Vivek Kumar',
    attendancePercent: 88,
    syllabusPercent: 45,
    topics: [
      { name: 'OSI & TCP/IP Models', completed: true },
      { name: 'Data Link Layer', completed: true },
      { name: 'Network Layer & Routing', completed: false },
      { name: 'Transport Layer', completed: false },
      { name: 'Application Layer', completed: false },
      { name: 'Network Security', completed: false },
    ],
  },
];

export async function getCourses(): Promise<Course[]> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 300));
  return DUMMY_COURSES;
}

export async function getCourse(id: string): Promise<Course | null> {
  await new Promise((r) => setTimeout(r, 200));
  return DUMMY_COURSES.find((c) => c.id === id) ?? null;
}
