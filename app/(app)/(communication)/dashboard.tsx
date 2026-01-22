import Loading from "@/src/components/Common/Loading";
import { ExpiringItemsList } from "@/src/components/dashboard/ExpiringItemsList";
import { QuickActionsGrid } from "@/src/components/dashboard/QuickActionsGrid";
import { StatsGrid } from "@/src/components/dashboard/StatsGrid";
import { WelcomeHeader } from "@/src/components/dashboard/WelcomeHeader";
import useDashBoard from "@/src/hooks/useDashBoard";
import React from "react";
import { ScrollView } from "react-native";
import { AppLayout } from "../../../src/components/layout/AppLayout";
import { PageWrapper } from "../../../src/components/layout/PageWrapper";

export default function DashboardScreen() {
  const { quickActions, stats, isLoading, firstName, expiringItems, expiringSoonCount, loadDashboard } = useDashBoard();

  return (
    <AppLayout title="Dashboard">
      <PageWrapper>
        <ScrollView showsVerticalScrollIndicator={false}>
          <WelcomeHeader firstName={firstName} expiringSoonCount={expiringSoonCount} onRefresh={loadDashboard} />
          {isLoading ? (
            <Loading message="A carregar dashboard..." size="large" />
          ) : (
            <>
              <StatsGrid stats={stats} />
              <QuickActionsGrid actions={quickActions} />
              <ExpiringItemsList items={expiringItems} />
            </>
          )}
        </ScrollView>
      </PageWrapper>
    </AppLayout>
  );
}
