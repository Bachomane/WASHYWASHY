import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert, Linking } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Globe, Trash2 } from 'lucide-react-native';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLanguageSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setIsDeleting(true);
            // Here you would typically call your API to delete the account
            // For now, we'll just show a success message
            setTimeout(() => {
              setIsDeleting(false);
              Alert.alert(
                "Account Deleted",
                "Your account has been successfully deleted.",
                [
                  {
                    text: "OK",
                    onPress: () => router.replace('/auth')
                  }
                ]
              );
            }, 1500);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Account Settings",
          headerShown: true,
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#000000" />
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <Text style={styles.headerTitle}>Account Settings</Text>
          ),
        }}
      />

      <View style={styles.content}>
        {/* Language Settings */}
        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={handleLanguageSettings}
        >
          <View style={styles.settingLeft}>
            <View style={styles.iconContainer}>
              <Globe size={24} color="#666666" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Language</Text>
              <Text style={styles.settingDescription}>
                Change your device language settings
              </Text>
            </View>
          </View>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity 
          style={[styles.settingItem, styles.deleteItem]} 
          onPress={handleDeleteAccount}
          disabled={isDeleting}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, styles.deleteIconContainer]}>
              <Trash2 size={24} color="#FF3B30" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, styles.deleteText]}>
                {isDeleting ? 'Deleting Account...' : 'Delete Account'}
              </Text>
              <Text style={[styles.settingDescription, styles.deleteDescription]}>
                Permanently delete your account and all data
              </Text>
            </View>
          </View>
          {!isDeleting && (
            <View style={styles.arrowContainer}>
              <Text style={[styles.arrow, styles.deleteArrow]}>›</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  content: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  arrowContainer: {
    paddingLeft: 8,
  },
  arrow: {
    fontSize: 24,
    color: '#CCCCCC',
  },
  deleteItem: {
    marginTop: 16,
  },
  deleteIconContainer: {
    backgroundColor: '#FFF5F5',
  },
  deleteText: {
    color: '#FF3B30',
  },
  deleteDescription: {
    color: '#FF3B30',
    opacity: 0.8,
  },
  deleteArrow: {
    color: '#FF3B30',
  },
}); 