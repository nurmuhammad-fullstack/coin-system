import { useNavigate } from "react-router-dom";
import { BackButton } from "../components/ui";
import { FaFileAlt, FaShieldAlt, FaCopyright, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

export default function TermsPage() {
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
          <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-6 rounded-3xl overflow-hidden text-white">
            <div className="top-0 right-0 absolute bg-white/10 rounded-full w-32 h-32 -translate-y-1/2 translate-x-1/2"></div>
            <div className="bottom-0 left-0 absolute bg-white/10 rounded-full w-24 h-24 -translate-x-1/2 translate-y-1/2"></div>
            <div className="z-10 relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex justify-center items-center bg-white/20 rounded-2xl w-12 h-12">
                  <FaFileAlt className="text-2xl" />
                </div>
                <div>
                  <h1 className="font-poppins font-black text-2xl">Terms of Service</h1>
                  <p className="text-white/80 text-sm">Last updated: January 2025</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Section 1 */}
            <div className="bg-white dark:bg-slate-800 shadow-sm p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex justify-center items-center bg-blue-100 dark:bg-blue-900/50 rounded-xl w-10 h-10">
                  <FaShieldAlt className="text-blue-500" />
                </div>
                <h2 className="font-bold text-slate-800 dark:text-white text-lg">1. Acceptance of Terms</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                By accessing and using CoinEd, you accept and agree to be bound by the terms and provision of this agreement. 
                Additionally, when using CoinEd's services, you shall be subject to any posted guidelines or rules applicable to such services.
              </p>
            </div>

            {/* Section 2 */}
            <div className="bg-white dark:bg-slate-800 shadow-sm p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex justify-center items-center bg-green-100 dark:bg-green-900/50 rounded-xl w-10 h-10">
                  <FaCheckCircle className="text-green-500" />
                </div>
                <h2 className="font-bold text-slate-800 dark:text-white text-lg">2. Use License</h2>
              </div>
              <p className="mb-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Permission is granted to temporarily use CoinEd for personal, non-commercial transitory viewing only. 
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-green-500">•</span>
                  <span>Modify or copy the materials</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-green-500">•</span>
                  <span>Use the materials for any commercial purpose</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-green-500">•</span>
                  <span>Transfer the materials to another person</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-green-500">•</span>
                  <span>Attempt to reverse engineer any software contained</span>
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="bg-white dark:bg-slate-800 shadow-sm p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex justify-center items-center bg-purple-100 dark:bg-purple-900/50 rounded-xl w-10 h-10">
                  <FaCopyright className="text-purple-500" />
                </div>
                <h2 className="font-bold text-slate-800 dark:text-white text-lg">3. Intellectual Property</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                The content on CoinEd, including but not limited to text, graphics, logos, images, audio clips, 
                video clips, and software, is the property of CoinEd and is protected by copyright laws. 
                Unauthorized use of any content from this website is strictly prohibited.
              </p>
            </div>

            {/* Section 4 */}
            <div className="bg-white dark:bg-slate-800 shadow-sm p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex justify-center items-center bg-amber-100 dark:bg-amber-900/50 rounded-xl w-10 h-10">
                  <FaExclamationTriangle className="text-amber-500" />
                </div>
                <h2 className="font-bold text-slate-800 dark:text-white text-lg">4. User Responsibilities</h2>
              </div>
              <p className="mb-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                As a user of CoinEd, you agree to:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-amber-500">•</span>
                  <span>Provide accurate and complete information</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-amber-500">•</span>
                  <span>Maintain the security of your account</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-amber-500">•</span>
                  <span>Not engage in any unlawful activity</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <span className="mt-1 text-amber-500">•</span>
                  <span>Not attempt to gain unauthorized access</span>
                </li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="bg-white dark:bg-slate-800 shadow-sm p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex justify-center items-center bg-red-100 dark:bg-red-900/50 rounded-xl w-10 h-10">
                  <FaExclamationTriangle className="text-red-500" />
                </div>
                <h2 className="font-bold text-slate-800 dark:text-white text-lg">5. Limitation of Liability</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                CoinEd shall not be liable for any indirect, incidental, special, consequential or punitive damages, 
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
                resulting from your access to or use of or inability to access or use the service.
              </p>
            </div>

            {/* Section 6 */}
            <div className="bg-white dark:bg-slate-800 shadow-sm p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex justify-center items-center bg-indigo-100 dark:bg-indigo-900/50 rounded-xl w-10 h-10">
                  <FaShieldAlt className="text-indigo-500" />
                </div>
                <h2 className="font-bold text-slate-800 dark:text-white text-lg">6. Changes to Terms</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                What constitutes a material change will be determined at our sole discretion. By continuing to 
                access or use our Service after any revisions become effective, you agree to be bound by the revised terms.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-5 rounded-2xl text-white">
              <h3 className="mb-2 font-bold text-lg">Questions about these Terms?</h3>
              <p className="mb-3 text-white/80 text-sm">
                If you have any questions about these Terms of Service, please contact us.
              </p>
              <button
                onClick={() => navigate("/help")}
                className="bg-white hover:bg-white/90 px-4 py-2 rounded-xl font-bold text-indigo-600 text-sm transition-colors"
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

