import Link from "next/link";
import { CyberButton } from "@/components/ui/button";
export default function NotFound() {
  return (
    <main id="main" className="container error-page">
      <p className="eyebrow">404 / SIGNAL NOT FOUND</p>
      <h1>This path ends here.</h1>
      <p>
        The page may have moved or the address may be incorrect. Your next
        security check is a click away.
      </p>
      <CyberButton asChild>
        <Link href="/">Back to ScamVeto ↗</Link>
      </CyberButton>
    </main>
  );
}
