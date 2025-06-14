function PrivacyPolicy() {
  return (
    <div
      className="max-w-4xl mx-auto py-8 text-gray-800"
      style={{ 
        paddingLeft: '20%', 
        paddingRight: '20%', }}
    >
      <h1 className="text-4xl font-semibold text-center mb-8 text-blue-600">
        Privacy Policy
      </h1>
      <p className="text-lg text-center text-gray-600 mb-8 privacy-policy-subtext">
        <strong>Effective (& Updated) Date: </strong>April 9, 2025
      </p>

      {/* // Contact information section:
      // - Introduces CineNiche, Inc. and provides email, physical address, and phone number
      */}
      <section className="bg-gray-50 p-8 mb-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          1. Who We Are
        </h2>
        <p className="privacy-policy-subtext">
          We are <strong>CineNiche, Inc.</strong>, the movie streaming platform
          where you can find your favorite movies! You can contact us at:
          <ul>
            <li>
              <strong>Email:</strong> privacy@CineNiche.com
            </li>
            <li>
              <strong>Our address:</strong> 900 W University Pkwy TNRB 780,
              Provo, UT 84602
            </li>
            <li>
              <strong>Our Number:</strong> 801-422-4336
            </li>
          </ul>
        </p>
        <p className="privacy-policy-subtext">
          Note: You may also contact our Data Protection Officer at
          dpo@CineNiche.com
        </p>
      </section>

      {/* // Section 2: Data Subject Categories
      // - Identifies whose data is collected, including registered users and site visitors
      */}
      <section className="bg-gray-50 p-8 mb-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          2. Data Subject Categories
        </h2>
        <p className="privacy-policy-subtext">
          The data we collect pertains to the following categories of data
          subjects:
        </p>
        <ul className="list-disc pl-6 space-y-2 privacy-policy-subtext">
          <li>Registered Users of the CineNiche platform</li>
          <li>Visitors to the CineNiche website</li>
        </ul>
      </section>

      {/* // Section 3: What Data We Collect
      // - Lists personal and usage data collected by CineNiche
      // - Explains optional data collection for personalization
      // - Notes data sources and child data protection policy
      // - Describes actions that trigger data collection
      */}
      <section className="bg-gray-50 p-8 mb-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          3. What Data We Collect
        </h2>
        <ul className="list-disc pl-6 space-y-2 privacy-policy-subtext">
          <li>Email address (for account login)</li>
          <li>User preferences and watch history</li>
          <li>Cookies and analytics data (IP, device, browser)</li>
          <li>
            We also collect name, phone number, and email for profile
            information
          </li>
          <li>We collect age and gender to best predict your interests.</li>
          <li>
            We may ask about your preferences or interests, including favorite
            genres or platforms you use (voluntarily shared), to help
            personalize your recommendations. This data is optional and not
            required to use CineNiche.
          </li>
          <li>
            We may also receive information from third-party sources, such as
            payment processors or marketing partners, to improve our services
            and verify account information.
          </li>
        </ul>
        <p className="privacy-policy-subtext">
          CineNiche is not intended for children under 13 (or under 16 in the
          EEA). We do not knowingly collect data from children those under the
          age of 18.
        </p>
        <p className="privacy-policy-subtext">
          We collect data when you:
          <ul>
            <li>Create or update your profile</li>
            <li>Stream or search for a movie</li>
            <li>Use features such as rating movies</li>
          </ul>
        </p>
      </section>

      {/* // Section 4: Why We Collect Your Data
      // - Explains the purposes for data collection, including personalization, service improvement, account management, and legal compliance
      */}
      <section className="bg-gray-50 p-8 mb-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          4. Why We Collect Your Data
        </h2>
        <ul className="list-disc pl-6 space-y-2 privacy-policy-subtext">
          <li>To manage your account</li>
          <li>To provide personalized recommendations</li>
          <li>To improve our services</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      {/* // Section 5: Legal Basis for Processing
      // - Lists the lawful grounds under which CineNiche processes user data (consent, contract, legitimate interests, and legal obligations)
      */}
      <section className="bg-gray-50 p-8 mb-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          5. Legal Basis for Processing
        </h2>
        <ul className="list-disc pl-6 space-y-2 privacy-policy-subtext">
          <li>
            <strong>Consent</strong> – for non-essential cookies and marketing
          </li>
          <li>
            <strong>Contract</strong> – to deliver streaming services
          </li>
          <li>
            <strong>Legitimate interests</strong> – analytics & recommendations
          </li>
          <li>
            <strong>Legal obligation</strong> – compliance with law
          </li>
        </ul>
      </section>

      {/* // Section 6: Cookies and Tracking
      // - Describes how CineNiche uses cookies for session management, analytics, and recommendations
      // - Mentions the use of a cookie banner for managing user consent
      */}
      <section className="bg-gray-50 p-8 mb-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          6. Cookies and Tracking
        </h2>
        <p className="privacy-policy-subtext">We use cookies to:</p>
        <ul className="list-disc pl-6 space-y-2 privacy-policy-subtext">
          <li>Maintain your login session</li>
          <li>Understand usage patterns</li>
          <li>Recommend content based on behavior</li>
        </ul>
        <p className="mt-4 privacy-policy-subtext">
          A cookie banner allows you to accept or reject non-essential cookies
          when visiting the site.
        </p>
      </section>

      {/* // Section 7: Data Security
      // - Explains the measures CineNiche uses to protect user data, including HTTPS, secure databases, and access controls
      */}
      <section className="bg-gray-50 p-8 mb-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          7. Data Security
        </h2>
        <p className="privacy-policy-subtext">
          Your data is protected through HTTPS encryption, secure databases, and
          access controls.
        </p>
      </section>

      {/* // Section 8: Sharing Your Data
      // - Details how and why CineNiche shares user data with third-party providers
      // - Covers data sharing for analytics, hosting, communication, legal compliance, and business transfers
      // - Emphasizes GDPR-compliant practices and user notification in case of policy changes
      */}
      <section className="bg-gray-50 p-8 mb-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          8. Sharing Your Data
        </h2>
        <p className="privacy-policy-subtext">
          We may share limited data with third-party service providers such as:
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Analytics platforms</strong> (Google Analytics) for
              understanding usage
            </li>
            <li>
              <strong>Hosting providers</strong> (Azure) for delivering our
              services
            </li>
            <li>
              <strong>Email services</strong> for communication
            </li>
          </ul>
          These third parties are bound by GDPR-compliant agreements and only
          process data as instructed by us. In the event of a merger,
          acquisition, or sale of assets, user data may be part of the
          transferred business assets. We will notify you before your personal
          data is subject to a new privacy policy.
          <br />
          We may share limited data to detect and prevent fraud, enforce our
          terms, or protect the rights and safety of our users and the public.
        </p>
      </section>
      {/* // Section 9: Advertising & Personalization
      // - Explains use of non-identifiable data for content recommendations
      // - States that identifiable user data is not shared for advertising
      // - Notes users can opt out of personalization through account settings
      */}
      <section className="bg-gray-50 p-8 mb-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          9. Advertising & Personalization
        </h2>
        <p className="privacy-policy-subtext">
          We may use non-identifiable data to personalize content or recommend
          movies. We do not share identifiable user data for advertising
          purposes. You may opt out of personalization via your account
          settings.
        </p>
      </section>
      
      {/* // Section 10: Your Rights Under GDPR
      // - Outlines user rights such as access, correction, deletion, objection, and data portability
      // - Describes how users can manage privacy preferences and exercise rights
      // - Provides contact information for submitting GDPR-related requests
      */}
      <section className="bg-gray-50 p-8 mb-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          10. Your Rights Under GDPR
        </h2>
        <ul className="list-disc pl-6 space-y-2 privacy-policy-subtext">
          <li>Access, correct, or delete your data</li>
          <li>Restrict or object to processing</li>
          <li>Data portability</li>
          <li>Rectification of Data</li>
          <li>Withdraw consent at any time</li>
          <li>Opt out of automated decision making</li>
          <li>
            The right to object – You may object to certain types of processing,
            such as direct marketing or profiling based on legitimate interests.
          </li>
          <li>
            The right to be informed – You have the right to know how your data
            is collected, used, and shared. This policy is part of that effort.
          </li>
        </ul>
        <p className="mt-4 privacy-policy-subtext">
          If you believe your rights have been violated, you have the right to
          lodge a complaint with your local data protection authority in the EEA
          or with the UK’s Information Commissioner’s Office (ICO).
        </p>
        <p className="privacy-policy-subtext">You may also:</p>
        <ul className="privacy-policy-subtext">
          <li className="privacy-policy-subtext">
            Adjust cookie preferences using our cookie banner
          </li>
          <li className="privacy-policy-subtext">
            Update or delete your profile information in your account settings
          </li>
          <li className="privacy-policy-subtext">
            Opt out of marketing communications via email footer links
          </li>
          <li className="privacy-policy-subtext">
            Disable personalized recommendations by adjusting your profile
            settings
          </li>
          <li className="privacy-policy-subtext">
            Contact us directly to manage any of the above
          </li>
        </ul>
        <p className="mt-4 privacy-policy-subtext">
          Contact us at privacy@CineNiche.com to exercise any of these rights.
        </p>
      </section>

      {/* // Section 11: Data Retention
      // - Explains how long user data is stored and under what conditions
      // - Mentions user-initiated deletion and storage location in the U.S.
      // - Notes compliance with international data transfer standards
      */}
      <section className="bg-gray-50 p-8 mb-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          11. Data Retention
        </h2>
        <p className="privacy-policy-subtext">
          We retain your data as long as your account is active or as legally
          required. You may request deletion anytime. Your data may be stored on
          secure servers located in the United States. Where applicable, we
          ensure compliance through EU-approved Standard Contractual Clauses.
        </p>
      </section>

      {/* // Section 12: International Data Transfers
      // - Explains how CineNiche protects user data when transferring it outside the EEA
      // - Mentions safeguards like Standard Contractual Clauses and adequacy decisions
      */}
      <section className="bg-gray-50 p-8 mb-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          12. International Data Transfers
        </h2>
        <p className="privacy-policy-subtext">
          If we transfer your data outside of the European Economic Area (EEA),
          we will ensure that appropriate safeguards are in place, such as using
          Standard Contractual Clauses or relying on adequacy decisions.
        </p>
      </section>

      {/* // Section 13: Automated Decision-Making
      // - States that CineNiche does not use automated decision-making or profiling in processing personal data
      */}
      <section className="bg-gray-50 p-8 mb-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          13. Automated Decision-Making
        </h2>
        <p className="privacy-policy-subtext">
          We do not currently use automated decision-making or profiling in our
          processing of personal data.
        </p>
      </section>

      {/* // Section 14: Updates
      // - Informs users that the privacy policy may change and updates will be reflected with a new revision date
      */}
      <section className="bg-gray-50 p-8 mb-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          14. Updates
        </h2>
        <p className="privacy-policy-subtext">
          We may update this policy. Changes will be posted on this page with a
          new revision date.
        </p>
      </section>
      <br />
      <p className="privacy-policy-subtext">
        Last updated: April 7, 2025
      </p>
    </div>
  );
}

export default PrivacyPolicy;
