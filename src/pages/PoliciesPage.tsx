import PolicyList from '../components/policies/PolicyList';

export default function PoliciesPage() {
  return (
    <div>
      <div className="px-4 md:px-6 pt-4 md:pt-6 pb-2">
        <h2 className="text-lg md:text-xl font-bold text-slate-800">Policies</h2>
        <p className="text-xs md:text-sm text-slate-400">University policies & guidelines</p>
      </div>
      <PolicyList />
    </div>
  );
}
