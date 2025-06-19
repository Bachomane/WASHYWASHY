import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, Car, Trash2, Edit } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '../lib/auth-context';
import { supabaseService } from '../lib/supabase';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: string;
  plate: string;
  color: string;
  isDefault: boolean;
}

export default function VehiclesScreen() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: '',
    plate: '',
    color: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load vehicles from Supabase on mount
  useEffect(() => {
    if (user?.id) {
      loadVehicles();
    }
  }, [user]);

  const loadVehicles = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data: vehiclesData, error } = await supabaseService.getVehicles(user.id);
      if (error) {
        console.error('Error loading vehicles:', error);
        Alert.alert('Error', 'Failed to load vehicles. Please try again.');
        return;
      }
      
      if (vehiclesData) {
        // Convert Supabase data to local format
        const localVehicles: Vehicle[] = vehiclesData.map((vehicle: any, index: number) => ({
          id: vehicle.id,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          plate: vehicle.plate,
          color: vehicle.color,
          isDefault: index === 0, // First vehicle is default for now
        }));
        setVehicles(localVehicles);
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
      Alert.alert('Error', 'Failed to load vehicles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVehicle = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    if (!newVehicle.make || !newVehicle.model || !newVehicle.plate) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setIsSaving(true);
    try {
      const { data: vehicleData, error } = await supabaseService.createVehicle({
        user_id: user.id,
        make: newVehicle.make,
        model: newVehicle.model,
        year: newVehicle.year,
        plate: newVehicle.plate,
        color: newVehicle.color,
      });

      if (error) {
        console.error('Error creating vehicle:', error);
        Alert.alert('Error', 'Failed to add vehicle. Please try again.');
        return;
      }

      if (vehicleData) {
        const newVehicleLocal: Vehicle = {
          id: vehicleData.id,
          make: vehicleData.make,
          model: vehicleData.model,
          year: vehicleData.year,
          plate: vehicleData.plate,
          color: vehicleData.color,
          isDefault: vehicles.length === 0,
        };
        setVehicles([...vehicles, newVehicleLocal]);
        setNewVehicle({ make: '', model: '', year: '', plate: '', color: '' });
        setShowAddForm(false);
        Alert.alert('Success', 'Vehicle added successfully!');
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
      Alert.alert('Error', 'Failed to add vehicle. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setNewVehicle({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      plate: vehicle.plate,
      color: vehicle.color,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingVehicle || !newVehicle.make || !newVehicle.model || !newVehicle.plate) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setIsSaving(true);
    try {
      const { data: vehicleData, error } = await supabaseService.updateVehicle(editingVehicle.id, {
        make: newVehicle.make,
        model: newVehicle.model,
        year: newVehicle.year,
        plate: newVehicle.plate,
        color: newVehicle.color,
      });

      if (error) {
        console.error('Error updating vehicle:', error);
        Alert.alert('Error', 'Failed to update vehicle. Please try again.');
        return;
      }

      if (vehicleData) {
        setVehicles(vehicles.map(v => 
          v.id === editingVehicle.id 
            ? { ...v, ...newVehicle }
            : v
        ));
        setEditingVehicle(null);
        setNewVehicle({ make: '', model: '', year: '', plate: '', color: '' });
        Alert.alert('Success', 'Vehicle updated successfully!');
      }
    } catch (error) {
      console.error('Error updating vehicle:', error);
      Alert.alert('Error', 'Failed to update vehicle. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    Alert.alert(
      'Delete Vehicle',
      'Are you sure you want to delete this vehicle?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setIsSaving(true);
            try {
              const { error } = await supabaseService.deleteVehicle(id);
              if (error) {
                console.error('Error deleting vehicle:', error);
                Alert.alert('Error', 'Failed to delete vehicle. Please try again.');
                return;
              }
              
              setVehicles(vehicles.filter(v => v.id !== id));
              Alert.alert('Success', 'Vehicle deleted successfully!');
            } catch (error) {
              console.error('Error deleting vehicle:', error);
              Alert.alert('Error', 'Failed to delete vehicle. Please try again.');
            } finally {
              setIsSaving(false);
            }
          }
        }
      ]
    );
  };

  const handleSetDefault = (id: string) => {
    setVehicles(vehicles.map(v => ({
      ...v,
      isDefault: v.id === id,
    })));
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading vehicles...</Text>
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
        <Text style={styles.headerTitle}>My Vehicles</Text>
        <TouchableOpacity onPress={() => setShowAddForm(true)} style={styles.addButton}>
          <Plus size={24} color="#0000f0" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {vehicles.map((vehicle) => (
          <View key={vehicle.id} style={styles.vehicleCard}>
            <View style={styles.vehicleHeader}>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>{vehicle.make} {vehicle.model}</Text>
                <Text style={styles.vehicleDetails}>
                  {vehicle.year} • {vehicle.color} • {vehicle.plate}
                </Text>
              </View>
              <View style={styles.vehicleActions}>
                {!vehicle.isDefault && (
                  <TouchableOpacity
                    style={styles.defaultButton}
                    onPress={() => handleSetDefault(vehicle.id)}
                  >
                    <Text style={styles.defaultButtonText}>Set Default</Text>
                  </TouchableOpacity>
                )}
                {vehicle.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Default</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditVehicle(vehicle)}
                >
                  <Edit size={16} color="#0000f0" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteVehicle(vehicle.id)}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {(showAddForm || editingVehicle) && (
          <View style={styles.addForm}>
            <Text style={styles.formTitle}>
              {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            </Text>
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Make</Text>
                <TextInput
                  style={styles.input}
                  value={newVehicle.make}
                  onChangeText={(text) => setNewVehicle({ ...newVehicle, make: text })}
                  placeholder="e.g., BMW"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>Model</Text>
                <TextInput
                  style={styles.input}
                  value={newVehicle.model}
                  onChangeText={(text) => setNewVehicle({ ...newVehicle, model: text })}
                  placeholder="e.g., X5"
                />
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Year</Text>
                <TextInput
                  style={styles.input}
                  value={newVehicle.year}
                  onChangeText={(text) => setNewVehicle({ ...newVehicle, year: text })}
                  placeholder="e.g., 2022"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>Color</Text>
                <TextInput
                  style={styles.input}
                  value={newVehicle.color}
                  onChangeText={(text) => setNewVehicle({ ...newVehicle, color: text })}
                  placeholder="e.g., White"
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>License Plate</Text>
              <TextInput
                style={styles.input}
                value={newVehicle.plate}
                onChangeText={(text) => setNewVehicle({ ...newVehicle, plate: text })}
                placeholder="e.g., DXB-A-12345"
                autoCapitalize="characters"
              />
            </View>
            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddForm(false);
                  setEditingVehicle(null);
                  setNewVehicle({ make: '', model: '', year: '', plate: '', color: '' });
                }}
                disabled={isSaving}
              >
                <Text style={[styles.cancelButtonText, isSaving && styles.disabledText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                onPress={editingVehicle ? handleSaveEdit : handleAddVehicle}
                disabled={isSaving}
              >
                <Text style={styles.saveButtonText}>
                  {isSaving 
                    ? 'Saving...' 
                    : editingVehicle 
                      ? 'Save Changes' 
                      : 'Add Vehicle'
                  }
                </Text>
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
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  vehicleActions: {
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
  editButton: {
    padding: 4,
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
  inputRow: {
    flexDirection: 'row',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  saveButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
}); 