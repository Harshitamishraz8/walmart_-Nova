export interface DataIssue {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  field: string;
  recordId?: string;
  suggestedFix?: string;
}

export interface DataQualityReport {
  score: number;
  totalRecords: number;
  validRecords: number;
  issuesFound: number;
  categories: {
    [key: string]: number;
  };
}

export function dataIntegrityEngine(stores: any[], distributionCenters: any[]): {
  issues: DataIssue[];
  report: DataQualityReport;
} {
  const issues: DataIssue[] = [];
  const allRecords = [...stores, ...distributionCenters];
  let validRecords = 0;
  const categories: { [key: string]: number } = {};

  allRecords.forEach((record, index) => {
    let recordValid = true;

    // Check coordinates
    if (!isValidCoordinate(record.latitude)) {
      issues.push({
        id: `coord_lat_${index}`,
        description: `Invalid latitude coordinate: ${record.latitude}`,
        severity: 'high',
        field: 'latitude',
        recordId: record.id,
        suggestedFix: 'Set to default value or validate input'
      });
      recordValid = false;
      categories['coordinates'] = (categories['coordinates'] || 0) + 1;
    }

    if (!isValidCoordinate(record.longitude)) {
      issues.push({
        id: `coord_lng_${index}`,
        description: `Invalid longitude coordinate: ${record.longitude}`,
        severity: 'high',
        field: 'longitude',
        recordId: record.id,
        suggestedFix: 'Set to default value or validate input'
      });
      recordValid = false;
      categories['coordinates'] = (categories['coordinates'] || 0) + 1;
    }

    // Check name field
    if (!record.name || record.name.trim() === '') {
      issues.push({
        id: `name_${index}`,
        description: `Missing or empty name field`,
        severity: 'medium',
        field: 'name',
        recordId: record.id,
        suggestedFix: 'Provide default name or require user input'
      });
      recordValid = false;
      categories['naming'] = (categories['naming'] || 0) + 1;
    }

    // Check stock values
    if (record.stock !== undefined && record.stock < 0) {
      issues.push({
        id: `stock_${index}`,
        description: `Negative stock value: ${record.stock}`,
        severity: 'medium',
        field: 'stock',
        recordId: record.id,
        suggestedFix: 'Set to 0 or validate input'
      });
      recordValid = false;
      categories['inventory'] = (categories['inventory'] || 0) + 1;
    }

    // Check capacity values
    if (record.capacity !== undefined && record.capacity <= 0) {
      issues.push({
        id: `capacity_${index}`,
        description: `Invalid capacity value: ${record.capacity}`,
        severity: 'low',
        field: 'capacity',
        recordId: record.id,
        suggestedFix: 'Set to reasonable default value'
      });
      recordValid = false;
      categories['capacity'] = (categories['capacity'] || 0) + 1;
    }

    if (recordValid) {
      validRecords++;
    }
  });

  const score = allRecords.length > 0 ? Math.round((validRecords / allRecords.length) * 100) : 100;

  return {
    issues,
    report: {
      score,
      totalRecords: allRecords.length,
      validRecords,
      issuesFound: issues.length,
      categories
    }
  };
}

function isValidCoordinate(coord: any): boolean {
  if (typeof coord === 'number') {
    return !isNaN(coord) && isFinite(coord);
  }
  if (typeof coord === 'string') {
    const num = parseFloat(coord);
    return !isNaN(num) && isFinite(num);
  }
  return false;
}