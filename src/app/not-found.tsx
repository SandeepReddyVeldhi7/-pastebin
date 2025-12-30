import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
    
      <div className="bg-slate-200  p-6 rounded-xl shadow-xl text-center">
            <h1 className="text-4xl text-[red] font-bold">404</h1>
        <h1 className="text-2xl font-bold">Paste not available</h1>
        <p className="text-slate-500 mt-2">
          This paste has expired or reached its view limit.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Create new paste
        </Link>
      </div>
    </main>
  );
}
