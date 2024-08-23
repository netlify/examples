import type { Context } from '@netlify/functions';
import { getDeployStore, getStore } from '@netlify/blobs';

const LINEAR_STORE_NAME = 'linear-updates';

function getBlobsStore(storeName: string) {
  const context = Netlify.context as Context
  const options = { name: storeName, consistency: 'strong' } satisfies Parameters<typeof getStore>[0];
  if (context.deploy.context === 'production') {
    return getStore(options);
  } else {
    return getDeployStore(options);
  }
}

export async function storeLinearUpdateSummary({ id, projectUrl, update, summary}: {id: string, projectUrl: string, update: any, summary: string}) {
  // store the update so we can pull it later.
  return getBlobsStore(LINEAR_STORE_NAME).set(`updates/${id}.json`, JSON.stringify({ update, summary, projectUrl }, null, 2));
}

export async function addNewUpdateToLedger({ id, createdAt }: { id: string, createdAt: string }){
  const store = getBlobsStore(LINEAR_STORE_NAME);
  const currentLedger = await store.get(`update-ledger.json`) || '{}';
  const ledger = JSON.parse(currentLedger) as Record<string, number>;
  ledger[id] = new Date(createdAt).getTime();
  await store.set(`update-ledger.json`, JSON.stringify(ledger, null, 2));
}

export async function deleteLinearUpdateSummary({ id }: { id: string }) {
  return getBlobsStore(LINEAR_STORE_NAME).delete(`updates/${id}.json`);
}

export async function getLinearUpdateSummaries({days}: {days: number}){
  const currentDay = new Date().getTime();
  const lowerBoundaryTime = currentDay - (days * 24 * 60 * 60 * 1000);

  const ledger = JSON.parse(await getBlobsStore(LINEAR_STORE_NAME).get(`update-ledger.json`) || '{}');

  const summaryIds = Object.keys(ledger).filter(id => ledger[id] > lowerBoundaryTime);

  const summaries = await Promise.all(summaryIds.map(async id => {
    const summary = await getBlobsStore(LINEAR_STORE_NAME).get(`updates/${id}.json`);
    return summary && JSON.parse(summary);
  }));

  return summaries;
}
