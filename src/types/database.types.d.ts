import { Prisma } from '@prisma/client';

declare global {
  declare type User = Prisma.UserGetPayload<{
    include: {
      preferences: true;
    };
  }>;

  declare type Preferences = Prisma.PreferencesGetPayload<{
    select: {
      removeFromWatchlistConfirmation: true;
      signOutConfirmation: true;
    };
  }>;
  declare type Watchlist = Prisma.WatchlistGetPayload<{
    include: {
      items: {
        include: {
          media: true;
        };
      };
      owner: true;
    };
  }>;

  declare type WatchlistItem = Prisma.WatchlistItemGetPayload<{
    include: {
      media: true;
    };
  }>;

  declare type Media = Prisma.MediaGetPayload<object>;
}
