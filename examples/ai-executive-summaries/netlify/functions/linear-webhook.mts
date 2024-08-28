import type { Context } from '@netlify/functions';
import { createHmac } from 'node:crypto';
import { summarizeUpdate } from './utils/ai.mts';
import { addNewUpdateToLedger, deleteLinearUpdateSummary, storeLinearUpdateSummary } from './utils/storage.mts';


export default async (request: Request, context: Context) => {
  const payload = await request.text();
  const { action, data, type, url } = JSON.parse(payload);

  if(context.deploy.context === 'production') {
    // for production, verify the linear signature
    const signature = createHmac("sha256", Netlify.env.get('WEBHOOK_SECRET') || '').update(payload).digest("hex");
    if (signature !== request.headers.get('linear-signature')) {
      return new Response(null, { status: 400 })
    }
  }else {
    // non production can have a simple API key check
    if (Netlify.env.get('INTERNAL_API_KEY') !== request.headers.get('x-api-key')) {
      return new Response(null, { status: 400 })
    }
  }


  if (type.toLowerCase() === 'projectupdate'){

    const { id, createdAt, body } = data;

    if(action === 'create' || action === 'update'){

      // use AI to summarize the update.
      const summary = await summarizeUpdate(body) || body;

      await storeLinearUpdateSummary({
        id,
        projectUrl: url,
        update: data,
        summary,
      });

      // append this project update to the ledger.
      // the ledger will be used to identify the right updates within a time range
      if(action === 'create'){
        await addNewUpdateToLedger({id, createdAt})
      }

    }else if(action === 'remove') {
      // don't include updates that have been removed in linear
      await deleteLinearUpdateSummary({id});
    }
  }

  // tell linear, all is good
  return new Response(null, { status: 200 })
}


export const config = {
  path: "/linear-webhook"
};
