import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ArrowLeft } from 'lucide-react-native';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How does the subscription service work?",
    answer: "Our subscription service provides two premium car washes per week at your doorstep. You can choose from our Sapphire Single (1 car), Emerald Duo (2 cars), or Diamond Deluxe (3+ cars) plans. The service is billed monthly, and you can cancel or modify your subscription at any time."
  },
  {
    question: "What areas do you service?",
    answer: "We currently service Arabian Ranches 3 in Dubai. Our team is expanding, so please contact us to check if we cover your location."
  },
  {
    question: "What products do you use?",
    answer: "We use only genuine, high-quality cleaning products and premium microfibers to ensure the best care for your vehicle. Our products are safe for all car surfaces and provide long-lasting protection."
  },
  {
    question: "How long does each wash take?",
    answer: "A standard exterior wash takes approximately 25-30 minutes. If you've added the interior cleaning service, it may take an additional 10-15 minutes, depending on the size of your vehicle."
  },
  {
    question: "Can I schedule specific wash times?",
    answer: "We offer two convenient wash schedules: Monday & Thursday, Tuesday & Friday, or Wednesday & Saturday. If these options don't fit your needs, let us know— we're happy to work out a custom schedule for you."
  },
  {
    question: "What if I need to skip a wash?",
    answer: "If you miss a scheduled wash, you'll need to wait for your next one, which is usually 3 days later. If you let us know in advance, we might be able to find another time for you, but we can't guarantee it."
  }
];

export default function FAQScreen() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const router = useRouter();

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "FAQ",
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
            <Text style={styles.headerTitle}>FAQ</Text>
          ),
        }}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Washy Member's Questions</Text>
          <Text style={styles.subtitle}>Everything you need to know about our premium car wash service</Text>
        </View>

        <View style={styles.faqContainer}>
          {faqData.map((faq, index) => (
            <TouchableOpacity
              key={index}
              style={styles.faqItem}
              onPress={() => toggleFAQ(index)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.question}>{faq.question}</Text>
                <Ionicons
                  name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="#666"
                />
              </View>
              {expandedIndex === index && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answer}>{faq.answer}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  faqContainer: {
    padding: 16,
  },
  faqItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  answerContainer: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#fafafa',
  },
  answer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
}); 