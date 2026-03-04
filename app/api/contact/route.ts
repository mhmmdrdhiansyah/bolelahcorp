import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// ============================================================================
// Validation Schema
// ============================================================================

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// ============================================================================
// POST Handler - Contact Form Submission
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate with Zod
    const validated = contactSchema.parse({ name, email, subject, message });

    // Import prisma dynamically (works better with Next.js serverless)
    const { prisma } = await import('@/lib/prisma');

    // Save to database
    const submission = await prisma.contactSubmission.create({
      data: {
        name: validated.name,
        email: validated.email,
        subject: validated.subject || '',
        message: validated.message,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully! I\'ll get back to you soon.',
      id: submission.id,
    }, { status: 201 });

  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        errors: error.flatten().fieldErrors,
      }, { status: 400 });
    }

    // Handle other errors
    console.error('Contact submission error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to send message. Please try again.',
    }, { status: 500 });
  }
}

// ============================================================================
// OPTIONS Handler - CORS Preflight
// ============================================================================

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Allow': 'POST, OPTIONS',
    },
  });
}
