'use client';

import { Input } from '@repo/ui/components/input';
import { Button } from '@repo/ui/components/button';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

interface JobSearchProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

export function JobSearch({ onSearch, initialValue = '' }: JobSearchProps) {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, 500);

  // Trigger search when debounced value changes
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value); // Immediate search on enter
  };

  return (
    <form onSubmit={handleSubmit} className='flex gap-2 mb-6'>
      <div className='relative flex-1'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Search by title, skill, or company...'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className='pl-9 h-12 text-md'
        />
      </div>
      <Button type='submit' size='lg' className='h-12 px-8'>
        Search
      </Button>
    </form>
  );
}
