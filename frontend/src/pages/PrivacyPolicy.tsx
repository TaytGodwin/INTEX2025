function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p><strong>Effective Date:</strong>April 7, 2025</p>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">1. Who We Are</h2>
        <p>
          We are <strong>CineNiche</strong>, the data controller responsible for your personal data. You can contact us at:
          <br />
          <strong>Email:</strong> privacy@CineNiche.com
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">2. What Data We Collect</h2>
        <ul className="list-disc ml-6">
          <li>Email address (for account login)</li>
          <li>User preferences and watch history</li>
          <li>Cookies and analytics data (IP, device, browser)</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">3. Why We Collect Your Data</h2>
        <ul className="list-disc ml-6">
          <li>To manage your account</li>
          <li>To provide personalized recommendations</li>
          <li>To improve our services</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">4. Legal Basis for Processing</h2>
        <ul className="list-disc ml-6">
          <li><strong>Consent</strong> – for non-essential cookies and marketing</li>
          <li><strong>Contract</strong> – to deliver streaming services</li>
          <li><strong>Legitimate interests</strong> – analytics & recommendations</li>
          <li><strong>Legal obligation</strong> – compliance with law</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">5. Cookies and Tracking</h2>
        <p>
          We use cookies to:
        </p>
        <ul className="list-disc ml-6">
          <li>Maintain your login session</li>
          <li>Understand usage patterns</li>
          <li>Recommend content based on behavior</li>
        </ul>
        <p className="mt-2">
          A cookie banner allows you to accept or reject non-essential cookies when visiting the site.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">6. Data Security</h2>
        <p>
          Your data is protected through HTTPS encryption, secure databases, and access controls.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">7. Sharing Your Data</h2>
        <p>
          We do not sell your data. We may use trusted third-party services (like analytics or hosting providers) with GDPR-compliant agreements.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">8. Your Rights Under GDPR</h2>
        <ul className="list-disc ml-6">
          <li>Access, correct, or delete your data</li>
          <li>Restrict or object to processing</li>
          <li>Data portability</li>
          <li>Withdraw consent at any time</li>
        </ul>
        <p className="mt-2">
          Contact us at privacy@CineNiche.com to exercise any of these rights.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">9. Data Retention</h2>
        <p>
          We retain your data as long as your account is active or as legally required. You may request deletion anytime.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">10. Updates</h2>
        <p>
          We may update this policy. Changes will be posted on this page with a new revision date.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
