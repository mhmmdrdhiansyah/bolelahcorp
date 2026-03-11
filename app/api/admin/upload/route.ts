import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir, unlink, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// ============================================================================
// Configuration
// ============================================================================

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'portfolios');
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

// ============================================================================
// Auth Check
// ============================================================================

async function checkAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  if (session.user?.role !== 'ADMIN') {
    return NextResponse.json(
      { success: false, message: 'Admin access required' },
      { status: 401 }
    );
  }

  return null;
}

// ============================================================================
// POST - Upload Image
// ============================================================================

export async function POST(request: NextRequest) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FORMATS.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid file format. Allowed: ${ALLOWED_FORMATS.map(f => f.split('/')[1]).join(', ')}`
        },
        { status: 400 }
      );
    }

    // Validate file size (1MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: `File size exceeds 1MB. Your file: ${(file.size / 1024 / 1024).toFixed(2)}MB`
        },
        { status: 400 }
      );
    }

    // Create upload directory if not exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(file.name);
    const filename = `${timestamp}-${randomStr}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Convert file to buffer and write to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return the URL path
    const url = `/uploads/portfolios/${filename}`;

    return NextResponse.json({
      success: true,
      data: {
        url,
        filename,
        size: file.size,
        type: file.type,
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE - Remove Uploaded Image
// ============================================================================

export async function DELETE(request: NextRequest) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { success: false, message: 'URL is required' },
        { status: 400 }
      );
    }

    // Security: Only allow deleting from uploads directory
    if (!url.startsWith('/uploads/portfolios/')) {
      return NextResponse.json(
        { success: false, message: 'Invalid file path' },
        { status: 403 }
      );
    }

    const filepath = path.join(process.cwd(), 'public', url);

    // Check if file exists
    if (!existsSync(filepath)) {
      return NextResponse.json(
        { success: false, message: 'File not found' },
        { status: 404 }
      );
    }

    // Delete the file
    await unlink(filepath);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
