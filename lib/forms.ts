/**
 * Form submission stub shared by contact, newsletter, masterclass booking and
 * trade forms. No backend is connected yet: this validates nothing server-side
 * and stores nothing. It resolves after a short delay so the UI can show its
 * success state.
 *
 * TODO(client): connect a provider (Shopify customer + Klaviyo/Shopify Email
 * for newsletter, Formspree/Resend/HubSpot for enquiries, Calendly/Tock for
 * bookings) and replace the body of `submitForm`.
 */
export type FormKind = "contact" | "newsletter" | "masterclass" | "event" | "trade-application" | "trade-order" | "quick-reorder";

export async function submitForm(kind: FormKind, data: Record<string, unknown>): Promise<{ ok: true }> {
  if (process.env.NODE_ENV !== "production") console.info(`[form:${kind}]`, data);
  await new Promise((r) => setTimeout(r, 900));
  return { ok: true };
}
