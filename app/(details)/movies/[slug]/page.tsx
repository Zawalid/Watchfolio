import Details from '../../components/Details';
import { getDetails } from '@/lib/api';
import { notFound } from 'next/navigation';
import { generateDetailsMetadata } from '@/utils/metadata';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return generateDetailsMetadata({ slug: (await params).slug, type: 'movie' });
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;
  const movie = await getDetails('movie', slug);

  if (!movie) notFound();

  return <Details media={{ ...movie, media_type: 'movie' }} />;
}
