import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { 
  MessageSquare, 
  Search, 
  Plus, 
  X, 
  Send, 
  MoreVertical, 
  Paperclip, 
  Smile 
} from 'lucide-react';

interface Conversation {
  id: string;
  last_message: string;
  last_message_at: string;
  participant: {
    id: string;
    first_name: string;
    last_name: string;
    role: string;
    profile_picture: string | null;
  };
  unread_count: number;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender: {
    first_name: string;
    last_name: string;
    profile_picture: string | null;
  };
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  profile_picture: string | null;
  email: string | null;
}

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // New Chat Modal States
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  useEffect(() => {
    getCurrentUser();
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      const cleanup = subscribeToMessages(selectedConversation);
      markAsRead(selectedConversation);
      return cleanup;
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (showNewChatModal) {
      fetchAllUsers();
    }
  }, [showNewChatModal]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setCurrentUser(profile);
    }
  };

  const fetchAllUsers = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, first_name, last_name, role, profile_picture, email')
      .neq('id', user.id)
      .eq('account_status', 'active')
      .order('first_name', { ascending: true });

    if (data) {
      setAllUsers(data);
    }
  };

  const fetchConversations = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('conversation_participants')
      .select(`
        conversation_id,
        conversations!inner (
          id,
          last_message_at
        )
      `)
      .eq('user_id', user.id)
      .order('conversations(last_message_at)', { ascending: false });

    if (data && data.length > 0) {
      const conversationsWithDetails = await Promise.all(
        data.map(async (conv: any) => {
          const { data: participantData } = await supabase
            .from('conversation_participants')
            .select(`
              user_id,
              user_profiles (
                id,
                first_name,
                last_name,
                role,
                profile_picture
              )
            `)
            .eq('conversation_id', conv.conversations.id)
            .neq('user_id', user.id)
            .limit(1)
            .single();

          const { data: lastMessageData } = await supabase
            .from('messages')
            .select('content, created_at')
            .eq('conversation_id', conv.conversations.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.conversations.id)
            .eq('is_read', false)
            .neq('sender_id', user.id);

          const participantProfile = Array.isArray(participantData?.user_profiles)
            ? participantData.user_profiles[0]
            : participantData?.user_profiles;

          return {
            id: conv.conversations.id,
            last_message: lastMessageData?.content || 'No messages yet',
            last_message_at: lastMessageData?.created_at || conv.conversations.last_message_at,
            participant: participantProfile || {
              id: '',
              first_name: 'Unknown',
              last_name: 'User',
              role: '',
              profile_picture: null,
            },
            unread_count: count || 0,
          };
        })
      );

      setConversations(conversationsWithDetails);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        sender_id,
        created_at,
        sender:user_profiles!messages_sender_id_fkey (
          first_name,
          last_name,
          profile_picture
        )
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (data) {
      const transformedMessages: Message[] = data.map((msg: any) => {
        const senderData = Array.isArray(msg.sender) ? msg.sender[0] : msg.sender;
        
        return {
          id: msg.id,
          content: msg.content,
          sender_id: msg.sender_id,
          created_at: msg.created_at,
          sender: senderData || {
            first_name: 'Unknown',
            last_name: 'User',
            profile_picture: null,
          },
        };
      });

      setMessages(transformedMessages);
    }
  };

  const subscribeToMessages = (conversationId: string) => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const { data: sender } = await supabase
            .from('user_profiles')
            .select('first_name, last_name, profile_picture')
            .eq('id', payload.new.sender_id)
            .single();

          const newMessage: Message = {
            id: payload.new.id,
            content: payload.new.content,
            sender_id: payload.new.sender_id,
            created_at: payload.new.created_at,
            sender: sender || {
              first_name: 'Unknown',
              last_name: 'User',
              profile_picture: null,
            },
          };

          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = async (conversationId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id);

    await supabase
      .from('conversation_participants')
      .update({ last_read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !currentUser) return;

    const { error } = await supabase.from('messages').insert({
      conversation_id: selectedConversation,
      sender_id: currentUser.id,
      content: newMessage.trim(),
    });

    if (!error) {
      await supabase
        .from('conversations')
        .update({ 
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedConversation);

      setNewMessage('');
      fetchConversations();
    }
  };

  const startNewConversation = async (participantId: string) => {
    if (!currentUser) return;

    const { data: existingConv } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', currentUser.id);

    if (existingConv && existingConv.length > 0) {
      const conversationIds = existingConv.map(c => c.conversation_id);
      const { data: otherParticipant } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .in('conversation_id', conversationIds)
        .eq('user_id', participantId);

      if (otherParticipant && otherParticipant.length > 0) {
        setSelectedConversation(otherParticipant[0].conversation_id);
        setShowNewChatModal(false);
        return;
      }
    }

    const { data: newConv, error: convError } = await supabase
      .from('conversations')
      .insert({})
      .select()
      .single();

    if (newConv) {
      await supabase.from('conversation_participants').insert([
        { conversation_id: newConv.id, user_id: currentUser.id },
        { conversation_id: newConv.id, user_id: participantId },
      ]);

      setSelectedConversation(newConv.id);
      setShowNewChatModal(false);
      fetchConversations();
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    `${conv.participant?.first_name} ${conv.participant?.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch = `${user.first_name} ${user.last_name} ${user.email}`
      .toLowerCase()
      .includes(userSearchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const selectedConvData = conversations.find(
    (c) => c.id === selectedConversation
  );

  const getRoleBadgeColor = (role: string) => {
    const colors: { [key: string]: string } = {
      admin: 'bg-purple-100 text-purple-800',
      teacher: 'bg-blue-100 text-blue-800',
      student: 'bg-green-100 text-green-800',
      parent: 'bg-yellow-100 text-yellow-800',
      staff: 'bg-gray-100 text-gray-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
  };

  return (
    <div className="p-3 h-[calc(100vh-5rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages</h1>
            <p className="text-gray-600">Chat with teachers and parents</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewChatModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            New Chat
          </motion.button>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-3 gap-6 min-h-0">
          {/* Contacts Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Search */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-2">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                  <MessageSquare className="w-16 h-16 mb-4 text-gray-300" />
                  <p className="font-semibold text-center mb-2">No conversations yet</p>
                  <p className="text-sm text-center">Click + to start a new chat</p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredConversations.map((conv, index) => (
                    <motion.button
                      key={conv.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      whileHover={{ x: 4 }}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`
                        w-full p-3 rounded-xl cursor-pointer transition-all duration-300 mb-1 text-left
                        ${selectedConversation === conv.id 
                          ? 'bg-white shadow-lg' 
                          : 'hover:bg-white/60'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          {conv.participant?.profile_picture ? (
                            <img
                              src={conv.participant.profile_picture}
                              alt=""
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                              {getInitials(conv.participant?.first_name, conv.participant?.last_name)}
                            </div>
                          )}
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <p className="font-semibold text-sm text-gray-800 truncate">
                              {conv.participant?.first_name} {conv.participant?.last_name}
                            </p>
                            {conv.unread_count > 0 && (
                              <span className="flex-shrink-0 ml-2 px-2 py-0.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
                                {conv.unread_count}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate mb-1 capitalize">
                            {conv.participant?.role}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {conv.last_message}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-2 backdrop-blur-xl bg-white/80 rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/50">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      {selectedConvData?.participant?.profile_picture ? (
                        <img
                          src={selectedConvData.participant.profile_picture}
                          alt=""
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                          {getInitials(
                            selectedConvData?.participant?.first_name || '',
                            selectedConvData?.participant?.last_name || ''
                          )}
                        </div>
                      )}
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {selectedConvData?.participant?.first_name}{' '}
                        {selectedConvData?.participant?.last_name}
                      </h4>
                      <p className="text-xs text-green-600 font-medium">Online</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-white/60 rounded-xl transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="font-medium">No messages yet</p>
                        <p className="text-sm mt-1">Start the conversation!</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <AnimatePresence>
                        {messages.map((msg, index) => {
                          const isCurrentUser = msg.sender_id === currentUser?.id;
                          return (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.05 * index }}
                              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : ''}`}>
                                <div
                                  className={`
                                    px-4 py-3 rounded-2xl shadow-lg
                                    ${isCurrentUser
                                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm'
                                      : 'bg-white text-gray-800 rounded-bl-sm'
                                    }
                                  `}
                                >
                                  <p className="text-sm break-words">{msg.content}</p>
                                </div>
                                <p
                                  className={`text-xs text-gray-500 mt-1 ${
                                    isCurrentUser ? 'text-right' : 'text-left'
                                  }`}
                                >
                                  {formatTime(msg.created_at)}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-100 bg-white/50">
                  <form onSubmit={sendMessage} className="flex items-center gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-gray-600 hover:bg-white/60 rounded-xl transition-colors shrink-0"
                    >
                      <Paperclip className="w-5 h-5" />
                    </motion.button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-gray-600 hover:bg-white/60 rounded-xl transition-colors shrink-0"
                    >
                      <Smile className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={!newMessage.trim()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </motion.button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageSquare className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-semibold mb-2">Select a conversation</p>
                  <p className="text-sm">Choose from your existing conversations or start a new one</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* New Chat Modal */}
      <AnimatePresence>
        {showNewChatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewChatModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">Start New Chat</h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setShowNewChatModal(false);
                      setUserSearchQuery('');
                      setSelectedRole('all');
                    }}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Search */}
                <div className="relative group mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Role Filter */}
                <div className="flex gap-2 flex-wrap">
                  {['all', 'teacher', 'student', 'parent', 'staff', 'admin'].map((role) => (
                    <motion.button
                      key={role}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedRole(role)}
                      className={`
                        px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize
                        ${selectedRole === role
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      {role}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Users List */}
              <div className="flex-1 overflow-y-auto p-6">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="font-semibold text-lg mb-2">No users found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <AnimatePresence>
                      {filteredUsers.map((user, index) => (
                        <motion.button
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: 0.03 * index }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => startNewConversation(user.id)}
                          className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 rounded-xl border border-gray-100 transition-all text-left shadow-sm hover:shadow-md"
                        >
                          {/* Avatar */}
                          {user.profile_picture ? (
                            <img
                              src={user.profile_picture}
                              alt=""
                              className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                              {getInitials(user.first_name, user.last_name)}
                            </div>
                          )}

                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 truncate text-base">
                              {user.first_name} {user.last_name}
                            </h4>
                            <p className="text-sm text-gray-600 truncate">
                              {user.email || 'No email'}
                            </p>
                          </div>

                          {/* Role Badge */}
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize flex-shrink-0 ${getRoleBadgeColor(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
