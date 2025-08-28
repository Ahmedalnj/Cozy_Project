import crypto from "crypto";

const BASE = "https://api.plutus.ly/api/v1";

function auth() {
  return {
    "X-API-KEY": process.env.PLUTU_API_KEY!,
    Authorization: `Bearer ${process.env.PLUTU_ACCESS_TOKEN!}`,
  };
}

export async function postForm(
  endpoint: string,
  fields: Record<string, string>
) {
  const form = new FormData();
  Object.entries(fields).forEach(([k, v]) => form.set(k, v));
  const res = await fetch(`${BASE}${endpoint}`, {
    method: "POST",
    headers: auth(),
    body: form,
  });
  const data = await res.json();
  if (!res.ok || data?.error) {
    throw new Error(`Plutu error: ${JSON.stringify(data)}`);
  }
  return data;
}

export function hmacUppercase(input: string) {
  return crypto
    .createHmac("sha256", process.env.PLUTU_SECRET_KEY!)
    .update(input)
    .digest("hex")
    .toUpperCase();
}
