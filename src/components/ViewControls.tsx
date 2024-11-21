import React from 'react';
import { LayoutGrid, List, SortAsc } from 'lucide-react';
import { ViewMode, SortOption } from '../hooks/useDeployedContracts';

interface ViewControlsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortOption: SortOption;
  onSortOptionChange: (option: SortOption) => void;
}

export const ViewControls: React.FC<ViewControlsProps> = ({
  viewMode,
  onViewModeChange,
  sortOption,
  onSortOptionChange,
}) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center bg-black/20 rounded-lg p-1">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`p-2 rounded-md transition-all ${
            viewMode === 'grid'
              ? 'bg-purple-600 text-white'
              : 'text-purple-300 hover:text-white'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`p-2 rounded-md transition-all ${
            viewMode === 'list'
              ? 'bg-purple-600 text-white'
              : 'text-purple-300 hover:text-white'
          }`}
        >
          <List className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <SortAsc className="w-4 h-4 text-purple-300" />
        <select
          value={sortOption}
          onChange={(e) => onSortOptionChange(e.target.value as SortOption)}
          className="bg-black/20 border border-purple-500/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name (A-Z)</option>
          <option value="symbol">Symbol (A-Z)</option>
        </select>
      </div>
    </div>
  );
};