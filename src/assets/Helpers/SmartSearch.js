// File: src/assets/Helpers/SmartSearch.js
// Reusable smart search utility with multi-word AND matching, word order independence, and ranking

/**
 * Smart search function that filters and ranks data based on search query
 * @param {Array} data - The array of items to search
 * @param {string} searchQuery - The search query string
 * @param {Array} searchParam - Array of search parameter names
 * @param {Function} getFieldValue - Function that takes (item, param) and returns the field value
 * @returns {Array} - Filtered and sorted array of matching items
 */
export function smartSearch(data, searchQuery, searchParam, getFieldValue) {
  if (!data || !searchParam?.length || !searchQuery) {
    return data;
  }

  // Split query into words for multi-word search
  const words = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return data;
  }

  // Helper function to get all searchable field values for an item
  const getSearchableFields = (item) => {
    const fields = [];
    searchParam.forEach((param) => {
      const value = getFieldValue(item, param);
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v) => {
            if (v) fields.push(String(v).toLowerCase());
          });
        } else {
          fields.push(String(value).toLowerCase());
        }
      }
    });
    return fields;
  };

  // Score and filter items
  const scored = data.map((item) => {
    const fields = getSearchableFields(item);
    const allFieldsText = fields.join(" ");

    // Check if ALL words match somewhere (AND logic + word order independence)
    const allWordsMatch = words.every(
      (word) =>
        fields.some((field) => field.includes(word)) ||
        allFieldsText.includes(word)
    );

    if (!allWordsMatch) return { item, score: 0 };

    // Calculate score for ranking
    let score = 0;
    words.forEach((word) => {
      fields.forEach((field) => {
        if (field === word) {
          score += 100; // Exact match
        } else if (field.startsWith(word)) {
          score += 50; // Word starts with query
        } else if (field.split(" ").some((w) => w.startsWith(word))) {
          score += 30; // Any word in field starts with query
        } else if (field.includes(word)) {
          score += 10; // Partial match
        }
      });
    });

    return { item, score };
  });

  // Filter out non-matches and sort by score (highest first)
  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);
}

/**
 * Creates a field value getter function for common flight/operation data
 * @param {Function} getDateOnly - Optional date formatting function
 * @returns {Function} - Field value getter function
 */
export function createFlightFieldGetter(getDateOnly) {
  return (item, param) => {
    switch (param) {
      case "Trip Number":
        return [item.flightZasRefrance, item.flightZastripNumber];
      case "Flight Number":
        return item.flightNumber;
      case "Registration Number":
        return [item.flightRegsiterNumber, item.flightRegistrationNumber];
      case "ZAS Reference":
        return item.flightPermitRefrance;
      case "Agent":
        return item.flightAgentName;
      case "Operator":
        return item.flightOperatorName;
      case "Created By":
        return item.flightCreatedByUserName;
      case "Stations":
        return item.flightRouteStationName;
      case "Arrival Date":
        return getDateOnly
          ? getDateOnly(item.flightStimatedArrivalTime)
          : item.flightStimatedArrivalTime;
      case "Purpose":
        return item.flightPurpose;
      default:
        return null;
    }
  };
}

/**
 * Creates a field value getter function for employee data
 * @returns {Function} - Field value getter function
 */
export function createEmployeeFieldGetter() {
  return (item, param) => {
    switch (param) {
      case "Name":
        return [item.personalName, item.personalAttCode];
      case "Department":
        return item.personalDepartmentName;
      case "Job Title":
        return item.personalJopName;
      case "Email":
        return [item.personalEmail, item.personalWorkMail];
      default:
        return null;
    }
  };
}

/**
 * Creates a field value getter function for quotation/sales data
 * @returns {Function} - Field value getter function
 */
export function createQuotationFieldGetter() {
  return (item, param) => {
    switch (param) {
      case "Quotation No.":
        return [
          item.quotationNumber,
          item.orderHeaderOrderNumber,
          item.orderHeaderRefrance,
          item.orderHeaderZasFlightNumber,
          item.orderHeaderStationName,
          item.orderHeaderFlightNumberName,
          item.orderHeaderOperatorName,
        ];
      case "Sales Person":
        return [item.createdBy, item.orderHeaderSalesPerson];
      case "Flight No.":
        return [item.flightNumber, item.orderHeaderFlightNumberName];
      case "Trip No.":
        return item.tripNumber;
      case "Bill To":
        return item.billTo;
      default:
        return null;
    }
  };
}

/**
 * Creates a field value getter function for purchasing data
 * @returns {Function} - Field value getter function
 */
export function createPurchasingFieldGetter() {
  return (item, param) => {
    switch (param) {
      case "Request No.":
        return item.purchasingNumber || item.requestNumber;
      case "Group":
        return item.groupName;
      case "Item":
        return item.itemName;
      case "SubGroup":
        return item.subGroupName;
      case "Brand":
        return item.brandName;
      case "Supplier":
        return item.supplierName;
      default:
        return null;
    }
  };
}

/**
 * Creates a field value getter function for invoice data
 * @returns {Function} - Field value getter function
 */
export function createInvoiceFieldGetter() {
  return (item, param) => {
    switch (param) {
      case "Invoice No.":
      case "Invoice Number":
        return item.invoiceNumber;
      case "Client":
        return item.clientName;
      case "Created By":
        return item.createdBy;
      case "Date":
        return item.invoiceDate;
      case "Amount":
        return item.amount;
      default:
        return null;
    }
  };
}

export default smartSearch;
