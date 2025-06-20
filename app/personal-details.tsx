import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useAuth } from '../lib/auth-context';
import { supabaseService } from '../lib/supabase';

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function PersonalDetailsScreen() {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load user data from Supabase on mount
  useEffect(() => {
    if (user?.id) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data: userData, error } = await supabaseService.getUser(user.id);
      if (error) {
        console.error('Error loading user data:', error);
        Alert.alert('Error', 'Failed to load user data. Please try again.');
        return;
      }
      if (userData) {
        setUserInfo({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
        });
        if (userData.profile_image) {
          setProfileImage(userData.profile_image);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
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

  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    setIsSaving(true);
    try {
      await supabaseService.updateUser(user.id, {
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        address: userInfo.address,
        profile_image: profileImage || undefined,
      });
      
      Alert.alert('Success', 'Personal details saved successfully!');
      router.back();
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'Failed to save personal details. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Details</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          disabled={isSaving}
        >
          <Save size={24} color={isSaving ? "#999999" : "#0000f0"} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Profile Picture</Text>
          <TouchableOpacity style={styles.avatar} onPress={pickImage}>
            {profileImage ? (
              <Text style={styles.avatarText}>
                {userInfo.name.charAt(0).toUpperCase()}.
              </Text>
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

        {/* Personal Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={userInfo.name}
              onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
              placeholder="Enter your full name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={userInfo.email}
              onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={userInfo.phone}
              onChangeText={(text) => setUserInfo({ ...userInfo, phone: text })}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Address</Text>
            <TextInput
              style={styles.input}
              value={userInfo.address}
              onChangeText={(text) => setUserInfo({ ...userInfo, address: text })}
              placeholder="Enter your address"
              multiline
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  saveButton: {
    padding: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0000f0',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
}); 