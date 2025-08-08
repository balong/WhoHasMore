import fs from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'csv-parse/sync';

const root = process.cwd();
const outQuestions = path.join(root, 'public/data/questions/pool.json');
const outFactsDir = path.join(root, 'public/data/metrics');
const srcDir = path.join(root, 'public/data/sources');
const bpsDir = path.join(srcDir, 'bps');
await fs.mkdir(bpsDir, { recursive: true });

const YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019];

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return await res.text();
}

async function fetchToFile(url, filePath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(filePath, buf);
}

async function listYearCsvs(year) {
  const base = `https://www2.census.gov/econ/bps/Place/${year}/`;
  try {
    const html = await fetchText(base);
    const hrefs = Array.from(html.matchAll(/href\s*=\s*"([^"]+)"/gi)).map((m) => m[1]);
    const files = hrefs
      .filter((h) => /\.csv$/i.test(h) && /place/i.test(h))
      .map((h) => (h.startsWith('http') ? h : base + h.replace(/^\.\//, '')));
    return files;
  } catch (e) {
    console.warn('List failed', year, String(e));
    return [];
  }
}

function safeNumber(v) {
  if (v === null || v === undefined) return NaN;
  const s = String(v).replace(/[,]/g, '').trim();
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

// ----- Normalizers -----
function normalizeBps(csvText, yearGuess) {
  const rows = parse(csvText, { columns: true, skip_empty_lines: true });
  const facts = [];
  for (const r of rows) {
    const place = (r['Name'] || r['Place Name'] || r['Place'] || '').toString().trim();
    const state = (r['State'] || r['StateAbbr'] || r['St'] || '').toString().trim();
    const units = safeNumber(r['YTD Units'] ?? r['Total Units'] ?? r['Units'] ?? r['YTDUnits']);
    const year = Number(r['Year']) || yearGuess || undefined;
    if (!place || !state || !Number.isFinite(units)) continue;
    facts.push({
      metric_id: 'building_permits_units',
      metric_name: 'Building permits (units authorized)',
      unit: 'units',
      geography_type: 'city',
      geography_id: `${place}, ${state}`,
      geography_name: `${place}, ${state}`,
      year,
      value: units,
      source_name: 'US Census Building Permits Survey (Place)',
      source_url: 'https://www.census.gov/construction/bps/'
    });
  }
  return facts;
}

function normalizeCityPopulation(csvText) {
  const rows = parse(csvText, { columns: true, skip_empty_lines: true });
  const facts = [];
  for (const r of rows) {
    if (r.SUMLEV !== '162') continue; // place rows
    const name = r.NAME?.toString().trim();
    const state = r.STNAME?.toString().trim();
    const pop = safeNumber(r.POPESTIMATE2024 || r.POPESTIMATE2023 || r.POPESTIMATE2022 || r.POPESTIMATE2021);
    if (!name || !state || !Number.isFinite(pop)) continue;
    facts.push({
      metric_id: 'population_total',
      metric_name: 'Population',
      unit: 'people',
      geography_type: 'city',
      geography_id: `${name}, ${state}`,
      geography_name: `${name}, ${state}`,
      year: 2024,
      value: pop,
      source_name: 'US Census Population Estimates (SUB-EST2024)',
      source_url: 'https://www2.census.gov/programs-surveys/popest/datasets/2020-2024/cities/totals/sub-est2024.csv'
    });
  }
  return facts;
}

function normalizeLibraries(csvText) {
  // Expect columns: STABR, CITY, VISITS (or TOTVISIT), YEAREND
  const rows = parse(csvText, { columns: true, skip_empty_lines: true });
  const byCity = new Map();
  for (const r of rows) {
    const state = (r.STABR || r.State || '').toString().trim();
    const city = (r.CITY || r.City || r.MCITY || '').toString().trim();
    const visits = safeNumber(r.VISITS || r.TOTVISIT || r.VISITS_FY);
    if (!city || !state || !Number.isFinite(visits)) continue;
    const key = `${city}, ${state}`;
    byCity.set(key, (byCity.get(key) || 0) + visits);
  }
  return Array.from(byCity.entries()).map(([geo, value]) => ({
    metric_id: 'library_visits',
    metric_name: 'Public library visits',
    unit: 'visits',
    geography_type: 'city',
    geography_id: geo,
    geography_name: geo,
    year: undefined,
    value,
    source_name: 'IMLS Public Libraries Survey',
    source_url: 'https://www.imls.gov/research-evaluation/data-collection/public-libraries-survey'
  }));
}

function normalizeTransit(csvText) {
  // Expect columns: Agency, City, State, Year/Month, UPT or RIDERSHIP
  const rows = parse(csvText, { columns: true, skip_empty_lines: true });
  const byCity = new Map();
  for (const r of rows) {
    const city = (r.City || r.Principal_City || '').toString().trim();
    const state = (r.State || r.ST || '').toString().trim();
    const upt = safeNumber(r.UPT || r.RIDERSHIP || r.Total_UPT);
    if (!city || !state || !Number.isFinite(upt)) continue;
    const key = `${city}, ${state}`;
    byCity.set(key, (byCity.get(key) || 0) + upt);
  }
  return Array.from(byCity.entries()).map(([geo, value]) => ({
    metric_id: 'transit_ridership',
    metric_name: 'Transit ridership (unlinked passenger trips)',
    unit: 'trips',
    geography_type: 'city',
    geography_id: geo,
    geography_name: geo,
    year: undefined,
    value,
    source_name: 'FTA National Transit Database',
    source_url: 'https://www.transit.dot.gov/ntd'
  }));
}

function normalizeNps(csvText) {
  // Expect columns: ParkName, State, Year, RecreationVisitors
  const rows = parse(csvText, { columns: true, skip_empty_lines: true });
  const byStateYear = new Map();
  for (const r of rows) {
    const state = (r.State || r.StateCode || '').toString().trim();
    const year = Number(r.Year || r.YEAR);
    const visits = safeNumber(r.RecreationVisitors || r.Visitors);
    if (!state || !Number.isFinite(year) || !Number.isFinite(visits)) continue;
    const key = `${state}|${year}`;
    byStateYear.set(key, (byStateYear.get(key) || 0) + visits);
  }
  return Array.from(byStateYear.entries()).map(([k, value]) => {
    const [state, year] = k.split('|');
    return {
      metric_id: 'nps_visitors',
      metric_name: 'National Park visitors',
      unit: 'visits',
      geography_type: 'state',
      geography_id: state,
      geography_name: state,
      year: Number(year),
      value,
      source_name: 'NPS Visitor Use Statistics',
      source_url: 'https://irma.nps.gov/STATS/'
    };
  });
}

function normalizeEconomics(csvText) {
  // Expect columns: State, Metric, Year, Value
  const rows = parse(csvText, { columns: true, skip_empty_lines: true });
  const allowedMetrics = new Set([
    'Median Household Income', 'Unemployment Rate', 'Minimum Wage', 'Cost of Living Index'
  ]);
  const facts = [];
  for (const r of rows) {
    const state = (r.State || '').toString().trim();
    const metric = (r.Metric || '').toString().trim();
    const year = Number(r.Year || r.year);
    const value = safeNumber(r.Value);
    
    if (!state || !allowedMetrics.has(metric) || !Number.isFinite(value)) continue;
    
    // Determine unit based on metric
    let unit;
    switch (metric) {
      case 'Median Household Income':
        unit = 'dollars';
        break;
      case 'Unemployment Rate':
        unit = 'percent';
        break;
      case 'Minimum Wage':
        unit = 'dollars per hour';
        break;
      case 'Cost of Living Index':
        unit = 'index (100 = national average)';
        break;
      default:
        unit = 'units';
    }
    
    facts.push({
      metric_id: `economics_${metric.toLowerCase().replace(/[^a-z]+/g,'_')}`,
      metric_name: metric,
      unit: unit,
      geography_type: 'state',
      geography_id: state,
      geography_name: state,
      year,
      value: metric === 'Median Household Income' ? Math.round(value) : Math.round(value * 100) / 100,
      source_name: 'Bureau of Labor Statistics & Census Bureau',
      source_url: 'https://www.bls.gov/ & https://www.census.gov/'
    });
  }
  return facts;
}

function normalizeEducation(csvText) {
  // Expect columns: State, Metric, Year, Value
  const rows = parse(csvText, { columns: true, skip_empty_lines: true });
  const allowedMetrics = new Set([
    'High School Graduation Rate', 'College Attainment Rate', 'Average SAT Score', 'Education Spending Per Pupil'
  ]);
  const facts = [];
  for (const r of rows) {
    const state = (r.State || '').toString().trim();
    const metric = (r.Metric || '').toString().trim();
    const year = Number(r.Year || r.year);
    const value = safeNumber(r.Value);
    
    if (!state || !allowedMetrics.has(metric) || !Number.isFinite(value)) continue;
    
    // Determine unit based on metric
    let unit;
    switch (metric) {
      case 'High School Graduation Rate':
      case 'College Attainment Rate':
        unit = 'percent';
        break;
      case 'Average SAT Score':
        unit = 'points';
        break;
      case 'Education Spending Per Pupil':
        unit = 'dollars per student';
        break;
      default:
        unit = 'units';
    }
    
    facts.push({
      metric_id: `education_${metric.toLowerCase().replace(/[^a-z]+/g,'_')}`,
      metric_name: metric,
      unit: unit,
      geography_type: 'state',
      geography_id: state,
      geography_name: state,
      year,
      value: metric === 'Education Spending Per Pupil' ? Math.round(value) : Math.round(value * 10) / 10,
      source_name: 'Department of Education & Census Bureau',
      source_url: 'https://www.ed.gov/ & https://www.census.gov/'
    });
  }
  return facts;
}

function normalizeHealth(csvText) {
  // Expect columns: State, Metric, Year, Value
  const rows = parse(csvText, { columns: true, skip_empty_lines: true });
  const allowedMetrics = new Set([
    'Life Expectancy', 'Obesity Rate', 'Infant Mortality Rate', 'Healthcare Spending Per Capita'
  ]);
  const facts = [];
  for (const r of rows) {
    const state = (r.State || '').toString().trim();
    const metric = (r.Metric || '').toString().trim();
    const year = Number(r.Year || r.year);
    const value = safeNumber(r.Value);
    
    if (!state || !allowedMetrics.has(metric) || !Number.isFinite(value)) continue;
    
    // Determine unit based on metric
    let unit;
    switch (metric) {
      case 'Life Expectancy':
        unit = 'years';
        break;
      case 'Obesity Rate':
        unit = 'percent';
        break;
      case 'Infant Mortality Rate':
        unit = 'per 1,000 births';
        break;
      case 'Healthcare Spending Per Capita':
        unit = 'dollars per person';
        break;
      default:
        unit = 'units';
    }
    
    facts.push({
      metric_id: `health_${metric.toLowerCase().replace(/[^a-z]+/g,'_')}`,
      metric_name: metric,
      unit: unit,
      geography_type: 'state',
      geography_id: state,
      geography_name: state,
      year,
      value: metric === 'Healthcare Spending Per Capita' ? Math.round(value) : Math.round(value * 10) / 10,
      source_name: 'CDC & Centers for Medicare & Medicaid Services',
      source_url: 'https://www.cdc.gov/ & https://www.cms.gov/'
    });
  }
  return facts;
}

function normalizeTransportation(csvText) {
  // Expect columns: State, Metric, Year, Value
  const rows = parse(csvText, { columns: true, skip_empty_lines: true });
  const allowedMetrics = new Set([
    'Highway Miles Per Capita', 'Structurally Deficient Bridges', 'EV Charging Stations', 'Public Transit Ridership Per Capita'
  ]);
  const facts = [];
  for (const r of rows) {
    const state = (r.State || '').toString().trim();
    const metric = (r.Metric || '').toString().trim();
    const year = Number(r.Year || r.year);
    const value = safeNumber(r.Value);
    
    if (!state || !allowedMetrics.has(metric) || !Number.isFinite(value)) continue;
    
    // Determine unit based on metric
    let unit;
    switch (metric) {
      case 'Highway Miles Per Capita':
        unit = 'miles per person';
        break;
      case 'Structurally Deficient Bridges':
        unit = 'percent of bridges';
        break;
      case 'EV Charging Stations':
        unit = 'stations';
        break;
      case 'Public Transit Ridership Per Capita':
        unit = 'trips per person';
        break;
      default:
        unit = 'units';
    }
    
    facts.push({
      metric_id: `transportation_${metric.toLowerCase().replace(/[^a-z]+/g,'_')}`,
      metric_name: metric,
      unit: unit,
      geography_type: 'state',
      geography_id: state,
      geography_name: state,
      year,
      value: metric === 'EV Charging Stations' ? Math.round(value) : Math.round(value * 100) / 100,
      source_name: 'DOT Bureau of Transportation Statistics',
      source_url: 'https://www.bts.gov/'
    });
  }
  return facts;
}

function normalizeGovernment(csvText) {
  // Expect columns: State, Metric, Year, Value
  const rows = parse(csvText, { columns: true, skip_empty_lines: true });
  const allowedMetrics = new Set([
    'Voter Turnout', 'State Income Tax Rate', 'Government Employment Rate', 'Property Tax Rate'
  ]);
  const facts = [];
  for (const r of rows) {
    const state = (r.State || '').toString().trim();
    const metric = (r.Metric || '').toString().trim();
    const year = Number(r.Year || r.year);
    const value = safeNumber(r.Value);
    
    if (!state || !allowedMetrics.has(metric) || !Number.isFinite(value)) continue;
    
    // Determine unit based on metric
    let unit;
    switch (metric) {
      case 'Voter Turnout':
        unit = 'percent';
        break;
      case 'State Income Tax Rate':
      case 'Property Tax Rate':
        unit = 'percent';
        break;
      case 'Government Employment Rate':
        unit = 'percent of workforce';
        break;
      default:
        unit = 'units';
    }
    
    facts.push({
      metric_id: `government_${metric.toLowerCase().replace(/[^a-z]+/g,'_')}`,
      metric_name: metric,
      unit: unit,
      geography_type: 'state',
      geography_id: state,
      geography_name: state,
      year,
      value: Math.round(value * 100) / 100,
      source_name: 'Election Commissions & Tax Foundation',
      source_url: 'https://www.eac.gov/ & https://taxfoundation.org/'
    });
  }
  return facts;
}

function normalizeAgriculture(csvText) {
  // Expect columns: State, Metric, Year, Value
  const rows = parse(csvText, { columns: true, skip_empty_lines: true });
  const allowedMetrics = new Set([
    'Corn Production', 'Farmland Percentage', 'Renewable Energy Percentage', 'Forest Coverage Percentage'
  ]);
  const facts = [];
  for (const r of rows) {
    const state = (r.State || '').toString().trim();
    const metric = (r.Metric || '').toString().trim();
    const year = Number(r.Year || r.year);
    const value = safeNumber(r.Value);
    
    if (!state || !allowedMetrics.has(metric) || !Number.isFinite(value)) continue;
    
    // Determine unit based on metric
    let unit;
    switch (metric) {
      case 'Corn Production':
        unit = 'thousand bushels';
        break;
      case 'Farmland Percentage':
      case 'Renewable Energy Percentage':
      case 'Forest Coverage Percentage':
        unit = 'percent';
        break;
      default:
        unit = 'units';
    }
    
    facts.push({
      metric_id: `agriculture_${metric.toLowerCase().replace(/[^a-z]+/g,'_')}`,
      metric_name: metric,
      unit: unit,
      geography_type: 'state',
      geography_id: state,
      geography_name: state,
      year,
      value: metric === 'Corn Production' ? Math.round(value) : Math.round(value * 100) / 100,
      source_name: 'USDA & Department of Energy',
      source_url: 'https://www.usda.gov/ & https://www.energy.gov/'
    });
  }
  return facts;
}

function normalizeCulture(csvText) {
  // Expect columns: State, Metric, Year, Value
  const rows = parse(csvText, { columns: true, skip_empty_lines: true });
  const allowedMetrics = new Set([
    'Museums Per Capita', 'Restaurants Per Capita', 'Breweries Per Capita', 'Entertainment Venues Per Capita'
  ]);
  const facts = [];
  for (const r of rows) {
    const state = (r.State || '').toString().trim();
    const metric = (r.Metric || '').toString().trim();
    const year = Number(r.Year || r.year);
    const value = safeNumber(r.Value);
    
    if (!state || !allowedMetrics.has(metric) || !Number.isFinite(value)) continue;
    
    facts.push({
      metric_id: `culture_${metric.toLowerCase().replace(/[^a-z]+/g,'_')}`,
      metric_name: metric,
      unit: 'per 100k people',
      geography_type: 'state',
      geography_id: state,
      geography_name: state,
      year,
      value: Math.round(value * 100) / 100,
      source_name: 'Cultural & Business Databases',
      source_url: 'https://www.census.gov/ & https://data.gov/'
    });
  }
  return facts;
}

// State populations (2023 estimates) for per-capita calculations
const STATE_POPULATIONS = {
  'Alabama': 5108468,
  'Alaska': 733571,
  'Arizona': 7431344,
  'Arkansas': 3067732,
  'California': 38965193,
  'Colorado': 5877610,
  'Connecticut': 3617176,
  'Delaware': 1031890,
  'Florida': 23244842,
  'Georgia': 11029227,
  'Hawaii': 1435138,
  'Idaho': 1981202,
  'Illinois': 12549689,
  'Indiana': 6862199,
  'Iowa': 3207004,
  'Kansas': 2940546,
  'Kentucky': 4555777,
  'Louisiana': 4573749,
  'Maine': 1402734,
  'Maryland': 6196519,
  'Massachusetts': 7001399,
  'Michigan': 10037261,
  'Minnesota': 5748829,
  'Mississippi': 2940057,
  'Missouri': 6224160,
  'Montana': 1132812,
  'Nebraska': 1978379,
  'Nevada': 3194176,
  'New Hampshire': 1402054,
  'New Jersey': 9290841,
  'New Mexico': 2114371,
  'New York': 19571216,
  'North Carolina': 10835491,
  'North Dakota': 787424,
  'Ohio': 11785935,
  'Oklahoma': 4053824,
  'Oregon': 4233358,
  'Pennsylvania': 12961683,
  'Rhode Island': 1095962,
  'South Carolina': 5441748,
  'South Dakota': 919318,
  'Tennessee': 7126489,
  'Texas': 30503301,
  'Utah': 3417734,
  'Vermont': 647464,
  'Virginia': 8715698,
  'Washington': 7812880,
  'West Virginia': 1770071,
  'Wisconsin': 5961370,
  'Wyoming': 584057
};

function normalizeCrime(csvText) {
  // Expect columns: State, Offense, Year, Value (rate or count)
  const rows = parse(csvText, { columns: true, skip_empty_lines: true });
  const allowedOffenses = new Set([
    'Murder', 'Homicide', 'Robbery', 'Burglary', 'Motor Vehicle Theft', 'Arson',
    'Vandalism', 'Liquor Law Violations', 'DUI', 'Public Intoxication', 'Disorderly Conduct', 'Shoplifting', 'Gambling'
  ]);
  const facts = [];
  for (const r of rows) {
    const state = (r.State || '').toString().trim();
    const offense = (r.Offense || r.offense || '').toString().trim();
    const year = Number(r.Year || r.year);
    const rawValue = safeNumber(r.Value || r.Count || r.Rate);
    
    if (!state || !allowedOffenses.has(offense) || !Number.isFinite(rawValue)) continue;
    
    // Convert to per-capita rate (per 100,000 people)
    const statePopulation = STATE_POPULATIONS[state];
    if (!statePopulation) continue; // Skip if we don't have population data
    
    const perCapitaRate = (rawValue / statePopulation) * 100000;
    
    facts.push({
      metric_id: `crime_${offense.toLowerCase().replace(/[^a-z]+/g,'_')}`,
      metric_name: offense,
      unit: 'per 100k people',
      geography_type: 'state',
      geography_id: state,
      geography_name: state,
      year,
      value: Math.round(perCapitaRate * 10) / 10, // Round to 1 decimal place
      source_name: 'FBI Crime Data Explorer (per capita)',
      source_url: 'https://cde.ucr.fbi.gov/'
    });
  }
  return facts;
}

function normalizeHousing(csvText) {
  // Expect columns: State, Year, Index
  const rows = parse(csvText, { columns: true, skip_empty_lines: true });
  const facts = [];
  for (const r of rows) {
    const state = (r.State || r.STATE || '').toString().trim();
    const year = Number(r.Year || r.YEAR);
    const index = safeNumber(r.Index || r.HPI || r.HPI_AT);
    if (!state || !Number.isFinite(year) || !Number.isFinite(index)) continue;
    facts.push({
      metric_id: 'fhfa_hpi',
      metric_name: 'House Price Index (FHFA)',
      unit: 'index',
      geography_type: 'state',
      geography_id: state,
      geography_name: state,
      year,
      value: index,
      source_name: 'FHFA HPI',
      source_url: 'https://www.fhfa.gov/DataTools/Downloads/Pages/House-Price-Index.aspx'
    });
  }
  return facts;
}

function normalizeAirQuality(csvText, yearGuess) {
  // EPA annual_aqi_by_county_YYYY.csv: columns include State, county, Good Days, Moderate Days, Unhealthy Days, Very Unhealthy Days, Hazardous Days, Median AQI
  const rows = parse(csvText, { columns: true, skip_empty_lines: true });
  const byState = new Map();
  for (const r of rows) {
    const state = (r.State || '').toString().trim();
    const unhealthy = safeNumber(r['Unhealthy Days']) + safeNumber(r['Very Unhealthy Days']) + safeNumber(r['Hazardous Days']);
    const good = safeNumber(r['Good Days']);
    if (!state || (!Number.isFinite(unhealthy) && !Number.isFinite(good))) continue;
    const agg = byState.get(state) || { unhealthy: 0, good: 0 };
    if (Number.isFinite(unhealthy)) agg.unhealthy += unhealthy;
    if (Number.isFinite(good)) agg.good += good;
    byState.set(state, agg);
  }
  const facts = [];
  for (const [state, v] of byState) {
    facts.push({
      metric_id: 'aqi_unhealthy_days',
      metric_name: 'Unhealthy air quality days',
      unit: 'days',
      geography_type: 'state',
      geography_id: state,
      geography_name: state,
      year: yearGuess,
      value: v.unhealthy,
      source_name: 'EPA AirData Annual AQI by County',
      source_url: `https://aqs.epa.gov/aqsweb/airdata/annual_aqi_by_county_${yearGuess}.csv`
    });
    facts.push({
      metric_id: 'aqi_good_days',
      metric_name: 'Good air quality days',
      unit: 'days',
      geography_type: 'state',
      geography_id: state,
      geography_name: state,
      year: yearGuess,
      value: v.good,
      source_name: 'EPA AirData Annual AQI by County',
      source_url: `https://aqs.epa.gov/aqsweb/airdata/annual_aqi_by_county_${yearGuess}.csv`
    });
  }
  return facts;
}

function buildPairs(facts, maxPairsPerGroup = 200000) {
  const groups = new Map();
  for (const f of facts) {
    const k = `${f.metric_id}|${f.year ?? 'NA'}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(f);
  }
  const rng = (n) => Math.floor(Math.random() * n);
  const pairs = [];
  for (const [gkey, arr] of groups) {
    if (arr.length < 2) continue;
    const attempts = Math.min(maxPairsPerGroup, arr.length * 20);
    const seen = new Set();
    for (let i = 0; i < attempts; i++) {
      const a = arr[rng(arr.length)];
      const b = arr[rng(arr.length)];
      if (!a || !b || a.geography_id === b.geography_id) continue;
      const [A, B] = a.geography_name < b.geography_name ? [a, b] : [b, a];
      const key = `${gkey}|${A.geography_id}|${B.geography_id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const correct = A.value >= B.value ? 'A' : 'B';
      pairs.push({
        id: key,
        category: a.metric_name,
        question: `Which ${A.geography_type === 'state' ? 'state' : 'city'} has more ${a.metric_name.toLowerCase()}?`,
        optionA: { name: A.geography_name, value: A.value, unit: a.unit },
        optionB: { name: B.geography_name, value: B.value, unit: a.unit },
        correctAnswer: correct,
        explanation: `${A.geography_name}: ${A.value.toLocaleString()} ${a.unit} vs ${B.geography_name}: ${B.value.toLocaleString()} ${a.unit}. Source: ${a.source_name}.`
      });
    }
  }
  return pairs;
}

async function main() {
  // Attempt to download EPA air quality data (years)
  const airDir = path.join(srcDir, 'air');
  await fs.mkdir(airDir, { recursive: true });
  const airYears = [2024, 2023, 2020];
  for (const y of airYears) {
    const f = path.join(airDir, `annual_aqi_by_county_${y}.csv`);
    try {
      if (!(await fs.stat(f).catch(() => null))) {
        console.log('Downloading EPA AQI', y);
        await fetchToFile(`https://aqs.epa.gov/aqsweb/airdata/annual_aqi_by_county_${y}.csv`, f);
      }
    } catch (e) {
      console.warn('EPA download failed', y, String(e));
    }
  }

  // Attempt to download BPS CSVs (best-effort)
  const discovered = new Set();
  for (const y of YEARS) {
    const urls = await listYearCsvs(y);
    urls.forEach((u) => discovered.add(u));
  }
  for (const url of discovered) {
    const fn = url.split('/').pop();
    const dest = path.join(bpsDir, fn);
    try {
      await fetchToFile(url, dest);
    } catch {}
  }

  const facts = [];
  // Parse any local BPS files
  const bpsFiles = (await fs.readdir(bpsDir).catch(() => [])).filter((f) => f.toLowerCase().endsWith('.csv'));
  for (const file of bpsFiles) {
    const p = path.join(bpsDir, file);
    const guessYear = Number(file.match(/(20\d{2})/)?.[1]);
    const csv = await fs.readFile(p, 'utf8');
    facts.push(...normalizeBps(csv, guessYear));
  }
  // Parse city population (for allowlist)
  const popPath = path.join(srcDir, 'pop', 'sub-est2024.csv');
  let popFacts = [];
  try {
    const popCsv = await fs.readFile(popPath, 'utf8');
    popFacts = normalizeCityPopulation(popCsv);
    facts.push(...popFacts);
  } catch {}

  // Libraries
  const libDir = path.join(srcDir, 'libraries');
  for (const f of (await fs.readdir(libDir).catch(() => [])).filter((f) => f.endsWith('.csv'))) {
    try {
      const text = await fs.readFile(path.join(libDir, f), 'utf8');
      if (text.trim().startsWith('<')) continue;
      facts.push(...normalizeLibraries(text));
    } catch {}
  }
  // Transit
  const tranDir = path.join(srcDir, 'transit');
  for (const f of (await fs.readdir(tranDir).catch(() => [])).filter((f) => f.endsWith('.csv'))) {
    try {
      const text = await fs.readFile(path.join(tranDir, f), 'utf8');
      if (text.trim().startsWith('<')) continue;
      facts.push(...normalizeTransit(text));
    } catch {}
  }
  // NPS
  const npsDir = path.join(srcDir, 'nps');
  for (const f of (await fs.readdir(npsDir).catch(() => [])).filter((f) => f.endsWith('.csv'))) {
    try {
      const text = await fs.readFile(path.join(npsDir, f), 'utf8');
      if (text.trim().startsWith('<')) continue;
      facts.push(...normalizeNps(text));
    } catch {}
  }
  // Crime
  const crimeDir = path.join(srcDir, 'crime');
  for (const f of (await fs.readdir(crimeDir).catch(() => [])).filter((f) => f.endsWith('.csv'))) {
    try {
      const text = await fs.readFile(path.join(crimeDir, f), 'utf8');
      if (text.trim().startsWith('<')) continue;
      facts.push(...normalizeCrime(text));
    } catch {}
  }
  // Housing (FHFA)
  const houseDir = path.join(srcDir, 'housing');
  for (const f of (await fs.readdir(houseDir).catch(() => [])).filter((f) => f.endsWith('.csv'))) {
    try {
      const text = await fs.readFile(path.join(houseDir, f), 'utf8');
      if (text.trim().startsWith('<')) continue;
      facts.push(...normalizeHousing(text));
    } catch {}
  }
  // Economics
  const economicsDir = path.join(srcDir, 'economics');
  for (const f of (await fs.readdir(economicsDir).catch(() => [])).filter((f) => f.endsWith('.csv'))) {
    try {
      const text = await fs.readFile(path.join(economicsDir, f), 'utf8');
      if (text.trim().startsWith('<')) continue;
      facts.push(...normalizeEconomics(text));
    } catch {}
  }
  // Education
  const educationDir = path.join(srcDir, 'education');
  for (const f of (await fs.readdir(educationDir).catch(() => [])).filter((f) => f.endsWith('.csv'))) {
    try {
      const text = await fs.readFile(path.join(educationDir, f), 'utf8');
      if (text.trim().startsWith('<')) continue;
      facts.push(...normalizeEducation(text));
    } catch {}
  }
  // Health
  const healthDir = path.join(srcDir, 'health');
  for (const f of (await fs.readdir(healthDir).catch(() => [])).filter((f) => f.endsWith('.csv'))) {
    try {
      const text = await fs.readFile(path.join(healthDir, f), 'utf8');
      if (text.trim().startsWith('<')) continue;
      facts.push(...normalizeHealth(text));
    } catch {}
  }
  // Transportation
  const transportationDir = path.join(srcDir, 'transportation');
  for (const f of (await fs.readdir(transportationDir).catch(() => [])).filter((f) => f.endsWith('.csv'))) {
    try {
      const text = await fs.readFile(path.join(transportationDir, f), 'utf8');
      if (text.trim().startsWith('<')) continue;
      facts.push(...normalizeTransportation(text));
    } catch {}
  }
  // Government
  const governmentDir = path.join(srcDir, 'government');
  for (const f of (await fs.readdir(governmentDir).catch(() => [])).filter((f) => f.endsWith('.csv'))) {
    try {
      const text = await fs.readFile(path.join(governmentDir, f), 'utf8');
      if (text.trim().startsWith('<')) continue;
      facts.push(...normalizeGovernment(text));
    } catch {}
  }
  // Agriculture
  const agricultureDir = path.join(srcDir, 'agriculture');
  for (const f of (await fs.readdir(agricultureDir).catch(() => [])).filter((f) => f.endsWith('.csv'))) {
    try {
      const text = await fs.readFile(path.join(agricultureDir, f), 'utf8');
      if (text.trim().startsWith('<')) continue;
      facts.push(...normalizeAgriculture(text));
    } catch {}
  }
  // Culture
  const cultureDir = path.join(srcDir, 'culture');
  for (const f of (await fs.readdir(cultureDir).catch(() => [])).filter((f) => f.endsWith('.csv'))) {
    try {
      const text = await fs.readFile(path.join(cultureDir, f), 'utf8');
      if (text.trim().startsWith('<')) continue;
      facts.push(...normalizeCulture(text));
    } catch {}
  }
  // Air quality (EPA downloaded files)
  for (const y of airYears) {
    const f = path.join(airDir, `annual_aqi_by_county_${y}.csv`);
    try {
      if (await fs.stat(f).catch(() => null)) {
        const text = await fs.readFile(f, 'utf8');
        if (text.trim().startsWith('<')) continue;
        facts.push(...normalizeAirQuality(text, y));
      }
    } catch {}
  }

  // Build allowlist of populous cities (>= 100k) to keep city questions recognizable
  const allowed = new Set(popFacts.filter((f) => f.value >= 100000).map((f) => f.geography_id));
  const filteredFacts = facts.filter((f) => f.geography_type !== 'city' || allowed.has(f.geography_id));

  await fs.mkdir(outFactsDir, { recursive: true });
  await fs.writeFile(path.join(outFactsDir, 'facts.json'), JSON.stringify(filteredFacts, null, 2));

  const pairs = buildPairs(filteredFacts, 200000);
  await fs.mkdir(path.dirname(outQuestions), { recursive: true });
  await fs.writeFile(outQuestions, JSON.stringify(pairs, null, 2));
  console.log(`Wrote ${pairs.length} questions to ${outQuestions}`);
}

await main().catch((e) => {
  console.error(e);
  process.exit(1);
}); 