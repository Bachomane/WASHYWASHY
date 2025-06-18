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

interface Location {
  city: string;
  cluster: string;
  villaNumber: string;
}

export default function LocationsScreen() {
  const [selectedCluster, setSelectedCluster] = useState('');
  const [villaNumber, setVillaNumber] = useState('');
  const [showClusterModal, setShowClusterModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [savedLocation, setSavedLocation] = useState<Location | null>(null);
  const router = useRouter();

  const handleSaveLocation = () => {
    if (!selectedCluster) {
      Alert.alert('Error', 'Please select a cluster');
      return;
    }

    if (!villaNumber.trim()) {
      Alert.alert('Error', 'Please enter your villa number');
      return;
    }

    const location: Location = {
      city: 'Arabian Ranches 3',
      cluster: selectedCluster,
      villaNumber: villaNumber.trim(),
    };

    setSavedLocation(location);
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (savedLocation) {
      setSelectedCluster(savedLocation.cluster);
      setVillaNumber(savedLocation.villaNumber);
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
            selectedCluster && styles.selectedClusterSelectorText
          ]}>
            {selectedCluster || 'Select your cluster'}
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
        style={styles.saveButton}
        onPress={handleSaveLocation}
      >
        <Text style={styles.saveButtonText}>Save Location</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLocationSummary = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryTitle}>Your Location</Text>
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <Edit2 size={20} color="#666666" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContent}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>City</Text>
          <Text style={styles.summaryValue}>{savedLocation?.city}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Cluster</Text>
          <Text style={styles.summaryValue}>{savedLocation?.cluster}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Villa Number</Text>
          <Text style={styles.summaryValue}>{savedLocation?.villaNumber}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Locations</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {savedLocation && !isEditing ? (
          renderLocationSummary()
        ) : (
          renderLocationForm()
        )}
      </ScrollView>

      {/* Cluster Selection Modal */}
      <Modal
        visible={showClusterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowClusterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Cluster</Text>
              <TouchableOpacity
                onPress={() => setShowClusterModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={clusters}
              renderItem={renderClusterItem}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
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
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    flex: 1,
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
    gap: 16,
  },
  locationLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  cityContainer: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cityText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  clusterSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  clusterSelectorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  selectedClusterSelectorText: {
    color: '#000000',
  },
  villaInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  saveButton: {
    backgroundColor: '#0000f0',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  editButton: {
    padding: 4,
  },
  summaryContent: {
    gap: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  clusterItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  clusterItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  selectedClusterText: {
    color: '#0000f0',
    fontFamily: 'Inter-Medium',
  },
}); 