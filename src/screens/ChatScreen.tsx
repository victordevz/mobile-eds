import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { colors } from '../theme';
import { GradientBackground } from '../components/GradientBackground';

import { supportApi, SupportMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

function TypingBubble() {
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(dot, { toValue: -7, duration: 250, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 250, useNativeDriver: true }),
          Animated.delay((2 - i) * 150),
        ])
      )
    );
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, []);

  return (
    <View style={styles.typingBubbleContainer}>
      {dots.map((dot, i) => (
        <Animated.View
          key={i}
          style={[styles.dot, { transform: [{ translateY: dot }] }]}
        />
      ))}
    </View>
  );
}

export default function ChatScreen() {
  const { token, openAuthModal } = useAuth();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [initializing, setInitializing] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages, sending]);

  const initSession = useCallback(async () => {
    if (!token) {
      openAuthModal('login');
      setInitializing(false);
      return;
    }
    try {
      const sessions = await supportApi.getSessions(token);
      let sid: string;
      if (sessions.length > 0) {
        sid = sessions[0].id;
      } else {
        const session = await supportApi.createSession(token);
        sid = session.id;
      }
      setSessionId(sid);
      const msgs = await supportApi.getMessages(sid, token);
      setMessages(msgs);
    } catch {
    } finally {
      setInitializing(false);
    }
  }, [token]);

  useEffect(() => {
    initSession();
  }, [initSession]);

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;
    if (!token) {
      openAuthModal('login');
      return;
    }

    let sid = sessionId;
    if (!sid) {
      try {
        const session = await supportApi.createSession(token);
        sid = session.id;
        setSessionId(sid);
      } catch {
        return;
      }
    }

    const content = input.trim();
    setInput('');
    setSending(true);

    const optimisticMsg: SupportMessage = {
      id: `optimistic-${Date.now()}`,
      sessionId: sid,
      role: 'USER',
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      await supportApi.sendMessage(sid, content, token);
      const updated = await supportApi.getMessages(sid, token);
      setMessages(updated);
    } catch {
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }, [input, token, sessionId, openAuthModal]);

  const renderItem = ({ item }: { item: SupportMessage }) => (
    <View
      style={[
        styles.messageContainer,
        item.role === 'USER' ? styles.userMessage : styles.supportMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.role === 'USER' ? styles.userText : styles.supportText,
        ]}
      >
        {item.content}
      </Text>
    </View>
  );

  const renderTypingBubble = () => {
    if (!sending) return null;
    return (
      <View style={[styles.messageContainer, styles.supportMessage]}>
        <TypingBubble />
      </View>
    );
  };

  if (initializing || !token) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <GradientBackground style={{ flex: 1 }}>
      <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={styles.list}
        ListFooterComponent={renderTypingBubble}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Olá! Como posso ajudar você hoje?</Text>
          </View>
        }
      />
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Digite sua mensagem..."
          placeholderTextColor={colors.grey}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
          blurOnSubmit={false}
          editable={!sending}
          onFocus={() => {
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }}
        />
        <TouchableOpacity
          style={[styles.sendButton, sending && styles.sendButtonDisabled]}
          onPress={() => {
            sendMessage();
            inputRef.current?.focus();
          }}
          disabled={sending}
        >
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'flex-start',
    paddingTop: 4,
  },
  emptyText: {
    backgroundColor: colors.secondary,
    color: colors.primary,
    fontSize: 15,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    maxWidth: '80%',
    overflow: 'hidden',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  list: {
    flex: 1,
  },
  messageContainer: {
    maxWidth: '80%',
    borderRadius: 16,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
  },
  supportMessage: {
    backgroundColor: colors.secondary,
    alignSelf: 'flex-start',
  },
  typingBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  userText: {
    color: colors.white,
    fontSize: 15,
  },
  supportText: {
    color: colors.primary,
    fontSize: 15,
  },
  messageText: {
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#E0E4ED',
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.textDark,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
});
