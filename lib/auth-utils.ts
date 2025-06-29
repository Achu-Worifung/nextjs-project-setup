import { tokenManager } from "./token-manager";

interface JWTPayload {
  userId: string;
  firstName?: string;
  lastName?: string;
  email: string;
  exp: number;
  iat: number;
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export function getCurrentUser(): { userId: string; isAuthenticated: boolean } {
  const token = tokenManager.get();
  
  if (!token) {
    return { userId: '', isAuthenticated: false };
  }

  const payload = decodeJWT(token);
  
  if (!payload || Date.now() >= payload.exp * 1000) {
    // Token is expired
    tokenManager.clear();
    return { userId: '', isAuthenticated: false };
  }

  return { userId: payload.userId, isAuthenticated: true };
}

export function isTokenValid(): boolean {
  const token = tokenManager.get();
  
  if (!token) return false;
  
  const payload = decodeJWT(token);
  return payload ? Date.now() < payload.exp * 1000 : false;
}
