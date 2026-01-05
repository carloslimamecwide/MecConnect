import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { View, Text } from "react-native";
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
const LINE_WIDTH = 220;

export function LoadingScreen() {
  const letterAnimations = LETTERS.map(() => useSharedValue(0));
  const lineAnimation = useSharedValue(0);
  const glowAnimation = useSharedValue(0);

  useEffect(() => {
    // Animar cada letra com delay
    letterAnimations.forEach((anim, index) => {
      anim.value = withDelay(
        index * 120,
        withSpring(1, {
          damping: 14,
          stiffness: 70,
          mass: 1,
        })
      );
    });

    // Animar linha após as letras
    lineAnimation.value = withDelay(
      LETTERS.length * 120 + 500,
      withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) }, (finished) => {
        if (finished) {
          glowAnimation.value = withRepeat(
            withSequence(
              withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
              withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
          );
        }
      })
    );

    return () => {
      letterAnimations.forEach((anim) => cancelAnimation(anim));
      cancelAnimation(lineAnimation);
      cancelAnimation(glowAnimation);
    };
  }, []);

  const lineStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(lineAnimation.value, [0, 1], [0, LINE_WIDTH]),
      opacity: lineAnimation.value,
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(glowAnimation.value, [0, 1], [0.4, 1]),
      transform: [{ scale: interpolate(glowAnimation.value, [0, 1], [0.95, 1.05]) }],
    };
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0a1a2b",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <StatusBar style="light" backgroundColor="#0a1a2b" />

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {LETTERS.map((letter, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            const progress = letterAnimations[index].value;
            return {
              opacity: progress,
              transform: [
                { translateY: interpolate(progress, [0, 1], [-60, 0]) },
                { scale: interpolate(progress, [0, 0.6, 1], [0.5, 1.15, 1]) },
              ],
            };
          });

          return (
            <Animated.View key={index} style={animatedStyle}>
              <Text
                style={{
                  fontSize: 44,
                  fontWeight: "bold",
                  color: "#ffffff",
                  letterSpacing: 2,
                  textShadowColor: "rgba(96,165,250,0.6)",
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 24,
                }}
              >
                {letter}
              </Text>
            </Animated.View>
          );
        })}
      </View>

      <Animated.View
        style={[
          {
            height: 3,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.3)",
            marginTop: 24,
            overflow: "hidden",
          },
          lineStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: "100%",
              height: "100%",
              backgroundColor: "#60a5fa",
              borderRadius: 999,
              shadowColor: "#60a5fa",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 12,
            },
            glowStyle,
          ]}
        />
      </Animated.View>
    </View>
  );
}
