# Interactive Guide System - Documentation & Update Template

_This file lives in the project root. Share it with the AI whenever you want to add, edit, or remove guide steps._

---

## How the Guide System Works

The application uses a **fully custom guided tour** (inspired by SkyTour) built with React and CSS — no third-party library.

### Key Files

| File                                  | Purpose                                                |
| ------------------------------------- | ------------------------------------------------------ |
| `src/components/guide/GlobalTour.jsx` | Main tour engine + all step definitions                |
| `src/components/guide/GlobalTour.css` | All tour styles (overlay, spotlight, tooltip, buttons) |
| `src/context/GuideContext.jsx`        | Global `guideEnabled` state (always starts as `false`) |
| `src/assets/layout/Navbar.jsx`        | Guide toggle button (visible to logged-in users only)  |

### How It Works (Technical Summary)

1. User clicks the **"Guide"** button in the Navbar → `guideEnabled` becomes `true`.
2. `GlobalTour.jsx` evaluates the current view (modals take precedence, then it checks `location.pathname` via React Router) and loads the matching step list. If no guide is defined for a route, it displays a "Coming Soon" fallback.
3. A `requestAnimationFrame` loop continuously tracks the position of the current target element.
4. A **spotlight cutout** (`box-shadow: 0 0 0 9999px rgba(0,0,0,0.65)`) dims the rest of the page and highlights the target.
5. A **tooltip card** smoothly transitions between steps using CSS `transform: translate3d`.
6. The user navigates using **Next / Back / Skip** buttons. No hidden circles or beacons.
7. When the tour finishes or is skipped, `guideEnabled` resets to `false`.

### Step Object Structure

Each step in `GlobalTour.jsx` follows this structure:

```js
{
  target: '#guide-my-element',           // CSS ID selector on the DOM element
  titleEN: 'My Feature',                 // Tooltip title in English
  titleAR: 'ميزتي',                      // Tooltip title in Arabic
  contentEN: 'This does X and Y...',     // Explanation in English
  contentAR: 'هذا يقوم بـ X و Y...',    // Explanation in Arabic
  placement: 'bottom',                   // 'top' | 'bottom' | 'left' | 'right'
  spotlightPadding: {                    // Optional: extra space around the spotlight
    top: 6, left: 6, right: 6, bottom: 6
  },
}
```

### Current Step Lists

#### Dashboard Tour (`DASHBOARD_STEPS`)

Steps shown when the user is on the home page (no modal open):

| #   | Target ID                | Title              |
| --- | ------------------------ | ------------------ |
| 1   | `#guide-station-select`  | Station Selector   |
| 2   | `#guide-menu-prices`     | Live Menu Prices   |
| 3   | `#guide-add-order-btn`   | Create a New Order |
| 4   | `#guide-orders-carousel` | Your Active Orders |

#### Modal Tour (`MODAL_STEPS`)

Steps shown when the Create Order modal is open:

| #   | Target ID             | Title                 |
| --- | --------------------- | --------------------- |
| 1   | `#guide-modal-step-0` | Flight Details        |
| 2   | `#guide-modal-step-1` | Payment & Billing     |
| 3   | `#guide-modal-step-2` | Dates & Bank Transfer |
| 4   | `#guide-modal-step-3` | Delivery Date & Time  |

#### Order Details Tour (`ORDER_DETAILS_STEPS`)

Steps shown when navigating to an active order (`/order/:id`):

| #   | Target ID                    | Title                 |
| --- | ---------------------------- | --------------------- |
| 1   | `#guide-order-send-to-sky`   | Send to Sky Culinaire |
| 2   | `#guide-order-final-confirm` | Final Confirmation    |
| 3   | `#guide-order-track`         | Track Your Order      |
| 4   | `#guide-order-edit`          | Edit Order            |
| 5   | `#guide-order-archive`       | Send to Archive       |
| 6   | `#guide-order-cancel`        | Cancel Order          |

#### Cart Tour (`CART_STEPS`)

Steps shown when the user is on the cart page (`/cart`):

| #   | Target ID                    | Title                 |
| --- | ---------------------------- | --------------------- |
| 1   | `#guide-cart-orders-list`    | Active Orders Carousel|
| 2   | `#guide-cart-order-info`     | Active Order Details  |
| 3   | `#guide-cart-order-items`    | Order Items & Management|

#### My Orders Tour (`MY_ORDERS_STEPS`)

Steps shown when the user is on the My Orders page (`/my-account/orders`):

| #   | Target ID                      | Title                 |
| --- | ------------------------------ | --------------------- |
| 1   | `#guide-myorders-flight-info`  | Flight Information    |
| 2   | `#guide-myorders-track`        | Track Order           |
| 3   | `#guide-myorders-archive`      | Send to Archive       |
| 4   | `#guide-myorders-order-again`  | Order Again           |
| 5   | `#guide-myorders-view-details` | View Full Order       |
| 6   | `#guide-myorders-filter`       | Filter Orders         |

---

## How to Request Updates

To add a new guide step or modify an existing one, copy the template below, fill it in, and send it to the AI.

### How to Add a Target ID to a UI Element

Before a step can be added, the target element **must have a unique `id`** in the JSX. Example:

```jsx
// Before
<button className="...">Export</button>

// After — add the id
<button id="guide-reports-export" className="...">Export</button>
```

---

## 📋 Copy & Paste Request Template

```text
I want to update the interactive guide system in GlobalTour.jsx.
Please use the custom SkyTour-style step structure (titleEN, titleAR, contentEN, contentAR, target, placement).

**Tour / Page:** [e.g., Reports Page Tour — add to DASHBOARD_STEPS or create a new step list]

**Step 1:**
- File: [e.g., src/pages/reports/Reports.jsx]
- Element: [e.g., The "Export PDF" button]
- Add this ID to the element: `guide-reports-export`
- titleEN: "Export Report"
- titleAR: "تصدير التقرير"
- contentEN: "Click this button to export the current report as a PDF file."
- contentAR: "انقر على هذا الزر لتصدير التقرير الحالي كملف PDF."
- placement: bottom
- spotlightPadding: { top: 6, left: 10, right: 10, bottom: 6 }

**Step 2:**
- File: [...]
- Element: [...]
- Add this ID: `guide-[unique-name]`
- titleEN: "..."
- titleAR: "..."
- contentEN: "..."
- contentAR: "..."
- placement: top

(Add as many steps as needed...)

**Additional Notes:**
- [Optional: e.g., "Only show this tour for Admin users", "Start this tour when the modal opens", etc.]
```
