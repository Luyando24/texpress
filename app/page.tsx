"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type Dispatch,
  type FormEvent,
  type RefObject,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

type NavIconName = "parcel" | "search" | "deliveries" | "account";
type BookingStep = 1 | 2 | 3 | 4 | 5;
type PickupMethod = "branch" | "doorstep";
type DeliveryType = "branch" | "doorstep";
type DeliverySpeed = "same-day" | "next-day";
type DeliveryFilter = "all" | "active" | "completed";

const mobileBookingSteps: [number, string][] = [
  [1, "Pickup"],
  [2, "Details"],
  [3, "Parcel"],
  [4, "Destination"],
  [5, "Service"],
];

const navigation: Array<{ label: string; icon: NavIconName }> = [
  { label: "Book a Delivery", icon: "parcel" },
  { label: "Track Parcel", icon: "search" },
  { label: "My Deliveries", icon: "deliveries" },
  { label: "Account", icon: "account" },
];

const branchLabels: Record<string, string> = {
  "lusaka-downtown": "Lusaka Branch - Downtown",
  "lusaka-cairo-road": "Lusaka Branch - Cairo Road",
  "kitwe-central": "Kitwe Branch - Central",
};

const destinationLabels: Record<string, string> = {
  "kitwe-doorstep": "Kitwe - Doorstep",
  "ndola-branch": "Ndola Branch - Central",
  "chingola-doorstep": "Chingola - Doorstep",
};

function NavIcon({ name }: { name: NavIconName }) {
  return <span aria-hidden="true" className={`nav-icon nav-icon--${name}`} />;
}

type TrackingScreenProps = {
  trackingInputRef: RefObject<HTMLInputElement | null>;
  trackingNumber: string;
  setTrackingNumber: Dispatch<SetStateAction<string>>;
};

function TrackingScreen({
  trackingInputRef,
  trackingNumber,
  setTrackingNumber,
}: TrackingScreenProps) {
  const [displayedTrackingId, setDisplayedTrackingId] = useState("TE45871");

  function handleTrackingSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTrackingId = trackingNumber.trim().replace(/^#/, "").toUpperCase();

    if (nextTrackingId) {
      setDisplayedTrackingId(nextTrackingId);
    }
  }

  return (
    <section aria-label="Track parcel">
      <form
        onSubmit={handleTrackingSubmit}
        className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgb(20_44_63_/_0.11)] sm:p-5"
      >
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.13em] text-[#75818a] uppercase">
              Parcel lookup
            </p>
            <label
              htmlFor="tracking-page-number"
              className="mt-1 block text-lg font-bold text-brand-navy"
            >
              Track a delivery
            </label>
          </div>
          <span className="hidden rounded-full bg-[#edf3f5] px-3 py-1.5 text-xs font-semibold text-[#64737c] sm:inline-flex">
            Live updates
          </span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="tracking-field min-w-0 flex-1">
            <span className="tracking-search-icon" aria-hidden="true" />
            <input
              ref={trackingInputRef}
              id="tracking-page-number"
              type="search"
              value={trackingNumber}
              onChange={(event) => setTrackingNumber(event.target.value)}
              placeholder="e.g. TE45871"
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className="min-h-[46px] rounded-lg bg-brand-cyan px-7 font-semibold text-white transition hover:bg-[#079bd3] active:translate-y-px"
          >
            Track parcel
          </button>
        </div>
      </form>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.75fr)]">
        <article className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_18px_rgb(20_44_63_/_0.1)]">
          <header className="flex items-center justify-between border-b border-[#e7ecef] px-4 py-4 sm:px-5">
            <div>
              <p className="text-xs font-semibold tracking-[0.11em] text-[#75818a] uppercase">
                Tracking ID
              </p>
              <h2 className="mt-1 text-xl font-bold text-brand-navy">
                #{displayedTrackingId}
              </h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e7f5f1] px-3 py-1.5 text-xs font-bold text-[#16745b]">
              <span className="size-2 rounded-full bg-[#22a77d] shadow-[0_0_0_4px_rgb(34_167_125_/_0.12)]" />
              In Transit
            </span>
          </header>

          <div
            className="tracking-map relative min-h-[340px] overflow-hidden sm:min-h-[410px]"
            role="img"
            aria-label="Static route preview from Lusaka to Kitwe, with the parcel near Kabwe"
          >
            <span className="map-road map-road--one" />
            <span className="map-road map-road--two" />
            <span className="map-road map-road--three" />
            <span className="map-road map-road--four" />
            <span className="map-route" />

            <span className="map-pin map-pin--origin" aria-hidden="true" />
            <span className="map-pin map-pin--destination" aria-hidden="true" />
            <span className="map-parcel-marker" aria-hidden="true">
              ⚡
            </span>

            <span className="map-label map-label--origin">
              <strong>Lusaka</strong>
              <small>Collected</small>
            </span>
            <span className="map-label map-label--current">
              <strong>Kabwe</strong>
              <small>Latest position</small>
            </span>
            <span className="map-label map-label--destination">
              <strong>Kitwe</strong>
              <small>Destination</small>
            </span>

            <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-2 text-xs font-semibold text-brand-navy shadow-sm backdrop-blur">
              <span className="size-2 rounded-full bg-[#22a77d]" />
              Live GPS preview
            </span>
          </div>
        </article>

        <aside className="space-y-4">
          <section className="rounded-2xl bg-brand-navy p-5 text-white shadow-[0_4px_18px_rgb(6_31_63_/_0.16)]">
            <p className="text-xs font-semibold tracking-[0.12em] text-[#a9c2d8] uppercase">
              Current status
            </p>
            <h2 className="mt-2 text-2xl font-semibold">In Transit</h2>
            <p className="mt-1 text-sm text-[#c8d6e2]">Kabwe, Zambia</p>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/12 pt-5">
              <div>
                <p className="text-[0.68rem] font-semibold tracking-wider text-[#9db3c6] uppercase">
                  Estimated delivery
                </p>
                <p className="mt-1.5 text-sm font-semibold">Today, 4:30 PM</p>
              </div>
              <div>
                <p className="text-[0.68rem] font-semibold tracking-wider text-[#9db3c6] uppercase">
                  Service
                </p>
                <p className="mt-1.5 text-sm font-semibold">Same-Day</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-[0_3px_14px_rgb(20_44_63_/_0.09)]">
            <h2 className="text-base font-bold text-brand-navy">
              Delivery progress
            </h2>
            <ol className="tracking-timeline mt-5">
              <li className="tracking-timeline__item tracking-timeline__item--done">
                <span className="tracking-timeline__dot">✓</span>
                <div>
                  <strong>Parcel collected</strong>
                  <small>Lusaka · 9:15 AM</small>
                </div>
              </li>
              <li className="tracking-timeline__item tracking-timeline__item--active">
                <span className="tracking-timeline__dot" />
                <div>
                  <strong>In transit to Kitwe</strong>
                  <small>Kabwe · 12:42 PM</small>
                </div>
              </li>
              <li className="tracking-timeline__item">
                <span className="tracking-timeline__dot" />
                <div>
                  <strong>Out for delivery</strong>
                  <small>Next update</small>
                </div>
              </li>
              <li className="tracking-timeline__item">
                <span className="tracking-timeline__dot" />
                <div>
                  <strong>Delivered</strong>
                  <small>Expected today</small>
                </div>
              </li>
            </ol>
          </section>
        </aside>
      </div>

    </section>
  );
}

const deliveries = [
  {
    id: "TE45871",
    status: "In Transit",
    group: "active" as const,
    origin: "Lusaka",
    destination: "Kitwe",
    service: "Same-Day",
    updateLabel: "Latest location",
    updateValue: "Kabwe, Zambia",
    timeLabel: "Estimated delivery",
    timeValue: "Today, 4:30 PM",
    progress: 64,
  },
  {
    id: "TE45812",
    status: "Awaiting Pickup",
    group: "active" as const,
    origin: "Ndola",
    destination: "Chingola",
    service: "Next-Day",
    updateLabel: "Pickup location",
    updateValue: "Ndola Central",
    timeLabel: "Pickup window",
    timeValue: "Today, 2–3 PM",
    progress: 14,
  },
  {
    id: "TE45792",
    status: "Delivered",
    group: "completed" as const,
    origin: "Kitwe",
    destination: "Lusaka",
    service: "Next-Day",
    updateLabel: "Delivered to",
    updateValue: "Cairo Road",
    timeLabel: "Completed",
    timeValue: "Yesterday, 11:18 AM",
    progress: 100,
  },
  {
    id: "TE45688",
    status: "Delivered",
    group: "completed" as const,
    origin: "Lusaka",
    destination: "Ndola",
    service: "Same-Day",
    updateLabel: "Delivered to",
    updateValue: "Ndola Central",
    timeLabel: "Completed",
    timeValue: "18 Jul, 3:42 PM",
    progress: 100,
  },
];

function MyDeliveriesScreen({ onTrack }: { onTrack: () => void }) {
  const [filter, setFilter] = useState<DeliveryFilter>("all");
  const filteredDeliveries = deliveries.filter(
    (delivery) => filter === "all" || delivery.group === filter,
  );

  return (
    <section aria-labelledby="deliveries-title">
      <div className="rounded-2xl bg-white p-4 shadow-[0_6px_20px_rgb(20_44_63_/_0.09)] sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-5">
        <div>
          <h1
            id="deliveries-title"
            className="text-2xl font-bold tracking-[-0.025em] text-brand-navy"
          >
            My Deliveries
          </h1>
          <p className="mt-1 text-sm text-[#6f7b83]">
            2 active deliveries · 4 total
          </p>
        </div>

        <div
          className="mt-4 grid grid-cols-3 rounded-lg bg-[#edf2f4] p-1 sm:mt-0 sm:min-w-72"
          aria-label="Filter deliveries"
        >
          {(["all", "active", "completed"] as DeliveryFilter[]).map(
            (filterOption) => (
              <button
                key={filterOption}
                type="button"
                onClick={() => setFilter(filterOption)}
                aria-pressed={filter === filterOption}
                className={`rounded-md px-3 py-2 text-xs font-semibold capitalize transition ${
                  filter === filterOption
                    ? "bg-brand-navy text-white shadow-sm"
                    : "text-[#64727b] hover:text-brand-navy"
                }`}
              >
                {filterOption}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {filteredDeliveries.map((delivery) => {
          const isDelivered = delivery.group === "completed";
          const isInTransit = delivery.status === "In Transit";

          return (
            <article
              key={delivery.id}
              className="relative overflow-hidden rounded-2xl bg-white shadow-[0_3px_14px_rgb(20_44_63_/_0.09)]"
            >
              <div className="p-5">
                <header className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.68rem] font-semibold tracking-[0.12em] text-[#7a878e] uppercase">
                      Tracking ID
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-brand-navy">
                      #{delivery.id}
                    </h2>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1.5 text-[0.68rem] font-bold ${
                      isDelivered
                        ? "bg-[#e6f5f0] text-[#16745b]"
                        : isInTransit
                          ? "bg-[#fff8d8] text-[#776700]"
                          : "bg-[#e7f4f9] text-[#247391]"
                    }`}
                  >
                    {delivery.status}
                  </span>
                </header>

                <div className="delivery-route mt-5">
                  <span className="delivery-route__point" />
                  <span className="delivery-route__line" />
                  <span className="delivery-route__point delivery-route__point--destination" />
                  <div className="delivery-route__places">
                    <p>
                      <small>From</small>
                      <strong>{delivery.origin}</strong>
                    </p>
                    <p>
                      <small>To</small>
                      <strong>{delivery.destination}</strong>
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-[0.68rem] font-semibold">
                    <span className="text-[#77838a]">{delivery.service}</span>
                    <span className="text-brand-navy">
                      {delivery.progress}% complete
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#e7ecef]">
                    <div
                      className={`h-full rounded-full ${
                        isDelivered ? "bg-[#2aa67d]" : "bg-brand-cyan"
                      }`}
                      style={{ width: `${delivery.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#e8edef] pt-4">
                  <div>
                    <p className="text-[0.62rem] font-semibold tracking-wider text-[#8a949a] uppercase">
                      {delivery.updateLabel}
                    </p>
                    <p className="mt-1.5 text-xs font-semibold text-[#344149]">
                      {delivery.updateValue}
                    </p>
                  </div>
                  <div>
                    <p className="text-[0.62rem] font-semibold tracking-wider text-[#8a949a] uppercase">
                      {delivery.timeLabel}
                    </p>
                    <p className="mt-1.5 text-xs font-semibold text-[#344149]">
                      {delivery.timeValue}
                    </p>
                  </div>
                </div>

                {!isDelivered && (
                  <button
                    type="button"
                    onClick={onTrack}
                    className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-[#78aeb5] bg-[#edf7f8] px-4 text-sm font-semibold text-brand-navy transition hover:border-brand-cyan hover:bg-[#e3f3f7]"
                  >
                    Track delivery
                    <span aria-hidden="true">→</span>
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

type AccountView = "overview" | "personal" | "addresses" | "payments";

type AccountDetailHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  onBack: () => void;
};

function AccountDetailHeader({
  eyebrow,
  title,
  description,
  onBack,
}: AccountDetailHeaderProps) {
  return (
    <div className="account-detail-header">
      <button type="button" className="account-detail-back" onClick={onBack}>
        <span aria-hidden="true" />
        Back to account
      </button>
      <div>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{description}</span>
      </div>
    </div>
  );
}

function AccountScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [accountMessage, setAccountMessage] = useState("");
  const [accountView, setAccountView] = useState<AccountView>("overview");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "Chanda Mwila",
    phone: "+260 97 000 4587",
    email: "chanda.mwila@example.com",
  });

  function showAccountMessage(message: string) {
    setAccountMessage(message);
  }

  function returnToAccount() {
    setAccountView("overview");
    setAccountMessage("");
  }

  if (accountView === "personal") {
    return (
      <section aria-label="Personal information">
        <AccountDetailHeader
          eyebrow="Your details"
          title="Personal information"
          description="Keep your contact details accurate for pickup and delivery updates."
          onBack={returnToAccount}
        />

        <div className="account-detail-layout">
          <aside className="account-profile-summary">
            <span className="account-profile-summary__avatar" aria-hidden="true">
              CM
            </span>
            <h2>{profile.fullName}</h2>
            <p>Thunder Express customer</p>
            <span className="account-verified-badge">
              <span aria-hidden="true">OK</span>
              Phone verified
            </span>
            <dl>
              <div>
                <dt>Account type</dt>
                <dd>Personal</dd>
              </div>
              <div>
                <dt>Member since</dt>
                <dd>July 2026</dd>
              </div>
            </dl>
          </aside>

          <form
            className="account-detail-panel"
            onSubmit={(event) => {
              event.preventDefault();
              showAccountMessage("Personal information saved.");
            }}
          >
            <div className="account-panel-heading">
              <div>
                <p>Profile</p>
                <h2>Contact details</h2>
              </div>
              <span>Required for delivery updates</span>
            </div>

            <div className="account-form-grid">
              <label className="account-field">
                <span>Full name</span>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(event) =>
                    setProfile((current) => ({
                      ...current,
                      fullName: event.target.value,
                    }))
                  }
                  autoComplete="name"
                  required
                />
              </label>

              <label className="account-field">
                <span>Mobile number</span>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(event) =>
                    setProfile((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  autoComplete="tel"
                  required
                />
              </label>

              <label className="account-field account-field--wide">
                <span>Email address</span>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(event) =>
                    setProfile((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  autoComplete="email"
                  required
                />
              </label>
            </div>

            <div className="account-form-actions">
              <button type="submit" className="booking-primary-action">
                Save changes
              </button>
            </div>
          </form>
        </div>

        <p className="account-screen-message" role="status" aria-live="polite">
          {accountMessage}
        </p>
      </section>
    );
  }

  if (accountView === "addresses") {
    return (
      <section aria-label="Saved addresses">
        <AccountDetailHeader
          eyebrow="Pickup locations"
          title="Saved addresses"
          description="Save frequently used locations to make future bookings quicker."
          onBack={returnToAccount}
        />

        <div className="account-detail-panel account-detail-panel--wide">
          <div className="account-panel-heading account-panel-heading--action">
            <div>
              <p>Address book</p>
              <h2>Your saved places</h2>
            </div>
            <button
              type="button"
              className="account-outline-action"
              onClick={() => {
                setShowAddressForm((visible) => !visible);
                setAccountMessage("");
              }}
            >
              {showAddressForm ? "Cancel" : "Add address"}
            </button>
          </div>

          <div className="account-address-grid">
            <article className="account-address-card">
              <div className="account-address-card__top">
                <span className="account-address-mark" aria-hidden="true">
                  H
                </span>
                <span className="account-default-badge">Default</span>
              </div>
              <h3>Home</h3>
              <p>12 Mosi-oa-Tunya Road, Woodlands, Lusaka</p>
              <div>
                <button
                  type="button"
                  onClick={() => showAccountMessage("Home address selected for editing.")}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => showAccountMessage("Home remains your default address.")}
                >
                  Default
                </button>
              </div>
            </article>

            <article className="account-address-card">
              <div className="account-address-card__top">
                <span className="account-address-mark" aria-hidden="true">
                  W
                </span>
              </div>
              <h3>Work</h3>
              <p>Plot 4587, Cairo Road, Lusaka Central</p>
              <div>
                <button
                  type="button"
                  onClick={() => showAccountMessage("Work address selected for editing.")}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => showAccountMessage("Work set as the default address.")}
                >
                  Set as default
                </button>
              </div>
            </article>
          </div>

          {showAddressForm && (
            <form
              className="account-inline-form"
              onSubmit={(event) => {
                event.preventDefault();
                setShowAddressForm(false);
                showAccountMessage("New address saved.");
              }}
            >
              <h3>Add a new address</h3>
              <div className="account-form-grid">
                <label className="account-field">
                  <span>Address label</span>
                  <input type="text" placeholder="e.g. Parents' home" required />
                </label>
                <label className="account-field">
                  <span>City</span>
                  <select defaultValue="" required>
                    <option value="" disabled>
                      Select city
                    </option>
                    <option>Lusaka</option>
                    <option>Kitwe</option>
                    <option>Ndola</option>
                    <option>Chingola</option>
                  </select>
                </label>
                <label className="account-field account-field--wide">
                  <span>Street address</span>
                  <input
                    type="text"
                    placeholder="House, street and neighbourhood"
                    autoComplete="street-address"
                    required
                  />
                </label>
              </div>
              <div className="account-form-actions">
                <button type="submit" className="booking-primary-action">
                  Save address
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="account-screen-message" role="status" aria-live="polite">
          {accountMessage}
        </p>
      </section>
    );
  }

  if (accountView === "payments") {
    return (
      <section aria-label="Payment methods">
        <AccountDetailHeader
          eyebrow="Payments"
          title="Payment methods"
          description="Manage the cards and mobile money accounts used for deliveries."
          onBack={returnToAccount}
        />

        <div className="account-detail-panel account-detail-panel--wide">
          <div className="account-panel-heading account-panel-heading--action">
            <div>
              <p>Wallet</p>
              <h2>Your payment methods</h2>
            </div>
            <button
              type="button"
              className="account-outline-action"
              onClick={() => {
                setShowPaymentForm((visible) => !visible);
                setAccountMessage("");
              }}
            >
              {showPaymentForm ? "Cancel" : "Add payment method"}
            </button>
          </div>

          <div className="account-payment-grid">
            <article className="account-payment-card">
              <div className="account-payment-card__top">
                <span className="account-payment-mark" aria-hidden="true">
                  AM
                </span>
                <span className="account-default-badge">Default</span>
              </div>
              <p>Mobile money</p>
              <h3>Airtel Money</h3>
              <strong>+260 97 000 4587</strong>
              <button
                type="button"
                onClick={() => showAccountMessage("Airtel Money selected for editing.")}
              >
                Manage
              </button>
            </article>

            <article className="account-payment-card">
              <div className="account-payment-card__top">
                <span className="account-payment-mark" aria-hidden="true">
                  V
                </span>
              </div>
              <p>Bank card</p>
              <h3>Visa ending 2048</h3>
              <strong>Expires 08/29</strong>
              <button
                type="button"
                onClick={() => showAccountMessage("Visa card selected for editing.")}
              >
                Manage
              </button>
            </article>
          </div>

          {showPaymentForm && (
            <form
              className="account-inline-form"
              onSubmit={(event) => {
                event.preventDefault();
                setShowPaymentForm(false);
                showAccountMessage("Payment method added.");
              }}
            >
              <h3>Add a payment method</h3>
              <div className="account-form-grid">
                <label className="account-field">
                  <span>Payment type</span>
                  <select defaultValue="mobile-money">
                    <option value="mobile-money">Mobile money</option>
                    <option value="bank-card">Bank card</option>
                  </select>
                </label>
                <label className="account-field">
                  <span>Provider</span>
                  <select defaultValue="">
                    <option value="" disabled>
                      Select provider
                    </option>
                    <option>Airtel Money</option>
                    <option>MTN Mobile Money</option>
                    <option>Zamtel Kwacha</option>
                    <option>Visa or Mastercard</option>
                  </select>
                </label>
                <label className="account-field account-field--wide">
                  <span>Mobile or card number</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter account number"
                    required
                  />
                </label>
              </div>
              <div className="account-form-actions">
                <button type="submit" className="booking-primary-action">
                  Add payment method
                </button>
              </div>
            </form>
          )}

          <div className="account-security-note">
            <span aria-hidden="true">S</span>
            <p>
              <strong>Payment details stay protected</strong>
              Your full card and mobile money credentials are never displayed.
            </p>
          </div>
        </div>

        <p className="account-screen-message" role="status" aria-live="polite">
          {accountMessage}
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="account-title">
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgb(20_44_63_/_0.11)]">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-center gap-4">
            <span
              className="grid size-14 shrink-0 place-items-center rounded-full bg-brand-navy text-lg font-bold text-white shadow-[0_4px_12px_rgb(6_31_63_/_0.2)]"
              aria-hidden="true"
            >
              CM
            </span>
            <div className="min-w-0">
              <p className="text-[0.65rem] font-bold tracking-[0.13em] text-[#75818a] uppercase">
                Personal account
              </p>
              <h1
                id="account-title"
                className="mt-1 truncate text-xl font-bold tracking-[-0.025em] text-brand-navy"
              >
                Chanda Mwila
              </h1>
              <p className="mt-1 text-sm text-[#6f7b83]">
                +260 97 000 4587
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAccountView("personal")}
            className="min-h-11 rounded-lg border border-[#78aeb5] bg-[#edf7f8] px-5 text-sm font-semibold text-brand-navy transition hover:border-brand-cyan hover:bg-[#e3f3f7]"
          >
            Edit profile
          </button>
        </div>

        <dl className="grid grid-cols-3 border-t border-[#e7ecef] bg-[#f8fafb]">
          <div className="px-3 py-4 text-center">
            <dt className="text-[0.62rem] font-semibold tracking-wider text-[#7d8990] uppercase">
              Deliveries
            </dt>
            <dd className="mt-1 text-lg font-bold text-brand-navy">4</dd>
          </div>
          <div className="border-x border-[#e7ecef] px-3 py-4 text-center">
            <dt className="text-[0.62rem] font-semibold tracking-wider text-[#7d8990] uppercase">
              In transit
            </dt>
            <dd className="mt-1 text-lg font-bold text-brand-navy">1</dd>
          </div>
          <div className="px-3 py-4 text-center">
            <dt className="text-[0.62rem] font-semibold tracking-wider text-[#7d8990] uppercase">
              Saved places
            </dt>
            <dd className="mt-1 text-lg font-bold text-brand-navy">2</dd>
          </div>
        </dl>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-5 shadow-[0_3px_14px_rgb(20_44_63_/_0.09)]">
          <div className="mb-2">
            <p className="text-[0.65rem] font-bold tracking-[0.13em] text-[#75818a] uppercase">
              Your details
            </p>
            <h2 className="mt-1 text-lg font-bold text-brand-navy">
              Account
            </h2>
          </div>

          <div className="account-list">
            <button
              type="button"
              className="account-list__item"
              onClick={() => setAccountView("personal")}
            >
              <span className="account-list__icon" aria-hidden="true">
                ID
              </span>
              <span>
                <strong>Personal information</strong>
                <small>Name, phone number and email</small>
              </span>
              <span className="account-list__chevron" aria-hidden="true" />
            </button>

            <button
              type="button"
              className="account-list__item"
              onClick={() => setAccountView("addresses")}
            >
              <span className="account-list__icon" aria-hidden="true">
                A
              </span>
              <span>
                <strong>Saved addresses</strong>
                <small>Home and work pickup locations</small>
              </span>
              <span className="account-list__chevron" aria-hidden="true" />
            </button>

            <button
              type="button"
              className="account-list__item"
              onClick={() => setAccountView("payments")}
            >
              <span className="account-list__icon" aria-hidden="true">
                ZK
              </span>
              <span>
                <strong>Payment methods</strong>
                <small>Cards and mobile money</small>
              </span>
              <span className="account-list__chevron" aria-hidden="true" />
            </button>
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl bg-white p-5 shadow-[0_3px_14px_rgb(20_44_63_/_0.09)]">
            <div className="mb-2">
              <p className="text-[0.65rem] font-bold tracking-[0.13em] text-[#75818a] uppercase">
                App settings
              </p>
              <h2 className="mt-1 text-lg font-bold text-brand-navy">
                Preferences
              </h2>
            </div>

            <div className="account-list">
              <div className="account-list__item">
                <span className="account-list__icon" aria-hidden="true">
                  N
                </span>
                <span>
                  <strong>Delivery notifications</strong>
                  <small>Booking and tracking updates</small>
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notificationsEnabled}
                  aria-label="Delivery notifications"
                  className={`account-toggle ${
                    notificationsEnabled ? "account-toggle--on" : ""
                  }`}
                  onClick={() =>
                    setNotificationsEnabled((enabled) => !enabled)
                  }
                >
                  <span />
                </button>
              </div>

              <div className="account-list__item">
                <span className="account-list__icon" aria-hidden="true">
                  EN
                </span>
                <span>
                  <strong>Language</strong>
                  <small>English</small>
                </span>
                <span className="rounded-full bg-[#edf3f5] px-3 py-1.5 text-xs font-semibold text-[#64737c]">
                  English
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-[0_3px_14px_rgb(20_44_63_/_0.09)]">
            <h2 className="text-lg font-bold text-brand-navy">
              Support &amp; security
            </h2>
            <div className="account-list mt-2">
              <button
                type="button"
                className="account-list__item"
                onClick={() =>
                  showAccountMessage("Support options are ready to open.")
                }
              >
                <span className="account-list__icon" aria-hidden="true">
                  ?
                </span>
                <span>
                  <strong>Help and support</strong>
                  <small>Get help with a delivery</small>
                </span>
                <span className="account-list__chevron" aria-hidden="true" />
              </button>

              <button
                type="button"
                className="account-list__item"
                onClick={() =>
                  showAccountMessage("Privacy and security details are ready.")
                }
              >
                <span className="account-list__icon" aria-hidden="true">
                  S
                </span>
                <span>
                  <strong>Privacy and security</strong>
                  <small>Control your account data</small>
                </span>
                <span className="account-list__chevron" aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => showAccountMessage("Sign out requested.")}
              className="mt-4 min-h-11 w-full rounded-lg border border-[#c8d2d7] bg-white px-5 text-sm font-semibold text-brand-navy transition hover:bg-[#f3f6f7]"
            >
              Sign out
            </button>
          </section>
        </div>
      </div>

      <p className="mt-4 min-h-5 text-center text-xs font-medium text-[#526b79]" role="status" aria-live="polite">
        {accountMessage}
      </p>
    </section>
  );
}

type DesktopLandingProps = {
  onBook: () => void;
  onNavigate: (label: string) => void;
};

function DesktopLanding({ onBook, onNavigate }: DesktopLandingProps) {
  const quickActions = [
    {
      number: "01",
      title: "Start a booking",
      detail: "Arrange a pickup or branch drop-off",
      action: onBook,
    },
    {
      number: "02",
      title: "Track a parcel",
      detail: "See the latest delivery update",
      action: () => onNavigate("Track Parcel"),
    },
    {
      number: "03",
      title: "My deliveries",
      detail: "Review active and past parcels",
      action: () => onNavigate("My Deliveries"),
    },
    {
      number: "04",
      title: "Manage account",
      detail: "Update addresses and preferences",
      action: () => onNavigate("Account"),
    },
  ];

  return (
    <div className="hidden lg:block">
      <section className="desktop-hero" aria-labelledby="desktop-hero-title">
        <div className="desktop-hero__surface">
          <div className="desktop-hero__copy">
            <p className="desktop-eyebrow">Delivery across Zambia</p>
            <h1 id="desktop-hero-title">
              Delivery that keeps
              <span>Zambia moving.</span>
            </h1>
            <p className="desktop-hero__summary">
              From your door to theirs, Thunder Express gives every parcel a
              clearer and more dependable journey.
            </p>
            <div className="desktop-hero__buttons">
              <button type="button" onClick={onBook}>
                Book a delivery
              </button>
              <button
                type="button"
                className="desktop-hero__secondary"
                onClick={() => onNavigate("Track Parcel")}
              >
                Track a parcel
              </button>
            </div>
          </div>

        </div>

        <div className="desktop-action-dock" aria-label="Delivery shortcuts">
          {quickActions.map((item) => (
            <button key={item.title} type="button" onClick={item.action}>
              <span className="desktop-action-dock__number">{item.number}</span>
              <span>
                <strong>{item.title}</strong>
                <small>{item.detail}</small>
              </span>
              <span className="desktop-action-dock__arrow" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      <section
        className="desktop-services"
        aria-labelledby="desktop-services-title"
      >
        <div className="desktop-section-heading">
          <div>
            <p className="desktop-eyebrow">Everyday delivery</p>
            <h2 id="desktop-services-title">A simpler way to send</h2>
          </div>
          <p>
            Choose how your parcel starts its journey, where it should arrive,
            and the speed that works for you.
          </p>
        </div>

        <div className="desktop-service-grid">
          <article>
            <span className="desktop-service-icon" aria-hidden="true">
              P
            </span>
            <p>01 / Pickup</p>
            <h3>Doorstep pickup</h3>
            <span>
              Enter your home or business address and let us collect from you.
            </span>
          </article>
          <article>
            <span className="desktop-service-icon" aria-hidden="true">
              B
            </span>
            <p>02 / Drop-off</p>
            <h3>Branch drop-off</h3>
            <span>
              Bring your parcel to a convenient Thunder Express branch.
            </span>
          </article>
          <article>
            <span className="desktop-service-icon" aria-hidden="true">
              S
            </span>
            <p>03 / Speed</p>
            <h3>Same-day or next-day</h3>
            <span>
              Select the service that fits your delivery window and budget.
            </span>
          </article>
        </div>
      </section>
    </div>
  );
}

function DesktopFooter({
  onBook,
  onNavigate,
}: {
  onBook: () => void;
  onNavigate: (label: string) => void;
}) {
  return (
    <footer className="desktop-footer hidden lg:block">
      <div className="desktop-footer__main">
        <div className="desktop-footer__brand">
          <button
            type="button"
            className="brand-lockup"
            onClick={onBook}
            aria-label="Return to booking"
          >
            <span>Thunder</span>
            <span className="brand-bolt" aria-hidden="true" />
            <span>Express</span>
          </button>
          <p>
            Straightforward parcel delivery for people and businesses across
            Zambia.
          </p>
        </div>

        <div className="desktop-footer__links">
          <div>
            <h2>Delivery</h2>
            <button type="button" onClick={onBook}>
              Book a delivery
            </button>
            <button
              type="button"
              onClick={() => onNavigate("Track Parcel")}
            >
              Track a parcel
            </button>
            <button
              type="button"
              onClick={() => onNavigate("My Deliveries")}
            >
              My deliveries
            </button>
          </div>

          <div>
            <h2>Account</h2>
            <button type="button" onClick={() => onNavigate("Account")}>
              Personal information
            </button>
            <button type="button" onClick={() => onNavigate("Account")}>
              Saved addresses
            </button>
            <button type="button" onClick={() => onNavigate("Account")}>
              Payment methods
            </button>
          </div>

          <div>
            <h2>Service</h2>
            <span>Doorstep pickup</span>
            <span>Branch drop-off</span>
            <span>Same-day delivery</span>
          </div>
        </div>
      </div>

      <div className="desktop-footer__bottom flex items-center justify-between">
        <span>Thunder Express Zambia</span>
        <div className="flex items-center gap-4">
          <span>Fast, flexible and trackable delivery.</span>
          <Link href="/admin" className="text-[#20b6e7] font-semibold hover:underline">
            Admin Portal ↗
          </Link>
        </div>
      </div>

    </footer>
  );
}

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Book a Delivery");
  const [bookingStep, setBookingStep] = useState<BookingStep>(1);

  // Step 1 — Pickup
  const [pickupMethod, setPickupMethod] = useState<PickupMethod>("doorstep");
  const [pickupAddress, setPickupAddress] = useState("");
  const [sendFrom, setSendFrom] = useState("lusaka-downtown");

  // Step 2 — Sender details
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");

  // Step 3 — Parcel info
  const [parcelItem, setParcelItem] = useState("");
  const [parcelDescription, setParcelDescription] = useState("");
  const [parcelValue, setParcelValue] = useState("");
  const [parcelPhotoUrl, setParcelPhotoUrl] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Step 4 — Destination + Receiver
  const [sendTo, setSendTo] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("doorstep");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");

  // Step 5 — Service
  const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeed>("same-day");

  const [trackingNumber, setTrackingNumber] = useState("");
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const trackingInputRef = useRef<HTMLInputElement>(null);

  const mobileContinueDisabled =
    (bookingStep === 1 && pickupMethod === "doorstep" && !pickupAddress.trim()) ||
    (bookingStep === 2 && (!senderName.trim() || !senderPhone.trim())) ||
    (bookingStep === 3 && (!parcelItem.trim() || !parcelDescription.trim() || !parcelValue.trim())) ||
    (bookingStep === 4 && (!sendTo || !receiverName.trim() || !receiverPhone.trim()));

  useEffect(() => {
    if (activeTab === "Track Parcel") {
      trackingInputRef.current?.focus();
    }
  }, [activeTab]);

  function handleNavigation(label: string) {
    setActiveTab(label);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConfirmationVisible(true);
  }

  function openBookingPage() {
    router.push("/book");
  }

  function handleParcelPhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setParcelPhotoUrl(URL.createObjectURL(file));
  }

  return (
    <main className="min-h-svh bg-[#f1f4f6]">
      <header className="bg-brand-navy pb-7 text-white shadow-[0_4px_18px_rgb(6_31_63_/_0.14)] lg:pb-0">
        <div className="mx-auto flex h-[92px] max-w-7xl items-center justify-center px-5 pt-[env(safe-area-inset-top)] lg:h-[88px] lg:justify-between lg:px-8">
          <a
            href="#booking"
            onClick={() => setActiveTab("Book a Delivery")}
            className="brand-lockup"
            aria-label="Thunder Express home"
          >
            <span>Thunder</span>
            <span className="brand-bolt" aria-hidden="true" />
            <span>Express</span>
          </a>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/admin"
              className="rounded-lg border border-[#1b3d66] bg-[#0c2445] px-3.5 py-2 text-xs font-bold text-[#20b6e7] transition hover:bg-[#12335e] hover:text-white"
            >
              Admin Portal ↗
            </Link>

            <button
              type="button"
              onClick={() => handleNavigation("Account")}
              className={`desktop-account-link ${
                activeTab === "Account" ? "desktop-account-link--active" : ""
              }`}
              aria-current={activeTab === "Account" ? "page" : undefined}
            >
              <NavIcon name="account" />
              <span>Account</span>
            </button>
          </div>

        </div>
      </header>

      <div className="relative z-10 mx-auto -mt-7 max-w-7xl px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] sm:px-6 lg:mt-0 lg:px-8 lg:pt-8 lg:pb-12">
        {activeTab === "Track Parcel" ? (
          <TrackingScreen
            trackingInputRef={trackingInputRef}
            trackingNumber={trackingNumber}
            setTrackingNumber={setTrackingNumber}
          />
        ) : activeTab === "My Deliveries" ? (
          <MyDeliveriesScreen onTrack={() => setActiveTab("Track Parcel")} />
        ) : activeTab === "Account" ? (
          <AccountScreen />
        ) : (
          <div>
            <DesktopLanding
              onBook={openBookingPage}
              onNavigate={handleNavigation}
            />

          <form
            id="booking"
            onSubmit={handleSubmit}
            className="mx-auto max-w-2xl scroll-mt-28 lg:hidden"
          >
            <section
              className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgb(20_44_63_/_0.11)] sm:p-6 lg:p-8"
              aria-label="Book a delivery"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.65rem] font-bold tracking-[0.13em] text-[#75818a] uppercase">
                    New booking
                  </p>
                  <h1 className="mt-1 text-xl font-bold tracking-[-0.025em] text-brand-navy">
                    Book a delivery
                  </h1>
                </div>
                <span className="shrink-0 rounded-full bg-[#edf3f5] px-3 py-1.5 text-xs font-semibold text-[#64737c]">
                  Step {bookingStep} of 5
                </span>
              </div>


              <ol
                className="booking-stepper-5 mt-5"
                aria-label="Booking progress"
              >
                {mobileBookingSteps.map(([step, label]) => {
                  const stepNumber = step as BookingStep;
                  const isActiveStep = bookingStep === stepNumber;
                  const isCompletedStep = bookingStep > stepNumber;

                  return (
                    <li
                      key={label}
                      className={`booking-step ${
                        isActiveStep ? "booking-step--active" : ""
                      } ${isCompletedStep ? "booking-step--completed" : ""}`}
                      aria-current={isActiveStep ? "step" : undefined}
                    >
                      <span className="booking-step__number">
                        {isCompletedStep ? "✓" : step}
                      </span>
                      <span className="booking-step__label">{label}</span>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-7 min-h-[260px]">
                {/* Step 1 — Pickup */}
                {bookingStep === 1 && (
                <fieldset>
                  <legend
                    className="mb-3 text-[0.98rem] font-semibold text-[#22262b]"
                  >
                    Pickup option
                  </legend>
                  <div className="booking-pickup-layout">
                    <div className="pickup-options">
                    <label
                      className={`pickup-option ${
                        pickupMethod === "doorstep"
                          ? "pickup-option--selected"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="pickup-method"
                        value="doorstep"
                        checked={pickupMethod === "doorstep"}
                        onChange={() => setPickupMethod("doorstep")}
                        className="sr-only"
                      />
                      <span className="pickup-option__mark" aria-hidden="true">P</span>
                      <span>
                        <strong>Doorstep pickup</strong>
                        <small>We collect from you</small>
                      </span>
                    </label>

                    <label
                      className={`pickup-option ${
                        pickupMethod === "branch"
                          ? "pickup-option--selected"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="pickup-method"
                        value="branch"
                        checked={pickupMethod === "branch"}
                        onChange={() => setPickupMethod("branch")}
                        className="sr-only"
                      />
                      <span className="pickup-option__mark" aria-hidden="true">B</span>
                      <span>
                        <strong>Branch drop-off</strong>
                        <small>Bring the parcel to us</small>
                      </span>
                    </label>
                    </div>

                {pickupMethod === "branch" ? (
                  <div className="form-field mt-4">
                    <label htmlFor="send-from">Pickup branch</label>
                    <div className="select-wrap">
                      <select
                        id="send-from"
                        value={sendFrom}
                        onChange={(event) => setSendFrom(event.target.value)}
                      >
                        <option value="lusaka-downtown">Lusaka Branch - Downtown</option>
                        <option value="lusaka-cairo-road">Lusaka Branch - Cairo Road</option>
                        <option value="kitwe-central">Kitwe Branch - Central</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="form-field mt-4">
                    <label htmlFor="pickup-address">Pickup address</label>
                    <div className="pickup-address-controls">
                      <input
                        id="pickup-address"
                        type="text"
                        value={pickupAddress}
                        onChange={(event) => setPickupAddress(event.target.value)}
                        placeholder="Home or business address"
                        autoComplete="street-address"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setPickupAddress("Current location selected")}
                      >
                        Use current location
                      </button>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-[#748088]">
                      Enter an address or use your device location for pickup.
                    </p>
                  </div>
                )}
                  </div>
                </fieldset>
                )}

                {/* Step 2 — Sender details */}
                {bookingStep === 2 && (
                  <fieldset>
                    <legend className="mb-1 text-xl font-semibold tracking-[-0.02em] text-brand-navy">
                      Your contact details
                    </legend>
                    <p className="mb-5 text-sm text-[#6f7b83]">
                      We need your name and phone to reach you about the
                      collection. No account required.
                    </p>
                    <div className="grid gap-5">
                      <div className="booking-input-group">
                        <label htmlFor="m-sender-name">
                          <span className="booking-input-label">Full name</span>
                        </label>
                        <input
                          id="m-sender-name"
                          type="text"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          placeholder="e.g. Chanda Mwila"
                          autoComplete="name"
                          required
                          className="booking-text-input"
                        />
                      </div>
                      <div className="booking-input-group">
                        <label htmlFor="m-sender-phone">
                          <span className="booking-input-label">Phone number</span>
                        </label>
                        <input
                          id="m-sender-phone"
                          type="tel"
                          value={senderPhone}
                          onChange={(e) => setSenderPhone(e.target.value)}
                          placeholder="e.g. +260 97 000 4587"
                          autoComplete="tel"
                          required
                          className="booking-text-input"
                        />
                        <p className="booking-input-hint">
                          We&apos;ll send tracking updates to this number.
                        </p>
                      </div>
                    </div>
                  </fieldset>
                )}

                {/* Step 3 — Parcel info */}
                {bookingStep === 3 && (
                  <fieldset>
                    <legend className="mb-1 text-xl font-semibold tracking-[-0.02em] text-brand-navy">
                      About the parcel
                    </legend>
                    <p className="mb-5 text-sm text-[#6f7b83]">
                      Tell us what you&apos;re sending so we can handle it safely.
                    </p>
                    <div className="grid gap-5">
                      <div className="booking-input-group">
                        <label htmlFor="m-parcel-item">
                          <span className="booking-input-label">What is it?</span>
                        </label>
                        <input
                          id="m-parcel-item"
                          type="text"
                          value={parcelItem}
                          onChange={(e) => setParcelItem(e.target.value)}
                          placeholder="e.g. Laptop, Clothing, Documents"
                          required
                          className="booking-text-input"
                        />
                      </div>
                      <div className="booking-input-group">
                        <label htmlFor="m-parcel-value">
                          <span className="booking-input-label">Declared value (ZMW)</span>
                        </label>
                        <div className="booking-value-wrap">
                          <span className="booking-value-prefix" aria-hidden="true">K</span>
                          <input
                            id="m-parcel-value"
                            type="number"
                            min="0"
                            step="0.01"
                            value={parcelValue}
                            onChange={(e) => setParcelValue(e.target.value)}
                            placeholder="0.00"
                            required
                            className="booking-text-input booking-text-input--prefixed"
                          />
                        </div>
                        <p className="booking-input-hint">Used for insurance purposes only.</p>
                      </div>
                      <div className="booking-input-group">
                        <label htmlFor="m-parcel-description">
                          <span className="booking-input-label">Description</span>
                        </label>
                        <textarea
                          id="m-parcel-description"
                          value={parcelDescription}
                          onChange={(e) => setParcelDescription(e.target.value)}
                          placeholder="Brief description, quantity, and any special handling notes…"
                          rows={3}
                          required
                          className="booking-textarea"
                        />
                      </div>
                      <div className="booking-input-group">
                        <span className="booking-input-label">Parcel photo</span>
                        <p className="booking-input-hint" style={{ marginBottom: "10px" }}>
                          Take a clear photo before we collect it.
                        </p>
                        {parcelPhotoUrl ? (
                          <div className="parcel-photo-preview">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={parcelPhotoUrl} alt="Parcel photo preview" />
                            <button
                              type="button"
                              className="parcel-photo-retake"
                              onClick={() => {
                                setParcelPhotoUrl(null);
                                if (photoInputRef.current) photoInputRef.current.value = "";
                              }}
                            >
                              Retake photo
                            </button>
                          </div>
                        ) : (
                          <label className="parcel-photo-upload" htmlFor="m-parcel-photo">
                            <span className="parcel-photo-upload__icon" aria-hidden="true" />
                            <strong>Take a photo or upload from your device</strong>
                            <small>Tap to open camera or choose a file</small>
                            <input
                              ref={photoInputRef}
                              id="m-parcel-photo"
                              type="file"
                              accept="image/*"
                              capture="environment"
                              onChange={handleParcelPhoto}
                              className="sr-only"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </fieldset>
                )}

                {/* Step 4 — Destination */}
                {bookingStep === 4 && (
                  <fieldset>
                    <legend className="mb-1 text-xl font-semibold tracking-[-0.02em] text-brand-navy">
                      Where is it going?
                    </legend>
                    <p className="mb-5 text-sm text-[#6f7b83]">
                      Choose the destination, how the recipient will receive the
                      parcel, and their contact details.
                    </p>

                    <div className="grid gap-5">
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="booking-input-group">
                          <label htmlFor="m-receiver-name">
                            <span className="booking-input-label">Receiver&apos;s full name</span>
                          </label>
                          <input
                            id="m-receiver-name"
                            type="text"
                            value={receiverName}
                            onChange={(e) => setReceiverName(e.target.value)}
                            placeholder="e.g. Mutale Banda"
                            autoComplete="off"
                            required
                            className="booking-text-input"
                          />
                        </div>

                        <div className="booking-input-group">
                          <label htmlFor="m-receiver-phone">
                            <span className="booking-input-label">Receiver&apos;s phone number</span>
                          </label>
                          <input
                            id="m-receiver-phone"
                            type="tel"
                            value={receiverPhone}
                            onChange={(e) => setReceiverPhone(e.target.value)}
                            placeholder="e.g. +260 97 000 1234"
                            autoComplete="off"
                            required
                            className="booking-text-input"
                          />
                          <p className="booking-input-hint">
                            We&apos;ll notify them when their parcel is on the way.
                          </p>
                        </div>
                      </div>

                      <div className="form-field">
                        <label htmlFor="send-to">Destination</label>
                        <div className="select-wrap">
                          <select
                            id="send-to"
                            value={sendTo}
                            onChange={(event) => setSendTo(event.target.value)}
                            required
                          >
                            <option value="" disabled>Select destination</option>
                            <option value="kitwe-doorstep">Kitwe - Doorstep</option>
                            <option value="ndola-branch">Ndola Branch - Central</option>
                            <option value="chingola-doorstep">Chingola - Doorstep</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <p className="mb-3 text-[0.98rem] font-semibold text-[#22262b]">
                          Delivery method
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <label className={`pickup-option ${deliveryType === "branch" ? "pickup-option--selected" : ""}`}>
                            <input
                              type="radio"
                              name="delivery-type"
                              value="branch"
                              checked={deliveryType === "branch"}
                              onChange={() => setDeliveryType("branch")}
                              className="sr-only"
                            />
                            <span className="pickup-option__mark" aria-hidden="true">B</span>
                            <span>
                              <strong>Branch collection</strong>
                              <small>Recipient collects it</small>
                            </span>
                          </label>

                          <label className={`pickup-option ${deliveryType === "doorstep" ? "pickup-option--selected" : ""}`}>
                            <input
                              type="radio"
                              name="delivery-type"
                              value="doorstep"
                              checked={deliveryType === "doorstep"}
                              onChange={() => setDeliveryType("doorstep")}
                              className="sr-only"
                            />
                            <span className="pickup-option__mark" aria-hidden="true">D</span>
                            <span>
                              <strong>Doorstep delivery</strong>
                              <small>We deliver to them</small>
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                )}

                {/* Step 5 — Service & Review */}
                {bookingStep === 5 && (
                  <fieldset>
                    <legend className="mb-1 text-xl font-semibold tracking-[-0.02em] text-brand-navy">
                      Choose a service
                    </legend>
                    <p className="mb-5 text-sm text-[#6f7b83]">
                      Select a delivery speed, then review your choices.
                    </p>

                    <div>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`speed-card ${deliverySpeed === "same-day" ? "speed-card--selected" : ""}`}>
                        <span>
                          <strong>Same-Day Delivery</strong>
                          <small>Est. 125 min</small>
                        </span>
                        <input
                          type="radio"
                          name="delivery-speed"
                          value="same-day"
                          checked={deliverySpeed === "same-day"}
                          onChange={() => setDeliverySpeed("same-day")}
                          className="radio-input"
                        />
                      </label>

                      <label className={`speed-card ${deliverySpeed === "next-day" ? "speed-card--selected" : ""}`}>
                        <span>
                          <strong>Next-Day Delivery</strong>
                          <small>Est. 150 min</small>
                        </span>
                        <input
                          type="radio"
                          name="delivery-speed"
                          value="next-day"
                          checked={deliverySpeed === "next-day"}
                          onChange={() => setDeliverySpeed("next-day")}
                          className="radio-input"
                        />
                      </label>
                    </div>

                    <dl className="booking-review mt-6">
                      <div>
                        <dt>Sender</dt>
                        <dd>{senderName} · {senderPhone}</dd>
                      </div>
                      <div>
                        <dt>Receiver</dt>
                        <dd>{receiverName} · {receiverPhone}</dd>
                      </div>
                      <div>
                        <dt>Pickup</dt>
                        <dd>
                          {pickupMethod === "branch"
                            ? branchLabels[sendFrom]
                            : pickupAddress}
                        </dd>
                      </div>
                      <div>
                        <dt>Parcel</dt>
                        <dd>
                          {parcelItem}
                          {parcelValue ? ` · K${Number(parcelValue).toLocaleString()}` : ""}
                        </dd>
                      </div>
                      <div>
                        <dt>Destination</dt>
                        <dd>{destinationLabels[sendTo]}</dd>
                      </div>
                      <div>
                        <dt>Handoff</dt>
                        <dd>
                          {deliveryType === "branch"
                            ? "Branch collection"
                            : "Doorstep delivery"}
                        </dd>
                      </div>
                      <div>
                        <dt>Service</dt>
                        <dd>{deliverySpeed === "same-day" ? "Same-Day" : "Next-Day"}</dd>
                      </div>
                      {parcelPhotoUrl && (
                        <div className="booking-review__photo">
                          <dt>Parcel photo</dt>
                          <dd>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={parcelPhotoUrl} alt="Parcel" className="booking-review__photo-thumb" />
                          </dd>
                        </div>
                      )}
                    </dl>
                    </div>
                  </fieldset>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#e8edef] pt-5">
                {bookingStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setBookingStep((bookingStep - 1) as BookingStep)}
                    className="min-h-11 rounded-lg border border-[#c8d2d7] bg-white px-5 text-sm font-semibold text-brand-navy transition hover:bg-[#f3f6f7]"
                  >
                    Back
                  </button>
                ) : (
                  <span />
                )}

                {bookingStep < 5 && (
                  <button
                    type="button"
                    onClick={() => setBookingStep((bookingStep + 1) as BookingStep)}
                    disabled={mobileContinueDisabled}
                    className="booking-primary-action"
                  >
                    Continue
                  </button>
                )}

                {bookingStep === 5 && (
                  <button type="submit" className="booking-primary-action">
                    Confirm booking
                  </button>
                )}
              </div>

              <p
                className={`confirmation-message ${
                  confirmationVisible ? "confirmation-message--visible" : ""
                }`}
                role="status"
                aria-live="polite"
              >
                Booking confirmed! Tracking updates will be sent to {senderPhone || "your phone"}.
              </p>
            </section>
          </form>

            <DesktopFooter
              onBook={openBookingPage}
              onNavigate={handleNavigation}
            />
          </div>
        )}
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e0e6e9] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgb(35_55_68_/_0.08)] lg:hidden"
        aria-label="Main navigation"
      >
        <div className="mx-auto grid h-[70px] max-w-3xl grid-cols-4">
          {navigation.map((item) => {
            const isActive = item.label === activeTab;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavigation(item.label)}
                className={`nav-tab ${isActive ? "nav-tab--active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <NavIcon name={item.icon} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}
