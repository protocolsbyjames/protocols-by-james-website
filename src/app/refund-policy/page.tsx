import LegalPage from "@/components/legal/LegalPage";

export const metadata = {
  title: "Refund Policy | Protocols by James",
  description:
    "Refund and cancellation policy for Protocols by James coaching subscriptions and mentorship.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      kicker="Legal"
      title="Refund Policy"
      lastUpdated="April 13, 2026"
    >
      <p>
        We want you to be happy with your coaching experience. This Refund
        Policy explains when refunds are available and how cancellations
        work. If you have questions, email{" "}
        <a href="mailto:protocolsbyjames@gmail.com">
          protocolsbyjames@gmail.com
        </a>{" "}
        and we&apos;ll walk you through your options.
      </p>

      <h2>1. Coaching subscriptions</h2>

      <h3>Cancellation</h3>
      <p>
        You can cancel your monthly coaching subscription at any time from
        the Settings page inside your account at app.protocolsbyjames.com.
        Cancellation takes effect at the end of your current billing period.
        You&apos;ll keep access to the Services through that date, and you will
        not be charged again.
      </p>

      <h3>Initial 7-day refund window</h3>
      <p>
        If you are a new subscriber and the Services don&apos;t feel like the
        right fit, you can request a full refund within 7 days of your first
        payment, provided you have not already received a personalized
        training plan, meal plan, or coach feedback on a check-in. Email us
        at{" "}
        <a href="mailto:protocolsbyjames@gmail.com">
          protocolsbyjames@gmail.com
        </a>{" "}
        with your account email and we&apos;ll process the refund within 5–10
        business days.
      </p>

      <h3>After the 7-day window</h3>
      <p>
        Monthly subscriptions are generally non-refundable once the billing
        period has begun, because coaching is delivered progressively
        throughout the month. If you cancel partway through a month, you
        retain access to the Services through the end of that billing
        period, but a refund for the unused portion is not automatically
        issued.
      </p>
      <p>
        If you believe you were charged by mistake (for example, duplicate
        charges or a charge after you cancelled), contact us and we will
        investigate and refund promptly if the charge was in error.
      </p>

      <h2>2. Coach mentorship</h2>
      <p>
        Coach-mentorship engagements are custom services priced per client,
        typically billed via invoice at the start of the engagement.
        Refunds for mentorship are handled case-by-case depending on scope,
        delivery status, and the terms of your specific engagement
        agreement. Contact us at{" "}
        <a href="mailto:protocolsbyjames@gmail.com">
          protocolsbyjames@gmail.com
        </a>{" "}
        to discuss.
      </p>

      <h2>3. How refunds are issued</h2>
      <p>
        Approved refunds are issued to your original payment method via
        LemonSqueezy. Your bank typically makes refunded funds available within
        5–10 business days of approval, though timing is ultimately
        determined by your bank or card issuer.
      </p>

      <h2>4. Chargebacks</h2>
      <p>
        If you have any billing concern, please contact us first — we&apos;ll do
        our best to resolve it quickly. Initiating a chargeback without
        first contacting us may result in suspension of your account while
        the dispute is reviewed.
      </p>

      <h2>5. Changes to this policy</h2>
      <p>
        We may update this Refund Policy from time to time. Any changes
        apply to charges made after the updated effective date; prior
        charges are governed by the version of this policy in effect at the
        time of the charge.
      </p>

      <h2>6. Contact</h2>
      <p>
        Refund requests or questions:{" "}
        <a href="mailto:protocolsbyjames@gmail.com">
          protocolsbyjames@gmail.com
        </a>
        .
      </p>
    </LegalPage>
  );
}
