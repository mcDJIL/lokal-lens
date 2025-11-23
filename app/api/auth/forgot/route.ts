import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This endpoint expects a POST with JSON body: { email }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body?.email;

    // Validation
    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: {
          select: {
            avatar: true,
            bio: true,
            provinces_visited: true,
            badges_earned: true,
          },
        },
      },
    });

    if (!user) {
      // It's fine to return 404 here for a simple lookup, but for a password reset
      // production flow you may want to always return 200 to avoid user enumeration.
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    // Return minimal safe user info (never return password or sensitive fields)
    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          profile: user.profile,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password lookup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
