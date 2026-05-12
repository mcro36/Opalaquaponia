"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState, useCallback } from 'react';
import initialData from '../data/initialState.json';
import { loadFullState, updateProject, upsertCapexItem, deleteCapexItem, upsertOpexItem, deleteOpexItem } from '../lib/supabaseActions';
import { DEFAULT_PROJECT_ID } from '../lib/supabase';

// Types
export interface CapexItem { id: string; category: string; name: string; cost: number; status: string; priority?: string; }
export interface OpexItem { id: string; category: string; name: string; monthlyCost: number; yearlyCostView?: number; }

export interface ProjectParameters {
  scenario: 'otimista' | 'realista' | 'pessimista';
  targetDensity: number;
  fca: number;
  pricePerKg: number;
  climateControlEnabled: boolean;
  ownFeedEnabled: boolean;
  solarEnabled: boolean;
  linhagem: string;
  reversaoSexual: boolean;
  targetWeight: number;
  stressTest?: {
    marketCrash: boolean; // Preço do filé cai 30%
    feedCrisis: boolean;  // Preço da ração sobe 40%
    climateDisaster: boolean; // Temperatura cai 5°C extra
    highMortality: boolean;   // Sobrevivência cai 20%
  };
}

export interface AppState {
  phase: string;
  biomass: Record<string, number>;
  activePhases: boolean[];
  capexItems: CapexItem[];
  opexItems: OpexItem[];
  parameters: ProjectParameters;
}

type Action = 
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'ADD_CAPEX'; payload: CapexItem }
  | { type: 'UPDATE_CAPEX'; payload: CapexItem }
  | { type: 'REMOVE_CAPEX'; payload: string }
  | { type: 'ADD_OPEX'; payload: OpexItem }
  | { type: 'UPDATE_OPEX'; payload: OpexItem }
  | { type: 'REMOVE_OPEX'; payload: string }
  | { type: 'UPDATE_PARAM'; payload: { key: keyof ProjectParameters; value: any } }
  | { type: 'UPDATE_BIOMASS'; payload: { tankId: string; value: number } }
  | { type: 'SET_ACTIVE_PHASES'; payload: boolean[] };

// Reducer
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'ADD_CAPEX':
      return { ...state, capexItems: [...state.capexItems, action.payload] };
    case 'UPDATE_CAPEX':
      return { 
        ...state, 
        capexItems: state.capexItems.map(item => item.id === action.payload.id ? action.payload : item) 
      };
    case 'REMOVE_CAPEX':
      return { ...state, capexItems: state.capexItems.filter(item => item.id !== action.payload) };
    case 'ADD_OPEX':
      return { ...state, opexItems: [...state.opexItems, action.payload] };
    case 'UPDATE_OPEX':
      return { 
        ...state, 
        opexItems: state.opexItems.map(item => item.id === action.payload.id ? action.payload : item) 
      };
    case 'REMOVE_OPEX':
      return { ...state, opexItems: state.opexItems.filter(item => item.id !== action.payload) };
    case 'UPDATE_PARAM':
      return { ...state, parameters: { ...state.parameters, [action.payload.key]: action.payload.value } };
    case 'UPDATE_BIOMASS':
      return { ...state, biomass: { ...state.biomass, [action.payload.tankId]: action.payload.value } };
    case 'SET_ACTIVE_PHASES':
      return { ...state, activePhases: action.payload };
    default:
      return state;
  }
}

// Context
const ProjectContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  syncDispatch: (action: Action) => void;
  isLoading: boolean;
  dataSource: 'supabase' | 'localStorage' | 'default';
} | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'rj_piscicultura_state';

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialData as AppState);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'supabase' | 'localStorage' | 'default'>('default');
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Load: Try Supabase first, then localStorage, then default
  useEffect(() => {
    async function init() {
      try {
        const supabaseState = await loadFullState();
        if (supabaseState && (supabaseState.capexItems?.length > 0 || supabaseState.parameters)) {
          dispatch({ type: 'SET_STATE', payload: supabaseState as AppState });
          setDataSource('supabase');
          setIsLoading(false);
          setIsInitialized(true);
          return;
        }
      } catch (err) {
        console.warn('Supabase load failed, trying localStorage...', err);
      }

      // Fallback to localStorage
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          dispatch({ type: 'SET_STATE', payload: JSON.parse(saved) });
          setDataSource('localStorage');
        } catch (e) {
          console.error("Failed to parse state from local storage", e);
          setDataSource('default');
        }
      } else {
        setDataSource('default');
      }
      setIsLoading(false);
      setIsInitialized(true);
    }
    init();
  }, []);

  // 2. Persist project-level params to both localStorage and Supabase
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state, isInitialized]);

  // 3. syncDispatch: Dispatches locally AND syncs the specific action to Supabase
  const syncDispatch = useCallback((action: Action) => {
    dispatch(action);

    const sync = async () => {
      try {
        switch (action.type) {
          case 'ADD_CAPEX':
          case 'UPDATE_CAPEX':
            await upsertCapexItem(DEFAULT_PROJECT_ID, action.payload);
            break;
          case 'REMOVE_CAPEX':
            await deleteCapexItem(action.payload);
            break;
          case 'ADD_OPEX':
          case 'UPDATE_OPEX':
            await upsertOpexItem(DEFAULT_PROJECT_ID, action.payload);
            break;
          case 'REMOVE_OPEX':
            await deleteOpexItem(action.payload);
            break;
          case 'UPDATE_PARAM':
            const paramMap: Record<string, string> = {
              scenario: 'current_scenario',
              fca: 'fca_base',
              pricePerKg: 'price_per_kg',
              climateControlEnabled: 'climate_control_enabled',
              ownFeedEnabled: 'own_feed_enabled',
              solarEnabled: 'solar_enabled',
              linhagem: 'linhagem',
              targetWeight: 'target_weight_g',
              targetDensity: 'target_density_kg_m3',
            };
            const colName = paramMap[action.payload.key as string];
            if (colName) {
              await updateProject(DEFAULT_PROJECT_ID, { [colName]: action.payload.value });
            }
            break;
        }
      } catch (err) {
        console.warn('Supabase sync error (data saved locally):', err);
      }
    };
    sync();
  }, []);

  return (
    <ProjectContext.Provider value={{ state, dispatch, syncDispatch, isLoading, dataSource }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
