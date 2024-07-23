import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Translator from "../components/Translator"

function PrivacyPolicy({GlobalState}) {
  const {
    language
  } = GlobalState;

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{Translator({code:language,value:"Privacy Policy"}).props.children}</title>
          <meta name="description" content={`Learn how we collect, use, and protect your personal information. Your privacy is important to us, and we're committed to transparency.`}/>
          <meta property="og:title" content={Translator({code:language,value:"Privacy Policy"}).props.children} />
          <meta property="og:description" content={`Learn how we collect, use, and protect your personal information. Your privacy is important to us, and we're committed to transparency.`} />
        </Helmet>
      </HelmetProvider>
      <main>
        <div className="about-us page narrow-page">
          <div className="page-content">
            <h1>
              <Translator
                code={language}
                value={"Privacy Policy"}
              />
            </h1>
            <br/>
            <strong>
              <Translator
                code={language}
                value={"Effective Date"}
              />
              {": 01/12/2023"}
            </strong>
            <p>
              <Translator
                code={language}
                value={`Welcome to Reserwave! This Privacy Policy outlines how Reserwave ("we," "us," or "our") collects, uses, and protects your personal information when you use our platform. By accessing or using Reserwave, you agree to the terms outlined in this Privacy Policy.`}
              />
            </p>
            <h2>
            {"1. "}
              <Translator
                code={language}
                value={"Information We Collect"}
              />
            </h2>
            <h3>
            {"i) "}
              <Translator
                code={language}
                value={`User Provided Information`}
              />
            </h3>
            <p>
              <Translator
                code={language}
                value={`We may collect personal information that you voluntarily provide when using Reserwave. This may include, but is not limited to:`}
              />
            </p>
            <ul>
              <li>
                <Translator
                  code={language}
                  value={`Name`}
                />
              </li>
              <li>
                <Translator
                  code={language}
                  value={`Email address`}
                />
              </li>
              <li>
                <Translator
                  code={language}
                  value={`Phone number`}
                />
              </li>
              <li>
                <Translator
                  code={language}
                  value={`User preferences`}
                />
              </li>
              </ul>
            <h3>
            {"ii) "}
              <Translator
                code={language}
                value={`Automatically Collected Information`}
              />
            </h3>
            <p>
              <Translator
                code={language}
                value={`We may also collect information automatically as you navigate and interact with Reserwave. This may include:`}
              />
            </p>
            <ul>
              <li>
                <Translator
                  code={language}
                  value={`Device information`}
                />
              </li>
              <li>
                <Translator
                  code={language}
                  value={`IP address`}
                />
              </li>
              <li>
                <Translator
                  code={language}
                  value={`Usage data`}
                />
              </li>
              <li>
                <Translator
                  code={language}
                  value={`Location data`}
                />
              </li>
            </ul>
            <h2>
              {"2. "}
              <Translator
                code={language}
                value={"How We Use Your Information"}
              />
            </h2>
            <p>
              <Translator
                code={language}
                value={`We use the collected information for the following purposes:`}
              />
            </p>
            <ul>
              <li>
                <Translator
                  code={language}
                  value={`To provide and improve our services`}
                />
              </li>
              <li>
                <Translator
                  code={language}
                  value={`To personalize your experience on Reserwave`}
                />
              </li>
              <li>
                <Translator
                  code={language}
                  value={`To communicate with you, including responding to inquiries`}
                />
              </li>
              <li>
                <Translator
                  code={language}
                  value={`To send relevant notifications and updates`}
                />
              </li>
              <li>
                <Translator
                  code={language}
                  value={`To analyze and enhance the security of our platform`}
                />
              </li>
            </ul>
            <h2>
              {"3. "}
              <Translator
                code={language}
                value={"Data Security"}
              />
            </h2>
            <p>
              <Translator
                code={language}
                value={`We take the security of your information seriously and implement reasonable security measures to protect it from unauthorized access, disclosure, alteration, and destruction.`}
              />
            </p>
            <h2>
            {"4. "}
              <Translator
                code={language}
                value={"Sharing of Information"}
              />
            </h2>
            <p>
              <Translator
                code={language}
                value={`We do not sell or share your personal information with third parties for their marketing purposes. We may share your information with third-party service providers who assist us in operating our platform, provided they agree to keep this information confidential.`}
              />
            </p>
            <h2>
            {"5. "}
              <Translator
                code={language}
                value={"Cookies and Tracking Technologies"}
              />
            </h2>
            <p>
              <Translator
                code={language}
                value={`Reserwave uses cookies and similar tracking technologies to enhance your experience on our platform. You can manage your cookie preferences through your browser settings.`}
              />
            </p>
            <h2>
            {"6. "}
              <Translator
                code={language}
                value={"Your Choices"}
              />
            </h2>
            <p>
              <Translator
                code={language}
                value={`You have the right to`}
              />
              {`:`}
            </p>
            <ul>
              <li>
                <Translator
                  code={language}
                  value={`Access, update, or delete your personal information`}
                />
              </li>
              <li>
                <Translator
                  code={language}
                  value={`Opt-out of certain communications`}
                />
              </li>
              <li>
                <Translator
                  code={language}
                  value={`Disable cookies through your browser settings`}
                />
              </li>
            </ul>
            <h2>
            {"7. "}
              <Translator
                code={language}
                value={"Changes to this Privacy Policy"}
              />
            </h2>
            <p>
              <Translator
                code={language}
                value={`We may update this Privacy Policy to reflect changes in our data practices. The effective date will be revised accordingly, and we encourage you to review this page periodically for any updates.`}
              />
            </p>
            <h2>
            {"8. "}
              <Translator
                code={language}
                value={"Contact Us"}
              />
            </h2>
            <p>
              <Translator
                code={language}
                value={`If you have any questions or concerns regarding this Privacy Policy, please contact us at`}
              />
              {` `}
              <a href="mailto:hello@reserwave.com">hello@reserwave.com</a>
            </p>
          </div>
        </div>
      </main>
    </>
  )
}

export default PrivacyPolicy
