import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import auth from '@react-native-firebase/auth';

export default function AuthScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<any>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const otpInputRef = useRef<TextInput>(null);

  // UAE phone number validation
  const isValidUAENumber = (number: string) => {
    // UAE mobile numbers start with 5 and are 9 digits long
    const uaeNumberRegex = /^5[0-9]{8}$/;
    return uaeNumberRegex.test(number);
  };

  const formatPhoneNumber = (number: string) => {
    // Remove any non-digit characters
    const cleaned = number.replace(/\D/g, '');
    // Limit to 9 digits
    return cleaned.slice(0, 9);
  };

  const handlePhoneNumberChange = (text: string) => {
    const formattedNumber = formatPhoneNumber(text);
    setPhoneNumber(formattedNumber);
  };

  const handleSendOtp = async () => {
    if (!isValidUAENumber(phoneNumber)) {
      Alert.alert(
        'Invalid Phone Number',
        'Please enter a valid UAE mobile number starting with 5 followed by 8 digits.'
      );
      return;
    }

    setIsLoading(true);
    try {
      // Format the phone number with UAE country code
      const formattedPhoneNumber = '+971' + phoneNumber;
      
      // Send OTP using Firebase
      const confirmation = await auth().signInWithPhoneNumber(formattedPhoneNumber);
      setConfirmation(confirmation);
      setShowOtpInput(true);
    } catch (error: any) {
      let errorMessage = 'Failed to send verification code. Please try again.';
      
      // Handle specific Firebase error codes
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'The phone number format is invalid.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert(
        'Invalid OTP',
        'Please enter the 6-digit verification code.'
      );
      return;
    }

    setIsLoading(true);
    try {
      // Verify OTP using Firebase
      await confirmation.confirm(otp);
      
      // If successful, navigate to the main app
      router.replace('/(tabs)');
    } catch (error: any) {
      let errorMessage = 'Invalid verification code. Please try again.';
      
      // Handle specific Firebase error codes
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'The verification code is invalid.';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'The verification code has expired. Please request a new one.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto focus the phone input when the screen loads
    if (!showOtpInput) {
      phoneInputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    // Auto focus the OTP input when switching to OTP view
    if (showOtpInput) {
      otpInputRef.current?.focus();
    }
  }, [showOtpInput]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.content}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.logoText}>W.</Text>
            <Text style={styles.welcomeTitle}>Welcome to Washy.ae</Text>
            <Text style={styles.welcomeSubtitle}>
              Your premium car wash experience starts here
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>
              {showOtpInput ? 'Enter OTP' : 'Enter your phone number'}
            </Text>
            <Text style={styles.subtitle}>
              {showOtpInput 
                ? 'We\'ve sent a verification code to your phone'
                : 'We\'ll send you a verification code to get started'
              }
            </Text>

            {!showOtpInput ? (
              <View style={styles.phoneInputContainer}>
                <Text style={styles.countryCode}>+971</Text>
                <TextInput
                  ref={phoneInputRef}
                  style={styles.phoneInput}
                  placeholder="50 123 4567"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={handlePhoneNumberChange}
                  maxLength={9}
                />
              </View>
            ) : (
              <View style={styles.otpContainer}>
                <TextInput
                  ref={otpInputRef}
                  style={styles.otpInput}
                  placeholder="Enter 6-digit code"
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                  maxLength={6}
                />
              </View>
            )}

            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={showOtpInput ? handleVerifyOtp : handleSendOtp}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading 
                  ? 'Please wait...' 
                  : showOtpInput 
                    ? 'Verify' 
                    : 'Send Code'
                }
              </Text>
            </TouchableOpacity>

            {showOtpInput && (
              <TouchableOpacity 
                style={styles.resendButton}
                onPress={handleSendOtp}
                disabled={isLoading}
              >
                <Text style={styles.resendText}>Resend Code</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#0000f0',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeTitle: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 32,
    textAlign: 'center',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 24,
    backgroundColor: '#F8F9FF',
  },
  countryCode: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#000000',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  otpContainer: {
    marginBottom: 24,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    backgroundColor: '#F8F9FF',
  },
  button: {
    backgroundColor: '#0000f0',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0000f0',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  resendButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#0000f0',
  },
  footer: {
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
}); 