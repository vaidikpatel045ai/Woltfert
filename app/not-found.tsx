import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container-luxe flex min-h-[70vh] flex-col items-start justify-center py-24">
      <p className="label text-gold-ink">404</p>
      <h1 className="mt-6 text-[clamp(3rem,9vw,8rem)] font-light leading-[0.9]">
        This page said <em className="text-gold-deep">no</em>.
      </h1>
      <p className="mt-6 max-w-md text-taupe">Let&rsquo;s find you something that says yes.</p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Button href="/">Return home</Button>
        <Button href="/appointment" variant="outline" magnetic={false}>
          Book Appointment
        </Button>
      </div>
    </section>
  );
}
