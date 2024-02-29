import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Link href="/adminpage">
        <button>Admin</button>
      </Link>
      <Link href="/userpage">
        <button>User</button>
      </Link>
    </main>
  );
}
