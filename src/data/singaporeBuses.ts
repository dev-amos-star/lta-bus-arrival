import { BusStop, BusServiceDetail } from '../types/bus';

export const SINGAPORE_BUS_STOPS: BusStop[] = [
  // Orchard / Somerset / Dhoby Ghaut
  {
    BusStopCode: '09048',
    RoadName: 'Orchard Turn',
    Description: 'Orchard Stn/ION Orchard',
    Latitude: 1.3040,
    Longitude: 103.8318,
    mrtConnections: [
      { code: 'NS22', line: 'NSL', name: 'Orchard' },
      { code: 'TE14', line: 'TEL', name: 'Orchard' }
    ],
    services: ['7', '14', '36', '65', '106', '143', '174', '190', '502']
  },
  {
    BusStopCode: '09047',
    RoadName: 'Orchard Blvd',
    Description: 'Opp Orchard Stn/ION',
    Latitude: 1.3032,
    Longitude: 103.8322,
    mrtConnections: [
      { code: 'NS22', line: 'NSL', name: 'Orchard' },
      { code: 'TE14', line: 'TEL', name: 'Orchard' }
    ],
    services: ['7', '36', '106', '174', '502']
  },
  {
    BusStopCode: '09038',
    RoadName: 'Orchard Rd',
    Description: 'Orchard Plaza',
    Latitude: 1.3009,
    Longitude: 103.8398,
    mrtConnections: [
      { code: 'NS23', line: 'NSL', name: 'Somerset' }
    ],
    services: ['7', '14', '65', '106', '143', '174', '190']
  },
  {
    BusStopCode: '08138',
    RoadName: 'Penang Rd',
    Description: 'Dhoby Ghaut Stn Exit B',
    Latitude: 1.2995,
    Longitude: 103.8458,
    mrtConnections: [
      { code: 'NS24', line: 'NSL', name: 'Dhoby Ghaut' },
      { code: 'NE6', line: 'NEL', name: 'Dhoby Ghaut' },
      { code: 'CC1', line: 'CCL', name: 'Dhoby Ghaut' }
    ],
    services: ['7', '14', '36', '65', '106', '147', '166', '174', '190']
  },

  // Bugis / Bras Basah / City Hall
  {
    BusStopCode: '01012',
    RoadName: 'Victoria St',
    Description: 'Hotel Grand Pacific / Bras Basah',
    Latitude: 1.2974,
    Longitude: 103.8524,
    mrtConnections: [
      { code: 'CC2', line: 'CCL', name: 'Bras Basah' }
    ],
    services: ['7', '14', '36', '147', '166', '174', '190', '857']
  },
  {
    BusStopCode: '01119',
    RoadName: 'Victoria St',
    Description: 'Bugis Stn Exit A',
    Latitude: 1.3005,
    Longitude: 103.8560,
    mrtConnections: [
      { code: 'EW12', line: 'EWL', name: 'Bugis' },
      { code: 'DT14', line: 'DTL', name: 'Bugis' }
    ],
    services: ['7', '14', '65', '190', '851', '857', '960', '980']
  },
  {
    BusStopCode: '01112',
    RoadName: 'Victoria St',
    Description: 'Bugis Junction / Opp Bugis Stn',
    Latitude: 1.3000,
    Longitude: 103.8552,
    mrtConnections: [
      { code: 'EW12', line: 'EWL', name: 'Bugis' },
      { code: 'DT14', line: 'DTL', name: 'Bugis' }
    ],
    services: ['7', '14', '65', '190', '851', '857', '960']
  },
  {
    BusStopCode: '04111',
    RoadName: 'Stamford Rd',
    Description: 'City Hall Stn Exit B',
    Latitude: 1.2931,
    Longitude: 103.8521,
    mrtConnections: [
      { code: 'NS25', line: 'NSL', name: 'City Hall' },
      { code: 'EW13', line: 'EWL', name: 'City Hall' }
    ],
    services: ['14', '147', '166', '174', '190']
  },

  // Downtown / Clarke Quay / Chinatown
  {
    BusStopCode: '04168',
    RoadName: 'Eu Tong Sen St',
    Description: 'Clarke Quay Stn Exit E',
    Latitude: 1.2885,
    Longitude: 103.8465,
    mrtConnections: [
      { code: 'NE5', line: 'NEL', name: 'Clarke Quay' }
    ],
    services: ['2', '12', '33', '54', '147', '190']
  },
  {
    BusStopCode: '05019',
    RoadName: 'New Bridge Rd',
    Description: 'Chinatown Stn Exit E',
    Latitude: 1.2846,
    Longitude: 103.8441,
    mrtConnections: [
      { code: 'NE4', line: 'NEL', name: 'Chinatown' },
      { code: 'DT19', line: 'DTL', name: 'Chinatown' }
    ],
    services: ['2', '12', '33', '54', '143', '147', '190']
  },
  {
    BusStopCode: '05029',
    RoadName: 'Eu Tong Sen St',
    Description: 'People\'s Park Complex',
    Latitude: 1.2842,
    Longitude: 103.8430,
    mrtConnections: [
      { code: 'NE4', line: 'NEL', name: 'Chinatown' },
      { code: 'DT19', line: 'DTL', name: 'Chinatown' }
    ],
    services: ['2', '12', '33', '143', '147', '190']
  },

  // East / Geylang / Marine Parade (83139)
  {
    BusStopCode: '83139',
    RoadName: 'Marine Parade Rd',
    Description: 'Opp Parkway Parade / Marine Parade Stn',
    Latitude: 1.3015,
    Longitude: 103.9055,
    mrtConnections: [
      { code: 'TE26', line: 'TEL', name: 'Marine Parade' }
    ],
    services: ['15', '31', '36', '43', '48', '135', '196', '197']
  },

  // Marina Bay & Raffles Place
  {
    BusStopCode: '03019',
    RoadName: 'Collyer Quay',
    Description: 'Ocean Financial Ctr / Raffles Pl Stn',
    Latitude: 1.2835,
    Longitude: 103.8522,
    mrtConnections: [
      { code: 'NS26', line: 'NSL', name: 'Raffles Place' },
      { code: 'EW14', line: 'EWL', name: 'Raffles Place' }
    ],
    services: ['10', '70', '100', '106', '196', '502']
  },
  {
    BusStopCode: '03509',
    RoadName: 'Bayfront Ave',
    Description: 'Marina Bay Sands Theatre',
    Latitude: 1.2838,
    Longitude: 103.8590,
    mrtConnections: [
      { code: 'CE1', line: 'CCL', name: 'Bayfront' },
      { code: 'DT16', line: 'DTL', name: 'Bayfront' }
    ],
    services: ['97', '106', '133', '502']
  },

  // HarbourFront & South
  {
    BusStopCode: '14119',
    RoadName: 'Telok Blangah Rd',
    Description: 'HarbourFront Stn/VivoCity',
    Latitude: 1.2655,
    Longitude: 103.8219,
    mrtConnections: [
      { code: 'NE1', line: 'NEL', name: 'HarbourFront' },
      { code: 'CC29', line: 'CCL', name: 'HarbourFront' }
    ],
    services: ['10', '30', '65', '100', '143', '166']
  },

  // Jurong East & West Region
  {
    BusStopCode: '28009',
    RoadName: 'Jurong Gateway Rd',
    Description: 'Jurong East Int / Westgate',
    Latitude: 1.3332,
    Longitude: 103.7423,
    mrtConnections: [
      { code: 'NS1', line: 'NSL', name: 'Jurong East' },
      { code: 'EW24', line: 'EWL', name: 'Jurong East' }
    ],
    services: ['51', '66', '78', '105', '143', '160', '197', '502']
  },
  {
    BusStopCode: '17179',
    RoadName: 'Clementi Ave 3',
    Description: 'Clementi Int / Clementi Mall',
    Latitude: 1.3150,
    Longitude: 103.7650,
    mrtConnections: [
      { code: 'EW23', line: 'EWL', name: 'Clementi' }
    ],
    services: ['14', '52', '105', '106', '147', '166', '175']
  },
  {
    BusStopCode: '11189',
    RoadName: 'Commonwealth Ave',
    Description: 'Queenstown Stn Exit B',
    Latitude: 1.2948,
    Longitude: 103.8061,
    mrtConnections: [
      { code: 'EW19', line: 'EWL', name: 'Queenstown' }
    ],
    services: ['51', '145', '186', '195']
  },

  // East Region (Tampines, Bedok, Changi)
  {
    BusStopCode: '75009',
    RoadName: 'Tampines Ave 4',
    Description: 'Tampines Int / Tampines Mall',
    Latitude: 1.3533,
    Longitude: 103.9452,
    mrtConnections: [
      { code: 'EW2', line: 'EWL', name: 'Tampines' },
      { code: 'DT32', line: 'DTL', name: 'Tampines' }
    ],
    services: ['10', '19', '23', '28', '29', '38', '65']
  },
  {
    BusStopCode: '84009',
    RoadName: 'Bedok North Ave 1',
    Description: 'Bedok Int / Bedok Mall',
    Latitude: 1.3242,
    Longitude: 103.9300,
    mrtConnections: [
      { code: 'EW5', line: 'EWL', name: 'Bedok' }
    ],
    services: ['7', '14', '16', '18', '24', '30', '35', '66']
  },
  {
    BusStopCode: '95129',
    RoadName: 'PTB2 Basement',
    Description: 'Changi Airport PTB2',
    Latitude: 1.3553,
    Longitude: 103.9892,
    mrtConnections: [
      { code: 'CG2', line: 'EWL', name: 'Changi Airport' }
    ],
    services: ['24', '27', '34', '36', '53', '110', '858']
  },

  // North & North-East (Bishan, Ang Mo Kio, Woodlands, Punggol)
  {
    BusStopCode: '54009',
    RoadName: 'Ang Mo Kio Ave 8',
    Description: 'Ang Mo Kio Int / AMK Hub',
    Latitude: 1.3698,
    Longitude: 103.8497,
    mrtConnections: [
      { code: 'NS16', line: 'NSL', name: 'Ang Mo Kio' }
    ],
    services: ['25', '73', '74', '76', '86', '130', '133', '138', '166']
  },
  {
    BusStopCode: '53009',
    RoadName: 'Bishan St 13',
    Description: 'Bishan Int / Junction 8',
    Latitude: 1.3508,
    Longitude: 103.8485,
    mrtConnections: [
      { code: 'NS17', line: 'NSL', name: 'Bishan' },
      { code: 'CC15', line: 'CCL', name: 'Bishan' }
    ],
    services: ['52', '53', '54', '55', '56', '58', '59', '410']
  },
  {
    BusStopCode: '46009',
    RoadName: 'Woodlands Sq',
    Description: 'Woodlands Integrated Transport Hub',
    Latitude: 1.4368,
    Longitude: 103.7865,
    mrtConnections: [
      { code: 'NS9', line: 'NSL', name: 'Woodlands' },
      { code: 'TE2', line: 'TEL', name: 'Woodlands' }
    ],
    services: ['161', '168', '178', '187', '900', '901', '903', '960']
  },
  {
    BusStopCode: '65009',
    RoadName: 'Punggol Place',
    Description: 'Punggol Temp Int / Waterway Point',
    Latitude: 1.4042,
    Longitude: 103.9022,
    mrtConnections: [
      { code: 'NE17', line: 'NEL', name: 'Punggol' }
    ],
    services: ['3', '34', '43', '62', '82', '83', '84', '85']
  }
];

export const POPULAR_BUS_SERVICES: Record<string, BusServiceDetail> = {
  '190': {
    serviceNo: '190',
    operator: 'SMRT',
    origin: 'Choa Chu Kang Int',
    destination: 'Kampong Bahru Ter',
    firstBus: '05:30',
    lastBus: '23:30',
    frequencyRange: '4 - 8 mins',
    stopsCount: 38,
    routeStops: [
      { stopCode: '44009', description: 'Choa Chu Kang Int', roadName: 'Choa Chu Kang Loop', lat: 1.3854, lng: 103.7443, sequence: 1, distanceKm: 0 },
      { stopCode: '43009', description: 'Bukit Panjang Plaza', roadName: 'Jeletong Rd', lat: 1.3800, lng: 103.7630, sequence: 5, distanceKm: 4.2 },
      { stopCode: '09048', description: 'Orchard Stn/ION Orchard', roadName: 'Orchard Turn', lat: 1.3040, lng: 103.8318, sequence: 16, distanceKm: 14.8 },
      { stopCode: '09038', description: 'Orchard Plaza', roadName: 'Orchard Rd', lat: 1.3009, lng: 103.8398, sequence: 18, distanceKm: 15.6 },
      { stopCode: '08138', description: 'Dhoby Ghaut Stn Exit B', roadName: 'Penang Rd', lat: 1.2995, lng: 103.8458, sequence: 21, distanceKm: 16.5 },
      { stopCode: '01012', description: 'Hotel Grand Pacific', roadName: 'Victoria St', lat: 1.2974, lng: 103.8524, sequence: 24, distanceKm: 17.4 },
      { stopCode: '01112', description: 'Bugis Junction', roadName: 'Victoria St', lat: 1.3000, lng: 103.8552, sequence: 26, distanceKm: 18.1 },
      { stopCode: '04111', description: 'City Hall Stn Exit B', roadName: 'Stamford Rd', lat: 1.2931, lng: 103.8521, sequence: 29, distanceKm: 19.3 },
      { stopCode: '04168', description: 'Clarke Quay Stn Exit E', roadName: 'Eu Tong Sen St', lat: 1.2885, lng: 103.8465, sequence: 31, distanceKm: 20.2 },
      { stopCode: '05019', description: 'Chinatown Stn Exit E', roadName: 'New Bridge Rd', lat: 1.2846, lng: 103.8441, sequence: 33, distanceKm: 21.0 },
      { stopCode: '10049', description: 'Kampong Bahru Ter', roadName: 'Spooner Rd', lat: 1.2750, lng: 103.8360, sequence: 38, distanceKm: 23.5 }
    ]
  },
  '65': {
    serviceNo: '65',
    operator: 'SBST',
    origin: 'Tampines Int',
    destination: 'HarbourFront Int',
    firstBus: '05:30',
    lastBus: '23:45',
    frequencyRange: '6 - 11 mins',
    stopsCount: 46,
    routeStops: [
      { stopCode: '75009', description: 'Tampines Int', roadName: 'Tampines Ave 4', lat: 1.3533, lng: 103.9452, sequence: 1, distanceKm: 0 },
      { stopCode: '72019', description: 'Bedok Reservoir Stn', roadName: 'Bedok Reservoir Rd', lat: 1.3360, lng: 103.9310, sequence: 7, distanceKm: 3.8 },
      { stopCode: '61009', description: 'MacPherson Stn', roadName: 'Paya Lebar Rd', lat: 1.3260, lng: 103.8890, sequence: 17, distanceKm: 8.5 },
      { stopCode: '01119', description: 'Bugis Stn Exit A', roadName: 'Victoria St', lat: 1.3005, lng: 103.8560, sequence: 25, distanceKm: 13.2 },
      { stopCode: '08138', description: 'Dhoby Ghaut Stn Exit B', roadName: 'Penang Rd', lat: 1.2995, lng: 103.8458, sequence: 28, distanceKm: 14.5 },
      { stopCode: '09038', description: 'Orchard Plaza', roadName: 'Orchard Rd', lat: 1.3009, lng: 103.8398, sequence: 31, distanceKm: 15.3 },
      { stopCode: '09048', description: 'Orchard Stn/ION Orchard', roadName: 'Orchard Turn', lat: 1.3040, lng: 103.8318, sequence: 33, distanceKm: 16.1 },
      { stopCode: '10169', description: 'Opp Vivocity / HarbourFront', roadName: 'Telok Blangah Rd', lat: 1.2655, lng: 103.8219, sequence: 46, distanceKm: 24.2 }
    ]
  },
  '14': {
    serviceNo: '14',
    operator: 'SBST',
    origin: 'Bedok Int',
    destination: 'Clementi Int',
    firstBus: '05:30',
    lastBus: '23:30',
    frequencyRange: '7 - 12 mins',
    stopsCount: 52,
    routeStops: [
      { stopCode: '84009', description: 'Bedok Int', roadName: 'Bedok North Ave 1', lat: 1.3242, lng: 103.9300, sequence: 1, distanceKm: 0 },
      { stopCode: '01012', description: 'Hotel Grand Pacific', roadName: 'Victoria St', lat: 1.2974, lng: 103.8524, sequence: 22, distanceKm: 12.0 },
      { stopCode: '04111', description: 'City Hall Stn Exit B', roadName: 'Stamford Rd', lat: 1.2931, lng: 103.8521, sequence: 24, distanceKm: 12.9 },
      { stopCode: '08138', description: 'Dhoby Ghaut Stn Exit B', roadName: 'Penang Rd', lat: 1.2995, lng: 103.8458, sequence: 26, distanceKm: 13.8 },
      { stopCode: '09048', description: 'Orchard Stn/ION Orchard', roadName: 'Orchard Turn', lat: 1.3040, lng: 103.8318, sequence: 29, distanceKm: 15.1 },
      { stopCode: '17179', description: 'Clementi Int / Clementi Mall', roadName: 'Clementi Ave 3', lat: 1.3150, lng: 103.7650, sequence: 52, distanceKm: 26.8 }
    ]
  },
  '36': {
    serviceNo: '36',
    operator: 'GAS',
    origin: 'Changi Airport PTB2',
    destination: 'Tomlinson Rd (Loop)',
    loopStop: 'Orchard Rd',
    firstBus: '05:40',
    lastBus: '23:58',
    frequencyRange: '8 - 12 mins',
    stopsCount: 42,
    routeStops: [
      { stopCode: '95129', description: 'Changi Airport PTB2', roadName: 'PTB2 Basement', lat: 1.3553, lng: 103.9892, sequence: 1, distanceKm: 0 },
      { stopCode: '01012', description: 'Hotel Grand Pacific', roadName: 'Victoria St', lat: 1.2974, lng: 103.8524, sequence: 19, distanceKm: 18.5 },
      { stopCode: '08138', description: 'Dhoby Ghaut Stn Exit B', roadName: 'Penang Rd', lat: 1.2995, lng: 103.8458, sequence: 22, distanceKm: 19.8 },
      { stopCode: '09048', description: 'Orchard Stn/ION Orchard', roadName: 'Orchard Turn', lat: 1.3040, lng: 103.8318, sequence: 26, distanceKm: 21.4 }
    ]
  },
  '143': {
    serviceNo: '143',
    operator: 'TTS',
    origin: 'Toa Payoh Int',
    destination: 'Jurong East Int',
    firstBus: '05:30',
    lastBus: '23:35',
    frequencyRange: '6 - 10 mins',
    stopsCount: 50,
    routeStops: [
      { stopCode: '52009', description: 'Toa Payoh Int', roadName: 'Lor 2 Toa Payoh', lat: 1.3320, lng: 103.8480, sequence: 1, distanceKm: 0 },
      { stopCode: '09048', description: 'Orchard Stn/ION Orchard', roadName: 'Orchard Turn', lat: 1.3040, lng: 103.8318, sequence: 18, distanceKm: 7.2 },
      { stopCode: '05019', description: 'Chinatown Stn Exit E', roadName: 'New Bridge Rd', lat: 1.2846, lng: 103.8441, sequence: 25, distanceKm: 10.4 },
      { stopCode: '14119', description: 'HarbourFront Stn/VivoCity', roadName: 'Telok Blangah Rd', lat: 1.2655, lng: 103.8219, sequence: 31, distanceKm: 13.8 },
      { stopCode: '28009', description: 'Jurong East Int / Westgate', roadName: 'Jurong Gateway Rd', lat: 1.3332, lng: 103.7423, sequence: 50, distanceKm: 27.5 }
    ]
  },
  '106': {
    serviceNo: '106',
    operator: 'TTS',
    origin: 'Shenton Way Ter',
    destination: 'Bukit Batok Int',
    firstBus: '05:45',
    lastBus: '23:50',
    frequencyRange: '7 - 11 mins',
    stopsCount: 39,
    routeStops: [
      { stopCode: '03019', description: 'Ocean Financial Ctr', roadName: 'Collyer Quay', lat: 1.2835, lng: 103.8522, sequence: 1, distanceKm: 0 },
      { stopCode: '03509', description: 'Marina Bay Sands Theatre', roadName: 'Bayfront Ave', lat: 1.2838, lng: 103.8590, sequence: 4, distanceKm: 1.6 },
      { stopCode: '08138', description: 'Dhoby Ghaut Stn Exit B', roadName: 'Penang Rd', lat: 1.2995, lng: 103.8458, sequence: 10, distanceKm: 4.8 },
      { stopCode: '09048', description: 'Orchard Stn/ION Orchard', roadName: 'Orchard Turn', lat: 1.3040, lng: 103.8318, sequence: 14, distanceKm: 6.3 },
      { stopCode: '17179', description: 'Clementi Int', roadName: 'Clementi Ave 3', lat: 1.3150, lng: 103.7650, sequence: 28, distanceKm: 16.5 }
    ]
  }
};
