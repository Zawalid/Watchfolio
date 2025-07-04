import { SELECT_CLASSNAMES } from '@/styles/heroui';
import { Select, SelectItem, SelectSection } from '@heroui/select';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useQueryState } from 'nuqs';

type SortByProps = {
  options: { key: string; label: string }[];
  defaultSort?: string;
  defaultDir?: 'asc' | 'desc';
};
export default function SortBy({ options, defaultSort, defaultDir }: SortByProps) {
  const [sortBy, setSortBy] = useQueryState('sort', { defaultValue: defaultSort || options[0]?.key });
  const [sortDir, setSortDir] = useQueryState('dir', { defaultValue: defaultDir || 'desc' });

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
