import React from 'react';
import { SimulationProvider } from './context/SimulationContext';
import { DataIntegrity } from './components/DataIntegrity';
import { PrescriptiveActions } from './components/PrescriptiveActions';

function App() {
  return (
    <SimulationProvider>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Walmart Prescriptive Analytics Platform
            </h1>
            <p className="text-gray-600 mt-2">
              AI-powered supply chain optimization and data integrity monitoring
            </p>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DataIntegrity />
            <PrescriptiveActions />
          </div>
        </div>
      </div>
    </SimulationProvider>
  );
}

export default App;