import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Translator from "../components/Translator";

function Page404({GlobalState}) {
  const {
    language
  } = GlobalState;

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{Translator({code:language, value:"Page Not Found"}).props.children}</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
      </HelmetProvider>
      <main>
        <div className="page">
          <h2>
            <Translator
              code={language}
              value={"404 - Not Found"}
            />
          </h2>
          <p>
            <Translator
              code={language}
              value={"Sorry, the page you are looking for does not exist."}
            />
          </p>
        </div>
      </main>
    </>
  )
}

export default Page404
