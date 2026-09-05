import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';
import { rnTokens } from '@app/core/tokens/rn-styles';

export function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.badge}>Reactant</Text>
        <Text style={styles.title}>Welcome to your new app</Text>
        <Text style={styles.body}>
          The offline-first web + native starter on a Frappe backend. The engine and chassis are wired and idling — no backend required to see this screen.
        </Text>
        <Text style={styles.hint}>Start building in apps/native/src/screens and packages/core.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: rnTokens.colors.surfaceCanvas },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: rnTokens.spacing[6],
    gap: rnTokens.spacing[3],
  },
  badge: {
    color: rnTokens.colors.primary,
    fontWeight: rnTokens.typography.weight.semibold,
    fontSize: rnTokens.typography.size.sm,
  },
  title: {
    color: rnTokens.colors.textPrimary,
    fontWeight: rnTokens.typography.weight.bold,
    fontSize: rnTokens.typography.size.xl,
    textAlign: 'center',
  },
  body: {
    color: rnTokens.colors.textSecondary,
    fontSize: rnTokens.typography.size.md,
    textAlign: 'center',
  },
  hint: {
    color: rnTokens.colors.textMuted,
    fontSize: rnTokens.typography.size.sm,
    textAlign: 'center',
  },
});
