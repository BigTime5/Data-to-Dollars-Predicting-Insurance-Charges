export interface InsuranceRecord {
  age: number;
  sex: string;
  bmi: number;
  children: number;
  smoker: string;
  region: string;
  charges: number;
}

export interface ValidationRecord {
  age: number;
  sex: string;
  bmi: number;
  children: number;
  smoker: string;
  region: string;
  predicted_charges?: number;
}

export interface CleaningStats {
  totalRows: number;
  cleanedRows: number;
  droppedRows: number;
  negativeAgesFixed: number;
  sexNormalized: number;
  dollarSignsRemoved: number;
  missingValues: number;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') { inQuotes = !inQuotes; }
    else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
    else { current += char; }
  }
  result.push(current.trim());
  return result;
}

function normalizeSex(val: string): string | null {
  const v = val.toLowerCase().trim();
  if (['female', 'f', 'woman'].includes(v)) return 'female';
  if (['male', 'm', 'man'].includes(v)) return 'male';
  return null;
}

function normalizeRegion(val: string): string | null {
  const v = val.toLowerCase().trim();
  if (['southwest', 'southeast', 'northwest', 'northeast'].includes(v)) return v;
  return null;
}

function parseDollarNumber(val: string): number | null {
  const cleaned = val.replace(/[$,]/g, '').trim();
  if (!cleaned || cleaned === 'nan' || cleaned === '') return null;
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

export function loadAndCleanData(csvText: string): { data: InsuranceRecord[]; stats: CleaningStats } {
  const lines = csvText.trim().split('\n');
  const stats: CleaningStats = {
    totalRows: lines.length - 1,
    cleanedRows: 0,
    droppedRows: 0,
    negativeAgesFixed: 0,
    sexNormalized: 0,
    dollarSignsRemoved: 0,
    missingValues: 0,
  };

  const data: InsuranceRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length < 7) { stats.droppedRows++; stats.missingValues++; continue; }

    let age = parseFloat(cols[0]);
    const sexRaw = cols[1];
    let bmi = parseDollarNumber(cols[2]);
    let children = parseFloat(cols[3]);
    const smokerRaw = cols[4];
    const regionRaw = cols[5];
    let charges = parseDollarNumber(cols[6]);

    if (isNaN(age) || !sexRaw || bmi === null || isNaN(children) || !smokerRaw || !regionRaw || charges === null) {
      stats.droppedRows++;
      stats.missingValues++;
      continue;
    }

    if (age < 0) { age = Math.abs(age); stats.negativeAgesFixed++; }
    if (children < 0) children = 0;

    const sex = normalizeSex(sexRaw);
    if (!sex) { stats.droppedRows++; continue; }
    if (sexRaw.toLowerCase() !== sex) stats.sexNormalized++;

    const region = normalizeRegion(regionRaw);
    if (!region) { stats.droppedRows++; continue; }

    const smoker = smokerRaw.toLowerCase().trim() === 'yes' ? 'yes' : 'no';

    if (cols[6].includes('$')) stats.dollarSignsRemoved++;

    data.push({ age, sex, bmi, children, smoker, region, charges });
  }

  stats.cleanedRows = data.length;
  return { data, stats };
}

export function loadValidationData(csvText: string): ValidationRecord[] {
  const lines = csvText.trim().split('\n');
  const data: ValidationRecord[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length < 6) continue;
    const age = parseFloat(cols[0]);
    const sex = normalizeSex(cols[1]) || cols[1];
    const bmi = parseFloat(cols[2]);
    const children = parseFloat(cols[3]);
    const smoker = cols[4].toLowerCase().trim();
    const region = normalizeRegion(cols[5]) || cols[5];
    if (isNaN(age) || isNaN(bmi)) continue;
    data.push({ age, sex, bmi, children: isNaN(children) ? 0 : children, smoker, region });
  }
  return data;
}

// Simple prediction model approximating the Random Forest from the notebook
// Based on observed patterns: smoker is the dominant factor, then age, bmi
export function predictCharges(record: { age: number; sex: string; bmi: number; children: number; smoker: string; region: string }): number {
  let base = -1200;
  base += record.age * 260;
  base += record.bmi * 320;
  base += record.children * 475;

  if (record.smoker === 'yes') {
    base += 23800;
    // Smokers with high BMI pay much more
    if (record.bmi > 30) base += (record.bmi - 30) * 1450;
  }

  if (record.sex === 'female') base -= 130;

  const regionAdj: Record<string, number> = { northeast: 500, northwest: 200, southeast: -200, southwest: -300 };
  base += regionAdj[record.region] || 0;

  return Math.max(base, 1000);
}

export function computeStats(data: InsuranceRecord[]) {
  const charges = data.map(d => d.charges).sort((a, b) => a - b);
  const n = charges.length;
  const mean = charges.reduce((s, v) => s + v, 0) / n;
  const median = n % 2 === 0 ? (charges[n / 2 - 1] + charges[n / 2]) / 2 : charges[Math.floor(n / 2)];
  const std = Math.sqrt(charges.reduce((s, v) => s + (v - mean) ** 2, 0) / n);
  return { count: n, mean, median, min: charges[0], max: charges[n - 1], std };
}

export function getDistributionData(data: InsuranceRecord[], field: 'age' | 'bmi' | 'charges', bins = 15) {
  const values = data.map(d => d[field] as number);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binWidth = (max - min) / bins;
  const buckets = Array.from({ length: bins }, (_, i) => ({
    range: `${(min + i * binWidth).toFixed(0)}`,
    count: 0,
    label: `${(min + i * binWidth).toFixed(0)}-${(min + (i + 1) * binWidth).toFixed(0)}`,
  }));
  values.forEach(v => {
    const idx = Math.min(Math.floor((v - min) / binWidth), bins - 1);
    buckets[idx].count++;
  });
  return buckets;
}

export function getSmokerComparison(data: InsuranceRecord[]) {
  const smokers = data.filter(d => d.smoker === 'yes');
  const nonSmokers = data.filter(d => d.smoker === 'no');
  const avg = (arr: InsuranceRecord[]) => arr.reduce((s, d) => s + d.charges, 0) / arr.length;
  return {
    smokerAvg: avg(smokers),
    nonSmokerAvg: avg(nonSmokers),
    smokerCount: smokers.length,
    nonSmokerCount: nonSmokers.length,
  };
}

export function getAgeBmiScatter(data: InsuranceRecord[]) {
  return data.map(d => ({
    age: d.age,
    bmi: d.bmi,
    charges: d.charges,
    smoker: d.smoker,
  }));
}

export function getRegionData(data: InsuranceRecord[]) {
  const regions: Record<string, { total: number; count: number }> = {};
  data.forEach(d => {
    if (!regions[d.region]) regions[d.region] = { total: 0, count: 0 };
    regions[d.region].total += d.charges;
    regions[d.region].count++;
  });
  return Object.entries(regions).map(([region, { total, count }]) => ({
    region: region.charAt(0).toUpperCase() + region.slice(1),
    avgCharges: Math.round(total / count),
    count,
  }));
}

export function getChargesByAge(data: InsuranceRecord[]) {
  const groups: Record<string, { total: number; count: number }> = {};
  data.forEach(d => {
    const bucket = `${Math.floor(d.age / 10) * 10}s`;
    if (!groups[bucket]) groups[bucket] = { total: 0, count: 0 };
    groups[bucket].total += d.charges;
    groups[bucket].count++;
  });
  return Object.entries(groups)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([group, { total, count }]) => ({
      ageGroup: group,
      avgCharges: Math.round(total / count),
      count,
    }));
}
