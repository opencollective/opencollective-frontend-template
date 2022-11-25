import React from 'react';
import { Flipped,Flipper } from 'react-flip-toolkit';
import { FormattedDate } from 'react-intl';
import sanitizeHtml from 'sanitize-html';

const updates = [
  {
    title: 'FFFNYC 2021 End of Year Update',
    createdAt: '2022-01-03T01:54:08.435Z',
    account: {
      slug: 'fridays-for-future-nyc',
      imageUrl: 'https://images.opencollective.com/fridays-for-future-nyc/c3342b9/logo.png',
      name: 'Fridays for Future NYC',
      tags: [
        'community',
        'new york city',
        'movement',
        'climate strikes',
        'climate movement',
        'fridays for future',
        'climate change',
        'climate',
        'USA',
        'climate justice',
        'nyc',
        'enviornment',
        'enviornmentalism',
        'new York',
        'save the enviornment',
        'youth activism',
        'environment',
        'activism',
        'greta thunberg',
      ],
    },
    slug: 'fffnyc-2021-end-of-year-update',
    summary:
      '2021 has been an eventful year for FFFNYC. On September 24th, we had our first in person strike in almost 2 years, with 2,000 people attending, and incredible speakers including Jamie Margolin, Tokata Iron Eyes, Jerome Foster II, and Xiye B...',
    fromAccount: {
      name: 'Emma Buretta',
      imageUrl: 'https://images.opencollective.com/emma-buretta/avatar.png',
    },
  },
  {
    title: "We'd like to introduce ourselves!",
    createdAt: '2021-07-06T22:51:53.863Z',
    account: {
      slug: 'fridaysforfuture-us',
      imageUrl: 'https://images.opencollective.com/fridaysforfuture-us/56bc2e5/logo.png',
      name: 'Fridays for Future U.S.',
      tags: ['activism', 'environment', 'Climate', 'USA', 'climate justice', 'usa', 'strike'],
    },
    slug: 'wed-like-to-introduce-ourselves',
    summary:
      'Hi! We wanted to let you know that we have a new system for administering the FFF USA Open Collective. A few months ago, we rebooted the FFF USA structure and set up a Finance Working Group (WG). In that Finance WG, we set up some...',
    fromAccount: {
      name: 'Katharina',
      imageUrl: 'https://images.opencollective.com/katharina-maier/efff77e/avatar.png',
    },
  },
  {
    title: 'Action Network Improvements',
    createdAt: '2020-02-09T02:45:36.723Z',
    account: {
      slug: 'ccc',
      imageUrl: 'https://images.opencollective.com/ccc/logo.png',
      name: 'Climate Crisis Collective',
      tags: [
        'open source',
        'climate crisis',
        'climate emergency',
        'online',
        'civic tech',
        'activism',
        'climate change',
        'climate',
        'global',
        'climate justice',
      ],
    },
    slug: 'action-network-improvements',
    summary:
      'After an extensive analysis of needs for organizers of decentralized climate movements (Sunrise, Extinction Rebellion, Fridays for Future) Climate Crisis Collective helped develop the brand new "Activist" tab in the Action Network softwa...',
    fromAccount: {
      name: 'Albert Wenger',
      imageUrl: 'https://images.opencollective.com/albertwenger/6d9ec70/avatar.png',
    },
  },
  {
    title: 'How to generate a donation tax receipt using Open Collective',
    createdAt: '2021-04-02T16:00:51.926Z',
    account: {
      slug: 'mealsofgratitude',
      imageUrl: 'https://images.opencollective.com/mealsofgratitude/695c15f/logo.png',
      name: 'Meals of Gratitude',
      tags: ['covid', 'western USA', 'covid-19', 'california', 'food', 'palo alto', 'USA', 'community'],
    },
    slug: 'how-to-generate-a-donation-tax-receipt-using-open-collective',
    summary:
      'Meals of Gratitude Community- Thank you so much for your continued generosity, and helping us to serve so many people. As tax season is upon us, we wanted to send out information that might be helpful. You should have received a receipt by...',
    fromAccount: {
      name: 'Holly Tabor',
      imageUrl: 'https://images.opencollective.com/holly-tabor/avatar.png',
    },
  },
  {
    title: 'Update and moving forward as needs increase',
    createdAt: '2020-12-07T21:19:10.673Z',
    account: {
      slug: 'mealsofgratitude',
      imageUrl: 'https://images.opencollective.com/mealsofgratitude/695c15f/logo.png',
      name: 'Meals of Gratitude',
      tags: ['covid', 'western USA', 'covid-19', 'california', 'food', 'palo alto', 'USA', 'community'],
    },
    slug: 'update-and-moving-forward-as-needs-increase',
    summary:
      'December 7, 2020 To Our Meals of Gratitude Supporters- In this season, and in this uncertain time, we have much to be thankful for. But we are especially thankful for all of you, and for your support. With your help, we have delivered...',
    fromAccount: {
      name: 'Holly Tabor',
      imageUrl: 'https://images.opencollective.com/holly-tabor/avatar.png',
    },
  },
  {
    title: 'Update and Addressing Devastating Fires',
    createdAt: '2020-08-21T23:59:55.299Z',
    account: {
      slug: 'mealsofgratitude',
      imageUrl: 'https://images.opencollective.com/mealsofgratitude/695c15f/logo.png',
      name: 'Meals of Gratitude',
      tags: ['covid', 'western USA', 'covid-19', 'california', 'food', 'palo alto', 'USA', 'community'],
    },
    slug: 'update-and-addressing-devastating-fires',
    summary:
      'August 21, 2020To Our Meals of Gratitude Supporters-We want to thank each of you for so much for your amazing support. With your help, since March we have delivered loving meals and virtual hugs to nearly 15,500 frontline health care worker...',
    fromAccount: {
      name: 'Holly Tabor',
      imageUrl: 'https://images.opencollective.com/holly-tabor/avatar.png',
    },
  },

  {
    title: 'A Message for You, Our Founding Contributers',
    createdAt: '2020-04-03T01:42:20.868Z',
    account: {
      slug: 'mealsofgratitude',
      imageUrl: 'https://images.opencollective.com/mealsofgratitude/695c15f/logo.png',
      name: 'Meals of Gratitude',
      tags: ['covid', 'western USA', 'covid-19', 'california', 'food', 'palo alto', 'USA', 'community'],
    },
    slug: 'a-message-for-you-our-founding-contributers',
    summary:
      'April 2, 2020Dear Meals of Gratitude Contributor:We are overwhelmed with the outpouring of generosity from you, our founding contributors and wanted to provide you a quick update. <strong>Thank you for your donation to Meals of Gratitude...</strong>',
    fromAccount: {
      name: 'Jeanne and Michael Dechiario',
      imageUrl: 'https://images.opencollective.com/jeanne-and-michael-dechiario/avatar.png',
    },
  },
  {
    title: 'End of year 2021!',
    createdAt: '2022-01-03T22:11:15.434Z',
    account: {
      slug: 'stop-the-sweeps-atx',
      imageUrl: 'https://images.opencollective.com/stop-the-sweeps-atx/17eeebb/logo.png',
      name: 'Stop The Sweeps ATX',
      tags: ['southern USA', 'austin', 'texas', 'housing', 'mutual aid', 'USA', 'social justice'],
    },
    slug: 'end-of-year-2021',
    summary:
      '2021 was a challenging year in Austin, with the winter storm and then the passing of Prop B which criminalizes camping, sitting and lying down in public spaces. Almost all of our neighbors who used to be visible to us where we could meet th...',
    fromAccount: {
      name: 'Michelle',
      imageUrl: 'https://images.opencollective.com/michelle-molnar/7bd9b0f/avatar.png',
    },
  },
  {
    title: 'DisCO-One Project Grant First Project Update, August 2022',
    createdAt: '2022-08-11T13:25:45.206Z',
    account: {
      slug: 'disco-one-project-grant',
      imageUrl: 'https://images.opencollective.com/disco-one-project-grant/9ce58b6/logo.png',
      name: 'DisCO One Project Grant',
      tags: ['coop', 'online', 'civic tech', 'global'],
    },
    slug: 'disco-one-project-grant-first-project-update-august-2022',
    summary:
      '<strong>August 2022:</strong> From the DisCO team, we’re happy to offer our first update, after beginning our work on the One Project grant with the support of Open Collective as our fiscal sponsor. · We held a kick-off meeting late March a...',
    fromAccount: {
      name: 'Ann Marie Utratel',
      imageUrl: 'https://images.opencollective.com/ann-marie-utratel/7fac63e/avatar.png',
    },
  },
  {
    title: 'Chaos Computer Quarterly Update 2!',
    createdAt: '2022-11-06T00:51:18.841Z',
    account: {
      slug: 'chaos-computer',
      imageUrl: 'https://images.opencollective.com/chaos-computer/3a7ac48/logo.png',
      name: 'Chaos Computer',
      tags: ['new york city', 'arts and culture', 'nyc', 'new york', 'meetup', 'USA'],
    },
    slug: 'chaos-computer-quarterly-update1',
    summary:
      "Hello! Yes we are a bit late with this but there has been so much going on it's been hard to find the time. We counted recently and we have had 165 events since we first opening our doors in March. This is not to claim that a project like t...",
    fromAccount: {
      name: 'Bayley Sweitzer',
      imageUrl: 'https://images.opencollective.com/bayley-sweitzer1/avatar.png',
    },
  },

  {
    title: 'Grateful for you and your support!',
    createdAt: '2021-12-13T23:17:25.503Z',
    account: {
      slug: 'art_coop',
      imageUrl: 'https://images.opencollective.com/art_coop/9182ff4/logo.png',
      name: 'Art.coop',
      tags: ['arts and culture', 'education', 'online', 'event', 'grants', 'global', 'community', 'solidarity economy'],
    },
    slug: 'grateful-for-you-and-your-support',
    summary:
      'Hello! We hope this finds you, your loved ones, and community feeling safe and connected. The Art.Coop team wanted to take a moment to acknowledge and thank you for the different ways that each of you supported us this year: participated/at...',
    fromAccount: {
      name: 'Marina Lopez',
      imageUrl: 'https://images.opencollective.com/marina-lopez/9514d27/avatar.png',
    },
  },
  {
    title: 'Reflections + Next Steps for Art.coop Study-into-Action',
    createdAt: '2021-10-22T08:18:08.189Z',
    account: {
      slug: 'art_coop',
      imageUrl: 'https://images.opencollective.com/art_coop/9182ff4/logo.png',
      name: 'Art.coop',
      tags: ['arts and culture', 'education', 'online', 'event', 'grants', 'global', 'community', 'solidarity economy'],
    },
    slug: 'reflections-next-steps-for-art-coop-study-into-action',
    summary:
      'Happy Friday, Study-into-Action public participants! · We are writing<strong> to share our next steps at Art.coop </strong>and to invite you into the work ahead. Two weeks ago, we had our closing session with the internal cohort of 105 part...',
    fromAccount: {
      name: 'Caroline Woolard',
      imageUrl: 'https://images.opencollective.com/caroline-woolard/0f1e795/avatar.png',
    },
  },
  {
    title: 'We asked our groups these 3 questions this month / Hicimos a nuestros grupos estas tres preguntas',
    createdAt: '2022-02-11T16:11:15.629Z',
    account: {
      slug: 'bushwick-ayuda-mutua',
      imageUrl: 'https://images.opencollective.com/bushwick-ayuda-mutua/e687508/logo.png',
      name: 'Bushwick Ayuda Mutua',
      tags: [
        'bushwick',
        'ayuda mutua',
        'solidarity economy',
        'pandemic',
        'USA',
        'newyork',
        'covid',
        'brooklyn',
        'community support',
        'north brooklyn',
        'Northeastern USA',
        'new york',
        'covid-19',
        'mutual aid',
        'northbrooklyn',
        'coronavirus',
      ],
    },
    slug: 'we-asked-our-groups-these-3-questions-this-month-hicimos-a-nuestros-grupos-estas-tres-preguntas',
    summary:
      'Ushering in a new year means revisiting, re-envisioning, and often renewing our collective commitments to the community. With this new year, we look to growing deep relationships, coalition building, and abundance as ways forward, and are g...',
    fromAccount: {
      name: 'Kay Ablamsky',
      imageUrl: 'https://images.opencollective.com/kristen-ablamaky/95ca831/avatar.png',
    },
  },
  {
    title: 'BAM now has a newsletter / BAM ahora tiene un boletín',
    createdAt: '2021-12-01T22:59:04.823Z',
    account: {
      slug: 'bushwick-ayuda-mutua',
      imageUrl: 'https://images.opencollective.com/bushwick-ayuda-mutua/e687508/logo.png',
      name: 'Bushwick Ayuda Mutua',
      tags: [
        'bushwick',
        'ayuda mutua',
        'solidarity economy',
        'pandemic',
        'USA',
        'newyork',
        'covid',
        'brooklyn',
        'community support',
        'north brooklyn',
        'Northeastern USA',
        'new york',
        'covid-19',
        'mutual aid',
        'northbrooklyn',
        'coronavirus',
      ],
    },
    slug: 'breaking-bam-now-has-a-newsletter-noticias-bam-ahora-tiene-un-boletin',
    summary:
      '<strong>Thank you for supporting Bushwick Ayuda Mutua. </strong> · Without your contributions, financial or otherwise, we would not have been able to gain all of the community wins we have over these past 18 months! It’s probably been a min...',
    fromAccount: {
      name: 'Kay Ablamsky',
      imageUrl: 'https://images.opencollective.com/kristen-ablamaky/95ca831/avatar.png',
    },
  },
  {
    title: 'Food Distribution Project Update 2021',
    createdAt: '2021-06-08T15:20:23.409Z',
    account: {
      slug: 'bushwick-ayuda-mutua',
      imageUrl: 'https://images.opencollective.com/bushwick-ayuda-mutua/e687508/logo.png',
      name: 'Bushwick Ayuda Mutua',
      tags: [
        'bushwick',
        'ayuda mutua',
        'solidarity economy',
        'pandemic',
        'USA',
        'newyork',
        'covid',
        'brooklyn',
        'community support',
        'north brooklyn',
        'Northeastern USA',
        'new york',
        'covid-19',
        'mutual aid',
        'northbrooklyn',
        'coronavirus',
      ],
    },
    slug: 'food-distribution-project-update-2021',
    summary:
      '<strong>Hi Everyone!! We want to first thank you all for your generous donations this past year. We recognize that this has been a very difficult time for many of you, so it means a lot to have the support of more than 1800 contrib</strong>...',
    fromAccount: {
      name: 'Kat Fer',
      imageUrl: 'https://images.opencollective.com/kat-fer/6962e52/avatar.png',
    },
  },
  {
    title: 'Your Input Is Needed: A Bold New Program That Will Impact Hundreds of Neighbors',
    createdAt: '2020-07-16T19:35:43.531Z',
    account: {
      slug: 'bushwick-ayuda-mutua',
      imageUrl: 'https://images.opencollective.com/bushwick-ayuda-mutua/e687508/logo.png',
      name: 'Bushwick Ayuda Mutua',
      tags: [
        'bushwick',
        'ayuda mutua',
        'solidarity economy',
        'pandemic',
        'USA',
        'newyork',
        'covid',
        'brooklyn',
        'community support',
        'north brooklyn',
        'Northeastern USA',
        'new york',
        'covid-19',
        'mutual aid',
        'northbrooklyn',
        'coronavirus',
      ],
    },
    slug: 'your-input-is-needed-a-bold-new-program-that-will-impact-hundreds-of-neighbors',
    summary:
      'Happy Thursday, Friends! <strong>Introducing: BAM Community Partners</strong>If you’re a business who donated, please <a href="https://bit.ly/BAMCommunityPartnerExploration" target="_blank">fill out this quick survey</a>. Not a Bushwick bus...',
    fromAccount: {
      name: 'Kay Ablamsky',
      imageUrl: 'https://images.opencollective.com/kristen-ablamaky/95ca831/avatar.png',
    },
  },
  {
    title: 'BAM Newsletter: BLACK LIVES MATTER',
    createdAt: '2020-06-07T15:55:21.377Z',
    account: {
      slug: 'bushwick-ayuda-mutua',
      imageUrl: 'https://images.opencollective.com/bushwick-ayuda-mutua/e687508/logo.png',
      name: 'Bushwick Ayuda Mutua',
      tags: [
        'bushwick',
        'ayuda mutua',
        'solidarity economy',
        'pandemic',
        'USA',
        'newyork',
        'covid',
        'brooklyn',
        'community support',
        'north brooklyn',
        'Northeastern USA',
        'new york',
        'covid-19',
        'mutual aid',
        'northbrooklyn',
        'coronavirus',
      ],
    },
    slug: 'bam-newsletter-black-lives-matter',
    summary:
      'Hola Bushwick Familia,Bushwick Ayuda Mutua (BAM) admin team here - Fernando Ramos, Maria Herron, Samy Nemir Olivares, Sara Rodas, Kristen Ablamsky, and Anne Guiney.We are sending you so much love. This is a heartbreaking time when so man...',
    fromAccount: {
      name: 'Sara',
      imageUrl: 'https://images.opencollective.com/sara4/avatar.png',
    },
  },
];

export default function Updates({ currentTag, openCollectiveModal }) {
  const sortedUpdates = React.useMemo(() => {
    return updates.sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf());
  }, []);
  return (
    <div>
      <h1 className="mb-6 text-4xl font-bold text-gray-500">Updates from collectives</h1>
      <Flipper flipKey={currentTag}>
        <div className="min-h-[560px] space-y-4">
          {sortedUpdates
            .filter(update => currentTag === 'ALL' || update.account.tags.includes(currentTag))
            .slice(0, 3)
            .map(update => {
              return (
                <Flipped flipId={update.createdAt} key={update.createdAt}>
                  <div className="fadeIn flex flex-col gap-1 rounded-lg bg-white px-4 py-4">
                    <a
                      className=" relative mb-0  block space-y-2 overflow-hidden rounded-lg p-4 transition-colors duration-100 hover:bg-gray-50 "
                      href={`https://opencollective.com/${update.account.slug}/updates/${update.slug}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="flex items-center justify-between gap-6">
                        <h4 className="flex-shrink overflow-hidden text-ellipsis whitespace-nowrap text-xl font-medium text-gray-900 group-hover:underline">
                          {update.title}
                        </h4>
                        <p className="flex-shrink-0  text-gray-600">
                          <FormattedDate dateStyle={'medium'} value={update.createdAt} />
                        </p>
                      </div>
                      <p className="overflow-hidden text-ellipsis whitespace-nowrap text-base text-gray-500">
                        {sanitizeHtml(update.summary, { allowedTags: [], allowedAttributes: {} })}
                      </p>
                    </a>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                        <button
                          className=" flex items-center gap-2 rounded-md px-4 py-2 hover:bg-gray-50"
                          type="button"
                          onClick={() => openCollectiveModal(update.account.slug)}
                        >
                          <img
                            src={update.account.imageUrl.replace('-staging', '')}
                            alt={update.account.name}
                            className="h-8 w-8 rounded object-cover"
                          />
                          <span className="font-medium">{update.account.name}</span>
                        </button>
                        ·
                        <img
                          src={update.fromAccount.imageUrl.replace('-staging', '')}
                          alt={update.fromAccount.name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium">{update.fromAccount.name}</span>
                      </div>
                    </div>
                  </div>
                </Flipped>
              );
            })}
        </div>
      </Flipper>
    </div>
  );
}
