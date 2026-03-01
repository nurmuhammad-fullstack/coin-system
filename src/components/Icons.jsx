import { 
  FaCoins, FaHome, FaWallet, FaGift, FaEdit, FaUser, FaTrophy, 
  FaPlus, FaTrash, FaCheck, FaTimes, FaGraduationCap, FaChalkboardTeacher,
  FaUsers, FaStore, FaStar, FaFire, FaLightbulb, FaBook, FaBullseye,
  FaMedal, FaCrown, FaChartBar, FaMoneyBillWave, FaList, FaAward,
  FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSearch, FaFilter,
  FaEditAlt, FaTrashAlt, FaPlusCircle, FaMinusCircle, FaCheckCircle,
  FaTimesCircle, FaArrowUp, FaArrowDown, FaChevronRight, FaChevronLeft,
  FaSignOutAlt, FaCog, FaBell, FaQuestionCircle, FaInfoCircle,
  FaExclamationTriangle, FaCheckDouble, FaUniversity, FaMoneyBill,
  FaCreditCard, FaExchangeAlt, FaHistory, FaUserPlus, FaUserMinus,
  FaUserGraduate, FaClipboardList, FaClipboardCheck, FaPoll, FaBarcode,
  FaTag, FaTags, FaBox, FaBoxOpen, FaShoppingCart, FaShoppingBag,
  FaMoneyCheck, FaDollarSign, FaPercentage, FaChartLine, FaChartPie,
  FaSortAmountDown, FaSortAmountUp, FaRandom, FaSync, FaRedo, FaUndo,
  FaLevelUpAlt, FaLevelDownAlt, FaCaretUp, FaCaretDown, FaSortUp,
  FaSortDown, FaArrowAltCircleUp, FaArrowAltCircleDown, FaAsterisk,
  FaBan, FaBackspace, FaBackward, FaFastForward, FaPlay, FaPause,
  FaStop, FaStepForward, FaStepBackward, FaEject, FaExpand, FaCompress,
  FaExpandArrowsAlt, FaCompressArrowsAlt, FaMobileAlt, FaDesktop,
  FaLaptop, FaTabletAlt, FaWifi, FaBluetooth, FaBluetoothB, FaCloud,
  FaCloudUpload, FaCloudDownload, FaGlobe, FaLink, FaUnlink, FaPaperclip,
  FaPen, FaPencilAlt, FaScrewdriver, FaWrench, FaHammer, FaMagic,
  FaPaintBrush, FaPaintRoller, FaDraftingCompass, FaRuler, FaRulerHorizontal,
  FaRulerVertical, FaPenFancy, FaPenNib, FaMarker, FaHighlighter
} from 'react-icons/fa';

// Icon mapping - barcha emoji lar shu yerdan olinadi
export const ICONS = {
  // Coins & Money
  coins: FaCoins,
  money: FaMoneyBillWave,
  wallet: FaWallet,
  creditCard: FaCreditCard,
  dollar: FaDollarSign,
  percentage: FaPercentage,
  bank: FaUniversity,
  exchange: FaExchangeAlt,
  
  // Navigation
  home: FaHome,
  user: FaUser,
  users: FaUsers,
  profile: FaUser,
  
  // Actions
  add: FaPlus,
  addCircle: FaPlusCircle,
  remove: FaTrash,
  removeCircle: FaMinusCircle,
  edit: FaEdit,
  editAlt: FaEditAlt,
  delete: FaTrashAlt,
  search: FaFilter,
  save: FaCheck,
  cancel: FaTimes,
  check: FaCheck,
  checkCircle: FaCheckCircle,
  timesCircle: FaTimesCircle,
  close: FaTimes,
  
  // Rewards & Gifts
  gift: FaGift,
  trophy: FaTrophy,
  trophyGold: FaCrown,
  medal: FaMedal,
  star: FaStar,
  award: FaAward,
  crown: FaCrown,
  
  // Education
  quiz: FaClipboardList,
  test: FaClipboardCheck,
  book: FaBook,
  graduation: FaGraduationCap,
  student: FaUserGraduate,
  teacher: FaChalkboardTeacher,
  studentGroup: FaUsers,
  
  // Shop
  shop: FaStore,
  shoppingCart: FaShoppingCart,
  shoppingBag: FaShoppingBag,
  tag: FaTag,
  tags: FaTags,
  box: FaBox,
  product: FaBoxOpen,
  
  // Stats & Charts
  chart: FaChartBar,
  chartLine: FaChartLine,
  chartPie: FaChartPie,
  barChart: FaChartBar,
  
  // Status
  hot: FaFire,
  idea: FaLightbulb,
  target: FaBullseye,
  success: FaCheckCircle,
  error: FaTimesCircle,
  warning: FaExclamationTriangle,
  info: FaInfoCircle,
  question: FaQuestionCircle,
  
  // UI Elements
  arrowUp: FaArrowUp,
  arrowDown: FaArrowDown,
  chevronRight: FaChevronRight,
  chevronLeft: FaChevronLeft,
  caretUp: FaCaretUp,
  caretDown: FaCaretDown,
  sortUp: FaSortUp,
  sortDown: FaSortDown,
  logout: FaSignOutAlt,
  settings: FaCog,
  notifications: FaBell,
  history: FaHistory,
  sync: FaSync,
  
  // Auth
  email: FaEnvelope,
  lock: FaLock,
  eye: FaEye,
  eyeOff: FaEyeSlash,
};

// Icon component - asosiy component
export function Icon({ name, className = "", size = 16, ...props }) {
  const IconComponent = ICONS[name];
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  return <IconComponent className={className} size={size} {...props} />
}

// Convenience components
export const CoinIcon = ({ className, size }) => <FaCoins className={className} size={size} />;
export const HomeIcon = ({ className, size }) => <FaHome className={className} size={size} />;
export const WalletIcon = ({ className, size }) => <FaWallet className={className} size={size} />;
export const GiftIcon = ({ className, size }) => <FaGift className={className} size={size} />;
export const UserIcon = ({ className, size }) => <FaUser className={className} size={size} />;
export const UsersIcon = ({ className, size }) => <FaUsers className={className} size={size} />;
export const TrophyIcon = ({ className, size }) => <FaTrophy className={className} size={size} />;
export const CrownIcon = ({ className, size }) => <FaCrown className={className} size={size} />;
export const MedalIcon = ({ className, size }) => <FaMedal className={className} size={size} />;
export const StarIcon = ({ className, size }) => <FaStar className={className} size={size} />;
export const AddIcon = ({ className, size }) => <FaPlus className={className} size={size} />;
export const DeleteIcon = ({ className, size }) => <FaTrash className={className} size={size} />;
export const CheckIcon = ({ className, size }) => <FaCheck className={className} size={size} />;
export const TimesIcon = ({ className, size }) => <FaTimes className={className} size={size} />;
export const ShopIcon = ({ className, size }) => <FaStore className={className} size={size} />;
export const QuizIcon = ({ className, size }) => <FaClipboardList className={className} size={size} />;
export const BookIcon = ({ className, size }) => <FaBook className={className} size={size} />;
export const GradIcon = ({ className, size }) => <FaGraduationCap className={className} size={size} />;
export const TeacherIcon = ({ className, size }) => <FaChalkboardTeacher className={className} size={size} />;
export const FireIcon = ({ className, size }) => <FaFire className={className} size={size} />;
export const BulbIcon = ({ className, size }) => <FaLightbulb className={className} size={size} />;
export const TargetIcon = ({ className, size }) => <FaBullseye className={className} size={size} />;
export const ChartIcon = ({ className, size }) => <FaChartBar className={className} size={size} />;
export const LogoutIcon = ({ className, size }) => <FaSignOutAlt className={className} size={size} />;
export const SettingsIcon = ({ className, size }) => <FaCog className={className} size={size} />;
export const BellIcon = ({ className, size }) => <FaBell className={className} size={size} />;
export const SearchIcon = ({ className, size }) => <FaFilter className={className} size={size} />;

