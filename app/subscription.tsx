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
import { userStorage, SubscriptionData } from '../lib/storage/userStorage';

export default function SubscriptionScreen() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      const data = await userStorage.getSubscriptionData();
      setSubscription(data);
    } catch (error) {
      console.error('Error loading subscription data:', error);
      Alert.alert('Error', 'Failed to load subscription data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSupport = () => {
    Alert.alert('Contact Support', 'Opening WhatsApp support...');
  };

  const handleCancelSubscription = async () => {
    try {
      if (subscription) {
        const updatedSubscription = {
          ...subscription,
          status: 'cancelled' as const,
        };
        await userStorage.saveSubscriptionData(updatedSubscription);
        setSubscription(updatedSubscription);
        Alert.alert('Success', 'Your subscription has been cancelled');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      Alert.alert('Error', 'Failed to cancel subscription');
    }
  };

  const handleSubscribe = async () => {
    try {
      const newSubscription: SubscriptionData = {
        plan: 'Emerald Duo Plan',
        status: 'active',
        price: 220,
        cars: 2,
        frequency: 'Twice Weekly',
        nextPayment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        paymentMethod: 'Credit Card ending in 1234',
        addOns: [
          {
            name: 'Interior Duo',
            price: 135,
            description: 'Complete interior cleaning for two cars, including all interior surfaces and vacuuming.',
          },
        ],
      };
      await userStorage.saveSubscriptionData(newSubscription);
      setSubscription(newSubscription);
      Alert.alert('Success', 'You have successfully subscribed to the plan');
    } catch (error) {
      console.error('Error subscribing:', error);
      Alert.alert('Error', 'Failed to subscribe to the plan');
    }
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

  if (!subscription) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Subscription</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.noSubscriptionContainer}>
          <Text style={styles.noSubscriptionText}>No Active Subscription</Text>
          <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
            <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
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
            <Text style={styles.planTitle}>{subscription.plan}</Text>
            <View style={[
              styles.planStatus,
              { backgroundColor: subscription.status === 'active' ? '#10B981' : '#EF4444' }
            ]}>
              <Text style={styles.planStatusText}>
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </Text>
            </View>
          </View>
          <Text style={styles.planPrice}>AED {subscription.price}/month</Text>
          <Text style={styles.planDescription}>
            {subscription.cars} Cars • {subscription.frequency}
          </Text>
          
          <View style={styles.planFeatures}>
            <View style={styles.featureItem}>
              <Car size={16} color="#0000f0" />
              <Text style={styles.featureText}>{subscription.cars} Cars included</Text>
            </View>
            <View style={styles.featureItem}>
              <Calendar size={16} color="#0000f0" />
              <Text style={styles.featureText}>{subscription.frequency} washes</Text>
            </View>
            <View style={styles.featureItem}>
              <Sparkles size={16} color="#0000f0" />
              <Text style={styles.featureText}>Interior cleaning available</Text>
            </View>
          </View>
        </View>

        {/* Add-ons */}
        {subscription.addOns.length > 0 && (
          <View style={styles.addOnsSection}>
            <Text style={styles.sectionTitle}>Active Add-ons</Text>
            {subscription.addOns.map((addOn, index) => (
              <View key={index} style={styles.addOnCard}>
                <View style={styles.addOnHeader}>
                  <Text style={styles.addOnTitle}>{addOn.name}</Text>
                  <Text style={styles.addOnPrice}>AED {addOn.price}/month</Text>
                </View>
                <Text style={styles.addOnDescription}>{addOn.description}</Text>
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
              <Text style={styles.billingValue}>{subscription.nextPayment}</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Payment Method</Text>
              <Text style={styles.billingValue}>{subscription.paymentMethod}</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Total Monthly</Text>
              <Text style={styles.billingValue}>
                AED {subscription.price + subscription.addOns.reduce((sum, addOn) => sum + addOn.price, 0)}
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.contactButton} onPress={handleContactSupport}>
            <MessageCircle size={20} color="#FFFFFF" />
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
          
          {subscription.status === 'active' && (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelSubscription}>
              <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
            </TouchableOpacity>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSubscriptionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noSubscriptionText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 20,
  },
  subscribeButton: {
    backgroundColor: '#0000f0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
}); 