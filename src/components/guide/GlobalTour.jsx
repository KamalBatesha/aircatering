import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import './GlobalTour.css';
import { useGuide } from '../../context/GuideContext';
import { useLangStore } from '../../assets/store/langStore';

/**
 * GlobalTour — Custom lightweight guided tour for airCatering.
 *
 * Adapted from SkyTour (Sky_React_APP).
 * Uses requestAnimationFrame to track the spotlight, and CSS transitions
 * for smooth tooltip movement. No third-party tour library is used, which
 * means NO beacon, NO hidden hotspots, and NO overlay issues.
 *
 * HOW TO ADD STEPS:
 * Each step in the `steps` array must have:
 *   - target:    CSS selector string  e.g. '#guide-station-select'
 *   - titleEN:   Step title in English
 *   - titleAR:   Step title in Arabic
 *   - contentEN: Step explanation in English
 *   - contentAR: Step explanation in Arabic
 *   - placement: 'top' | 'bottom' | 'left' | 'right'  (default: 'bottom')
 *   - spotlightPadding: optional { top, left, right, bottom } in px
 */

// ─────────────────────────────────────────────────────────────────────────────
// Step definitions (add new steps here — see GUIDE_SYSTEM_DOCS.md)
// ─────────────────────────────────────────────────────────────────────────────
const DASHBOARD_STEPS = [
  {
    target: '#guide-station-select',
    titleEN: 'Station Selector',
    titleAR: 'محدد المحطة',
    contentEN: 'Select your station here. Changing the station instantly updates all menu item prices to reflect that station\'s local rates.',
    contentAR: 'اختر محطتك هنا. تغيير المحطة يُحدِّث فوراً أسعار جميع عناصر القائمة لتعكس الأسعار المحلية لتلك المحطة.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-menu-prices',
    titleEN: 'Live Menu Prices',
    titleAR: 'أسعار القائمة الحية',
    contentEN: 'These prices are tied to your selected station. Switch the station above and watch them update in real time.',
    contentAR: 'هذه الأسعار مرتبطة بالمحطة المختارة. غيِّر المحطة أعلاه وراقب تحديثها في الوقت الفعلي.',
    placement: 'top',
    spotlightPadding: { top: 4, left: 4, right: 4, bottom: 4 },
  },
  {
    target: '#guide-add-order-btn',
    titleEN: 'Create a New Order',
    titleAR: 'إنشاء طلب جديد',
    contentEN: 'Click this button to start a new catering order. You will fill in flight details first, then add items from the menu.',
    contentAR: 'انقر على هذا الزر لبدء طلب تموين جديد. ستملأ تفاصيل الرحلة أولاً، ثم تضيف العناصر من القائمة.',
    placement: 'top',
    spotlightPadding: { top: 6, left: 12, right: 12, bottom: 6 },
  },
  {
    target: '#guide-orders-carousel',
    titleEN: 'Your Active Orders',
    titleAR: 'طلباتك النشطة',
    contentEN: 'All your open orders appear here. Click any order card to make it active — menu items you add will be attached to the active order.',
    contentAR: 'تظهر هنا جميع طلباتك المفتوحة. انقر على أي بطاقة طلب لتنشيطها — ستُضاف عناصر القائمة التي تختارها إلى الطلب النشط.',
    placement: 'top',
    spotlightPadding: { top: 8, left: 8, right: 8, bottom: 8 },
  },
];

const MODAL_STEPS = [
  {
    target: '#guide-modal-step-0',
    titleEN: 'Flight Details',
    titleAR: 'تفاصيل الرحلة',
    contentEN: 'Enter the station, flight type, flight number, aircraft registration, and passenger/crew counts. These fields are required to schedule your catering correctly.',
    contentAR: 'أدخل المحطة، نوع الرحلة، رقم الرحلة، تسجيل الطائرة، وأعداد الركاب/الطاقم. هذه الحقول مطلوبة لجدولة التموين بشكل صحيح.',
    placement: 'bottom',
  },
  {
    target: '#guide-modal-step-1',
    titleEN: 'Payment & Billing',
    titleAR: 'الدفع والفوترة',
    contentEN: 'Choose the billing party, operator, and the currency for the invoice. This determines how the final invoice will be generated.',
    contentAR: 'اختر الجهة المسؤولة عن الفاتورة والمشغل وعملة الفاتورة. يحدد هذا كيفية إنشاء الفاتورة النهائية.',
    placement: 'bottom',
  },
  {
    target: '#guide-modal-step-2',
    titleEN: 'Dates & Bank Transfer',
    titleAR: 'التواريخ والتحويل البنكي',
    contentEN: 'Set the exact arrival and departure date/time. If payment is by bank transfer, enter those details here as well.',
    contentAR: 'حدد تاريخ ووقت الوصول والمغادرة بدقة. إذا كان الدفع بتحويل بنكي، أدخل تلك التفاصيل هنا أيضاً.',
    placement: 'bottom',
  },
  {
    target: '#guide-modal-step-3',
    titleEN: 'Delivery Date & Time',
    titleAR: 'تاريخ ووقت التوصيل',
    contentEN: 'Specify when the catering must be physically delivered to the aircraft. This is separate from the flight departure time.',
    contentAR: 'حدد متى يجب توصيل التموين فعلياً إلى الطائرة. يختلف هذا عن وقت إقلاع الرحلة.',
    placement: 'top',
  },
];

// Fallback steps for pages that don't have a guide yet
const getComingSoonSteps = (path) => [
  {
    target: '#guide-coming-soon-dummy', // Deliberately missing so it defaults to center placement
    titleEN: 'Guide Coming Soon',
    titleAR: 'الدليل قريباً',
    contentEN: `The interactive guide for this page (${path}) is currently under construction. Check back later!`,
    contentAR: `الدليل التفاعلي لهذه الصفحة قيد الإنشاء حالياً. يرجى التحقق لاحقاً!`,
    placement: 'center',
    spotlightPadding: { top: 0, left: 0, right: 0, bottom: 0 },
  }
];

const ORDER_DETAILS_STEPS = [
  {
    target: '#guide-order-send-to-sky',
    titleEN: 'Send to Sky Culinaire',
    titleAR: 'إرسال إلى سكاي كولينير',
    contentEN: 'Once your order items are ready, click this button to submit the order to Sky Culinaire for review. They will check the items and pricing before confirming.',
    contentAR: 'بمجرد جاهزية عناصر طلبك، انقر هذا الزر لإرسال الطلب إلى سكاي كولينير للمراجعة. سيقومون بفحص العناصر والأسعار قبل التأكيد.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 10, right: 10, bottom: 6 },
  },
  {
    target: '#guide-order-final-confirm',
    titleEN: 'Final Confirmation',
    titleAR: 'التأكيد النهائي',
    contentEN: 'After Sky Culinaire reviews your order and it\'s ready, this button becomes available. Click it to send your final approval — or edit the order and resubmit if changes are needed.',
    contentAR: 'بعد مراجعة سكاي كولينير لطلبك، يصبح هذا الزر متاحاً. انقر عليه لإرسال موافقتك النهائية — أو عدّل الطلب وأعد إرساله إذا كانت هناك تغييرات.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 10, right: 10, bottom: 6 },
  },
  {
    target: '#guide-order-track',
    titleEN: 'Track Your Order',
    titleAR: 'تتبع طلبك',
    contentEN: 'After sending your final confirmation, use this button to track the real-time delivery status of your order from kitchen to aircraft.',
    contentAR: 'بعد إرسال تأكيدك النهائي، استخدم هذا الزر لتتبع حالة توصيل طلبك في الوقت الفعلي من المطبخ إلى الطائرة.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 10, right: 10, bottom: 6 },
  },
  {
    target: '#guide-order-edit',
    titleEN: 'Edit Order',
    titleAR: 'تعديل الطلب',
    contentEN: 'Need to make changes? Click "Edit Order" to modify the order details or quantities. After editing, you can save and resubmit to Sky Culinaire.',
    contentAR: 'هل تحتاج إلى تعديلات؟ انقر “تعديل الطلب” لتعديل تفاصيل الطلب أو الكميات. بعد التعديل، يمكنك الحفظ وإعادة الإرسال إلى سكاي كولينير.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 10, right: 10, bottom: 6 },
  },
  {
    target: '#guide-order-archive',
    titleEN: 'Send to Archive',
    titleAR: 'إرسال إلى الأرشيف',
    contentEN: 'When an order is completed or no longer active, you can move it to the archive to keep your orders list clean and organized.',
    contentAR: 'عند اكتمال طلب ما أو عدم نشاطه، يمكنك نقله إلى الأرشيف للحفاظ على قائمة طلباتك مرتبة ومنظمة.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 10, right: 10, bottom: 6 },
  },
  {
    target: '#guide-order-cancel',
    titleEN: 'Cancel Order',
    titleAR: 'إلغاء الطلب',
    contentEN: 'If you need to cancel the order entirely, use this button. You will be asked to provide a reason before the cancellation is processed.',
    contentAR: 'إذا كنت بحاجة إلى إلغاء الطلب بالكامل، استخدم هذا الزر. سيُطلب منك تقديم سبب قبل معالجة الإلغاء.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 10, right: 10, bottom: 6 },
  },
];

const CART_STEPS = [
  {
    target: '#guide-cart-orders-list',
    titleEN: 'Active Orders Carousel',
    titleAR: 'عجلة الطلبات النشطة',
    contentEN: 'Here are all your active orders. You can scroll left and right to see them all. Click on any order to make it active and view its details below.',
    contentAR: 'هنا جميع طلباتك النشطة. يمكنك التمرير يميناً ويساراً لرؤيتها كلها. انقر على أي طلب لتنشيطه وعرض تفاصيله بالأسفل.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-cart-order-info',
    titleEN: 'Active Order Details',
    titleAR: 'تفاصيل الطلب النشط',
    contentEN: 'This section displays the full flight details of the currently selected order.',
    contentAR: 'يعرض هذا القسم التفاصيل الكاملة للرحلة للطلب المحدد حالياً.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-cart-order-items',
    titleEN: 'Order Items & Management',
    titleAR: 'أصناف الطلب وإدارتها',
    contentEN: 'Here you can view all items in the order. You can adjust quantities, mark items for Arrival/Departure, or delete them if needed. The total price updates automatically.',
    contentAR: 'هنا يمكنك عرض جميع الأصناف في الطلب. يمكنك تعديل الكميات، أو تحديد الأصناف للوصول/المغادرة، أو حذفها إذا لزم الأمر. يتم تحديث السعر الإجمالي تلقائياً.',
    placement: 'left',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
];

const MY_ORDERS_STEPS = [
  {
    target: '#guide-myorders-flight-info',
    titleEN: 'Flight Information',
    titleAR: 'معلومات الرحلة',
    contentEN: 'This section displays all flight and station details for your order.',
    contentAR: 'يعرض هذا القسم جميع تفاصيل الرحلة والمحطة لطلبك.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-myorders-track',
    titleEN: 'Track Order',
    titleAR: 'تتبع الطلب',
    contentEN: 'Click here to see real-time updates and the delivery timeline of your order.',
    contentAR: 'انقر هنا لرؤية التحديثات في الوقت الفعلي والجدول الزمني لتسليم طلبك.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-myorders-archive',
    titleEN: 'Send to Archive',
    titleAR: 'إرسال إلى الأرشيف',
    contentEN: 'Once an order is complete, you can send it to your archive to keep your active list clean.',
    contentAR: 'بمجرد اكتمال الطلب، يمكنك إرساله إلى الأرشيف لإبقاء قائمة الطلبات النشطة نظيفة.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-myorders-order-again',
    titleEN: 'Order Again',
    titleAR: 'طلب مجدداً',
    contentEN: 'Loved this order? Click here to duplicate the items into a new order. You will only need to provide new flight details.',
    contentAR: 'هل أحببت هذا الطلب؟ انقر هنا لتكرار الأصناف في طلب جديد. ستحتاج فقط إلى تقديم تفاصيل رحلة جديدة.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-myorders-view-details',
    titleEN: 'View Full Order',
    titleAR: 'عرض الطلب بالكامل',
    contentEN: 'Click here to view all items and complete details of this order.',
    contentAR: 'انقر هنا لعرض جميع الأصناف والتفاصيل الكاملة لهذا الطلب.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-myorders-filter',
    titleEN: 'Filter Orders',
    titleAR: 'تصفية الطلبات',
    contentEN: 'Use this dropdown to quickly find orders from today, this week, or earlier.',
    contentAR: 'استخدم هذه القائمة للعثور بسرعة على طلبات من اليوم، هذا الأسبوع، أو قبل ذلك.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
];

const MY_ARCHIVE_STEPS = [
  {
    target: '#guide-myorders-flight-info',
    titleEN: 'Flight Information',
    titleAR: 'معلومات الرحلة',
    contentEN: 'This section displays all flight and station details for your order.',
    contentAR: 'يعرض هذا القسم جميع تفاصيل الرحلة والمحطة لطلبك.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-myarchive-restore',
    titleEN: 'Restore From Archive',
    titleAR: 'استعادة من الأرشيف',
    contentEN: 'This button will restore the order from archive.',
    contentAR: 'هذا الزر سيقوم باستعادة الطلب من الأرشيف.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-myorders-order-again',
    titleEN: 'Order Again',
    titleAR: 'طلب مجدداً',
    contentEN: 'Loved this order? Click here to duplicate the items into a new order. You will only need to provide new flight details.',
    contentAR: 'هل أحببت هذا الطلب؟ انقر هنا لتكرار الأصناف في طلب جديد. ستحتاج فقط إلى تقديم تفاصيل رحلة جديدة.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-myorders-view-details',
    titleEN: 'View Full Order',
    titleAR: 'عرض الطلب بالكامل',
    contentEN: 'Click here to view all items and complete details of this order.',
    contentAR: 'انقر هنا لعرض جميع الأصناف والتفاصيل الكاملة لهذا الطلب.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-myorders-filter',
    titleEN: 'Filter Orders',
    titleAR: 'تصفية الطلبات',
    contentEN: 'Use this dropdown to quickly find orders from today, this week, or earlier.',
    contentAR: 'استخدم هذه القائمة للعثور بسرعة على طلبات من اليوم، هذا الأسبوع، أو قبل ذلك.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  }
];

const MY_ACCOUNT_SUMMARY_STEPS = [
  {
    target: '#guide-summary-account',
    titleEN: 'Account Information',
    titleAR: 'معلومات الحساب',
    contentEN: 'This section contains your profile information and contact details. Editable information can be updated here.',
    contentAR: 'يحتوي هذا القسم على معلومات ملفك الشخصي وبيانات الاتصال. يمكن تحديث المعلومات القابلة للتعديل هنا.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-summary-default',
    titleEN: 'Default Values for Next Order',
    titleAR: 'القيم الافتراضية للطلب التالي',
    contentEN: 'The values selected here will automatically be used as defaults whenever you create a new order.',
    contentAR: 'سيتم استخدام القيم المحددة هنا تلقائياً كقيم افتراضية كلما قمت بإنشاء طلب جديد.',
    placement: 'top',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-summary-gh',
    titleEN: 'Ground Handler Information',
    titleAR: 'معلومات مزود الخدمة الأرضية',
    contentEN: 'Details of your assigned ground handler.',
    contentAR: 'تفاصيل مزود الخدمة الأرضية المعين لك.',
    placement: 'top',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-summary-bank',
    titleEN: 'Bank Information',
    titleAR: 'المعلومات البنكية',
    contentEN: 'This section displays your bank details used for bank transfer payments.',
    contentAR: 'يعرض هذا القسم تفاصيلك البنكية المستخدمة لمدفوعات التحويل البنكي.',
    placement: 'top',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-summary-newsletter',
    titleEN: 'Newsletter Subscription',
    titleAR: 'الاشتراك في النشرة الإخبارية',
    contentEN: 'You can enable or disable promotional emails and news updates here.',
    contentAR: 'يمكنك تفعيل أو إيقاف رسائل البريد الإلكتروني الترويجية وتحديثات الأخبار هنا.',
    placement: 'top',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-summary-pwd-btn',
    titleEN: 'Change Password',
    titleAR: 'تغيير كلمة المرور',
    contentEN: 'Clicking this button opens a secure dialog to update your account password.',
    contentAR: 'يؤدي النقر على هذا الزر إلى فتح نافذة آمنة لتحديث كلمة مرور حسابك.',
    placement: 'top',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-summary-update-btn',
    titleEN: 'Update Account',
    titleAR: 'تحديث الحساب',
    contentEN: 'Click here to save all changes made on the Summary page.',
    contentAR: 'انقر هنا لحفظ جميع التغييرات التي تم إجراؤها في صفحة الملخص.',
    placement: 'top',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  }
];

const CHANGE_PASSWORD_STEPS = [
  {
    target: '#guide-pwd-form',
    titleEN: 'Update Password',
    titleAR: 'تحديث كلمة المرور',
    contentEN: 'Enter your current password and your new password to secure your account.',
    contentAR: 'أدخل كلمة المرور الحالية وكلمة المرور الجديدة لتأمين حسابك.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-pwd-update',
    titleEN: 'Save Changes',
    titleAR: 'حفظ التغييرات',
    contentEN: 'Click here to securely save your new password.',
    contentAR: 'انقر هنا لحفظ كلمة المرور الجديدة بشكل آمن.',
    placement: 'top',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-pwd-close',
    titleEN: 'Close',
    titleAR: 'إغلاق',
    contentEN: 'Cancel and close this popup without making changes.',
    contentAR: 'إلغاء وإغلاق هذه النافذة دون إجراء تغييرات.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  }
];

const ORDER_TRACKING_STEPS = [
  {
    target: '#guide-tracking-back',
    titleEN: 'Back Button',
    titleAR: 'زر الرجوع',
    contentEN: 'Click here to return to the previous page.',
    contentAR: 'انقر هنا للعودة إلى الصفحة السابقة.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-tracking-info',
    titleEN: 'Flight Information',
    titleAR: 'معلومات الرحلة',
    contentEN: 'This section displays all important flight and order details, including passengers, operator, and billing information.',
    contentAR: 'يعرض هذا القسم جميع تفاصيل الرحلة والطلب الهامة، بما في ذلك الركاب والمشغل ومعلومات الفوترة.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-tracking-status',
    titleEN: 'Current Order Status',
    titleAR: 'حالة الطلب الحالية',
    contentEN: 'This badge displays the latest status of your order and updates as it progresses.',
    contentAR: 'تعرض هذه الشارة أحدث حالة لطلبك ويتم تحديثها مع تقدمه.',
    placement: 'bottom',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-tracking-timeline',
    titleEN: 'Tracking Timeline',
    titleAR: 'الجدول الزمني للتتبع',
    contentEN: 'This timeline shows every stage of the order from creation until completion, highlighting current progress.',
    contentAR: 'يوضح هذا الجدول الزمني كل مرحلة من مراحل الطلب منذ الإنشاء حتى الاكتمال، مع إبراز التقدم الحالي.',
    placement: 'top',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  },
  {
    target: '#guide-tracking-summary',
    titleEN: 'Progress Summary',
    titleAR: 'ملخص التقدم',
    contentEN: 'These cards show completed steps, total steps, and your overall completion percentage.',
    contentAR: 'تعرض هذه البطاقات الخطوات المكتملة وإجمالي الخطوات والنسبة المئوية الإجمالية للإنجاز.',
    placement: 'top',
    spotlightPadding: { top: 6, left: 6, right: 6, bottom: 6 },
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function GlobalTour() {
  const { guideEnabled, setGuideEnabled } = useGuide();
  const { lang } = useLangStore();
  const location = useLocation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [steps, setSteps] = useState([]);

  const tooltipRef = useRef(null);
  const rafRef = useRef(null);
  const movingTimerRef = useRef(null);
  const isFirstRef = useRef(true);

  const currentStep = steps[currentIndex];

  // ── Select step list based on current DOM context & Path ──
  useEffect(() => {
    if (!guideEnabled) return;

    // Helper to dynamically filter steps where elements don't exist
    const getVisibleSteps = (stepList) => stepList.filter(s => document.querySelector(s.target) !== null);

    // 1. Check if the modal is open (takes precedence)
    const isModalOpen =
      document.getElementById('guide-modal-step-0') !== null ||
      document.getElementById('guide-modal-step-1') !== null ||
      document.getElementById('guide-modal-step-2') !== null;

    if (isModalOpen) {
      setSteps(MODAL_STEPS);
      return;
    }

    const isChangePasswordOpen = document.getElementById('guide-pwd-form') !== null;
    if (isChangePasswordOpen) {
      setSteps(getVisibleSteps(CHANGE_PASSWORD_STEPS));
      return;
    }

    // 2. Select route-specific guides
    const path = location.pathname.toLowerCase();

    if (path === '/' || path === '/login' || path === '/register') {
      setSteps([]); // Disable guide entirely on root path
    } else if (path === '/home' || path === '/dashboard') {
      setSteps(DASHBOARD_STEPS);
    } else if (path === '/cart') {
      setSteps(CART_STEPS);
    } else if (path.startsWith('/my-account/orders')) {
      setSteps(MY_ORDERS_STEPS);
    } else if (path.startsWith('/my-account/archive')) {
      setSteps(MY_ARCHIVE_STEPS);
    } else if (path.startsWith('/my-account/summary')) {
      setSteps(getVisibleSteps(MY_ACCOUNT_SUMMARY_STEPS));
    } else if (path.startsWith('/order/') && path.endsWith('/tracking')) {
      setSteps(getVisibleSteps(ORDER_TRACKING_STEPS));
    } else if (path.startsWith('/order/') && !path.endsWith('/tracking')) {
      setSteps(ORDER_DETAILS_STEPS);
    } else {
      // 3. Fallback for undefined routes
      setSteps(getComingSoonSteps(location.pathname));
    }
  }, [guideEnabled, location.pathname]);

  // ── On guide start: reset state ──
  useEffect(() => {
    if (guideEnabled) {
      setCurrentIndex(0);
      setTargetRect(null);
      setIsVisible(false);
      setIsMoving(false);
      isFirstRef.current = true;
      setTooltipPos({
        x: window.innerWidth / 2 - 160,
        y: window.innerHeight / 2 - 100,
        placement: 'center',
      });
      const t = setTimeout(() => setIsVisible(true), 60);
      return () => clearTimeout(t);
    } else {
      setIsVisible(false);
      setTooltipPos(null);
      setTargetRect(null);
      cancelAnimationFrame(rafRef.current);
    }
  }, [guideEnabled]);

  // ── requestAnimationFrame loop: track target element position ──
  const trackTarget = useCallback(() => {
    if (!guideEnabled || !currentStep) return;
    const el = document.querySelector(currentStep.target);
    if (!el) {
      setTargetRect(null);
    } else {
      const rect = el.getBoundingClientRect();
      setTargetRect(prev => {
        if (
          !prev ||
          Math.abs(prev.top - rect.top) > 0.5 ||
          Math.abs(prev.left - rect.left) > 0.5 ||
          prev.width !== rect.width ||
          prev.height !== rect.height
        ) return rect;
        return prev;
      });
    }
    rafRef.current = requestAnimationFrame(trackTarget);
  }, [guideEnabled, currentStep]);

  useEffect(() => {
    if (!guideEnabled || !currentStep) return;
    rafRef.current = requestAnimationFrame(trackTarget);

    // Auto-scroll to target
    const el = document.querySelector(currentStep.target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [guideEnabled, currentIndex, trackTarget, currentStep]);

  // ── Compute tooltip position whenever targetRect changes ──
  useEffect(() => {
    if (!targetRect || !tooltipRef.current || (!isVisible && currentIndex === 0)) return;

    const tooltip = tooltipRef.current;
    const tRect = tooltip.getBoundingClientRect();
    const margin = 16;
    let placement = currentStep?.placement || 'bottom';
    const isRTL = lang === 'AR';

    // 1. Logical flip for RTL so left/right adapt to layout direction
    if (isRTL) {
      if (placement === 'left') placement = 'right';
      else if (placement === 'right') placement = 'left';
    }

    // 2. Auto-flip placement if there isn't enough space
    if (placement === 'top' && targetRect.top - tRect.height - margin < 0) {
      placement = 'bottom';
    } else if (placement === 'bottom' && targetRect.bottom + tRect.height + margin > window.innerHeight) {
      placement = 'top';
    } else if (placement === 'left' && targetRect.left - tRect.width - margin < 0) {
      placement = 'right';
    } else if (placement === 'right' && targetRect.right + tRect.width + margin > window.innerWidth) {
      placement = 'left';
    }

    let x = 0, y = 0;
    if (placement === 'top') {
      x = targetRect.left + targetRect.width / 2 - tRect.width / 2;
      y = targetRect.top - tRect.height - margin;
    } else if (placement === 'bottom') {
      x = targetRect.left + targetRect.width / 2 - tRect.width / 2;
      y = targetRect.bottom + margin;
    } else if (placement === 'left') {
      x = targetRect.left - tRect.width - margin;
      y = targetRect.top + targetRect.height / 2 - tRect.height / 2;
    } else if (placement === 'right') {
      x = targetRect.right + margin;
      y = targetRect.top + targetRect.height / 2 - tRect.height / 2;
    } else {
      // center
      x = window.innerWidth / 2 - tRect.width / 2;
      y = window.innerHeight / 2 - tRect.height / 2;
    }

    // 3. Clamp to viewport so it never overflows
    const pad = 16;
    const idealX = x;
    const idealY = y;

    x = Math.max(pad, Math.min(x, window.innerWidth - tRect.width - pad));
    y = Math.max(pad, Math.min(y, window.innerHeight - tRect.height - pad));

    // 4. Compute arrow offset so it still points directly at the target element
    let arrowX = 0;
    let arrowY = 0;

    if (placement === 'top' || placement === 'bottom') {
      arrowX = idealX - x;
      const maxArrowX = (tRect.width / 2) - 24;
      arrowX = Math.max(-maxArrowX, Math.min(arrowX, maxArrowX));
    } else if (placement === 'left' || placement === 'right') {
      arrowY = idealY - y;
      const maxArrowY = (tRect.height / 2) - 24;
      arrowY = Math.max(-maxArrowY, Math.min(arrowY, maxArrowY));
    }

    setTooltipPos({ x, y, placement, arrowX, arrowY });

    if (!isFirstRef.current) {
      setIsMoving(true);
      clearTimeout(movingTimerRef.current);
      movingTimerRef.current = setTimeout(() => setIsMoving(false), 420);
    }
    isFirstRef.current = false;
  }, [targetRect, currentStep?.placement, currentIndex, isVisible]);

  // ── Handlers ──
  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      isFirstRef.current = true;
      setCurrentIndex(i => i + 1);
    } else {
      closeTour();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      isFirstRef.current = true;
      setCurrentIndex(i => i - 1);
    }
  };

  const closeTour = () => {
    setCurrentIndex(0);
    setGuideEnabled(false);
  };

  // ── Guard: don't render if guide is off or steps haven't loaded yet ──
  if (!guideEnabled || steps.length === 0 || !currentStep) return null;

  const sp = currentStep.spotlightPadding || { top: 4, left: 4, right: 4, bottom: 4 };
  const title = lang === 'EN' ? currentStep.titleEN : currentStep.titleAR;
  const content = lang === 'EN' ? currentStep.contentEN : currentStep.contentAR;

  return (
    <div className={`gt-overlay ${isVisible ? 'visible' : ''}`}>

      {/* Spotlight cutout */}
      {(targetRect || isVisible) && (
        <div
          className="gt-spotlight"
          style={{
            top: (targetRect?.top ?? window.innerHeight / 2) - sp.top,
            left: (targetRect?.left ?? window.innerWidth / 2) - sp.left,
            width: (targetRect?.width ?? 0) + sp.left + sp.right,
            height: (targetRect?.height ?? 0) + sp.top + sp.bottom,
            opacity: isVisible ? 1 : 0,
          }}
        />
      )}

      {/* Tooltip card */}
      <div
        ref={tooltipRef}
        className={`gt-tooltip ${isMoving ? 'moving' : ''}`}
        data-placement={tooltipPos?.placement || currentStep.placement || 'bottom'}
        style={{
          transform: tooltipPos
            ? `translate3d(${tooltipPos.x}px, ${tooltipPos.y}px, 0)`
            : `translate3d(${window.innerWidth / 2 - 160}px, ${window.innerHeight / 2 - 100}px, 0)`,
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? 'auto' : 'none',
          '--arrow-x': tooltipPos?.arrowX ? `${tooltipPos.arrowX}px` : '0px',
          '--arrow-y': tooltipPos?.arrowY ? `${tooltipPos.arrowY}px` : '0px',
        }}
      >
        <div className="gt-arrow" />

        {/* Header */}
        {title && <div className="gt-tooltip-header">{title}</div>}

        {/* Body */}
        <div className="gt-tooltip-body">{content}</div>

        {/* Footer */}
        <div className="gt-tooltip-footer">
          {/* Step dots */}
          <div className="gt-step-dots">
            {steps.map((_, i) => (
              <div key={i} className={`gt-dot ${i === currentIndex ? 'active' : ''}`} />
            ))}
          </div>

          {/* Buttons */}
          <div className="gt-buttons">
            <button className="gt-btn gt-btn-skip" onClick={closeTour}>
              {lang === 'EN' ? 'Skip' : 'تخطي'}
            </button>
            {currentIndex > 0 && (
              <button className="gt-btn gt-btn-secondary" onClick={handleBack}>
                {lang === 'EN' ? 'Back' : 'السابق'}
              </button>
            )}
            <button className="gt-btn gt-btn-primary" onClick={handleNext}>
              {currentIndex === steps.length - 1
                ? (lang === 'EN' ? 'Finish' : 'إنهاء')
                : (lang === 'EN' ? 'Next' : 'التالي')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
