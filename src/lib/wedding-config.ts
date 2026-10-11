export const wedding = {
  groom: 'Christian',
  bride: 'Joya',
  groomFull: 'Christian Doueihy',
  brideFull: 'Joya bou francis',
  groomFather: 'tanous Doueihy',
  groomMother: 'Antoinette Doueihy',
  brideFather: 'simon bou francis',
  brideMother: 'jocelyne  bou francis',
  date: '2027-09-05',
  time: '18:00',
  rsvpDeadline: '2027-08-01',

  verse: 'WHAT THEREFORE GOD HAS JOINED TOGETHER, DON\u2019T LET MAN TEAR APART.',
  verseRef: '(MATTHEW 19:6)',

  colors: {
    primary: '#8B6F5C',
    secondary: '#F5E6D3',
    accent: '#C9A96E',
    dark: '#3D2B1F',
    bg: '#FDF8F0',
    text: '#2C1810',
  },

  schedule: [
    {
      id: 'ceremony',
      title: 'The Ceremony',
      time: '6:00 PM',
      location: 'St peter and St Paul Church, Ehden',
      mapsUrl: 'https://maps.app.goo.gl/',
      icon: 'church',
    },
    {
      id: 'vows',
      title: 'We Do',
      time: '7:30 PM',
      location: 'Venue Name',
      mapsUrl: 'https://maps.app.goo.gl/',
      icon: 'rings',
    },
    {
      id: 'drinks',
      title: 'We Drink',
      time: '8:00 PM',
      location: 'Koobra-ehden, Ehden',
      mapsUrl: 'https://maps.app.goo.gl/',
      icon: 'champagne',
    },
    {
      id: 'dinner',
      title: 'We Dine',
      time: '9:00 PM',
      location: 'Koobra-ehden, Ehden',
      mapsUrl: 'https://maps.app.goo.gl/',
      icon: 'cake',
    },
    {
      id: 'party',
      title: 'We Dance',
      time: '10:00 PM',
      location: 'Koobra-ehden, Ehden',
      mapsUrl: '',
      icon: 'dance',
    },
  ],

  giftRegistry: {
    title: 'Gift Registry',
    message: 'Your love, laughter, and presence are all we could wish for on our special day. For those who wish, a wedding list is available.',
    bank: 'Bank Name',
    account: 'Account Number',
  },

  music: '/public/music/videoplayback (1).weba',

  rsvp: {
    maxGuests: 7,
    options: [1, 2, 3, 4, 5, 6, 7],
  },
};
