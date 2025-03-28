import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log(`API GET lead ${id} request`);
    
    const response = await fetch(`${API_BASE_URL}/api/leads/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Error fetching lead ${id}:`, data);
      return NextResponse.json({ error: data.error || 'Failed to fetch lead' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to leads API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    console.log(`API PUT lead ${id} request with body:`, body);
    
    const response = await fetch(`${API_BASE_URL}/api/leads/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Handle non-OK responses with better error logging
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to update lead ${id}. Status: ${response.status}, Response:`, errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: errorText || 'Failed to update lead' };
      }
      
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to leads API:', error);
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log(`API DELETE lead ${id} request`);
    
    const response = await fetch(`${API_BASE_URL}/api/leads/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If there's a JSON body, extract the error
      let errorMessage = 'Failed to delete lead';
      try {
        const errorText = await response.text();
        console.error(`Failed to delete lead ${id}. Status: ${response.status}, Response:`, errorText);
        
        if (errorText) {
          try {
            const data = JSON.parse(errorText);
            errorMessage = data.error || errorMessage;
          } catch (e) {
            errorMessage = errorText || errorMessage;
          }
        }
      } catch (e) {
        // If no JSON body, just use the default error
      }
      
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    // Since DELETE might return 204 No Content, don't try to parse the body
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error proxying to leads API:', error);
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
} 