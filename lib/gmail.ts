/**
 * Builds a Gmail web compose URL that opens mail.google.com with the
 * recipient, subject, and body pre-filled.
 *
 * Requires the visitor to be signed in to a Google account in the same
 * browser; otherwise Gmail will ask them to log in first.
 */
export function gmailComposeUrl(to: string, subject = "", body = ""): string {
  const params = new URLSearchParams({ view: "cm", fs: "1" });
  if (to) params.set("to", to);
  if (subject) params.set("su", subject);
  if (body) params.set("body", body);
  return `https://mail.google.com/mail/?${params.toString()}`;
}
