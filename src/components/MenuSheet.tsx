import React, { useEffect } from 'react';
import {
  Modal,
  Pressable,
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
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

export default function MenuSheet() {
  const { menuVisible, closeMenu, openAuthModal, logout, isAuthenticated, userEmail } = useAuth();
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(320);

  useEffect(() => {
    translateX.value = withTiming(menuVisible ? 0 : 320, { duration: 280 });
  }, [menuVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  function handleLogin() {
    closeMenu();
    openAuthModal('login');
  }

  function handleRegister() {
    closeMenu();
    openAuthModal('register');
  }

  async function handleLogout() {
    await logout();
    closeMenu();
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

        <Animated.View style={[styles.sheet, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }, animatedStyle]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Menu</Text>
            <Pressable onPress={closeMenu} style={styles.closeBtn} hitSlop={12}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          {isAuthenticated ? (
            <>
              <View style={styles.profileCard}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {userEmail?.[0]?.toUpperCase() ?? '?'}
                  </Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileLabel}>Logado como</Text>
                  <Text style={styles.profileEmail} numberOfLines={1}>
                    {userEmail}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <Pressable style={styles.menuItem} onPress={handleLogout}>
                <Text style={styles.menuItemTextDanger}>Sair da conta</Text>
              </Pressable>
            </>
          ) : (
            <>
              <View style={styles.guestCard}>
                <Text style={styles.guestTitle}>Faça parte!</Text>
                <Text style={styles.guestSubtitle}>
                  Entre ou crie sua conta para apostar e acompanhar seu histórico.
                </Text>
              </View>

              <View style={styles.divider} />

              <Pressable style={styles.loginBtn} onPress={handleLogin}>
                <Text style={styles.loginBtnText}>Entrar</Text>
              </Pressable>

              <Pressable style={styles.registerBtn} onPress={handleRegister}>
                <Text style={styles.registerBtnText}>Criar conta</Text>
              </Pressable>
            </>
          )}
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
    width: 300,
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    color: colors.grey,
    fontSize: 18,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 18,
  },
  profileInfo: {
    flex: 1,
  },
  profileLabel: {
    color: colors.grey,
    fontSize: 12,
    marginBottom: 2,
  },
  profileEmail: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.surface,
    marginVertical: 16,
  },
  menuItem: {
    paddingVertical: 14,
  },
  menuItemTextDanger: {
    color: '#FF6B6B',
    fontSize: 15,
    fontWeight: '600',
  },
  guestCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
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
