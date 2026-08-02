
import React, { useCallback } from "react";
import HelperIcons from "./HelperIcons";

/**
 * Hook to provide reusable generic templates for lists/grids.
 * 
 * @param {Object} config - Configuration object
 * @param {Function} config.onEdit - Callback function for edit action
 * @param {Object} config.starMutation - Mutation object for starring (must have .mutate)
 * @param {Object} config.deleteMutation - Mutation object for deleting (must have .mutate)
 * @param {String} config.idField - Field name for the ID (default: "foodMenuItemId")
 * @param {String} config.approvedField - Field name for the approved status (default: "foodMenuItemIsApproved")
 * 
 * @returns {Object} Dictionary of template render functions: { actions, approved }
 */
const useGenericTemplates = ({ 
  onEdit, 
  starMutation, 
  deleteMutation,
  idField = "",
  checkboxField = "",
	mutationIdKey = "orderId"
}) => {

  const actions = useCallback((props, options = {}) => {
    const finalOnEdit = options.onEdit || onEdit;
    const finalStarMutation = options.starMutation || starMutation;
    const finalDeleteMutation = options.deleteMutation || deleteMutation;

    return (
      <HelperIcons
        onEdit={() => finalOnEdit && finalOnEdit(props)}
        onStar={() => finalStarMutation?.mutate && finalStarMutation.mutate({ [mutationIdKey]: props[idField] })}
        onDelete={() => {
             if (finalDeleteMutation?.mutate) {
                 finalDeleteMutation.mutate({ [mutationIdKey]: props[idField] });
             } else if (typeof finalDeleteMutation === 'function') {
                 finalDeleteMutation(props);
             }
        }}
        isStarred={props.personalIsStar || props.orderHeaderIsStare}
        noBottomBorder
      />
    );
  }, [onEdit, starMutation, deleteMutation, idField, mutationIdKey]);

  const checkBox = useCallback((props) => {
    return (
      <div className="record-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <input
          type="checkbox"
          checked={props[checkboxField] || false}
          disabled
          style={{ width: '18px', height: '18px', cursor: 'default' }}
        />
      </div>
    );
  }, [checkboxField]);

  const date = useCallback((dateValue) => {
    return formatDateValue(dateValue);
  }, []);

  const money = useCallback((amount, currency) => {
      const formattedAmount = formatMoneyValue(amount);
      return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", paddingRight: "5px" }}>
            <span style={{ fontWeight: "500",fontSize: "1em", color: "#777" }}>{currency}</span>
            <span style={{ fontWeight: "600" }}>{formattedAmount}</span>
        </div>
      );
  }, []);

  const status = useCallback((statusValue) => {
      // Basic status pill implementation. You might want to enhance this with specific colors based on status text.
      let color = "#555";
      let bg = "#eee";
      
      const lower = String(statusValue || "").toLowerCase();
      if(lower.includes("approv") || lower.includes("paid") || lower.includes("receiv") || lower.includes("collect")) {
          color = "#2e7d32"; bg = "#e8f5e9";
      } else if (lower.includes("pending") || lower.includes("proced")) {
          color = "#ed6c02"; bg = "#fff3e0";
      } else if (lower.includes("reject")) {
          color = "#d32f2f"; bg = "#ffebee";
      }

      return (
         <div style={{ 
             color: color, 
             background: bg, 
             padding: "4px 8px", 
             borderRadius: "12px", 
             display: "inline-block", 
             fontSize: "0.85em", 
             fontWeight: "500",
             textAlign: "center",
             minWidth: "80px"
         }}>
             {statusValue}
         </div>
      );
  }, []);

  return {
    actions,
    checkBox,
    date,
    money,
    status
  };
};

// --- Helper Functions for Formatting ---
const formatDateValue = (input) => {
  if (!input) return "";
  const date = new Date(input);
  if (isNaN(date.getTime())) return input; // fallback
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
};

const formatMoneyValue = (amount) => {
  return amount ? Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';
};

// --- Column Templates Generators ---

/**
 * Creates a template function for Date columns.
 * Usage: template: dateTemplate("cashTransactionDate")
 */
export const dateTemplate = (field) => (item) => {
  return formatDateValue(item[field]);
};

/**
 * Creates a template function for Money columns.
 * Usage: template: moneyTemplate("amount", "currency")
 */
export const moneyTemplate = (amountField, currencyField = "currencyName") => (item) => {
   const currency = item[currencyField] || "";
   const amount = formatMoneyValue(item[amountField]);
   
   return (
     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", paddingRight: "5px" }}>
			 <span style={{ fontWeight: "500",fontSize: "1em", color: "#777" }}>{currency}</span>
       <span style={{ fontWeight: "600" }}>{amount}</span>
     </div>
   );
};

export default useGenericTemplates;
