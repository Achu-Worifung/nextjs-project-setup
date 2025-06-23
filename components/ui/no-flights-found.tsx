'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

interface NoFlightsFoundProps {
  onClearFilters: () => void;
}

const NoFlightsFound = ({ onClearFilters }: NoFlightsFoundProps) => {
  return (
    <Card className="text-center py-12 shadow-md">
      <CardContent>
        <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No flights found</h3>
        <p className="text-gray-600 mb-4">
          Try adjusting your filters or search criteria to find more options
        </p>
        <Button 
          variant="outline" 
          onClick={onClearFilters}
          className="hover:bg-gray-50 transition-colors"
        >
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default NoFlightsFound;
