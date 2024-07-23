import React from 'react';
import { Link } from "react-router-dom"
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Translator from "../components/Translator"

function TermsAndConditions({GlobalState}) {
  const {
    language
  } = GlobalState;

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{Translator({code:language,value:"Terms & Conditions"}).props.children}</title>
          <meta property="og:title" content={Translator({code:language,value:"Terms & Conditions"}).props.children} />
          <meta name="description" content={`Review our terms of service and understand your rights and obligations. By using our services, you agree to abide by these terms.`}/>
          <meta property="og:description" content={`Review our terms of service and understand your rights and obligations. By using our services, you agree to abide by these terms.`} />
        </Helmet>
      </HelmetProvider>
      <main>
        <div className="about-us page narrow-page">
          <div className="page-content">
            <h1>
              <Translator
                code={language}
                value={"Terms & Conditions"}
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
                value={`Welcome to Reserwave! These terms and conditions ("Terms") constitute a legally binding agreement between you and Reserwave. Please read these Terms carefully before using our platform. By accessing or using Reserwave, you agree to comply with and be bound by these Terms. If you do not agree with any part of these Terms, please refrain from using our platform.`}
              />
            </p>
            <h2>
            {"1. "}
              <Translator
                code={language}
                value={"Acceptance of Terms"}
              />
            </h2>
            <p>
              <Translator
                code={language}
                value={`By using Reserwave, you agree to these Terms and any updates or modifications that may occur. Your continued use of the platform after such modifications constitutes your acceptance of the revised Terms.`}
              />
            </p>
            <h2>
              {"2. "}
              <Translator
                code={language}
                value={"Description of Services"}
              />
            </h2>
            <p>
              <Translator
                code={language}
                value={`Reserwave provides a comprehensive platform for users to discover and make reservations at nearby stores across various niches. Our goal is to enhance your experience by connecting you with a diverse range of businesses, making it easier for you to explore and patronize local establishments.`}
              />
            </p>
            <h2>
              {"3. "}
              <Translator
                code={language}
                value={"User Data Privacy"}
              />
            </h2>
            <p>
              <Translator
                code={language}
                value={`At Reserwave, we take the privacy and security of your data seriously. Any information collected from users is securely stored and is not made public or sold to third parties. Please refer to our `}
              />
              {` `}
              <Link to={"/privacy-policy"}>Privacy Policy</Link>
              {` `}
              <Translator
                code={language}
                value={` for a detailed overview of how we collect, use, and protect your data.`}
              />
            </p>
            <h2>
            {"4. "}
              <Translator
                code={language}
                value={"Store Information Confidentiality"}
              />
            </h2>
            <p>
              <Translator
                code={language}
                value={`We want to assure our partner stores that we prioritize the confidentiality of their information. Reserwave does not disclose any details about store revenue, reservation statistics, or any other proprietary data belonging to the stores on our platform.`}
              />
            </p>
            <h2>
            {"5. "}
              <Translator
                code={language}
                value={"User Eligibility"}
              />
            </h2>
            <p>
              <Translator
                code={language}
                value={`You must be eligible to use Reserwave. By using our platform, you confirm that you meet any age or other eligibility requirements.`}
              />
            </p>
            <h2>
            {"6. "}
              <Translator
                code={language}
                value={"User Conduct"}
              />
            </h2>
            <p>
              <Translator
                code={language}
                value={`Users must adhere to acceptable behavior on Reserwave. Any misuse or violation of these terms may result in the termination of your account. We encourage a respectful and positive community for all users.`}
              />
            </p>
            <h2>
            {"7. "}
              <Translator
                code={language}
                value={"Termination of Accounts"}
              />
            </h2>
            <p>
              <Translator
                code={language}
                value={`We reserve the right to terminate user accounts or services under conditions deemed appropriate by Reserwave. This includes cases of non-compliance with these Terms or any inappropriate behavior on the platform.`}
              />
            </p>
            <h2>
            {"8. "}
              <Translator
                code={language}
                value={"Limitation of Liability"}
              />
            </h2>
            <p>
              <Translator
                code={language}
                value={`Reserwave is not liable for any damages incurred by users or stores. Users and stores use our platform at their own risk. We strive to provide a reliable and secure platform, but we cannot guarantee uninterrupted, error-free, or secure access to our services.`}
              />
            </p>
            <h2>
            {"9. "}
              <Translator
                code={language}
                value={"Changes to Terms"}
              />
            </h2>
            <p>
              <Translator
                code={language}
                value={`We may update or modify these Terms, and users will be informed of such changes through notifications on the platform or via email. Continued use of Reserwave constitutes acceptance of the updated Terms.`}
              />
            </p>
            <h2>
            {"10. "}
              <Translator
                code={language}
                value={"Contact Information"}
              />
            </h2>
            <p>
              <Translator
                code={language}
                value={`For questions or concerns, please contact us at `}
              />
              {` `}
              <a href="mailto:hello@reserwave.com">hello@reserwave.com</a>
              {`. `}
              <Translator
                code={language}
                value={`We value your feedback and are here to assist you.`}
              />
            </p>
            <h2>
            {"11. "}
              <Translator
                code={language}
                value={"Entire Agreement"}
              />
            </h2>
            <p>
              <Translator
                code={language}
                value={`These Terms constitute the entire agreement between users and Reserwave, superseding any prior agreements, discussions, or understandings.`}
              />
            </p>
            <h2>
              {"12. "}
              <Translator
                code={language}
                value={"Severability"}
              />
            </h2>
            <p>
              <Translator
                code={language}
                value={`If any part of these Terms is found to be unenforceable, the remainder of the Terms will remain in effect.`}
              />
            </p>
          </div>
        </div>
      </main>
    </>
  )
}

export default TermsAndConditions
