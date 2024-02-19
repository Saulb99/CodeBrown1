import React, { useState, useLayoutEffect, useEffect, useRef} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard, Animated } from 'react-native';
import app from './firebaseConfig';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av'; // Import Video component
import { Ionicons } from '@expo/vector-icons'; // Using Ionicons for the eye icons


const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Added showPassword state for both fields

  const formOpacity = useRef(new Animated.Value(0)).current;  
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Simulate video finish and fade in form
  useEffect(() => {
    // Start animating the form to appear
    const timer = setTimeout(() => {
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 1000, // Adjust the duration of the fade-in effect as needed
        useNativeDriver: true,
      }).start();
    }, 2750); // Delay in milliseconds before showing the sign up information

    return () => clearTimeout(timer);
  }, [formOpacity]);


  const handleSignUp = () => {
    // Email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    // Password validation
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password should be at least 6 characters.');
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match!');
      return;
    }

    // Firebase sign-up function
    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        Alert.alert('Success', 'Account created successfully!');
        navigation.navigate('SignIn');
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };


  const handleVideoStatusUpdate = playbackStatus => {
    if (playbackStatus.didJustFinish) {
      // Video has finished playing
      setVideoFinished(true);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>      
          <Video
            source={require('./assets/Intro.mp4')}
            rate={1.0}
            volume={1.0}
            isMuted={true}
            resizeMode="cover"
            shouldPlay
            isLooping={false} // Set to false if you want the video to stop after playing once
            style={StyleSheet.absoluteFill}         
          />
        <Animated.View style={[styles.overlay, { opacity: formOpacity }]}>
        <Text style={styles.logoText}>Round Table Pizza</Text>
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ddd"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#ddd"
            secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.showPasswordButton}>
            <Ionicons 
              name={showPassword ? 'eye-off' : 'eye'} 
              size={20} 
              color="#ddd" 
          />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            placeholderTextColor="#ddd"
            secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}
            style={styles.showPasswordButton}>
            <Ionicons 
              name={showPassword ? 'eye-off' : 'eye'} 
              size={20} 
              color="#ddd" 
          />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.switchText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
        </Animated.View>
      </View>
    
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },

  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // This ensures the text is readable on top of the video
  },

  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#ddd',
  },
  input: {
    width: 300,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 15,
    color: '#ddd',
    fontSize: 14,
    
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 300,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 15,
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    color: '#ddd',
    fontSize: 14,
  },
  showPasswordButton: {
    position: 'absolute',
    right: 10,
    height: '100%', // Match the height of passwordContainer
    justifyContent: 'center', // Center the icon vertically
    paddingHorizontal: 5, // Padding inside the button for touch area
    fontSize: 14,
  },
  button: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 5,
    width: 300,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  switchText: {
    color: 'blue',
    marginTop: 20,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});

export default SignUp;
