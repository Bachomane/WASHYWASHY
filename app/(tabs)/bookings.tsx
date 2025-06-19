import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, User, Star, MessageCircle, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Sparkles } from 'lucide-react-native';
import { useAuth } from '../../lib/auth-context';
import { supabaseService } from '../../lib/supabase';

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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load bookings from Supabase on mount
  useEffect(() => {
    if (user?.id) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data: bookingsData, error } = await supabaseService.getBookings(user.id);
      if (error) {
        console.error('Error loading bookings:', error);
        Alert.alert('Error', 'Failed to load bookings. Please try again.');
        return;
      }
      
      if (bookingsData) {
        // Convert Supabase data to local format
        const localBookings: Booking[] = bookingsData.map((booking: any) => ({
          id: booking.id,
          date: booking.date,
          time: booking.time,
          status: booking.status,
          service: booking.service,
          washer: booking.washer,
          rating: booking.rating,
          hasInteriorWash: booking.has_interior_wash,
        }));
        setBookings(localBookings);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      Alert.alert('Error', 'Failed to load bookings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
    Alert.alert(
      'Reschedule Booking',
      'Contact us via WhatsApp to reschedule your booking.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Contact WhatsApp', 
          onPress: () => {
            const phoneNumber = '971568565888';
            const message = `Hi! I need to reschedule my booking (ID: ${bookingId}).`;
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            Linking.openURL(whatsappUrl);
          }
        }
      ]
    );
  };

  const handleCancel = (bookingId: string) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: async () => {
            setIsUpdating(true);
            try {
              const { error } = await supabaseService.cancelBooking(bookingId);
              if (error) {
                console.error('Error cancelling booking:', error);
                Alert.alert('Error', 'Failed to cancel booking. Please try again.');
                return;
              }
              
              // Update local state
              setBookings(bookings.map(booking => 
                booking.id === bookingId 
                  ? { ...booking, status: 'cancelled' as const }
                  : booking
              ));
              Alert.alert('Booking Cancelled', 'Your booking has been cancelled successfully.');
            } catch (error) {
              console.error('Error cancelling booking:', error);
              Alert.alert('Error', 'Failed to cancel booking. Please try again.');
            } finally {
              setIsUpdating(false);
            }
          }
        }
      ]
    );
  };

  const handleRate = (bookingId: string) => {
    Alert.alert(
      'Rate Service',
      'How would you rate your car wash experience?',
      [
        { text: '1 Star', onPress: () => submitRating(bookingId, 1) },
        { text: '2 Stars', onPress: () => submitRating(bookingId, 2) },
        { text: '3 Stars', onPress: () => submitRating(bookingId, 3) },
        { text: '4 Stars', onPress: () => submitRating(bookingId, 4) },
        { text: '5 Stars', onPress: () => submitRating(bookingId, 5) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const submitRating = async (bookingId: string, rating: number) => {
    setIsUpdating(true);
    try {
      const { error } = await supabaseService.updateBooking(bookingId, {
        rating: rating,
      });
      
      if (error) {
        console.error('Error submitting rating:', error);
        Alert.alert('Error', 'Failed to submit rating. Please try again.');
        return;
      }
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, rating }
          : booking
      ));
      Alert.alert('Thank You!', `Thank you for your ${rating}-star rating!`);
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert('Error', 'Failed to submit rating. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleWhatsAppSupport = () => {
    const phoneNumber = '971568565888';
    const message = 'Hi! I need help with my Washy.ae booking.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    Linking.openURL(whatsappUrl).catch((err) => {
      console.error('Error opening WhatsApp:', err);
      Alert.alert('Error', 'Could not open WhatsApp. Please make sure WhatsApp is installed.');
    });
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

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      ) : (
        <>
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
                          style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
                          onPress={() => handleCancel(booking.id)}
                        >
                          <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>Cancel</Text>
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
        </>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
});