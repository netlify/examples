import { type Context } from '@netlify/functions';

export default async (request: Request, context: Context) => {

  const execSummaryUrl = new URL(context.site.url || Netlify.env.get('URL') || '');
  execSummaryUrl.pathname = '/summarize-recent-updates';
  execSummaryUrl.searchParams.set('days', '7');

  const execSummary = await fetch(execSummaryUrl, {
    headers: {
      'x-api-key': Netlify.env.get('INTERNAL_API_KEY') || ''
    }
  });

  if(!execSummary.ok){
    console.error('failed to fetch exec summary', execSummary.status);
    return;
  }

  const execSummaryText = await execSummary.text();

  console.log({execSummaryText});

}


export const config = {
  schedule: '0 0 * * 1', // run every Monday at 12am
}
