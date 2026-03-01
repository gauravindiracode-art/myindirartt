import { useEffect, useState } from 'react';
import { getStudentProfile, getSemesters } from '../../api/courseApi';
import type { StudentProfile, Semester } from '../../api/types';
import LoadingSpinner from '../common/LoadingSpinner';
import SubjectList from './SubjectList';
import { GraduationCap } from 'lucide-react';

export default function SemesterView() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    Promise.all([getStudentProfile(), getSemesters()]).then(([p, s]) => {
      setProfile(p);
      setSemesters(s);
      setSelectedIdx(s.length - 1); // default to current/latest
      setLoading(false);
    });
  }, []);

  if (loading || !profile) return <LoadingSpinner />;

  const selected = semesters[selectedIdx];
  const isCurrent = selected.result === 'current';

  // CGPA from completed semesters
  const completedSems = semesters.filter((s) => s.result === 'pass');
  const cgpa = completedSems.length > 0
    ? (completedSems.reduce((sum, s) => sum + s.sgpa, 0) / completedSems.length).toFixed(2)
    : '-';

  // Current semester avg attendance
  const currentSem = semesters.find((s) => s.result === 'current');
  const avgAttendance = currentSem
    ? Math.round(currentSem.subjects.reduce((s, sub) => s + sub.attendancePercent, 0) / currentSem.subjects.length)
    : 0;

  const semesterLabel = (s: Semester, i: number) => {
    const label = `Sem ${i + 1}`;
    return s.result === 'current' ? `${label} (Current)` : label;
  };

  return (
    <div className="flex flex-col gap-3 px-4 py-3">
      {/* Program Info Card */}
      <div className="bg-gradient-to-r from-primary to-primary-600 rounded-xl p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base">{profile.program.name}</h3>
            <p className="text-white/80 text-xs">{profile.program.fullName}</p>
            <p className="text-white/70 text-[11px] mt-0.5">
              Year {profile.currentYear} &middot; Semester {profile.currentSemester}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-primary-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">{cgpa}</p>
          <p className="text-xs text-primary-600 mt-0.5">CGPA</p>
        </div>
        <div className="bg-teal-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-teal">{avgAttendance}%</p>
          <p className="text-xs text-teal-500 mt-0.5">Avg Attendance</p>
        </div>
      </div>

      {/* Semester Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        {semesters.map((sem, i) => (
          <button
            key={`${sem.year}-${sem.semester}`}
            onClick={() => setSelectedIdx(i)}
            className={`whitespace-nowrap px-3.5 py-2 rounded-full text-xs font-medium transition-colors ${
              selectedIdx === i
                ? 'bg-primary text-white shadow-sm'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {semesterLabel(sem, i)}
          </button>
        ))}
      </div>

      {/* SGPA for selected semester (past only) */}
      {!isCurrent && (
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs text-slate-500">SGPA:</span>
          <span className="text-sm font-bold text-primary">{selected.sgpa}</span>
          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Passed</span>
        </div>
      )}

      {/* Subject List */}
      <SubjectList subjects={selected.subjects} isCurrent={isCurrent} />
    </div>
  );
}
