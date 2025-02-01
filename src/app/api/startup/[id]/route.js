// app/api/startups/[id]/route.js
import { NextResponse } from 'next/server';

const startupDatabase = {
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

export async function GET(request, { params }) {
  try {
    const id = params.id;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const startupData = startupDatabase[id];
    
    if (!startupData) {
      return NextResponse.json(
        { error: 'Startup not found' },
        { status: 404 }
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