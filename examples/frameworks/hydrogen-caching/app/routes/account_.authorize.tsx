import type {LoaderFunctionArgs} from '@netlify/remix-runtime';

export async function loader({context}: LoaderFunctionArgs) {
  return context.customerAccount.authorize();
}
