import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  USER_INFO: 'user_info',
  VEHICLES: 'vehicles',
  BOOKINGS: 'bookings',
  SUBSCRIPTION: 'subscription',
  PREFERENCES: 'preferences',
} as const;

// User info interface
export interface UserInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImage?: string;
}

// Vehicle interface
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: string;
  plate: string;
  color: string;
}

// Booking interface
export interface Booking {
  id: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'in-progress' | 'cancelled';
  service: string;
  washer: string;
  rating?: number;
  hasInteriorWash?: boolean;
  vehicleId?: string;
}

// Subscription interface
export interface Subscription {
  planId: string;
  planName: string;
  price: number;
  cars: number;
  status: 'active' | 'inactive' | 'cancelled';
  startDate: string;
  endDate: string;
  addOns: string[];
}

// Preferences interface
export interface Preferences {
  notifications: boolean;
  darkMode: boolean;
  language: string;
}

// Storage functions
export const Storage = {
  // User info
  async getUserInfo(): Promise<UserInfo | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_INFO);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  },

  async saveUserInfo(userInfo: UserInfo): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
    } catch (error) {
      console.error('Error saving user info:', error);
    }
  },

  // Vehicles
  async getVehicles(): Promise<Vehicle[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.VEHICLES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting vehicles:', error);
      return [];
    }
  },

  async saveVehicles(vehicles: Vehicle[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
    } catch (error) {
      console.error('Error saving vehicles:', error);
    }
  },

  async addVehicle(vehicle: Vehicle): Promise<void> {
    const vehicles = await this.getVehicles();
    vehicles.push(vehicle);
    await this.saveVehicles(vehicles);
  },

  async updateVehicle(vehicleId: string, updatedVehicle: Vehicle): Promise<void> {
    const vehicles = await this.getVehicles();
    const index = vehicles.findIndex(v => v.id === vehicleId);
    if (index !== -1) {
      vehicles[index] = updatedVehicle;
      await this.saveVehicles(vehicles);
    }
  },

  async deleteVehicle(vehicleId: string): Promise<void> {
    const vehicles = await this.getVehicles();
    const filteredVehicles = vehicles.filter(v => v.id !== vehicleId);
    await this.saveVehicles(filteredVehicles);
  },

  // Bookings
  async getBookings(): Promise<Booking[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting bookings:', error);
      return [];
    }
  },

  async saveBookings(bookings: Booking[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (error) {
      console.error('Error saving bookings:', error);
    }
  },

  async addBooking(booking: Booking): Promise<void> {
    const bookings = await this.getBookings();
    bookings.push(booking);
    await this.saveBookings(bookings);
  },

  async updateBooking(bookingId: string, updatedBooking: Partial<Booking>): Promise<void> {
    const bookings = await this.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...updatedBooking };
      await this.saveBookings(bookings);
    }
  },

  async cancelBooking(bookingId: string): Promise<void> {
    await this.updateBooking(bookingId, { status: 'cancelled' });
  },

  // Subscription
  async getSubscription(): Promise<Subscription | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting subscription:', error);
      return null;
    }
  },

  async saveSubscription(subscription: Subscription): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(subscription));
    } catch (error) {
      console.error('Error saving subscription:', error);
    }
  },

  // Preferences
  async getPreferences(): Promise<Preferences> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? JSON.parse(data) : {
        notifications: true,
        darkMode: false,
        language: 'en',
      };
    } catch (error) {
      console.error('Error getting preferences:', error);
      return {
        notifications: true,
        darkMode: false,
        language: 'en',
      };
    }
  },

  async savePreferences(preferences: Preferences): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  },

  // Clear all data (for logout)
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
}; 