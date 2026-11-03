import { Resend } from "resend";
import { NextResponse } from "next/server";

const TO = "baldi.filippo@icloud.com";
// Resend's shared sender: delivers only to the account owner's address.
// Swap for an address on a domain verified in Resend once there is one.
const FROM = "BBLOG <onboarding@resend.dev>";

const MAX = { name: 100, email: 254, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort rate limit: per-IP, in memory, so it resets whenever the
// serverless instance does. Enough to stop a naive loop, not a real attack.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: a hidden field real users never fill. Bots get a fake success.
  if (clean(body.company, 10)) {
    return NextResponse.json({ success: true });
  }

  const name = clean(body.name, MAX.name);
  const email = clean(body.email, MAX.email);
  const message = clean(body.message, MAX.message);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many messages, try again later" }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json({ error: "Email is not configured" }, { status: 500 });
  }

  // Header values can't contain line breaks: keep the subject on one line
  const subject = `New message from ${name.replace(/[\r\n]+/g, " ")}`;

  const { error } = await new Resend(apiKey).emails.send({
    from: FROM,
    to: TO,
    replyTo: email,
    subject,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Could not send the message" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
