"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

type BookingStep = 1 | 2 | 3;
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

export default function BookingPage() {
  const [bookingStep, setBookingStep] = useState<BookingStep>(1);
  const [pickupMethod, setPickupMethod] =
    useState<PickupMethod>("doorstep");
  const [pickupAddress, setPickupAddress] = useState("");
  const [sendFrom, setSendFrom] = useState("lusaka-downtown");
  const [sendTo, setSendTo] = useState("");
  const [deliveryType, setDeliveryType] =
    useState<DeliveryType>("doorstep");
  const [deliverySpeed, setDeliverySpeed] =
    useState<DeliverySpeed>("same-day");
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConfirmationVisible(true);
  }

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
        <aside className="standalone-booking-intro">
          <Link href="/" className="standalone-booking-back">
            <span aria-hidden="true" />
            Homepage
          </Link>
          <p className="desktop-eyebrow">New delivery</p>
          <h1>Book your parcel in three clear steps.</h1>
          <p>
            Choose a pickup, tell us where it is going, then select your
            delivery speed.
          </p>

          <ol>
            <li className={bookingStep === 1 ? "is-active" : ""}>
              <span>1</span>
              <div>
                <strong>Pickup</strong>
                <small>Doorstep or branch</small>
              </div>
            </li>
            <li className={bookingStep === 2 ? "is-active" : ""}>
              <span>2</span>
              <div>
                <strong>Destination</strong>
                <small>Recipient and handoff</small>
              </div>
            </li>
            <li className={bookingStep === 3 ? "is-active" : ""}>
              <span>3</span>
              <div>
                <strong>Service</strong>
                <small>Speed and review</small>
              </div>
            </li>
          </ol>
        </aside>

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
                  {bookingStep === 1
                    ? "Arrange the pickup"
                    : bookingStep === 2
                      ? "Choose the destination"
                      : "Select a service"}
                </h2>
              </div>
              <span className="shrink-0 rounded-full bg-[#edf3f5] px-3 py-1.5 text-xs font-semibold text-[#64737c]">
                Step {bookingStep} of 3
              </span>
            </div>

            <ol
              className="booking-stepper lg:mx-auto lg:max-w-2xl"
              aria-label="Booking progress"
            >
              {[
                [1, "Pickup"],
                [2, "Destination"],
                [3, "Service"],
              ].map(([step, label]) => {
                const stepNumber = step as BookingStep;
                const isActive = bookingStep === stepNumber;
                const isComplete = bookingStep > stepNumber;

                return (
                  <li
                    key={label}
                    className={`booking-step ${
                      isActive ? "booking-step--active" : ""
                    } ${isComplete ? "booking-step--completed" : ""}`}
                    aria-current={isActive ? "step" : undefined}
                  >
                    <span className="booking-step__number">
                      {isComplete ? "OK" : step}
                    </span>
                    <span className="booking-step__label">{label}</span>
                  </li>
                );
              })}
            </ol>

            <div className="mt-7 min-h-[290px] lg:mt-8">
              {bookingStep === 1 && (
                <fieldset>
                  <legend className="mb-3 text-[0.98rem] font-semibold text-[#22262b]">
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
                        <span
                          className="pickup-option__mark"
                          aria-hidden="true"
                        >
                          P
                        </span>
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
                        <span
                          className="pickup-option__mark"
                          aria-hidden="true"
                        >
                          B
                        </span>
                        <span>
                          <strong>Branch drop-off</strong>
                          <small>Bring the parcel to us</small>
                        </span>
                      </label>
                    </div>

                    {pickupMethod === "branch" ? (
                      <div className="form-field mt-4 lg:mt-0">
                        <label htmlFor="booking-pickup-branch">
                          Pickup branch
                        </label>
                        <div className="select-wrap">
                          <select
                            id="booking-pickup-branch"
                            value={sendFrom}
                            onChange={(event) =>
                              setSendFrom(event.target.value)
                            }
                          >
                            <option value="lusaka-downtown">
                              Lusaka Branch - Downtown
                            </option>
                            <option value="lusaka-cairo-road">
                              Lusaka Branch - Cairo Road
                            </option>
                            <option value="kitwe-central">
                              Kitwe Branch - Central
                            </option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="form-field mt-4 lg:mt-0">
                        <label htmlFor="booking-pickup-address">
                          Pickup address
                        </label>
                        <div className="pickup-address-controls">
                          <input
                            id="booking-pickup-address"
                            type="text"
                            value={pickupAddress}
                            onChange={(event) =>
                              setPickupAddress(event.target.value)
                            }
                            placeholder="Home or business address"
                            autoComplete="street-address"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setPickupAddress("Current location selected")
                            }
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

              {bookingStep === 2 && (
                <fieldset>
                  <legend className="mb-1 text-xl font-semibold tracking-[-0.02em] text-brand-navy">
                    Where is it going?
                  </legend>
                  <p className="mb-5 text-sm text-[#6f7b83]">
                    Choose the destination and how the recipient will receive
                    the parcel.
                  </p>

                  <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                    <div className="form-field">
                      <label htmlFor="booking-destination">Destination</label>
                      <div className="select-wrap">
                        <select
                          id="booking-destination"
                          value={sendTo}
                          onChange={(event) => setSendTo(event.target.value)}
                          required
                        >
                          <option value="" disabled>
                            Select destination
                          </option>
                          <option value="kitwe-doorstep">
                            Kitwe - Doorstep
                          </option>
                          <option value="ndola-branch">
                            Ndola Branch - Central
                          </option>
                          <option value="chingola-doorstep">
                            Chingola - Doorstep
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-5 lg:mt-0">
                      <p className="mb-3 text-[0.98rem] font-semibold text-[#22262b]">
                        Delivery method
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <label
                          className={`pickup-option ${
                            deliveryType === "branch"
                              ? "pickup-option--selected"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="delivery-type"
                            value="branch"
                            checked={deliveryType === "branch"}
                            onChange={() => setDeliveryType("branch")}
                            className="sr-only"
                          />
                          <span
                            className="pickup-option__mark"
                            aria-hidden="true"
                          >
                            B
                          </span>
                          <span>
                            <strong>Branch collection</strong>
                            <small>Recipient collects it</small>
                          </span>
                        </label>

                        <label
                          className={`pickup-option ${
                            deliveryType === "doorstep"
                              ? "pickup-option--selected"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="delivery-type"
                            value="doorstep"
                            checked={deliveryType === "doorstep"}
                            onChange={() => setDeliveryType("doorstep")}
                            className="sr-only"
                          />
                          <span
                            className="pickup-option__mark"
                            aria-hidden="true"
                          >
                            D
                          </span>
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

              {bookingStep === 3 && (
                <fieldset>
                  <legend className="mb-1 text-xl font-semibold tracking-[-0.02em] text-brand-navy">
                    Choose a service
                  </legend>
                  <p className="mb-5 text-sm text-[#6f7b83]">
                    Select a delivery speed, then review your choices.
                  </p>

                  <div className="lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
                    <div className="grid grid-cols-2 gap-3">
                      <label
                        className={`speed-card ${
                          deliverySpeed === "same-day"
                            ? "speed-card--selected"
                            : ""
                        }`}
                      >
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

                      <label
                        className={`speed-card ${
                          deliverySpeed === "next-day"
                            ? "speed-card--selected"
                            : ""
                        }`}
                      >
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
                        <dt>Pickup</dt>
                        <dd>
                          {pickupMethod === "branch"
                            ? branchLabels[sendFrom]
                            : pickupAddress}
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
                          {deliverySpeed === "same-day"
                            ? "Same-Day"
                            : "Next-Day"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </fieldset>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#e8edef] pt-5">
              {bookingStep > 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setBookingStep(bookingStep === 3 ? 2 : 1)
                  }
                  className="min-h-11 rounded-lg border border-[#c8d2d7] bg-white px-5 text-sm font-semibold text-brand-navy transition hover:bg-[#f3f6f7]"
                >
                  Back
                </button>
              ) : (
                <span />
              )}

              {bookingStep === 1 && (
                <button
                  type="button"
                  onClick={() => setBookingStep(2)}
                  disabled={
                    pickupMethod === "doorstep" && !pickupAddress.trim()
                  }
                  className="booking-primary-action"
                >
                  Continue
                </button>
              )}

              {bookingStep === 2 && (
                <button
                  type="button"
                  onClick={() => setBookingStep(3)}
                  disabled={!sendTo}
                  className="booking-primary-action"
                >
                  Continue
                </button>
              )}

              {bookingStep === 3 && (
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
              Booking details are ready to review.
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
