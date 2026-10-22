import { notFound } from "next/navigation";
import { Checker } from "@/components/checkers/checker";
import { analysisTypeSchema } from "@/lib/validation/schemas";
export const metadata = {
  title: "Security checker",
  robots: { index: false, follow: true },
};
export default async function Page({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const parsed = analysisTypeSchema.safeParse(
    type === "screenshot" ? "screenshot-text" : type,
  );
  if (!parsed.success) notFound();
  return <Checker key={type} type={parsed.data} />;
}
