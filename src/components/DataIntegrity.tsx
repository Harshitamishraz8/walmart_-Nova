import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { dataIntegrityEngine, type DataIssue, type DataQualityReport } from '../utils/dataIntegrity';
import { Shield, AlertTriangle, CheckCircle, RefreshCw, Settings, TrendingUp } from 'lucide-react';

export function DataIntegrity() {
  const { state, dispatch } = useSimulation();
  const [dataIssues, setDataIssues] = useState<DataIssue[]>([]);
  const [qualityReport, setQualityReport] = useState<DataQualityReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoCorrectEnabled, setAutoCorrectEnabled] = useState(true);
  const [correctionsMade, setCorrectionsMade] = useState(0);

  // Sample data for demonstration
  const sampleStores = [
    { id: 'store1', name: 'Gurgaon Store', latitude: '28.4595', longitude: '77.0266', stock: 92 },
    { id: 'store2', name: '', latitude: 'invalid', longitude: '77.3910', stock: -5 },
    { id: 'store3', name: 'Faridabad Store', latitude: '28.4089', longitude: '77.3178', stock: 78 }
  ];

  const sampleDCs = [
    { id: 'dc1', name: 'Delhi DC', latitude: '28.6139', longitude: '77.2090', capacity: 1000 },
    { id: 'dc2', name: 'Mumbai DC', latitude: '19.0760', longitude: 'invalid', capacity: -100 }
  ];

  useEffect(() => {
    runDataAnalysis();
  }, []);

  const runDataAnalysis = () => {
    setIsAnalyzing(true);
    setCorrectionsMade(0);

    // Use sample data for demonstration
    const stores = sampleStores;
    const distributionCenters = sampleDCs;

    // Run integrity checks
    const { issues, report } = dataIntegrityEngine(stores, distributionCenters);

    if (autoCorrectEnabled) {
      const { correctedStores, storeCorrections } = correctData(stores);
      const { correctedDCs, dcCorrections } = correctData(distributionCenters);
      
      const totalCorrections = storeCorrections + dcCorrections;
      setCorrectionsMade(totalCorrections);

      if (totalCorrections > 0) {
        dispatch({ 
          type: 'UPDATE_DATA', 
          payload: { 
            stores: correctedStores, 
            distributionCenters: correctedDCs 
          } 
        });
      }
    }

    setDataIssues(issues);
    setQualityReport(report);
    
    // Update global data quality state
    dispatch({
      type: 'UPDATE_DATA_QUALITY',
      payload: { score: report.score, issuesCount: issues.length }
    });

    setIsAnalyzing(false);
  };

  const correctData = (data: any[]) => {
    let corrections = 0;
    const corrected = data.map(item => {
      let fixed = { ...item };
      let itemCorrected = false;

      // Fix invalid coordinates
      if (!/^[-+]?\d+(\.\d+)?$/.test(fixed.latitude)) {
        fixed.latitude = "0";
        itemCorrected = true;
      }
      if (!/^[-+]?\d+(\.\d+)?$/.test(fixed.longitude)) {
        fixed.longitude = "0";
        itemCorrected = true;
      }

      // Fix negative stock
      if (fixed.stock && fixed.stock < 0) {
        fixed.stock = 0;
        itemCorrected = true;
      }

      // Fix empty names
      if (!fixed.name || fixed.name.trim() === "") {
        fixed.name = "Unnamed Location";
        itemCorrected = true;
      }

      // Fix invalid capacity
      if (fixed.capacity && fixed.capacity < 0) {
        fixed.capacity = 1000; // Default capacity
        itemCorrected = true;
      }

      if (itemCorrected) corrections++;
      return fixed;
    });

    return { correctedStores: corrected, storeCorrections: corrections, correctedDCs: corrected, dcCorrections: corrections };
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Shield className="mr-3 text-blue-600" size={28} />
          Data Integrity Monitor
        </h2>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoCorrectEnabled}
              onChange={(e) => setAutoCorrectEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600">Auto-correct</span>
          </label>
          <button
            onClick={runDataAnalysis}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? "Analyzing..." : "Scan Data"}</span>
          </button>
        </div>
      </div>

      {/* Quality Report */}
      {qualityReport && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Data Quality Report</h3>
            <span className={`text-2xl font-bold ${getQualityColor(qualityReport.score)}`}>
              {qualityReport.score}%
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Records:</span>
              <span className="ml-2 font-semibold">{qualityReport.totalRecords}</span>
            </div>
            <div>
              <span className="text-gray-600">Valid Records:</span>
              <span className="ml-2 font-semibold text-green-600">{qualityReport.validRecords}</span>
            </div>
            <div>
              <span className="text-gray-600">Issues Found:</span>
              <span className="ml-2 font-semibold text-red-600">{qualityReport.issuesFound}</span>
            </div>
          </div>
          {correctionsMade > 0 && (
            <div className="mt-2 p-2 bg-green-100 rounded text-green-800 text-sm">
              ✅ {correctionsMade} data corrections applied automatically
            </div>
          )}
        </div>
      )}

      {/* Issues List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
          <Settings className="mr-2" size={20} />
          Data Issues {dataIssues.length > 0 && `(${dataIssues.length})`}
        </h3>
        
        {dataIssues.length === 0 ? (
          <div className="flex items-center p-4 bg-green-50 rounded-lg text-green-700">
            <CheckCircle className="mr-3" size={20} />
            <span className="font-medium">All data integrity checks passed!</span>
          </div>
        ) : (
          <div className="space-y-2">
            {dataIssues.map((issue, idx) => (
              <div key={idx} className="flex items-start p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <AlertTriangle className="mr-3 mt-0.5 text-yellow-600 flex-shrink-0" size={16} />
                <div>
                  <p className="text-yellow-800 font-medium">{issue.description}</p>
                  <p className="text-yellow-600 text-sm mt-1">
                    Severity: {issue.severity} | Field: {issue.field}
                  </p>
                  {issue.suggestedFix && (
                    <p className="text-yellow-600 text-xs mt-1">
                      💡 {issue.suggestedFix}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Insights */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <TrendingUp className="mr-2" size={16} />
          AI Data Insights
        </h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Data quality improved by 15% after implementing auto-corrections</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Coordinate validation prevented 3 routing errors this week</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Recommend implementing real-time validation for new data entries</p>
          </div>
        </div>
      </div>
    </div>
  );
}