import { faker } from "@faker-js/faker";
import type {
  AstroCookieGetOptions,
  AstroCookieSetOptions,
  AstroCookies,
} from "astro";

const COOKIE_KEY = "__ntl_demo_user_240830__";

const DEFAULT_COOKIE_OPTIONS: AstroCookieSetOptions | AstroCookieGetOptions = {
  path: "/",
  maxAge: 60,
  sameSite: "strict",
  httpOnly: true,
};

export type User = {
  name: string;
  email: string;
  id: string;
};

type GetCurrentUserOptions = {
  cookies: AstroCookies;
};

export async function getCurrentUser(options: GetCurrentUserOptions) {
  const currentUserCookie = options.cookies.get(
    COOKIE_KEY,
    DEFAULT_COOKIE_OPTIONS as AstroCookieGetOptions
  );
  if (!currentUserCookie) return undefined;

  const { name, email, id } = JSON.parse(currentUserCookie.value);
  if (name && email && id) return { name, email, id };

  return undefined;
}

export async function generateUser() {
  const name = faker.person.fullName();
  const email = faker.internet.email();
  const id = faker.string.uuid();

  return { name, email, id };
}

type SignInOptions = {
  user: User;
  cookies: AstroCookies;
};

export async function signIn(options: SignInOptions) {
  const { user, cookies } = options;
  cookies.set(
    COOKIE_KEY,
    JSON.stringify(user),
    DEFAULT_COOKIE_OPTIONS as AstroCookieSetOptions
  );
}

export async function signOut(options: GetCurrentUserOptions) {
  options.cookies.delete(
    COOKIE_KEY,
    DEFAULT_COOKIE_OPTIONS as AstroCookieSetOptions
  );
}
