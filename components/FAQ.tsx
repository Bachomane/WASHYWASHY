import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ChevronDown, ChevronRight, MessageCircle } from 'lucide-react-native';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQProps {
  onContactSupport: () => void;
}

export default function FAQ({ onContactSupport }: FAQProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'How often do you wash my car?',
      answer: 'We provide professional car washing service twice a week as part of our subscription plans. You can choose specific days that work best for your schedule.',
    },
    {
      id: '2',
      question: 'What areas do you service?',
      answer: 'Currently, we operate in Arabian Ranches 3, Dubai. We are planning to expand to more areas soon. Contact us if you\'d like to know when we\'ll be available in your area.',
    },
    {
      id: '3',
      question: 'What\'s included in the wash service?',
      answer: 'Our exterior wash includes pressure washing, soap cannon treatment, and premium microfiber towel drying. Full service includes interior cleaning, dashboard wipe, and tire shine.',
    },
    {
      id: '4',
      question: 'Can I reschedule my wash appointment?',
      answer: 'Yes, you can reschedule your appointment up to 12 hours in advance through the app or by contacting us on WhatsApp. We\'ll do our best to accommodate your preferred time.',
    },
    {
      id: '5',
      question: 'What if I\'m not satisfied with the service?',
      answer: 'Your satisfaction is our priority. If you\'re not happy with any wash, contact us immediately and we\'ll return to re-wash your car at no extra charge.',
    },
    {
      id: '6',
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel your subscription anytime through the app settings or by contacting support. There are no cancellation fees, and you can reactivate whenever you want.',
    },
    {
      id: '7',
      question: 'Do you work in all weather conditions?',
      answer: 'We work in most weather conditions. However, for safety reasons, we may reschedule during extreme weather like heavy rain or sandstorms. We\'ll notify you in advance.',
    },
    {
      id: '8',
      question: 'What products do you use?',
      answer: 'We use premium car care products and professional-grade microfiber towels. All our products are car-safe and environmentally friendly.',
    },
  ];

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isExpanded = (itemId: string) => expandedItems.includes(itemId);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Frequently Asked Questions</Text>
        <Text style={styles.subtitle}>
          Find answers to common questions about our service
        </Text>
      </View>

      <View style={styles.faqList}>
        {faqData.map((item) => (
          <View key={item.id} style={styles.faqItem}>
            <TouchableOpacity
              style={styles.questionContainer}
              onPress={() => toggleExpand(item.id)}
            >
              <Text style={styles.question}>{item.question}</Text>
              {isExpanded(item.id) ? (
                <ChevronDown size={20} color="#1B365D" />
              ) : (
                <ChevronRight size={20} color="#1B365D" />
              )}
            </TouchableOpacity>

            {isExpanded(item.id) && (
              <View style={styles.answerContainer}>
                <Text style={styles.answer}>{item.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>Didn't find your answer?</Text>
        <Text style={styles.contactDescription}>
          Our support team is here to help you with any questions
        </Text>
        <TouchableOpacity style={styles.contactButton} onPress={onContactSupport}>
          <MessageCircle size={20} color="#FFFFFF" />
          <Text style={styles.contactButtonText}>Contact Support</Text>
        </TouchableOpacity>
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
  faqList: {
    paddingHorizontal: 20,
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  question: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1B365D',
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  answer: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 22,
  },
  contactSection: {
    margin: 20,
    backgroundColor: '#F8FAFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F4FD',
  },
  contactTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1B365D',
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});