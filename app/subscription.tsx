import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Car, Sparkles, MessageCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '../lib/auth-context';
import { supabaseService } from '../lib/supabase';

interface Subscription {
  id: string;
  plan_id: string;
  plan_name: string;
  price: number;
  cars: number;
  status: 'active' | 'inactive' | 'cancelled';
  start_date: string;
  end_date: string;
  add_ons: string[];
}

export default function SubscriptionScreen() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load subscription from Supabase on mount
  useEffect(() => {
    if (user?.id) {
      loadSubscription();
    }
  }, [user]);

  const loadSubscription = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data: subscriptionData, error } = await supabaseService.getSubscription(user.id);
      if (error) {
        console.error('Error loading subscription:', error);
        // Don't show error alert for no subscription found
        if (error.code !== 'PGRST116') {
          Alert.alert('Error', 'Failed to load subscription. Please try again.');
        }
        return;
      }
      
      if (subscriptionData) {
        setSubscription(subscriptionData);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
      Alert.alert('Error', 'Failed to load subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSupport = () => {
    console.log('Opening WhatsApp support');
  };

  const handleCancelSubscription = async () => {
    if (!subscription) {
      Alert.alert('Error', 'No active subscription found.');
      return;
    }

    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? This action cannot be undone.',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        { 
          text: 'Cancel Subscription', 
          style: 'destructive',
          onPress: async () => {
            setIsUpdating(true);
            try {
              const { error } = await supabaseService.updateSubscription(subscription.id, {
                status: 'cancelled',
              });
              
              if (error) {
                console.error('Error cancelling subscription:', error);
                Alert.alert('Error', 'Failed to cancel subscription. Please try again.');
                return;
              }
              
              // Update local state
              setSubscription(prev => prev ? { ...prev, status: 'cancelled' } : null);
              Alert.alert('Subscription Cancelled', 'Your subscription has been cancelled successfully.');
            } catch (error) {
              console.error('Error cancelling subscription:', error);
              Alert.alert('Error', 'Failed to cancel subscription. Please try again.');
            } finally {
              setIsUpdating(false);
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading subscription...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!subscription) {
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

        <View style={styles.noSubscriptionContainer}>
          <Text style={styles.noSubscriptionTitle}>No Active Subscription</Text>
          <Text style={styles.noSubscriptionText}>
            You don't have an active subscription. Please visit the Plans screen to subscribe.
          </Text>
          <TouchableOpacity 
            style={styles.subscribeButton}
            onPress={() => router.push('/(tabs)/plans')}
          >
            <Text style={styles.subscribeButtonText}>View Plans</Text>
          </TouchableOpacity>
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
        <Text style={styles.headerTitle}>My Subscription</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Plan */}
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <Text style={styles.planTitle}>{subscription.plan_name}</Text>
            <View style={[styles.planStatus, { backgroundColor: subscription.status === 'active' ? '#10B981' : subscription.status === 'cancelled' ? '#EF4444' : '#F59E0B' }]}>
              <Text style={styles.planStatusText}>{subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}</Text>
            </View>
          </View>
          <Text style={styles.planPrice}>AED {subscription.price}/month</Text>
          <Text style={styles.planDescription}>{subscription.cars} Car{subscription.cars > 1 ? 's' : ''} • Exterior Wash Twice Weekly</Text>
          
          <View style={styles.planFeatures}>
            <View style={styles.featureItem}>
              <Car size={16} color="#0000f0" />
              <Text style={styles.featureText}>{subscription.cars} Car{subscription.cars > 1 ? 's' : ''} included</Text>
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
        {subscription.add_ons && subscription.add_ons.length > 0 && (
          <View style={styles.addOnsSection}>
            <Text style={styles.sectionTitle}>Active Add-ons</Text>
            {subscription.add_ons.map((addon, index) => (
              <View key={index} style={styles.addOnCard}>
                <View style={styles.addOnHeader}>
                  <Text style={styles.addOnTitle}>{addon}</Text>
                  <Text style={styles.addOnPrice}>AED 135/month</Text>
                </View>
                <Text style={styles.addOnDescription}>
                  Complete interior cleaning for {subscription.cars} car{subscription.cars > 1 ? 's' : ''}, including all interior surfaces and vacuuming.
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Billing Information */}
        <View style={styles.billingSection}>
          <Text style={styles.sectionTitle}>Billing Information</Text>
          <View style={styles.billingCard}>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Next Payment</Text>
              <Text style={styles.billingValue}>{new Date(subscription.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Payment Method</Text>
              <Text style={styles.billingValue}>Credit Card ending in 1234</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Total Monthly</Text>
              <Text style={styles.billingValue}>AED {subscription.price + (subscription.add_ons ? subscription.add_ons.length * 135 : 0)}</Text>
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
          
          <TouchableOpacity 
            style={[styles.cancelButton, isUpdating && styles.cancelButtonDisabled]} 
            onPress={handleCancelSubscription}
            disabled={isUpdating}
          >
            <Text style={[styles.cancelButtonText, isUpdating && styles.disabledText]}>
              {isUpdating ? 'Cancelling...' : 'Cancel Subscription'}
            </Text>
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
  nextWashSection: {
    marginBottom: 24,
  },
  nextWashCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 20,
  },
  nextWashHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  rescheduleButton: {
    backgroundColor: '#0000f0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  rescheduleButtonText: {
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
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  noSubscriptionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noSubscriptionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 12,
  },
  noSubscriptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 20,
  },
  subscribeButton: {
    backgroundColor: '#0000f0',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  cancelButtonDisabled: {
    borderColor: '#CCCCCC',
  },
  disabledText: {
    color: '#CCCCCC',
  },
}); 