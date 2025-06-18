import React, { useState } from 'react';
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

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: string;
  plate: string;
  color: string;
}

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: 'Ahmed Al-Rashid',
    email: 'ahmed.alrashid@email.com',
    phone: '+971 50 123 4567',
    address: 'Villa 123, Arabian Ranches 3, Dubai',
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      make: 'BMW',
      model: 'X5',
      year: '2022',
      plate: 'DXB-A-12345',
      color: 'White',
    },
    {
      id: '2',
      make: 'Mercedes',
      model: 'C-Class',
      year: '2021',
      plate: 'DXB-B-67890',
      color: 'Black',
    },
  ]);

  const router = useRouter();

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleNameEdit = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
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
          onPress: () => {
            // Here you would typically clear any auth tokens or user data
            router.replace('/auth');
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
    { icon: LogOut, title: 'Logout', onPress: handleLogout },
  ];

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
                    onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
                    autoFocus
                    onBlur={handleSave}
                    onSubmitEditing={handleSave}
                  />
                ) : (
                  <Text style={styles.userName}>{userInfo.name}</Text>
                )}
              </View>
              <TouchableOpacity onPress={handleNameEdit} style={styles.editButton}>
                <Edit size={16} color="#666666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Main Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <item.icon size={20} color="#666666" />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <ChevronRight size={20} color="#CCCCCC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Support Section */}
        <View style={styles.menuSection}>
          {supportItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <item.icon size={20} color="#666666" />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <ChevronRight size={20} color="#CCCCCC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings Section */}
        <View style={styles.menuSection}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <item.icon size={20} color="#666666" />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <ChevronRight size={20} color="#CCCCCC" />
            </TouchableOpacity>
          ))}
        </View>
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
  userName: {
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