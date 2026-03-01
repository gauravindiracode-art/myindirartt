import SocialFeed from '../components/social/SocialFeed';

export default function SocialPage() {
  return (
    <div className="px-4 md:px-6 py-3 md:py-6">
      <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4">Social Feed</h2>
      <SocialFeed />
    </div>
  );
}
