import SemesterView from '../components/academic/SemesterView';

export default function AcademicsPage() {
  return (
    <div>
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-lg font-bold text-slate-800">Academics</h2>
        <p className="text-xs text-slate-400">Program, semesters & exam results</p>
      </div>
      <SemesterView />
    </div>
  );
}
