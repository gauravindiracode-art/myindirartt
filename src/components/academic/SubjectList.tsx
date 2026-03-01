import { useState } from 'react';
import type { Subject } from '../../api/types';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import ExamScores from './ExamScores';
import AttendanceView from './AttendanceView';
import SyllabusProgress from './SyllabusProgress';

interface SubjectListProps {
  subjects: Subject[];
  isCurrent: boolean;
}

export default function SubjectList({ subjects, isCurrent }: SubjectListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {subjects.map((subject) => {
        const isExpanded = expandedId === subject.id;
        return (
          <div key={subject.id} className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandedId(isExpanded ? null : subject.id)}
              className="w-full flex items-center gap-3 p-4 text-left"
            >
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-800 truncate">{subject.name}</h3>
                <p className="text-xs text-slate-400">{subject.code} &middot; {subject.instructor}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-medium bg-primary-50 text-primary px-1.5 py-0.5 rounded">
                  {subject.credits} cr
                </span>
                {!isCurrent && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      subject.grade === 'A+' ? 'bg-green-100 text-green-700' :
                      subject.grade === 'A' ? 'bg-emerald-100 text-emerald-700' :
                      subject.grade === 'B+' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {subject.grade}
                  </span>
                )}
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 space-y-4 border-t border-slate-50">
                <ExamScores
                  internal={subject.internal}
                  external={subject.external}
                  total={subject.total}
                  grade={subject.grade}
                  isCurrent={isCurrent}
                />
                {isCurrent && (
                  <>
                    <AttendanceView percent={subject.attendancePercent} />
                    <SyllabusProgress topics={subject.topics} percent={subject.syllabusPercent} />
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
