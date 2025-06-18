import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown, Edit2, Check, ArrowLeft, MapPin, Save } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { userStorage, UserData } from '../lib/storage/userStorage';
import * as Location from 'expo-location';

const clusters = [
  'Sun',
  'Joy',
  'Ruba',
  'Spring',
  'Bliss I',
  'Bliss II',
  'Caya I',
  'Caya II',
  'Elie Saab Villas',
  'June 1',
  'June 2',
  'Raya'
];

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

export default function LocationsScreen() {
  const [selectedCluster, setSelectedCluster] = useState('');
  const [villaNumber, setVillaNumber] = useState('');
  const [showClusterModal, setShowClusterModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [savedLocation, setSavedLocation] = useState<LocationData | null>(null);
  const [editedAddress, setEditedAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadLocationData();
  }, []);

  const loadLocationData = async () => {
    try {
      const userData = await userStorage.getUserData();
      if (userData?.address) {
        setSavedLocation({
          address: userData.address,
          latitude: userData.latitude || 0,
          longitude: userData.longitude || 0,
        });
        setEditedAddress(userData.address);
      }
    } catch (error) {
      console.error('Error loading location data:', error);
      Alert.alert('Error', 'Failed to load location data');
    } finally {
      setIsLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable location services to use this feature');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Get address from coordinates
      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (address) {
        const formattedAddress = [
          address.street,
          address.city,
          address.region,
          address.postalCode,
          address.country,
        ].filter(Boolean).join(', ');

        const newLocation = {
          address: formattedAddress,
          latitude,
          longitude,
        };

        setSavedLocation(newLocation);
        setEditedAddress(formattedAddress);
        await saveLocation(newLocation);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your current location');
    }
  };

  const saveLocation = async (locationData: LocationData) => {
    try {
      const userData = await userStorage.getUserData();
      if (userData) {
        const updatedUserData: UserData = {
          ...userData,
          address: locationData.address,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        };
        await userStorage.saveUserData(updatedUserData);
        Alert.alert('Success', 'Location saved successfully');
      }
    } catch (error) {
      console.error('Error saving location:', error);
      Alert.alert('Error', 'Failed to save location');
    }
  };

  const handleSaveLocation = () => {
    if (!selectedCluster) {
      Alert.alert('Error', 'Please select a cluster');
      return;
    }

    if (!villaNumber.trim()) {
      Alert.alert('Error', 'Please enter your villa number');
      return;
    }

    const location: LocationData = {
      address: 'Arabian Ranches 3',
      latitude: 0,
      longitude: 0,
    };

    setSavedLocation(location);
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (savedLocation) {
      setSelectedCluster('Sun');
      setVillaNumber('1');
      setIsEditing(true);
    }
  };

  const renderClusterItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.clusterItem}
      onPress={() => {
        setSelectedCluster(item);
        setShowClusterModal(false);
      }}
    >
      <Text style={[
        styles.clusterItemText,
        selectedCluster === item && styles.selectedClusterText
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderLocationForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Add Your Location</Text>
      <Text style={styles.subtitle}>
        Please select your cluster and villa number
      </Text>

      <View style={styles.locationContainer}>
        <Text style={styles.locationLabel}>City</Text>
        <View style={styles.cityContainer}>
          <Text style={styles.cityText}>Arabian Ranches 3</Text>
        </View>

        <Text style={styles.locationLabel}>Cluster</Text>
        <TouchableOpacity
          style={styles.clusterSelector}
          onPress={() => setShowClusterModal(true)}
        >
          <Text style={[
            styles.clusterSelectorText,
            !selectedCluster && styles.placeholderText
          ]}>
            {selectedCluster || 'Select a cluster'}
          </Text>
          <ChevronDown size={20} color="#666666" />
        </TouchableOpacity>

        <Text style={styles.locationLabel}>Villa Number</Text>
        <TextInput
          style={styles.villaInput}
          placeholder="Enter your villa number"
          value={villaNumber}
          onChangeText={setVillaNumber}
          keyboardType="number-pad"
        />
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={handleSaveLocation}
      >
        <Text style={styles.buttonText}>Save Location</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLocationSummary = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryTitle}>Your Location</Text>
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <Edit2 size={20} color="#0000f0" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>City</Text>
          <Text style={styles.summaryValue}>{savedLocation?.address}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Cluster</Text>
          <Text style={styles.summaryValue}>{selectedCluster}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Villa Number</Text>
          <Text style={styles.summaryValue}>{villaNumber}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.doneButton}
        onPress={() => router.back()}
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );

  const handleSave = async () => {
    if (!editedAddress.trim()) {
      Alert.alert('Error', 'Please enter a valid address');
      return;
    }

    const updatedLocation = {
      ...savedLocation!,
      address: editedAddress,
    };

    await saveLocation(updatedLocation);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Locations</Text>
      </View>

      <ScrollView style={styles.content}>
        {savedLocation && !isEditing ? renderLocationSummary() : renderLocationForm()}
      </ScrollView>

      <Modal
        visible={showClusterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowClusterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Cluster</Text>
              <TouchableOpacity
                onPress={() => setShowClusterModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={clusters}
              renderItem={renderClusterItem}
              keyExtractor={(item) => item}
              style={styles.clusterList}
            />
          </View>
        </View>
      </Modal>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 32,
  },
  locationContainer: {
    marginBottom: 24,
  },
  locationLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
    marginBottom: 8,
  },
  cityContainer: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    justifyContent: 'center',
    backgroundColor: '#F8F9FF',
    marginBottom: 16,
  },
  cityText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  clusterSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#F8F9FF',
    marginBottom: 16,
  },
  clusterSelectorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  placeholderText: {
    color: '#999999',
  },
  villaInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    backgroundColor: '#F8F9FF',
  },
  button: {
    backgroundColor: '#0000f0',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0000f0',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#0000f0',
  },
  clusterList: {
    padding: 16,
  },
  clusterItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  clusterItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  selectedClusterText: {
    color: '#0000f0',
    fontFamily: 'Inter-SemiBold',
  },
  summaryContainer: {
    padding: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  editButton: {
    padding: 8,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 16,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  doneButton: {
    backgroundColor: '#0000f0',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0000f0',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  doneButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 