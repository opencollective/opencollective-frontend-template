// Group tags will not transform the tag itself, but just include more tags when filtering on the key tag
// Group tags should include the tag itself
const defaultGroupTags = {
  climate: ['climate', 'climate change', 'climate justice', 'climate crisis', 'climate action', 'climate emergency'],
  'arts and culture': ['arts and culture', 'art', 'arts', 'visual art', 'visual arts', 'music'],
};

// Tags to exclude from the automatic category creation. These will still show up under "More..."
const defaultExcludeCategoryTags = [
  'other',
  'online',
  'community',
  'association',
  'movement',
  'usa',
  'midwestern usa',
  'illinois',
  'europe',
  'chicago',
];

export const hosts: {
  root?: boolean;
  name: string;
  slug?: string;
  hostSlugs?: string[];
  currency: string;
  startYear: number;
  logoSrc: string;
  color: { hex: string; closestPaletteColor: string };
  styles: {
    text: string;
    groupHoverText: string;
    button: string;
    brandBox: string;
    box: string;
    border: string;
  };
  website?: string;
  cta?: { text: string; textLonger: string; href: string; buttonLabel: string };
  groupTags: { [key: string]: string[] };
  includeCategoryTags: string[];
  excludeCategoryTags: string[];
}[] = [
  {
    root: true,
    name: 'Open Collective',
    hostSlugs: [
      'foundation',
      'europe',
      'opensource',
      'allforclimate',
      'the-social-change-nest',
      'ocnz',
      'giftcollective',
      'numfocus',
      'platform6-coop',
      'wwcodeinc',
      'reculture',
      'fission',
      'ferrous-systems-gmbh',
      'nfsc',
      'xwikisas',
    ],
    currency: 'USD',
    startYear: 2016,
    logoSrc: '/oc-logo.svg',
    color: { hex: '#0C2D66', closestPaletteColor: 'blue' },
    website: 'https://opencollective.com',
    styles: {
      text: 'text-[#0C2D66]',
      groupHoverText: 'group-hover:text-[#0C2D66]',
      button: 'bg-[#0C2D66] text-white',
      brandBox: 'lg:bg-[#F5FAFF] text-[#0C2D66]',
      box: 'bg-[#F5FAFF] text-[#0C2D66]',
      border: 'border-[#0C2D66]',
    },
    groupTags: {
      ...defaultGroupTags,
      'mutual aid': ['mutual aid', 'covid'],
      education: ['education', 'meetup'],
    },
    includeCategoryTags: [],
    excludeCategoryTags: [...defaultExcludeCategoryTags],
  },
  {
    name: 'Open Collective Foundation',
    slug: 'foundation',
    currency: 'USD',
    startYear: 2018,
    logoSrc: '/ocf-logo.svg',
    color: { hex: '#0C5559', closestPaletteColor: 'teal' },
    styles: {
      text: 'text-[#0C5559]',
      groupHoverText: 'group-hover:text-[#0C5559]',
      button: 'bg-[#0C5559] text-white',
      brandBox: 'lg:bg-[#F7FEFF] text-[#0C5559]',
      box: 'bg-[#F7FEFF] text-[#0C5559]',
      border: 'border-[#00a0a8]',
    },
    cta: {
      href: 'https://opencollective.com/solidarity-economy-fund/donate',
      buttonLabel: 'Contribute',
      text: 'Contribute to many collectives at once',
      textLonger: 'Contribute to a pooled fund to benefit multiple collectives within Open Collective Foundation',
    },
    groupTags: {
      ...defaultGroupTags,
    },
    includeCategoryTags: ['climate', 'food'],
    excludeCategoryTags: [...defaultExcludeCategoryTags],
  },
  {
    name: 'Open Source Collective',
    slug: 'opensource',
    currency: 'USD',
    startYear: 2016,
    logoSrc: '/osc-logo.svg',
    website: 'https://opencollective.com/opensource',
    color: { hex: '#4B3084', closestPaletteColor: 'purple' },
    styles: {
      text: 'text-[#4B3084]',
      groupHoverText: 'group-hover:text-[#4B3084]',
      button: 'bg-[#4B3084] text-white',
      brandBox: 'lg:bg-[#4B3084] lg:bg-opacity-5 text-[#4B3084]',
      box: 'bg-[#4B3084] bg-opacity-5 text-[#4B3084]',
      border: 'border-[#4B3084]',
    },
    groupTags: {
      ...defaultGroupTags,
    },
    includeCategoryTags: [],
    excludeCategoryTags: [...defaultExcludeCategoryTags, 'open source'],
  },
  {
    name: 'Open Collective Europe',
    slug: 'europe',
    currency: 'EUR',
    startYear: 2019,
    logoSrc: '/oce-logo.svg',
    website: 'https://opencollective.com/europe',
    color: { hex: '#0C2D66', closestPaletteColor: 'blue' },
    styles: {
      text: 'text-[#0C2D66]',
      groupHoverText: 'group-hover:text-[#0C2D66]',
      button: 'bg-[#0C2D66] text-white',
      brandBox: 'lg:bg-[#E0EC7B] lg:bg-opacity-20 text-[#0C2D66]',
      box: 'bg-[#E0EC7B] bg-opacity-20 text-[#0C2D66]',
      border: 'border-[#0C2D66]',
    },
    groupTags: {
      ...defaultGroupTags,
    },
    includeCategoryTags: [],
    excludeCategoryTags: [...defaultExcludeCategoryTags],
  },
];
