import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const LETTERS = "MecConnect".split("");

export function LoadingScreen() {
  const letterAnimations = LETTERS.map(() => useSharedValue(0));
  const logoScale = useSharedValue(0);
  const pulseAnimation = useSharedValue(0);
  const progressAnimation = useSharedValue(0);
  const dotAnimation = useSharedValue(0);

  useEffect(() => {
    // Animação inicial do logo
    logoScale.value = withSpring(1, {
      damping: 15,
      stiffness: 100,
    });

    // Animar cada letra
    letterAnimations.forEach((anim, index) => {
      anim.value = withDelay(
        300 + index * 80,
        withSpring(1, {
          damping: 12,
          stiffness: 90,
          mass: 0.8,
        })
      );
    });

    // Pulse nos círculos de fundo
    setTimeout(
      () => {
        pulseAnimation.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        );
      },
      300 + LETTERS.length * 80 + 500
    );

    // Barra de progresso
    progressAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Animação dos dots
    dotAnimation.value = withRepeat(withTiming(3, { duration: 1500, easing: Easing.linear }), -1, false);

    return () => {
      letterAnimations.forEach((anim) => cancelAnimation(anim));
      cancelAnimation(logoScale);
      cancelAnimation(pulseAnimation);
      cancelAnimation(progressAnimation);
      cancelAnimation(dotAnimation);
    };
  }, []);

  const logoContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoScale.value,
  }));

  const pulseStyle1 = useAnimatedStyle(() => ({
    opacity: interpolate(pulseAnimation.value, [0, 1], [0.08, 0.28]),
    transform: [{ scale: interpolate(pulseAnimation.value, [0, 1], [0.9, 1.35]) }],
  }));

  const pulseStyle2 = useAnimatedStyle(() => ({
    opacity: interpolate(pulseAnimation.value, [0, 1], [0.05, 0.2]),
    transform: [{ scale: interpolate(pulseAnimation.value, [0, 1], [0.95, 1.25]) }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${interpolate(progressAnimation.value, [0, 1], [30, 100])}%`,
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: letterAnimations[LETTERS.length - 1].value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#0a1a2b" />

      {/* Círculos de fundo animados */}
      <Animated.View style={[styles.pulseCircle1, pulseStyle1]} />
      <Animated.View style={[styles.pulseCircle2, pulseStyle2]} />

      {/* Container do logo */}
      <Animated.View style={[styles.logoContainer, logoContainerStyle]}>
        {/* Nome da empresa */}
        <View style={styles.letterContainer}>
          {LETTERS.map((letter, index) => {
            const animatedStyle = useAnimatedStyle(() => {
              const progress = letterAnimations[index].value;
              return {
                opacity: progress,
                transform: [
                  { translateY: interpolate(progress, [0, 1], [-40, 0]) },
                  { scale: interpolate(progress, [0, 0.5, 1], [0.3, 1.1, 1]) },
                  { rotateZ: `${interpolate(progress, [0, 1], [15, 0])}deg` },
                ],
              };
            });

            const isCapital = index === 0 || index === 3;

            return (
              <Animated.Text
                key={index}
                style={[
                  styles.letter,
                  {
                    fontSize: isCapital ? 56 : 52,
                    color: "#ffffff",
                  },
                  animatedStyle,
                ]}
              >
                {letter}
              </Animated.Text>
            );
          })}
        </View>

        {/* Tagline */}
        <Animated.View style={taglineStyle}>
          <Text style={styles.tagline}>STAY CONNECTED</Text>
        </Animated.View>

        {/* Barra de progresso */}
        <Animated.View style={[styles.progressBarContainer, taglineStyle]}>
          <Animated.View style={[styles.progressBar, progressStyle]} />
        </Animated.View>

        {/* Loading dots */}
        <Animated.View style={[styles.dotsContainer, taglineStyle]}>
          {[0, 1, 2].map((index) => {
            const dotStyle = useAnimatedStyle(() => {
              const isActive = Math.floor(dotAnimation.value) === index;
              return {
                opacity: isActive ? 1 : 0.3,
                transform: [
                  {
                    scale: isActive ? interpolate(dotAnimation.value % 1, [0, 0.5, 1], [1, 1.3, 1]) : 1,
                  },
                ],
              };
            });

            return <Animated.View key={index} style={[styles.dot, dotStyle]} />;
          })}
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a1a2b",
    alignItems: "center",
    justifyContent: "center",
  },
  pulseCircle1: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  pulseCircle2: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  letterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  letter: {
    fontWeight: "800",
    textShadowColor: "rgba(255,255,255,0.35)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 3,
  },
  progressBarContainer: {
    marginTop: 50,
    height: 3,
    width: 200,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 2,
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffffff",
  },
});
