import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus, X, Calendar, Type, HardDrive, Filter, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';

interface ActItem {
  id: string;
  title: string;
  thumbnail: string;
  size: string;
  date: string;
  downloadUrl: string;
  sourceUrl: string;
}

interface ParsedData {
  title: string;
  items: ActItem[];
}

const defaultUrls: string[] = [];

const Test: React.FC = () => {
  const [urls, setUrls] = useState<string[]>(defaultUrls || []);
  const [newUrl, setNewUrl] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [alphabetFilter, setAlphabetFilter] = useState<string>('');

  const addUrl = () => {
    if (newUrl.trim() && !urls.includes(newUrl.trim())) {
      setUrls([...urls, newUrl.trim()]);
      setNewUrl('');
    }
  };

  const removeUrl = (urlToRemove: string) => {
    setUrls(urls.filter((url) => url !== urlToRemove));
    if (activeTab === urlToRemove) {
      setActiveTab('all');
    }
  };

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  

  const { data: urlsData, isLoading } = useQuery({
    queryKey: ['acts-data', urls],
    queryFn: async () => {
      const results = await Promise.all(urls.map((url) => fetchUrlData(url)));
      return results.reduce(
        (acc, result, index) => {
          acc[urls[index]] = result;
          return acc;
        },
        {} as Record<string, ParsedData>
      );
    },
    enabled: urls.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const allItems = useMemo(() => {
    if (!urlsData) return [];

    const allItemsArray = Object.values(urlsData).flatMap((data) => data.items);
    const uniqueItems = allItemsArray.filter(
      (item, index, self) => index === self.findIndex((i) => i.title === item.title && i.size === item.size)
    );

    return uniqueItems;
  }, [urlsData]);

  const getActiveItems = () => {
    if (activeTab === 'all') return allItems;
    return urlsData?.[activeTab]?.items || [];
  };

  const filteredAndSortedItems = useMemo(() => {
    let items = getActiveItems();

    // Apply search filter
    if (searchQuery) {
      items = items.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Apply alphabetical filter
    if (alphabetFilter) {
      items = items.filter((item) => item.title.toLowerCase().startsWith(alphabetFilter.toLowerCase()));
    }

    // Apply sorting
    items.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'size':
          const getSizeInBytes = (size: string) => {
            const match = size.match(/(\d+\.?\d*)\s*(GB|MB|KB)/i);
            if (!match) return 0;
            const value = parseFloat(match[1]);
            const unit = match[2].toUpperCase();
            switch (unit) {
              case 'GB':
                return value * 1024 * 1024 * 1024;
              case 'MB':
                return value * 1024 * 1024;
              case 'KB':
                return value * 1024;
              default:
                return value;
            }
          };
          comparison = getSizeInBytes(a.size) - getSizeInBytes(b.size);
          break;
        case 'date':
        default:
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return items;
  }, [getActiveItems(), searchQuery, alphabetFilter, sortBy, sortDirection]);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className='bg-Grey-900 min-h-screen text-white'>
      <div className='container mx-auto max-w-6xl px-4 py-6'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='from-Primary-400 to-Tertiary-400 mb-2 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent'>
            Acts
          </h1>
          <p className='text-Grey-400'>Fetch and browse content from external sources</p>
        </div>

        {/* URL Management */}
        <div className='bg-blur mb-6 rounded-xl border border-white/10 p-6 shadow-2xl backdrop-blur-xl'>
          <h2 className='mb-4 flex items-center gap-2 text-lg font-semibold text-white'>
            <div className='bg-Primary-500 h-2 w-2 rounded-full'></div>
            Manage Sources
          </h2>

          {/* Add URL Input */}
          <div className='mb-4 flex gap-3'>
            <input
              type='url'
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder='Enter URL to fetch content from...'
              className='bg-Grey-800/80 placeholder:text-Grey-400 focus:ring-Primary-500 focus:border-Primary-500 flex-1 rounded-xl border border-white/20 px-4 py-3 text-white transition-all focus:ring-2 focus:outline-none'
              onKeyPress={(e) => e.key === 'Enter' && addUrl()}
            />
            <button
              onClick={addUrl}
              className='from-Primary-600 to-Primary-700 hover:from-Primary-700 hover:to-Primary-800 hover:shadow-Primary-500/20 flex items-center gap-2 rounded-xl bg-gradient-to-r px-6 py-3 font-medium text-white shadow-lg transition-all duration-300'
            >
              <Plus className='h-4 w-4' />
              Add
            </button>
          </div>

          {/* URL Chips */}
          {urls.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {urls.map((url) => {
                const hostname = new URL(url).hostname;
                return (
                  <div
                    key={url}
                    className='bg-Grey-800/60 text-Grey-300 hover:bg-Grey-700/60 group inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm transition-colors'
                  >
                    <div className='bg-Success-500 h-2 w-2 animate-pulse rounded-full'></div>
                    <span className='max-w-[200px] truncate'>{hostname}</span>
                    <button
                      onClick={() => removeUrl(url)}
                      className='text-Grey-400 hover:text-Error-400 ml-1 opacity-0 transition-colors group-hover:opacity-100'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {urls.length > 0 && (
          <>
            {/* Tabs */}
            <div className='mb-6 border-b border-white/10 pb-4'>
              <div className='flex gap-2 overflow-x-auto'>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-shrink-0 rounded-xl px-4 py-2 font-medium transition-all duration-300 ${
                    activeTab === 'all'
                      ? 'from-Primary-600 to-Primary-700 bg-gradient-to-r text-white shadow-lg'
                      : 'text-Grey-400 hover:bg-Grey-800/50 hover:text-white'
                  }`}
                >
                  All ({allItems.length})
                </button>
                {urls.map((url) => {
                  const data = urlsData?.[url];
                  const itemCount = data?.items.length || 0;
                  const title = data?.title || new URL(url).hostname;

                  return (
                    <button
                      key={url}
                      onClick={() => setActiveTab(url)}
                      className={`max-w-[200px] min-w-0 flex-shrink-0 rounded-xl px-4 py-2 font-medium transition-all duration-300 ${
                        activeTab === url
                          ? 'from-Secondary-600 to-Secondary-700 bg-gradient-to-r text-white shadow-lg'
                          : 'text-Grey-400 hover:bg-Grey-800/50 hover:text-white'
                      }`}
                    >
                      <span className='block truncate'>
                        {title} ({itemCount})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Controls */}
        <div className='mb-6 flex flex-col gap-4 lg:flex-row'>
          {/* Search */}
          <div className='relative flex-1'>
            <Search className='text-Grey-400 absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 transform' />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search videos...'
              className='bg-Grey-800/80 placeholder:text-Grey-400 focus:ring-Primary-500 focus:border-Primary-500 w-full rounded-xl border border-white/20 py-3 pr-4 pl-12 text-white transition-all focus:ring-2 focus:outline-none'
            />
          </div>

          {/* Sort Controls */}
          <div className='flex items-center gap-2'>
            <div className='bg-Grey-800/80 flex rounded-xl border border-white/10 p-1'>
              <button
                onClick={() => setSortBy('date')}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  sortBy === 'date'
                    ? 'bg-Primary-600 text-white shadow-md'
                    : 'text-Grey-400 hover:bg-Grey-700/50 hover:text-white'
                }`}
              >
                <Calendar className='h-4 w-4' />
                Date
              </button>
              <button
                onClick={() => setSortBy('name')}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  sortBy === 'name'
                    ? 'bg-Primary-600 text-white shadow-md'
                    : 'text-Grey-400 hover:bg-Grey-700/50 hover:text-white'
                }`}
              >
                <Type className='h-4 w-4' />
                Name
              </button>
              <button
                onClick={() => setSortBy('size')}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  sortBy === 'size'
                    ? 'bg-Primary-600 text-white shadow-md'
                    : 'text-Grey-400 hover:bg-Grey-700/50 hover:text-white'
                }`}
              >
                <HardDrive className='h-4 w-4' />
                Size
              </button>
            </div>

            {/* Sort Direction */}
            <button
              onClick={toggleSortDirection}
              className='bg-Grey-800/80 text-Grey-400 hover:bg-Grey-700/50 rounded-xl border border-white/10 px-3 py-2 transition-all duration-300 hover:text-white'
              aria-label={`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
            >
              {sortDirection === 'asc' ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
            </button>
          </div>
        </div>

        {/* Alphabetical Filter */}
        <div className='mb-6'>
          <div className='mb-3 flex items-center gap-3'>
            <Filter className='text-Primary-400 h-4 w-4' />
            <span className='text-Grey-400 text-sm font-medium'>Filter by first letter:</span>
            {alphabetFilter && (
              <button
                onClick={() => setAlphabetFilter('')}
                className='text-Primary-400 hover:text-Primary-300 bg-Primary-500/10 rounded-full px-2 py-1 text-xs font-medium transition-colors'
              >
                Clear ({alphabetFilter})
              </button>
            )}
          </div>
          <div className='flex flex-wrap gap-1'>
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => setAlphabetFilter(alphabetFilter === letter ? '' : letter)}
                className={`h-8 w-8 rounded-lg text-xs font-medium transition-all duration-300 ${
                  alphabetFilter === letter
                    ? 'from-Primary-600 to-Primary-700 scale-105 bg-gradient-to-r text-white shadow-lg'
                    : 'bg-Grey-800/60 text-Grey-400 hover:bg-Grey-700/60 hover:scale-105 hover:text-white'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className='flex items-center justify-center py-16'>
            <div className='text-center'>
              <div className='relative'>
                <div className='border-Grey-700 border-t-Primary-500 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4'></div>
                <div
                  className='border-t-Primary-300 absolute inset-0 mx-auto h-12 w-12 animate-spin rounded-full border-4 border-transparent'
                  style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                ></div>
              </div>
              <p className='text-Grey-400 font-medium'>Loading content...</p>
            </div>
          </div>
        )}

        {/* Content Grid */}
        {!isLoading && filteredAndSortedItems.length > 0 && (
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
            {filteredAndSortedItems.map((item) => (
              <div
                key={item.id}
                className='bg-blur hover:border-Primary-500/50 group hover:shadow-Primary-500/10 overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl'
              >
                {/* Thumbnail */}
                <div className='relative aspect-video overflow-hidden'>
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
                    loading='lazy'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>
                  <div className='absolute top-2 right-2'>
                    <span className='from-Primary-600 to-Primary-700 rounded-full bg-gradient-to-r px-2 py-1 text-xs font-medium text-white shadow-lg'>
                      Video
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className='p-4'>
                  <h3 className='group-hover:text-Primary-400 mb-3 line-clamp-2 text-sm leading-relaxed font-medium text-white transition-colors'>
                    {item.title}
                  </h3>

                  <div className='text-Grey-400 mb-4 space-y-2 text-xs'>
                    <div className='flex items-center gap-2'>
                      <HardDrive className='text-Primary-400 h-3 w-3' />
                      <span className='font-medium'>{item.size}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Calendar className='text-Secondary-400 h-3 w-3' />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* Download Link */}
                  {item.downloadUrl && (
                    <a
                      href={item.downloadUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='from-Primary-600 to-Primary-700 hover:from-Primary-700 hover:to-Primary-800 hover:shadow-Primary-500/20 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-3 py-2 text-xs font-medium text-white shadow-lg transition-all duration-300 hover:scale-105'
                    >
                      <ExternalLink className='h-3 w-3' />
                      Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredAndSortedItems.length === 0 && urlsData && (
          <div className='py-16 text-center'>
            <div className='text-Grey-400 mb-4'>
              <Search className='mx-auto mb-6 h-16 w-16 opacity-30' />
              <p className='mb-2 text-xl font-medium'>No items found</p>
              <p className='text-sm'>Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Test;

const fetchUrlData = async (url: string): Promise<ParsedData> => {
  try {
    // Enhanced headers to avoid blocking and appear more like a real browser
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const result = parseHtmlContent(html, url);

    if (result.items.length === 0) {
      console.warn(`No items parsed from ${url}. Title found: "${result.title}"`);
    }

    return result;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return {
      title: `Error: ${new URL(url).hostname}`,
      items: [],
    };
  }
};

const parseHtmlContent = (html: string, sourceUrl: string): ParsedData => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Try multiple selectors for title extraction
  const titleSelectors = ['h1', '.title', '[class*="title"]', '.page-title', '.collection-title'];
  let title = 'Unknown Collection';

  for (const selector of titleSelectors) {
    const titleElement = doc.querySelector(selector);
    if (titleElement?.textContent?.trim()) {
      title = titleElement.textContent.trim();
      break;
    }
  }

  const items: ActItem[] = [];

  // Multiple selector patterns for different site structures
  const itemSelectors = [
    '.theItem', // Bunkr style
    '.gallery-item', // Generic gallery
    '.file-item', // File listing
    '.media-item', // Media items
    '.video-item', // Video specific
    '.post', // Blog/post style
    '.card', // Card layouts
    '[class*="item"]', // Any class containing "item"
    '[class*="file"]', // Any class containing "file"
    'article', // Article elements
    '.thumbnail', // Thumbnail containers
    '.entry', // Entry style
  ];

  let itemElements: NodeListOf<Element> | null = null;
  let usedSelector = '';

  // Try each selector until we find content
  for (const selector of itemSelectors) {
    itemElements = doc.querySelectorAll(selector);
    if (itemElements.length > 0) {
      usedSelector = selector;
      break;
    }
  }

  if (!itemElements || itemElements.length === 0) {
    console.warn(`No items found for ${sourceUrl} with any known selectors`);
    return { title, items: [] };
  }

  itemElements.forEach((element, index) => {
    // Multiple ways to extract title/name
    const titleSelectors = [
      '.theName',
      '.title',
      '.name',
      '.filename',
      '.video-title',
      'h3',
      'h4',
      'h5',
      '.caption',
      '.description',
      '[title]',
      '[data-title]',
      '[alt]',
      '.item-title',
      '.media-title',
    ];

    let titleText = '';
    for (const selector of titleSelectors) {
      const titleEl = element.querySelector(selector);
      if (titleEl?.textContent?.trim()) {
        titleText = titleEl.textContent.trim();
        break;
      }
    }

    // Fallback to element attributes
    if (!titleText) {
      titleText =
        element.getAttribute('title') || element.getAttribute('data-title') || element.getAttribute('aria-label') || '';
    }

    // Multiple ways to extract thumbnail
    const thumbnailSelectors = [
      'img.grid-images_box-img',
      'img',
      '.thumbnail img',
      '.preview img',
      '.image img',
      '[data-src]',
      '[data-thumb]',
      '.poster',
      '.cover',
    ];

    let thumbnail = '';
    for (const selector of thumbnailSelectors) {
      const imgEl = element.querySelector(selector);
      if (imgEl) {
        thumbnail =
          imgEl.getAttribute('src') ||
          imgEl.getAttribute('data-src') ||
          imgEl.getAttribute('data-thumb') ||
          imgEl.getAttribute('data-original') ||
          '';
        if (thumbnail) break;
      }
    }

    // Multiple ways to extract size
    const sizeSelectors = [
      '.theSize',
      '.size',
      '.filesize',
      '.file-size',
      '.duration',
      '[class*="size"]',
      '[data-size]',
      '.meta .size',
      '.info .size',
    ];

    let size = '';
    for (const selector of sizeSelectors) {
      const sizeEl = element.querySelector(selector);
      if (sizeEl?.textContent?.trim()) {
        size = sizeEl.textContent.trim();
        break;
      }
    }

    // Fallback to data attributes
    if (!size) {
      size = element.getAttribute('data-size') || element.getAttribute('data-filesize') || '';
    }

    // Multiple ways to extract date
    const dateSelectors = [
      '.theDate',
      '.date',
      '.timestamp',
      '.created',
      '.uploaded',
      'time',
      '[datetime]',
      '.meta .date',
      '.info .date',
      '[data-date]',
    ];

    let date = '';
    for (const selector of dateSelectors) {
      const dateEl = element.querySelector(selector);
      if (dateEl?.textContent?.trim()) {
        date = dateEl.textContent.trim();
        break;
      } else if (dateEl?.getAttribute('datetime')) {
        date = dateEl.getAttribute('datetime') || '';
        break;
      }
    }

    // Fallback to data attributes
    if (!date) {
      date =
        element.getAttribute('data-date') ||
        element.getAttribute('data-created') ||
        element.getAttribute('data-timestamp') ||
        '';
    }

    // Multiple ways to extract download link
    const linkSelectors = [
      'a[href*="/f/"]',
      'a[href*="/file/"]',
      'a[href*="/download"]',
      'a[href*="/d/"]',
      'a[href*="/media/"]',
      'a[href*="/view/"]',
      'a.download',
      'a.file-link',
      'a.media-link',
      'a[download]',
      'a',
      '.download-link a',
      '.file-link a',
    ];

    let downloadLink = '';
    for (const selector of linkSelectors) {
      const linkEl = element.querySelector(selector);
      if (linkEl?.getAttribute('href')) {
        const href = linkEl.getAttribute('href') || '';
        // Prefer actual download/file links over generic links
        if (
          href.includes('/f/') ||
          href.includes('/file/') ||
          href.includes('/download') ||
          href.includes('/d/') ||
          linkEl.hasAttribute('download')
        ) {
          downloadLink = href;
          break;
        } else if (!downloadLink && href.startsWith('/')) {
          downloadLink = href; // Fallback to relative links
        }
      }
    }

    // Only add items that have both title and thumbnail (minimum requirements)
    if (titleText && thumbnail) {
      // Normalize thumbnail URL
      let normalizedThumbnail = thumbnail;
      if (!thumbnail.startsWith('http')) {
        if (thumbnail.startsWith('//')) {
          normalizedThumbnail = `https:${thumbnail}`;
        } else if (thumbnail.startsWith('/')) {
          normalizedThumbnail = `${new URL(sourceUrl).origin}${thumbnail}`;
        } else {
          normalizedThumbnail = `${new URL(sourceUrl).origin}/${thumbnail}`;
        }
      }

      // Normalize download URL
      let normalizedDownloadUrl = '';
      if (downloadLink) {
        if (downloadLink.startsWith('http')) {
          normalizedDownloadUrl = downloadLink;
        } else if (downloadLink.startsWith('/')) {
          normalizedDownloadUrl = `${new URL(sourceUrl).origin}${downloadLink}`;
        } else {
          normalizedDownloadUrl = `${new URL(sourceUrl).origin}/${downloadLink}`;
        }
      }

      items.push({
        id: `${sourceUrl}-${index}`,
        title: titleText,
        thumbnail: normalizedThumbnail,
        size: size || 'Unknown',
        date: date || 'Unknown',
        downloadUrl: normalizedDownloadUrl,
        sourceUrl,
      });
    }
  });

  // Log parsing results for debugging
  console.log(`Parsed ${items.length} items from ${sourceUrl} using selector: ${usedSelector}`);

  return { title, items };
};
