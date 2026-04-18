"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import initialData from '../data/initialState.json';
import { loadFullState, updateProject, upsertCapexItem, deleteCapexItem, upsertOpexItem, deleteOpexItem } from '../lib/supabaseActions';
import { DEFAULT_PROJECT_ID } from '../lib/supabase';

// Types
export interface CapexItem { id: string; category: string; name: string; cost: number; status: string; priority?: string; }
export interface OpexItem { id: string; category: string; name: string; monthlyCost: number; yearlyCostView?: number; }
export interface AppState {
  phase: string;
  biomass: Record<string, number>;
  capexItems: CapexItem[];
  opexItems: OpexItem[];
  parameters: Record<string, any>;
}

type Action = 
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'ADD_CAPEX'; payload: CapexItem }
  | { type: 'UPDATE_CAPEX'; payload: CapexItem }
  | { type: 'REMOVE_CAPEX'; payload: string }
  | { type: 'ADD_OPEX'; payload: OpexItem }
  | { type: 'UPDATE_OPEX'; payload: OpexItem }
  | { type: 'REMOVE_OPEX'; payload: string }
  | { type: 'UPDATE_PARAM'; payload: { key: string; value: any } }
  | { type: 'UPDATE_BIOMASS'; payload: { tankId: string; value: number } };

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
    default:
      return state;
  }
}

// Context
const ProjectContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  isLoading: boolean;
  dataSource: 'supabase' | 'localStorage' | 'default';
} | undefined>(undefined);

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
        if (supabaseState && supabaseState.capexItems.length > 0) {
          dispatch({ type: 'SET_STATE', payload: supabaseState });
          setDataSource('supabase');
          setIsLoading(false);
          setIsInitialized(true);
          return;
        }
      } catch (err) {
        console.warn('Supabase load failed, trying localStorage...', err);
      }

      // Fallback to localStorage
      const saved = localStorage.getItem('opala_simulador_state');
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

  // 2. Persist: Save changes to both localStorage (instant) and Supabase (async)
  useEffect(() => {
    if (!isInitialized) return;

    // Always save to localStorage as instant fallback
    localStorage.setItem('opala_simulador_state', JSON.stringify(state));

    // Async sync to Supabase (fire and forget)
    const syncToSupabase = async () => {
      try {
        await updateProject(DEFAULT_PROJECT_ID, {
          phase: state.phase,
          fca_base: state.parameters.fca,
          price_per_kg: state.parameters.pricePerKg,
          climate_control_enabled: state.parameters.climateControlEnabled,
          own_feed_enabled: state.parameters.ownFeedEnabled,
          current_scenario: state.parameters.scenario,
          linhagem: state.parameters.linhagem,
          target_weight_g: state.parameters.targetWeight,
          target_density_kg_m3: state.parameters.targetDensity,
        });
      } catch (err) {
        console.warn('Supabase sync failed (offline mode active):', err);
      }
    };
    syncToSupabase();
  }, [state, isInitialized]);

  return (
    <ProjectContext.Provider value={{ state, dispatch, isLoading, dataSource }}>
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
