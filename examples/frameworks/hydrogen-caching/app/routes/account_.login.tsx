import type {LoaderFunctionArgs} from '@netlify/remix-runtime';

export async function loader({request, context}: LoaderFunctionArgs) {
  return context.customerAccount.login();
}
