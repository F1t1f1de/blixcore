import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const DEMO_USER = {
  username: 'admin',
  password: 'demo123', // Plain text for demo - normally would be hashed
  passwordHash: '$2b$10$z3w9.TL7oTqorlZlRuacwe/0tTzPKPBHri8wrh3qztL85D8JcdCDu' // demo123
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (username !== DEMO_USER.username) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Try bcrypt first, fallback to plain text for demo
    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, DEMO_USER.passwordHash);
    } catch (error) {
      console.log('Bcrypt failed, trying plain text');
      isValidPassword = password === DEMO_USER.password;
    }
    
    // Also check plain text as fallback
    if (!isValidPassword) {
      isValidPassword = password === DEMO_USER.password;
    }
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { username: DEMO_USER.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json(
      { 
        message: 'Login successful',
        token,
        user: { username: DEMO_USER.username }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}