"use client";

import { SkeletonCard } from "@/components/custom/Skeleton";
import { useRouter } from "next/navigation";

export default function InstrutorPage() {
  const router = useRouter();

  router.push("/dashboard/professor/home");
  return <SkeletonCard />;
}
