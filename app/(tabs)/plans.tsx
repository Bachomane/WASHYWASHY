import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import { Check, ArrowRight, Star, Plus, Sparkles, X } from 'lucide-react-native';
import { router } from 'expo-router';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  cars: string;
  popular?: boolean;
  features: PlanFeature[];
  description: string;
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ReactNode;
}

export default function PlansScreen() {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [showServiceModal, setShowServiceModal] = useState(false);

  const plans: Plan[] = [
    {
      id: 'sapphire-single',
      name: 'Sapphire Single',
      price: 160,
      cars: '1 Car',
      description: 'Premium care for a single ride, flawless shine every time!',
      features: [
        { text: 'Exterior wash twice weekly', included: true },
        { text: 'High-pressure pre-rinse', included: true },
        { text: 'Foam cannon snow application', included: true },
        { text: 'Hand wash with microfiber mitts', included: true },
        { text: 'Wheel and rim wipe', included: true },
        { text: 'Final microfiber towel dry', included: true },
        { text: 'Same washer assigned (Emmanuel)', included: true },
        { text: 'WhatsApp updates & reminders', included: true },
      ],
    },
    {
      id: 'emerald-duo',
      name: 'Emerald Duo',
      price: 220,
      cars: '2 Cars',
      popular: true,
      description: 'Double the cars, double the shine! Premium care for your duo!',
      features: [
        { text: 'Exterior wash twice weekly', included: true },
        { text: 'High-pressure pre-rinse', included: true },
        { text: 'Foam cannon snow application', included: true },
        { text: 'Hand wash with microfiber mitts', included: true },
        { text: 'Wheel and rim wipe', included: true },
        { text: 'Final microfiber towel dry', included: true },
        { text: 'Same washer assigned (Emmanuel)', included: true },
        { text: 'WhatsApp updates & reminders', included: true },
      ],
    },
    {
      id: 'diamond-deluxe',
      name: 'Diamond Deluxe',
      price: 260,
      cars: '3+ Cars',
      description: 'Luxury care for 3+ cars because every vehicle deserves a diamond standard shine!',
      features: [
        { text: 'Exterior wash twice weekly', included: true },
        { text: 'High-pressure pre-rinse', included: true },
        { text: 'Foam cannon snow application', included: true },
        { text: 'Hand wash with microfiber mitts', included: true },
        { text: 'Wheel and rim wipe', included: true },
        { text: 'Final microfiber towel dry', included: true },
        { text: 'Same washer assigned (Emmanuel)', included: true },
        { text: 'WhatsApp updates & reminders', included: true },
      ],
    },
  ];

  const addOns: AddOn[] = [
    {
      id: 'interior-single',
      name: 'Interior Single',
      description: 'Complete interior cleaning including dashboard wipe, vacuuming, glass cleaning, and door panel cleaning.',
      price: 100,
      icon: <Sparkles size={24} color="#0000f0" />,
    },
    {
      id: 'interior-duo',
      name: 'Interior Duo',
      description: 'Complete interior cleaning for two cars, including all interior surfaces and vacuuming.',
      price: 135,
      icon: <Sparkles size={24} color="#0000f0" />,
    },
    {
      id: 'interior-deluxe',
      name: 'Interior Deluxe',
      description: 'Premium interior cleaning for three cars, maintaining pristine cabin conditions.',
      price: 165,
      icon: <Sparkles size={24} color="#0000f0" />,
    },
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setSelectedAddOns([]);
  };

  const handleToggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const calculateTotalPrice = () => {
    const selectedPlanPrice = plans.find(plan => plan.id === selectedPlan)?.price || 0;
    const addOnPrice = selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find(a => a.id === addOnId);
      return total + (addOn?.price || 0);
    }, 0);
    return selectedPlanPrice + addOnPrice;
  };

  const handleSubscribe = () => {
    router.push('/bookings');
  };

  const handleTrial = () => {
    setShowServiceModal(true);
  };

  const ServiceModal = () => (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <TouchableOpacity 
          style={styles.modalClose}
          onPress={() => setShowServiceModal(false)}
        >
          <X size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.modalBadge}>
            <Text style={styles.modalBadgeText}>Free Trial Wash</Text>
          </View>
          
          <Video
            source={require('../../assets/images/Trial Wash.mp4')}
            style={styles.modalVideo}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            isLooping
            shouldPlay
          />
          
          <View style={styles.modalInfo}>
            <Text style={styles.modalTitle}>Trial Wash</Text>
            <Text style={styles.modalPrice}>Free • Duration: 30-35 mins</Text>
            
            <View style={styles.modalNotice}>
              <Text style={styles.modalNoticeText}>
                🅿️ Currently available in Arabian Ranches 3 only
              </Text>
            </View>
            
            <View style={styles.modalFeatures}>
              <Text style={styles.modalFeature}>• High-pressure pre-rinse</Text>
              <Text style={styles.modalFeature}>• Foam cannon application</Text>
              <Text style={styles.modalFeature}>• Gentle microfiber hand wash</Text>
              <Text style={styles.modalFeature}>• Rinse and water spot prevention</Text>
              <Text style={styles.modalFeature}>• Tire and rim wipe</Text>
              <Text style={styles.modalFeature}>• Final microfiber towel dry</Text>
              <Text style={styles.modalFeature}>• Quick visual inspection</Text>
            </View>

            <View style={styles.modalNotice}>
              <Text style={styles.modalNoticeText}>
                ⚠️ Limited to first-time customers only
              </Text>
              <Text style={styles.modalNoticeText}>
                ⚠️ One trial per household
              </Text>
              <Text style={styles.modalNoticeText}>
                ⚠️ Not available on Sundays
              </Text>
            </View>
            
            <TouchableOpacity style={styles.modalBookButton} onPress={() => setShowServiceModal(false)}>
              <Text style={styles.modalBookButtonText}>Book Trial</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );

  const getInteriorAddOns = () => {
    switch (selectedPlan) {
      case 'sapphire-single':
        return [addOns[0]]; // Interior Single
      case 'emerald-duo':
        return [addOns[1]]; // Interior Duo
      case 'diamond-deluxe':
        return [addOns[2]]; // Interior Deluxe
      default:
        return [];
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Choose Your Plan</Text>
          <Text style={styles.headerSubtitle}>
            Select the perfect washing plan for your needs
          </Text>
        </View>

        {/* Trial Option */}
        <View style={styles.trialSection}>
          <View style={styles.trialCard}>
            <Text style={styles.trialTitle}>Try Before You Subscribe</Text>
            <Text style={styles.trialDescription}>
              Book a one-time wash to experience our premium service
            </Text>
            <TouchableOpacity style={styles.trialButton} onPress={handleTrial}>
              <Text style={styles.trialButtonText}>Book Trial Wash</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Plans */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Subscription Plans</Text>
          <View style={styles.plansContainer}>
            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.planCardSelected,
                ]}
                onPress={() => handleSelectPlan(plan.id)}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>Most Popular</Text>
                  </View>
                )}
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planPrice}>AED {plan.price}/month</Text>
                  <Text style={styles.planCars}>{plan.cars}</Text>
                </View>
                <Text style={styles.planDescription}>{plan.description}</Text>
                <View style={styles.planFeatures}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.planFeature}>
                      <Check
                        size={16}
                        color={feature.included ? '#0000f0' : '#CCCCCC'}
                      />
                      <Text
                        style={[
                          styles.featureText,
                          !feature.included && styles.featureTextDisabled,
                        ]}
                      >
                        {feature.text}
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add-ons */}
        {selectedPlan && (
          <View style={styles.addOnsSection}>
            <Text style={styles.sectionTitle}>Add Interior Cleaning</Text>
            {getInteriorAddOns().map((addOn) => (
              <TouchableOpacity
                key={addOn.id}
                style={[
                  styles.addOnCard,
                  selectedAddOns.includes(addOn.id) && styles.addOnCardSelected,
                ]}
                onPress={() => handleToggleAddOn(addOn.id)}
              >
                <View style={styles.addOnIcon}>{addOn.icon}</View>
                <View style={styles.addOnContent}>
                  <Text style={styles.addOnName}>{addOn.name}</Text>
                  <Text style={styles.addOnDescription}>
                    {addOn.description}
                  </Text>
                  <Text style={styles.addOnPrice}>AED {addOn.price}/month</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Your Plan Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {plans.find(p => p.id === selectedPlan)?.name} Plan
              </Text>
              <Text style={styles.summaryPrice}>
                AED {plans.find(p => p.id === selectedPlan)?.price}
              </Text>
            </View>

            {selectedAddOns.map(addOnId => {
              const addOn = addOns.find(a => a.id === addOnId);
              return addOn ? (
                <View key={addOnId} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{addOn.name}</Text>
                  <Text style={styles.summaryPrice}>AED {addOn.price}</Text>
                </View>
              ) : null;
            })}

            <View style={styles.summaryDivider} />
            
            <View style={styles.summaryTotal}>
              <Text style={styles.summaryTotalLabel}>Total Monthly</Text>
              <Text style={styles.summaryTotalPrice}>AED {calculateTotalPrice()}</Text>
            </View>
          </View>
        </View>

        {/* Subscribe Button */}
        <View style={styles.subscribeSection}>
          <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
            <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Text style={styles.subscribeNote}>
            No commitment • Cancel anytime • First wash within 48 hours
          </Text>
        </View>
      </ScrollView>

      {showServiceModal && <ServiceModal />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingBottom: Platform.OS === 'ios' ? 90 : 70,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 80 : 40,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  trialSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  trialCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
  },
  trialTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginBottom: 8,
  },
  trialDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 16,
  },
  trialButton: {
    backgroundColor: '#0000f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  trialButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  plansSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  plansContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#0000f0',
    backgroundColor: '#F8F9FF',
  },
  planCardPopular: {
    borderColor: '#F59E0B',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  popularBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  planHeader: {
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  planCars: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  planDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 16,
    lineHeight: 20,
  },
  planPricing: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#0000f0',
    marginBottom: 8,
  },
  planPeriod: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  planFeatures: {
    marginBottom: 20,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    flex: 1,
  },
  featureTextDisabled: {
    color: '#CCCCCC',
  },
  addOnsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  addOnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  addOnCardSelected: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  addOnIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addOnContent: {
    flex: 1,
  },
  addOnName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginBottom: 4,
  },
  addOnDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  addOnPrice: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0000f0',
  },
  summarySection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  summaryCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  summaryPrice: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 16,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
  },
  summaryTotalPrice: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#0000f0',
  },
  subscribeSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  subscribeButton: {
    backgroundColor: '#0000f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  subscribeNote: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
    backgroundColor: '#0000f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  modalBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  modalVideo: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalInfo: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 8,
  },
  modalPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 16,
  },
  modalNotice: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalNoticeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#856404',
  },
  modalFeatures: {
    marginBottom: 24,
  },
  modalFeature: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  modalBookButton: {
    backgroundColor: '#00D4AA',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBookButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});