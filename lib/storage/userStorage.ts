import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImage?: string;
  latitude?: number;
  longitude?: number;
}

export interface SubscriptionData {
  plan: string;
  status: 'active' | 'inactive' | 'cancelled';
  price: number;
  cars: number;
  frequency: string;
  nextPayment: string;
  paymentMethod: string;
  addOns: {
    name: string;
    price: number;
    description: string;
  }[];
}

const STORAGE_KEYS = {
  USER_DATA: '@user_data',
  SUBSCRIPTION_DATA: '@subscription_data',
  PHONE_MAPPING: '@phone_mapping',
};

export const userStorage = {
  // User Data Methods
  async saveUserData(data: UserData): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data));
      // Also save phone mapping
      if (data.phone) {
        await this.savePhoneMapping(data.phone);
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  },

  async getUserData(): Promise<UserData | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Phone Mapping Methods
  async savePhoneMapping(phone: string): Promise<void> {
    try {
      const mappings = await this.getPhoneMappings();
      if (!mappings.includes(phone)) {
        mappings.push(phone);
        await AsyncStorage.setItem(STORAGE_KEYS.PHONE_MAPPING, JSON.stringify(mappings));
      }
    } catch (error) {
      console.error('Error saving phone mapping:', error);
      throw error;
    }
  },

  async getPhoneMappings(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PHONE_MAPPING);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting phone mappings:', error);
      return [];
    }
  },

  async isPhoneRegistered(phone: string): Promise<boolean> {
    try {
      const mappings = await this.getPhoneMappings();
      return mappings.includes(phone);
    } catch (error) {
      console.error('Error checking phone registration:', error);
      return false;
    }
  },

  // Subscription Methods
  async saveSubscriptionData(data: SubscriptionData): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_DATA, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving subscription data:', error);
      throw error;
    }
  },

  async getSubscriptionData(): Promise<SubscriptionData | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting subscription data:', error);
      return null;
    }
  },

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.SUBSCRIPTION_DATA,
        STORAGE_KEYS.PHONE_MAPPING,
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  },
}; 