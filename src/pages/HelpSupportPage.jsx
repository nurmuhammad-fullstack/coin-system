import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Card, BackButton, SectionLabel } from "../components/ui";
import { 
  FaQuestionCircle, FaEnvelope, FaPhone, FaChevronDown, FaChevronUp,
  FaGraduationCap, FaCoins, FaShoppingCart, FaTrophy, FaClock, FaPaperPlane,
  FaHeadset, FaBook, FaLifeRing, FaComments, FaExternalLinkAlt, FaFileAlt, FaShieldAlt
} from "react-icons/fa";

const FAQS = [
  {
    category: "General",
    icon: FaQuestionCircle,
    questions: [
      {
        q: "What is CoinEd?",
        a: "CoinEd is an educational platform where students earn coins by completing quizzes and tasks. These coins can be used to purchase rewards from the shop."
      },
      {
        q: "How do I earn coins?",
        a: "You can earn coins by completing quizzes, achieving high scores, maintaining streaks, and participating in class activities. Your teacher determines the reward amounts."
      },
      {
        q: "How do I spend my coins?",
        a: "Visit the Shop section where you can browse and purchase available rewards. Your teacher manages the shop items and their prices."
      }
    ]
  },
  {
    category: "Quizzes & Tests",
    icon: FaGraduationCap,
    questions: [
      {
        q: "How do I take a quiz?",
        a: "Go to the Tests section from the bottom navigation. Select a quiz and click Start to begin. Make sure to answer all questions before the time runs out."
      },
      {
        q: "What happens if I fail a quiz?",
        a: "Don't worry! You can retake quizzes to improve your score. Check with your teacher about their specific policies on quiz attempts."
      },
      {
        q: "How are quiz scores calculated?",
        a: "Quiz scores are based on the number of correct answers. Your teacher sets the passing score and coin rewards for each quiz."
      }
    ]
  },
  {
    category: "Rewards & Shop",
    icon: FaShoppingCart,
    questions: [
      {
        q: "How do I redeem a reward?",
        a: "Go to the Rewards section, select the item you want, and click Redeem. The coins will be deducted from your balance immediately."
      },
      {
        q: "Can I get a refund for redeemed rewards?",
        a: "Refunds are handled on a case-by-case basis. Please contact your teacher if you have issues with a redeemed reward."
      },
      {
        q: "Why can't I see all rewards?",
        a: "Some rewards may have limited availability or specific requirements. Check the item details for any restrictions."
      }
    ]
  },
  {
    category: "Leaderboard",
    icon: FaTrophy,
    questions: [
      {
        q: "How does the leaderboard work?",
        a: "The leaderboard ranks students by their total coins earned. Rankings update in real-time as students complete quizzes and earn rewards."
      },
      {
        q: "Can I see my past rankings?",
        a: "Currently, you can view the current leaderboard. Historical rankings may be available in the future."
      }
    ]
  }
];

const QUICK_LINKS = [
  { icon: FaGraduationCap, label: "Take a Quiz", path: "/student/tests", color: "bg-blue-500" },
  { icon: FaShoppingCart, label: "Visit Shop", path: "/student/rewards", color: "bg-green-500" },
  { icon: FaTrophy, label: "Leaderboard", path: "/student/leaderboard", color: "bg-amber-500" },
  { icon: FaCoins, label: "My Wallet", path: "/student/wallet", color: "bg-brand-500" },
];

const CONTACT_OPTIONS = [
  { 
    icon: FaEnvelope, 
    label: "Email Support", 
    description: "Get help via email", 
    action: "support@coined.edu",
    color: "bg-red-500" 
  },
  { 
    icon: FaPhone, 
    label: "Phone Support", 
    description: "Mon-Fri, 9AM-5PM", 
    action: "+1 (555) 123-4567",
    color: "bg-green-500" 
  },
  { 
    icon: FaComments, 
    label: "Live Chat", 
    description: "Chat with us now", 
    action: "Start Chat",
    color: "bg-purple-500" 
  },
];

export default function HelpSupportPage() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [openFaq, setOpenFaq] = useState(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [activeTab, setActiveTab] = useState("faq");
  const [submitted, setSubmitted] = useState(false);

  const isStudent = currentUser?.role === "student";
  const isTeacher = currentUser?.role === "teacher";

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContactForm({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <BackButton onClick={() => navigate(-1)} label="Back" />
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-3xl overflow-hidden text-white">
        <div className="top-0 right-0 absolute bg-white/10 rounded-full w-32 h-32 -translate-y-1/2 translate-x-1/2"></div>
        <div className="bottom-0 left-0 absolute bg-white/10 rounded-full w-24 h-24 -translate-x-1/2 translate-y-1/2"></div>
        <div className="z-10 relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex justify-center items-center bg-white/20 rounded-2xl w-12 h-12">
              <FaHeadset className="text-2xl" />
            </div>
            <div>
              <h1 className="font-poppins font-black text-2xl">Help & Support</h1>
              <p className="text-white/80 text-sm">We're here to help you succeed!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="gap-2 grid grid-cols-4">
        {QUICK_LINKS.map((link, index) => (
          <button
            key={index}
            onClick={() => navigate(link.path)}
            className="flex flex-col items-center gap-2 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md p-3 rounded-2xl transition-all"
          >
            <div className={`w-10 h-10 ${link.color} rounded-xl flex items-center justify-center`}>
              <link.icon className="text-white text-lg" />
            </div>
            <span className="font-bold text-[10px] text-slate-600 dark:text-slate-300 text-center">{link.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab("faq")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === "faq" 
              ? "bg-white dark:bg-slate-700 text-indigo-500 shadow-sm" 
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          <FaQuestionCircle /> FAQ
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === "contact" 
              ? "bg-white dark:bg-slate-700 text-indigo-500 shadow-sm" 
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          <FaPaperPlane /> Contact
        </button>
      </div>

      {/* FAQ Section */}
      {activeTab === "faq" && (
        <div className="space-y-4">
          {FAQS.map((category, catIndex) => (
            <Card key={catIndex} className="overflow-hidden">
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 p-4 border-slate-100 dark:border-slate-600 border-b">
                <div className="flex justify-center items-center bg-indigo-100 dark:bg-indigo-900/50 rounded-xl w-10 h-10">
                  <category.icon className="text-indigo-500" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white">{category.category}</h3>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {category.questions.map((item, qIndex) => {
                  const globalIndex = `${catIndex}-${qIndex}`;
                  const isOpen = openFaq === globalIndex;
                  return (
                    <div key={qIndex}>
                      <button
                        onClick={() => toggleFaq(globalIndex)}
                        className="flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 p-4 w-full transition-colors"
                      >
                        <span className="font-bold text-slate-700 dark:text-slate-200 text-sm text-left">{item.q}</span>
                        {isOpen ? (
                          <FaChevronUp className="flex-shrink-0 text-slate-400" />
                        ) : (
                          <FaChevronDown className="flex-shrink-0 text-slate-400" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4">
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Contact Section */}
      {activeTab === "contact" && (
        <div className="space-y-4">
          {/* Contact Options */}
          <div className="gap-2 grid grid-cols-3">
            {CONTACT_OPTIONS.map((option, index) => (
              <button
                key={index}
                className="flex flex-col items-center gap-2 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md p-3 rounded-2xl transition-all"
              >
                <div className={`w-10 h-10 ${option.color} rounded-xl flex items-center justify-center`}>
                  <option.icon className="text-white text-lg" />
                </div>
                <span className="font-bold text-[10px] text-slate-600 dark:text-slate-300 text-center">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Contact Form */}
          <Card className="p-4">
            <h3 className="flex items-center gap-2 mb-4 font-bold text-slate-800 dark:text-white">
              <FaPaperPlane className="text-indigo-500" /> Send us a Message
            </h3>
            
            {submitted ? (
              <div className="py-8 text-center">
                <div className="flex justify-center items-center bg-green-100 dark:bg-green-900/50 mx-auto mb-4 rounded-full w-16 h-16">
                  <FaPaperPlane className="text-green-500 text-2xl" />
                </div>
                <p className="font-bold text-slate-800 dark:text-white">Message Sent!</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm">We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <div className="gap-3 grid grid-cols-2">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="bg-slate-50 dark:bg-slate-700 px-4 py-3 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full font-bold text-slate-800 dark:text-white text-sm placeholder-slate-400"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="bg-slate-50 dark:bg-slate-700 px-4 py-3 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full font-bold text-slate-800 dark:text-white text-sm placeholder-slate-400"
                    required
                  />
                </div>
                <select
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="bg-slate-50 dark:bg-slate-700 px-4 py-3 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full font-bold text-slate-800 dark:text-white text-sm"
                  required
                >
                  <option value="">Select Subject</option>
                  <option value="general">General Question</option>
                  <option value="quiz">Quiz Issue</option>
                  <option value="coins">Coins & Rewards</option>
                  <option value="account">Account Problem</option>
                  <option value="technical">Technical Issue</option>
                  <option value="other">Other</option>
                </select>
                <textarea
                  placeholder="Describe your issue..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={4}
                  className="bg-slate-50 dark:bg-slate-700 px-4 py-3 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full font-bold text-slate-800 dark:text-white text-sm resize-none placeholder-slate-400"
                  required
                />
                <button
                  type="submit"
                  className="flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-500 hover:from-indigo-600 to-purple-500 hover:to-purple-600 py-3 rounded-xl w-full font-bold text-white transition-all"
                >
                  <FaPaperPlane /> Send Message
                </button>
              </form>
            )}
          </Card>

          {/* Help Resources */}
          <Card className="p-4">
            <h3 className="flex items-center gap-2 mb-4 font-bold text-slate-800 dark:text-white">
              <FaBook className="text-indigo-500" /> Help Resources
            </h3>
            <div className="space-y-2">
              {[
                { icon: FaLifeRing, label: "Getting Started Guide", desc: "Learn the basics" },
                { icon: FaGraduationCap, label: "Video Tutorials", desc: "Watch how-to videos" },
                { icon: FaQuestionCircle, label: "Community Forum", desc: "Ask other users" },
              ].map((resource, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/50 dark:hover:bg-slate-700 p-3 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex justify-center items-center bg-indigo-100 dark:bg-indigo-900/50 rounded-xl w-10 h-10">
                    <resource.icon className="text-indigo-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 dark:text-white text-sm">{resource.label}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">{resource.desc}</p>
                  </div>
                  <FaExternalLinkAlt className="text-slate-400" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Footer */}
      <div className="py-4 text-center">
        <p className="text-slate-400 dark:text-slate-500 text-xs">
          © 2025 CoinEd. All rights reserved.
        </p>
        <div className="flex justify-center gap-3 mt-2">
          <Link to="/terms" className="text-slate-400 hover:text-brand-500 dark:text-slate-500 text-xs transition-colors">
            <span className="flex items-center gap-1"><FaFileAlt /> Terms</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <Link to="/privacy" className="text-slate-400 hover:text-brand-500 dark:text-slate-500 text-xs transition-colors">
            <span className="flex items-center gap-1"><FaShieldAlt /> Privacy</span>
          </Link>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}

