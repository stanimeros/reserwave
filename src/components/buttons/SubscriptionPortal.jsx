import React, { useEffect, useState } from 'react'
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import Translator from '../Translator';

function SubscriptionPortal({GlobalState}) {
  const {
    language
  } = GlobalState;

	const executeSubscriptionPortalRedirect = async () => {
		window.location.href = "https://billing.stripe.com/p/login/28og2EfQO5fq84U7ss"; //Production
		//window.location.href = "https://billing.stripe.com/p/login/test_6oE6oZcg4gEWgFybII"; //Test
  };

  return (
		<button className='button subscription-portal' onClick={executeSubscriptionPortalRedirect}>
			<Translator
				code={language}
				value={`Manage Your Subscription`}
			/>
		</button>
  )
}

export default SubscriptionPortal
