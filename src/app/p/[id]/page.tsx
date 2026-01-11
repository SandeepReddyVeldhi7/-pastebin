import { redis } from "@/app/lib/redis";
import { now } from "@/app/lib/time";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

export default async function PastePage({
  params,
}: {
   params: Promise<{ id: string }>;
}) {
  
  noStore();

   const { id } = await params;
  const raw = await redis.get(`paste:${id}`);
  if (!raw) notFound();

  const paste = JSON.parse(raw);
  const currentTime = now();



  if (paste?.expires_at_ms && currentTime >= paste?.expires_at_ms) {
    await redis.del(`paste:${id}`);
    notFound();
  }


  const maxViews = paste?.max_views ?? 1;

  if (paste?.view_count >= maxViews) {
    await redis.del(`paste:${id}`);
    notFound();
  }


  paste.view_count += 1;
  await redis.set(`paste:${id}`, JSON.stringify(paste));

 

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-stone-50">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-sm border border-stone-200">


        <div className="px-6 py-4 border-b border-stone-200 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-stone-900">
            Paste Content
          </h1>
          <span className="text-xs text-stone-500">
            Views used: {paste.view_count}
          </span>
        </div>

     
        <div className="p-6">
          <pre
            className="whitespace-pre-wrap break-words rounded-lg
                       bg-stone-50 border border-stone-200
                       p-5 font-mono text-sm text-stone-900
                       overflow-x-auto"
          >
            {paste.content}
          </pre>

        </div>

      </div>
    </main>
  );
}
