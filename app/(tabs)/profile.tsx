import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Platform,
  Image,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { 
  User, 
  Car, 
  MapPin, 
  Phone, 
  Mail, 
  Settings, 
  CircleHelp as HelpCircle, 
  MessageCircle, 
  ChevronRight, 
  CreditCard as Edit3,
  Wallet,
  FileText,
  LogOut,
  Gift,
  Camera,
  Edit
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { supabaseService } from '../../lib/supabase';
import { useAuth } from '../../lib/auth-context';
import { Database } from '../../lib/supabase';
import LoadingScreen from '../../components/LoadingScreen';

type UserInfo = Database['public']['Tables']['users']['Row'];
type Vehicle = Database['public']['Tables']['vehicles']['Row'];

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: '',
    name: 'New User',
    email: 'user@washy.ae',
    phone: '+971 50 123 4567',
    address: 'Dubai, UAE',
    profile_image: undefined,
    created_at: '',
    updated_at: '',
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const router = useRouter();

  // Load data on component mount
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const [userData, vehiclesData] = await Promise.all([
        supabaseService.getUser(user.id),
        supabaseService.getVehicles(user.id),
      ]);

      if (userData.data) {
        setUserInfo(userData.data);
        if (userData.data.profile_image) {
          setProfileImage(userData.data.profile_image);
        }
      }

      if (vehiclesData.data) {
        setVehicles(vehiclesData.data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const updates = {
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        address: userInfo.address,
        profile_image: profileImage || undefined,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabaseService.updateUser(user.id, updates);
      
      if (error) {
        throw error;
      }
      
      Alert.alert('Success', 'Your profile has been updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const handleNameEdit = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  const handleEditUserInfo = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWhatsAppSupport = () => {
    const whatsappUrl = 'https://wa.me/971568565888';
    Linking.openURL(whatsappUrl).catch((err) => {
      console.error('Error opening WhatsApp:', err);
      Alert.alert('Error', 'Could not open WhatsApp. Please make sure WhatsApp is installed.');
    });
  };

  const handleFAQ = () => {
    router.push('/faq');
  };

  const handleAddVehicle = () => {
    console.log('Adding new vehicle');
  };

  const handleEditVehicle = (vehicleId: string) => {
    console.log('Editing vehicle:', vehicleId);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              router.replace('/auth');
            } catch (error) {
              console.error('Error during logout:', error);
              router.replace('/auth');
            }
          }
        }
      ]
    );
  };

  const handleCreateSampleData = async () => {
    if (!user) return;
    
    Alert.alert(
      "Create Sample Data",
      "This will create sample vehicles, subscription, and bookings for testing. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Create",
          onPress: async () => {
            try {
              const result = await supabaseService.createSampleData(user.id);
              if (result.success) {
                Alert.alert('Success', 'Sample data created successfully! Please refresh the app.');
                loadUserData(); // Reload data
              } else {
                Alert.alert('Error', 'Failed to create sample data. Please try again.');
              }
            } catch (error) {
              console.error('Error creating sample data:', error);
              Alert.alert('Error', 'Failed to create sample data. Please try again.');
            }
          }
        }
      ]
    );
  };

  const menuItems = [
    { icon: User, title: 'My personal details', onPress: () => router.push('/personal-details') },
    { icon: MapPin, title: 'My locations', onPress: () => router.push('/locations') },
    { icon: Car, title: 'My vehicles', onPress: () => router.push('/vehicles') },
    { icon: FileText, title: 'My subscription', onPress: () => router.push('/subscription') },
  ];

  const supportItems = [
    { icon: MessageCircle, title: 'Chat with us', onPress: handleWhatsAppSupport },
    { icon: HelpCircle, title: 'FAQ', onPress: handleFAQ },
  ];

  const settingsItems = [
    { icon: FileText, title: 'Terms and conditions', onPress: () => router.push('/terms') },
    { icon: Settings, title: 'Account settings', onPress: () => router.push('/account-settings') },
    { icon: Gift, title: 'Create Sample Data (Testing)', onPress: handleCreateSampleData },
    { icon: LogOut, title: 'Logout', onPress: handleLogout },
  ];

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity style={styles.avatar} onPress={pickImage}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>
                  {userInfo.name.charAt(0).toUpperCase()}.
                </Text>
              )}
              <View style={styles.cameraIcon}>
                <Camera size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameLabel}>Your name</Text>
            <View style={styles.nameRow}>
              <View style={styles.nameWrapper}>
                {isEditing ? (
                  <TextInput
                    style={styles.nameInput}
                    value={userInfo.name}
                    onChangeText={(text) => handleEditUserInfo('name', text)}
                    autoFocus
                    onBlur={handleSave}
                  />
                ) : (
                  <Text style={styles.nameText}>{userInfo.name}</Text>
                )}
              </View>
              <TouchableOpacity style={styles.editButton} onPress={handleNameEdit}>
                <Edit size={16} color="#0000f0" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuItemLeft}>
                <item.icon size={20} color="#666666" />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <ChevronRight size={16} color="#CCCCCC" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          {supportItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuItemLeft}>
                <item.icon size={20} color="#666666" />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <ChevronRight size={16} color="#CCCCCC" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {settingsItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuItemLeft}>
                <item.icon size={20} color="#666666" />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <ChevronRight size={16} color="#CCCCCC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: Platform.OS === 'ios' ? 49 : 49,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 10,
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0000f0',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameContainer: {
    alignItems: 'center',
    width: 'auto',
  },
  nameLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 'auto',
  },
  nameWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    textAlign: 'center',
  },
  nameInput: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#0000f0',
    paddingBottom: 2,
    minWidth: 150,
    textAlign: 'center',
  },
  editButton: {
    padding: 4,
    marginLeft: 2,
  },
  rewardsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  rewardsBanner: {
    backgroundColor: '#D4AF37',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  rewardsIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardsText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#000000',
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999999',
  },
  bottomSpacing: {
    height: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});