import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth/utils';

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password, reason, culturalInterest } = await request.json();

    // Validation
    if (!fullName || !email || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: {
        contributor: true
      }
    });

    let user;
    let contributor;

    if (existingUser) {
      // User exists - password not required
      // User exists, check if they already have contributor application
      if (existingUser.contributor) {
        if (existingUser.contributor.verification_status === 'pending') {
          return NextResponse.json(
            { error: 'You already have a pending contributor application' },
            { status: 400 }
          );
        } else if (existingUser.contributor.verification_status === 'approved') {
          return NextResponse.json(
            { error: 'You are already a contributor' },
            { status: 400 }
          );
        }
      }

      // If user role is already contributor, don't allow
      if (existingUser.role === 'contributor') {
        return NextResponse.json(
          { error: 'You are already a contributor' },
          { status: 400 }
        );
      }

      // Create or update contributor application for existing user
      // Keep role as 'user' until verified by admin
      const result = await prisma.$transaction(async (tx) => {
        const contributorRecord = await tx.contributor.upsert({
          where: { user_id: existingUser.id },
          update: {
            reason,
            cultural_interest: culturalInterest || null,
            verification_status: 'pending',
            rejection_reason: null,
            verified_by: null,
            verified_at: null
          },
          create: {
            user_id: existingUser.id,
            reason,
            cultural_interest: culturalInterest || null,
            verification_status: 'pending'
          }
        });

        return { user: existingUser, contributor: contributorRecord };
      });

      user = result.user;
      contributor = result.contributor;

      // Generate token with current role (user)
      const token = generateToken(user.id, user.role);

      return NextResponse.json(
        {
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role
          },
          token,
          message: 'Contributor application submitted successfully! Please wait for admin approval.'
        },
        { status: 200 }
      );

    } else {
      // New user - password is required
      if (!password) {
        return NextResponse.json(
          { error: 'Password is required for new users' },
          { status: 400 }
        );
      }

      if (password.length < 8) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters' },
          { status: 400 }
        );
      }

      // New user - create user with 'user' role, contributor status pending
      const hashedPassword = await hashPassword(password);

      // Create user, profile, and contributor application in a transaction
      const result = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email,
            full_name: fullName,
            password: hashedPassword,
            role: 'user' // Keep as 'user' until verified
          }
        });

        await tx.profile.create({
          data: {
            user_id: newUser.id,
            bio: null,
            avatar: null,
            provinces_visited: 0,
            badges_earned: 0,
          }
        });

        const newContributor = await tx.contributor.create({
          data: {
            user_id: newUser.id,
            reason,
            cultural_interest: culturalInterest || null,
            verification_status: 'pending'
          }
        });

        return { user: newUser, contributor: newContributor };
      });

      user = result.user;
      contributor = result.contributor;

      // Generate token with 'user' role (will become 'contributor' after verification)
      const token = generateToken(user.id, user.role);

      return NextResponse.json(
        {
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role
          },
          token,
          message: 'Registration successful! Your contributor application is pending approval.'
        },
        { status: 201 }
      );
    }

  } catch (error) {
    console.error('Bergabung error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
