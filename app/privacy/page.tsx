import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { business } from "@/lib/data";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

// TODO: replace with the boutique's reviewed privacy policy.
export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy" cta={null} />
      <div className="container-luxe max-w-3xl space-y-6 pb-32 text-taupe">
        <p>
          We collect the details you share when booking an appointment or joining our list — your name, email, phone and wedding details — solely to arrange your visit and keep you
          informed of trunk shows and events.
        </p>
        <p>We never sell your information. You may ask us to update or delete it at any time by calling {business.phone}.</p>
      </div>
    </>
  );
}
