import LegalLayout from '@/layouts/LegalLayout';

const sections = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'information-collection', title: 'Information We Collect' },
  { id: 'how-we-use', title: 'How We Use Information' },
  { id: 'log-data', title: 'Log Data & Cookies' },
  { id: 'service-providers', title: 'Service Providers' },
  { id: 'security', title: 'Security' },
  { id: 'childrens-privacy', title: "Children's Privacy" },
  { id: 'changes-to-policy', title: 'Changes to This Policy' },
];

export default function PrivacyPolicy() {
  return (
    <LegalLayout title='Privacy Policy' lastUpdated='July 12, 2025' sections={sections}>
      <section id='introduction'>
        <h2>Introduction</h2>
        <p>
          Your privacy is important to us. It is Watchfolio's policy to respect your privacy regarding any information
          we may collect from you across our website, and other sites we own and operate. This Privacy Policy document
          contains types of information that is collected and recorded by Watchfolio and how we use it.
        </p>
      </section>

      <section id='information-collection'>
        <h2>Information We Collect</h2>
        <p>
          We only ask for personal information when we truly need it to provide a service to you. We collect it by fair
          and lawful means, with your knowledge and consent. We also let you know why we're collecting it and how it
          will be used. For a better experience, while using our Service, we may require you to provide us with certain
          personally identifiable information, including but not limited to your name, email address, and usage data.
        </p>
      </section>

      <section id='how-we-use'>
        <h2>How We Use Your Information</h2>
        <p>We use the information we collect in various ways, including to:</p>
        <ul>
          <li>Provide, operate, and maintain our website</li>
          <li>Improve, personalize, and expand our website</li>
          <li>Understand and analyze how you use our website</li>
          <li>Develop new products, services, features, and functionality</li>
          <li>
            Communicate with you for customer service, to provide you with updates and other information relating to the
            website, and for marketing and promotional purposes
          </li>
        </ul>
      </section>

      <section id='log-data'>
        <h2>Log Data & Cookies</h2>
        <p>
          Watchfolio follows a standard procedure of using log files. These files log visitors when they visit websites.
          The information collected by log files include internet protocol (IP) addresses, browser type, Internet
          Service Provider (ISP), and date and time stamps. We also use cookies to store information like your
          preferences to optimize your experience.
        </p>
      </section>

      <section id='service-providers'>
        <h2>Service Providers</h2>
        <p>
          We may employ third-party companies and individuals to facilitate our Service, to provide the Service on our
          behalf, or to assist us in analyzing how our Service is used. These third parties have access to your Personal
          Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any
          other purpose.
        </p>
      </section>

      <section id='security'>
        <h2>Security</h2>
        <p>
          We value your trust in providing us your Personal Information, thus we are striving to use commercially
          acceptable means of protecting it. But remember that no method of transmission over the internet, or method of
          electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
        </p>
      </section>

      <section id='childrens-privacy'>
        <h2>Children's Privacy</h2>
        <p>
          Our Services do not address anyone under the age of 13. We do not knowingly collect personal identifiable
          information from children under 13. In the case we discover that a child under 13 has provided us with
          personal information, we immediately delete this from our servers.
        </p>
      </section>

      <section id='changes-to-policy'>
        <h2>Changes to This Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for
          any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes
          are effective immediately, after they are posted on this page.
        </p>
      </section>
    </LegalLayout>
  );
}
