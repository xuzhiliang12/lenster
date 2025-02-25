import UserProfile from '@components/Shared/UserProfile';
import useModMode from '@components/utils/hooks/useModMode';
import clsx from 'clsx';
import type { FeedItem, Publication } from 'lens';
import type { FC } from 'react';
import { stopEventPropagation } from 'utils/stopEventPropagation';

import PublicationMenu from './Actions/Menu';
import Source from './Source';

interface PublicationHeaderProps {
  publication: Publication;
  className?: string;
  feedItem?: FeedItem;
}

const PublicationHeader: FC<PublicationHeaderProps> = ({ publication, className = '', feedItem }) => {
  const { allowed: modMode } = useModMode();
  const isMirror = publication.__typename === 'Mirror';
  const firstComment = feedItem?.comments && feedItem.comments[0];
  const rootPublication = feedItem ? (firstComment ? firstComment : feedItem?.root) : publication;
  const profile = feedItem
    ? rootPublication.profile
    : isMirror
    ? publication?.mirrorOf?.profile
    : publication?.profile;
  const timestamp = feedItem
    ? rootPublication.createdAt
    : isMirror
    ? publication?.mirrorOf?.createdAt
    : publication?.createdAt;

  return (
    <div
      className={clsx('flex justify-between space-x-1.5', className)}
      data-testid={`publication-${publication.id}-header`}
    >
      <span onClick={stopEventPropagation}>
        <UserProfile profile={profile} timestamp={timestamp} showStatus />
      </span>
      <div className="!-mr-[7px] flex items-center space-x-1">
        {modMode && <Source publication={publication} />}
        <PublicationMenu publication={publication} />
      </div>
    </div>
  );
};

export default PublicationHeader;
