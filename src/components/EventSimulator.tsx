import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Zap, Play, Pause, RotateCcw, Settings, AlertTriangle, Cloud, Truck, Package } from 'lucide-react';

export function EventSimulator() {
  const { state, dispatch } = useSimulation();
  const [selectedEventType, setSelectedEventType] = useState('weather');
  const [eventIntensity, setEventIntensity] = useState(5);
  const [autoMode, setAutoMode] = useState(false);

  const eventTypes = [
    { id: 'weather', name: 'Weather Disruption', icon: Cloud, description: 'Heavy rain affecting Delhi-NCR region' },
    { id: 'demand_surge', name: 'Demand Surge', icon: Package, description: 'Festival season causing 300% demand increase' },
    { id: 'route_closure', name: 'Route Closure', icon: Truck, description: 'Highway closure due to construction' },
    { id: 'supplier_delay', name: 'Supplier Delay', icon: AlertTriangle, description: 'Key supplier experiencing production issues' }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoMode && state.isRunning) {
      interval = setInterval(() => {
        triggerRandomEvent();
      }, 10000); // Trigger event every 10 seconds
    }
    return () => clearInterval(interval);
  }, [autoMode, state.isRunning]);

  const triggerRandomEvent = () => {
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const randomIntensity = Math.floor(Math.random() * 10) + 1;
    triggerEvent(randomType.id, randomIntensity);
  };

  const triggerEvent = (type: string, intensity: number) => {
    const eventType = eventTypes.find(e => e.id === type);
    const confidence = (intensity / 10) * 0.9 + 0.1; // Convert to 0.1-1.0 range

    const newEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: eventType?.name || 'Unknown Event',
      description: eventType?.description || 'Simulated supply chain event',
      timestamp: new Date(),
      confidence: confidence,
      intensity: intensity,
      location: 'Delhi-NCR',
      impact: intensity > 7 ? 'High' : intensity > 4 ? 'Medium' : 'Low'
    };

    dispatch({ type: 'ADD_EVENT', payload: newEvent });
    dispatch({ type: 'SET_ACTIVE_EVENT', payload: newEvent });
  };

  const toggleSimulation = () => {
    if (state.isRunning) {
      dispatch({ type: 'STOP_SIMULATION' });
    } else {
      dispatch({ type: 'START_SIMULATION' });
    }
  };

  const resetSimulation = () => {
    dispatch({ type: 'RESET_SIMULATION' });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Zap className="mr-3 text-yellow-600" size={28} />
          Event Simulator
        </h2>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoMode}
              onChange={(e) => setAutoMode(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600">Auto Mode</span>
          </label>
          <button
            onClick={toggleSimulation}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white ${
              state.isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {state.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{state.isRunning ? 'Pause' : 'Start'}</span>
          </button>
          <button
            onClick={resetSimulation}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Event Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-3">Event Type</label>
          <div className="grid grid-cols-2 gap-3">
            {eventTypes.map((eventType) => {
              const Icon = eventType.icon;
              return (
                <button
                  key={eventType.id}
                  onClick={() => setSelectedEventType(eventType.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedEventType === eventType.id
                      ? 'border-walmart-blue bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon className={`w-5 h-5 ${
                      selectedEventType === eventType.id ? 'text-walmart-blue' : 'text-gray-600'
                    }`} />
                    <span className="font-medium text-gray-800">{eventType.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">{eventType.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Event Intensity: {eventIntensity}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={eventIntensity}
            onChange={(e) => setEventIntensity(Number(e.target.value))}
            className="w-full mb-4"
          />
          <button
            onClick={() => triggerEvent(selectedEventType, eventIntensity)}
            disabled={!state.isRunning}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-walmart-yellow text-gray-800 rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="w-4 h-4" />
            <span>Trigger Event</span>
          </button>
        </div>
      </div>

      {/* Active Event Display */}
      {state.activeEvent && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-yellow-800">Active Event</h3>
            <span className="text-sm text-yellow-600">
              Confidence: {(state.activeEvent.confidence * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-yellow-700 mb-2">{state.activeEvent.description}</p>
          <div className="grid grid-cols-3 gap-4 text-sm text-yellow-600">
            <div>
              <span className="font-medium">Type:</span> {state.activeEvent.type}
            </div>
            <div>
              <span className="font-medium">Impact:</span> {(state.activeEvent as any).impact || 'Medium'}
            </div>
            <div>
              <span className="font-medium">Time:</span> {state.activeEvent.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}

      {/* Recent Events */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Events ({state.events.length})</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {state.events.slice(-5).reverse().map((event, index) => (
            <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium text-gray-800">{event.type}</span>
                <p className="text-sm text-gray-600">{event.description}</p>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">{event.timestamp.toLocaleTimeString()}</span>
                <p className="text-xs text-gray-400">
                  Confidence: {(event.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
          {state.events.length === 0 && (
            <p className="text-center text-gray-500 py-4">No events triggered yet</p>
          )}
        </div>
      </div>
    </div>
  );
}