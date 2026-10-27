"use client";

import { useState, type FormEvent } from "react";

export default function Newsletter() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return <p className="font-display text-xl italic text-gold">Thank you — you&rsquo;re on the list.</p>;
  }

  return (
    <form onSubmit={submit} className="flex border-b border-ivory/30 focus-within:border-gold">
      <label htmlFor="nl-email" className="sr-only">
        Email address
      </label>
      <input
        id="nl-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Your email"
        className="min-w-0 flex-1 bg-transparent py-3 text-sm text-ivory placeholder:text-ivory/45 focus:outline-none"
      />
      <button type="submit" disabled={state === "sending"} className="label px-2 text-gold hover:text-ivory disabled:opacity-50">
        {state === "sending" ? "…" : "Join"}
      </button>
      {state === "error" && (
        <p role="alert" className="sr-only">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
