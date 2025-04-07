function TermsOfUse() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
      <p>Effective Date: [Insert Date]</p>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">1. Service Overview</h2>
        <p>
        CineNiche provides a personalized streaming service that allows
          users to access entertainment content via the Internet on
          compatible devices. By creating an account, you agree to these Terms
          of Use.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">2. Membership and Account</h2>
        <ul className="list-disc ml-6">
          <li>Membership renews automatically unless cancelled.</li>
          <li>You must be at least 18 or have parental/guardian consent.</li>
          <li>You are responsible for activity on your account.</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">3. Billing and Cancellation</h2>
        <ul className="list-disc ml-6">
          <li>You must provide a valid payment method upon registration.</li>
          <li>Billing occurs monthly unless otherwise stated.</li>
          <li>You may cancel at any time through your account settings.</li>
          <li>No refunds are provided for partial billing periods.</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">4. Use of Service</h2>
        <ul className="list-disc ml-6">
          <li>Service is for personal, non-commercial use only.</li>
          <li>Content access may vary by region and subscription tier.</li>
          <li>Do not redistribute or publicly perform content.</li>
          <li>
            You may not attempt to reverse-engineer or interfere with the
            service.
          </li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">5. Passwords and Access</h2>
        <p>
          Keep your password secure. Sharing your account details may lead to
          termination. Notify us of any unauthorized access immediately.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">6. Disclaimers and Liability</h2>
        <ul className="list-disc ml-6">
          <li>
            Service is provided "as is" without warranties of any kind.
          </li>
          <li>
            We are not liable for indirect, incidental, or consequential
            damages.
          </li>
          <li>
            We do not endorse third-party content shown within the service.
          </li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">7. Arbitration and Disputes</h2>
        <p>
          By using our service, you agree to resolve disputes through binding
          arbitration or small claims court, waiving your right to jury trial
          or class action participation.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">8. Miscellaneous</h2>
        <ul className="list-disc ml-6">
          <li>These terms are governed by the laws of Utah, United State of America.</li>
          <li>
            We may modify these Terms with prior notice; continued use implies
            acceptance.
          </li>
          <li>
            Feedback you provide may be used without compensation or credit.
          </li>
          <li>
            If any provision is invalid, remaining provisions will still apply.
          </li>
        </ul>
      </section>

      <p className="mt-6 text-sm text-gray-600">
        For questions about these Terms, contact us at support@CineNiche.com
      </p>
    </div>
  );
};

export default TermsOfUse;
