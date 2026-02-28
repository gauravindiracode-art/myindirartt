import PostList from '../components/posts/PostList';

export default function PostsPage() {
  return (
    <div>
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-lg font-bold text-slate-800">Posts</h2>
        <p className="text-xs text-slate-400">Messages, announcements & news</p>
      </div>
      <PostList />
    </div>
  );
}
