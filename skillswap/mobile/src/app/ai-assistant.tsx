import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getAIResponse } from '@/services/aiService';
import { Colors, Spacing, Radius, FontSize, FontWeight, Shadow } from '@/theme';

interface MessageItem {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  createdAt: string;
}

export default function AIAssistant() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  // Messages log state
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome',
      text: "Hi! I'm your SkillSwap AI assistant. I can help you discover matching skills, suggest personalized swaps, or guide you on how to earn and spend Karma.",
      sender: 'ai',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsgObj: MessageItem = {
      id: `msg_u_${Date.now()}`,
      text: userMessage,
      sender: 'user',
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsgObj]);
    setLoading(true);

    try {
      const responseText = await getAIResponse(userMessage);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const aiMsgObj: MessageItem = {
        id: `msg_ai_${Date.now()}`,
        text: responseText,
        sender: 'ai',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsgObj]);
    } catch (e) {
      const errorMsgObj: MessageItem = {
        id: `msg_err_${Date.now()}`,
        text: 'Sorry, I encountered an issue. Please try again.',
        sender: 'ai',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsgObj]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to bottom when messages list size changes
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, loading]);

  const renderMessage = ({ item }: { item: MessageItem }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={14} color={Colors.textInverse} />
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackBtn} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Swap Assistant</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Messages Stream */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <View style={styles.aiAvatar}>
                <Ionicons name="sparkles" size={14} color={Colors.textInverse} />
              </View>
              <View style={[styles.bubble, styles.aiBubble, styles.loadingBubble]}>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            </View>
          ) : null
        }
      />

      {/* Input container */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Ask AI for skill recommendations..."
            value={inputText}
            onChangeText={setInputText}
            style={styles.input}
            onSubmitEditing={handleSend}
            placeholderTextColor={Colors.textTertiary}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.8}>
            <Ionicons name="send" size={16} color={Colors.textInverse} />
          </TouchableOpacity>
        </View>
        <Text style={styles.footerLabel}>Powered by Sarvam AI</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? Spacing.xl : Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerBackBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  messagesList: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  userRow: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  aiRow: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    marginBottom: 2,
  },
  bubble: {
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Shadow.sm,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 2,
  },
  aiBubble: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  loadingBubble: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
  },
  messageText: {
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  userText: {
    color: Colors.textInverse,
  },
  aiText: {
    color: Colors.text,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  inputContainer: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: Platform.OS === 'ios' ? 24 : Spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  footerLabel: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
