import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Linking } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function TermsScreen() {
  const router = useRouter();

  const handleContactEmail = () => {
    Linking.openURL('mailto:support@washy.ae');
  };

  const handleContactPhone = () => {
    Linking.openURL('tel:+971568565888');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Terms and Conditions",
          headerShown: true,
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace('/(tabs)/profile')} style={styles.backButton}>
              <ArrowLeft size={24} color="#000000" />
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <Text style={styles.headerTitle}>Terms and Conditions</Text>
          ),
        }}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome to Washy.ae!</Text>
            <Text style={styles.welcomeText}>
              These Terms & Conditions govern your use of our application and services.
            </Text>
            <Text style={styles.welcomeText}>
              By accessing or using our services, you agree to comply with these terms.
            </Text>
            <Text style={styles.welcomeText}>
              If you do not agree, please refrain from using our platform.
            </Text>
          </View>

          {/* 1. Definitions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Definitions</Text>
            <Text style={styles.definitionText}>
              <Text style={styles.bold}>"Company," "We," "Our," or "Us"</Text> refers to Washy.ae, a car wash service provider based in Dubai.
            </Text>
            <Text style={styles.definitionText}>
              <Text style={styles.bold}>"You," "User," or "Customer"</Text> refers to any individual or entity accessing our website or booking our services.
            </Text>
            <Text style={styles.definitionText}>
              <Text style={styles.bold}>"Services"</Text> refer to all offerings provided by Washy.ae, including car wash subscriptions and related solutions.
            </Text>
          </View>

          {/* 2. Use of Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Use of Services</Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• You must be at least 18 years old or have parental consent to use our services.</Text>
              <Text style={styles.bulletPoint}>• Our services are provided exclusively on a monthly subscription basis.</Text>
              <Text style={styles.bulletPoint}>• We offer a free trial wash for new customers who want to experience our service quality before committing to a subscription.</Text>
              <Text style={styles.bulletPoint}>• By subscribing to our service, you confirm that the vehicle is accessible and in a condition suitable for cleaning.</Text>
              <Text style={styles.bulletPoint}>• Washy.ae reserves the right to refuse service if a vehicle is deemed hazardous or if conditions prevent proper cleaning.</Text>
            </View>
          </View>

          {/* 3. Payments & Subscription Plans */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Payments & Subscription Plans</Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• All payments must be made in AED (United Arab Emirates Dirham).</Text>
              <Text style={styles.bulletPoint}>• We accept credit/debit cards and online payment methods.</Text>
              <Text style={styles.bulletPoint}>• Subscriptions are billed monthly, with payment links sent to clients after the completion of services for that month.</Text>
              <Text style={styles.bulletPoint}>• Payment is due upon receipt of the payment link.</Text>
              <Text style={styles.bulletPoint}>• Failure to make timely payments may result in the suspension or cancellation of services.</Text>
              <Text style={styles.bulletPoint}>• For 6-month and 12-month subscription plans, no refunds will be provided except in cases where the fault lies with Washy.ae's service delivery or operational issues.</Text>
            </View>
          </View>

          {/* 4. Service Schedule & Cancellation Policy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Service Schedule & Cancellation Policy</Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• Each client is assigned a specific time slot for their car wash service.</Text>
              <Text style={styles.bulletPoint}>• If the vehicle is not available at the designated time, our team will wait for 5 minutes before moving to the next client.</Text>
              <Text style={styles.bulletPoint}>• If the vehicle is not available, we will attempt one more visit later that day.</Text>
              <Text style={styles.bulletPoint}>• If the vehicle is still not available after two attempts, the wash will be considered canceled for that day.</Text>
              <Text style={styles.bulletPoint}>• No cancellation fees are charged, but we expect clients to be available during their designated time slot.</Text>
            </View>
          </View>

          {/* 5. Liability & Service Guarantee */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Liability & Service Guarantee</Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• Washy.ae is not liable for any damages that may occur to the vehicle during or after the cleaning process.</Text>
              <Text style={styles.bulletPoint}>• While we are confident in the quality of our services and products used, we do not accept liability for any claims of damage.</Text>
              <Text style={styles.bulletPoint}>• We do not take responsibility for valuables left inside the vehicle during the cleaning process.</Text>
              <Text style={styles.bulletPoint}>• If you are not satisfied with the quality of the wash, please contact us immediately via WhatsApp, and we will reschedule a new wash as soon as possible to address the issue.</Text>
            </View>
          </View>

          {/* 6. Privacy & Data Protection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Privacy & Data Protection</Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• Your personal information is collected and stored securely as per our Privacy Policy.</Text>
              <Text style={styles.bulletPoint}>• We do not share or sell customer data to third parties without consent.</Text>
              <Text style={styles.bulletPoint}>• Users may request the deletion of their personal data by contacting support.</Text>
            </View>
          </View>

          {/* 7. Modifications & Termination */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Modifications & Termination</Text>
            <Text style={styles.bodyText}>
              Washy.ae reserves the right to modify these Terms & Conditions at any time. Continued use of our services constitutes acceptance of the revised terms.
            </Text>
          </View>

          {/* 8. Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Contact Information</Text>
            <Text style={styles.bodyText}>
              If you have any questions about these Terms & Conditions, please contact us at:
            </Text>
            <View style={styles.contactInfo}>
              <TouchableOpacity onPress={handleContactEmail}>
                <Text style={styles.contactLink}>Email: support@washy.ae</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleContactPhone}>
                <Text style={styles.contactLink}>Phone: +971 56 856 5888</Text>
              </TouchableOpacity>
              <Text style={styles.contactText}>Address: Arabian Ranches 3, Dubai, UAE</Text>
            </View>
          </View>

          {/* 9. Mobile App Specific Terms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Mobile Application Terms</Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• The Washy mobile application is available for download on iOS and Android devices.</Text>
              <Text style={styles.bulletPoint}>• You must download the app from official app stores (Apple App Store or Google Play Store).</Text>
              <Text style={styles.bulletPoint}>• The app requires location permissions to provide accurate service delivery to your address.</Text>
              <Text style={styles.bulletPoint}>• Push notifications are used to send booking confirmations, service reminders, and updates.</Text>
              <Text style={styles.bulletPoint}>• Camera permissions may be requested for profile picture uploads and vehicle documentation.</Text>
              <Text style={styles.bulletPoint}>• The app may cache data locally on your device for improved performance.</Text>
            </View>
          </View>

          {/* 10. Device Requirements & Compatibility */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Device Requirements & Compatibility</Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• iOS 12.0 or later for Apple devices.</Text>
              <Text style={styles.bulletPoint}>• Android 8.0 (API level 26) or later for Android devices.</Text>
              <Text style={styles.bulletPoint}>• Active internet connection (Wi-Fi or mobile data) required for full functionality.</Text>
              <Text style={styles.bulletPoint}>• We are not responsible for compatibility issues with modified or jailbroken devices.</Text>
              <Text style={styles.bulletPoint}>• App updates may be required for continued service access.</Text>
            </View>
          </View>

          {/* 11. App Permissions & Data Access */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. App Permissions & Data Access</Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Location Services:</Text> Required to verify service areas and provide accurate delivery.</Text>
              <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Camera:</Text> Optional, for profile pictures and vehicle photos.</Text>
              <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Photo Library:</Text> Optional, for selecting profile pictures.</Text>
              <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Notifications:</Text> For booking updates, service reminders, and promotional offers.</Text>
              <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Contacts:</Text> May be requested for emergency contact features.</Text>
              <Text style={styles.bulletPoint}>• You can manage these permissions through your device settings at any time.</Text>
            </View>
          </View>

          {/* 12. In-App Purchases & Subscriptions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>12. In-App Purchases & Subscriptions</Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• All subscription purchases are processed through the app stores (Apple App Store or Google Play).</Text>
              <Text style={styles.bulletPoint}>• Subscription renewals are automatic unless cancelled before the renewal date.</Text>
              <Text style={styles.bulletPoint}>• Refunds for in-app purchases are subject to the app store's refund policy.</Text>
              <Text style={styles.bulletPoint}>• You can manage your subscription through your device's subscription settings.</Text>
              <Text style={styles.bulletPoint}>• Prices may vary by region and are subject to applicable taxes.</Text>
            </View>
          </View>

          {/* 13. Offline Functionality */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>13. Offline Functionality</Text>
            <Text style={styles.bodyText}>
              While some app features may work offline, booking services, payment processing, and real-time updates require an active internet connection. Cached data may be available for viewing but cannot be modified without connectivity.
            </Text>
          </View>

          {/* 14. App Updates & Maintenance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>14. App Updates & Maintenance</Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• We may release updates to improve functionality, security, and user experience.</Text>
              <Text style={styles.bulletPoint}>• Some updates may be mandatory for continued service access.</Text>
              <Text style={styles.bulletPoint}>• Scheduled maintenance may temporarily limit app functionality.</Text>
              <Text style={styles.bulletPoint}>• We will provide advance notice of major updates or maintenance windows when possible.</Text>
            </View>
          </View>

          {/* 15. Third-Party Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>15. Third-Party Services</Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• The app may integrate with third-party services for payments, maps, and analytics.</Text>
              <Text style={styles.bulletPoint}>• These services have their own terms and privacy policies.</Text>
              <Text style={styles.bulletPoint}>• We are not responsible for the performance or policies of third-party services.</Text>
              <Text style={styles.bulletPoint}>• Payment processing is handled by secure, certified payment providers.</Text>
            </View>
          </View>

          {/* 16. Intellectual Property & App Store Compliance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>16. Intellectual Property & App Store Compliance</Text>
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• The Washy app and its content are protected by intellectual property laws.</Text>
              <Text style={styles.bulletPoint}>• You may not reverse engineer, modify, or distribute the app.</Text>
              <Text style={styles.bulletPoint}>• The app complies with Apple App Store and Google Play Store guidelines.</Text>
              <Text style={styles.bulletPoint}>• Violation of app store terms may result in removal from the platform.</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© Copyright 2025 - Washy.ae All Rights Reserved.</Text>
            <Text style={styles.footerText}>Last Updated: January 2025</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: Platform.OS === 'ios' ? 20 : 15,
  },
  content: {
    padding: 20,
  },
  welcomeSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 12,
  },
  definitionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  bold: {
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  bulletPoints: {
    marginTop: 8,
  },
  bulletPoint: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
    lineHeight: 20,
  },
  contactInfo: {
    marginTop: 12,
  },
  contactLink: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#0000f0',
    lineHeight: 20,
    marginBottom: 4,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
    lineHeight: 20,
    marginBottom: 4,
  },
  footer: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
}); 