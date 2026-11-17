import { LanguageCode } from '../types/leafcheck';

// TODO: translate remaining copy, care questions, plant names, and advice strings into regional languages.
export interface TranslationStrings {
  appName: string;
  aiBadge: string;
  demoBadge: string;
  navHome: string;
  navScan: string;
  navHistory: string;
  navAbout: string;
  ctaScanLeaf: string;
  homeHeroTitle: string;
  homeHeroSubtitle: string;
  homeHowItWorksTitle: string;
  homeLimitationsTitle: string;
  scanTitle: string;
  scanModeHome: string;
  scanModeField: string;
  scanSelectPlant: string;
  scanUploadLabel: string;
  scanAnalyseButton: string;
  scanAnalysing: string;
  careTitle: string;
  careSkipButton: string;
  careAnalyseButton: string;
  resultTitle: string;
  resultNotSureTitle: string;
  resultHelpfulQuestion: string;
  resultYes: string;
  resultNo: string;
  resultSave: string;
  resultSaved: string;
  resultDelete: string;
  resultScanAnother: string;
  confidenceHigh: string;
  confidenceMedium: string;
  confidenceLow: string;
  historyTitle: string;
  historyEmptyTitle: string;
  historyClearAll: string;
  aboutTitle: string;
  languageLabel: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationStrings> = {
  en: {
    appName: 'LeafCheck',
    aiBadge: 'AI-assisted by Gemini. Not a trained disease model. Confidence is an estimate.',
    demoBadge: 'Demo mode: predictions are simulated',
    navHome: 'Home',
    navScan: 'Scan',
    navHistory: 'History',
    navAbout: 'About',
    ctaScanLeaf: 'Scan a leaf',
    homeHeroTitle: 'Gentle leaf screening for gardens and small farms',
    homeHeroSubtitle:
      'Take a clear photo of a single leaf to explore possible plant issues, check container care habits, and keep a simple local log.',
    homeHowItWorksTitle: 'How it works',
    homeLimitationsTitle: 'Before you begin',
    scanTitle: 'Check a leaf photo',
    scanModeHome: 'Home / Garden',
    scanModeField: 'Field / Farm',
    scanSelectPlant: 'Select plant',
    scanUploadLabel: 'Upload or take a photo',
    scanAnalyseButton: 'Analyse',
    scanAnalysing: 'Analysing leaf...',
    careTitle: 'Quick care check',
    careSkipButton: 'Skip & Analyse',
    careAnalyseButton: 'Analyse',
    resultTitle: 'Screening summary',
    resultNotSureTitle: 'Not sure',
    resultHelpfulQuestion: 'Was this helpful?',
    resultYes: 'Yes',
    resultNo: 'No',
    resultSave: 'Save',
    resultSaved: 'Saved',
    resultDelete: 'Delete',
    resultScanAnother: 'Scan another',
    confidenceHigh: 'High',
    confidenceMedium: 'Medium',
    confidenceLow: 'Low',
    historyTitle: 'Scan history',
    historyEmptyTitle: 'No saved scans yet',
    historyClearAll: 'Clear all',
    aboutTitle: 'About & Limitations',
    languageLabel: 'Language',
  },
  hi: {
    // TODO: Complete full Hindi translation for secondary screens, advice bullets, and plant names.
    appName: 'LeafCheck',
    aiBadge: 'Gemini द्वारा AI-सहायता प्राप्त। यह प्रशिक्षित रोग मॉडल नहीं है। विश्वास केवल अनुमान है।',
    demoBadge: 'डेमो मोड: परिणाम अनुमानित हैं',
    navHome: 'होम',
    navScan: 'जांचें',
    navHistory: 'इतिहास',
    navAbout: 'जानकारी',
    ctaScanLeaf: 'पत्ती जांचें',
    homeHeroTitle: 'बगीचे और छोटे खेतों के लिए सरल पत्ती जांच',
    homeHeroSubtitle:
      'एक साफ़ पत्ती की फोटो लेकर संभावित समस्या देखें, देखभाल की जांच करें और अपने डिवाइस पर रिकॉर्ड रखें।',
    homeHowItWorksTitle: 'यह कैसे काम करता है',
    homeLimitationsTitle: 'शुरू करने से पहले',
    scanTitle: 'पत्ती की फोटो जांचें',
    scanModeHome: 'घर / बगीचा',
    scanModeField: 'खेत / फसल',
    scanSelectPlant: 'पौधा चुनें',
    scanUploadLabel: 'फोटो अपलोड करें या खींचें',
    scanAnalyseButton: 'विश्लेषण करें',
    scanAnalysing: 'जांच हो रही है...',
    careTitle: 'देखभाल संबंधी सवाल',
    careSkipButton: 'छोड़ें और जांचें',
    careAnalyseButton: 'विश्लेषण करें',
    resultTitle: 'जांच सारांश',
    resultNotSureTitle: 'अनिश्चित परिणाम',
    resultHelpfulQuestion: 'क्या यह मददगार था?',
    resultYes: 'हाँ',
    resultNo: 'नहीं',
    resultSave: 'सहेजें',
    resultSaved: 'सहेजा गया',
    resultDelete: 'हटाएं',
    resultScanAnother: 'दूसरी पत्ती जांचें',
    confidenceHigh: 'उच्च',
    confidenceMedium: 'मध्यम',
    confidenceLow: 'कम',
    historyTitle: 'पिछली जांच',
    historyEmptyTitle: 'अभी कोई जांच सहेजी नहीं गई है',
    historyClearAll: 'सभी हटाएं',
    aboutTitle: 'जानकारी और सीमाएं',
    languageLabel: 'भाषा',
  },
};
