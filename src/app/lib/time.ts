import { headers } from "next/headers";

export async function now(): Promise<number> {
  if (process.env.TEST_MODE === "1") {
    const h = (await headers()).get("x-test-now-ms");
    if (h) {
      const t = Number(h);
      if (!Number.isNaN(t)) return t;
    }
  }
  return Date.now();
}
