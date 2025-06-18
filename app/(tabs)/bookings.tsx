import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, User, Star, MessageCircle, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Sparkles } from 'lucide-react-native';

interface Booking {
  id: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'in-progress' | 'cancelled';
  service: string;
  washer: string;
  rating?: number;
  hasInteriorWash?: boolean;
}

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  const bookings: Booking[] = [
    {
      id: '1',
      date: '2024-04-30',
      time: '09:00 AM',
      status: 'upcoming',
      service: 'Exterior Wash',
      washer: 'Emmanuel',
      hasInteriorWash: true,
    },
    {
      id: '2',
      date: '2024-04-27',
      time: '10:30 AM',
      status: 'completed',
      service: 'Full Service',
      washer: 'Emmanuel',
      rating: 5,
      hasInteriorWash: true,
    },
    {
      id: '3',
      date: '2024-04-24',
      time: '08:00 AM',
      status: 'completed',
      service: 'Exterior Wash',
      washer: 'Emmanuel',
      rating: 5,
      hasInteriorWash: false,
    },
    {
      id: '4',
      date: '2024-04-21',
      time: '11:00 AM',
      status: 'completed',
      service: 'Full Service',
      washer: 'Emmanuel',
      rating: 4,
      hasInteriorWash: true,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Clock size={16} color="#F59E0B" />;
      case 'completed':
        return <CheckCircle size={16} color="#10B981" />;
      case 'in-progress':
        return <AlertCircle size={16} color="#0000f0" />;
      case 'cancelled':
        return <AlertCircle size={16} color="#EF4444" />;
      default:
        return <Clock size={16} color="#6B7280" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Scheduled';
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return '#F59E0B';
      case 'completed':
        return '#10B981';
      case 'in-progress':
        return '#0000f0';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  const upcomingBookings = bookings.filter(b => b.status === 'upcoming');
  const historyBookings = bookings.filter(b => b.status !== 'upcoming');

  const handleReschedule = (bookingId: string) => {
    console.log('Rescheduling booking:', bookingId);
  };

  const handleRate = (bookingId: string) => {
    console.log('Rating booking:', bookingId);
  };

  const handleWhatsAppSupport = () => {
    console.log('Opening WhatsApp support');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        color={i < rating ? '#F59E0B' : '#E5E5E5'}
        fill={i < rating ? '#F59E0B' : 'transparent'}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Washes</Text>
        <Text style={styles.headerSubtitle}>Track your car wash appointments</Text>
      </View>

      {/* Subscription Status */}
      <View style={styles.subscriptionCard}>
        <View style={styles.subscriptionHeader}>
          <Text style={styles.subscriptionTitle}>Premium Plan + Interior</Text>
          <View style={styles.subscriptionStatus}>
            <CheckCircle size={16} color="#10B981" />
            <Text style={styles.subscriptionStatusText}>Active</Text>
          </View>
        </View>
        <Text style={styles.subscriptionDetail}>2 Cars • Interior Deep Clean • Renews May 15, 2024</Text>
        <Text style={styles.subscriptionNext}>Next wash: Tomorrow at 9:00 AM</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'upcoming' ? (
          <View style={styles.bookingsList}>
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <View key={booking.id} style={styles.bookingCard}>
                  <View style={styles.bookingHeader}>
                    <View style={styles.bookingDate}>
                      <Calendar size={20} color="#1B365D" />
                      <Text style={styles.bookingDateText}>{formatDate(booking.date)}</Text>
                    </View>
                    <View style={styles.bookingStatus}>
                      {getStatusIcon(booking.status)}
                      <Text style={[styles.bookingStatusText, { color: getStatusColor(booking.status) }]}>
                        {getStatusText(booking.status)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.bookingDetails}>
                    <View style={styles.bookingDetail}>
                      <Clock size={16} color="#6B7280" />
                      <Text style={styles.bookingDetailText}>{booking.time}</Text>
                    </View>
                    <View style={styles.bookingDetail}>
                      <User size={16} color="#6B7280" />
                      <Text style={styles.bookingDetailText}>{booking.washer}</Text>
                    </View>
                  </View>

                  <View style={styles.serviceContainer}>
                    <Text style={styles.bookingService}>{booking.service}</Text>
                    {booking.hasInteriorWash && (
                      <View style={styles.interiorBadge}>
                        <Sparkles size={12} color="#10B981" />
                        <Text style={styles.interiorBadgeText}>Interior Clean</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.bookingActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleReschedule(booking.id)}
                    >
                      <Text style={styles.actionButtonText}>Reschedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButtonPrimary}
                      onPress={handleWhatsAppSupport}
                    >
                      <MessageCircle size={16} color="#FFFFFF" />
                      <Text style={styles.actionButtonPrimaryText}>Contact</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Calendar size={48} color="#E5E5E5" />
                <Text style={styles.emptyStateTitle}>No upcoming washes</Text>
                <Text style={styles.emptyStateText}>
                  Your next wash will appear here once scheduled
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.bookingsList}>
            {historyBookings.map((booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <View style={styles.bookingDate}>
                    <Calendar size={20} color="#1B365D" />
                    <Text style={styles.bookingDateText}>{formatDate(booking.date)}</Text>
                  </View>
                  <View style={styles.bookingStatus}>
                    {getStatusIcon(booking.status)}
                    <Text style={[styles.bookingStatusText, { color: getStatusColor(booking.status) }]}>
                      {getStatusText(booking.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.bookingDetails}>
                  <View style={styles.bookingDetail}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.bookingDetailText}>{booking.time}</Text>
                  </View>
                  <View style={styles.bookingDetail}>
                    <User size={16} color="#6B7280" />
                    <Text style={styles.bookingDetailText}>{booking.washer}</Text>
                  </View>
                </View>

                <View style={styles.serviceContainer}>
                  <Text style={styles.bookingService}>{booking.service}</Text>
                  {booking.hasInteriorWash && (
                    <View style={styles.interiorBadge}>
                      <Sparkles size={12} color="#10B981" />
                      <Text style={styles.interiorBadgeText}>Interior Clean</Text>
                    </View>
                  )}
                </View>

                {booking.rating && (
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingLabel}>Your rating:</Text>
                    <View style={styles.rating}>
                      {renderStars(booking.rating)}
                    </View>
                  </View>
                )}

                {booking.status === 'completed' && !booking.rating && (
                  <TouchableOpacity
                    style={styles.rateButton}
                    onPress={() => handleRate(booking.id)}
                  >
                    <Star size={16} color="#F59E0B" />
                    <Text style={styles.rateButtonText}>Rate this wash</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
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
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  subscriptionCard: {
    marginHorizontal: 20,
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: '#1B365D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1B365D',
  },
  subscriptionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subscriptionStatusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  subscriptionDetail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  subscriptionNext: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1B365D',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#0000f0',
  },
  content: {
    flex: 1,
  },
  bookingsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bookingDateText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0000f0',
  },
  bookingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bookingStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  bookingDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  bookingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bookingDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  serviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  bookingService: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  interiorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  interiorBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  actionButtonPrimary: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#0000f0',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  actionButtonPrimaryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  ratingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  rating: {
    flexDirection: 'row',
    gap: 2,
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  rateButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
});