import React, { createContext, useCallback, useContext, useState } from 'react';
import { BetSelection } from '../types/sports';

interface BetCupomContextType {
  selections: BetSelection[];
  addSelection: (sel: BetSelection) => void;
  removeSelection: (id: string) => void;
  clearSelections: () => void;
  hasSelection: (id: string) => boolean;
  totalOdd: number;
  betAmount: string;
  setBetAmount: (v: string) => void;
  potentialGain: string;
  isCupomOpen: boolean;
  openCupom: () => void;
  closeCupom: () => void;
}

const BetCupomContext = createContext<BetCupomContextType | null>(null);

export function BetCupomProvider({ children }: { children: React.ReactNode }) {
  const [selections, setSelections] = useState<BetSelection[]>([]);
  const [betAmount, setBetAmount] = useState('');
  const [isCupomOpen, setIsCupomOpen] = useState(false);

  const addSelection = useCallback((sel: BetSelection) => {
    setSelections(prev => {
      const exists = prev.find(s => s.id === sel.id);
      if (exists) {
        // Toggle off if already selected
        return prev.filter(s => s.id !== sel.id);
      }
      return [...prev, sel];
    });
  }, []);

  const removeSelection = useCallback((id: string) => {
    setSelections(prev => prev.filter(s => s.id !== id));
  }, []);

  const clearSelections = useCallback(() => {
    setSelections([]);
    setBetAmount('');
  }, []);

  const hasSelection = useCallback((id: string) => {
    return selections.some(s => s.id === id);
  }, [selections]);

  const totalOdd = selections.reduce((acc, s) => acc * s.oddValue, 1);
  const numBet = parseFloat(betAmount.replace(',', '.')) || 0;
  const potentialGain = numBet > 0 ? (numBet * totalOdd).toFixed(2).replace('.', ',') : '0,00';

  const openCupom = useCallback(() => setIsCupomOpen(true), []);
  const closeCupom = useCallback(() => setIsCupomOpen(false), []);

  return (
    <BetCupomContext.Provider value={{
      selections,
      addSelection,
      removeSelection,
      clearSelections,
      hasSelection,
      totalOdd,
      betAmount,
      setBetAmount,
      potentialGain,
      isCupomOpen,
      openCupom,
      closeCupom,
    }}>
      {children}
    </BetCupomContext.Provider>
  );
}

export function useBetCupom() {
  const ctx = useContext(BetCupomContext);
  if (!ctx) throw new Error('useBetCupom must be used inside BetCupomProvider');
  return ctx;
}
