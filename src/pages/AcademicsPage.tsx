import SemesterView from '../components/academic/SemesterView';

export default function AcademicsPage() {
  return (
    <div>
      <div className="px-4 md:px-6 pt-4 md:pt-6 pb-2">
        <h2 className="text-lg md:text-xl font-bold text-slate-800">Academics</h2>
        <p className="text-xs md:text-sm text-slate-400">Program, semesters & exam results</p>
      </div>
      <SemesterView />
    </div>
  );
}
