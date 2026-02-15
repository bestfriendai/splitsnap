import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radius, fontSize, fontWeight } from '../src/theme';
import { setOnboardingComplete } from '../src/services/storage';

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: '📷',
    title: 'Scan Receipts',
    subtitle: 'Point your camera at any receipt. AI extracts items and amounts instantly.',
  },
  {
    icon: '÷',
    title: 'Split Instantly',
    subtitle: 'Select who had what. Split by item, percentage, or custom amounts.',
  },
  {
    icon: '💸',
    title: 'Settle Up',
    subtitle: 'Track balances with friends. Know who owes what, anytime.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<any>(null);

  const handleNext = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await setOnboardingComplete();
      router.replace('/(tabs)');
    }
  };

  const handleSkip = async () => {
    await setOnboardingComplete();
    router.replace('/(tabs)');
  };

  const renderSlide = ({ item, index }: { item: typeof slides[0]; index: number }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <View style={styles.slidesContainer}>
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{slide.icon}</Text>
            </View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.subtitle}>{slide.subtitle}</Text>
          </View>
        ))}
      </View>

      {/* Pagination */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.dot,
              index === currentIndex && styles.dotActive
            ]} 
          />
        ))}
      </View>

      {/* CTA Button */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity style={styles.ctaButton} onPress={handleNext}>
          <Text style={styles.ctaText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.xxl + spacing.xl,
  },
  skipButton: {
    position: 'absolute',
    top: spacing.xxl + spacing.md,
    right: spacing.lg,
    zIndex: 10,
    padding: spacing.sm,
  },
  skipText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
  slidesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  slide: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  icon: {
    fontSize: 56,
  },
  title: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: fontSize.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.brand,
  },
  ctaContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  ctaButton: {
    backgroundColor: colors.brand,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: '#FFFFFF',
  },
});
