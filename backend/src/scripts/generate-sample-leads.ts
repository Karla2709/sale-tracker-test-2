import { supabase } from '../config/supabase';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

// Define possible values for various fields
const STATUSES = [
  'New', 
  'Reached Out', 
  'Meeting Scheduled', 
  'First Meeting Complete', 
  'Second Meeting Completed', 
  'In Dilligence', 
  'Close Deal', 
  'Prospect Decline'
];

const DOMAINS = [
  'Container Shipping',
  'Ecommerce',
  'Healthcare',
  'Others'
];

const CONTACT_PLATFORMS = [
  'Email',
  'LinkedIn',
  'Phone',
  'Referral',
  'Conference',
  'Website'
];

const LOCATIONS = [
  'New York, USA',
  'London, UK',
  'Tokyo, Japan',
  'Berlin, Germany',
  'Sydney, Australia',
  'Toronto, Canada',
  'Singapore',
  'Hong Kong',
  'Paris, France',
  'Mumbai, India'
];

const FIRST_NAMES = [
  'John', 'Emma', 'Michael', 'Olivia', 'William', 'Sophia', 'James', 'Ava', 
  'Robert', 'Isabella', 'David', 'Mia', 'Joseph', 'Charlotte', 'Thomas', 'Amelia',
  'Daniel', 'Harper', 'Matthew', 'Evelyn', 'Andrew', 'Abigail', 'Richard', 'Emily',
  'Charles', 'Elizabeth', 'Paul', 'Sofia', 'Mark', 'Ella', 'Donald', 'Grace',
  'Steven', 'Chloe', 'Edward', 'Victoria', 'Brian', 'Madison', 'Ronald', 'Scarlett'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'
];

const COMPANY_SUFFIXES = [
  'Inc', 'LLC', 'Corp', 'Company', 'Ltd', 'Group', 'Holdings', 'Partners',
  'Solutions', 'Technologies', 'Systems', 'Enterprises', 'International', 'Global'
];

// Helper functions to generate random data
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomDate = (startDays: number, endDays: number): string => {
  const daysToAdd = Math.floor(Math.random() * (endDays - startDays)) + startDays;
  return dayjs().subtract(daysToAdd, 'day').format('YYYY-MM-DD');
};

const getRandomName = (): string => {
  return `${getRandomItem(FIRST_NAMES)} ${getRandomItem(LAST_NAMES)}`;
};

const getRandomCompanyName = (): string => {
  const adjectives = ['Advanced', 'Premier', 'Global', 'Innovative', 'Strategic', 'Dynamic', 'Reliable', 'Elite', 'Prime', 'United'];
  const nouns = ['Tech', 'Systems', 'Logistics', 'Media', 'Health', 'Solutions', 'Services', 'Data', 'Net', 'Care'];
  
  return `${getRandomItem(adjectives)} ${getRandomItem(nouns)} ${getRandomItem(COMPANY_SUFFIXES)}`;
};

const getRandomEmail = (name: string, domain: string): string => {
  const namePart = name.toLowerCase().replace(/\s+/g, '.');
  const domainParts = domain.toLowerCase().split(' ');
  const domainPrefix = domainParts.length > 1 ? domainParts[0].charAt(0) + domainParts[1].charAt(0) : domainParts[0].slice(0, 2);
  const randomNum = Math.floor(Math.random() * 1000);
  
  const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'company.com', 'enterprise.net', 'business.org'];
  
  if (Math.random() > 0.5) {
    // Company email
    return `${namePart}@${domainPrefix}${randomNum}.com`;
  } else {
    // Personal email
    return `${namePart}${randomNum}@${getRandomItem(domains)}`;
  }
};

const getRandomPhone = (): string => {
  const formats = [
    '+1 (###) ###-####',
    '+44 ## #### ####',
    '+61 ### ### ###',
    '+81 ## #### ####',
    '+49 ### #######',
    '+33 # ## ## ## ##'
  ];
  
  let format = getRandomItem(formats);
  return format.replace(/#/g, () => Math.floor(Math.random() * 10).toString());
};

const getRandomNote = (name: string, status: string): string => {
  const introNotes = [
    `Initial contact with ${name} was promising.`,
    `${name} expressed interest in our services.`,
    `First call with ${name} went well, need follow-up.`,
    `${name} referred by existing client.`,
    `Met ${name} at industry conference.`
  ];
  
  const statusNotes = {
    'New': [
      'Need to schedule first contact.',
      'Research company background before reaching out.',
      'Check LinkedIn profile for mutual connections.'
    ],
    'Reached Out': [
      'Sent initial email, waiting for response.',
      'Left voicemail, will follow up in 2 days.',
      'Connected on LinkedIn, sent message.'
    ],
    'Meeting Scheduled': [
      'Virtual meeting set for next week.',
      'Preparing proposal for initial meeting.',
      'Sending agenda and materials ahead of meeting.'
    ],
    'First Meeting Complete': [
      'Positive reception to our proposal.',
      'Needs to discuss with team before moving forward.',
      'Requested additional information about pricing.'
    ],
    'Second Meeting Completed': [
      'Detailed discussion of implementation timeline.',
      'Addressing technical concerns from their IT team.',
      'Budget discussion went well, pending final approval.'
    ],
    'In Dilligence': [
      'Legal team reviewing contract terms.',
      'Finalizing implementation timeline.',
      'Working through security requirements.'
    ],
    'Close Deal': [
      'Contract sent for final signature.',
      'Discussing extended partnership opportunities.',
      'Planning kickoff meeting for next month.'
    ],
    'Prospect Decline': [
      'Budget constraints led to postponement.',
      'Selected competitor due to existing relationship.',
      'Project put on hold until next fiscal year.'
    ]
  };
  
  const intro = getRandomItem(introNotes);
  const detail = getRandomItem(statusNotes[status as keyof typeof statusNotes]);
  
  // Add some random follow-up notes
  const followUps = [
    'Need to follow up next quarter.',
    'Should introduce to product team.',
    'Connect with marketing for materials.',
    'Check if they\'re attending upcoming conference.',
    'Suggest case study collaboration if deal closes.'
  ];
  
  if (Math.random() > 0.5) {
    return `${intro} ${detail}`;
  } else {
    return `${intro} ${detail} ${getRandomItem(followUps)}`;
  }
};

// Generate a sample lead
const generateSampleLead = () => {
  const name = getRandomName();
  const clientDomain = getRandomItem(DOMAINS);
  const status = getRandomItem(STATUSES);
  
  return {
    id: uuidv4(),
    name,
    email: getRandomEmail(name, clientDomain),
    phone: getRandomPhone(),
    status,
    client_domain: clientDomain,
    contact_platform: getRandomItem(CONTACT_PLATFORMS),
    location: getRandomItem(LOCATIONS),
    created_at: getRandomDate(1, 180),
    last_contact_date: getRandomDate(0, 30),
    note: getRandomNote(name, status)
  };
};

// Generate and insert sample leads
const generateSampleLeads = async (count: number) => {
  try {
    console.log(`Generating ${count} sample leads...`);
    
    const sampleLeads = Array.from({ length: count }, generateSampleLead);
    
    const { data, error } = await supabase
      .from('leads')
      .insert(sampleLeads)
      .select();
    
    if (error) {
      throw error;
    }
    
    console.log(`Successfully inserted ${data.length} sample leads.`);
    return data;
  } catch (error) {
    console.error('Error generating sample leads:', error);
    throw error;
  }
};

// Execute the function with a command line argument for count
const run = async () => {
  try {
    // Default to 40 if not specified
    const count = process.argv[2] ? parseInt(process.argv[2]) : 40;
    await generateSampleLeads(count);
    console.log('Sample data generation complete!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to generate sample data:', error);
    process.exit(1);
  }
};

// Run the script
run(); 