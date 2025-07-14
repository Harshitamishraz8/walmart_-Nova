import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { BarChart3, TrendingUp, Clock, Target, DollarSign, Users } from 'lucide-react';

export function PerformanceMetrics() {
  const { state } = useSimulation();

  const metrics = [
    {
      title: 'On-Time Delivery',
      value: '94.2%',
      target: '95%',
      trend: '+1.8%',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: Clock
    },
    {
      title: 'Cost Efficiency',
      value: '₹2.4M',
      target: '₹2.2M',
      trend: '+8.7%',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: DollarSign
    },
    {
      title: 'Customer Satisfaction',
      value: '4.6/5',
      target: '4.5/5',
      trend: '+0.2',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: Users
    },
    {
      title: 'Inventory Turnover',
      value: '12.3x',
      target: '12x',
      trend: '+2.5%',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: BarChart3
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Performance Metrics</h2>
        <TrendingUp className="w-6 h-6 text-green-600" />
      </div>

      <div className="space-y-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className={`${metric.bgColor} rounded-lg p-4 border border-gray-200`}>
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${metric.color}`} />
                <span className="text-sm font-medium text-green-600">{metric.trend}</span>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
              <div className="flex items-center justify-between">
                <span className={`text-xl font-bold ${metric.color}`}>{metric.value}</span>
                <span className="text-sm text-gray-500">Target: {metric.target}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${metric.color.replace('text-', 'bg-')}`}
                    style={{ width: `${Math.random() * 30 + 70}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Insights */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">AI Insights</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Delivery performance improved by 1.8% due to route optimization</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Cost savings of ₹200K achieved through inventory rebalancing</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>Predicted demand surge in electronics category next week</p>
          </div>
        </div>
      </div>
    </div>
  );
}