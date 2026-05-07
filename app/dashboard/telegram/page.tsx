"use client";

import { useState, useRef, useEffect } from "react";

type FAQ = {
  id: number;
  question: string;
  answer: string;
};

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
  time: string;
};

type Conversation = {
  id: number;
  userName: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: Message[];
};

const initialFAQs: FAQ[] = [
  { id: 1, question: "What products do you offer?", answer: "We supply a wide range of plastic raw materials including PP (Polypropylene), PE (Polyethylene), PVC, ABS, PET, and PS. All products are sourced from top Chinese manufacturers like Sinopec, PetroChina, and Wanhua Chemical." },
  { id: 2, question: "What is the MOQ?", answer: "Our minimum order quantity is typically 20-25 metric tons per product grade, depending on the specific material. For mixed container orders, we can accommodate smaller quantities per grade with a total container minimum." },
  { id: 3, question: "Do you ship to Africa?", answer: "Yes! Africa is our primary market. We regularly ship to Nigeria (Lagos, Apapa), Kenya (Mombasa), Ghana (Tema), Tanzania (Dar es Salaam), South Africa (Durban), and many other African ports." },
  { id: 4, question: "What are the payment terms?", answer: "We accept T/T (30% deposit, 70% against B/L copy), L/C at sight, and D/P for established customers. We can discuss flexible payment arrangements for long-term partnerships." },
];

const initialConversations: Conversation[] = [
  {
    id: 1,
    userName: "Adebayo Ogundimu",
    avatar: "AO",
    lastMessage: "Thank you, I will check the quotation",
    lastTime: "14:30",
    unread: 0,
    messages: [
      { id: 1, sender: "user", text: "Hello, I'm interested in PP T30S. What's your best price?", time: "14:05" },
      { id: 2, sender: "bot", text: "Hello Adebayo! Thank you for your interest in our PP T30S. Our current price is $1,180/MT FOB Shanghai. For orders above 100 MT, we can offer a special discount. Would you like a detailed quotation?", time: "14:05" },
      { id: 3, sender: "user", text: "Yes please, I need 50 tons shipped to Lagos", time: "14:12" },
      { id: 4, sender: "bot", text: "I'll prepare a quotation for 50 MT PP T30S, CFR Lagos. Based on current freight rates, the estimated CFR price would be around $1,280-1,300/MT. I'll send you a formal quotation via email. Could you share your email address?", time: "14:12" },
      { id: 5, sender: "user", text: "Thank you, I will check the quotation", time: "14:30" },
    ],
  },
  {
    id: 2,
    userName: "Grace Nakamya",
    avatar: "GN",
    lastMessage: "How long is the delivery time to Mombasa?",
    lastTime: "11:20",
    unread: 1,
    messages: [
      { id: 1, sender: "user", text: "Hi, do you have HDPE 5000S in stock?", time: "11:00" },
      { id: 2, sender: "bot", text: "Hello Grace! Yes, we currently have HDPE 5000S in stock from both Sinopec and PetroChina. The current price is $1,095-1,130/MT depending on the manufacturer. Would you like more details?", time: "11:00" },
      { id: 3, sender: "user", text: "How long is the delivery time to Mombasa?", time: "11:20" },
    ],
  },
  {
    id: 3,
    userName: "Kwame Asante",
    avatar: "KA",
    lastMessage: "Can you send me the material data sheet?",
    lastTime: "Yesterday",
    unread: 0,
    messages: [
      { id: 1, sender: "user", text: "Good morning! I need PVC SG-5 for pipe production", time: "09:30" },
      { id: 2, sender: "bot", text: "Good morning Kwame! PVC SG-5 is one of our most popular products for pipe manufacturing. Our current price is $820/MT FOB. We source from Sinopec and Formosa Plastics, both excellent for pipe grade applications.", time: "09:31" },
      { id: 3, sender: "user", text: "What's the K-value of your PVC SG-5?", time: "09:45" },
      { id: 4, sender: "bot", text: "Our PVC SG-5 has a K-value of 66-68, which is ideal for pipe extrusion. It has excellent processability and mechanical properties. The bulk density is 0.45-0.55 g/ml and the volatiles content is below 0.3%.", time: "09:45" },
      { id: 5, sender: "user", text: "Can you send me the material data sheet?", time: "10:05" },
    ],
  },
];

const defaultConfig = {
  token: "7234567890:AAH_example_bot_token_here",
  welcomeMessage: "Welcome to SL Trade International! We are a leading supplier of plastic raw materials (PP, PE, PVC, ABS, PET, PS) from China to Africa.\n\nHow can I help you today?\n\n1. Product Information\n2. Price Inquiry\n3. Delivery & Logistics\n4. Payment Terms\n5. Talk to a Sales Rep",
  productInfo: "We supply premium plastic raw materials from China's top manufacturers:\n\n- PP (Polypropylene): T30S, S1003, EPS30R - $1,150-1,210/MT\n- PE (Polyethylene): HDPE 5000S, LLDPE 7042 - $1,050-1,130/MT\n- PVC (Polyvinyl Chloride): SG-5, SG-3 - $780-850/MT\n- ABS: PA-757, PA-747 - $1,580-1,670/MT\n- PET: CZ-318, CZ-302 - $920-985/MT\n- PS (Polystyrene): GPPS-525, HIPS-825 - $1,250-1,320/MT\n\nAll products available FOB/CFR/CIF to major African ports.",
};

export default function TelegramPage() {
  const [activeTab, setActiveTab] = useState<"config" | "conversations" | "test">("config");
  const [token, setToken] = useState(defaultConfig.token);
  const [welcomeMessage, setWelcomeMessage] = useState(defaultConfig.welcomeMessage);
  const [productInfo, setProductInfo] = useState(defaultConfig.productInfo);
  const [faqs, setFaqs] = useState<FAQ[]>(initialFAQs);
  const [showAddFAQ, setShowAddFAQ] = useState(false);
  const [faqForm, setFaqForm] = useState({ question: "", answer: "" });
  const [savedNotice, setSavedNotice] = useState(false);
  const [conversations] = useState<Conversation[]>(initialConversations);
  const [selectedConv, setSelectedConv] = useState<number>(1);
  const [testMessages, setTestMessages] = useState<Message[]>([
    { id: 1, sender: "bot", text: defaultConfig.welcomeMessage, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
  ]);
  const [testInput, setTestInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const testChatEndRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { key: "config" as const, label: "Bot Configuration" },
    { key: "conversations" as const, label: "Conversations" },
    { key: "test" as const, label: "Test Chat" },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConv]);

  useEffect(() => {
    testChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [testMessages]);

  const handleSaveConfig = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleAddFAQ = () => {
    if (!faqForm.question || !faqForm.answer) return;
    setFaqs([...faqs, { id: Date.now(), ...faqForm }]);
    setFaqForm({ question: "", answer: "" });
    setShowAddFAQ(false);
  };

  const handleDeleteFAQ = (id: number) => {
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  const selectedConversation = conversations.find((c) => c.id === selectedConv);

  const generateBotReply = (input: string): string => {
    const lower = input.toLowerCase();
    if (lower.includes("price") || lower.includes("cost") || lower.includes("how much")) {
      return "Here are our current prices (USD/MT, FOB China):\n\n- PP T30S: $1,180\n- PE HDPE 5000S: $1,130\n- PVC SG-5: $820\n- ABS PA-757: $1,670\n- PET CZ-318: $985\n- PS GPPS-525: $1,320\n\nPrices are updated weekly. For CFR/CIF pricing to your port, please specify the destination and quantity. Would you like a formal quotation?";
    }
    if (lower.includes("delivery") || lower.includes("shipping") || lower.includes("logistics") || lower.includes("ship")) {
      return "Our typical delivery timelines from China to Africa:\n\n- West Africa (Lagos, Tema): 30-35 days\n- East Africa (Mombasa, Dar es Salaam): 20-25 days\n- South Africa (Durban): 25-30 days\n\nWe work with major carriers including COSCO, MSC, Maersk, and Evergreen. Container tracking is available through our logistics dashboard. Would you like to know about a specific route?";
    }
    if (lower.includes("moq") || lower.includes("minimum") || lower.includes("quantity")) {
      return "Our standard MOQ is 20-25 MT per product grade, which is approximately one 20ft container. For mixed products, we offer flexible arrangements:\n\n- Full Container Load (FCL): 25 MT minimum\n- Less than Container Load (LCL): 5 MT minimum per grade\n- Trial orders: We can discuss smaller quantities for first-time buyers\n\nWhat quantity are you considering?";
    }
    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      return "Hello! Welcome to SL Trade International. We specialize in supplying plastic raw materials from China to African markets. How can I assist you today? Feel free to ask about our products, prices, delivery times, or payment terms.";
    }
    if (lower.includes("payment") || lower.includes("pay") || lower.includes("terms")) {
      return "We offer flexible payment terms:\n\n- T/T: 30% deposit + 70% against B/L copy\n- L/C: At sight, from confirmed banks\n- D/P: Available for established customers\n- Open Account: For long-term partners with credit history\n\nFor first orders, we recommend T/T or L/C. Would you like to discuss specific terms for your order?";
    }
    return "Thank you for your message! I'm here to help with any questions about our plastic raw materials. You can ask me about:\n\n- Product information & specifications\n- Current prices\n- Delivery times & logistics\n- Payment terms\n- Minimum order quantities\n\nOr I can connect you with one of our sales representatives for a more detailed discussion. What would you like to know?";
  };

  const handleSendTest = () => {
    if (!testInput.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { id: Date.now(), sender: "user", text: testInput, time: now };
    setTestMessages((prev) => [...prev, userMsg]);
    setTestInput("");

    setTimeout(() => {
      const botReply = generateBotReply(testInput);
      const botMsg: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setTestMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Telegram Bot Management</h1>
        <p className="text-gray-500 mt-1">Configure, monitor, and test your customer service bot</p>
      </div>

      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.key
                ? "text-primary-light after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-light"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "config" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Bot Token</h3>
            <div className="flex gap-3">
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
              />
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Verify
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Get your bot token from @BotFather on Telegram</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Welcome Message</h3>
            <textarea
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none resize-none"
            />
            <p className="text-xs text-gray-400 mt-2">This message is sent when a user starts the bot for the first time</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Product Information</h3>
            <textarea
              value={productInfo}
              onChange={(e) => setProductInfo(e.target.value)}
              rows={8}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none resize-none"
            />
            <p className="text-xs text-gray-400 mt-2">This information helps the bot answer product-related questions accurately</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">FAQ Settings</h3>
              <button
                onClick={() => setShowAddFAQ(true)}
                className="px-3 py-1.5 bg-primary-light hover:bg-primary text-white rounded-lg text-xs font-medium transition-colors"
              >
                + Add FAQ
              </button>
            </div>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">Q: {faq.question}</p>
                      <p className="text-sm text-gray-600">A: {faq.answer}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteFAQ(faq.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            {savedNotice && (
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Configuration saved successfully!
              </div>
            )}
            {!savedNotice && <div />}
            <button
              onClick={handleSaveConfig}
              className="px-6 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Save Configuration
            </button>
          </div>

          {showAddFAQ && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddFAQ(false)}>
              <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Add FAQ</h3>
                  <button onClick={() => setShowAddFAQ(false)} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                    <input
                      type="text"
                      value={faqForm.question}
                      onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                      placeholder="e.g. What is the delivery time?"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                    <textarea
                      value={faqForm.answer}
                      onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                      rows={4}
                      placeholder="Enter the bot's response..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none resize-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddFAQ(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddFAQ}
                    className="flex-1 px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "conversations" && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden" style={{ height: "calc(100vh - 240px)" }}>
          <div className="flex h-full">
            <div className="w-80 border-r border-gray-100 flex flex-col">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700">Conversations</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConv(conv.id)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                      selectedConv === conv.id ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {conv.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 truncate">{conv.userName}</span>
                        <span className="text-xs text-gray-400 shrink-0">{conv.lastTime}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center shrink-0">
                        {conv.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              {selectedConversation && (
                <>
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                      {selectedConversation.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{selectedConversation.userName}</p>
                      <p className="text-xs text-green-500">Online</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                    {selectedConversation.messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                            msg.sender === "user"
                              ? "bg-primary-light text-white rounded-tr-md"
                              : "bg-white border border-gray-100 text-gray-700 rounded-tl-md"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-blue-200" : "text-gray-400"}`}>{msg.time}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "test" && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden" style={{ height: "calc(100vh - 240px)" }}>
          <div className="flex flex-col h-full">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">SL Trade Bot</p>
                <p className="text-xs text-green-500">Test Mode</p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={() =>
                    setTestMessages([
                      {
                        id: Date.now(),
                        sender: "bot",
                        text: defaultConfig.welcomeMessage,
                        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                      },
                    ])
                  }
                  className="px-3 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-xs font-medium transition-colors"
                >
                  Reset Chat
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
              {testMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      msg.sender === "user"
                        ? "bg-primary-light text-white rounded-tr-md"
                        : "bg-white border border-gray-100 text-gray-700 rounded-tl-md"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-blue-200" : "text-gray-400"}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={testChatEndRef} />
            </div>

            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendTest();
                    }
                  }}
                  placeholder="Type a message to test the bot..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                />
                <button
                  onClick={handleSendTest}
                  className="px-5 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs text-gray-400">Quick test:</span>
                {["Hello", "What are your prices?", "Delivery time to Lagos?", "What is the MOQ?", "Payment terms?"].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setTestInput(q);
                    }}
                    className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
