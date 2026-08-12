// Single source of truth for brand facts, service/location lists and the
// business schema node that Base.astro renders on every page.

export const SITE = {
  name: 'Concrete Toronto',
  legalName: 'Concrete Toronto',
  url: 'https://concrete-toronto.ca',
  phoneDisplay: '(416) 489-4898',
  phoneTel: 'tel:+14164894898',
  phoneSchema: '+1-416-489-4898',
};

export const SERVICES = [
  { slug: 'concrete-driveways', name: 'Concrete Driveways', blurb: 'New driveways and replacements on a compacted base' },
  { slug: 'concrete-patios', name: 'Concrete Patios', blurb: 'Level backyard patios finished to shed water' },
  { slug: 'concrete-walkways', name: 'Concrete Walkways', blurb: 'Front and side walkways with a slip-resistant finish' },
  { slug: 'concrete-sidewalks', name: 'Concrete Sidewalks', blurb: 'Safe, even sidewalks for homes and businesses' },
  { slug: 'concrete-porches', name: 'Concrete Porches', blurb: 'Porch repairs, resurfacing and new pours' },
  { slug: 'concrete-steps', name: 'Concrete Steps', blurb: 'Solid, even steps that meet the door right' },
  { slug: 'concrete-foundations', name: 'Concrete Foundations', blurb: 'Residential and commercial foundation work' },
  { slug: 'concrete-slabs', name: 'Concrete Slabs', blurb: 'Garage, shed and addition slabs, level and square' },
  { slug: 'concrete-repair', name: 'Concrete Repair', blurb: 'Crack and surface repairs that restore your concrete' },
  { slug: 'concrete-replacement', name: 'Concrete Replacement', blurb: 'Old surfaces removed, fresh concrete poured' },
  { slug: 'parging', name: 'Parging Services', blurb: 'Protective parge coats for walls and basements' },
];

export const LOCATIONS = [
  { slug: 'toronto', name: 'Toronto', lat: 43.6532, lon: -79.3832, blurb: 'Concrete contractor across the city of Toronto' },
  { slug: 'scarborough', name: 'Scarborough', lat: 43.7764, lon: -79.2318, blurb: 'From the Bluffs to Malvern' },
  { slug: 'markham', name: 'Markham', lat: 43.8561, lon: -79.337, blurb: 'Unionville, Milliken and Cornell' },
  { slug: 'richmond-hill', name: 'Richmond Hill', lat: 43.8828, lon: -79.4403, blurb: 'Mature streets and newer subdivisions' },
  { slug: 'vaughan', name: 'Vaughan', lat: 43.8372, lon: -79.5083, blurb: 'Woodbridge, Maple and Thornhill' },
  { slug: 'north-york', name: 'North York', lat: 43.7615, lon: -79.4111, blurb: 'Postwar bungalows and infill builds' },
  { slug: 'pickering', name: 'Pickering', lat: 43.8384, lon: -79.0868, blurb: 'West Durham, from the waterfront north' },
  { slug: 'oshawa', name: 'Oshawa', lat: 43.8971, lon: -78.8658, blurb: "Concrete work across Durham's largest city" },
  { slug: 'ajax', name: 'Ajax', lat: 43.8509, lon: -79.0204, blurb: 'Lakeside neighbourhoods to the north end' },
  { slug: 'whitby', name: 'Whitby', lat: 43.8975, lon: -78.9429, blurb: 'Downtown heritage homes to Brooklin' },
];

// Rendered on every page by Base.astro. Keep claims factual: this is what the
// business actually states (2-year warranty, 15 years, satisfaction guarantee).
export const businessSchema = {
  '@type': ['GeneralContractor', 'HomeAndConstructionBusiness', 'LocalBusiness'],
  '@id': 'https://concrete-toronto.ca/#business',
  name: 'Concrete Toronto',
  url: 'https://concrete-toronto.ca/',
  image: 'https://concrete-toronto.ca/assets/img/og-image.jpg',
  telephone: '+1-416-489-4898',
  description:
    'Concrete Toronto is a concrete contractor in Toronto, Ontario, installing and repairing concrete driveways, patios, walkways, sidewalks, porches, steps, foundations and slabs, with parging services for walls and basements. 2-year warranty and satisfaction guaranteed.',
  knowsAbout: [
    'concrete driveways',
    'concrete patios',
    'concrete walkways',
    'concrete sidewalks',
    'concrete porches',
    'concrete steps',
    'concrete foundations',
    'concrete slabs',
    'concrete repair',
    'concrete replacement',
    'parging',
    'foundation waterproofing',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Toronto',
    addressRegion: 'ON',
    addressCountry: 'CA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 43.6532,
    longitude: -79.3832,
  },
  areaServed: [
    ...LOCATIONS.map((l) => ({ '@type': 'City', name: l.name })),
    { '@type': 'AdministrativeArea', name: 'Greater Toronto Area' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Concrete and Parging Services',
    itemListElement: SERVICES.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.name },
    })),
  },
};

// Small builders so schema always matches the visible copy.
export function faqSchema(faqs) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumbSchema(crumbs) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: c.href ? `https://concrete-toronto.ca${c.href}` : undefined,
    })),
  };
}
