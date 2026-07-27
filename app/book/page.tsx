"use client";

import Link from "next/link";
import { type FormEvent, useRef, useState } from "react";

type BookingStep = 1 | 2 | 3 | 4 | 5;
type PickupMethod = "branch" | "doorstep";
type DeliveryType = "branch" | "doorstep";
type DeliverySpeed = "same-day" | "next-day";

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

const bookingSteps: [number, string, string][] = [
  [1, "Pickup", "Doorstep or branch"],
  [2, "Your Details", "Name & phone"],
  [3, "Parcel Info", "Item & photo"],
  [4, "Destination", "Where it's going"],
  [5, "Service", "Speed & review"],
];

export default function BookingPage() {
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

  const [confirmationVisible, setConfirmationVisible] = useState(false);

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setParcelPhotoUrl(url);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConfirmationVisible(true);
  }

  function goBack() {
    if (bookingStep > 1) {
      setBookingStep((bookingStep - 1) as BookingStep);
    }
  }

  function goNext() {
    if (bookingStep < 5) {
      setBookingStep((bookingStep + 1) as BookingStep);
    }
  }

  // Per-step "continue" disabled logic
  const continueDisabled =
    (bookingStep === 1 && pickupMethod === "doorstep" && !pickupAddress.trim()) ||
    (bookingStep === 2 && (!senderName.trim() || !senderPhone.trim())) ||
    (bookingStep === 3 && (!parcelItem.trim() || !parcelDescription.trim() || !parcelValue.trim())) ||
    (bookingStep === 4 && (!sendTo || !receiverName.trim() || !receiverPhone.trim()));

  const stepTitle = [
    "Arrange the pickup",
    "Your contact details",
    "Tell us about the parcel",
    "Choose the destination",
    "Select a service",
  ][bookingStep - 1];

  return (
    <main className="min-h-svh bg-[#f1f4f6]">
      <header className="bg-brand-navy text-white shadow-[0_4px_18px_rgb(6_31_63_/_0.14)]">
        <div className="mx-auto flex h-[88px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="brand-lockup"
            aria-label="Thunder Express home"
          >
            <span>Thunder</span>
            <span className="brand-bolt" aria-hidden="true" />
            <span>Express</span>
          </Link>
          <Link href="/" className="standalone-booking-home-link">
            Back to homepage
          </Link>
        </div>
      </header>

      <div className="standalone-booking-layout">
        {/* Sidebar */}
        <aside className="standalone-booking-intro">
          <Link href="/" className="standalone-booking-back">
            <span aria-hidden="true" />
            Homepage
          </Link>


          <p className="desktop-eyebrow" style={{ marginTop: "22px" }}>New delivery</p>
          <h1>Book your parcel in five clear steps.</h1>
          <p>
            Give us your pickup details, contact info, parcel description, and
            preferred delivery service.
          </p>

          <ol>
            {bookingSteps.map(([step, label, sublabel]) => (
              <li
                key={step}
                className={
                  bookingStep === step
                    ? "is-active"
                    : bookingStep > step
                      ? "is-done"
                      : ""
                }
              >
                <span>{bookingStep > step ? "✓" : step}</span>
                <div>
                  <strong>{label}</strong>
                  <small>{sublabel}</small>
                </div>
              </li>
            ))}
          </ol>
        </aside>

        {/* Main form */}
        <form
          id="booking"
          onSubmit={handleSubmit}
          className="standalone-booking-form"
        >
          <section
            className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgb(20_44_63_/_0.11)] sm:p-6 lg:p-8"
            aria-label="Book a delivery"
          >
            <div className="mb-5 flex items-start justify-between gap-4 lg:items-center">
              <div>
                <p className="text-[0.65rem] font-bold tracking-[0.13em] text-[#75818a] uppercase">
                  Booking details
                </p>
                <h2 className="mt-1 text-xl font-bold tracking-[-0.025em] text-brand-navy">
                  {stepTitle}
                </h2>
              </div>
              <span className="shrink-0 rounded-full bg-[#edf3f5] px-3 py-1.5 text-xs font-semibold text-[#64737c]">
                Step {bookingStep} of 5
              </span>
            </div>

            {/* Progress stepper */}
            <ol className="booking-stepper-5" aria-label="Booking progress">
              {bookingSteps.map(([step, label]) => {
                const isActive = bookingStep === step;
                const isComplete = bookingStep > step;
                return (
                  <li
                    key={step}
                    className={`booking-step ${isActive ? "booking-step--active" : ""} ${isComplete ? "booking-step--completed" : ""}`}
                    aria-current={isActive ? "step" : undefined}
                  >
                    <span className="booking-step__number">
                      {isComplete ? "✓" : step}
                    </span>
                    <span className="booking-step__label">{label}</span>
                  </li>
                );
              })}
            </ol>

            <div className="mt-7 min-h-[290px] lg:mt-8">

              {/* ── Step 1: Pickup ── */}
              {bookingStep === 1 && (
                <fieldset>
                  <legend className="mb-3 text-[0.98rem] font-semibold text-[#22262b]">
                    Pickup option
                  </legend>

                  <div className="booking-pickup-layout">
                    <div className="pickup-options">
                      <label
                        className={`pickup-option ${pickupMethod === "doorstep" ? "pickup-option--selected" : ""}`}
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
                        className={`pickup-option ${pickupMethod === "branch" ? "pickup-option--selected" : ""}`}
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
                      <div className="form-field mt-4 lg:mt-0">
                        <label htmlFor="booking-pickup-branch">Pickup branch</label>
                        <div className="select-wrap">
                          <select
                            id="booking-pickup-branch"
                            value={sendFrom}
                            onChange={(e) => setSendFrom(e.target.value)}
                          >
                            <option value="lusaka-downtown">Lusaka Branch - Downtown</option>
                            <option value="lusaka-cairo-road">Lusaka Branch - Cairo Road</option>
                            <option value="kitwe-central">Kitwe Branch - Central</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="form-field mt-4 lg:mt-0">
                        <label htmlFor="booking-pickup-address">Pickup address</label>
                        <div className="pickup-address-controls">
                          <input
                            id="booking-pickup-address"
                            type="text"
                            value={pickupAddress}
                            onChange={(e) => setPickupAddress(e.target.value)}
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
                          Enter an address or use your device location.
                        </p>
                      </div>
                    )}
                  </div>
                </fieldset>
              )}

              {/* ── Step 2: Sender details ── */}
              {bookingStep === 2 && (
                <fieldset>
                  <legend className="mb-1 text-xl font-semibold tracking-[-0.02em] text-brand-navy">
                    Your contact details
                  </legend>
                  <p className="mb-6 text-sm text-[#6f7b83]">
                    We need your name and phone number so we can reach you about
                    the collection. No account required.
                  </p>

                  <div className="grid gap-5">
                    <div className="booking-input-group">
                      <label htmlFor="sender-name">
                        <span className="booking-input-label">Full name</span>
                      </label>
                      <input
                        id="sender-name"
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
                      <label htmlFor="sender-phone">
                        <span className="booking-input-label">Phone number</span>
                      </label>
                      <input
                        id="sender-phone"
                        type="tel"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        placeholder="e.g. +260 97 000 4587"
                        autoComplete="tel"
                        required
                        className="booking-text-input"
                      />
                      <p className="booking-input-hint">
                        We'll use this to confirm pickup and send tracking updates.
                      </p>
                    </div>
                  </div>
                </fieldset>
              )}

              {/* ── Step 3: Parcel info ── */}
              {bookingStep === 3 && (
                <fieldset>
                  <legend className="mb-1 text-xl font-semibold tracking-[-0.02em] text-brand-navy">
                    About the parcel
                  </legend>
                  <p className="mb-6 text-sm text-[#6f7b83]">
                    Tell us what you're sending so we can handle it safely.
                  </p>

                  <div className="grid gap-5">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-5">
                      <div className="booking-input-group">
                        <label htmlFor="parcel-item">
                          <span className="booking-input-label">What is it?</span>
                        </label>
                        <input
                          id="parcel-item"
                          type="text"
                          value={parcelItem}
                          onChange={(e) => setParcelItem(e.target.value)}
                          placeholder="e.g. Laptop, Clothing, Documents"
                          required
                          className="booking-text-input"
                        />
                      </div>

                      <div className="booking-input-group mt-5 lg:mt-0">
                        <label htmlFor="parcel-value">
                          <span className="booking-input-label">Declared value (ZMW)</span>
                        </label>
                        <div className="booking-value-wrap">
                          <span className="booking-value-prefix" aria-hidden="true">K</span>
                          <input
                            id="parcel-value"
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
                        <p className="booking-input-hint">
                          Used for insurance purposes only.
                        </p>
                      </div>
                    </div>

                    <div className="booking-input-group">
                      <label htmlFor="parcel-description">
                        <span className="booking-input-label">Description</span>
                      </label>
                      <textarea
                        id="parcel-description"
                        value={parcelDescription}
                        onChange={(e) => setParcelDescription(e.target.value)}
                        placeholder="Brief description of the parcel contents, quantity, and any special handling notes…"
                        rows={3}
                        required
                        className="booking-textarea"
                      />
                    </div>

                    {/* Photo upload */}
                    <div className="booking-input-group">
                      <span className="booking-input-label">Parcel photo</span>
                      <p className="booking-input-hint" style={{ marginBottom: "10px" }}>
                        Take a clear photo of your parcel before we collect it.
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
                        <label className="parcel-photo-upload" htmlFor="parcel-photo">
                          <span className="parcel-photo-upload__icon" aria-hidden="true" />
                          <strong>Take a photo or upload from your device</strong>
                          <small>Tap to open camera or choose a file</small>
                          <input
                            ref={photoInputRef}
                            id="parcel-photo"
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handlePhotoChange}
                            className="sr-only"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </fieldset>
              )}

              {/* ── Step 4: Destination ── */}
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
                    <div className="lg:grid lg:grid-cols-2 lg:gap-5">
                      <div className="booking-input-group">
                        <label htmlFor="receiver-name">
                          <span className="booking-input-label">Receiver&apos;s full name</span>
                        </label>
                        <input
                          id="receiver-name"
                          type="text"
                          value={receiverName}
                          onChange={(e) => setReceiverName(e.target.value)}
                          placeholder="e.g. Mutale Banda"
                          autoComplete="off"
                          required
                          className="booking-text-input"
                        />
                      </div>

                      <div className="booking-input-group mt-5 lg:mt-0">
                        <label htmlFor="receiver-phone">
                          <span className="booking-input-label">Receiver&apos;s phone number</span>
                        </label>
                        <input
                          id="receiver-phone"
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
                      <label htmlFor="booking-destination">Destination</label>
                      <div className="select-wrap">
                        <select
                          id="booking-destination"
                          value={sendTo}
                          onChange={(e) => setSendTo(e.target.value)}
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

              {/* ── Step 5: Service & Review ── */}
              {bookingStep === 5 && (
                <fieldset>
                  <legend className="mb-1 text-xl font-semibold tracking-[-0.02em] text-brand-navy">
                    Choose a service
                  </legend>
                  <p className="mb-5 text-sm text-[#6f7b83]">
                    Select a delivery speed, then review your full booking.
                  </p>

                  <div className="lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
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

                    <dl className="booking-review mt-6 lg:mt-0">
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
                        <dd>
                          {deliverySpeed === "same-day" ? "Same-Day" : "Next-Day"}
                        </dd>
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

            {/* Navigation buttons */}
            <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#e8edef] pt-5">
              {bookingStep > 1 ? (
                <button
                  type="button"
                  onClick={goBack}
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
                  onClick={goNext}
                  disabled={continueDisabled}
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
              className={`confirmation-message ${confirmationVisible ? "confirmation-message--visible" : ""}`}
              role="status"
              aria-live="polite"
            >
              Booking confirmed! Your tracking details will be sent to {senderPhone || "your phone"}.
            </p>
          </section>
        </form>
      </div>

      <footer className="standalone-booking-footer">
        <span>Thunder Express Zambia</span>
        <Link href="/">Return to homepage</Link>
      </footer>
    </main>
  );
}
