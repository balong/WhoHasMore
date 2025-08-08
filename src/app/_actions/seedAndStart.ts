'use server';

import fs from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import { revalidatePath } from 'next/cache';

// NOTE: In a real app, move writing to a DB. Here we persist to the repo folder.

interface Fact {
  metric_id: string;
  metric_name: string;
  unit: string;
  geography_type: 'state' | 'city';
  geography_id: string;
  geography_name: string;
  year?: number;
  value: number;
  source_name: string;
  source_url: string;
}

interface Question {
  id: string;
  category: string;
  question: string;
  optionA: { name: string; value: number; unit: string };
  optionB: { name: string; value: number; unit: string };
  correctAnswer: 'A' | 'B';
  explanation: string;
}

interface NormalizeOptions {
  metricId: string;
  metricName: string;
  unit: string;
  geoField: string;
  valueField: string;
  yearField?: string;
  geoType: 'state' | 'city';
  source: string;
  sourceUrl: string;
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function downloadToFile(url: string, filePath: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(filePath, buf);
}

function normalizeFacts(rows: Record<string, unknown>[], opts: NormalizeOptions): Fact[] {
  const { metricId, metricName, unit, geoField, valueField, yearField, geoType, source, sourceUrl } = opts;
  return rows.map((r) => ({
    metric_id: metricId,
    metric_name: metricName,
    unit,
    geography_type: geoType,
    geography_id: String(r[geoField]),
    geography_name: String(r[geoField]),
    year: yearField ? Number(r[yearField]) : undefined,
    value: Number(String(r[valueField]).replace(/[,]/g, '')),
    source_name: source,
    source_url: sourceUrl,
  }));
}

function buildQuestionPairs(facts: Fact[]): Question[] {
  // Group by metric_id+year
  const key = (f: Fact) => `${f.metric_id}|${f.year ?? 'NA'}`;
  const groups = new Map<string, Fact[]>();
  for (const f of facts) {
    const k = key(f);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(f);
  }

  const pairs: Question[] = [];
  for (const [gkey, arr] of groups) {
    // generate all unique pairs randomly limited
    for (let i = 0; i < Math.min(arr.length, 80); i++) {
      const a = arr[Math.floor(Math.random() * arr.length)];
      const b = arr[Math.floor(Math.random() * arr.length)];
      if (!a || !b || a.geography_id === b.geography_id) continue;
      // canonical order for uniqueness
      const [A, B] = a.geography_name < b.geography_name ? [a, b] : [b, a];
      const askedKey = `${gkey}|${A.geography_id}|${B.geography_id}`;
      const correct = A.value >= B.value ? 'A' : 'B';
      pairs.push({
        id: askedKey,
        category: facts[0].metric_name,
        question: `Which ${A.geography_type === 'state' ? 'state' : 'city'} has more ${facts[0].metric_name.toLowerCase()}?`,
        optionA: { name: A.geography_name, value: A.value, unit: facts[0].unit },
        optionB: { name: B.geography_name, value: B.value, unit: facts[0].unit },
        correctAnswer: correct,
        explanation: `${A.geography_name}: ${A.value.toLocaleString()} ${facts[0].unit} vs ${B.geography_name}: ${B.value.toLocaleString()} ${facts[0].unit}. Source: ${facts[0].source_name}.`,
      });
    }
  }
  return pairs;
}

export async function seedAndStart() {
  const base = path.join(process.cwd(), 'src/app/_data');
  const rawDir = path.join(base, 'raw');
  const metricsDir = path.join(base, 'metrics');
  const questionsDir = path.join(base, 'questions');
  await ensureDir(rawDir);
  await ensureDir(metricsDir);
  await ensureDir(questionsDir);

  // Example downloadable files (replace with latest year links you download once)
  const files = [
    {
      url: 'https://www2.census.gov/econ/bps/Place/2023/CY2023-Place.csv',
      path: path.join(rawDir, 'bps_place_2023.csv'),
      parse: (csv: string): Fact[] => {
        const rows = parse(csv, { columns: true, skip_empty_lines: true }) as Record<string, unknown>[];
        return normalizeFacts(rows, {
          metricId: 'building_permits',
          metricName: 'Building permits (units authorized)',
          unit: 'units',
          geoField: 'Name',
          valueField: 'YTD Units',
          yearField: 'Year',
          geoType: 'city',
          source: 'Census BPS',
          sourceUrl: 'https://www.census.gov/construction/bps/'
        });
      }
    },
    {
      url: 'https://apps.bea.gov/regional/zip/SAGDP2N.zip', // GDP by state current dollars
      path: path.join(rawDir, 'bea_gdp_state.zip'),
      parse: async (): Promise<Fact[]> => {
        // Placeholder: assume you unzip externally and drop a CSV named gdp_state.csv in rawDir
        // For demo purposes, skip processing here.
        return [];
      }
    },
    {
      url: 'https://static.nhtsa.gov/nhtsa/downloads/FARS/2019/National/FARS2019NatCSV.zip',
      path: path.join(rawDir, 'fars_2019.zip'),
      parse: async (): Promise<Fact[]> => {
        return [];
      }
    }
  ];

  const allFacts: Fact[] = [];
  for (const f of files) {
    try {
      await downloadToFile(f.url, f.path);
      const buf = await fs.readFile(f.path, 'utf8').catch(() => '');
      const facts = typeof f.parse === 'function' ? (await (f.parse as (data: string) => Promise<Fact[]> | Fact[])(buf)) : [];
      allFacts.push(...facts);
    } catch {
      // Silently continue if download/parse fails
    }
  }

  // Fallback: if nothing parsed, seed a tiny synthetic set from existing gameData
  if (allFacts.length === 0) {
    const fallback: Fact[] = [
      { metric_id: 'population', metric_name: 'Population', unit: 'people', geography_type: 'city', geography_id: 'New York', geography_name: 'New York City', year: 2020, value: 8336817, source_name: 'US Census', source_url: 'https://www.census.gov' },
      { metric_id: 'population', metric_name: 'Population', unit: 'people', geography_type: 'city', geography_id: 'Los Angeles', geography_name: 'Los Angeles', year: 2020, value: 3979576, source_name: 'US Census', source_url: 'https://www.census.gov' }
    ];
    allFacts.push(...fallback);
  }

  await fs.writeFile(path.join(metricsDir, 'facts.json'), JSON.stringify(allFacts, null, 2));
  const questions = buildQuestionPairs(allFacts);
  await fs.writeFile(path.join(questionsDir, 'pool.json'), JSON.stringify(questions, null, 2));

  // Revalidate home to let the client pick up new data
  revalidatePath('/');
} 