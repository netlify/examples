import {redirect} from '@netlify/remix-runtime';

export async function loader() {
  return redirect('/account/orders');
}
