"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Search, 
  MoreVertical, 
  Paperclip, 
  Smile,
  ChevronLeft,
  Circle,
  Phone,
  Video,
  ArrowLeft,
  MessageSquare,
  MapPin,
  Calendar,
  Image as ImageIcon,
  Loader2,
  Check,
  CheckCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/use-chat";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const { messages, typingUsers, sendMessage, setTypingStatus, isLoading } = useChat(selectedChat);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chats = [
    { id: '1', name: "Alice Johnson", image: "https://i.pravatar.cc/150?u=alice", lastMessage: "I found your keys in the lib!", time: "2m ago", online: true, item: "Lost Keys" },
    { id: '2', name: "Mark Wilson", image: "https://i.pravatar.cc/150?u=mark", lastMessage: "Is the laptop still available?", time: "1h ago", online: false, item: "MacBook Air" },
    { id: '3', name: "Professor Snape", image: "https://i.pravatar.cc/150?u=snape", lastMessage: "Please collect your wand.", time: "Yesterday", online: false, item: "Elder Wand" },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!messageInput.trim() || !selectedChat) return;
    const content = messageInput;
    setMessageInput("");
    await sendMessage(content, 'user_id_here'); // Replace with actual user ID
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    setTypingStatus(e.target.value.length > 0, 'user_id_here');
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-8">
      {/* Chat List */}
      <aside className={cn(
        "flex-col w-full md:w-96 space-y-6",
        selectedChat ? "hidden md:flex" : "flex"
      )}>
        <header className="flex items-center justify-between px-2">
          <h2 className="text-3xl font-black tracking-tighter">Messages</h2>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
            <Search className="w-6 h-6 text-muted-foreground" />
          </Button>
        </header>

        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {chats.map((chat) => (
            <GlassCard
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={cn(
                "p-4 cursor-pointer border-white/20 dark:border-white/5 !rounded-3xl transition-all",
                selectedChat === chat.id ? "bg-primary/20 border-primary/30 ring-1 ring-primary/20" : ""
              )}
            >
              <div className="flex gap-4">
                <div className="relative">
                  <Avatar className="w-14 h-14 rounded-2xl shadow-lg">
                    <AvatarImage src={chat.image} />
                    <AvatarFallback>{chat.name[0]}</AvatarFallback>
                  </Avatar>
                  {chat.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-black text-lg truncate">{chat.name}</h3>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{chat.time}</span>
                  </div>
                  <p className="text-xs font-black text-primary uppercase tracking-tighter mb-1">{chat.item}</p>
                  <p className="text-sm text-muted-foreground truncate font-medium">{chat.lastMessage}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className={cn(
        "flex-1 flex flex-col min-w-0",
        !selectedChat ? "hidden md:flex" : "flex"
      )}>
        {selectedChat ? (
          <GlassCard className="h-full flex flex-col p-0 border-white/20 dark:border-white/5 !rounded-[2.5rem] shadow-3xl overflow-hidden">
            {/* Chat Header */}
            <header className="p-6 md:p-8 flex items-center justify-between border-b border-white/10 bg-white/10 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="md:hidden rounded-full" onClick={() => setSelectedChat(null)}>
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                <Avatar className="w-14 h-14 rounded-2xl shadow-xl">
                  <AvatarImage src={chats.find(c => c.id === selectedChat)?.image} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-black tracking-tight">{chats.find(c => c.id === selectedChat)?.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <p className="text-xs text-emerald-500 font-bold uppercase tracking-wider">Online Now</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex hover:bg-primary/10">
                  <Phone className="w-5 h-5 text-primary" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex hover:bg-primary/10">
                  <Video className="w-5 h-5 text-primary" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                  <MoreVertical className="w-6 h-6 text-muted-foreground" />
                </Button>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="text-center">
                <Badge variant="outline" className="glass px-6 py-1.5 rounded-full border-white/20 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Match confirmed • Mar 24
                </Badge>
              </div>

              <Message 
                isOwn={false} 
                content="Hey! I found a MacBook in the library on floor 2. Is this yours?" 
                time="10:24 AM" 
              />
              <Message 
                isOwn={true} 
                content="Yes! I think it's mine! It has a green skin on the top?" 
                time="10:25 AM" 
              />
              <Message 
                isOwn={false} 
                content="Exactly! It's currently at the library help desk." 
                time="10:26 AM" 
              />
              <Message 
                isOwn={true} 
                content="Awesome, thank you so much! I'll head there now." 
                time="10:28 AM" 
              />
            </div>

            {/* Input Area */}
            <footer className="p-6 md:p-8 bg-white/5 backdrop-blur-md border-t border-white/10">
              <div className="relative flex items-center gap-4">
                <Button variant="ghost" size="icon" className="rounded-full shrink-0 hover:bg-primary/10">
                  <Paperclip className="w-6 h-6 text-primary" />
                </Button>
                <div className="relative flex-1">
                  <Input 
                    placeholder="Type your message here..." 
                    className="h-16 rounded-[1.5rem] glass border-none pl-6 pr-20 text-lg font-medium focus-visible:ring-primary/30"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button variant="ghost" size="icon" className="rounded-full w-12 h-12 hover:bg-primary/10">
                      <ImageIcon className="w-6 h-6 text-primary" />
                    </Button>
                    <Button className="rounded-[1rem] w-12 h-12 bg-primary text-white shadow-xl shadow-primary/20">
                      <Send className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
              </div>
            </footer>
          </GlassCard>
        ) : (
          <GlassCard className="h-full flex flex-col items-center justify-center space-y-6 border-white/10 !rounded-[2.5rem]">
            <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center">
               <MessageSquare className="w-12 h-12 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-black tracking-tighter">Your Messages</h3>
              <p className="text-lg text-muted-foreground font-medium">Select a chat to start coordinating a return.</p>
            </div>
          </GlassCard>
        )}
      </main>

      {/* Info Sidebar - Desktop */}
      {selectedChat && (
        <aside className="hidden xl:flex flex-col w-96 space-y-8 animate-in slide-in-from-right-10 duration-500">
           <GlassCard className="p-8 border-white/20 dark:border-white/5 !rounded-[2.5rem] text-center space-y-6">
              <Avatar className="w-32 h-32 rounded-[2rem] mx-auto shadow-2xl ring-4 ring-primary/10">
                <AvatarImage src={chats.find(c => c.id === selectedChat)?.image} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-2xl font-black tracking-tight">{chats.find(c => c.id === selectedChat)?.name}</h3>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">Student · 23-XXXX</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-2xl glass h-12 font-bold">Profile</Button>
                <Button className="flex-1 rounded-2xl bg-primary text-white h-12 font-bold shadow-lg shadow-primary/20">Report User</Button>
              </div>
           </GlassCard>

           <GlassCard className="p-8 border-white/20 dark:border-white/5 !rounded-[2.5rem] space-y-6">
              <h4 className="text-xl font-black tracking-tight">Shared Item</h4>
              <div className="aspect-video rounded-[1.5rem] overflow-hidden shadow-2xl relative group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop" alt="Item" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-black uppercase text-xs tracking-widest">View Post</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-wider">Location</p>
                    <p className="text-sm font-bold">Library Floor 2</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-wider">Date Found</p>
                    <p className="text-sm font-bold">March 24, 2026</p>
                  </div>
                </div>
              </div>
           </GlassCard>
        </aside>
      )}
    </div>
  );
}

function Message({ isOwn, content, time }: { isOwn: boolean, content: string, time: string }) {
  return (
    <div className={cn(
      "flex flex-col max-w-[85%] md:max-w-[70%]",
      isOwn ? "ml-auto items-end" : "mr-auto items-start"
    )}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={cn(
          "p-6 rounded-[2rem] text-lg font-medium shadow-2xl relative",
          isOwn 
            ? "bg-primary text-white !rounded-br-lg" 
            : "glass border-white/20 dark:border-white/10 !rounded-bl-lg"
        )}
      >
        {isOwn && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-[2rem]" />
        )}
        {content}
      </motion.div>
      <span className="text-[10px] font-black text-muted-foreground mt-2 uppercase tracking-widest">{time}</span>
    </div>
  );
}
