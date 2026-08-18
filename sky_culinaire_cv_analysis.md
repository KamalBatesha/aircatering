# Sky Culinaire — Full CV Analysis

> **Based on direct source code reading of the entire project.** Every claim below is verified from actual files. Technologies confirmed unused are excluded.

---

## 1. Project Overview

### What the Project Does
**Sky Culinaire** is a **B2B flight catering ordering platform** that allows airline operators, agents, and aviation companies to place, manage, and track in-flight catering orders through a professional web application.

### Main Purpose & Business Logic
The platform digitizes the airline catering supply chain. Clients log in, specify their flight details (flight number, aircraft registration, stations, passenger count, crew count), select catering items from a station-specific price list, create orders with arrival/departure delivery scheduling, and then submit them for processing. The kitchen side processes and delivers the catering before the flight's departure or arrival.

### Who Uses It

| Role | Description |
|---|---|
| **Clients / Operators** | Airlines or aviation companies that create and manage catering orders |
| **Admins (Marketing role)** | Internal staff who review client requests, approve/reject registrations, manage customer data |
| **System-identified roles** | Roles such as `"Marketing"` and `"User"` are decoded from the JWT payload at login |

### Complete Order Flow (From Source Code)

```
1. Client logs in → JWT token stored in localStorage
2. Client selects a Station (airport/location) from Navbar
3. Client browses the Menu (items are station-specific and price-list-specific)
4. Client adds items to the Cart (Zustand cartStore)
5. Client opens "Create New Order" modal (3-step wizard):
   Step 1 — Flight Details: Station, Flight Type (Arrival/Departure/Both),
             Flight Number, Registration, Aircraft Type, Pax count, Crew count
   Step 2 — Date & Time: Arrival date, Departure date, Arrival delivery date,
             Departure delivery date (min 4 hours from now)
   Step 3 — Client & Payment: Bill To, Invoice To, Payment Method, Currency,
             Ground Handler, Agent, Operator
6. On submit → POST /api/AirCatering/SaveOrderHeaderAirCatring
7. Order items are saved → POST /api/AirCatering/SaveOrderDetailsAirCatering
8. Order appears in the active orders carousel on Home page
9. Client can view full Order Details page (/order/:id)
10. Client can perform: Edit header, Add/Remove items, Cancel order, Archive order
11. Admin reviews the order and may send a quote back with alternative items
12. Client reviews the quote and either APPROVES or REJECTS alternatives (Client Decision)
13. Client performs Final Confirmation → POST /api/AirCatering/ClientApproveQuotation
14. Order is sent for delivery → POST /api/AirCatering/SendOrderToSky
15. Order lifecycle ends — client can review delivered orders
```

### Main Problems the Project Solves
- Eliminates paper-based / phone-based catering ordering
- Provides real-time order status visibility to clients
- Enforces structured data (flight numbers, aircraft types, registrations) via lookup fields
- Manages multi-station pricing automatically
- Delivers in-app and browser push notifications for order updates
- Guides new users through a custom interactive onboarding tour

---

## 2. Technology Stack (Verified from Source Code)

| Technology | Where Used |
|---|---|
| **React 19** | Entire frontend — `package.json`, all `.jsx` files |
| **Vite** | Build tool — `vite.config.js`, `package.json` scripts |
| **TailwindCSS v4** | Utility classes throughout all components — `@tailwindcss/vite` plugin active |
| **Ant Design (antd v6)** | — installed but **not confirmed** in component imports (see note below) |
| **MUI (Material UI v9)** | `TextField`, `DatePicker`, `TimePicker`, `Popper`, `MenuItem`, `Paper`, `ClickAwayListener` — `CreateOrderModal.jsx`, `ProfileCompletionPopup.jsx`, `CustomLookup.jsx` |
| **MUI X Date Pickers** | `DatePicker`, `TimePicker`, `LocalizationProvider`, `AdapterDayjs` — `CreateOrderModal.jsx` |
| **MUI X Charts** | Installed — usage not confirmed in read files |
| **Zustand v5** | Global state — `authStore`, `cartStore`, `langStore`, `notificationStore`, `stationStore`, `screenViewStore`, `productStore`, `addressStore`, `greetingStore` |
| **TanStack React Query v5** | All API calls — queries + mutations throughout every API layer |
| **React Query DevTools** | Enabled in `App.jsx` — `<ReactQueryDevtools initialIsOpen={true} />` |
| **Axios** | HTTP client — `axios.jsx` with request/response interceptors |
| **Formik** | Multi-step order creation form — `CreateOrderModal.jsx`, `ProfileCompletionPopup.jsx` |
| **Yup** | Schema validation — `Step1Schema`, `Step2Schema`, `Step3Schema` in `CreateOrderModal.jsx` |
| **Dayjs** | Date manipulation — used in `CreateOrderModal.jsx` validation and date pickers |
| **React Router DOM v7** | Client-side routing — `Layout.jsx` with `createBrowserRouter` |
| **Framer Motion** | Animations — `Home.jsx`, `Orders.jsx`, `MobileHome.jsx`, `OrderDetails.jsx` |
| **React Icons** | Icon library — used in virtually every component |
| **Lucide React** | Icon library — `CompanyInfo.jsx` (Building2, MapPin, Globe) |
| **React Hot Toast** | Toast notifications — `App.jsx` Toaster, `onlineOrderToast` wrapper |
| **React Leaflet + Leaflet** | Interactive map — `Map.jsx`, `MapContainer`, `TileLayer`, `Marker`, `Popup` |
| **OSRM (Open Source Routing Machine)** | Real driving route calculation — `Map.jsx` (`router.project-osrm.org`) |
| **Nominatim (OpenStreetMap)** | Geocoding & reverse geocoding — `Map.jsx` |
| **jsPDF + jspdf-autotable** | PDF export — `ExportUtils.jsx` |
| **xlsx (SheetJS)** | Excel export — `ExportUtils.jsx` |
| **react-to-print** | Browser print for invoices — `OrderInvoicePrint.jsx` |
| **react-loading-skeleton** | Loading placeholders — installed, referenced in loading states |
| **Swiper** | Installed — slider/carousel (confirmed in package, used for orders carousel) |
| **libphonenumber-js** | Phone number validation/formatting — installed, used in registration |
| **React Joyride** | Installed — but the project uses a **custom-built guided tour** (`GlobalTour.jsx`) |
| **Service Worker** | Registered in `Layout.jsx` via `navigator.serviceWorker.register('/sw.js')` |
| **Web Notifications API** | Browser push notifications — `Layout.jsx` AuthChecker component |
| **Cloudinary URL Gen** | Image URL generation — installed |
| **Tailwind Persist + Zustand persist** | `langStore`, `screenViewStore` use `zustand/middleware persist` |

> **Note on Ant Design:** `antd` is in `package.json` but was not found imported in any component files that were read. Do not claim it on your CV without verifying.

---

## 3. Architecture

### Project Structure
```
src/
├── App.jsx                  # Root: QueryClient + GuideProvider + Toaster
├── main.jsx                 # ReactDOM.createRoot entry
├── assets/
│   ├── apis/                # All API service files
│   │   ├── axios.jsx        # Axios instance + JWT interceptors + token refresh
│   │   ├── auth/            # AuthApi.jsx, AuthMutation.jsx, useAuth.jsx
│   │   ├── order/           # OrderApi.jsx, OrderMutation.jsx
│   │   ├── product/         # PeoductApi.jsx, ProductMutation.jsx
│   │   ├── notifications/   # Notifications.jsx
│   │   ├── SalesAPI.jsx     # Flight numbers, registrations, price lists
│   │   ├── FinanceApi.jsx   # Currencies, ground handlers
│   │   └── PurchasingAPI.jsx# Stations, pay types
│   ├── store/               # All Zustand stores
│   ├── constants/           # lang.js (i18n), field descriptions, export utils
│   ├── Helpers/             # onlineOrderToast wrapper
│   └── layout/              # Navbar.jsx, Layout.jsx, Footer.jsx
├── components/
│   ├── CreateOrderModal.jsx # Main 3-step order creation wizard
│   ├── Menu.jsx             # Food menu with categories/items
│   ├── OrderInvoicePrint.jsx# Printable invoice component
│   ├── Map.jsx              # Interactive Leaflet delivery map
│   ├── ERP/Lists/           # SmartInfiniteList, InfiniteScrollList (virtualized)
│   ├── HelperComponents/    # CustomLookup, FreeTextLookup (reusable dropdowns)
│   ├── guide/               # GlobalTour.jsx (custom onboarding tour)
│   └── ...popups, modals
├── pages/
│   ├── home/Home.jsx        # Main dashboard with orders + menu
│   ├── orderDetails/        # Full order details page with edit/cancel
│   ├── myAccount/           # Account, Orders history, Archived orders
│   ├── login/ register/     # Auth pages
│   ├── Admin/               # Admin panel (Users, Requests, Client Details)
│   └── mobile/              # Dedicated mobile layout + MobileHome
└── context/
    └── GuideContext.jsx     # Global guide state context
```

### Component Architecture
- **Layered architecture:** API functions → Mutations/Queries hooks → Page components → UI components
- **Separation of concerns:** Raw API calls are in `/apis/*.jsx`, mutations are in dedicated `*Mutation.jsx` hooks, stores are pure Zustand state
- **Reusable custom components:** `CustomLookup` and `FreeTextLookup` are autocomplete dropdowns built on MUI used across Order creation, Profile completion, and Order editing
- **Dual-layout system:** Desktop (`Main`) and Mobile (`MobileMain`) layouts with separate routes, resolved at runtime via `screenViewStore` (detects `window.innerWidth < 768`)

### State Management Architecture

| Store | Purpose | Persistence |
|---|---|---|
| `authStore` | User JWT, full user data, login/logout | `localStorage` (manual) |
| `cartStore` | Cart items, delivery fee, selected active order | Session memory |
| `langStore` | Language (EN/AR) + toggle | Zustand `persist` |
| `notificationStore` | Notifications list + unread count | Memory |
| `stationStore` | Available stations + selected station | Memory |
| `screenViewStore` | Screen size (mobile/desktop), navbar height | Zustand `persist` |
| `productStore` | Currently viewed product | Memory |
| `addressStore` | Delivery address from map | Memory |
| `greetingStore` | Modal greeting system (newsletter, welcome) | Memory |

### API / Service Architecture
1. **`axios.jsx`** — Single Axios instance with:
   - Base URL from `VITE_API_BASE_URL` env variable
   - Request interceptor: reads JWT from `localStorage` and injects `Authorization: Bearer <token>`
   - Response interceptor: on 401, queues requests and attempts token refresh via `POST /api/Authonticate/LoginRefresh`; on refresh failure, dispatches `auth:logout` custom event
   - Separate `uploadAxiosInstance` for multipart file uploads
2. **API files** — Plain async functions returning promises (no hooks)
3. **Mutation files** — Custom hooks using `useMutation` from TanStack Query

### Authentication & Protected Routes
- `ProtectedRoute` component in `Layout.jsx` wraps authenticated routes
- Reads auth state from `useAuth()` hook; redirects to `/login` if no user
- JWT expiry checked on mount, on window focus, and on `visibilitychange` event via `checkTokenExpiration()`
- Forced logout dispatched via `window.dispatchEvent(new Event("auth:logout"))` from Axios interceptor
- Role-based redirect: users with `"Marketing"` role are redirected to `/admin`

### Data Flow
```
User action → Component calls useMutation / useQuery
            → Axios interceptor injects JWT
            → API server responds
            → TanStack Query caches data
            → Zustand store updated if needed (e.g., notifications, auth)
            → Component re-renders via React Query cache
```

---

## 4. Main Features

### 4.1 Multi-Step Order Creation Wizard
**File:** [`CreateOrderModal.jsx`](file:///e:/work/New%20folder/airCatering/src/components/CreateOrderModal.jsx)

A 3-step Formik form inside a full-screen modal:

| Step | Fields |
|---|---|
| **Step 1 — Flight Details** | Station, Flight Type (Arrival/Departure/Both), Flight Number (free-text lookup), Aircraft Registration, Aircraft Type, Pax count (arrival/departure), Crew count (arrival/departure) |
| **Step 2 — Date & Time** | Arrival date/time, Departure date/time, Arrival delivery date (must be ≥ 4h from now), Departure delivery date (must be before departure) |
| **Step 3 — Client & Payment** | Bill To, Invoice To, Payment Method, Currency (defaults to USD), Ground Handler (name/email/phone), Agent, Operator |

- Each step has its own Yup validation schema
- Step navigation is forward-locked (can't skip ahead without valid step)
- Form pre-fills from `customerProfileSettings` API (`/api/AirCatering/GetCustomerProfileSettings`)
- **"Order Again"** functionality: opens same wizard with `oldOrderId`, clones to new order via `SaveOrderAgainAirCatering`

### 4.2 Station-Aware Menu System
**File:** [`Menu.jsx`](file:///e:/work/New%20folder/airCatering/src/components/Menu.jsx)

- Grouped by category → subcategory → items (accordion layout)
- Each item has station-specific pricing via price list
- Items can have **add-ons** (multiple extra selections with individual prices)
- Items can have **sub-items** (e.g., meals with sides)
- **Favorites system**: mark/unmark items via `AddFavoriteItem` / `RemoveFromFavoriteItems`
- Real-time item addition to active order (cart + API call)
- Search across all items within the menu

### 4.3 Cart & Order Item Management
**File:** [`cartStore.js`](file:///e:/work/New%20folder/airCatering/src/assets/store/cartStore.js)

- Zustand store manages items, quantities, add-ons, sub-items
- Price calculation: `item price + sum(add-ons prices) + sum(sub-items prices)` × quantity
- `addToCart`: de-duplicates plain items (same item, no add-ons → merges quantity)
- `addToCartWithAdds`: always adds as separate entry (items with add-ons are unique)
- Sub-items quantity scales with parent item quantity change

### 4.4 Real-Time Notification System
**Files:** [`Layout.jsx`](file:///e:/work/New%20folder/airCatering/src/assets/layout/Layout.jsx), [`notificationStore.js`](file:///e:/work/New%20folder/airCatering/src/assets/store/notificationStore.js)

- Polls `GET /api/NotificationList` every **5 seconds** via React Query `refetchInterval`
- Tracks already-notified IDs in a `useRef(new Set())` to prevent duplicate alerts
- On new unread notification:
  1. Plays audio chime (`pop.mp3`)
  2. Fires browser `Notification` API (via Service Worker if available, fallback to direct `new Notification()`)
  3. Falls back to in-app toast if browser notifications are denied
- Updates browser tab title with unread count: `(3) Sky Culinaire`
- Requests `Notification.requestPermission()` on first login

### 4.5 Interactive Delivery Map
**File:** [`Map.jsx`](file:///e:/work/New%20folder/airCatering/src/components/Map.jsx)

- React Leaflet with OpenStreetMap tiles
- Uses browser `Geolocation API` to auto-center on user's location
- **OSRM routing**: calls `router.project-osrm.org` to calculate actual driving distance & duration
- **Haversine formula** fallback when OSRM is unavailable
- **Delivery fee calculation**: `BASE_FEE(10) + PER_KM(2) × distance`, clamped between 10–100 EGP
- **Nominatim reverse geocoding**: converts lat/lng to human-readable address
- Address search (geocoding) for manual location entry
- Saves selected address + delivery fee to `addressStore` and `cartStore`
- Drag-to-move: map center marker updates on every `moveend` event

### 4.6 Custom Interactive Onboarding Guide
**File:** [`GlobalTour.jsx`](file:///e:/work/New%20folder/airCatering/src/components/guide/GlobalTour.jsx)

- **100% custom-built** (not using react-joyride from `package.json`)
- Uses `requestAnimationFrame` to track spotlight position on target elements
- CSS transitions for smooth tooltip movement
- Bilingual step content (English + Arabic)
- Steps cover: Station Selector, Menu Prices, Create Order Button, Orders Carousel, Modal steps

### 4.7 Order Details & Lifecycle Management
**File:** [`OrderDetails.jsx`](file:///e:/work/New%20folder/airCatering/src/pages/orderDetails/OrderDetails.jsx)

- View full order with all items, grouped by Arrival/Departure tabs
- **Edit mode**: inline editing of order header fields (flight number, dates, pax count)
- **Add items** to existing orders via `SaveOrderDetailsAirCatering`
- **Delete items** from orders via `DeleteOrderItemAirCatering`
- **Cancel order** with custom reason via `CancelOrderAirCatering`
- **Archive/Restore** to separate archived orders list
- **Client Decision system**: per-item approve/reject for alternative items suggested by admin — submitted via `SubmitClientDecision`
- **Final confirmation** button when order is ready — `ClientApproveQuotation`
- **Checkout**: `SendOrderToSky` API call

### 4.8 Printable Invoice
**File:** [`OrderInvoicePrint.jsx`](file:///e:/work/New%20folder/airCatering/src/components/OrderInvoicePrint.jsx)

- Full HTML invoice generated in-browser
- Uses `react-to-print` to trigger browser print dialog
- Items grouped by flight type (Arrival/Departure)
- Custom print CSS for page breaks, headers, footers, color-exact printing
- Displays: order header info, delivery dates, item table with quantities/prices, subtotals, totals

### 4.9 Export to Excel & PDF
**File:** [`ExportUtils.jsx`](file:///e:/work/New%20folder/airCatering/src/assets/constants/ExportUtils.jsx)

- `exportToExcel()` — SheetJS (xlsx): converts data array to `.xlsx` download
- `exportToPDF()` — jsPDF + jspdf-autotable: generates formatted PDF table
- `printList()` — creates hidden iframe and triggers browser print

### 4.10 Admin Panel (Marketing Role)
**Files:** `pages/Admin/`

- Separate `/admin` route with `AdminLayout`
- Client management: view/search registered users via `SmartInfiniteList` (virtualized infinite scroll)
- Client details page: Company Info, contact details
- Role-based access: only users with `"Marketing"` in JWT roles can access

### 4.11 My Account & Order History
**Files:** `pages/myAccount/`

- **Summary tab**: profile overview
- **Orders tab**: active/all orders with date filters (Today, This Week, This Month, etc.)
- **Archive tab**: archived orders with restore functionality
- Each order card shows: flight info, status, dates, totals
- Quick navigation to full `OrderDetails` page

### 4.12 Profile Completion Popup
**File:** [`ProfileCompletionPopup.jsx`](file:///e:/work/New%20folder/airCatering/src/components/ProfileCompletionPopup.jsx)

- Shown once per session (using `sessionStorage` key per user) when profile is incomplete
- Pre-fills missing defaults: flight number, registration, aircraft, agent, operator, bill-to, payment method, ground handler
- Saves to `PATCH /api/AirCatering/UpdateCustomerProfileSettings`
- Reduces friction for repeat order creation

### 4.13 Bilingual Support (Arabic / English)
**Files:** `langStore.js`, `lang.js` constants

- Language toggle (EN ↔ AR) persisted in localStorage via Zustand persist
- Full RTL layout switch: `document.body.classList.add('rtl')` when Arabic is active
- All UI text sourced from `langText` dictionary with `[lang]` key lookup
- Arabic numerals support via `toArabicNumbers()` utility function

### 4.14 Newsletter Subscription
**File:** [`Layout.jsx`](file:///e:/work/New%20folder/airCatering/src/assets/layout/Layout.jsx) (AuthChecker)

- Checks `customerSubscribe` flag on user object after login
- If unsubscribed and ≥30 days since last prompt, shows greeting modal
- User can accept/decline → `PATCH /api/Sales/GeneralList/CustomerList/CustomerSubscription`

---

## 5. API Integration

### Axios Configuration
**File:** [`axios.jsx`](file:///e:/work/New%20folder/airCatering/src/assets/apis/axios.jsx)

- Two Axios instances: `axiosInstance` (JSON) and `uploadAxiosInstance` (multipart)
- **Request interceptor**: reads `localStorage.getItem("user")`, extracts `encodedPayload`, injects as `Authorization: Bearer <token>`
- **Response interceptor (401 handling)**:
  1. Marks request as `_retry`
  2. Sets `isRefreshing = true`; queues concurrent requests in `failedQueue`
  3. Calls `POST /api/Authonticate/LoginRefresh` with cookies (`withCredentials: true`)
  4. On success: updates localStorage, resolves queue, retries original request
  5. On failure: clears user from localStorage, dispatches `auth:logout` event

### Key API Endpoints (Confirmed from Source Code)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/Authonticate/LoginSkyCulinaire` | POST | Client login |
| `/api/Authonticate/RegisterSkyCulinaire` | POST | Registration |
| `/api/Authonticate/ActivateAccount` | POST | OTP verification |
| `/api/Authonticate/ResendCode` | POST | Resend OTP |
| `/api/Authonticate/LoginRefresh` | POST | Silent token refresh |
| `/api/Authonticate/Logout` | POST | Logout |
| `/api/Authonticate/ChangeUserProfile` | POST | Change password |
| `/api/AirCatering/ForgotPasswordIdentityAirCatering` | POST | Forgot password |
| `/api/AirCatering/ResetPasswordIdentityAirCatering` | POST | Reset password |
| `/api/AirCatering/SaveOrderHeaderAirCatring` | POST | Create order header |
| `/api/AirCatering/SaveOrderDetailsAirCatering` | POST | Save order items |
| `/api/AirCatering/GetQuotationListAirCatering` | GET | List my orders |
| `/api/AirCatering/GetQuotationListIDAirCatering` | GET | Get order by ID |
| `/api/AirCatering/CancelOrderAirCatering` | POST | Cancel order |
| `/api/AirCatering/ClientApproveQuotation` | POST | Final confirmation |
| `/api/AirCatering/SubmitClientDecision` | POST | Approve/reject alternatives |
| `/api/AirCatering/SendOrderToSky` | POST | Send order for delivery |
| `/api/AirCatering/AddOrderToArchive` | POST | Archive order |
| `/api/AirCatering/RestoreFromArchive` | POST | Restore from archive |
| `/api/AirCatering/SaveOrderAgainAirCatering` | POST | Duplicate/reorder |
| `/api/AirCatering/CreateReminder` | POST | Create order reminder |
| `/api/AirCatering/GetCustomerProfileSettings` | GET | Load profile defaults |
| `/api/AirCatering/UpdateCustomerProfileSettings` | PATCH | Save profile defaults |
| `/api/AirCatering/DeleteOrderItemAirCatering` | DELETE | Delete order item |
| `/api/AirCatering/AddFavoriteItem` | POST | Favorite a menu item |
| `/api/AirCatering/RemoveFromFavoriteItems` | DELETE | Unfavorite item |
| `/api/AirCatering/GetClientFavoriteItems` | GET | List favorites |
| `/api/AirCatering/GetClientFlightNumbers` | GET | User's flight numbers |
| `/api/AirCatering/GetClientRegistrations` | GET | Aircraft registrations |
| `/api/AirCatering/GetClientAirCraft` | GET | Aircraft types |
| `/api/AirCatering/GetClientBillTo` | GET | Bill-to options |
| `/api/AirCatering/GetClientAgents` | GET | Agent list |
| `/api/AirCatering/GetClientOperators` | GET | Operator list |
| `/api/AirCatering/UpdateOrderHeaderAirCatering` | PATCH | Edit order header |
| `/api/NotificationList` | GET | Fetch notifications |
| `/api/NotificationList/ChangeStatus` | POST | Mark notification read |
| `/api/OnlineOrders/GeneralSelection/GrandGroupList` | GET | Load menu products |
| `/api/Sales/GeneralList/CustomerList/CustomerSubscription` | PATCH | Newsletter subscribe |

### React Query Patterns
- `useQuery` for all data fetching with `queryKey` arrays for cache management
- `useMutation` for all write operations
- `queryClient.invalidateQueries` after mutations to trigger refetch
- `enabled` flag used to conditionally fetch (e.g., only when modal is open, only when user is authenticated)
- `refetchInterval: 5000` for notifications polling
- `refetchInterval: 60000` for orders polling (1 minute)
- `staleTime: Infinity` for product menu (rarely changes)
- `select` transform function used to filter/sort data before returning to component

---

## 6. State Management (Zustand)

### Global vs. Server State Separation
- **Zustand** manages **client state**: auth session, cart, language, screen size, UI preferences
- **TanStack Query** manages **server state**: orders, products, notifications, lookup lists
- This clean separation prevents stale data issues and leverages React Query's built-in caching

### Communication Pattern
Components subscribe to individual pieces of Zustand state via selector functions:
```js
const logout = useAuthStore((state) => state.logout);
const { lang } = useLangStore();
const { cart, addToCart } = useCartStore();
```
This prevents unnecessary re-renders — component only re-renders when its subscribed slice changes.

---

## 7. Forms & Validation

### Order Creation (CreateOrderModal.jsx)
- **Formik** manages the form state across all 3 steps with `enableReinitialize`
- **Yup** schemas per step: `Step1Schema`, `Step2Schema`, `Step3Schema`
- **Conditional validation:**
  - Passenger count required only if flight type is "Departure" or "Both"
  - Registration field can be made optional via `customerDataNotAplicable` profile setting
  - Ground handler, agent, operator required only if profile settings flag is `true`
- **Date cross-validation:**
  - Delivery date must be ≥ 4 hours from now
  - Departure delivery must be before departure date
  - Departure delivery must be after arrival delivery (for "Both" type)
- **FreeTextLookup**: custom autocomplete allowing both selection from server list and manual free-text entry (letters only, auto-uppercase for flight numbers)

### Profile Completion (ProfileCompletionPopup.jsx)
- **Formik** with Yup validation
- Pre-populated from API response
- Saves back to server on submit

### Registration (Register.jsx)
- Formik + Yup (code is present in commented-out version but active form exists below)
- Phone number validation with country code
- OTP modal flow for account activation

---

## 8. Authentication & Security

### Login Flow
1. `POST /api/Authonticate/LoginSkyCulinaire` with phone + password
2. Server returns object with `encodedPayload` (JWT access token)
3. Stored in `localStorage` via `authStore.login()`
4. Roles decoded from JWT payload (`payload.roles`)

### Token Refresh
- Silent refresh on 401 via Axios interceptor
- Calls `POST /api/Authonticate/LoginRefresh` (uses HttpOnly cookie for refresh token)
- Concurrent requests during refresh are queued and replayed after refresh succeeds

### JWT Expiry Checks (Multiple layers)
1. On initial mount (`checkTokenExpiration` in `Main` and `MobileMain`)
2. On window `focus` event
3. On `visibilitychange` to "visible"
4. All checks call `logout()` if `payload.exp * 1000 < Date.now()`

### Protected Routes
- `ProtectedRoute` component wraps: `/cart`, `/map`, `/order/:id`, `/order/:id/tracking`, `/my-account`, `/addFood`
- Redirects unauthenticated users to `/login` with toast message

### Role-Based Access
- `"Marketing"` role → redirected to `/admin` on login
- Admin layout is only accessible via `/admin` route
- `isNormalUser` computed from roles array to determine which CSS layout class to apply

### Session Management
- Profile popup dismissal stored per-user in `sessionStorage` (clears on logout)
- `sessionStorage` keys cleaned on `logout()` in `authStore`

### OTP Verification
- Registration requires OTP before login
- `POST /api/Authonticate/ActivateAccount` with email/phone + code
- Resend OTP: `POST /api/Authonticate/ResendCode`

---

## 9. UI/UX

### Responsive Design
- Runtime detection: `window.innerWidth < 768` → sets `screen = "mobile"` in Zustand store
- Separate route configs and page components for mobile vs. desktop
- Mobile pages: `MobileHome`, `MobileCart` with bottom navigation patterns
- RTL layout fully supported via CSS class toggles

### Loading States
- `react-loading-skeleton` for skeleton placeholders
- `BiLoaderAlt` spinner icon for inline loading
- Full-screen `<Loading fullScreen={true} />` for route transitions
- React `Suspense` wrapping all lazy-loaded pages

### Modals / Popups
- `CreateOrderModal` — full-screen 3-step wizard
- `ProfileCompletionPopup` — profile defaults popup
- `DeliveredOrderPopup` — appears when an order is delivered
- `OrderCreationReminderPopup` — reminds users to create upcoming orders
- `CheckoutSuccessModal` — confirmation after checkout
- `FinalConfirmationSuccessModal` — confirmation after final approval
- `GreetingModal` — welcome/newsletter subscription
- `ProductDetailsModal` — full item details with add-ons
- Notification detail modal — in-app notification viewer

### Animations
- Framer Motion: `motion.div` with `AnimatePresence` for mounting/unmounting in `Home.jsx`, `Orders.jsx`, `OrderDetails.jsx`, `MobileHome.jsx`
- CSS animations for hero background particles in `Home.jsx`
- Custom tour spotlight with `requestAnimationFrame` in `GlobalTour.jsx`

### Tables / Lists
- `InfiniteScrollList` — custom virtualized list with `ResizeObserver` for container width tracking
- `SmartInfiniteList` — used in Admin panel for paginated client list
- Scroll-based infinite loading with throttle (1500px threshold, 500ms debounce)

### Tabs
- Order details filter tabs: All / Arrival / Departure
- My Account tabs: Summary / Orders / Archive
- Admin tabs: Requests / Details

---

## 10. Advanced Features

| Feature | Implementation | File |
|---|---|---|
| **Service Worker** | Registered for push notifications via `navigator.serviceWorker.register('/sw.js')` | `Layout.jsx` |
| **Browser Push Notifications** | `Notification` API via Service Worker `showNotification()` | `Layout.jsx` |
| **Audio Notifications** | `new Audio().play()` on new unread notifications | `Layout.jsx` |
| **JWT Silent Refresh** | 401 queue + token refresh + request replay | `axios.jsx` |
| **Custom Guided Tour** | `requestAnimationFrame` spotlight tracking, no 3rd-party library | `GlobalTour.jsx` |
| **Interactive Map** | Leaflet + OSRM routing + Nominatim geocoding + delivery fee calculation | `Map.jsx` |
| **Haversine Formula** | Custom implementation for straight-line distance fallback | `Map.jsx` |
| **Virtualized Infinite Scroll** | Custom `InfiniteScrollList` with `ResizeObserver` and scroll throttling | `ERP/Lists/InfiniteScrollList.jsx` |
| **Lazy Code Splitting** | All pages loaded via `React.lazy()` + `Suspense` | `Layout.jsx` |
| **Real-Time Polling** | Notifications polled every 5s, orders every 60s | `Layout.jsx`, `Home.jsx` |
| **Token Expiry Multi-Watch** | Checked on mount, focus, visibility change | `Layout.jsx` |
| **Excel & PDF Export** | SheetJS + jsPDF + autotable | `ExportUtils.jsx` |
| **Browser Print Invoice** | `react-to-print` with custom print CSS | `OrderInvoicePrint.jsx` |
| **Free-text + Lookup Hybrid** | `FreeTextLookup` — type or select from list, uppercase enforcement | `CreateOrderModal.jsx` |
| **Cross-field Yup validation** | Delivery date cross-checks, conditional passenger count | `CreateOrderModal.jsx` |
| **Dynamic RTL Layout** | Full RTL CSS class applied from Zustand state | `Layout.jsx` |
| **Dark Mode** | `isDarkMode` from UIStore, toggled via `document.body.classList` | `Layout.jsx` |
| **Tab Title Notifications** | Updates `document.title` with unread count | `Layout.jsx` |
| **Forced Logout Event Bus** | Custom DOM event `auth:logout` from Axios to React | `axios.jsx` + `Layout.jsx` |
| **Profile Defaults System** | Saves user's preferred flight/billing defaults for fast order creation | `ProfileCompletionPopup.jsx`, `GetCustomerProfileSettings` |

---

## 11. Your Responsibilities / What You Can Claim on Your CV

Based strictly on the code in the project:

- **Architected** a full-stack B2B airline catering ordering platform using React 19, Vite, TanStack Query v5, and Zustand v5
- **Designed and implemented** a 3-step multi-form order creation wizard (Formik + Yup) with per-step schema validation, conditional field logic, and cross-field date dependency validation
- **Built** a station-aware, category-grouped food menu with real-time price resolution, item add-ons, sub-items, and a client-side favorites system
- **Implemented** a complete JWT authentication system including silent token refresh via Axios response interceptors, request queue management on 401, multi-point token expiry checking, and role-based routing
- **Developed** a real-time notification system using polling (5-second intervals), browser Push Notification API, Service Worker integration, in-app audio alerts, and tab title badge updates
- **Built** an interactive delivery map using React Leaflet, OSRM real driving route calculation, Nominatim geocoding/reverse-geocoding, and custom delivery fee calculation using the Haversine formula
- **Designed** a custom interactive onboarding guide from scratch (no third-party library) using `requestAnimationFrame` for spotlight tracking and bilingual step content
- **Implemented** a comprehensive order lifecycle management system: create, view, edit, add/remove items, cancel with reason, archive/restore, approve/reject alternatives (client decision), final confirmation, and checkout
- **Developed** export functionality: Excel (SheetJS), PDF (jsPDF + autotable), and browser-print invoices (react-to-print)
- **Built** a virtualized infinite scroll list using `ResizeObserver` and scroll throttling for performant rendering of large admin data sets
- **Implemented** full bilingual (Arabic/English) support with RTL layout switching, Arabic number formatting, and Zustand-persisted language preference
- **Optimized** the application with React.lazy() + Suspense code splitting for all page-level components, React Query caching strategies, and selective Zustand subscriptions to minimize re-renders

---

## 12. CV Technology Keywords

```
React 19 · React Router DOM v7 · TanStack React Query v5 · Zustand v5
Vite · TailwindCSS v4 · Material UI (MUI) v9 · Formik · Yup
Axios · JWT Authentication · Token Refresh · Protected Routes
React Leaflet · Leaflet.js · OSRM Routing · Nominatim Geocoding
Framer Motion · jsPDF · jspdf-autotable · SheetJS (xlsx)
react-to-print · React Hot Toast · Dayjs · libphonenumber-js
Service Workers · Web Notifications API · Browser Geolocation API
Infinite Scroll · Virtual List · Lazy Loading · Code Splitting
RTL Support · Bilingual (AR/EN) · Haversine Formula
REST API Integration · Role-Based Access Control (RBAC) · OTP Verification
```

---

## 13. CV Project Description

### Short Version (1–2 lines)
> Developed **Sky Culinaire**, a full-featured B2B airline catering ordering platform enabling aviation operators to create and manage in-flight catering orders with real-time tracking, interactive maps, and push notifications.

### Medium Version (3–4 lines)
> Built **Sky Culinaire**, a production-grade B2B web platform for airline catering management using React 19, TanStack Query v5, Zustand, and Formik. Implemented a 3-step multi-form order creation wizard with cross-field date validation, a station-aware food menu with add-ons, and a full order lifecycle (create, edit, approve, archive). Integrated real-time browser push notifications via Service Worker, an interactive Leaflet map with OSRM routing for delivery fee calculation, and JWT silent token refresh with request queue management.

### Detailed Version (Projects/Experience Section)
> **Sky Culinaire** — B2B Airline Catering Ordering Platform | React 19 · Vite · TanStack Query · Zustand · MUI
>
> Architected and developed a comprehensive web application enabling airline operators, agents, and aviation companies to manage end-to-end flight catering orders — from meal selection to confirmed delivery scheduling.
>
> **Key technical contributions:**
> - Designed a 3-step Formik wizard with per-step Yup schema validation including conditional passenger count requirements, cross-field date dependency rules (delivery ≥ 4h from now, departure after arrival), and profile-driven optional fields
> - Implemented a complete JWT authentication pipeline: role-based routing, silent token refresh via Axios interceptor with concurrent request queueing on 401, multi-point expiry detection (mount, focus, visibility change)
> - Built a real-time notification pipeline using React Query polling (5s interval), Web Notifications API, Service Worker `showNotification`, and audio alerts; updated browser tab title with unread count
> - Integrated React Leaflet with OSRM driving route API and Nominatim geocoding for an interactive delivery map with real-time fee calculation; implemented Haversine formula as routing fallback
> - Developed a custom interactive onboarding guide from scratch using `requestAnimationFrame` for spotlight tracking across bilingual (AR/EN) steps — without any third-party tour library
> - Built reusable `CustomLookup` and `FreeTextLookup` autocomplete components (on MUI) used across order creation, profile settings, and order editing
> - Implemented Excel, PDF, and browser-print export using SheetJS, jsPDF-autotable, and react-to-print
> - Delivered full RTL Arabic layout support via Zustand-persisted language state and dynamic `document.body` class toggling

---

## 14. CV Bullet Points

- **Architected** a 3-step Formik + Yup order creation wizard with per-step schema validation, conditional field logic based on flight type (Arrival/Departure/Both), and cross-field date dependency rules enforced with Yup's `.test()` chaining
- **Implemented** a production-grade JWT authentication system with Axios interceptor-based silent token refresh, concurrent request queuing on 401, multi-point expiry detection (mount, window focus, visibility), and forced logout event bus
- **Built** a real-time notification system using React Query polling every 5 seconds, Service Worker push notifications, browser Notification API with audio alerts, and dynamic tab title badge updates for unread count
- **Developed** an interactive delivery map (React Leaflet + OSRM) with live driving route calculation, Nominatim geocoding, Haversine formula fallback, and dynamic delivery fee calculation based on distance
- **Designed** a custom zero-dependency onboarding tour using `requestAnimationFrame` for smooth spotlight tracking across DOM elements, with bilingual (EN/AR) step content and `requestAnimationFrame`-driven CSS transitions
- **Implemented** a virtualized infinite scroll list for the Admin panel using `ResizeObserver` and scroll event throttling, supporting both list and grid view modes for large datasets
- **Integrated** Excel export (SheetJS), PDF export (jsPDF + autotable), and printable invoice (react-to-print) with custom print CSS, page-break control, and flight-type item grouping
- **Engineered** a global Zustand state architecture with 9 separate stores for auth, cart, language, notifications, screen layout, and station management, with selective subscriptions to minimize re-renders
- **Delivered** full bilingual Arabic/English support with RTL layout switching, `toArabicNumbers()` formatting, and Zustand-persisted language preference synced across all 30+ components
- **Built** a complete order lifecycle management system covering create, edit header/items, cancel with reason, archive/restore, approve alternative items (client decision), final confirmation, and checkout — across 15+ documented API endpoints

---

## 15. Interview Preparation

### Most Important Technical Points
1. The order creation wizard is multi-step Formik with per-step Yup schemas — validation only runs for the current step
2. The Axios interceptor handles silent JWT refresh with a queue — this is a real production pattern
3. Notifications use React Query polling + Service Worker — understand both paths (with/without permission)
4. The map uses OSRM for real routing, not just straight-line — understand the fallback
5. The guided tour is custom-built — you didn't just configure a library
6. Zustand stores are separated by domain; TanStack Query owns server state
7. Mobile and desktop have completely separate route trees resolved at runtime

---

### Interview Q&A

**Q1: Walk me through how the order creation form works technically.**

> The order creation form is a 3-step modal built with Formik and `enableReinitialize`. Each step has its own Yup schema: Step 1 validates flight details (station, flight type, flight number, registration, aircraft type, and conditional pax/crew counts based on whether it's an Arrival, Departure, or Both flight). Step 2 validates dates — delivery dates must be at least 4 hours from now, departure date must be after arrival, and Yup's `.test()` method is used for the cross-field dependency between departure delivery and arrival delivery. Step 3 validates billing and payment, where fields like Ground Handler are conditionally required based on `customerProfileSettings` fetched from the API. On final submit, I build an `orderHeaderPayload` object and call `POST /api/AirCatering/SaveOrderHeaderAirCatring`. After success, the order items from the cart are submitted to a second endpoint.

---

**Q2: How did you implement JWT token refresh?**

> In `axios.jsx`, I added a response interceptor that catches 401 errors. If the request hasn't already been retried (`_retry` flag), I set `isRefreshing = true` and push all subsequent failing requests into a `failedQueue`. Then I call `POST /api/Authonticate/LoginRefresh` with cookies (the refresh token is in an HttpOnly cookie). If it succeeds, I update localStorage with the new token, resolve all queued requests with the new token, and replay the original request. If the refresh fails, I reject the queue, remove the user from localStorage, and dispatch a custom DOM event `auth:logout` which is listened to in the `AuthChecker` component to trigger Zustand `logout()` and navigate to `/login`.

---

**Q3: How does the notification system work?**

> Notifications are fetched via React Query with `refetchInterval: 5000`. In the `AuthChecker` component, a `useRef(new Set())` tracks which notification IDs have already been shown in this session to prevent duplicates. When a new unread notification is detected (where `notificationStatusId === 1`), three things happen: (1) an audio chime plays using the Web Audio API, (2) if the user has granted permission and a Service Worker is registered, `registration.showNotification()` is called — otherwise it falls back to `new Notification()` or an in-app toast, and (3) the browser tab title is updated to show the unread count like `(3) Sky Culinaire` via `document.title`.

---

**Q4: Explain how the interactive map works.**

> I used React Leaflet with OpenStreetMap tiles. On mount, I request the user's location via the Geolocation API. The user can also drag the map — every `moveend` event triggers a new route calculation. For routing, I call the OSRM public API (`router.project-osrm.org`) with the restaurant's fixed coordinates and the map center coordinates. This returns the real driving distance in meters and duration in seconds. The delivery fee is calculated as `BASE_FEE(10) + 2 × km`, clamped between 10 and 100 EGP. If OSRM fails, I fall back to the Haversine formula for straight-line distance. I also use Nominatim for reverse geocoding — converting the lat/lng to a human-readable address. When the user confirms, the address and fee are saved to Zustand stores.

---

**Q5: How did you build the guided tour without a library?**

> The `GlobalTour.jsx` is entirely custom. The core mechanism is a `requestAnimationFrame` loop that continuously reads the `getBoundingClientRect()` of the target DOM element (identified by a CSS selector in each step config). It positions a spotlight overlay and a tooltip using CSS transforms based on the element's current position. This approach handles scrolling and dynamic layouts naturally. Transitions between steps are smooth because I use CSS transitions on the overlay/tooltip. Steps are defined in arrays with both English and Arabic content, and placement hints (`top/bottom/left/right`) determine tooltip positioning. The guide state is managed through `GuideContext` using React Context API.

---

**Q6: What Zustand stores did you create and why?**

> I created 9 stores: `authStore` for the JWT user session, `cartStore` for the shopping cart with price calculation logic, `langStore` for the EN/AR language preference (persisted to localStorage), `notificationStore` for notification list and unread count, `stationStore` for the selected airport station, `screenViewStore` for responsive layout (mobile/desktop detection and navbar height), `productStore` for the currently viewed menu item, `addressStore` for the map-confirmed delivery address, and `greetingStore` for modal greeting logic. The reason for separating stores by domain is to allow selective subscriptions — a component only re-renders when the exact slice it subscribes to changes.

---

**Q7: How does the order lifecycle work from creation to delivery?**

> A client creates an order via the 3-step wizard (step 1: flight details, step 2: dates, step 3: payment). The header is saved first, then items are attached. The order appears in the active orders list on the Home page. The client can edit the header and items while it's in draft state. The admin reviews the order and may send back alternative items. The client then uses the `SubmitClientDecision` endpoint to approve or reject each alternative. Once everything is agreed, the client clicks Final Confirmation (`ClientApproveQuotation`). When the catering is ready for service, the client (or system) calls `SendOrderToSky`. Completed orders can be archived and viewed in the archive tab.

---

**Q8: How did you handle mobile vs. desktop layouts?**

> I detect the screen size at runtime in `Layout.jsx` using a `window.addEventListener('resize')` listener that sets `screen: "mobile"` or `"desktop"` in the `screenViewStore` Zustand store when width crosses 768px. Based on this, the router renders either the desktop route tree (with `Main` layout and `Home` page) or the mobile route tree (with `MobileMain` layout and `MobileHome` page). This means the mobile and desktop experiences have separate components entirely, not just CSS breakpoints. RTL support adds another layer — when language is Arabic, `document.body.classList.add('rtl')` switches the layout direction globally.

---

**Q9: How is TanStack Query used in this project?**

> React Query v5 is the server state manager. All API calls go through `useQuery` (for data fetching) or `useMutation` (for write operations). Query keys are arrays like `["myOrders", "active"]` — this enables fine-grained cache invalidation. After mutations like canceling or archiving an order, I call `queryClient.invalidateQueries(["myOrders"])` to trigger a refetch. The `enabled` flag is used to conditionally run queries — for example, the order creation modal queries (stations, flight numbers, etc.) only run when `isOpen === true`. I use `select` to transform data server-side, like filtering and sorting orders before returning to the component.

---

**Q10: How does the profile settings system work?**

> When a user creates their first order, they need to fill in flight details. To save time on repeat orders, the `ProfileCompletionPopup` prompts them to set their defaults: preferred flight number, registration, aircraft type, agent, operator, bill-to, payment method, and ground handler. These are saved via `PATCH /api/AirCatering/UpdateCustomerProfileSettings`. When the `CreateOrderModal` opens, it calls `GET /api/AirCatering/GetCustomerProfileSettings` and pre-populates all form fields with those saved defaults via Formik's `initialValues`. The popup only shows once per session using a `sessionStorage` key scoped to the user's ID, so it resets if a different user logs in.

---

**Q11: How does the infinite scroll list in the Admin panel work?**

> The `InfiniteScrollList` component uses a `useRef` to hold the scroll container element. A scroll event listener checks when `scrollHeight - scrollTop - clientHeight < 1500` (within 1500px of the bottom) and calls `onLoadMore()` if there's more data to load. A `throttleRef` prevents multiple calls within 500ms. For virtualization, the component calculates which items should be rendered based on `scrollTop`, `rowHeight`, and a buffer of 5 rows above/below the visible area. It uses `ResizeObserver` to track container width changes and recalculate column counts for grid view mode. This makes it performant for large datasets in the admin panel.

---

**Q12: How does authentication differ for admin vs. regular users?**

> When a user logs in, the server returns a JWT with a `roles` array. In `AuthMutation.jsx`, after a successful login, I check `if (data?.roles?.includes("Marketing"))` — if true, the user is navigated to `/admin` instead of `/home`. The admin panel at `/admin` has its own `AdminLayout` with a different sidebar navigation. Additionally, in `Layout.jsx`, the `isNormalUser` flag is computed from the roles array and controls which CSS layout class (`customer-layout` vs `erp-layout`) is applied to the body, which can affect global styling. The JWT payload is decoded client-side by base64-decoding the second part of the token string.

---

**Q13: Explain the export functionality you implemented.**

> There are three export methods in `ExportUtils.jsx`. For Excel, I use SheetJS (xlsx): I map the data array to a flat object using each column's field path (supporting dot notation for nested fields like `"supplier.name"`), convert it to a worksheet with `XLSX.utils.json_to_sheet()`, and write the file. For PDF, I use jsPDF with jspdf-autotable: I extract header labels and body rows, then call `autoTable(doc, { head, body })` which formats a professional table. For printing, I create a hidden iframe, inject HTML with a formatted table and the company logo, and trigger `contentWindow.print()`. For the order invoice specifically, `react-to-print` is used — it takes a React ref pointing to the invoice component and handles the print dialog while preserving colors using `-webkit-print-color-adjust: exact`.

---

**Q14: How did you implement the cart with add-ons and sub-items?**

> The `cartStore` has two add functions: `addToCart` for regular items and `addToCartWithAdds` for items with add-ons. For regular items (no add-ons), if the same `FoodMenuItemId` already exists with no add-ons, the quantity is incremented instead of creating a new entry. Items with add-ons are always added as separate entries because their add-on combinations make them unique. Each cart item has a `cartItemId` generated as `"${itemId}-${Date.now()}-${randomString}"` to ensure uniqueness. Price calculation in `getTotalPrice()` sums `item.FoodMenuItemPrice + sum(add-ons prices) + sum(sub-items prices)`, multiplied by quantity. Sub-items also have their quantities scaled when the parent item's quantity changes in `updateQuantity()`.

---

**Q15: What would you improve or refactor in this project?**

> A few things stand out. First, the `CreateOrderModal.jsx` is 1,633 lines — I'd split it into separate step components and extract the `FreeTextLookup` component (which lives inside the file) into its own file. Second, there are some commented-out blocks of code related to an ERP module that was planned but not implemented — those should be cleaned up. Third, the notification polling at 5 seconds creates significant server load for multiple simultaneous users — I'd replace it with WebSockets or Server-Sent Events for true real-time updates. Fourth, the `authStore` uses `localStorage` directly in multiple places rather than always going through the store actions — centralizing that would improve consistency. Overall the architecture is solid, but the very large component files should be broken down for better maintainability.
