import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main>
      <Link to="/adminpage">
        <button>Admin</button>
      </Link>
      <Link to="/userpage">
        <button>User</button>
      </Link>
    </main>
  );
}
