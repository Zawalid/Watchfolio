import LegalLayout from '@/layouts/LegalLayout';

const sections = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'license', title: 'License to Use' },
  { id: 'user-content', title: 'User Content' },
  { id: 'no-warranties', title: 'No Warranties' },
  { id: 'liability', title: 'Limitation of Liability' },
  { id: 'indemnification', title: 'Indemnification' },
  { id: 'governing-law', title: 'Governing Law' },
];

export default function TermsOfService() {
  return (
    <LegalLayout title='Terms of Service' lastUpdated='July 12, 2025' sections={sections}>
      <section id='introduction'>
        <h2>Introduction</h2>
        <p>
          Welcome to Watchfolio! These terms and conditions outline the rules and regulations for the use of our website
          and services. By accessing this website, we assume you accept these terms and conditions in full. Do not
          continue to use Watchfolio if you do not accept all of the terms and conditions stated on this page.
        </p>
      </section>

      <section id='license'>
        <h2>License to Use</h2>
        <p>
          Unless otherwise stated, Watchfolio and/or its licensors own the intellectual property rights for all material
          on Watchfolio. All intellectual property rights are reserved. You may view and/or print pages from
          watchfolio.app for your own personal use subject to restrictions set in these terms and conditions.
        </p>
        <p>You must not:</p>
        <ul>
          <li>Republish material from Watchfolio</li>
          <li>Sell, rent or sub-license material from Watchfolio</li>
          <li>Reproduce, duplicate or copy material from Watchfolio</li>
          <li>Redistribute content from Watchfolio, unless content is specifically made for redistribution.</li>
        </ul>
      </section>

      <section id='user-content'>
        <h2>User Content</h2>
        <p>
          In these Terms of Service, “your user content” means material (including without limitation text, images,
          audio material, video material and audio-visual material) that you submit to our website, for whatever
          purpose. You grant to us a worldwide, irrevocable, non-exclusive, royalty-free license to use, reproduce,
          adapt, publish, translate and distribute your user content in any existing or future media.
        </p>
      </section>

      <section id='no-warranties'>
        <h2>No Warranties</h2>
        <p>
          This website is provided “as is,” with all faults, and Watchfolio makes no express or implied representations
          or warranties, of any kind related to this website or the materials contained on this website. Additionally,
          nothing contained on this website shall be construed as providing consult or advice to you.
        </p>
      </section>

      <section id='liability'>
        <h2>Limitation of Liability</h2>
        <p>
          In no event shall Watchfolio, nor any of its officers, directors and employees, be liable to you for anything
          arising out of or in any way connected with your use of this website, whether such liability is under
          contract, tort or otherwise, and Watchfolio, including its officers, directors and employees shall not be
          liable for any indirect, consequential or special liability arising out of or in any way related to your use
          of this website.
        </p>
      </section>

      <section id='indemnification'>
        <h2>Indemnification</h2>
        <p>
          You hereby indemnify to the fullest extent Watchfolio from and against any and all liabilities, costs,
          demands, causes of action, damages and expenses (including reasonable attorney’s fees) arising out of or in
          any way related to your breach of any of the provisions of these Terms.
        </p>
      </section>

      <section id='governing-law'>
        <h2>Governing Law & Jurisdiction</h2>
        <blockquote>
          <p>Any legal disputes will be handled in the jurisdiction where our company is based.</p>
        </blockquote>
        <p>
          These Terms will be governed by and construed in accordance with the laws of the jurisdiction of our company's
          location, and you submit to the non-exclusive jurisdiction of the state and federal courts located in that
          jurisdiction for the resolution of any disputes.
        </p>
      </section>
    </LegalLayout>
  );
}
