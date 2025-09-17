import { NextRequest } from 'next/server';
import { verifyToken } from './auth';

export function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  const user = verifyToken(token);
  
  return user !== null;
}