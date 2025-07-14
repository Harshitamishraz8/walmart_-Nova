import React from 'react';
import { SimulationProvider } from './context/SimulationContext';
import { Dashboard } from './components/Dashboard';
import { DataIntegrity } from './components/DataIntegrity';
import { PrescriptiveActions } from './components/PrescriptiveActions';
import { EventSimulator } from './components/EventSimulator';
import { SupplyChainMap } from './components/SupplyChainMap';
import { PerformanceMetrics } from './components/PerformanceMetrics';

function App() {
  return (
    <SimulationProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-walmart-blue text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Walmart Nova</h1>
                <p className="text-blue-100 mt-1">AI-Powered Prescriptive Analytics Platform</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Real-time Supply Chain Intelligence</p>
                <p className="text-xs text-blue-200">Predict • Prescribe • Optimize</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-6">
          {/* Top Row - Dashboard Overview */}
          <div className="mb-6">
            <Dashboard />
          </div>

          {/* Second Row - Map and Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <SupplyChainMap />
            </div>
            <div>
              <PerformanceMetrics />
            </div>
          </div>

          {/* Third Row - Core Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <DataIntegrity />
            <PrescriptiveActions />
          </div>

          {/* Bottom Row - Event Simulation */}
          <div className="mb-6">
            <EventSimulator />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-4 mt-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm text-gray-300">
              © 2025 Walmart Nova - Prescriptive Analytics Platform | 
              Powered by AI for Seamless Supply Chain Optimization
            </p>
          </div>
        </footer>
      </div>
    </SimulationProvider>
  );
}

export default App;