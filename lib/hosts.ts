export const hosts: {
  name: string;
  slug: string;
  hostSlugs?: string[];
  currency: string;
  startYear: number;
  logoSrc: string;
  color: string;
  styles: { text: string; groupHoverText: string; button: string; brandBox: string; box: string; border: string };
  website?: string;
  categories?: { label: string; tag: string }[];
  cta?: { text: string; textLonger: string; href: string; buttonLabel: string };
  root?: boolean;
}[] = [
  {
    name: 'Open Collective',
    slug: '',
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
    root: true,
    currency: 'USD',
    startYear: 2016,
    logoSrc: '/oc-logo.svg',
    color: 'blue',
    website: 'https://opencollective.com',
    styles: {
      text: 'text-[#0C2D66]',
      groupHoverText: 'group-hover:text-[#0C2D66]',
      button: 'bg-[#0C2D66] text-white',
      brandBox: 'lg:bg-[#F5FAFF] text-[#0C2D66]',
      box: 'bg-[#F5FAFF] text-[#0C2D66]',
      border: 'border-[#0C2D66]',
    },
  },
  {
    name: 'Open Collective Foundation',
    slug: 'foundation',
    currency: 'USD',
    startYear: 2018,
    logoSrc: '/ocf-logo.svg',
    color: 'teal',
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
    categories: [
      { label: 'Mutual aid', tag: 'mutual aid' },
      { label: 'Education', tag: 'education' },
      { label: 'Civic Tech', tag: 'civic tech' },
      { label: 'Food', tag: 'food' },
      { label: 'Arts & Culture', tag: 'arts and culture' },
      {
        label: 'Climate',
        tag: 'climate',
      },
    ],
  },
  {
    name: 'Open Source Collective',
    slug: 'opensource',
    currency: 'USD',
    startYear: 2016,
    logoSrc: '/osc-logo.svg',
    website: 'https://opencollective.com/opensource',
    color: 'purple',
    styles: {
      text: 'text-[#4B3084]',
      groupHoverText: 'group-hover:text-[#4B3084]',
      button: 'bg-[#4B3084] text-white',
      brandBox: 'lg:bg-[#4B3084] lg:bg-opacity-5 text-[#4B3084]',
      box: 'bg-[#4B3084] bg-opacity-5 text-[#4B3084]',
      border: 'border-[#4B3084]',
    },
  },
  {
    name: 'Open Collective Europe',
    slug: 'europe',
    currency: 'EUR',
    startYear: 2019,
    logoSrc: '/oce-logo.svg',
    website: 'https://opencollective.com/europe',
    color: 'blue',
    styles: {
      text: 'text-[#0C2D66]',
      groupHoverText: 'group-hover:text-[#0C2D66]',
      button: 'bg-[#0C2D66] text-white',
      brandBox: 'lg:bg-[#E0EC7B] lg:bg-opacity-20 text-[#0C2D66]',
      box: 'bg-[#E0EC7B] bg-opacity-20 text-[#0C2D66]',
      border: 'border-[#0C2D66]',
    },
  },
];
