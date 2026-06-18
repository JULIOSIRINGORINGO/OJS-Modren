"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, Search, Loader2, Inbox, Bell, PlusCircle } from "lucide-react";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchMessages, sendMessage, fetchUsers, getCurrentUser } from "@/lib/api-client";

interface User {
  id: any;
  name: string;
  email: string;
  role: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<{ received: any[]; sent: any[] }>({ received: [], sent: [] });
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Navigation tabs:
  // For author: "pesan" | "sistem"
  // For editor: "pesan_masuk" | "kirim"
  const [activeTab, setActiveTab] = useState<string>("");
  
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  // New message form states (for Editor "Kirim" tab)
  const [newReceiverId, setNewReceiverId] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newMsgError, setNewMsgError] = useState("");
  const [newMsgSuccess, setNewMsgSuccess] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    setCurrentUser(u);
    
    // Set default active tab based on role
    const role = u?.role?.toLowerCase();
    if (role === "editor" || role === "admin") {
      setActiveTab("pesan_masuk");
      // Fetch users for composer
      fetchUsers().then(setUsers).catch(console.error);
    } else {
      setActiveTab("pesan");
    }

    fetchMessages()
      .then(setMessages)
      .finally(() => setLoading(false));
  }, []);

  // Helper to determine system notifications
  const isSystemNotification = (msg: any) => {
    const subj = msg.subject || "";
    return subj.startsWith("Naskah Berhasil Dikirim") ||
           subj.startsWith("Pembaruan Status Naskah") ||
           subj.startsWith("Revisi Naskah Diterima") ||
           subj.startsWith("[Revisi Masuk]");
  };

  // Process and group Direct Messages into Conversation Threads
  const groupMessagesIntoConversations = (receivedMsgs: any[], sentMsgs: any[]) => {
    const conversationsMap: Record<string, any> = {};

    const directReceived = receivedMsgs.filter(msg => !isSystemNotification(msg));
    const directSent = sentMsgs.filter(msg => !isSystemNotification(msg));

    const processMessage = (msg: any, partnerKey: 'sender' | 'receiver') => {
      const partner = msg[partnerKey];
      if (!partner) return;
      const partnerId = partner.id?.toString();
      if (!partnerId) return;

      if (!conversationsMap[partnerId]) {
        conversationsMap[partnerId] = {
          partner: partner,
          messages: [],
          unread: false
        };
      }

      conversationsMap[partnerId].messages.push(msg);
      if (partnerKey === 'sender' && !msg.read) {
        conversationsMap[partnerId].unread = true;
      }
    };

    directReceived.forEach(msg => processMessage(msg, 'sender'));
    directSent.forEach(msg => processMessage(msg, 'receiver'));

    const list = Object.values(conversationsMap).map((conv: any) => {
      // Sort messages chronologically (oldest first)
      conv.messages.sort((a: any, b: any) => 
        new Date(a.createdAt || a.created_at).getTime() - new Date(b.createdAt || b.created_at).getTime()
      );
      conv.lastMessage = conv.messages[conv.messages.length - 1];
      return conv;
    });

    // Sort conversations by latest message timestamp
    list.sort((a: any, b: any) => 
      new Date(b.lastMessage.createdAt || b.lastMessage.created_at).getTime() - 
      new Date(a.lastMessage.createdAt || a.lastMessage.created_at).getTime()
    );

    return list;
  };

  const conversations = groupMessagesIntoConversations(messages.received, messages.sent);
  const systemNotifications = messages.received.filter(isSystemNotification);

  // Send Direct Message Reply
  const handleSendReply = async (receiverEmail: string, subject: string) => {
    if (!replyText.trim()) return;
    setSending(true);
    try {
      await sendMessage({
        receiver_email: receiverEmail,
        subject: subject.startsWith("Re:") ? subject : `Re: ${subject}`,
        body: replyText,
      });
      setReplyText("");
      const fresh = await fetchMessages();
      setMessages(fresh);
    } catch (err) {
      console.error("Gagal mengirim balasan:", err);
    } finally {
      setSending(false);
    }
  };

  // Compose and Send New Message (Editor only)
  const handleCreateNewMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReceiverId || !newSubject.trim() || !newBody.trim()) {
      setNewMsgError("Semua bidang wajib diisi.");
      return;
    }
    setSending(true);
    setNewMsgError("");
    try {
      await sendMessage({
        receiver_id: newReceiverId,
        subject: newSubject,
        body: newBody,
      });
      setNewMsgSuccess(true);
      setNewSubject("");
      setNewBody("");
      
      // Refresh messages and go back to inbox
      const fresh = await fetchMessages();
      setMessages(fresh);
      setTimeout(() => {
        setNewMsgSuccess(false);
        setActiveTab("pesan_masuk");
        setSelectedIdx(0);
      }, 1500);
    } catch (err: any) {
      setNewMsgError(err?.message || "Gagal mengirimkan pesan.");
    } finally {
      setSending(false);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const renderMessageBody = (text: string) => {
    if (!text) return null;
    
    // Support either "Catatan Editor:" or "Keterangan Revisi:"
    let label = "Catatan Editor:";
    let parts = text.split("Catatan Editor:");
    if (parts.length <= 1) {
      parts = text.split("Keterangan Revisi:");
      label = "Keterangan Revisi:";
    }

    if (parts.length > 1) {
      return (
        <span className="whitespace-pre-wrap">
          {parts[0]}
          <strong className="block mt-2 font-black text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300">
            {label}
          </strong>
          <strong className="block mt-1 bg-amber-100/40 dark:bg-amber-950/20 p-3 border-l-4 border-amber-500 font-extrabold text-foreground rounded-r-lg">
            {parts[1].trim()}
          </strong>
        </span>
      );
    }
    return <span className="whitespace-pre-wrap">{text}</span>;
  };

  const isEditor = currentUser?.role?.toLowerCase() === "editor" || currentUser?.role?.toLowerCase() === "admin";

  return (
    <div className="flex flex-col h-full w-full bg-background">
      <DashboardNavbar
        title="Pesan & Diskusi"
        subtitle="Berkomunikasi dan pantau seluruh korespondensi mengenai naskah Anda."
        icon={MessageSquare}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 max-w-6xl w-full mx-auto">
          <div className="bg-card rounded-2xl border-[3px] border-black flex flex-col md:flex-row overflow-hidden shadow-[5px_5px_0px_0px_var(--neo-shadow-color)] h-[600px]">
            {/* Sidebar List Pesan / Percakapan */}
            <div className="w-full md:w-1/3 border-r-[3px] border-sidebar-border flex flex-col bg-purple-50/20 dark:bg-purple-950/5">
              
              {/* Tab Switcher berdasarkan Peran */}
              <div className="flex border-b-2 border-sidebar-border bg-white dark:bg-zinc-900">
                {isEditor ? (
                  // Editor / Admin Tabs
                  <>
                    <button
                      onClick={() => { setActiveTab("pesan_masuk"); setSelectedIdx(0); }}
                      className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider transition-all border-b-[3px] ${
                        activeTab === "pesan_masuk"
                          ? "bg-purple-100/70 text-purple-700 border-primary dark:bg-purple-950/30 dark:text-purple-300"
                          : "border-transparent text-muted-foreground hover:bg-purple-100/40 hover:text-purple-600"
                      }`}
                    >
                      Pesan Masuk ({conversations.length})
                    </button>
                    <button
                      onClick={() => { setActiveTab("kirim"); }}
                      className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider transition-all border-b-[3px] flex items-center justify-center gap-1.5 ${
                        activeTab === "kirim"
                          ? "bg-purple-100/70 text-purple-700 border-primary dark:bg-purple-950/30 dark:text-purple-300"
                          : "border-transparent text-muted-foreground hover:bg-purple-100/40 hover:text-purple-600"
                      }`}
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Kirim
                    </button>
                  </>
                ) : (
                  // Author Tabs
                  <>
                    <button
                      onClick={() => { setActiveTab("pesan"); setSelectedIdx(0); }}
                      className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider transition-all border-b-[3px] ${
                        activeTab === "pesan"
                          ? "bg-purple-100/70 text-purple-700 border-primary dark:bg-purple-950/30 dark:text-purple-300"
                          : "border-transparent text-muted-foreground hover:bg-purple-100/40 hover:text-purple-600"
                      }`}
                    >
                      Pesan ({conversations.length})
                    </button>
                    <button
                      onClick={() => { setActiveTab("sistem"); setSelectedIdx(0); }}
                      className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider transition-all border-b-[3px] flex items-center justify-center gap-1.5 ${
                        activeTab === "sistem"
                          ? "bg-purple-100/70 text-purple-700 border-primary dark:bg-purple-950/30 dark:text-purple-300"
                          : "border-transparent text-muted-foreground hover:bg-purple-100/40 hover:text-purple-600"
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5" /> Sistem ({systemNotifications.length})
                    </button>
                  </>
                )}
              </div>

              {/* Search Bar */}
              {activeTab !== "kirim" && (
                <div className="p-4 border-b-2 border-sidebar-border bg-purple-50/50 dark:bg-purple-950/20">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Input placeholder="Cari obrolan..." className="pl-9 h-9 text-[13px]" />
                  </div>
                </div>
              )}

              {/* Sidebar list items */}
              <div className="flex-1 overflow-y-auto divide-y-2 divide-sidebar-border">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                ) : activeTab === "sistem" ? (
                  // Render System Notifications list
                  systemNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                      <Inbox className="w-8 h-8 text-muted-foreground/40 mb-2" />
                      <p className="text-xs font-bold text-muted-foreground text-center">Tidak ada notifikasi sistem</p>
                    </div>
                  ) : (
                    systemNotifications.map((notif, idx) => (
                      <div
                        key={notif.id}
                        onClick={() => setSelectedIdx(idx)}
                        className={`p-4 cursor-pointer transition-all relative border-b border-sidebar-border/50 ${
                          selectedIdx === idx
                            ? "bg-purple-100 text-foreground dark:bg-purple-950/40"
                            : "hover:bg-purple-100/50 text-muted-foreground hover:text-foreground dark:hover:bg-purple-950/20"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-[13px] font-black text-foreground truncate pr-2">
                            {notif.subject}
                          </h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0 mt-0.5">
                            {new Date(notif.createdAt || notif.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                        <p className="text-[11px] text-primary font-black uppercase tracking-wider mb-1">SISTEM</p>
                        <p className="text-[12px] truncate text-muted-foreground font-medium">
                          {notif.body?.slice(0, 80)}...
                        </p>
                      </div>
                    ))
                  )
                ) : activeTab === "kirim" && isEditor ? (
                  // Show editor compose helper status in sidebar
                  <div className="p-5 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Formulir pengiriman pesan baru aktif.
                  </div>
                ) : (
                  // Render Conversation Threads
                  conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                      <Inbox className="w-8 h-8 text-muted-foreground/40 mb-2" />
                      <p className="text-xs font-bold text-muted-foreground text-center">Tidak ada percakapan</p>
                    </div>
                  ) : (
                    conversations.map((conv, idx) => {
                      const isUnread = conv.unread;
                      const partnerName = conv.partner?.name || "Pengguna";
                      const lastMsg = conv.lastMessage;
                      return (
                        <div
                          key={conv.partner.id}
                          onClick={() => setSelectedIdx(idx)}
                          className={`p-4 cursor-pointer transition-all relative border-b border-sidebar-border/50 ${
                            selectedIdx === idx
                              ? "bg-purple-100 text-foreground dark:bg-purple-950/40"
                              : `hover:bg-purple-100/50 text-muted-foreground hover:text-foreground dark:hover:bg-purple-950/20 ${
                                  isUnread ? "bg-purple-50/40 dark:bg-purple-950/10" : ""
                                }`
                          }`}
                        >
                          {isUnread && (
                            <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-r-md"></span>
                          )}
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-[13px] truncate pr-2 ${isUnread ? "font-black text-foreground" : "font-extrabold text-foreground/85"}`}>
                              {partnerName}
                            </h4>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0 mt-0.5">
                              {new Date(lastMsg.createdAt || lastMsg.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                            </span>
                          </div>
                          <p className="text-[11px] text-primary font-black uppercase tracking-wider mb-1">{conv.partner.role?.toUpperCase()}</p>
                          <p className={`text-[12px] truncate ${isUnread ? "text-foreground font-extrabold" : "text-muted-foreground font-medium"}`}>
                            {lastMsg.body?.slice(0, 80)}...
                          </p>
                        </div>
                      );
                    })
                  )
                )}
              </div>
            </div>

            {/* Chat/Content Pane */}
            <div className="flex-1 flex flex-col bg-card">
              {activeTab === "kirim" && isEditor ? (
                // Send/Compose Message Form for Editor
                <form onSubmit={handleCreateNewMessage} className="flex-1 p-6 flex flex-col gap-5 overflow-y-auto bg-purple-50/10 dark:bg-purple-950/5">
                  <div>
                    <h3 className="text-[15px] font-black uppercase tracking-wider text-foreground">Kirim Pesan Baru</h3>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                      Hubungi penulis atau rekan redaksi mengenai naskah atau pengumuman lainnya.
                    </p>
                  </div>

                  {newMsgSuccess && (
                    <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                      Pesan berhasil dikirimkan!
                    </div>
                  )}

                  {newMsgError && (
                    <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-700 text-xs font-bold uppercase tracking-wider">
                      {newMsgError}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-foreground">Penerima Pesan (User)</Label>
                    <select
                      value={newReceiverId}
                      onChange={(e) => setNewReceiverId(e.target.value)}
                      className="w-full flex h-10 items-center justify-between rounded-xl border-2 border-black bg-white px-3 py-2 text-sm text-black shadow-sm font-sans"
                    >
                      <option value="">Pilih pengguna tujuan...</option>
                      {users
                        .filter(u => u.id !== currentUser?.id)
                        .map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name} ({u.role}) - {u.email}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-foreground">Subjek</Label>
                    <Input
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="Masukkan subjek obrolan..."
                      className="bg-white border-2 border-black rounded-xl text-sm"
                    />
                  </div>

                  <div className="space-y-2 flex-1 flex flex-col">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-foreground">Isi Pesan</Label>
                    <Textarea
                      value={newBody}
                      onChange={(e) => setNewBody(e.target.value)}
                      placeholder="Tuliskan pesan Anda..."
                      className="flex-1 bg-white border-2 border-black rounded-xl text-sm min-h-[150px] resize-none"
                    />
                  </div>

                  <div className="flex justify-end pt-4 border-t-2 border-dashed border-sidebar-border">
                    <Button
                      type="submit"
                      disabled={sending}
                      className="neo-btn text-xs font-black uppercase tracking-wider px-6 text-white border-2 border-black shadow-[3px_3px_0px_0px_#000] bg-primary"
                    >
                      {sending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin text-white" /> Mengirim...</> : "Kirim Pesan"}
                    </Button>
                  </div>
                </form>
              ) : activeTab === "sistem" ? (
                // Render System Notification details (No reply form)
                (() => {
                  const selectedNotif = systemNotifications[selectedIdx];
                  if (!selectedNotif) {
                    return (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <Bell className="w-12 h-12 text-muted-foreground/30 mb-3" />
                        <p className="text-sm font-black text-foreground">Pilih Pemberitahuan</p>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">
                          Pilih pemberitahuan dari daftar sebelah kiri.
                        </p>
                      </div>
                    );
                  }
                  return (
                    <>
                      <div className="p-4 border-b-[3px] border-sidebar-border flex items-center justify-between bg-purple-50/40 dark:bg-purple-950/10">
                        <div>
                          <h3 className="text-[14px] font-black uppercase tracking-wider text-foreground">{selectedNotif.subject}</h3>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                            Notifikasi Otomatis Sistem
                          </p>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-6 flex flex-col bg-white dark:bg-zinc-900">
                        <div className="px-5 py-4 rounded-2xl border-2 border-black bg-purple-50/30 text-foreground font-medium text-[13px] leading-relaxed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          {renderMessageBody(selectedNotif.body)}
                          <p className="text-[10px] font-bold uppercase tracking-wider mt-4 text-zinc-550 text-right">
                            {new Date(selectedNotif.createdAt || selectedNotif.created_at).toLocaleString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>
                      </div>
                    </>
                  );
                })()
              ) : (
                // Render Conversation Thread (Bubble Chat)
                (() => {
                  const selectedConv = conversations[selectedIdx];
                  if (!selectedConv) {
                    return (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <MessageSquare className="w-12 h-12 text-muted-foreground/30 mb-3" />
                        <p className="text-sm font-black text-foreground">Tidak ada obrolan dipilih</p>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">
                          Pilih percakapan dari daftar sebelah kiri.
                        </p>
                      </div>
                    );
                  }
                  return (
                    <>
                      <div className="p-4 border-b-[3px] border-sidebar-border flex items-center justify-between bg-purple-50/40 dark:bg-purple-950/10">
                        <div>
                          <h3 className="text-[14px] font-black uppercase tracking-wider text-foreground">{selectedConv.partner.name}</h3>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                            {selectedConv.partner.role} · {selectedConv.partner.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-purple-50/10 dark:bg-purple-950/5">
                        {selectedConv.messages.map((msg: any) => {
                          const isMe = String(msg.sender?.id) === String(currentUser?.id);
                          return (
                            <div key={msg.id} className={`flex items-end gap-3 ${isMe ? "justify-end" : ""}`}>
                              {!isMe && (
                                <Avatar className="w-8 h-8 shrink-0">
                                  <AvatarFallback className="bg-purple-100 text-purple-700 border-2 border-black font-extrabold text-xs shadow-[2px_2px_0px_0px_#000000]">
                                    {getInitials(selectedConv.partner.name)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] shadow-sm ${
                                !isMe
                                  ? "bg-purple-100/80 dark:bg-purple-900/20 border-2 border-sidebar-border text-foreground rounded-bl-sm"
                                  : "bg-primary text-primary-foreground border-2 border-black rounded-br-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                              }`}>
                                <p className="text-[13px] font-medium leading-relaxed">
                                  {renderMessageBody(msg.body)}
                                </p>
                                <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 text-right ${
                                  !isMe ? "text-muted-foreground" : "text-primary-foreground/70"
                                }`}>
                                  {new Date(msg.createdAt || msg.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Reply Input Area */}
                      <div className="p-4 border-t-[3px] border-sidebar-border bg-purple-50/30 dark:bg-purple-950/10">
                        <div className="flex items-center gap-2">
                          <Input
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Ketik balasan Anda ke ${selectedConv.partner.name}...`}
                            className="flex-1 bg-white border-2 border-black rounded-xl text-sm"
                            onKeyDown={(e) => e.key === "Enter" && handleSendReply(selectedConv.partner.email, selectedConv.lastMessage.subject)}
                          />
                          <Button
                            size="icon"
                            className="shrink-0 neo-btn rounded-xl border-2 border-black text-white bg-primary shadow-[2px_2px_0px_0px_#000]"
                            onClick={() => handleSendReply(selectedConv.partner.email, selectedConv.lastMessage.subject)}
                            disabled={sending || !replyText.trim()}
                          >
                            {sending ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Send className="w-4 h-4 text-white" />}
                          </Button>
                        </div>
                      </div>
                    </>
                  );
                })()
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
