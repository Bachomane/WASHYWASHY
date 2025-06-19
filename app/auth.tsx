import React, { useState } from 'react';
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
import { supabaseService } from '../lib/supabase';
import { useAuth } from '../lib/auth-context';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { setUser } = useAuth();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAuth = async () => {
    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters.');
      return;
    }
    setIsLoading(true);
    try {
      let result;
      if (isSignUp) {
        result = await supabaseService.signUpWithEmail(email, password);
      } else {
        result = await supabaseService.signInWithEmail(email, password);
      }
      const { data, error } = result;
      if (error) {
        const errMsg = (error && ((error as any).message || String(error))) || 'Authentication failed.';
        Alert.alert('Error', errMsg);
        return;
      }
      if (data && data.user) {
        if (isSignUp) {
          try {
            await supabaseService.createUser({
              id: data.user.id,
              name: email.split('@')[0],
              email: email,
              phone: '',
              address: '',
            });
          } catch (profileError) {
            console.error('Error creating user profile:', profileError);
          }
        }
        setUser(data.user);
        router.replace('/(tabs)');
      } else if (isSignUp) {
        Alert.alert('Check your email', 'A confirmation email has been sent. Please confirm your email before logging in.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
            <Text style={styles.subtitle}>
              {isSignUp
                ? 'Create a new account with your email and password.'
                : 'Sign in to your account.'}
            </Text>
            <View style={styles.emailInputContainer}>
              <TextInput
                style={styles.emailInput}
                placeholder="your.email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleAuth}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading
                  ? 'Please wait...'
                  : isSignUp
                  ? 'Sign Up'
                  : 'Sign In'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setIsSignUp((prev) => !prev)}
              disabled={isLoading}
            >
              <Text style={styles.toggleText}>
                {isSignUp
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>
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
    backgroundColor: '#000',
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  emailInputContainer: {
    marginBottom: 16,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#F8F9FF',
  },
  passwordInputContainer: {
    marginBottom: 24,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#F8F9FF',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleButton: {
    alignItems: 'center',
    marginTop: 4,
  },
  toggleText: {
    color: '#007bff',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    marginTop: 12,
  },
  footerText: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
  },
}); 