import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { prescriptiveOptimizer } from '../utils/optimizer';
import { Brain, Zap, TrendingUp, CheckCircle, Target, DollarSign, Clock, Users, AlertTriangle } from 'lucide-react';

interface Recommendation {
  id: string;
  eventId: string;
  action: string;
  estimatedCost: number;
  estimatedTime: number;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  category: string;
  timestamp: Date;
  details: string[];
  impact: string;
}

export function PrescriptiveActions() {
  const { state } = useSimulation();
  const [optimizationObjective, setOptimizationObjective] = useState<'minimize_cost' | 'minimize_time' | 'maximize_satisfaction'>('minimize_cost');
  const [maxBudget, setMaxBudget] = useState(50000);
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [generatedEventIds, setGeneratedEventIds] = useState<string[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activeRecommendations, setActiveRecommendations] = useState<string[]>([]);

  useEffect(() => {
    if (state.activeEvent && 
        !generatedEventIds.includes(state.activeEvent.id) && 
        state.activeEvent.confidence > (confidenceThreshold / 100)) {
      generateOptimizedActions(state.activeEvent);
    }
  }, [state.activeEvent, confidenceThreshold]);

  const generateOptimizedActions = (event: any) => {
    setIsOptimizing(true);

    try {
      const results = prescriptiveOptimizer(event, {
        objective: optimizationObjective,
        maxBudget: maxBudget,
        confidenceThreshold: confidenceThreshold / 100,
      });

      // Create structured recommendation
      const newRecommendation: Recommendation = {
        id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        eventId: event.id,
        action: results.action,
        estimatedCost: results.estimatedCost,
        estimatedTime: results.estimatedTime,
        confidence: event.confidence * 100,
        priority: results.priority,
        category: results.category,
        timestamp: new Date(),
        details: results.details,
        impact: event.impact || 'Medium'
      };

      // Only add if confidence meets threshold and not duplicate
      if (newRecommendation.confidence >= confidenceThreshold) {
        setRecommendations(prev => {
          // Remove old recommendations for same event to prevent duplicates
          const filtered = prev.filter(rec => rec.eventId !== event.id);
          return [...filtered, newRecommendation];
        });
        
        setGeneratedEventIds(prev => [...prev, event.id]);
        setActiveRecommendations(prev => [...prev, newRecommendation.id]);
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const implementRecommendation = (recId: string) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === recId 
          ? { ...rec, priority: 'low' as const } 
          : rec
      )
    );
    setActiveRecommendations(prev => prev.filter(id => id !== recId));
  };

  const dismissRecommendation = (recId: string) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== recId));
    setActiveRecommendations(prev => prev.filter(id => id !== recId));
  };

  const clearAllRecommendations = () => {
    setRecommendations([]);
    setGeneratedEventIds([]);
    setActiveRecommendations([]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-50';
      case 'medium': return 'border-yellow-400 bg-yellow-50';
      case 'low': return 'border-green-400 bg-green-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const getObjectiveIcon = () => {
    switch (optimizationObjective) {
      case 'minimize_cost': return <DollarSign className="w-5 h-5" />;
      case 'minimize_time': return <Clock className="w-5 h-5" />;
      case 'maximize_satisfaction': return <Users className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Brain className="mr-3 text-purple-600" size={28} />
          AI Prescriptive Actions
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Active: {activeRecommendations.length}</span>
          <button
            onClick={clearAllRecommendations}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {getObjectiveIcon()}
            <span className="ml-2">Optimization Objective</span>
          </label>
          <select 
            value={optimizationObjective} 
            onChange={(e) => setOptimizationObjective(e.target.value as any)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
          >
            <option value="minimize_cost">Minimize Cost</option>
            <option value="minimize_time">Minimize Time</option>
            <option value="maximize_satisfaction">Maximize Satisfaction</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Max Budget (₹)
          </label>
          <input 
            type="number" 
            value={maxBudget} 
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            min="1000"
            max="1000000"
            step="1000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Target className="w-4 h-4 inline mr-1" />
            Confidence Threshold ({confidenceThreshold}%)
          </label>
          <input 
            type="range" 
            value={confidenceThreshold} 
            onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
            className="w-full"
            min="50"
            max="95"
            step="5"
          />
        </div>
      </div>

      {/* Manual Generation Button */}
      <div className="mb-6">
        <button
          onClick={() => state.activeEvent && generateOptimizedActions(state.activeEvent)}
          disabled={isOptimizing || !state.activeEvent}
          className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className={`w-5 h-5 ${isOptimizing ? 'animate-pulse' : ''}`} />
          <span>{isOptimizing ? "Generating..." : "Generate New Recommendations"}</span>
        </button>
        {!state.activeEvent && (
          <p className="text-sm text-gray-500 mt-2">Trigger an event in the simulator to generate recommendations</p>
        )}
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
          <TrendingUp className="mr-2" size={20} />
          AI Recommendations ({recommendations.length})
        </h3>

        {recommendations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No recommendations generated yet.</p>
            <p className="text-sm">Trigger an event to see AI-powered prescriptive actions.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations
              .sort((a, b) => b.confidence - a.confidence)
              .map((rec) => (
                <div key={rec.id} className={`border-l-4 p-4 rounded-lg ${getPriorityColor(rec.priority)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                        <h4 className="font-semibold text-gray-800">{rec.action}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {rec.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Cost:</span> ₹{rec.estimatedCost.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Time:</span> {rec.estimatedTime} hrs
                        </div>
                        <div>
                          <span className="font-medium">Confidence:</span> {rec.confidence.toFixed(1)}%
                        </div>
                        <div>
                          <span className="font-medium">Impact:</span> {rec.impact}
                        </div>
                      </div>

                      {/* Action Details */}
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Recommended Actions:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {rec.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <p className="text-xs text-gray-500">
                        Generated: {rec.timestamp.toLocaleString()} | Category: {rec.category}
                      </p>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => implementRecommendation(rec.id)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Implement
                      </button>
                      <button
                        onClick={() => dismissRecommendation(rec.id)}
                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <span>Total Generated: </span>
            <span className="font-semibold">{generatedEventIds.length}</span>
          </div>
          <div>
            <span>Active: </span>
            <span className="font-semibold text-blue-600">{activeRecommendations.length}</span>
          </div>
          <div>
            <span>Avg Confidence: </span>
            <span className="font-semibold">
              {recommendations.length > 0 
                ? (recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / recommendations.length).toFixed(1)
                : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}