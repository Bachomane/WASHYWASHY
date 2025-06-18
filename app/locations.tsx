import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, MapPin, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';

interface Location {
  id: string;
  name: string;
  address: string;
  isDefault: boolean;
}

export default function LocationsScreen() {
  const [locations, setLocations] = useState<Location[]>([
    {
      id: '1',
      name: 'Home',
      address: 'Villa 123, Arabian Ranches 3, Dubai',
      isDefault: true,
    },
    {
      id: '2',
      name: 'Office',
      address: 'Sheikh Zayed Road, Dubai',
      isDefault: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: '', address: '' });

  const handleAddLocation = () => {
    if (newLocation.name && newLocation.address) {
      const location: Location = {
        id: Date.now().toString(),
        name: newLocation.name,
        address: newLocation.address,
        isDefault: false,
      };
      setLocations([...locations, location]);
      setNewLocation({ name: '', address: '' });
      setShowAddForm(false);
    }
  };

  const handleDeleteLocation = (id: string) => {
    setLocations(locations.filter(loc => loc.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setLocations(locations.map(loc => ({
      ...loc,
      isDefault: loc.id === id,
    })));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Locations</Text>
        <TouchableOpacity onPress={() => setShowAddForm(true)} style={styles.addButton}>
          <Plus size={24} color="#0000f0" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {locations.map((location) => (
          <View key={location.id} style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{location.name}</Text>
                <Text style={styles.locationAddress}>{location.address}</Text>
              </View>
              <View style={styles.locationActions}>
                {!location.isDefault && (
                  <TouchableOpacity
                    style={styles.defaultButton}
                    onPress={() => handleSetDefault(location.id)}
                  >
                    <Text style={styles.defaultButtonText}>Set Default</Text>
                  </TouchableOpacity>
                )}
                {location.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Default</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteLocation(location.id)}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {showAddForm && (
          <View style={styles.addForm}>
            <Text style={styles.formTitle}>Add New Location</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location Name</Text>
              <TextInput
                style={styles.input}
                value={newLocation.name}
                onChangeText={(text) => setNewLocation({ ...newLocation, name: text })}
                placeholder="e.g., Home, Office"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                style={styles.input}
                value={newLocation.address}
                onChangeText={(text) => setNewLocation({ ...newLocation, address: text })}
                placeholder="Enter full address"
                multiline
              />
            </View>
            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddLocation}
              >
                <Text style={styles.saveButtonText}>Add Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  addButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  locationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  defaultButton: {
    backgroundColor: '#0000f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  defaultButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  defaultBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  deleteButton: {
    padding: 4,
  },
  addForm: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  formTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
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
  formActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#0000f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
}); 