 import { useNavigate } from "react-router-dom";
import { BackButton } from "../components/ui";
import { FaShieldAlt, FaEye, FaLock, FaUser, FaDatabase, FaExclamationTriangle, FaCheckCircle, FaEnvelope } from "react-icons/fa";

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-4 pb-20">
          {/* Header */}
          <div className="flex justify-between items-center">
            <BackButton onClick={() => navigate(-1)} label="Back" />
          </div>

          {/* Hero Section */}
          <div className="relative bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 p-6 rounded-3xl overflow-hidden text-white">
            <div className="top-0 right-0 absolute bg-white/10 rounded-full w-32 h-32 -translate-y-1/2 translate-x-1/2"></div>
            <div className="bottom-0 left-0 absolute bg-white/10 rounded-full w-24 h-24 -translate-x-1/2 translate-y-1/2"></div>
            <div className="z-10 relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex justify-center items-center bg-white/20 rounded-2xl w-12 h-12">
                  <FaShieldAlt className="text-2xl" />
                </div>
                <div>
                  <h1 className="font-poppins font-black text-2xl">Privacy Policy</h1>
                  <p className="text-white/80 text-sm">Last updated: January 2025</p>
                </div>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div className="bg-white dark:bg-slate-800 shadow-sm p-5 rounded-2xl">
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              At CoinEd, we take your privacy seriously. This Privacy Policy describes how we collect, use, disclose, 
              and safeguard your information when you use our educational platform. Please read this privacy policy carefully.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Section 1 */}
            <div className="bg-white dark:bg-slate-800 shadow-sm p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex justify-center items-center bg-blue-100 dark:bg-blue-900/50 rounded-xl w-10 h-10">
                  <FaUser className="text-blue-500" />
                </div>
                <h2 className="font-bold text-slate-800 dark:text-white text-lg">1. Information We Collect</h2>
              </div>
              <p className="mb-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-blue-500">•</span>
                  <span><strong>Account Information:</strong> Name, email address, password, role (student/teacher)</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-blue-500">•</span>
                  <span><strong>Profile Data:</strong> Avatar, color preferences, class assignments</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-blue-500">•</span>
                  <span><strong>Learning Data:</strong> Quiz scores, coin balances, quiz attempts, transaction history</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-blue-500">•</span>
                  <span><strong>Usage Data:</strong> How you interact with the platform</span>
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="bg-white dark:bg-slate-800 shadow-sm p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex justify-center items-center bg-green-100 dark:bg-green-900/50 rounded-xl w-10 h-10">
                  <FaCheckCircle className="text-green-500" />
                </div>
                <h2 className="font-bold text-slate-800 dark:text-white text-lg">2. How We Use Your Information</h2>
              </div>
              <p className="mb-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-green-500">•</span>
                  <span>Provide, maintain, and improve our educational services</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-green-500">•</span>
                  <span>Track student progress and quiz performance</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-green-500">•</span>
                  <span>Manage coin rewards and shop transactions</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-green-500">•</span>
                  <span>Send notifications about achievements and updates</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-green-500">•</span>
                  <span>Authenticate users and prevent fraud</span>
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="bg-white dark:bg-slate-800 shadow-sm p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex justify-center items-center bg-purple-100 dark:bg-purple-900/50 rounded-xl w-10 h-10">
                  <FaEye className="text-purple-500" />
                </div>
                <h2 className="font-bold text-slate-800 dark:text-white text-lg">3. Information Sharing</h2>
              </div>
              <p className="mb-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                We may share your information in the following situations:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-purple-500">•</span>
                  <span><strong>Teachers:</strong> Can view their students' progress, scores, and class assignments</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-purple-500">•</span>
                  <span><strong>Leaderboard:</strong> Student names and scores are visible to other students</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-purple-500">•</span>
                  <span><strong>Legal:</strong> When required by law or to protect rights</span>
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="bg-white dark:bg-slate-800 shadow-sm p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex justify-center items-center bg-amber-100 dark:bg-amber-900/50 rounded-xl w-10 h-10">
                  <FaLock className="text-amber-500" />
                </div>
                <h2 className="font-bold text-slate-800 dark:text-white text-lg">4. Data Security</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information. 
                Your password is encrypted, and we use industry-standard encryption for data transmission. 
                However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            {/* Section 5 */}
            <div className="bg-white dark:bg-slate-800 shadow-sm p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex justify-center items-center bg-teal-100 dark:bg-teal-900/50 rounded-xl w-10 h-10">
                  <FaDatabase className="text-teal-500" />
                </div>
                <h2 className="font-bold text-slate-800 dark:text-white text-lg">5. Data Retention</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                We retain your personal information as long as your account is active or as needed to provide you services. 
                You can request deletion of your account at any time. We may also retain certain information as required by law 
                or for legitimate business purposes.
              </p>
            </div>

            {/* Section 6 */}
            <div className="bg-white dark:bg-slate-800 shadow-sm p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex justify-center items-center bg-indigo-100 dark:bg-indigo-900/50 rounded-xl w-10 h-10">
                  <FaUser className="text-indigo-500" />
                </div>
                <h2 className="font-bold text-slate-800 dark:text-white text-lg">6. Your Rights</h2>
              </div>
              <p className="mb-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                You have the following rights regarding your data:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-indigo-500">•</span>
                  <span>Access and download your personal data</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-indigo-500">•</span>
                  <span>Correct inaccurate or incomplete data</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-indigo-500">•</span>
                  <span>Request deletion of your account and data</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-indigo-500">•</span>
                  <span>Opt-out of certain data collection</span>
                </li>
              </ul>
            </div>

            {/* Section 7 */}
            <div className="bg-white dark:bg-slate-800 shadow-sm p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex justify-center items-center bg-red-100 dark:bg-red-900/50 rounded-xl w-10 h-10">
                  <FaExclamationTriangle className="text-red-500" />
                </div>
                <h2 className="font-bold text-slate-800 dark:text-white text-lg">7. Children's Privacy</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                CoinEd is designed for educational purposes and may be used by students under 13 with teacher supervision. 
                We do not knowingly collect personal information from children under 13 without parental consent. 
                If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </div>

            {/* Section 8 */}
            <div className="bg-white dark:bg-slate-800 shadow-sm p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex justify-center items-center bg-blue-100 dark:bg-blue-900/50 rounded-xl w-10 h-10">
                  <FaShieldAlt className="text-blue-500" />
                </div>
                <h2 className="font-bold text-slate-800 dark:text-white text-lg">8. Changes to Policy</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last updated" date. You are advised to 
                review this Privacy Policy periodically for any changes.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-5 rounded-2xl text-white">
              <h3 className="mb-2 font-bold text-lg">Questions about Privacy?</h3>
              <p className="mb-3 text-white/80 text-sm">
                If you have any questions about this Privacy Policy, please contact us.
              </p>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-white/80" />
                <span className="font-bold text-sm">privacy@coined.edu</span>
              </div>
              <button
                onClick={() => navigate("/help")}
                className="bg-white hover:bg-white/90 mt-3 px-4 py-2 rounded-xl font-bold text-green-600 text-sm transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="py-4 text-center">
            <p className="text-slate-400 dark:text-slate-500 text-xs">
              © 2025 CoinEd. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

