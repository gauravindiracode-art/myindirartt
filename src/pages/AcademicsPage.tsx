import CourseList from '../components/academic/CourseList';

export default function AcademicsPage() {
  return (
    <div>
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-lg font-bold text-slate-800">Academics</h2>
        <p className="text-xs text-slate-400">Courses, attendance & syllabus</p>
      </div>
      <CourseList />
    </div>
  );
}
