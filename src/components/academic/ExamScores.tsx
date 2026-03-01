interface ExamScoresProps {
  internal: number;
  external: number;
  total: number;
  grade: string;
  isCurrent: boolean;
}

const gradeColor: Record<string, string> = {
  'A+': 'bg-green-100 text-green-700',
  A: 'bg-emerald-100 text-emerald-700',
  'B+': 'bg-blue-100 text-blue-700',
  B: 'bg-amber-100 text-amber-700',
  'C+': 'bg-orange-100 text-orange-700',
  C: 'bg-red-100 text-red-700',
  '-': 'bg-slate-100 text-slate-500',
};

export default function ExamScores({ internal, external, total, grade, isCurrent }: ExamScoresProps) {
  return (
    <div className="pt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-600">Exam Scores</span>
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${gradeColor[grade] ?? 'bg-slate-100 text-slate-500'}`}
        >
          {grade === '-' ? 'Pending' : `Grade: ${grade}`}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-50 rounded-lg p-2.5 text-center">
          <p className="text-lg font-bold text-slate-800">{internal}<span className="text-xs font-normal text-slate-400">/40</span></p>
          <p className="text-[10px] text-slate-500 mt-0.5">Internal</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2.5 text-center">
          <p className="text-lg font-bold text-slate-800">
            {isCurrent ? <span className="text-xs text-slate-400">-</span> : <>{external}<span className="text-xs font-normal text-slate-400">/60</span></>}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">External</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2.5 text-center">
          <p className="text-lg font-bold text-primary">
            {isCurrent ? <>{internal}<span className="text-xs font-normal text-slate-400">/100</span></> : <>{total}<span className="text-xs font-normal text-slate-400">/100</span></>}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Total</p>
        </div>
      </div>
    </div>
  );
}
