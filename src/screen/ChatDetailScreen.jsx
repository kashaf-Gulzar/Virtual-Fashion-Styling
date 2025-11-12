import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ChatDetailScreen = ({ route, navigation }) => {
  // Get conversation data from navigation
  const { conversation } = route.params || {};
  
  // Safety check
  if (!conversation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No conversation data found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const flatListRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Assalam o Alaikum! Product available hai?',
      senderId: 'buyer',
      timestamp: '10:30 AM',
      read: true,
    },
    {
      id: '2',
      text: 'Wa Alaikum Assalam! Ji bilkul available hai',
      senderId: conversation.sellerId,
      timestamp: '10:31 AM',
      read: true,
    },
    {
      id: '3',
      text: 'Price kya hai aur delivery kitne din mein hogi?',
      senderId: 'buyer',
      timestamp: '10:32 AM',
      read: true,
    },
    {
      id: '4',
      text: 'Price 5000 hai aur delivery 2-3 din mein ho jayegi',
      senderId: conversation.sellerId,
      timestamp: '10:33 AM',
      read: false,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Log for debugging
  useEffect(() => {
    console.log('ChatDetailScreen opened for:', conversation.sellerName);
  }, []);

  // Mark messages as read when screen opens
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages(prevMessages =>
        prevMessages.map(msg => ({ ...msg, read: true }))
      );
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Simulate seller typing randomly
  useEffect(() => {
    const typingTimer = setTimeout(() => {
      if (Math.random() > 0.7) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    }, 5000);

    return () => clearTimeout(typingTimer);
  }, [messages]);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      senderId: 'buyer',
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      read: false,
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputText('');

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate seller reply after 2-3 seconds
    setTimeout(() => {
      const replies = [
        'Ji zaroor, main check kar raha hoon',
        'Theek hai, aapka order confirm kar deta hoon',
        'Bilkul, koi masla nahi',
        'Ji main aapko update kar dunga',
        'Ok, main details bhejta hoon',
        'InshAllah, sab theek ho jayega',
        'Main abhi stock check karta hoon',
        'Aap ka number dein please',
      ];
      
      const sellerReply = {
        id: (Date.now() + 1).toString(),
        text: replies[Math.floor(Math.random() * replies.length)],
        senderId: conversation.sellerId,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        read: false,
      };

      setMessages(prevMessages => [...prevMessages, sellerReply]);
      
      // Mark as read after 1 second
      setTimeout(() => {
        setMessages(prevMessages =>
          prevMessages.map(msg => 
            msg.id === sellerReply.id ? { ...msg, read: true } : msg
          )
        );
      }, 1000);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 2500);
  };

  const renderMessage = ({ item, index }) => {
    const isBuyer = item.senderId === 'buyer';
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
          <Image
            source={{ uri: conversation.sellerImage }}
            style={styles.messageAvatar}
          />
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
                styles.timestamp,
                isBuyer ? styles.buyerTimestamp : styles.sellerTimestamp,
              ]}
            >
              {item.timestamp}
            </Text>
            {isBuyer && (
              <Icon
                name={item.read ? 'checkmark-done' : 'checkmark'}
                size={16}
                color={item.read ? '#00D68F' : '#B2BEC3'}
                style={styles.readIcon}
              />
            )}
          </View>
        </View>

        {isBuyer && (
          <Image
            source={{ uri: conversation.buyerImage }}
            style={styles.messageAvatar}
          />
        )}
      </Animated.View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={[styles.messageContainer, styles.sellerMessage]}>
        <Image
          source={{ uri: conversation.sellerImage }}
          style={styles.messageAvatar}
        />
        <View style={[styles.messageBubble, styles.sellerBubble, styles.typingBubble]}>
          <View style={styles.typingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C5CE7" />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonHeader}
          onPress={() => {
            console.log('Going back to ChatList');
            navigation.goBack();
          }}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerCenter}>
          <Image
            source={{ uri: conversation.sellerImage }}
            style={styles.headerAvatar}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{conversation.sellerName}</Text>
            <View style={styles.statusContainer}>
              {conversation.online && (
                <View style={styles.onlineDot} />
              )}
              <Text style={styles.headerStatus}>
                {conversation.online ? 'Active now' : 'Offline'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="call" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="ellipsis-vertical" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }}
        ListFooterComponent={renderTypingIndicator}
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
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
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity style={styles.emojiButton}>
              <Icon name="happy-outline" size={24} color="#636E72" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() === '' && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={inputText.trim() === ''}
          >
            <Icon
              name="send"
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
  },
  errorText: {
    fontSize: 18,
    color: '#2D3436',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#6C5CE7',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
    paddingBottom: 12,
    backgroundColor: '#6C5CE7',
    elevation: 4,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButtonHeader: {
    marginRight: 12,
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00D68F',
    marginRight: 6,
  },
  headerStatus: {
    fontSize: 12,
    color: '#DFE6E9',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 16,
    padding: 4,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  buyerMessage: {
    justifyContent: 'flex-end',
  },
  sellerMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 1,
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
    marginTop: 4,
    justifyContent: 'flex-end',
  },
  timestamp: {
    fontSize: 11,
    marginRight: 4,
  },
  buyerTimestamp: {
    color: '#DFE6E9',
  },
  sellerTimestamp: {
    color: '#B2BEC3',
  },
  readIcon: {
    marginLeft: 2,
  },
  typingBubble: {
    paddingVertical: 12,
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
    marginHorizontal: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8E9ED',
  },
  attachButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F5F6FA',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#2D3436',
    maxHeight: 80,
    paddingTop: 8,
    paddingBottom: 8,
  },
  emojiButton: {
    marginLeft: 8,
    marginBottom: 4,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    elevation: 2,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#B2BEC3',
    elevation: 0,
  },
});

export default ChatDetailScreen;