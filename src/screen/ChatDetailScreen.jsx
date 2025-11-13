// ChatDetailScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ChatDetailScreen = ({ route, navigation }) => {
  const { conversation } = route.params;
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Assalam o Alaikum, product available hai?',
      sender: 'buyer',
      senderImage: conversation.buyerImage,
      timestamp: '10:30 AM',
      status: 'read',
    },
    {
      id: '2',
      text: 'Walaikum Assalam, ji bilkul available hai',
      sender: 'seller',
      senderImage: conversation.sellerImage,
      timestamp: '10:31 AM',
    },
    {
      id: '3',
      text: 'Price kya hai aur delivery kitne din mein hogi?',
      sender: 'buyer',
      senderImage: conversation.buyerImage,
      timestamp: '10:32 AM',
      status: 'read',
    },
    {
      id: '4',
      text: 'Price 5000 hai aur delivery 2-3 din mein ho jayegi',
      sender: 'seller',
      senderImage: conversation.sellerImage,
      timestamp: '10:33 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const [headerAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'buyer',
      senderImage: conversation.buyerImage,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'sent',
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate seller typing and reply
    setTimeout(() => setIsTyping(true), 1500);
    setTimeout(() => {
      setIsTyping(false);
      const reply = {
        id: (Date.now() + 1).toString(),
        text: 'Theek hai, main check kar ke batata hoon',
        sender: 'seller',
        senderImage: conversation.sellerImage,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages(prev => [...prev, reply]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 4000);
  };

  const renderMessage = ({ item, index }) => {
    const isBuyer = item.sender === 'buyer';
    const animValue = new Animated.Value(0);

    Animated.timing(animValue, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      useNativeDriver: true,
    }).start();

    return (
      <Animated.View
        style={[
          styles.messageContainer,
          isBuyer ? styles.buyerMessage : styles.sellerMessage,
          { opacity: animValue },
        ]}
      >
        {!isBuyer && (
          <Image source={{ uri: item.senderImage }} style={styles.messageAvatar} />
        )}

        <View
          style={[
            styles.messageBubble,
            isBuyer ? styles.buyerBubble : styles.sellerBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isBuyer ? styles.buyerText : styles.sellerText,
            ]}
          >
            {item.text}
          </Text>
          <View style={styles.messageFooter}>
            <Text
              style={[
                styles.messageTime,
                isBuyer ? styles.buyerTime : styles.sellerTime,
              ]}
            >
              {item.timestamp}
            </Text>
            {isBuyer && item.status && (
              <Icon
                name={
                  item.status === 'sent'
                    ? 'checkmark'
                    : item.status === 'delivered'
                    ? 'checkmark-done'
                    : 'checkmark-done'
                }
                size={14}
                color={item.status === 'read' ? '#00D68F' : 'rgba(255,255,255,0.7)'}
                style={styles.statusIcon}
              />
            )}
          </View>
        </View>

        {isBuyer && (
          <Image
            source={{ uri: item.senderImage }}
            style={[styles.messageAvatar, styles.buyerAvatar]}
          />
        )}
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#6C5CE7" />

      {/* Header */}
      <Animated.View
        style={[
          styles.chatHeader,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.chatHeaderInfo}>
          <View style={styles.headerAvatarContainer}>
            <Image
              source={{ uri: conversation.sellerImage }}
              style={styles.headerAvatar}
            />
            {conversation.online && <View style={styles.headerOnlineIndicator} />}
          </View>

          <View style={styles.headerTextContainer}>
            <Text style={styles.chatHeaderName}>{conversation.sellerName}</Text>
            <Text style={styles.chatHeaderStatus}>
              {conversation.online ? '● Active now' : 'Offline'}
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerActionButton}>
            <Icon name="call" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionButton}>
            <Icon name="videocam" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <Image
            source={{ uri: conversation.sellerImage }}
            style={styles.typingAvatar}
          />
          <View style={styles.typingBubble}>
            <View style={styles.typingDots}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
          </View>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="add-circle" size={28} color="#6C5CE7" />
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#B2BEC3"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity style={styles.emojiButton}>
            <Icon name="happy-outline" size={24} color="#636E72" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.sendButton,
            inputText.trim() && styles.sendButtonActive,
          ]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Icon
            name="send"
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
    paddingBottom: 16,
    backgroundColor: '#6C5CE7',
    elevation: 8,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    marginRight: 12,
  },
  chatHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerOnlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#00D68F',
    borderWidth: 2,
    borderColor: '#6C5CE7',
  },
  headerTextContainer: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  chatHeaderStatus: {
    fontSize: 13,
    color: '#DFE6E9',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerActionButton: {
    marginLeft: 16,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  buyerMessage: {
    alignSelf: 'flex-end',
  },
  sellerMessage: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  buyerAvatar: {
    marginLeft: 8,
    marginRight: 0,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buyerBubble: {
    backgroundColor: '#6C5CE7',
    borderBottomRightRadius: 4,
  },
  sellerBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  buyerText: {
    color: '#fff',
  },
  sellerText: {
    color: '#2D3436',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  messageTime: {
    fontSize: 11,
    fontWeight: '500',
  },
  buyerTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  sellerTime: {
    color: '#B2BEC3',
  },
  statusIcon: {
    marginLeft: 4,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  typingAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  typingBubble: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    elevation: 2,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B2BEC3',
    marginHorizontal: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#DFE6E9',
  },
  iconButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#2D3436',
    maxHeight: 100,
    paddingVertical: 6,
  },
  emojiButton: {
    marginLeft: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#B2BEC3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  sendButtonActive: {
    backgroundColor: '#6C5CE7',
    elevation: 4,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
});

export default ChatDetailScreen;