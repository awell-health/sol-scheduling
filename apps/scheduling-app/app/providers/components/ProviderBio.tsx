'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';

type BioSectionKey = 'intro' | 'approach' | 'journey' | 'interests';

type BioSection = {
  key: BioSectionKey;
  heading?: string;
  paragraphs: string[];
};

const BIO_HEADINGS: { key: BioSectionKey; label: string }[] = [
  { key: 'approach', label: 'My Approach to Care' },
  { key: 'journey', label: 'A Journey into Exceptional Patient Care' },
  { key: 'interests', label: 'Personal Interests' }
];

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M6 9l6 6 6-6'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const ChevronUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M18 15L12 9 6 15'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const parseBioSections = (raw?: string): BioSection[] => {
  if (!raw) return [];

  // Normalize whitespace and line breaks
  const normalized = raw
    .replace(/\u00a0/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/&nbsp;/g, '');
  const lower = normalized.toLowerCase();

  type Marker = { key: BioSectionKey; label: string; index: number };
  const markers: Marker[] = [];

  for (const def of BIO_HEADINGS) {
    const idx = lower.indexOf(def.label.toLowerCase());
    if (idx !== -1) {
      markers.push({ ...def, index: idx });
    }
  }

  markers.sort((a, b) => a.index - b.index);

  const sections: BioSection[] = [];

  const pushSection = (
    key: BioSectionKey,
    heading: string | undefined,
    text: string
  ) => {
    const paragraphs = text
      .split(/\n{2,}/)
      .map((p) => p.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    if (paragraphs.length === 0) return;
    sections.push({ key, heading, paragraphs });
  };

  if (markers.length === 0) {
    const body = normalized.trim();
    if (body) {
      pushSection('intro', undefined, body);
    }
    return sections;
  }

  const start = 0;
  markers.forEach((marker, idx) => {
    if (idx === 0 && marker.index > start) {
      const introText = normalized.slice(start, marker.index).trim();
      if (introText) {
        pushSection('intro', undefined, introText);
      }
    }
    const nextStart =
      idx + 1 < markers.length ? markers[idx + 1].index : normalized.length;
    const bodyStart = marker.index + marker.label.length;
    const body = normalized.slice(bodyStart, nextStart).trim();
    if (body) {
      pushSection(marker.key, marker.label, body);
    }
  });

  return sections;
};

export type ProviderBioProps = {
  text?: string;
  profileLink?: string;
  collapsible?: boolean;
  showIntroHeading?: boolean;
};

export const ProviderBio: React.FC<ProviderBioProps> = ({
  text,
  profileLink,
  collapsible = true,
  showIntroHeading = false
}) => {
  const [expanded, setExpanded] = useState(!collapsible ? true : false);
  const sections = useMemo(() => parseBioSections(text), [text]);

  if (sections.length === 0) {
    return null;
  }

  const hasLabeledSections = sections.some((section) => section.key !== 'intro');
  const displaySections = sections.map((section) => {
    if (
      section.key === 'intro' &&
      showIntroHeading &&
      hasLabeledSections &&
      !section.heading
    ) {
      return {
        ...section,
        heading: 'Here to Help You Heal'
      };
    }
    return section;
  });

  // Non-collapsible variant (e.g. provider detail page)
  if (!collapsible) {
    return (
      <div className='space-y-3 text-sm text-slate-600'>
        {displaySections.map((section) => (
          <div key={section.key} className='space-y-1'>
            {section.heading && (
              <h4 className='text-xs font-semibold uppercase tracking-wide text-secondary-foreground'>
                {section.heading}
              </h4>
            )}
            {section.paragraphs.map((p, idx) => (
              <p key={idx} className='whitespace-normal leading-relaxed'>
                {p}
              </p>
            ))}
          </div>
        ))}

        {profileLink && (
          <a
            href={profileLink}
            target='_blank'
            rel='noreferrer'
            className='inline-block text-xs font-semibold text-primary underline-offset-4 hover:text-secondary-foreground hover:underline'
          >
            View profile
          </a>
        )}
      </div>
    );
  }

  return (
    <div className='relative'>
      <div
        className={clsx(
          'space-y-3 text-sm text-slate-600',
          !expanded && 'line-clamp-5'
        )}
      >
        {displaySections.map((section) => (
          <div key={section.key} className='space-y-1'>
            {section.heading && (
              <h4 className='text-xs font-semibold uppercase tracking-wide text-secondary-foreground'>
                {section.heading}
              </h4>
            )}
            {section.paragraphs.map((p, idx) => (
              <p key={idx} className='whitespace-normal leading-relaxed'>
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>

      {!expanded && (
        <div className='pointer-events-none absolute inset-x-0 -bottom-4 flex h-12 items-end justify-center bg-gradient-to-t from-white via-white/90 to-transparent'>
          <button
            type='button'
            onClick={() => setExpanded(true)}
            className='pointer-events-auto mb-2 flex flex-col items-center text-sm font-semibold text-primary underline-offset-2 hover:underline'
          >
            <span>More</span>
            <ChevronDownIcon className='h-3 w-3' />
          </button>
        </div>
      )}

      {expanded && (
        <div className='mt-2 flex flex-col gap-1'>
          {profileLink && (
            <a
              href={profileLink}
              target='_blank'
              rel='noreferrer'
              className='text-xs font-semibold text-primary underline-offset-4 hover:text-secondary-foreground hover:underline'
            >
              View profile
            </a>
          )}
          <button
            type='button'
            onClick={() => setExpanded(false)}
            className='flex flex-col items-center text-sm font-semibold text-primary underline-offset-2 hover:underline'
          >
            <ChevronUpIcon className='h-3 w-3' />
            <span>Hide</span>
          </button>
        </div>
      )}
    </div>
  );
};


