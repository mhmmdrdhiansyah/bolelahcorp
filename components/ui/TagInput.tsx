'use client';

import { useState, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  minTags?: number;
}

export function TagInput({
  value,
  onChange,
  placeholder = 'Type and press Enter...',
  className,
  minTags = 0
}: TagInputProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!value.includes(input.trim())) {
        onChange([...value, input.trim()]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(value.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className={cn(
      'flex flex-wrap gap-2 p-2 min-h-[48px] rounded-lg border-2',
      value.length < minTags ? 'border-coral/50' : 'border-mist/30',
      'bg-steel/20 focus-within:border-coral transition-colors',
      className
    )}>
      {value.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-coral/20 text-coral text-sm"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="hover:text-coral-light transition-colors"
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] bg-transparent outline-none text-off-white placeholder-mist/50"
      />
    </div>
  );
}
