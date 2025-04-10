import { getDetails } from '@/lib/api';

interface MediaDetails {
  release_date?: string | null;
  first_air_date?: string | null;
  title?: string | null;
  name?: string | null;
  overview?: string | null;
  backdrop_path?: string | null;
}

export async function generateDetailsMetadata({ slug, type }: { slug: string; type: 'movie' | 'tv' }) {
  const details = (await getDetails(type, slug)) as MediaDetails | null;

  if (!details) return {};

  const releaseDate = details.release_date ?? details.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const title = `${details.title ?? details.name ?? 'Unknown'} (${releaseYear})`;

  return {
    title: `${title} | Watchfolio`,
    description: details.overview ?? '',
    openGraph: {
      title,
      description: details.overview ?? '',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${type === 'movie' ? 'movies' : 'tv'}/${slug}`,
      images: [
        {
          url: details.backdrop_path ? `https://image.tmdb.org/t/p/original${details.backdrop_path}` : '',
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
