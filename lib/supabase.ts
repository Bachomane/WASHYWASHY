import { createClient } from '@supabase/supabase-js';

// These will be replaced with your actual Supabase credentials
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          address: string;
          profile_image?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          address: string;
          profile_image?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          address?: string;
          profile_image?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      vehicles: {
        Row: {
          id: string;
          user_id: string;
          make: string;
          model: string;
          year: string;
          plate: string;
          color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          make: string;
          model: string;
          year: string;
          plate: string;
          color: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          make?: string;
          model?: string;
          year?: string;
          plate?: string;
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          vehicle_id?: string;
          date: string;
          time: string;
          status: 'upcoming' | 'completed' | 'in-progress' | 'cancelled';
          service: string;
          washer: string;
          rating?: number;
          has_interior_wash: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          vehicle_id?: string;
          date: string;
          time: string;
          status?: 'upcoming' | 'completed' | 'in-progress' | 'cancelled';
          service: string;
          washer: string;
          rating?: number;
          has_interior_wash?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          vehicle_id?: string;
          date?: string;
          time?: string;
          status?: 'upcoming' | 'completed' | 'in-progress' | 'cancelled';
          service?: string;
          washer?: string;
          rating?: number;
          has_interior_wash?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          plan_name: string;
          price: number;
          cars: number;
          status: 'active' | 'inactive' | 'cancelled';
          start_date: string;
          end_date: string;
          add_ons: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          plan_name: string;
          price: number;
          cars: number;
          status?: 'active' | 'inactive' | 'cancelled';
          start_date: string;
          end_date: string;
          add_ons?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string;
          plan_name?: string;
          price?: number;
          cars?: number;
          status?: 'active' | 'inactive' | 'cancelled';
          start_date?: string;
          end_date?: string;
          add_ons?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Helper functions
export const supabaseService = {
  // Auth functions
  async signInWithPhone(phone: string) {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phone.startsWith('+') ? phone : `+${phone}`,
        options: {
          shouldCreateUser: true,
        }
      });
      
      if (error) {
        console.error('Supabase OTP error:', error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error in signInWithPhone:', error);
      return { data: null, error: { message: 'Failed to send OTP' } };
    }
  },

  async signUpWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async signInWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async verifyOtp(phone: string, token: string) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone.startsWith('+') ? phone : `+${phone}`,
        token,
        type: 'sms',
      });
      
      if (error) {
        console.error('Supabase OTP verification error:', error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error in verifyOtp:', error);
      return { data: null, error: { message: 'Failed to verify OTP' } };
    }
  },

  async verifyEmailOtp(email: string, token: string) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token,
        type: 'email',
      });
      
      if (error) {
        console.error('Supabase email OTP verification error:', error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error in verifyEmailOtp:', error);
      return { data: null, error: { message: 'Failed to verify OTP' } };
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // User functions
  async createUser(userData: Database['public']['Tables']['users']['Insert']) {
    // Since the users table now references auth.users(id), we need to ensure the user exists in auth first
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    return { data, error };
  },

  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    // If no user found, return null data instead of error
    if (!data && !error) {
      return { data: null, error: null };
    }
    
    return { data, error };
  },

  async updateUser(userId: string, updates: Database['public']['Tables']['users']['Update']) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Vehicle functions
  async getVehicles(userId: string) {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createVehicle(vehicleData: Database['public']['Tables']['vehicles']['Insert']) {
    const { data, error } = await supabase
      .from('vehicles')
      .insert(vehicleData)
      .select()
      .single();
    return { data, error };
  },

  async updateVehicle(vehicleId: string, updates: Database['public']['Tables']['vehicles']['Update']) {
    const { data, error } = await supabase
      .from('vehicles')
      .update(updates)
      .eq('id', vehicleId)
      .select()
      .single();
    return { data, error };
  },

  async deleteVehicle(vehicleId: string) {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', vehicleId);
    return { error };
  },

  // Booking functions
  async getBookings(userId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        vehicles (
          make,
          model,
          plate
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createBooking(bookingData: Database['public']['Tables']['bookings']['Insert']) {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();
    return { data, error };
  },

  async updateBooking(bookingId: string, updates: Database['public']['Tables']['bookings']['Update']) {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', bookingId)
      .select()
      .single();
    return { data, error };
  },

  async cancelBooking(bookingId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single();
    return { data, error };
  },

  // Subscription functions
  async getSubscription(userId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    return { data, error };
  },

  async createSubscription(subscriptionData: Database['public']['Tables']['subscriptions']['Insert']) {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscriptionData)
      .select()
      .single();
    return { data, error };
  },

  async updateSubscription(subscriptionId: string, updates: Database['public']['Tables']['subscriptions']['Update']) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', subscriptionId)
      .select()
      .single();
    return { data, error };
  },

  // Real-time subscriptions
  subscribeToBookings(userId: string, callback: (payload: any) => void) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured - real-time disabled');
      return { unsubscribe: () => {} };
    }
    
    return supabase
      .channel('bookings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },

  subscribeToUser(userId: string, callback: (payload: any) => void) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured - real-time disabled');
      return { unsubscribe: () => {} };
    }
    
    return supabase
      .channel('user')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },

  // Utility function to create sample data for testing
  async createSampleData(userId: string) {
    try {
      // Create sample vehicles
      const vehicle1 = await this.createVehicle({
        user_id: userId,
        make: 'BMW',
        model: 'X5',
        year: '2022',
        plate: 'DXB-A-12345',
        color: 'White',
      });

      const vehicle2 = await this.createVehicle({
        user_id: userId,
        make: 'Mercedes',
        model: 'C-Class',
        year: '2021',
        plate: 'DXB-B-67890',
        color: 'Black',
      });

      // Create sample subscription
      const subscription = await this.createSubscription({
        user_id: userId,
        plan_id: 'emerald-duo',
        plan_name: 'Emerald Duo Plan',
        price: 220,
        cars: 2,
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        add_ons: ['Interior Duo'],
      });

      // Create sample bookings
      const booking1 = await this.createBooking({
        user_id: userId,
        vehicle_id: vehicle1.data?.id,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
        time: '09:00 AM',
        status: 'upcoming',
        service: 'Exterior Wash',
        washer: 'Emmanuel',
        has_interior_wash: true,
      });

      const booking2 = await this.createBooking({
        user_id: userId,
        vehicle_id: vehicle2.data?.id,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days ago
        time: '10:30 AM',
        status: 'completed',
        service: 'Full Service',
        washer: 'Emmanuel',
        rating: 5,
        has_interior_wash: true,
      });

      console.log('Sample data created successfully');
      return { success: true };
    } catch (error) {
      console.error('Error creating sample data:', error);
      return { success: false, error };
    }
  },
}; 