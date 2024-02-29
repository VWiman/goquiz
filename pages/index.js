import Header from "@/components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="flex justify-center items-center h-screen  font-mono bg-blue-200">
        <div className="flex justify-center gap-10 items-center ">
          <Link href="/adminpage">
            <button
              className=" py-2.5 px-5 me-2 mb-2 text-lg  text-gray-900 
           bg-blue-100  border border-gray-200  hover:text-gray-500 hover:underline"
            >
              Admin
            </button>
          </Link>
          <Link href="/userpage">
            <button
              className=" py-2.5 px-5 me-2 mb-2 text-lg  text-gray-900 
          bg-blue-100  border border-gray-200 hover:text-gray-500 hover:underline"
            >
              User
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}
