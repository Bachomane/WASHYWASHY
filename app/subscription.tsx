import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Car, Sparkles, MessageCircle } from 'lucide-react-native';
import { router } from 'expo-router';

export default function SubscriptionScreen() {
  const handleContactSupport = () => {
    console.log('Opening WhatsApp support');
  };

  const handleCancelSubscription = () => {
    console.log('Canceling subscription');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Subscription</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Plan */}
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <Text style={styles.planTitle}>Emerald Duo Plan</Text>
            <View style={styles.planStatus}>
              <Text style={styles.planStatusText}>Active</Text>
            </View>
          </View>
          <Text style={styles.planPrice}>AED 220/month</Text>
          <Text style={styles.planDescription}>2 Cars • Exterior Wash Twice Weekly</Text>
          
          <View style={styles.planFeatures}>
            <View style={styles.featureItem}>
              <Car size={16} color="#0000f0" />
              <Text style={styles.featureText}>2 Cars included</Text>
            </View>
            <View style={styles.featureItem}>
              <Calendar size={16} color="#0000f0" />
              <Text style={styles.featureText}>Twice weekly washes</Text>
            </View>
            <View style={styles.featureItem}>
              <Sparkles size={16} color="#0000f0" />
              <Text style={styles.featureText}>Interior cleaning available</Text>
            </View>
          </View>
        </View>

        {/* Add-ons */}
        <View style={styles.addOnsSection}>
          <Text style={styles.sectionTitle}>Active Add-ons</Text>
          <View style={styles.addOnCard}>
            <View style={styles.addOnHeader}>
              <Text style={styles.addOnTitle}>Interior Duo</Text>
              <Text style={styles.addOnPrice}>AED 135/month</Text>
            </View>
            <Text style={styles.addOnDescription}>
              Complete interior cleaning for two cars, including all interior surfaces and vacuuming.
            </Text>
          </View>
        </View>

        {/* Billing Information */}
        <View style={styles.billingSection}>
          <Text style={styles.sectionTitle}>Billing Information</Text>
          <View style={styles.billingCard}>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Next Payment</Text>
              <Text style={styles.billingValue}>May 15, 2024</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Payment Method</Text>
              <Text style={styles.billingValue}>Credit Card ending in 1234</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Total Monthly</Text>
              <Text style={styles.billingValue}>AED 355</Text>
            </View>
          </View>
        </View>

        {/* Next Wash */}
        <View style={styles.nextWashSection}>
          <Text style={styles.sectionTitle}>Next Wash</Text>
          <View style={styles.nextWashCard}>
            <View style={styles.nextWashHeader}>
              <Calendar size={20} color="#0000f0" />
              <Text style={styles.nextWashDate}>Tomorrow at 9:00 AM</Text>
            </View>
            <Text style={styles.nextWashDetails}>
              Both cars will be washed at your home location
            </Text>
            <TouchableOpacity style={styles.rescheduleButton}>
              <Text style={styles.rescheduleButtonText}>Reschedule</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.contactButton} onPress={handleContactSupport}>
            <MessageCircle size={20} color="#FFFFFF" />
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelSubscription}>
            <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 20,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  planStatus: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  planPrice: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#0000f0',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  planFeatures: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  addOnsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 12,
  },
  addOnCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  addOnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addOnTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  addOnPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#0000f0',
  },
  addOnDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  billingSection: {
    marginBottom: 24,
  },
  billingCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  billingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  billingValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000000',
  },
  nextWashSection: {
    marginBottom: 24,
  },
  nextWashCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  nextWashHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  nextWashDate: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  nextWashDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  rescheduleButton: {
    backgroundColor: '#0000f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  rescheduleButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  actionsSection: {
    gap: 12,
  },
  contactButton: {
    backgroundColor: '#0000f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  contactButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
  },
}); 