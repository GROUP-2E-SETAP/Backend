/**
 * Get the start of the month for a given date
 * @param {Date} date
 * @returns {Date}
 */
exports.startOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Get the end of the month for a given date
 * @param {Date} date
 * @returns {Date}
 */
exports.endOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
};

/**
 * Get the start of the week for a given date (Monday)
 * @param {Date} date
 * @returns {Date}
 */
exports.startOfWeek = (date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(date.setDate(diff));
};

/**
 * Get the end of the week for a given date (Sunday)
 * @param {Date} date
 * @returns {Date}
 */
exports.endOfWeek = (date) => {
  const start = this.startOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
};

/**
 * Subtract months from a date
 * @param {Date} date
 * @param {number} months
 * @returns {Date}
 */
exports.subMonths = (date, months) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() - months);
  return newDate;
};

/**
 * Add months to a date
 * @param {Date} date
 * @param {number} months
 * @returns {Date}
 */
exports.addMonths = (date, months) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

/**
 * Add days to a date
 * @param {Date} date
 * @param {number} days
 * @returns {Date}
 */
exports.addDays = (date, days) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

/**
 * Format date to YYYY-MM-DD
 * @param {Date} date
 * @returns {string}
 */
exports.formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Check if two dates are the same day
 * @param {Date} date1
 * @param {Date} date2
 * @returns {boolean}
 */
exports.isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
