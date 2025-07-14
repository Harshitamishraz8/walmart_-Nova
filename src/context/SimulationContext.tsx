import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Store {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  stock: number;
}

export interface DistributionCenter {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  capacity: number;
}

export interface Event {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  confidence: number;
  intensity?: number;
  location?: string;
  impact?: string;
}

interface SimulationState {
  stores: Store[];
  distributionCenters: DistributionCenter[];
  events: Event[];
  activeEvent: Event | null;
  isRunning: boolean;
  speed: number;
  dataQuality: {
    score: number;
    lastCheck: Date | null;
    issuesCount: number;
  };
}

type SimulationAction =
  | { type: 'START_SIMULATION' }
  | { type: 'STOP_SIMULATION' }
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'SET_ACTIVE_EVENT'; payload: Event | null }
  | { type: 'UPDATE_DATA'; payload: { stores?: Store[]; distributionCenters?: DistributionCenter[] } }
  | { type: 'UPDATE_DATA_QUALITY'; payload: { score: number; issuesCount: number } }
  | { type: 'RESET_SIMULATION' };

const initialState: SimulationState = {
  stores: [],
  distributionCenters: [],
  events: [],
  activeEvent: null,
  isRunning: false,
  speed: 1,
  dataQuality: {
    score: 100,
    lastCheck: null,
    issuesCount: 0,
  },
};

function simulationReducer(state: SimulationState, action: SimulationAction): SimulationState {
  switch (action.type) {
    case 'START_SIMULATION':
      return { ...state, isRunning: true };
    case 'STOP_SIMULATION':
      return { ...state, isRunning: false };
    case 'SET_SPEED':
      return { ...state, speed: action.payload };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'SET_ACTIVE_EVENT':
      return { ...state, activeEvent: action.payload };
    case 'UPDATE_DATA':
      return {
        ...state,
        stores: action.payload.stores || state.stores,
        distributionCenters: action.payload.distributionCenters || state.distributionCenters,
      };
    case 'UPDATE_DATA_QUALITY':
      return {
        ...state,
        dataQuality: {
          score: action.payload.score,
          lastCheck: new Date(),
          issuesCount: action.payload.issuesCount,
        },
      };
    case 'RESET_SIMULATION':
      return initialState;
    default:
      return state;
  }
}

const SimulationContext = createContext<{
  state: SimulationState;
  dispatch: React.Dispatch<SimulationAction>;
} | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(simulationReducer, initialState);

  return (
    <SimulationContext.Provider value={{ state, dispatch }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}