import React from 'react';
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
import { ArrowRight, Sparkles, Shield, Clock, MapPin, Star } from 'lucide-react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const handleBookWash = () => {
    router.push('/plans');
  };

  const handleWhatsAppSupport = () => {
    console.log('Opening WhatsApp support');
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#666666" />
            <Text style={styles.locationText}>Arabian Ranches 3</Text>
          </View>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>W.</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Washy Wash</Text>
          
          {/* Featured Service Card */}
          <TouchableOpacity style={styles.featuredCard} onPress={handleBookWash}>
            <Image
              source={require('../../assets/images/CardWashy.jpg')}
              style={styles.featuredImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        {/* Service Grid */}
        <View style={styles.servicesGrid}>
          <View style={styles.servicesRow}>
            <TouchableOpacity style={styles.serviceItem} onPress={handleBookWash}>
              <View style={styles.serviceIcon}>
                <Sparkles size={24} color="#0000f0" />
              </View>
              <Text style={styles.serviceLabel}>Exterior</Text>
              <Text style={styles.serviceSubLabel}>wash</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.serviceItem} onPress={handleBookWash}>
              <View style={styles.serviceIcon}>
                <Shield size={24} color="#0000f0" />
              </View>
              <Text style={styles.serviceLabel}>Interior</Text>
              <Text style={styles.serviceSubLabel}>clean</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.serviceItem} onPress={handleBookWash}>
              <View style={styles.serviceIcon}>
                <Clock size={24} color="#0000f0" />
              </View>
              <Text style={styles.serviceLabel}>Quick</Text>
              <Text style={styles.serviceSubLabel}>service</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.serviceItem} onPress={handleBookWash}>
              <View style={styles.serviceIcon}>
                <Star size={24} color="#0000f0" />
              </View>
              <Text style={styles.serviceLabel}>Premium</Text>
              <Text style={styles.serviceSubLabel}>care</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Service Options */}
        <View style={styles.serviceOptions}>
          <TouchableOpacity style={styles.serviceOption} onPress={handleBookWash}>
            <View style={styles.serviceOptionIcon}>
              <Sparkles size={20} color="#0000f0" />
            </View>
            <View style={styles.serviceOptionContent}>
              <Text style={styles.serviceOptionTitle}>Free Trial Wash</Text>
              <Text style={styles.serviceOptionSubtitle}>First-time customers only</Text>
              <Text style={styles.serviceOptionPrice}>Free • Duration: 30-35 mins</Text>
            </View>
            <View style={styles.serviceOptionBadge}>
              <Text style={styles.serviceOptionBadgeText}>Exterior + Interior</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceOption} onPress={handleBookWash}>
            <View style={styles.serviceOptionIcon}>
              <Shield size={20} color="#0000f0" />
            </View>
            <View style={styles.serviceOptionContent}>
              <Text style={styles.serviceOptionTitle}>Exterior Wash Plan</Text>
              <Text style={styles.serviceOptionSubtitle}>Twice weekly service</Text>
              <Text style={styles.serviceOptionPrice}>From AED 160/month</Text>
            </View>
            <View style={styles.serviceOptionBadge}>
              <Text style={styles.serviceOptionBadgeText}>Subscription</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceOption} onPress={handleBookWash}>
            <View style={styles.serviceOptionIcon}>
              <Clock size={20} color="#0000f0" />
            </View>
            <View style={styles.serviceOptionContent}>
              <Text style={styles.serviceOptionTitle}>Interior & Exterior Combo</Text>
              <Text style={styles.serviceOptionSubtitle}>Complete car care</Text>
              <Text style={styles.serviceOptionPrice}>From AED 260/month</Text>
            </View>
            <View style={styles.serviceOptionBadge}>
              <Text style={styles.serviceOptionBadgeText}>Subscription</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Service Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Our Service Features</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <Clock size={24} color="#0000f0" />
              <Text style={styles.featureText}>7:00 AM - 7:00 PM</Text>
            </View>
            <View style={styles.featureItem}>
              <MapPin size={24} color="#0000f0" />
              <Text style={styles.featureText}>Arabian Ranches 3</Text>
            </View>
            <View style={styles.featureItem}>
              <Shield size={24} color="#0000f0" />
              <Text style={styles.featureText}>Same washer assigned</Text>
            </View>
            <View style={styles.featureItem}>
              <Star size={24} color="#0000f0" />
              <Text style={styles.featureText}>100% satisfaction guarantee</Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: Platform.OS === 'ios' ? 49 : 49, // Standard tab bar height
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    letterSpacing: 2,
  },
  heroSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  heroTitle: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 20,
  },
  featuredCard: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 200,
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
    justifyContent: 'space-between',
  },
  featuredTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  servicesGrid: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  servicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceItem: {
    alignItems: 'center',
    width: (width - 60) / 4,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  serviceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    textAlign: 'center',
  },
  serviceSubLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  serviceOptions: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  serviceOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceOptionContent: {
    flex: 1,
  },
  serviceOptionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginBottom: 2,
  },
  serviceOptionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  serviceOptionPrice: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999999',
  },
  serviceOptionBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  serviceOptionBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8F9FF',
    padding: 12,
    borderRadius: 12,
    flex: 1,
    minWidth: '45%',
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000000',
    flex: 1,
  },
  bottomSpacing: {
    height: 20,
  },
});