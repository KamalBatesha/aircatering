import toast from "react-hot-toast";

/**
 * onlineOrderToast - Centralized toast utility for Sky Culinaire.
 * Handles de-duplication (id: 1) and provides consistent styling.
 */

const DEFAULT_ID = 1;

const baseStyles = {
  fontSize: "14px",
  borderRadius: "10px",
  padding: "12px 16px",
  maxWidth: "350px",
  fontWeight: "500",
  boxShadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
};

export const onlineOrderToast = {
  success: (message, options = {}) => {
    return toast.success(message, {
      id: options.id || DEFAULT_ID,
      ...options,
      style: {
        ...baseStyles,
        background: "#10B981",
        color: "#fff",
        ...options.style,
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#10B981",
        ...options.iconTheme,
      },
    });
  },

  error: (message, options = {}) => {
    return toast.error(message, {
      id: options.id || DEFAULT_ID,
      ...options,
      style: {
        ...baseStyles,
        background: "#EF4444",
        color: "#fff",
        ...options.style,
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#EF4444",
        ...options.iconTheme,
      },
    });
  },

  loading: (message, options = {}) => {
    return toast.loading(message, {
      id: options.id || DEFAULT_ID,
      ...options,
      style: {
        ...baseStyles,
        background: "#B88E52",
        color: "#fff",
        ...options.style,
      },
    });
  },

  /**
   * Use this for simple messages or custom icons
   */
  info: (message, options = {}) => {
    return toast(message, {
      id: options.id || DEFAULT_ID,
      ...options,
      style: {
        ...baseStyles,
        background: "#4B5563",
        color: "#fff",
        ...options.style,
      },
    });
  },

  promise: (promise, msgs, options = {}) => {
    return toast.promise(
      promise,
      {
        loading: msgs.loading || "Loading...",
        success: msgs.success || "Success!",
        error: msgs.error || "Error!",
      },
      {
        id: options.id || DEFAULT_ID,
        ...options,
        style: {
          ...baseStyles,
          ...options.style,
        },
        success: {
          style: {
            ...baseStyles,
            background: "#10B981",
            color: "#fff",
            ...options.success?.style,
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#10B981",
            ...options.success?.iconTheme,
          },
        },
        error: {
          style: {
            ...baseStyles,
            background: "#EF4444",
            color: "#fff",
            ...options.error?.style,
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#EF4444",
            ...options.error?.iconTheme,
          },
        },
        loading: {
          style: {
            ...baseStyles,
            background: "#3B82F6",
            color: "#fff",
            ...options.loading?.style,
          },
        },
      },
    );
  },

  dismiss: (id = DEFAULT_ID) => {
    toast.dismiss(id);
  },
};

/**
 * Hook-style or direct utility to handle promise/mutation states
 * can be added here if needed.
 */
