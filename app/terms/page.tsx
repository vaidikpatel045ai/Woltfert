import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Terms of Service", alternates: { canonical: "/terms" } };

// TODO: replace with the boutique's reviewed terms.
export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms" cta={null} />
      <div className="container-luxe max-w-3xl space-y-6 pb-32 text-taupe">
        <p>Appointment requests are confirmed by our team. Premier Appointment fees are paid in full at booking and are non-refundable. Gowns $899 and below are cash only.</p>
        <p>Special-order delivery times are estimates provided by each designer. Tuxedo rental payments are non-refundable.</p>
      </div>
    </>
  );
}
