import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/theme';
import { formatKarmaDelta, getRelativeTime } from '@/lib/karma';
import { EmptyState } from '@/components/EmptyState';

export default function KarmaWallet() {
  const currentUser = useAppStore((state) => state.currentUser);
  const karmaLedger = useAppStore((state) => state.karmaLedger);
  const userLedger = karmaLedger.filter((tx) => tx.userId === currentUser?.id);

  const renderTransactionItem = ({ item }: { item: typeof userLedger[0] }) => {
    const isPositive = item.delta > 0;
    const isNegative = item.delta < 0;

    let iconName: keyof typeof Ionicons.glyphMap = 'help-circle-outline';
    let iconColor: string = Colors.textSecondary;
    let deltaColor: string = Colors.text;

    if (item.type === 'welcome_bonus') {
      iconName = 'gift';
      iconColor = Colors.primary;
      deltaColor = Colors.primary;
    } else if (isPositive) {
      iconName = 'arrow-down'; // teacher earns (karma flowing in)
      iconColor = Colors.success;
      deltaColor = Colors.success;
    } else if (isNegative) {
      iconName = 'arrow-up'; // learner spends (karma flowing out)
      iconColor = Colors.error;
      deltaColor = Colors.error;
    }

    return (
      <View style={styles.txItem}>
        <View style={styles.txLeft}>
          <View style={[styles.txIconContainer, { backgroundColor: iconColor + '10' }]}>
            <Ionicons name={iconName} size={18} color={iconColor} />
          </View>
          <View style={styles.txInfo}>
            <Text style={styles.txNote} numberOfLines={2}>{item.note}</Text>
            <Text style={styles.txDate}>{getRelativeTime(item.createdAt)}</Text>
          </View>
        </View>
        <Text style={[styles.txDelta, { color: deltaColor }]}>
          {formatKarmaDelta(item.delta)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Balance Card Header */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceTitle}>Available Balance</Text>
            <Ionicons name="flash" size={20} color="#F59E0B" />
          </View>
          <Text style={styles.balanceValue}>{currentUser?.karmaBalance || 0}</Text>
          <Text style={styles.balanceSubtitle}>
            Teach skills to earn more karma, spend karma to learn from others.
          </Text>
        </LinearGradient>
      </View>

      {/* Ledger Section */}
      <View style={styles.ledgerHeader}>
        <Text style={styles.ledgerTitle}>Transaction History</Text>
        <Text style={styles.ledgerCount}>{userLedger.length} entries</Text>
      </View>

      <FlatList
        data={userLedger}
        keyExtractor={(item) => item.id}
        renderItem={renderTransactionItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="No transactions yet"
            description="Complete onboarding or a swap to see transaction records here."
            icon="wallet-outline"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    padding: Spacing.lg,
  },
  balanceCard: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    ...Shadow.md,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  balanceTitle: {
    color: Colors.primaryBg,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  balanceValue: {
    color: Colors.textInverse,
    fontSize: FontSize['4xl'] + 10,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
  },
  balanceSubtitle: {
    color: Colors.primaryBg,
    fontSize: FontSize.xs,
    lineHeight: 16,
    opacity: 0.9,
  },
  ledgerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surfaceSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  ledgerTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  ledgerCount: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  listContent: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
  },
  txItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.lg,
  },
  txIconContainer: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  txInfo: {
    flex: 1,
  },
  txNote: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    lineHeight: 18,
  },
  txDate: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  txDelta: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});
