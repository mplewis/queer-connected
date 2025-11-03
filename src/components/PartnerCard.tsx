import type React from 'react';
import type { Partner } from '../logic/partners';
import { Button } from './Button';
import './PartnerCard.css';
import { Icon } from '@iconify/react';

export interface PartnerCardProps {
  partner: Partner;
}

/**
 * Display a single partner with name, location, discount, and website link.
 */
export function PartnerCard({ partner }: PartnerCardProps): React.JSX.Element {
  const websiteUrl = partner.website ? `https://${partner.website}` : undefined;

  return (
    <div className="partner-card">
      <div className="partner-card__title">{partner.name}</div>
      {partner.location && (
        <div className="partner-card__location">
          <Icon
            icon="solar:point-on-map-perspective-bold"
            style={{ verticalAlign: 'middle', marginRight: '0.3rem' }}
          />
          {partner.location}
        </div>
      )}
      <div className="partner-card__discount">
        <Icon
          icon="solar:tag-price-bold"
          style={{ verticalAlign: 'middle', marginRight: '0.3rem' }}
        />
        {partner.discount}
      </div>
      {websiteUrl && (
        <div className="partner-card__actions">
          <Button
            variant="primary"
            size="sm"
            prefix={{ icon: 'solar:link-bold' }}
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Website
          </Button>
        </div>
      )}
    </div>
  );
}
