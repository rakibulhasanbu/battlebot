const BASE = 'https://api.brightdata.com/datasets/v3';

interface DatasetInput {
  url: string;
  [key: string]: unknown;
}

export async function triggerCollection(
  datasetId: string,
  inputs: DatasetInput[]
): Promise<string> {
  const res = await fetch(
    `${BASE}/trigger?dataset_id=${datasetId}&format=json&uncompressed_webhook=true`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.BRIGHTDATA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    }
  );
  if (!res.ok) throw new Error(`BrightData trigger failed: ${await res.text()}`);
  const data = await res.json() as { snapshot_id: string };
  return data.snapshot_id;
}

export async function pollUntilReady(
  snapshotId: string,
  maxWaitMs = 120_000
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const res = await fetch(`${BASE}/progress/${snapshotId}`, {
      headers: { Authorization: `Bearer ${process.env.BRIGHTDATA_API_KEY}` },
    });
    if (!res.ok) throw new Error(`BrightData progress check failed: ${await res.text()}`);
    const data = await res.json() as { status: string };
    if (data.status === 'ready') return;
    if (data.status === 'failed') throw new Error('BrightData collection failed');
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error('BrightData collection timed out');
}

export async function downloadSnapshot<T>(snapshotId: string): Promise<T[]> {
  const res = await fetch(`${BASE}/snapshot/${snapshotId}?format=json`, {
    headers: { Authorization: `Bearer ${process.env.BRIGHTDATA_API_KEY}` },
  });
  if (!res.ok) throw new Error(`BrightData download failed: ${await res.text()}`);
  return res.json() as Promise<T[]>;
}

export async function collectDataset<T>(
  datasetId: string,
  inputs: DatasetInput[]
): Promise<T[]> {
  const snapshotId = await triggerCollection(datasetId, inputs);
  await pollUntilReady(snapshotId);
  return downloadSnapshot<T>(snapshotId);
}
