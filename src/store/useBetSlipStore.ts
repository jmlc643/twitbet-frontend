import { create } from 'zustand';

export interface BetSelection {
  leagueId: string;
  marketId: string;
  optionId: string;
  optionName: string;
  marketName: string;
  currentOdds: number;
  matchTitle?: string;
  matchTime?: string;
  matchStatus?: string;
}

interface BetSlipState {
  selections: BetSelection[];
  isOpen: boolean;
  addSelection: (selection: BetSelection) => void;
  removeSelection: (optionId: string) => void;
  toggleSelection: (selection: BetSelection) => void;
  clearSlip: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useBetSlipStore = create<BetSlipState>((set, get) => ({
  selections: [],
  isOpen: false,
  
  addSelection: (selection) => {
    const currentSelections = get().selections;
    
    if (currentSelections.some(s => s.optionId === selection.optionId)) {
      return;
    }
    
    const filteredSelections = currentSelections.filter(s => s.marketId !== selection.marketId);
    
    if (filteredSelections.length > 0 && filteredSelections[0].leagueId !== selection.leagueId) {
      set({ selections: [selection], isOpen: true });
      return;
    }

    set({ selections: [...filteredSelections, selection], isOpen: true });
  },

  removeSelection: (optionId) => {
    set((state) => {
      const newSelections = state.selections.filter(s => s.optionId !== optionId);
      return { 
        selections: newSelections,
        isOpen: newSelections.length > 0 ? state.isOpen : false
      };
    });
  },

  toggleSelection: (selection) => {
    const currentSelections = get().selections;
    if (currentSelections.some(s => s.optionId === selection.optionId)) {
      get().removeSelection(selection.optionId);
    } else {
      get().addSelection(selection);
    }
  },

  clearSlip: () => set({ selections: [], isOpen: false }),
  
  setIsOpen: (isOpen) => set({ isOpen }),
}));
