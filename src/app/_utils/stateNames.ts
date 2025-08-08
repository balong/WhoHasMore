// State abbreviation to full name mapping
const STATE_ABBREVIATIONS: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
  'DC': 'District of Columbia', 'PR': 'Puerto Rico'
};

/**
 * Expands state abbreviations and cleans up location names for better readability
 */
export function expandLocationName(name: string): string {
  // Handle formats like "City, ST" or "City city, ST"
  const parts = name.split(', ');
  if (parts.length === 2) {
    const [cityPart, statePart] = parts;
    const stateAbbr = statePart.trim().toUpperCase();
    
    if (STATE_ABBREVIATIONS[stateAbbr]) {
      return `${cityPart}, ${STATE_ABBREVIATIONS[stateAbbr]}`;
    }
  }
  
  // Handle standalone state abbreviations
  const upperName = name.toUpperCase();
  if (STATE_ABBREVIATIONS[upperName]) {
    return STATE_ABBREVIATIONS[upperName];
  }
  
  return name;
}

/**
 * Makes location names more readable by removing redundant words like "city"
 */
export function cleanLocationName(name: string): string {
  const expanded = expandLocationName(name);
  
  // Remove redundant "city" suffix for cleaner display
  return expanded.replace(/ city,/, ',').replace(/ city$/, '');
} 