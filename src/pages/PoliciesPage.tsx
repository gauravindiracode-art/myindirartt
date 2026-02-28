import PolicyList from '../components/policies/PolicyList';

export default function PoliciesPage() {
  return (
    <div>
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-lg font-bold text-slate-800">Policies</h2>
        <p className="text-xs text-slate-400">University policies & guidelines</p>
      </div>
      <PolicyList />
    </div>
  );
}
