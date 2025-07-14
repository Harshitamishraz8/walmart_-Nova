import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { MapPin, Truck, Package, AlertTriangle, CheckCircle } from 'lucide-react';

export function SupplyChainMap() {
  const { state } = useSimulation();
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  // Sample locations for demonstration
  const locations = [
    { id: 'dc1', name: 'Delhi DC', type: 'distribution', lat: 28.6139, lng: 77.2090, status: 'operational', stock: 85 },
    { id: 'dc2', name: 'Mumbai DC', type: 'distribution', lat: 19.0760, lng: 72.8777, status: 'warning', stock: 45 },
    { id: 'store1', name: 'Gurgaon Store', type: 'store', lat: 28.4595, lng: 77.0266, status: 'operational', stock: 92 },
    { id: 'store2', name: 'Noida Store', type: 'store', lat: 28.5355, lng: 77.3910, status: 'critical', stock: 15 },
    { id: 'store3', name: 'Faridabad Store', type: 'store', lat: 28.4089, lng: 77.3178, status: 'operational', stock: 78 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return MapPin;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Supply Chain Network</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Operational</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Warning</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Critical</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-96 overflow-hidden border-2 border-gray-200">
        {/* Simulated Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50 opacity-30"></div>
        
        {/* Location Markers */}
        {locations.map((location) => {
          const StatusIcon = getStatusIcon(location.status);
          return (
            <div
              key={location.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 ${getStatusColor(location.status)} rounded-full p-3 shadow-lg border-2 border-white`}
              style={{
                left: `${((location.lng - 72) / (78 - 72)) * 100}%`,
                top: `${((30 - location.lat) / (30 - 18)) * 100}%`
              }}
              onClick={() => setSelectedLocation(location)}
            >
              <StatusIcon className="w-5 h-5" />
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 whitespace-nowrap">
                {location.name}
              </div>
            </div>
          );
        })}

        {/* Route Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
            </marker>
          </defs>
          {/* Sample routes */}
          <line x1="20%" y1="30%" x2="60%" y2="50%" stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)" />
          <line x1="20%" y1="30%" x2="40%" y2="70%" stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)" />
          <line x1="80%" y1="20%" x2="60%" y2="50%" stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)" />
        </svg>
      </div>

      {/* Location Details Panel */}
      {selectedLocation && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">{selectedLocation.name}</h3>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Type:</span>
              <span className="ml-2 font-medium capitalize">{selectedLocation.type}</span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <span className={`ml-2 font-medium capitalize ${
                selectedLocation.status === 'operational' ? 'text-green-600' :
                selectedLocation.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {selectedLocation.status}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Stock Level:</span>
              <span className="ml-2 font-medium">{selectedLocation.stock}%</span>
            </div>
            <div>
              <span className="text-gray-600">Coordinates:</span>
              <span className="ml-2 font-medium">{selectedLocation.lat.toFixed(2)}, {selectedLocation.lng.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Network Statistics */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <span>Total Locations: </span>
            <span className="font-semibold">{locations.length}</span>
          </div>
          <div>
            <span>Operational: </span>
            <span className="font-semibold text-green-600">
              {locations.filter(l => l.status === 'operational').length}
            </span>
          </div>
          <div>
            <span>Need Attention: </span>
            <span className="font-semibold text-red-600">
              {locations.filter(l => l.status !== 'operational').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}