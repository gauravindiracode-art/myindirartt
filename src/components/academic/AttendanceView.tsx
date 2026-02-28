interface AttendanceViewProps {
  percent: number;
}

export default function AttendanceView({ percent }: AttendanceViewProps) {
  const color = percent >= 75 ? 'bg-green-500' : percent >= 60 ? 'bg-gold' : 'bg-red-500';
  const textColor = percent >= 75 ? 'text-green-700' : percent >= 60 ? 'text-amber-700' : 'text-red-700';

  return (
    <div className="pt-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-600">Attendance</span>
        <span className={`text-xs font-bold ${textColor}`}>{percent}%</span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {percent < 75 && (
        <p className="text-[10px] text-red-500 mt-1">Below 75% minimum requirement</p>
      )}
    </div>
  );
}
