import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Alert,
  Platform,
  Animated,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ChatListScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([
    {
      id: '1',
      sellerId: 'seller_001',
      sellerName: 'Ahmed Electronics',
      sellerImage: 'https://ui-avatars.com/api/?name=Ahmed+Electronics&background=6C5CE7&color=fff&size=128',
      buyerImage: 'https://ui-avatars.com/api/?name=You&background=00D68F&color=fff&size=128',
      lastMessage: 'Product available hai, price 5000 hai',
      timestamp: '2m ago',
      unreadCount: 2,
      online: true,
    },
    {
      id: '2',
      sellerId: 'seller_002',
      sellerName: 'Fashion Store',
      sellerImage: 'https://ui-avatars.com/api/?name=Fashion+Store&background=6C5CE7&color=fff&size=128',
      buyerImage: 'https://ui-avatars.com/api/?name=You&background=00D68F&color=fff&size=128',
      lastMessage: 'Delivery charges alag honge',
      timestamp: '1h ago',
      unreadCount: 0,
      online: false,
    },
    {
      id: '3',
      sellerId: 'seller_003',
      sellerName: 'Mobile Shop',
      sellerImage: 'https://ui-avatars.com/api/?name=Mobile+Shop&background=6C5CE7&color=fff&size=128',
      buyerImage: 'https://ui-avatars.com/api/?name=You&background=00D68F&color=fff&size=128',
      lastMessage: 'Stock check kar raha hoon',
      timestamp: '3h ago',
      unreadCount: 1,
      online: true,
    },
  ]);

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const updateUnreadCount = useCallback((chatId) => {
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === chatId
          ? { ...conv, unreadCount: conv.unreadCount + 1 }
          : conv
      )
    );
  }, []);

  const startNewChat = (seller) => {
    const existingChat = conversations.find(c => c.sellerId === seller.id);

    if (existingChat) {
      console.log('Opening existing chat:', existingChat);
      navigation.navigate('ChatDetail', { conversation: existingChat });
    } else {
      const newConversation = {
        id: Date.now().toString(),
        sellerId: seller.id,
        sellerName: seller.name,
        sellerImage: seller.image,
        buyerImage: 'https://ui-avatars.com/api/?name=You&background=00D68F&color=fff&size=128',
        lastMessage: '',
        timestamp: 'Now',
        unreadCount: 0,
        online: seller.online,
      };

      setConversations([newConversation, ...conversations]);
      navigation.navigate('ChatDetail', { conversation: newConversation });
    }
  };

  const handleChatPress = (item) => {
    console.log('Chat pressed:', item);
    console.log('Navigation object:', navigation);
    
    // Clear unread count
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === item.id ? { ...conv, unreadCount: 0 } : conv
      )
    );

    // Navigate
    try {
      navigation.navigate('ChatDetail', {
        conversation: item,
        onMessageSent: updateUnreadCount,
      });
      console.log('Navigation successful');
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Could not open chat: ' + error.message);
    }
  };

  const renderConversation = ({ item, index }) => {
    const animatedValue = new Animated.Value(0);
    
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 400,
      delay: index * 80,
      useNativeDriver: true,
    }).start();

    const translateY = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [30, 0],
    });

    return (
      <Animated.View
        style={[
          styles.conversationWrapper,
          {
            opacity: animatedValue,
            transform: [{ translateY }],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.conversationItem,
            item.unreadCount > 0 && styles.unreadConversation
          ]}
          onPress={() => handleChatPress(item)}
          activeOpacity={0.7}
        >
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: item.sellerImage }} 
              style={styles.avatar}
              onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
            />
            {item.online && <View style={styles.onlineIndicator} />}
          </View>

          <View style={styles.conversationContent}>
            <View style={styles.conversationHeader}>
              <Text style={[
                styles.sellerName,
                item.unreadCount > 0 && styles.unreadName
              ]}>
                {item.sellerName}
              </Text>
              <Text style={[
                styles.timestamp,
                item.unreadCount > 0 && styles.unreadTimestamp
              ]}>
                {item.timestamp}
              </Text>
            </View>
            <View style={styles.messagePreview}>
              <Text
                style={[
                  styles.lastMessage,
                  item.unreadCount > 0 && styles.unreadMessage
                ]}
                numberOfLines={1}
              >
                {item.lastMessage || 'Tap to start chatting'}
              </Text>
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
          </View>

          <Image source={{ uri: item.buyerImage }} style={styles.buyerBadge} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C5CE7" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Messages</Text>
          {totalUnread > 0 && (
            <View style={styles.totalUnreadBadge}>
              <Text style={styles.totalUnreadText}>{totalUnread}</Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="search" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => {
              Alert.alert(
                'Start New Chat',
                'Select a seller to start chatting',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Test Seller',
                    onPress: () =>
                      startNewChat({
                        id: 'seller_new',
                        name: 'New Test Seller',
                        image: 'https://ui-avatars.com/api/?name=Test+Seller&background=6C5CE7&color=fff&size=128',
                        online: true,
                      }),
                  },
                ]
              );
            }}
          >
            <Icon name="add-circle" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View
        style={[
          styles.activeUsersContainer,
          { opacity: fadeAnim },
        ]}
      >
        <View style={styles.activeUsersHeader}>
          <View style={styles.pulseContainer}>
            <View style={styles.pulseOuter} />
            <View style={styles.pulseInner} />
          </View>
          <Text style={styles.activeUsersTitle}>Active Now</Text>
          <View style={styles.activeCount}>
            <Text style={styles.activeCountText}>
              {conversations.filter(c => c.online).length}
            </Text>
          </View>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={conversations.filter(c => c.online)}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.activeUserItem}
              onPress={() => handleChatPress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.activeUserBorder}>
                <Image source={{ uri: item.sellerImage }} style={styles.activeUserImage} />
              </View>
              <Text style={styles.activeUserName} numberOfLines={1}>
                {item.sellerName.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          )}
        />
      </Animated.View>

      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 20,
    backgroundColor: '#6C5CE7',
    elevation: 8,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginRight: 12,
    letterSpacing: 0.5,
  },
  totalUnreadBadge: {
    backgroundColor: '#FF3B5C',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  totalUnreadText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { marginLeft: 20 },
  activeUsersContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  activeUsersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  pulseContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  pulseOuter: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00D68F',
    opacity: 0.3,
  },
  pulseInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00D68F',
  },
  activeUsersTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
    flex: 1,
  },
  activeCount: {
    backgroundColor: '#6C5CE7',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activeCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeUserItem: { 
    alignItems: 'center', 
    marginRight: 16, 
    width: 70,
  },
  activeUserBorder: {
    padding: 3,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#00D68F',
    marginBottom: 6,
  },
  activeUserImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  activeUserName: {
    fontSize: 12,
    color: '#2D3436',
    fontWeight: '600',
    textAlign: 'center',
  },
  listContainer: { 
    padding: 12, 
    paddingBottom: 20,
  },
  conversationWrapper: {
    marginBottom: 12,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  unreadConversation: {
    backgroundColor: '#6C5CE7',
    elevation: 4,
  },
  avatarContainer: { 
    position: 'relative', 
    marginRight: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#fff',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00D68F',
    borderWidth: 3,
    borderColor: '#fff',
  },
  conversationContent: { 
    flex: 1, 
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sellerName: { 
    fontSize: 17, 
    fontWeight: '700', 
    color: '#2D3436',
  },
  unreadName: { color: '#fff' },
  timestamp: { 
    fontSize: 12, 
    color: '#B2BEC3',
  },
  unreadTimestamp: { color: '#DFE6E9' },
  messagePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: { 
    fontSize: 14, 
    color: '#636E72', 
    flex: 1,
  },
  unreadMessage: { 
    color: '#DFE6E9', 
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#FF3B5C',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 8,
  },
  unreadText: { 
    color: '#fff', 
    fontSize: 12, 
    fontWeight: 'bold',
  },
  buyerBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#fff',
    marginLeft: 8,
  },
});

export default ChatListScreen;