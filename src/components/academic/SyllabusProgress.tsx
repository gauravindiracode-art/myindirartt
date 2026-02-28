import { CheckCircle2, Circle } from 'lucide-react';
import type { CourseTopic } from '../../api/types';

interface SyllabusProgressProps {
  topics: CourseTopic[];
  percent: number;
}

export default function SyllabusProgress({ topics, percent }: SyllabusProgressProps) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-600">Syllabus Progress</span>
        {/* Progress Ring */}
        <div className="relative w-14 h-14">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="5" />
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke="#34A0A4"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-500"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-teal">
            {percent}%
          </span>
        </div>
      </div>

      {/* Topic checklist */}
      <div className="space-y-1.5">
        {topics.map((topic) => (
          <div key={topic.name} className="flex items-center gap-2">
            {topic.completed ? (
              <CheckCircle2 className="w-4 h-4 text-teal shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-slate-300 shrink-0" />
            )}
            <span className={`text-xs ${topic.completed ? 'text-slate-700' : 'text-slate-400'}`}>
              {topic.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
