const CONSTANTS = {
  ACCESS_TOKEN: 'acc_tk',
  REFRESH_TOKEN: 'ref_tk',
  LOCATION: 'route_history',
  SIDEBAR_STATE: 'sidebar_state',
  SIDEBAR_STATE_AGE: 60 * 60 * 24 * 7,
  SIDEBAR_WIDTH: '16rem',
  SIDEBAR_WIDTH_MOBILE: '18rem',
  SIDEBAR_WIDTH_ICON: '3rem',
  SIDEBAR_KEYBOARD_SHORTCUT: 'b'
};

// 🧾 Stock Status
export const STOCK_STATUS = {
  PENDING: 'PENDING',
  REVIEW: 'IN_REVIEW',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED'
};
export const STOCK_STATUSS={
  LOW_STOCK: 'LOW_STOCK',
  OUT_OF_STOCK: 'OUT_OF_STOCK'
};
export const STOCK_STATUS_COLOR = new Map([
  ['LOW_STOCK', 'bg-red text-teal-900 dark:text-teal-200 border-teal-200'],
  ['OUT_OF_STOCK', 'bg-yellow-200/40 text-yellow-700 dark:text-yellow-100 border-yellow-300']
]);
// 🟢 Stock Colors
export const STOCK_COLOR = new Map([
  ['PENDING', 'text-yellow-500 border-yellow-500'],
  ['IN_REVIEW', 'text-blue-500 border-blue-500'],
  ['RESOLVED', 'text-green-500 border-green-500'],
  ['REJECTED', 'text-red-500 border-red-500']
]);

// 🍽️ Item Categories
export const CATEGORY = {
  INVENTORY: 'INVENTORY',
  UTILITY: 'UTILITY',
  FOOD: 'FOOD'
};

export const CATEGORY_COLOR = new Map([
  ['INVENTORY', 'bg-red text-teal-900 dark:text-teal-200 border-teal-200'],
  ['UTILITY', 'bg-yellow-200/40 text-yellow-700 dark:text-yellow-100 border-yellow-300'],
  ['FOOD', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10'],
  ['MISC', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200']
]);

// 🍔 Item Category Subtypes
export const CATEGORY_ITEM = {
  1: 'TEA',
  2: 'PARATHAS',
  3: 'FASTFOOD',
  4: 'JUICES'
};

export const FULFILMENT_STATUS = {
  FULFILLED: "FULFILLED",
  UNFULFILLED: "UNFULFILLED",
};
export const FULFILMENT_STATUS_COLOR = new Map([
  ['FULFILLED', 'bg-red text-teal-900 dark:text-teal-200 border-teal-200'],
  ['UNFULFILLED', 'bg-yellow-200/40 text-yellow-700 dark:text-yellow-100 border-yellow-300']
]);
export const CATEGORY_ITEM_COLOR = new Map([
  ['TEA', 'bg-red text-teal-900 dark:text-teal-200 border-teal-200'],
  ['PARATHAS', 'bg-yellow-200/40 text-yellow-700 dark:text-yellow-100 border-yellow-300'],
  ['FASTFOOD', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10'],
  ['JUICES', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200']
]);

// 👥 Employee Status
export const EMPLOYEES_STATUS = {
  PARTIAL: 'PARTIAL',
  PAID: 'PAID'
};

export const EMPLOYEES_STATUS_COLOR = new Map([
  ['PAID', 'bg-red text-teal-900 dark:text-teal-200 border-teal-200'],
  ['PARTIAL', 'bg-yellow-200/40 text-yellow-700 dark:text-yellow-100 border-yellow-300']
]);


// 👤 User Status
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

export const USER_STATUS_COLOR = new Map([
  ['ACTIVE', 'bg-green-100 text-teal-900 dark:text-teal-200 dark:bg-black border-teal-200'],
  ['INACTIVE', 'bg-red-200/40 text-yellow-700 dark:text-yellow-100 dark:bg-black border-red-300']
]);

export const EMPLOYEESS_STATUS = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED'
};

export const EMPLOYEESS_STATUS_COLOR = new Map([
  ['ACTIVE', 'bg-green-100 text-teal-900 dark:text-teal-200 dark:bg-black border-teal-200'],
  ['BLOCKED', 'bg-red-200/40 text-yellow-700 dark:text-yellow-100 dark:bg-black border-red-300']
]);

export const PAYMENT_METHODS = [
  { label: 'Cash', value: 'CASH' },
  { label: 'Card', value: 'CARD' }
];



// ⚠️ Stock Alerts
export const STOCK_ALERT = {
  PENDING: 'PENDING',
  IN_REVIEW: 'IN_REVIEW',
  RESOLVED: 'RESOLVED'
};

export const STOCK_ALERT_COLOR = new Map([
  ['PENDING', 'bg-red text-teal-900 dark:text-teal-200 border-teal-200'],
  ['IN_REVIEW', 'bg-yellow-200/40 text-yellow-700 dark:text-yellow-100 border-yellow-300'],
  ['RESOLVED', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10']
]);

// 🧑‍🍳 Employee Roles
export const EMPLOYEES_ROLE = {
  KITCHEN: 'KITCHEN',
  CASHIER: 'CASHIER',
  CHEF: 'CHEF',
  WAITER: 'WAITER',
  CLEANER: 'CLEANER'
};

export const EMPLOYEES_ROLE_COLOR = new Map([
  ['CASHIER', 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 border border-red-200 dark:border-red-700'],
  ['KITCHEN', 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 border border-amber-200 dark:border-amber-700'],
  ['CHEF', 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700'],
  ['WAITER', 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border border-blue-200 dark:border-blue-700'],
  ['CLEANER', 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700']
]);

// 📅 Range and Months
export const RANGE = {
  TODAY: 'TODAY',
  WEEK: 'WEEK',
  MONTH: 'MONTH',
  YEAR: 'YEAR'
};

// ✅ Month values as numeric keys (for backend)
export const MONTH_ITEM = {
  1: 'JANUARY',
  2: 'FEBRUARY',
  3: 'MARCH',
  4: 'APRIL',
  5: 'MAY',
  6: 'JUNE',
  7: 'JULY',
  8: 'AUGUST',
  9: 'SEPTEMBER',
  10: 'OCTOBER',
  11: 'NOVEMBER',
  12: 'DECEMBER'
};

// 🎨 Month Colors
export const MONTH_ITEM_COLOR = new Map([
  ['January', 'bg-blue-100 text-blue-900 dark:text-blue-200 dark:bg-black  border-blue-200 '],
  ['February', 'bg-pink-100 text-pink-900 dark:text-pink-200 dark:bg-black border-pink-200'],
  ['March', 'bg-green-100 text-green-900 dark:text-green-200 dark:bg-black border-green-200'],
  ['April', 'bg-purple-100 text-purple-900 dark:text-purple-200 dark:bg-black border-purple-200'],
  ['May', 'bg-yellow-100 text-yellow-900 dark:text-yellow-200 dark:bg-black border-yellow-200'],
  ['June', 'bg-orange-100 text-orange-900 dark:text-orange-200 dark:bg-black border-orange-200'],
  ['July', 'bg-red-100 text-red-900 dark:text-red-200 dark:bg-black border-red-200'],
  ['August', 'bg-emerald-100 text-emerald-900 dark:text-emerald-200 dark:bg-black border-emerald-200'],
  ['September', 'bg-cyan-100 text-cyan-900 dark:text-cyan-200 dark:bg-black border-cyan-200'],
  ['October', 'bg-indigo-100 text-indigo-900 dark:text-indigo-200 dark:bg-black border-indigo-200'],
  ['November', 'bg-amber-100 text-amber-900 dark:text-amber-200 dark:bg-black border-amber-200'],
  ['December', 'bg-slate-100 text-slate-900 dark:text-slate-200 dark:bg-black border-slate-200']
]);

export default CONSTANTS;
