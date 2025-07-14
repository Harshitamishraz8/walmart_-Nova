import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign, Truck, Package } from 'lucide-react';

export function Dashboard() {
  const { state } = useSimulation();

  const metrics = [
    {
      title: 'Supply Chain Health',
      value: `${state.dataQuality.score}%`,
      change: '+2.3%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Disruptions',
      value: state.events.length,
      change: '-15%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Cost Optimization',
      value: '₹2.4M',
      change: '+8.7%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Delivery Performance',
      value: '94.2%',
      change: '+1.8%',
      trend: 'up',
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Supply Chain Command Center</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${state.isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-gray-600">
            {state.isRunning ? 'Live Monitoring' : 'Paused'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className={`${metric.bgColor} rounded-lg p-4 border border-gray-200`}>
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-6 h-6 ${metric.color}`} />
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
              <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-walmart-blue text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Package className="w-4 h-4 inline mr-2" />
            Inventory Rebalance
          </button>
          <button className="px-4 py-2 bg-walmart-yellow text-gray-800 rounded-lg hover:bg-yellow-400 transition-colors">
            <Truck className="w-4 h-4 inline mr-2" />
            Route Optimization
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Demand Forecast
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Clock className="w-4 h-4 inline mr-2" />
            Emergency Response
          </button>
        </div>
      </div>
    </div>
  );
}