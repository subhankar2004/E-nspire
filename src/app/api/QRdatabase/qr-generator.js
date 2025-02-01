// qr-generator.js
import QRCode from 'qrcode';
import fs from 'fs/promises';

// Startup types
const startupTypes = [
  "Artificial Intelligence",
  "Blockchain",
  "Clean Energy",
  "Digital Health",
  "E-commerce",
  "FinTech",
  "Green Technology",
  "IoT",
  "Machine Learning",
  "Quantum Computing",
  "Robotics",
  "SaaS",
  "Space Technology",
  "Virtual Reality",
  "Web3"
];

// Company name parts
const prefixes = ["Tech", "AI", "Cyber", "Data", "Eco", "Future", "Quantum", "Smart", "Solar", "Space"];
const suffixes = ["Labs", "Tech", "Systems", "Solutions", "Innovations", "Dynamics", "Networks", "Ventures", "Wave", "Core"];

// Generate a random company name
function generateStartupName() {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${prefix}${suffix}`;
}

// Generate a random description
function generateDescription(type) {
  const descriptions = [
    `Leading innovation in ${type}`,
    `Revolutionary solutions for ${type}`,
    `Transforming the future of ${type}`,
    `Next-generation ${type} platform`,
    `Pioneering advances in ${type}`
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

// Generate welcome messages
function generateMessage(startupName) {
  const messages = [
    `Welcome to ${startupName}! Your innovation journey begins here.`,
    `You've been matched with ${startupName}! Ready to revolutionize the industry?`,
    `Congratulations! ${startupName} is your startup match.`,
    `Get ready to innovate with ${startupName}!`,
    `Your startup adventure awaits at ${startupName}!`
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

async function generateQRCodes() {
  const database = {};
  const qrPromises = [];

  for (let i = 1; i <= 100; i++) {
    const id = i.toString().padStart(3, '0');
    const type = startupTypes[Math.floor(Math.random() * startupTypes.length)];
    const startupName = generateStartupName();
    
    const startupData = {
      id,
      startup: startupName,
      type,
      description: generateDescription(type),
      message: generateMessage(startupName)
    };

    database[id] = startupData;
    
    // Create QR code for the minimal data needed
    const qrData = JSON.stringify({ id });
    qrPromises.push(
      QRCode.toFile(
        `qr-codes/qr-${id}.png`,
        qrData,
        {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        }
      )
    );
  }

  // Save the database
  await fs.writeFile(
    'startup-database.js', 
    `export const startupDatabase = ${JSON.stringify(database, null, 2)};`
  );

  // Generate all QR codes
  await Promise.all(qrPromises);

  return database;
}

// Create directory if it doesn't exist
await fs.mkdir('qr-codes', { recursive: true });

// Generate QR codes and database
const database = await generateQRCodes();
console.log('Generated 100 QR codes and database entries');