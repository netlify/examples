import type { Context } from '@netlify/functions';
import { getLinearUpdateSummaries } from './utils/storage.mts';

const healthMap = {
  'offTrack': {
    icon: '🔴',
    dialog: 'off track',
    sort: 0
  },
  'atRisk': {
    icon: '🟡',
    dialog: 'at risk',
    sort: 1
  },
  'onTrack': {
    icon: '🟢',
    dialog: 'on track',
    sort: 2
  },
};

export default async (request: Request, context: Context) => {

  // non production can have a simple API key check

  if (Netlify.env.get('INTERNAL_API_KEY') !== request.headers.get('x-api-key')) {
    return new Response(null, { status: 400 })
  }

  const parsedURL = new URL(request.url);
  const days = parseInt(parsedURL.searchParams.get('days') || '7');

  const summaries = await getLinearUpdateSummaries({days});

  // count all by current health
  const numRed = summaries.filter(s => s.update.health === 'offTrack').length;
  const numYellow = summaries.filter(s => s.update.health === 'atRisk').length;
  const numGreen = summaries.filter(s => s.update.health === 'onTrack').length;

  // Build up the update content for the summary
  const execSummary = `
*AI Generated Exec Summary*:

${summaries.length} Project updates _(trailing ${days} days)_. ${numRed ? ` ${numRed} 🔴 ` : ''}${numYellow ? ` ${numYellow} 🟡 ` : ''}${numGreen ? ` ${numGreen} 🟢` : ''}
${
  summaries.sort((a,b)=>{
    // order the updates by health to surface the
    // most at risk plans first
    return healthMap[a.update.health].sort - healthMap[b.update.health].sort;
  }).map(s => {

    const {update, projectUrl, summary} = s;
    const {health, project, slugId, infoSnapshot} = update;

    const towardTarget = infoSnapshot.targetDate ? `${ healthMap[health].dialog} for ${ infoSnapshot.targetDate }` : 'No target date';

return `
${healthMap[health].icon} *[${project.name}](${projectUrl})* _${towardTarget}_
${summary} _[full update](${projectUrl}#projectUpdate-${slugId})_
`
  }).join('')
}
`;

  return new Response(execSummary, { status: 200 });
}


export const config = {
  path: "/summarize-recent-updates",
};
