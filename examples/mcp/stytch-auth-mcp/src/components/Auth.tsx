import React from "react";
import {
  StytchLogin,
  IdentityProvider as BaseIdentityProvider,
  useStytch,
  useStytchUser,
  StytchProvider
} from "@stytch/react";
import { useEffect, useMemo } from "react";
import {
  OAuthProviders,
  OTPMethods,
  Products,
} from "@stytch/vanilla-js";
import type {
  StytchEvent,
  StytchLoginConfig,
} from "@stytch/vanilla-js";
import {createStytchUIClient} from "@stytch/react/ui";

// We initialize the Stytch client using our project's public token which can be found in the Stytch dashboard
const stytch = createStytchUIClient(
    import.meta.env.PUBLIC_STYTCH_PUBLIC_TOKEN || ""
);


export const withStytchProvider = (Component: React.FC)  => {
  return function() {
    return <StytchProvider stytch={stytch}><Component /></StytchProvider>
  }
}

/**
 * A higher-order component that enforces a login requirement for the wrapped component.
 * If the user is not logged in, the user is redirected to the login page and the
 * current URL is stored in localStorage to enable return after authentication.
 */
export const withLoginRequired = (Component: React.FC) => () => {
  const { user, fromCache, isInitialized } = useStytchUser();

  useEffect(() => {
    if(!isInitialized) return
    if (!user && !fromCache) {
      localStorage.setItem("returnTo", window.location.href);
      window.location.href = "/login";
    }
  }, [user, fromCache, isInitialized]);

  if (!user) {
    return null;
  }
  return <Component />;
};

/**
 * The other half of the withLoginRequired flow
 * Redirects the user to a specified URL stored in local storage or a default location.
 * Behavior:
 * - Checks for a `returnTo` entry in local storage to determine the redirection target.
 * - If `returnTo` exists, clears its value from local storage and navigates to the specified URL.
 * - If `returnTo` does not exist, redirects the user to the default '/todos' location.
 */
const onLoginComplete = () => {
  const returnTo = localStorage.getItem("returnTo");
  if (returnTo) {
    localStorage.removeItem("returnTo");
    window.location.href = returnTo;
  } else {
    window.location.href = "/todos";
  }
};

/*
 * Login configures and renders the StytchLogin component which is a prebuilt UI component for auth powered by Stytch.
 *
 * This component accepts style, config, and callbacks props. To learn more about possible options review the documentation at
 * https://stytch.com/docs/sdks/javascript-sdk#ui-configs.
 */

const loginConfig = {
  products: [Products.otp, Products.oauth],
  otpOptions: {
    expirationMinutes: 10,
    methods: [OTPMethods.Email],
  },
  oauthOptions: {
    providers: [{ type: OAuthProviders.Google }],
    loginRedirectURL: window.location.origin + "/authenticate",
    signupRedirectURL: window.location.origin + "/authenticate",
  },
  enableShadowDOM: true,
} satisfies StytchLoginConfig;

export const Login = withStytchProvider(() => {
  const handleOnLoginComplete = (evt: StytchEvent) => {
    if (evt.type !== "AUTHENTICATE_FLOW_COMPLETE") return;
    onLoginComplete();
  };

  return (
    <StytchLogin
      config={loginConfig}
      callbacks={{ onEvent: handleOnLoginComplete }}
    />
  );
});

/**
 * The Authentication callback page implementation. Handles completing the login flow after OAuth
 */
export const Authenticate = withStytchProvider(() => {
  const client = useStytch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) return;

    client.oauth
      .authenticate(token, { session_duration_minutes: 60 })
      .then(() => onLoginComplete());
  }, [client]);

  return <>Loading...</>;
});

export const IdentityProvider = withStytchProvider(withLoginRequired(BaseIdentityProvider))

export const Logout = withStytchProvider(function () {
  const stytch = useStytch();
  const { user } = useStytchUser();

  if (!user) return null;

  return <button type="submit" className="primary" onClick={() => stytch.session.revoke()}> Log Out </button>;
});
