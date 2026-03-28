import React, { useEffect } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect, Line, G } from 'react-native-svg';
import { useAuth } from '../context/AuthContext';
import { navigateToTab, navigateTo } from '../navigation/navigationRef';
import { colors } from '../theme';

const { width: SCREEN_W } = Dimensions.get('window');
const SHEET_W = SCREEN_W; // menu fullscreen

/* ─── Ícones SVG inline ─── */

function UserAvatarIcon({ size = 52 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <Circle cx="26" cy="26" r="24" stroke={colors.secondary} strokeWidth="3" />
      <Circle cx="26" cy="20" r="8" stroke={colors.secondary} strokeWidth="3" />
      <Path
        d="M10 44c0-8.837 7.163-16 16-16s16 7.163 16 16"
        stroke={colors.secondary}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function EyeIcon({ size = 24, color = colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

function ProfileIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={colors.secondary} strokeWidth="1.8" />
      <Path
        d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke={colors.secondary}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function HistoryIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={colors.secondary} strokeWidth="1.8" />
      <Path
        d="M12 7v5l3 3"
        stroke={colors.secondary}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SettingsIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3" stroke={colors.secondary} strokeWidth="1.8" />
      <Path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
        stroke={colors.secondary}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SupportIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2z"
        stroke={colors.secondary}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke={colors.secondary}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LogoutIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
        stroke={colors.primary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 17l5-5-5-5"
        stroke={colors.primary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 12H9"
        stroke={colors.primary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function DollarIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="4" width="16" height="16" rx="4" stroke={colors.secondary} strokeWidth="1.8" />
      <Path
        d="M12 8v8M10 10c0-1.1.9-2 2-2s2 .9 2 2M14 14c0 1.1-.9 2-2 2s-2-.9-2-2"
        stroke={colors.secondary}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function MenuSheet() {
  const {
    menuVisible,
    closeMenu,
    openAuthModal,
    openDepositModal,
    logout,
    isAuthenticated,
    userEmail,
    balance,
  } = useAuth();
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(SCREEN_W);

  useEffect(() => {
    translateX.value = withTiming(menuVisible ? 0 : SCREEN_W, { duration: 300 });
  }, [menuVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const userName = userEmail
    ? userEmail.split('@')[0]
    : 'Nome de Usuário';

  const balanceLabel =
    isAuthenticated && balance !== null
      ? `${balance.toFixed(2).replace('.', ',')}`
      : '0,00';

  function handleDeposit() {
    closeMenu();
    if (!isAuthenticated) {
      openAuthModal('login');
    } else {
      openDepositModal();
    }
  }

  function handleWithdraw() {
    closeMenu();
    if (!isAuthenticated) {
      openAuthModal('login');
    }
    // TODO: implementar saque
  }

  function handleProfile() {
    closeMenu();
    if (!isAuthenticated) {
      openAuthModal('login');
    }
    // TODO: navegar para perfil
  }

  function handleHistorico() {
    closeMenu();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    setTimeout(() => {
      navigateTo('Historico');
    }, 320);
  }

  function handleConfiguracoes() {
    closeMenu();
    // TODO: navegar para configurações
  }

  function handleSuporte() {
    closeMenu();
    setTimeout(() => {
      navigateTo('Suporte');
    }, 320);
  }

  return (
    <Modal
      visible={menuVisible}
      transparent
      animationType="none"
      onRequestClose={closeMenu}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />

        <Animated.View style={[styles.sheet, animatedStyle]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* ─── Header Part (Dark Blue) ─── */}
            <View style={[styles.topDarkHeader, { paddingTop: insets.top + 16 }]}>
              {/* Header: Close button slightly offset upwards */}
              <View style={styles.closeBtnWrapper}>
                <Pressable onPress={closeMenu} style={styles.closeBtn} hitSlop={12}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </Pressable>
              </View>

              {isAuthenticated ? (
                <>
                  {/* ─── Profile ─── */}
                  <View style={styles.profileRow}>
                    <UserAvatarIcon size={52} />
                    <View style={styles.profileInfo}>
                      <Text style={styles.profileName}>{userName}</Text>
                      <Text style={styles.profileId}>ID: 00000000000</Text>
                    </View>
                  </View>

                  {/* ─── Balance Card ─── */}
                  <View style={styles.balanceCard}>
                    <View style={styles.balanceCardTopRow}>
                      <EyeIcon size={24} color={colors.primary} />
                      <View style={styles.balanceTextRight}>
                        <Text style={styles.balanceLabel}>Saldo total</Text>
                        <Text style={styles.balanceValue}>R$ {balanceLabel}</Text>
                      </View>
                    </View>
                  </View>

                  {/* ─── Action Buttons: Sacar / Depositar ─── */}
                  <View style={styles.actionsRow}>
                    <Pressable style={styles.withdrawBtn} onPress={handleWithdraw}>
                      <Text style={styles.withdrawBtnText}>Sacar</Text>
                    </Pressable>
                    <Pressable style={styles.depositBtn} onPress={handleDeposit}>
                      <Text style={styles.depositBtnText}>Depositar</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  {/* ─── Guest avatar ─── */}
                  <View style={[styles.profileRow, { marginBottom: 16 }]}>
                    <UserAvatarIcon size={52} />
                    <View style={styles.profileInfo}>
                      <Text style={styles.profileName}>Visitante</Text>
                      <Text style={styles.profileIdLogin}>Faça login para acessar</Text>
                    </View>
                  </View>

                  {/* ─── Guest Balance Placeholder Card ─── */}
                  <View style={styles.balanceCardPlaceholder}>
                    <Text style={styles.guestTitle}>Faça parte!</Text>
                    <Text style={styles.guestSubtitle}>
                      Entre ou crie sua conta para apostar e acompanhar seu histórico.
                    </Text>
                  </View>

                  {/* ─── Auth Buttons under the White Card ─── */}
                  <View style={styles.actionsRow}>
                    <Pressable
                      style={styles.withdrawBtn}
                      onPress={() => {
                        closeMenu();
                        openAuthModal('login');
                      }}
                    >
                      <Text style={styles.withdrawBtnText}>Entrar</Text>
                    </Pressable>
                    <Pressable
                      style={styles.depositBtn}
                      onPress={() => {
                        closeMenu();
                        openAuthModal('register');
                      }}
                    >
                      <Text style={styles.depositBtnText}>Criar conta</Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>

            {/* ─── Content Part (Light Gray/Blue) ─── */}
            <View style={[styles.bottomContent, { paddingBottom: insets.bottom + 40 }]}>
              {/* ─── Seção: Conta e histórico ─── */}
              {isAuthenticated && (
                <>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionBar} />
                    <Text style={styles.sectionTitle}>Conta e histórico</Text>
                  </View>

                  {/* Conta */}
                  <Pressable style={styles.menuItem} onPress={handleProfile}>
                    <ProfileIcon size={22} />
                    <View style={styles.menuItemContent}>
                      <Text style={styles.menuItemTitle}>Conta</Text>
                      <Text style={styles.menuItemSub}>Dados pessoais, foto, senha</Text>
                    </View>
                  </Pressable>

                  {/* Histórico de apostas */}
                  <Pressable style={styles.menuItem} onPress={handleHistorico}>
                    <HistoryIcon size={22} />
                    <View style={styles.menuItemContent}>
                      <Text style={styles.menuItemTitle}>Histórico de Apostas</Text>
                      <Text style={styles.menuItemSub}>100 apostas - 2 em aberto</Text>
                    </View>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>2 abertas</Text>
                    </View>
                  </Pressable>

                  {/* Histórico de Transferências */}
                  <Pressable style={styles.menuItem} onPress={handleHistorico}>
                    <DollarIcon size={22} />
                    <View style={styles.menuItemContent}>
                      <Text style={styles.menuItemTitle}>Histórico de Transferências</Text>
                    </View>
                  </Pressable>
                </>
              )}

              {/* ─── Seção: Preferências ─── */}
              <View style={[styles.sectionHeader, { marginTop: 12 }]}>
                <View style={styles.sectionBar} />
                <Text style={styles.sectionTitle}>Preferências</Text>
              </View>

              {/* Configurações */}
              <Pressable style={styles.menuItemSimple} onPress={handleConfiguracoes}>
                <SettingsIcon size={22} />
                <Text style={styles.menuItemTitleSimple}>Configurações</Text>
              </Pressable>

              {/* Suporte */}
              <Pressable style={styles.menuItemSimple} onPress={handleSuporte}>
                <SupportIcon size={22} />
                <Text style={styles.menuItemTitleSimple}>Suporte</Text>
              </Pressable>

              {/* ─── Logout ─── */}
              {isAuthenticated && (
                <Pressable
                  style={styles.logoutBtn}
                  onPress={async () => {
                    await logout();
                    closeMenu();
                  }}
                >
                  <LogoutIcon size={20} />
                  <Text style={styles.logoutBtnText}>Sair</Text>
                </Pressable>
              )}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  sheet: {
    width: SHEET_W,
    backgroundColor: '#F1F5F9', // light gray background for the bottom content
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  scrollContent: {
    flexGrow: 1,
  },

  /* ─── Top Header (Dark) ─── */
  topDarkHeader: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  closeBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '600',
  },

  /* ─── Profile ─── */
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  profileId: {
    color: colors.secondary,
    fontSize: 11,
    marginTop: 2,
  },
  profileIdLogin: {
    color: colors.secondary,
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },

  /* ─── Balance Card ─── */
  balanceCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  balanceCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  balanceTextRight: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: -2, // to tighten space
  },
  balanceValue: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },

  balanceCardPlaceholder: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  guestTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  guestSubtitle: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },

  /* ─── Action Buttons ─── */
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  withdrawBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#1E40AF', // subtle dark blue border
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#042B7A', // subtle card dark blue
  },
  withdrawBtnText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '700',
  },
  depositBtn: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  depositBtnText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '700',
  },

  /* ─── Bottom Content ─── */
  bottomContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  /* ─── Section Headers ─── */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionBar: {
    width: 3,
    height: 16,
    borderRadius: 2,
    backgroundColor: colors.primary, // blue bar
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },

  /* ─── Menu Items (with subtitle) ─── */
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A266F', // very dark blue like image
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 8,
    gap: 12,
  },
  menuItemContent: {
    flex: 1,
    justifyContent: 'center',
  },
  menuItemTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  menuItemSub: {
    color: '#5EEAD4', // light cyan to match image description of green/light blue subtitle
    fontSize: 10,
    marginTop: 2,
  },

  /* ─── Badge ─── */
  badge: {
    backgroundColor: colors.secondary,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.primaryDark,
    fontSize: 10,
    fontWeight: '700',
  },

  /* ─── Menu Items (simple) ─── */
  menuItemSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A266F', 
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 8,
    gap: 12,
  },
  menuItemTitleSimple: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },

  /* ─── Logout ─── */
  logoutBtn: {
    marginTop: 24,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  logoutBtnText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});
