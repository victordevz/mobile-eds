import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';
import { storiesApi, StoryItem } from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ───────────────────── Constantes ───────────────────── */

const STORY_DURATION = 10000;

const STORIES_FALLBACK: StoryItem[] = [
  { id: 's1', title: '1 MILHÃO', videoUrl: '', thumbnailUrl: null, order: 1, active: true, createdAt: '', viewed: false },
  { id: 's2', title: 'COTAÇÕES', videoUrl: '', thumbnailUrl: null, order: 2, active: true, createdAt: '', viewed: false },
  { id: 's3', title: 'PRÊMIOS', videoUrl: '', thumbnailUrl: null, order: 3, active: false, createdAt: '', viewed: false },
  { id: 's4', title: 'CASHBACK', videoUrl: '', thumbnailUrl: null, order: 4, active: false, createdAt: '', viewed: false },
  { id: 's5', title: 'GRÁTIS', videoUrl: '', thumbnailUrl: null, order: 5, active: false, createdAt: '', viewed: false },
];

const SPECIAL_ITEMS = [
  { id: 'sp1', title: 'PRÊMIO DIÁRIO', icon: require('../../assets/premiado.png') },
  { id: 'sp2', title: 'BAÚ', icon: require('../../assets/bau.png') },
  { id: 'sp3', title: 'SUPER ODDS', icon: require('../../assets/superodds.png') },
  { id: 'sp4', title: 'MISSÕES', icon: require('../../assets/missoes.png') },
];

/* ───────────────────── Componentes auxiliares ──────────── */

function StoryViewerModal({
  story,
  stories,
  onClose,
  onViewed,
  onNext,
  onPrev,
}: {
  story: StoryItem;
  stories: StoryItem[];
  onClose: () => void;
  onViewed: (id: string) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const currentIndex = stories.findIndex((s) => s.id === story.id);
  const progress = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  const player = useVideoPlayer(
    story.videoUrl ? { uri: story.videoUrl } : null,
    (p) => {
      if (story.videoUrl) {
        p.loop = false;
        p.play();
      }
    },
  );

  function startProgress(durationMs: number) {
    animRef.current?.stop();
    progress.setValue(0);
    animRef.current = Animated.timing(progress, {
      toValue: 1,
      duration: durationMs,
      useNativeDriver: false,
    });
    animRef.current.start(({ finished }) => {
      if (finished) onNext();
    });
  }

  useEffect(() => {
    onViewed(story.id);
    progress.setValue(0);

    if (!story.videoUrl) {
      startProgress(STORY_DURATION);
      return () => { animRef.current?.stop(); };
    }

    const sub = player.addListener('statusChange', (status) => {
      if (status.status === 'readyToPlay' && player.duration > 0) {
        startProgress(player.duration * 1000);
        sub.remove();
      }
    });

    startProgress(STORY_DURATION);

    return () => {
      sub.remove();
      animRef.current?.stop();
    };
  }, [story.id]);

  const { width: SW } = Dimensions.get('window');
  const segmentW = (SW - 32 - (stories.length - 1) * 4) / stories.length;

  return (
    <Modal
      visible
      transparent={false}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar hidden />
      <View style={styles.storyModalOverlay}>
        {story.videoUrl ? (
          <VideoView
            player={player}
            style={styles.storyModalBg}
            contentFit="cover"
            nativeControls={false}
          />
        ) : story.thumbnailUrl ? (
          <Image source={{ uri: story.thumbnailUrl }} style={styles.storyModalBg} />
        ) : (
          <View style={[styles.storyModalBg, { backgroundColor: colors.card }]} />
        )}

        <View style={styles.storyModalDim} />

        {/* Barras de progresso */}
        <View style={styles.storyProgressRow}>
          {stories.map((s, i) => (
            <View key={s.id} style={[styles.storyProgressSegment, { width: segmentW, backgroundColor: 'rgba(255,255,255,0.35)' }]}>
              {i < currentIndex && (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.white }]} />
              )}
              {i === currentIndex && (
                <Animated.View
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      backgroundColor: colors.white,
                      width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                    },
                  ]}
                />
              )}
            </View>
          ))}
        </View>

        {/* Header */}
        <View style={styles.storyModalHeader}>
          <View style={styles.storyModalUser}>
            <View style={styles.storyModalAvatar}>
              {story.thumbnailUrl ? (
                <Image source={{ uri: story.thumbnailUrl }} style={styles.storyModalAvatarImg} />
              ) : (
                <Text style={styles.storyInitial}>{story.title.charAt(0).toUpperCase()}</Text>
              )}
            </View>
            <Text style={styles.storyModalTitle}>{story.title}</Text>
          </View>
          <Pressable onPress={onClose} hitSlop={12} style={styles.storyModalClose}>
            <Text style={styles.storyModalCloseText}>✕</Text>
          </Pressable>
        </View>

        {/* Zonas de toque: prev / next */}
        <View style={styles.storyTouchRow} pointerEvents="box-none">
          <Pressable style={styles.storyTouchZone} onPress={onPrev} />
          <Pressable style={styles.storyTouchZone} onPress={onNext} />
        </View>
      </View>
    </Modal>
  );
}

export default function StoriesBar() {
  const { token, isAuthenticated } = useAuth();
  const [stories, setStories] = useState<StoryItem[]>(STORIES_FALLBACK);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});

  const groupedStories = React.useMemo(() => {
    const groups: { title: string; items: StoryItem[] }[] = [];
    stories.forEach(item => {
      const prefix = item.title.split(' ')[0].toUpperCase();
      const existing = groups.find(g => g.items[0].title.split(' ')[0].toUpperCase() === prefix);
      if (existing) {
        existing.items.push(item);
      } else {
        groups.push({ title: item.title, items: [item] });
      }
    });
    return groups;
  }, [stories]);

  async function generateThumbs(items: StoryItem[]) {
    const entries = await Promise.all(
      items.map(async (s) => {
        if (!s.videoUrl) return null;
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(s.videoUrl, { time: 0 });
          return [s.id, uri] as [string, string];
        } catch {
          return null;
        }
      }),
    );
    const map: Record<string, string> = {};
    for (const entry of entries) {
      if (entry) map[entry[0]] = entry[1];
    }
    setThumbs(map);
  }

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated || !token) return;
      storiesApi
        .list(token)
        .then((data) => {
          if (data.length > 0) {
            setStories(data);
            generateThumbs(data);
          }
        })
        .catch(() => { });
    }, [isAuthenticated, token]),
  );

  function handleViewed(id: string) {
    if (!token) return;
    storiesApi.markViewed(id, token).catch(() => { });
    setStories(prev => prev.map(s => (s.id === id ? { ...s, viewed: true } : s)));
  }

  function handleNext() {
    setActiveIndex(prev => {
      if (prev === null) return null;
      const next = prev + 1;
      return next < stories.length ? next : null;
    });
  }

  function handlePrev() {
    setActiveIndex(prev => {
      if (prev === null) return null;
      const p = prev - 1;
      return p >= 0 ? p : 0;
    });
  }

  const activeStory = activeIndex !== null ? stories[activeIndex] : null;

  return (
    <>
      {activeStory && (
        <StoryViewerModal
          story={activeStory}
          stories={stories}
          onClose={() => setActiveIndex(null)}
          onViewed={handleViewed}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesContainer}
      >
        {/* Itens Especiais (Premium) */}
        {SPECIAL_ITEMS.map((item) => (
          <Pressable key={item.id} style={styles.storyItem}>
            <View style={styles.specialItemContainer}>
              <Image source={item.icon} style={styles.special3DImage} resizeMode="contain" />
            </View>
            <Text style={[styles.storyLabel, styles.storyLabelActive]}>
              {item.title}
            </Text>
          </Pressable>
        ))}

        {/* Stories Normais */}
        {groupedStories.map((group) => {
          const firstItem = group.items[0];
          const allViewed = group.items.every(s => s.viewed);
          const firstUnviewed = group.items.findIndex(s => !s.viewed);
          const startAt = firstUnviewed === -1 ? 0 : firstUnviewed;
          const flatIndex = stories.findIndex(s => s.id === group.items[startAt].id);

          return (
            <Pressable 
              key={group.title} 
              style={styles.storyItem} 
              onPress={() => setActiveIndex(flatIndex)}
            >
              <View
                style={[
                  styles.storyRingOuter,
                  !allViewed ? styles.storyRingActive : styles.storyRingInactive,
                ]}
              >
                <View style={styles.storyRingGap}>
                  <View style={styles.storyCircle}>
                    {thumbs[firstItem.id] || firstItem.thumbnailUrl ? (
                      <Image source={{ uri: thumbs[firstItem.id] ?? firstItem.thumbnailUrl! }} style={styles.storyThumb} />
                    ) : (
                      <Text style={styles.storyInitial}>{group.title.charAt(0).toUpperCase()}</Text>
                    )}
                  </View>
                </View>
              </View>
              <Text
                style={[
                  styles.storyLabel,
                  !allViewed ? styles.storyLabelActive : styles.storyLabelInactive,
                ]}
              >
                {group.title}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  /* ── Stories ── */
  storiesContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
    gap: 12, // Reduced from 16 to bring items closer
  },
  storyItem: {
    alignItems: 'center',
    gap: 6,
    width: 72, // Reduced from 80 to bring items closer
  },
  storyRingOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    padding: 3,
  },
  specialItemContainer: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  special3DImage: {
    width: 64, // Same as storyRingOuter
    height: 64,
  },
  storyRingActive: {
    borderColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 6,
    elevation: 4,
  },
  storyRingInactive: {
    borderColor: colors.grey,
  },
  storyRingGap: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
  },
  storyCircle: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyThumb: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  storyInitial: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
  },
  storyLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
    textAlign: 'center',
    textTransform: 'uppercase', // Enforces all labels to be uppercase
  },
  storyLabelActive: {
    color: colors.white,
  },
  storyLabelInactive: {
    color: colors.grey,
  },

  /* ── Story Modal ── */
  storyModalOverlay: {
    flex: 1,
    backgroundColor: '#000',
  },
  storyModalBg: {
    ...StyleSheet.absoluteFillObject,
  },
  storyModalDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  storyProgressRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 52,
    gap: 4,
  },
  storyProgressSegment: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  storyModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 14,
  },
  storyModalUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  storyModalAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  storyModalAvatarImg: {
    width: '100%',
    height: '100%',
  },
  storyModalTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  storyModalClose: {
    padding: 6,
  },
  storyModalCloseText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '300',
  },
  storyTouchRow: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    top: 120,
  },
  storyTouchZone: {
    flex: 1,
  },
});
