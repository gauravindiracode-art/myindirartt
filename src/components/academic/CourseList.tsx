import { useEffect, useState } from 'react';
import { getCourses } from '../../api/courseApi';
import type { Course } from '../../api/types';
import LoadingSpinner from '../common/LoadingSpinner';
import AttendanceView from './AttendanceView';
import SyllabusProgress from './SyllabusProgress';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getCourses().then((data) => {
      setCourses(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col gap-3 px-4 py-3">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-primary-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">
            {Math.round(courses.reduce((s, c) => s + c.attendancePercent, 0) / courses.length)}%
          </p>
          <p className="text-xs text-primary-600 mt-0.5">Avg Attendance</p>
        </div>
        <div className="bg-teal-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-teal">
            {Math.round(courses.reduce((s, c) => s + c.syllabusPercent, 0) / courses.length)}%
          </p>
          <p className="text-xs text-teal-500 mt-0.5">Avg Syllabus</p>
        </div>
      </div>

      {/* Course Cards */}
      {courses.map((course) => {
        const isExpanded = expandedId === course.id;
        return (
          <div key={course.id} className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandedId(isExpanded ? null : course.id)}
              className="w-full flex items-center gap-3 p-4 text-left"
            >
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-800 truncate">{course.name}</h3>
                <p className="text-xs text-slate-400">{course.code} &middot; {course.instructor}</p>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 space-y-4 border-t border-slate-50">
                <AttendanceView percent={course.attendancePercent} />
                <SyllabusProgress topics={course.topics} percent={course.syllabusPercent} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
