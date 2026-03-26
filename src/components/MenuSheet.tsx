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
import { navigateToTab } from '../navigation/navigationRef';
import { colors } from '../theme';

const { width: SCREEN_W } = Dimensions.get('window');
const SHEET_W = SCREEN_W; // menu fullscreen

/* ─── Ícones SVG inline ─── */

function UserAvatarIcon({ size = 52 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <Circle cx="26" cy="26" r="25" stroke={colors.secondary} strokeWidth="2" />
      <Circle cx="26" cy="20" r="8" stroke={colors.secondary} strokeWidth="2" />
      <Path
        d="M10 44c0-8.837 7.163-16 16-16s16 7.163 16 16"
        stroke={colors.secondary}
        strokeWidth="2"
        strokeLinecap="round"
      />
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
      ? `R$ ${balance.toFixed(2).replace('.', ',')}`
      : 'R$ 0,00';

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
      navigateToTab('Historico');
    }, 320);
  }

  function handleConfiguracoes() {
    closeMenu();
    // TODO: navegar para configurações
  }

  function handleSuporte() {
    closeMenu();
    setTimeout(() => {
      navigateToTab('Suporte');
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

        <Animated.View
          style={[
            styles.sheet,
            { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
            animatedStyle,
          ]}
        >
          {/* ─── Header: Close button ─── */}
          <View style={styles.sheetHeader}>
            <Pressable onPress={closeMenu} style={styles.closeBtn} hitSlop={12}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {isAuthenticated ? (
              <>
                {/* ═══ AUTHENTICATED VIEW ═══ */}

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
                  <Text style={styles.balanceLabel}>Saldo total</Text>
                  <Text style={styles.balanceValue}>{balanceLabel}</Text>
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

                {/* ─── Seção: Conta e histórico ─── */}
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionBar} />
                  <Text style={styles.sectionTitle}>Conta e histórico</Text>
                </View>

                {/* Meu perfil */}
                <Pressable style={styles.menuItem} onPress={handleProfile}>
                  <ProfileIcon size={22} />
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemTitle}>Meu perfil</Text>
                    <Text style={styles.menuItemSub}>Dados pessoais, foto, senha</Text>
                  </View>
                </Pressable>

                {/* Histórico de apostas */}
                <Pressable style={styles.menuItem} onPress={handleHistorico}>
                  <HistoryIcon size={22} />
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemTitle}>Histórico de apostas</Text>
                    <Text style={styles.menuItemSub}>100 apostas - 3 em aberto</Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>3 abertas</Text>
                  </View>
                </Pressable>

                {/* ─── Seção: Preferências ─── */}
                <View style={styles.sectionHeader}>
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
                <Pressable
                  style={styles.logoutBtn}
                  onPress={async () => {
                    await logout();
                    closeMenu();
                  }}
                >
                  <Text style={styles.logoutBtnText}>Sair da conta</Text>
                </Pressable>
              </>
            ) : (
              <>
                {/* ═══ GUEST VIEW ═══ */}

                {/* ─── Guest avatar ─── */}
                <View style={styles.profileRow}>
                  <UserAvatarIcon size={52} />
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>Visitante</Text>
                    <Text style={styles.profileId}>Faça login para acessar</Text>
                  </View>
                </View>

                {/* ─── Guest Card ─── */}
                <View style={styles.guestCard}>
                  <Text style={styles.guestTitle}>Faça parte!</Text>
                  <Text style={styles.guestSubtitle}>
                    Entre ou crie sua conta para apostar e acompanhar seu histórico.
                  </Text>
                </View>

                {/* ─── Auth Buttons ─── */}
                <Pressable
                  style={styles.loginBtn}
                  onPress={() => {
                    closeMenu();
                    openAuthModal('login');
                  }}
                >
                  <Text style={styles.loginBtnText}>Entrar</Text>
                </Pressable>

                <Pressable
                  style={styles.registerBtn}
                  onPress={() => {
                    closeMenu();
                    openAuthModal('register');
                  }}
                >
                  <Text style={styles.registerBtnText}>Criar conta</Text>
                </Pressable>

                {/* ─── Divider ─── */}
                <View style={styles.guestDivider} />

                {/* ─── Preferências (guest também tem acesso) ─── */}
                <View style={styles.sectionHeader}>
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
              </>
            )}
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
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },

  /* ─── Header ─── */
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    color: colors.grey,
    fontSize: 20,
    fontWeight: '600',
  },

  scrollContent: {
    paddingBottom: 40,
  },

  /* ─── Profile ─── */
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 14,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  profileId: {
    color: colors.grey,
    fontSize: 13,
    marginTop: 2,
  },

  /* ─── Balance Card ─── */
  balanceCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  balanceLabel: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  balanceValue: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  /* ─── Action Buttons ─── */
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  withdrawBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  withdrawBtnText: {
    color: colors.secondary,
    fontSize: 15,
    fontWeight: '700',
  },
  depositBtn: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  depositBtnText: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: '700',
  },

  /* ─── Section Headers ─── */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    marginTop: 4,
  },
  sectionBar: {
    width: 3,
    height: 18,
    borderRadius: 2,
    backgroundColor: colors.grey,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },

  /* ─── Menu Items (with subtitle) ─── */
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  menuItemSub: {
    color: colors.grey,
    fontSize: 12,
    marginTop: 2,
  },

  /* ─── Badge ─── */
  badge: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '700',
  },

  /* ─── Menu Items (simple, no subtitle) ─── */
  menuItemSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  menuItemTitleSimple: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },

  /* ─── Logout ─── */
  logoutBtn: {
    marginTop: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutBtnText: {
    color: '#FF6B6B',
    fontSize: 15,
    fontWeight: '600',
  },

  /* ─── Auth section (não autenticado) ─── */
  guestCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  guestTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  guestSubtitle: {
    color: colors.grey,
    fontSize: 13,
    lineHeight: 18,
  },
  guestDivider: {
    height: 1,
    backgroundColor: colors.surface,
    marginVertical: 20,
  },
  loginBtn: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  loginBtnText: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 15,
  },
  registerBtn: {
    borderWidth: 1.5,
    borderColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  registerBtnText: {
    color: colors.secondary,
    fontWeight: '700',
    fontSize: 15,
  },
});
