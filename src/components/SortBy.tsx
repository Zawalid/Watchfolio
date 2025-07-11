import { SELECT_CLASSNAMES } from '@/styles/heroui';
import { Select, SelectItem, SelectProps, SelectSection } from '@heroui/select';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useQueryState } from 'nuqs';

interface SortByProps extends Omit<SelectProps, 'children'> {
  options: { key: string; label: string }[];
  defaultSort?: string;
  defaultDir?: 'asc' | 'desc';
}
export default function SortBy({ options, defaultSort, defaultDir, ...props }: SortByProps) {
  const [sortBy, setSortBy] = useQueryState('sort_by', { defaultValue: defaultSort || options[0]?.key });
  const [sortDir, setSortDir] = useQueryState('sort_dir', { defaultValue: defaultDir || 'desc' });

  return (
    <Select
      placeholder='Sort by'
      classNames={{ ...SELECT_CLASSNAMES, listboxWrapper: 'max-h-none!' }}
      aria-label='Sort options'
      selectedKeys={[sortBy, sortDir]}
      onChange={(e) => {
        const val = e.target.value;
        if (['asc', 'desc'].includes(val)) setSortDir(val);
        else setSortBy(val);
      }}
      {...props}
    >
      <SelectSection title='Sort By' showDivider>
        {options.map((option) => (
          <SelectItem key={option.key}>{option.label}</SelectItem>
        ))}
      </SelectSection>
      <SelectSection title='Direction'>
        <SelectItem key='asc' startContent={<ArrowUp className='size-3.5' />}>
          Ascending
        </SelectItem>
        <SelectItem key='desc' startContent={<ArrowDown className='size-3.5' />}>
          Descending
        </SelectItem>
      </SelectSection>
    </Select>
  );
}
