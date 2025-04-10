import CardsList from '@/components/CardsList';

const WithPagination = (func: (page: number) => Promise<TMDBResponse>) => {
  return async function Page({ searchParams }: { searchParams?: Promise<{ page?: string }> }) {
    const page = Number((await searchParams)?.page || 1);
    const data = await func(page);
    return <CardsList data={data} />;
  };
};

export default WithPagination;
