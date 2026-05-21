import { Suspense } from "react";
import FeatureProducts from "@/components/customer-page/home/feature-products";
import Hero from "@/components/customer-page/home/hero";

export default async function Home() {
  return (
    <div className="flex flex-col gap-6 md:gap-12">
      <Hero />
      <Suspense fallback={<div className="h-96 animate-pulse bg-slate-100 rounded-xl" />}>
        <FeatureProducts />
      </Suspense>
    </div>
  );
}
