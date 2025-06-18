import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Star, CircleCheck as CheckCircle } from 'lucide-react-native';

interface Employee {
  id: string;
  name: string;
  bio: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  isAvailable: boolean;
}

interface EmployeeSelectionProps {
  onSelect: (employeeId: string) => void;
  selectedEmployeeId?: string;
}

export default function EmployeeSelection({ 
  onSelect, 
  selectedEmployeeId 
}: EmployeeSelectionProps) {
  const employees: Employee[] = [
    {
      id: 'emmanuel',
      name: 'Emmanuel',
      bio: 'Our superstar car wash expert, known for his attention to detail and friendly service. Emmanuel has been with Washy.ae since day one and consistently delivers exceptional results.',
      rating: 4.9,
      reviews: 127,
      imageUrl: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      isAvailable: true,
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        color={i < rating ? '#F59E0B' : '#E5E5E5'}
        fill={i < rating ? '#F59E0B' : 'transparent'}
      />
    ));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Washer</Text>
        <Text style={styles.subtitle}>
          Select from our team of professional car wash specialists
        </Text>
      </View>

      <View style={styles.employeeList}>
        {employees.map((employee) => (
          <TouchableOpacity
            key={employee.id}
            style={[
              styles.employeeCard,
              selectedEmployeeId === employee.id && styles.employeeCardSelected,
              !employee.isAvailable && styles.employeeCardUnavailable,
            ]}
            onPress={() => employee.isAvailable && onSelect(employee.id)}
            disabled={!employee.isAvailable}
          >
            <View style={styles.employeeImageContainer}>
              <Image source={{ uri: employee.imageUrl }} style={styles.employeeImage} />
              {employee.isAvailable && (
                <View style={styles.availableBadge}>
                  <CheckCircle size={16} color="#10B981" />
                </View>
              )}
            </View>

            <View style={styles.employeeInfo}>
              <View style={styles.employeeHeader}>
                <Text style={styles.employeeName}>{employee.name}</Text>
                {selectedEmployeeId === employee.id && (
                  <View style={styles.selectedBadge}>
                    <CheckCircle size={16} color="#1B365D" />
                    <Text style={styles.selectedText}>Selected</Text>
                  </View>
                )}
              </View>

              <View style={styles.ratingContainer}>
                <View style={styles.rating}>
                  {renderStars(Math.floor(employee.rating))}
                </View>
                <Text style={styles.ratingText}>
                  {employee.rating} ({employee.reviews} reviews)
                </Text>
              </View>

              <Text style={styles.employeeBio}>{employee.bio}</Text>

              <View style={styles.statusContainer}>
                {employee.isAvailable ? (
                  <View style={styles.availableStatus}>
                    <View style={styles.availableDot} />
                    <Text style={styles.availableText}>Available</Text>
                  </View>
                ) : (
                  <View style={styles.unavailableStatus}>
                    <View style={styles.unavailableDot} />
                    <Text style={styles.unavailableText}>Currently Busy</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.noteSection}>
        <Text style={styles.noteTitle}>About Our Team</Text>
        <Text style={styles.noteText}>
          All our washers are professionally trained and use premium equipment including microfiber towels, 
          pressure washers, and soap cannons to ensure your car receives the best care possible.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1B365D',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 24,
  },
  employeeList: {
    paddingHorizontal: 20,
  },
  employeeCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  employeeCardSelected: {
    borderColor: '#1B365D',
    backgroundColor: '#F8FAFF',
  },
  employeeCardUnavailable: {
    opacity: 0.6,
    backgroundColor: '#F9FAFB',
  },
  employeeImageContainer: {
    position: 'relative',
  },
  employeeImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  availableBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 2,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  employeeName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1B365D',
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectedText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1B365D',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  rating: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  employeeBio: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  statusContainer: {
    alignSelf: 'flex-start',
  },
  availableStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#ECFDF5',
    borderRadius: 6,
  },
  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  availableText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  unavailableStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
  },
  unavailableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  unavailableText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
  },
  noteSection: {
    margin: 20,
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8F4FD',
  },
  noteTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1B365D',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
});