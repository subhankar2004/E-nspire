import { NextResponse } from 'next/server';

const startupDatabase = {
  "12345": {
    id: "12345",
    message: "You have been assigned to Tech Innovators!",
    startup: "Tech Innovators",
    description: "A cutting-edge tech startup focused on AI and machine learning.",
    type: "Artificial Intelligence"
  },
  "001": {
    id: "001",
    message: "You've been assigned to an innovative AI startup!",
    startup: "ZypherTech",
    description: "Leading the future of AI automation",
    type: "Artificial Intelligence"
  },
  "002": {
    id: "002",
    message: "Welcome to the future of quantum computing!",
    startup: "QuantumLeap",
    description: "Revolutionary quantum computing solutions",
    type: "Quantum Technology"
  },
  "003": {
    id: "003",
    message: "Join the green technology revolution!",
    startup: "EcoSphere",
    description: "Sustainable technology for a better tomorrow",
    type: "Green Technology"
  }
};

export async function GET(request, context) {
  try {
    // Await params to properly access its properties
    const { id } = await context.params;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let startupData = startupDatabase[id];

    // If ID doesn't exist, return a dynamic response instead of 404
    if (!startupData) {
      return NextResponse.json(
        {
          id: id,
          message: "Startup ID not found in database, but you have a valid QR code.",
          startup: "Unknown Startup",
          description: "This startup is not pre-registered, but it's still valid.",
          type: "Unknown"
        },
        { status: 200 }
      );
    }

    return NextResponse.json(startupData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

