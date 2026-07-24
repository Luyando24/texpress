import Link from "next/link";

import { BoltMark } from "@/components/ui/bolt-mark";

export const metadata = {
  title: "You’re offline",
};

export default function OfflinePage() {
  return (
    <main className="grid min-h-svh place-items-center bg-[#e5eaed] px-6 py-12">
      <section className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-[0_18px_55px_rgb(6_31_63_/_0.18)] sm:p-10">
        <div className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl bg-brand-yellow">
          <BoltMark inverse />
        </div>
        <p className="text-xs font-extrabold tracking-[0.18em] text-[#2d789f] uppercase">
          Connection paused
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-brand-navy">
          You’re offline.
        </h1>
        <p className="mt-4 leading-7 text-[#5e6971]">
          Thunder Express needs a connection for fresh delivery updates. Check
          your network and try again.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-brand-cyan px-6 font-bold text-white transition hover:bg-[#079bd3]"
        >
          Try again
        </Link>
      </section>
    </main>
  );
}
