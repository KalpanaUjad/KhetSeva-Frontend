import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { initiateRazorpayPayment } from '../../utils/razorpayHelper'
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { getMyBookings, cancelBooking } from "../../api/bookingApi";
import { getPayments } from "../../api/paymentApi";
import { generateReceipt } from "../../utils/generateReceipt";

import {
  IconClipboardList, IconReceipt,
  IconUser, IconHelp,
  IconPlus, IconCheck,
  IconCalendar, IconMapPin,
  IconDownload
} from '@tabler/icons-react'
import "./UserDashboard.css";

const steps = ["Submitted", "Approved", "In progress", "Completed"];

const getStepIndex = (status) => {
  switch (status) {
    case "PENDING":
      return 1;
    case "CONFIRMED":
      return 2;
    case "ACTIVE":
      return 3;
    case "COMPLETED":
      return 4;
    default:
      return 0;
  }
};

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [paidBookings, setPaidBookings] = useState({});

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await getMyBookings();
      setBookings(res.data);
      await checkPayments(res.data);
    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const checkPayments = async (bookingsList) => {
    const paid = {};
    for (const b of bookingsList) {
      if (b.status === "COMPLETED") {
        try {
          const res = await getPayments(b.id);
          paid[b.id] = res.data.some(
            (p) => p.type === "BALANCE" && p.status === "SUCCESS",
          );
        } catch {
          paid[b.id] = false;
        }
      }
    }
    setPaidBookings(paid);
  };

  const handleCancel = async (id) => {
    const reason = window.prompt("Enter reason for cancellation:");
    if (!reason) return;

    try {
      await cancelBooking(id, { reason });
      toast.success("Booking cancelled");
      loadBookings();
    } catch (err) {
      toast.error("Failed to cancel booking");
    }
  };

  const handlePay = async (booking, type) => {
  initiateRazorpayPayment({
    bookingId: booking.id,
    type,
    farmerName: user?.name,
    farmerMobile: '',
    onSuccess: async (paymentData) => {
      toast.success('Payment successful!')
      await loadBookings()
    },
    onError: (msg) => {
      toast.error(msg)
    },
  })
}

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const filtered =
    tab === "all"
      ? bookings
      : bookings.filter((b) => b.status.toLowerCase() === tab);

  const counts = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    completed: bookings.filter((b) => b.status === "COMPLETED").length,
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="ud-wrap">
      {/* Sidebar */}
      <div className="ud-sidebar">
        <Link to="/" className="ud-sidebar-logo">
          Khet<span>Seva</span>
        </Link>
        <Link to="/dashboard" className="ks-sidebar-item active">
          <IconClipboardList size={17} /> My bookings
        </Link>
        <Link to="/services" className="ks-sidebar-item">
          <IconPlus size={17} /> Book a service
        </Link>
        <Link to="/bills" className="ks-sidebar-item">
          <IconReceipt size={17} /> Bills & receipts
        </Link>
        <Link to="/profile" className="ks-sidebar-item">
          <IconUser size={17} /> My profile
        </Link>
        <Link to="/help" className="ks-sidebar-item">
          <IconHelp size={17} /> Help
        </Link>
        <div className="ud-user-info">
          <div className="ud-user-avatar">{initials}</div>
          <div>
            <div className="ud-user-name">{user?.name}</div>
            <div
              className="ud-user-loc"
              style={{ cursor: "pointer", color: "#A32D2D" }}
              onClick={handleLogout}
            >
              Logout
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ud-main">
        <div className="ud-topbar">
          <h1>My Bookings</h1>
          <Link to="/services">
            <button
              className="btn-ks-primary"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <IconPlus size={15} /> New booking
            </button>
          </Link>
        </div>

        {/* Summary cards */}
        <div className="ud-sum-row">
          {[
            { num: counts.total, label: "Total bookings", color: "#3B6D11" },
            { num: counts.pending, label: "Pending", color: "#854F0B" },
            { num: counts.confirmed, label: "Confirmed", color: "#3B6D11" },
            { num: counts.completed, label: "Completed", color: "#185FA5" },
          ].map((s, i) => (
            <div key={i} className="ud-sum-card">
              <div className="ud-sum-num" style={{ color: s.color }}>
                {s.num}
              </div>
              <div className="ud-sum-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="ud-tabs">
          {["all", "pending", "confirmed", "completed", "cancelled"].map(
            (t) => (
              <button
                key={t}
                className={`ud-tab ${tab === t ? "active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ),
          )}
        </div>

        {/* Booking cards */}
        {loading ? (
          <div className="ud-empty">Loading your bookings...</div>
        ) : filtered.length === 0 ? (
          <div className="ud-empty">
            No bookings in this category.{" "}
            <Link to="/services" style={{ color: "#3B6D11" }}>
              Book a service
            </Link>
          </div>
        ) : (
          <div className="ud-cards">
            {filtered.map((b) => {
              const stepIdx = getStepIndex(b.status);
              return (
                <div key={b.id} className="ud-card">
                  <div className="ud-card-top">
                    <div>
                      <div className="ud-card-num">
                        Booking #{b.bookingNumber}
                      </div>
                      <div className="ud-card-meta">
                        <span>
                          <IconCalendar size={13} /> {b.preferredDate}
                        </span>
                        <span>
                          <IconMapPin size={13} /> {b.farmerVillage}
                        </span>
                      </div>
                    </div>
                    <span className={`badge-${b.status.toLowerCase()}`}>
                      {b.status.charAt(0) + b.status.slice(1).toLowerCase()}
                    </span>
                  </div>

                  {/* Service pills */}
                  <div className="ud-pills">
                    {b.items?.map((item, i) => (
                      <span key={i} className="ud-pill">
                        {item.serviceName}
                      </span>
                    ))}
                  </div>

                  {/* Progress track */}
                  {b.status !== "CANCELLED" && (
                    <div className="ud-track">
                      {steps.map((s, i) => (
                        <>
                          <div key={i} className="ud-track-step">
                            <div
                              className={`ud-track-dot ${i < stepIdx ? "done" : i === stepIdx - 1 ? "active" : ""}`}
                            >
                              {i < stepIdx ? <IconCheck size={10} /> : i + 1}
                            </div>
                            <div className="ud-track-label">{s}</div>
                          </div>
                          {i < steps.length - 1 && (
                            <div
                              className={`ud-track-line ${i < stepIdx - 1 ? "done" : ""}`}
                            />
                          )}
                        </>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="ud-card-footer">
                    <div className="ud-card-total">
                      ₹{b.totalAmount?.toLocaleString("en-IN")} total
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#6c757d",
                          fontWeight: 400,
                          marginLeft: "8px",
                        }}
                      >
                        ₹{b.advanceAmount?.toLocaleString("en-IN")} advance
                      </span>
                    </div>
                    <div className="ud-card-actions">
                      {b.status === "COMPLETED" && (
                        <>
                          {paidBookings[b.id] ? (
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: "500",
                                padding: "4px 12px",
                                borderRadius: "20px",
                                background: "#EAF3DE",
                                color: "#3B6D11",
                              }}
                            >
                              ✓ Payment done
                            </span>
                          ) : (
                            <button
                              className="ud-btn-pay"
                              onClick={() => handlePay(b, "BALANCE")}
                            >
                              Pay ₹{b.balanceAmount?.toLocaleString("en-IN")}
                            </button>
                          )}
                          <button
                            className="ud-btn-receipt"
                            onClick={() => handleDownloadReceipt(b)}
                          >
                            <IconDownload size={13} /> Receipt
                          </button>
                        </>
                      )}
                      {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                        <button
                          className="ud-btn-cancel"
                          onClick={() => handleCancel(b.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
