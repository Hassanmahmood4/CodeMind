import { useChat } from '../hooks/useChat';
import AppLayout from '../components/layout/AppLayout';
import ChatWindow from '../components/chat/ChatWindow';
import ChatInput from '../components/chat/ChatInput';

export default function ChatPage() {
  const { messages, sendMessage, loading, error } = useChat();
  const chatHistory = [];
  const currentChatId = null;

  const handleNewChat = () => {};
  const handleSelectChat = () => {};

  return (
    <AppLayout
      chatHistory={chatHistory}
      onSelectChat={handleSelectChat}
      onNewChat={handleNewChat}
      currentChatId={currentChatId}
    >
      {error && (
        <div className="mx-4 mt-2 rounded-xl bg-neutral-900 border border-neutral-800 px-5 py-3 text-sm text-neutral-200 shadow-sm shadow-black/20">
          {error}
        </div>
      )}
      <ChatWindow messages={messages} loading={loading} />
      <ChatInput onSend={sendMessage} disabled={loading} />
    </AppLayout>
  );
}
