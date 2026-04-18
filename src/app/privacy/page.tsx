import LegalPage from "@/components/legal/LegalPage";

export const metadata = {
  title: "Privacy Policy | Protocols by James",
  description:
    "How Protocols by James collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage kicker="Legal" title="Privacy Policy" lastUpdated="April 13, 2026">
      <p>
        This Privacy Policy explains how Protocols by James (&quot;we,&quot; &quot;us,&quot;
        or &quot;our&quot;) collects, uses, and protects your personal information
        when you use the website at protocolsbyjames.com and the web
        application at app.protocolsbyjames.com (collectively, the
        &quot;Services&quot;). We respect your privacy and only collect data we need
        to deliver the Services to you.
      </p>

      <h2>1. Information we collect</h2>

      <h3>Account information</h3>
      <p>
        When you create an account, we collect your name, email address, and
        a password hash. You may optionally provide an avatar URL.
      </p>

      <h3>Health, fitness, and body metrics</h3>
      <p>
        To deliver personalized coaching, we collect information you provide
        through check-ins, including body-weight, measurements, progress
        photos, training logs, nutrition logs, and any notes you share with
        your coach. You control what you submit.
      </p>

      <h3>Payment information</h3>
      <p>
        Payments are processed by{" "}
        <a href="https://www.lemonsqueezy.com">LemonSqueezy</a>, our
        merchant of record. LemonSqueezy handles all payment processing,
        tax collection, and compliance. We do not store or receive your full
        card number, CVC, or bank credentials. We do receive and store a
        customer ID, subscription status, and billing history.
      </p>

      <h3>Technical information</h3>
      <p>
        When you use the Services, we automatically collect basic technical
        information such as your IP address, browser type, device type, and
        pages visited. This helps us keep the Services secure and reliable.
      </p>

      <h3>Communications</h3>
      <p>
        We store messages you send to your coach through the app, as well as
        emails and other communications you send to us.
      </p>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To deliver personalized coaching, including generating training and nutrition plans.</li>
        <li>To process payments and manage your subscription.</li>
        <li>To communicate with you about your account, Service updates, and support.</li>
        <li>To improve the Services and troubleshoot issues.</li>
        <li>To comply with legal obligations and enforce our Terms.</li>
      </ul>
      <p>
        We do not sell your personal information. We do not share your
        information with advertisers.
      </p>

      <h2>3. Service providers</h2>
      <p>We share limited information with third-party service providers who help us operate the Services:</p>
      <ul>
        <li>
          <strong>LemonSqueezy</strong> — payment processing and merchant of record. See{" "}
          <a href="https://www.lemonsqueezy.com/privacy">LemonSqueezy&apos;s privacy policy</a>.
        </li>
        <li>
          <strong>Supabase</strong> — database, authentication, and file storage hosting.
        </li>
        <li>
          <strong>Vercel</strong> — web application hosting.
        </li>
        <li>
          <strong>Email providers</strong> — transactional email (for example, account confirmation emails).
        </li>
      </ul>
      <p>
        Each provider is bound by its own privacy terms and is only
        authorized to use your information to perform services for us.
      </p>

      <h2>4. Cookies & tracking</h2>
      <p>
        We use strictly necessary cookies to keep you logged in and to
        maintain your session. We do not use third-party advertising or
        behavioral-tracking cookies.
      </p>

      <h2>5. Your rights</h2>
      <p>
        You can access or update most of your information from your account
        settings. You also have the right to:
      </p>
      <ul>
        <li>Request a copy of the personal data we hold about you.</li>
        <li>Ask us to correct inaccurate information.</li>
        <li>Ask us to delete your account and associated data.</li>
        <li>Opt out of non-essential emails.</li>
      </ul>
      <p>
        To exercise any of these rights, email{" "}
        <a href="mailto:protocolsbyjames@gmail.com">
          protocolsbyjames@gmail.com
        </a>
        . We will respond within 30 days.
      </p>

      <h2>6. Data retention</h2>
      <p>
        We keep your account information for as long as your account is
        active. If you delete your account, we will delete or anonymize your
        personal information within 60 days, except where we are required to
        retain it for legal, tax, or accounting reasons (for example, payment
        records).
      </p>

      <h2>7. Security</h2>
      <p>
        We use industry-standard encryption in transit (TLS) and at rest. We
        limit access to personal information to those who need it to operate
        the Services. No system is perfectly secure; please use a strong,
        unique password and notify us immediately if you suspect unauthorized
        access.
      </p>

      <h2>8. Children</h2>
      <p>
        The Services are intended for adults 18 years of age or older. We do
        not knowingly collect personal information from anyone under 18. If
        you believe we have inadvertently collected such information, please
        contact us and we will delete it.
      </p>

      <h2>9. International users</h2>
      <p>
        The Services are operated from the United States. If you access the
        Services from outside the U.S., your information may be transferred
        to, stored, and processed in the U.S.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. If we make
        material changes, we will notify you by email or through the
        Services.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions or requests about your data? Email{" "}
        <a href="mailto:protocolsbyjames@gmail.com">
          protocolsbyjames@gmail.com
        </a>
        .
      </p>
    </LegalPage>
  );
}
