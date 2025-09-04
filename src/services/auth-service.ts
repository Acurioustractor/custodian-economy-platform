// Authentication Service - Handles staff login and session management
// Provides role-based access control for public vs staff areas
// Integrates with Supabase Auth with demo credential fallback

import { createClient } from '@supabase/supabase-js';
import { databaseService } from './database-service';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'staff' | 'admin';
  permissions: string[];
  name: string;
  lastLogin: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'custodian_auth_token';
  private readonly USER_KEY = 'custodian_user_data';
  private supabase: any = null;
  private useSupabase = false;
  
  constructor() {
    this.initializeAuth();
  }
  
  private initializeAuth() {
    // Initialize Supabase Auth if environment variables are available
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.useSupabase = true;
        console.log('Auth: Using Supabase for authentication');
      } catch (error) {
        console.warn('Auth: Failed to initialize Supabase, using demo credentials', error);
        this.useSupabase = false;
      }
    } else {
      console.log('Auth: Using demo credentials (development mode)');
      this.useSupabase = false;
    }
  }
  
  // Demo staff credentials - in production, this would connect to a real backend
  private readonly DEMO_STAFF = [
    {
      id: 'staff_001',
      username: 'staff',
      email: 'staff@custodianeconomy.org',
      password: 'custodian2024', // In production: hashed passwords
      role: 'staff' as const,
      permissions: ['content_management', 'brand_testing', 'analytics'],
      name: 'Staff Member',
      lastLogin: new Date()
    },
    {
      id: 'admin_001',
      username: 'admin',
      email: 'admin@custodianeconomy.org',
      password: 'admin2024', // In production: hashed passwords
      role: 'admin' as const,
      permissions: ['content_management', 'brand_testing', 'analytics', 'brand_management', 'user_management'],
      name: 'System Administrator',
      lastLogin: new Date()
    }
  ];

  // Login with username and password
  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      // Try Supabase authentication first
      if (this.useSupabase && this.supabase) {
        const result = await this.loginWithSupabase(credentials);
        if (result.success) {
          return result;
        }
        // If Supabase fails, fall back to demo credentials
        console.log('Auth: Supabase login failed, trying demo credentials');
      }
      
      // Demo credential fallback
      return await this.loginWithDemo(credentials);
      
    } catch (error) {
      return {
        success: false,
        error: 'Login failed. Please try again.'
      };
    }
  }
  
  // Supabase authentication
  private async loginWithSupabase(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.username.includes('@') ? credentials.username : `${credentials.username}@custodianeconomy.org`,
        password: credentials.password
      });
      
      if (error) {
        return {
          success: false,
          error: error.message
        };
      }
      
      if (data.user) {
        // Get or create user profile
        const userProfile = await this.getOrCreateUserProfile(data.user);
        if (userProfile) {
          // Store in localStorage for compatibility
          localStorage.setItem(this.TOKEN_KEY, data.session?.access_token || '');
          localStorage.setItem(this.USER_KEY, JSON.stringify(userProfile));
          
          return {
            success: true,
            user: userProfile,
            token: data.session?.access_token
          };
        }
      }
      
      return {
        success: false,
        error: 'Failed to create user profile'
      };
      
    } catch (error) {
      console.error('Supabase login error:', error);
      return {
        success: false,
        error: 'Authentication service error'
      };
    }
  }
  
  // Demo credential authentication (fallback)
  private async loginWithDemo(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in demo data
    const user = this.DEMO_STAFF.find(u => 
      u.username === credentials.username && u.password === credentials.password
    );
    
    if (!user) {
      return {
        success: false,
        error: 'Invalid username or password'
      };
    }
    
    // Generate simple token (in production: use JWT or similar)
    const token = `demo_token_${user.id}_${Date.now()}`;
    
    // Create user object without password
    const authenticatedUser: User = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      name: user.name,
      lastLogin: new Date()
    };
    
    // Store in localStorage
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authenticatedUser));
    
    // Also save to database service
    await databaseService.saveUser({
      ...authenticatedUser,
      createdAt: new Date()
    });
    
    return {
      success: true,
      user: authenticatedUser,
      token
    };
  }

  // Logout user
  async logout(): Promise<void> {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Get current authentication state
  getAuthState(): AuthState {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userStr = localStorage.getItem(this.USER_KEY);
    
    if (!token || !userStr) {
      return {
        isAuthenticated: false,
        user: null,
        token: null
      };
    }
    
    try {
      const user = JSON.parse(userStr) as User;
      return {
        isAuthenticated: true,
        user,
        token
      };
    } catch (error) {
      // Clear invalid data
      this.logout();
      return {
        isAuthenticated: false,
        user: null,
        token: null
      };
    }
  }

  // Check if user has specific permission
  hasPermission(permission: string): boolean {
    const { user } = this.getAuthState();
    return user?.permissions.includes(permission) || false;
  }

  // Check if user has any of the specified roles
  hasRole(roles: string[]): boolean {
    const { user } = this.getAuthState();
    return user ? roles.includes(user.role) : false;
  }

  // Check if user is staff or admin
  isStaff(): boolean {
    return this.hasRole(['staff', 'admin']);
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.hasRole(['admin']);
  }

  // Validate token (simulate backend validation)
  async validateToken(token: string): Promise<boolean> {
    // In production, this would validate with the backend
    const storedToken = localStorage.getItem(this.TOKEN_KEY);
    return token === storedToken;
  }

  // Refresh token (simulate token refresh)
  async refreshToken(): Promise<string | null> {
    const { user, token } = this.getAuthState();
    
    if (!user || !token) {
      return null;
    }
    
    // In production, this would call the backend to refresh the token
    const newToken = `token_${user.id}_${Date.now()}`;
    localStorage.setItem(this.TOKEN_KEY, newToken);
    
    return newToken;
  }

  // Get demo credentials for development
  getDemoCredentials(): { staff: LoginCredentials; admin: LoginCredentials } {
    return {
      staff: {
        username: 'staff',
        password: 'custodian2024'
      },
      admin: {
        username: 'admin',
        password: 'admin2024'
      }
    };
  }
}

export const authService = new AuthService();