import { Button } from '@heroui/button';
import { Checkbox } from '@heroui/checkbox';
import { ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Modal } from '@/components/ui/Modal';

type List = {
  name: string;
  description: string;
  public: boolean;
  items: number[];
};

const sampleData: List[] = [
  {
    name: 'Movies I love',
    description: 'A curated list of my all-time favorite movies across various genres.',
    public: false,
    items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    name: 'Tv Shows',
    description: 'A list of tv shows that I have watched and enjoyed.',
    public: false,
    items: [1, 2, 3, 4, 5],
  },
];

export default function AddToList({ disclosure }: { disclosure: Disclosure }) {
  return (
    <Modal disclosure={disclosure}>
      <ModalHeader className='flex justify-center'>
        <h4 className='text-Primary-100 text-xl font-semibold'>Add to list</h4>
      </ModalHeader>
      <ModalBody>
        {sampleData.length ? (
          sampleData.map((list) => <List key={list.name} list={list} />)
        ) : (
          <p className='text-Grey-300 text-center'>
            No lists found. It looks like you haven&apos;t created any lists yet. Start by adding a new list.
          </p>
        )}
        <Button className='border-border hover:border-Primary-500 mt-5 text-white' variant='ghost' color='primary'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2}
            stroke='currentColor'
            className='size-5'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
          </svg>
          Create new list
        </Button>
      </ModalBody>
      <ModalFooter>
        <Button className='bg-Grey-800 hover:bg-Grey-700' onPress={disclosure.onClose}>
          Close
        </Button>
        <Button className='bg-Primary-500 hover:bg-Primary-600' onPress={disclosure.onClose}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
}

function List({ list }: { list: List }) {
  return (
    <div className='flex justify-between'>
      <Checkbox defaultSelected>{list.name}</Checkbox>
      <span className='bg-Grey-800 text-Grey-100 rounded-md px-2 py-1.5 text-sm'>{list.items.length} Items</span>
    </div>
  );
}
