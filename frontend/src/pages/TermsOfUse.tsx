function TermsOfUse() {
  return (
    <div
      className="max-w-4xl mx-auto py-8 text-gray-800"
      style={{ paddingLeft: '20%', paddingRight: '20%' }}
    >
      <header className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-blue-600 mb-4">
          Terms of Use
        </h1>
        <p className="privacy-policy-subtext">
          Effective Date: April 5, 2025
        </p>
      </header>

      <section className="bg-gray-50 p-8 mb-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          1. Service Overview
        </h2>
        <p className="privacy-policy-subtext">
          CineNiche provides a personalized streaming service that allows users to access entertainment content via the Internet on compatible devices. By creating an account, you agree to these Terms of Use.
        </p>
      </section>

      <section className="bg-gray-50 p-8 mb-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          2. Membership and Account
        </h2>
        <ul className="list-disc pl-6 space-y-2 privacy-policy-subtext">
          <li>Membership renews automatically unless cancelled.</li>
          <li>You must be at least 18 or have parental/guardian consent.</li>
          <li>You are responsible for all activity on your account.</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-8 mb-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          3. Billing and Cancellation
        </h2>
        <ul className="list-disc pl-6 space-y-2 privacy-policy-subtext">
          <li>You must provide a valid payment method upon registration.</li>
          <li>Billing occurs monthly unless otherwise stated.</li>
          <li>You may cancel at any time through your account settings.</li>
          <li>No refunds are provided for partial billing periods.</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-8 mb-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          4. Use of Service
        </h2>
        <ul className="list-disc pl-6 space-y-2 privacy-policy-subtext">
          <li>The service is for personal, non-commercial use only.</li>
          <li>Content access may vary by region and subscription tier.</li>
          <li>You may not redistribute or publicly perform content.</li>
          <li>You may not attempt to reverse-engineer or interfere with the service.</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-8 mb-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          5. Passwords and Access
        </h2>
        <p className="privacy-policy-subtext">
          Keep your password secure. Sharing your account details may lead to termination. Notify us immediately of any unauthorized access.
        </p>
      </section>

      <section className="bg-gray-50 p-8 mb-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          6. Disclaimers and Liability
        </h2>
        <ul className="list-disc pl-6 space-y-2 privacy-policy-subtext">
          <li>The service is provided "as is" without warranties of any kind.</li>
          <li>We are not liable for indirect, incidental, or consequential damages.</li>
          <li>We do not endorse third-party content shown within the service.</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-8 mb-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          7. Arbitration and Disputes
        </h2>
        <p className="privacy-policy-subtext">
          By using our service, you agree to resolve disputes through binding arbitration or small claims court, waiving your right to a jury trial or class action.
        </p>
      </section>

      <section className="bg-gray-50 p-8 mb-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          8. Miscellaneous
        </h2>
        <ul className="list-disc pl-6 space-y-2 privacy-policy-subtext">
          <li>These terms are governed by the laws of Utah, United States.</li>
          <li>We may modify these Terms with prior notice; continued use implies acceptance.</li>
          <li>Feedback you provide may be used without compensation or credit.</li>
          <li>If any provision is invalid, the remaining provisions will still apply.</li>
        </ul>
      </section>

      <p className="privacy-policy-subtext text-center text-sm text-gray-600 mt-8">
        For questions about these Terms, contact us at support@CineNiche.com
      </p>
    </div>
  );
}

export default TermsOfUse;