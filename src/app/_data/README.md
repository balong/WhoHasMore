# Data Ingestion (No API)

This folder stores downloaded CSVs and processed JSON question pools.

Sources used initially (all downloadable flat files):
- Census Building Permits Survey (place-level CSV)
- BEA GDP by State (CSV)
- NHTSA FARS fatalities by state (CSV)

Output format:
- `metrics/*.json` normalized facts
- `questions/pool.json` generated unique question pairs 