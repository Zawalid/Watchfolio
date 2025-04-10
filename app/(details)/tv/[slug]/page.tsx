import Details from '../../components/Details';
import { getDetails } from '@/lib/api';
import { notFound } from 'next/navigation';
import { generateDetailsMetadata } from '@/utils/metadata';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return generateDetailsMetadata({ slug: (await params).slug, type: 'tv' });
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;
  const tvShow = await getDetails('tv', slug);

  if (!tvShow) notFound();

  // console.log(tvShow)

  return <Details media={{...tvShow,media_type : "tv"}} />;
}
