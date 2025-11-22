import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { comparePassword, generateToken } from '@/lib/auth/utils';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      );
    }

    // Find user
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
        contributor: {
          select: {
            verification_status: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is a contributor and not yet verified
    if (user.role === 'contributor' && user.contributor) {
      if (user.contributor.verification_status === 'pending') {
        return NextResponse.json(
          { 
            error: 'Akun Anda sebagai kontributor masih dalam proses verifikasi. Harap tunggu konfirmasi dari admin.' 
          },
          { status: 403 }
        );
      }
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' + error },
      { status: 500 }
    );
  }
}
