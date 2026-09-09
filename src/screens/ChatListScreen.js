// قائمة الدردشات
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { ChatContext } from '../../contexts/ChatContext';
import { AuthContext } from '../../contexts/AuthContext';
import { COLORS, SIZES, FONT_SIZES } from '../../constants/index';

const { width } = Dimensions.get('window');

const ChatListScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const {
    conversations,
    fetchUserConversations,
    getUnreadCount,
    isLoading,
  } = useContext(ChatContext);

  const [searchText, setSearchText] = useState('');
  const [filteredConversations, setFilteredConversations] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserConversations(user.id);
    }
  }, [user, fetchUserConversations]);

  useEffect(() => {
    if (searchText) {
      const filtered = Object.entries(conversations).filter(([_, conv]) =>
        conv.contactName?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(Object.entries(conversations));
    }
  }, [searchText, conversations]);

  const handleConversationPress = (chatId, otherUserId, otherUserName) => {
    navigation.navigate('Chat', {
      otherUserId,
      otherUserName,
      chatId,
    });
  };

  const renderConversationItem = ({ item }) => {
    const [chatId, conversation] = item;
    const unreadCount = getUnreadCount(chatId);

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() =>
          handleConversationPress(
            chatId,
            conversation.otherUserId,
            conversation.contactName
          )
        }
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {conversation.contactName?.charAt(0) || 'U'}
            </Text>
          </View>
          {conversation.isOnline && <View style={styles.onlineBadge} />}
        </View>

        <View style={styles.conversationInfo}>
          <View style={styles.conversationHeader}>
            <Text style={styles.contactName}>
              {conversation.contactName || 'مستخدم'}
            </Text>
            <Text style={styles.timestamp}>
              {new Date(conversation.lastMessageTime).toLocaleTimeString(
                'ar-IQ',
                { hour: '2-digit', minute: '2-digit' }
              )}
            </Text>
          </View>
          <View style={styles.conversationFooter}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {conversation.lastMessage || 'لا توجد رسالل'}
            </Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>💬 لا توجد رسالل</Text>
        <Text style={styles.emptySubtitle}>
          ابدأ محاثثة جديدة مع مستخدم آخر
        </Text>
      </View>
    );
  };

  if (isLoading && !filteredConversations.length) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* الرأس */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الرسالل 💬</Text>
      </View>

      {/* البحث */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث عن رسالة..."
          placeholderTextColor={COLORS.border}
          value={searchText}
          onChangeText={setSearchText}
          textAlign="right"
        />
        <Text style={styles.searchIcon}>🔎</Text>
      </View>

      {/* قائمة المحاثرات */}
      {filteredConversations.length > 0 ? (
        <FlatList
          data={filteredConversations}
          keyExtractor={([chatId]) => chatId}
          renderItem={renderConversationItem}
          scrollEnabled={true}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        renderEmptyState()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.md,
    marginVertical: SIZES.md,
    backgroundColor: COLORS.gray,
    borderRadius: SIZES.lg,
    paddingHorizontal: SIZES.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SIZES.md,
    fontSize: FONT_SIZES.base,
    color: COLORS.darkGray,
  },
  searchIcon: {
    fontSize: FONT_SIZES.lg,
  },
  listContent: {
    paddingBottom: SIZES.md,
  },
  conversationItem: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SIZES.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  contactName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  timestamp: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    marginLeft: SIZES.sm,
  },
  unreadText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginBottom: SIZES.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

export default ChatListScreen;
