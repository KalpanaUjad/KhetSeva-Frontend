// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { OwnerSidebar } from "./OwnerDashboard";
// import { getAllBookings } from "../../api/bookingApi";
// import { IconDownload } from "@tabler/icons-react";
// import "./OwnerHistory.css";

// const OwnerHistory = () => {
//   const [bookings, setBookings] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadHistory();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [search, statusFilter, bookings]);

//   const loadHistory = async () => {
//     try {
//       setLoading(true);
//       const res = await getAllBookings();
//       const done = res.data.filter(
//         (b) => b.status === "COMPLETED" || b.status === "CANCELLED",
//       );
//       setBookings(done);
//       setFiltered(done);
//     } catch (err) {
//       toast.error("Failed to load history");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let result = [...bookings];
//     if (search) {
//       result = result.filter((b) =>
//         b.farmerName.toLowerCase().includes(search.toLowerCase()),
//       );
//     }
//     if (statusFilter) {
//       result = result.filter((b) => b.status === statusFilter);
//     }
//     setFiltered(result);
//   };

//   const totalEarnings = bookings
//     .filter((b) => b.status === "COMPLETED")
//     .reduce((s, b) => s + (b.totalAmount || 0), 0);

//   const totalAcres = bookings
//     .filter((b) => b.status === "COMPLETED")
//     .reduce((s, b) => s + (b.items?.[0]?.quantity || 0), 0);

//   return (
//     <div className="oh-wrap">
//       <OwnerSidebar active="/owner/history" />

//       <div className="oh-main">
//         <div className="oh-topbar">
//           <h1>History & Records</h1>
//           <button className="oh-export-btn">
//             <IconDownload size={15} /> Export CSV
//           </button>
//         </div>

//         {/* Summary */}
//         <div className="oh-sum-row">
//           <div className="oh-sum-card">
//             <div className="oh-sum-num">
//               {bookings.filter((b) => b.status === "COMPLETED").length}
//             </div>
//             <div className="oh-sum-lbl">Total jobs done</div>
//           </div>
//           <div className="oh-sum-card">
//             <div className="oh-sum-num">
//               ₹{totalEarnings.toLocaleString("en-IN")}
//             </div>
//             <div className="oh-sum-lbl">Total earned</div>
//           </div>
//           <div className="oh-sum-card">
//             <div className="oh-sum-num">{totalAcres}</div>
//             <div className="oh-sum-lbl">Acres covered</div>
//           </div>
//           <div className="oh-sum-card">
//             <div className="oh-sum-num">
//               {bookings.filter((b) => b.status === "CANCELLED").length}
//             </div>
//             <div className="oh-sum-lbl">Cancelled</div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="oh-filters">
//           <input
//             className="oh-search"
//             type="text"
//             placeholder="Search farmer name..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <select
//             className="oh-select"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="">All status</option>
//             <option value="COMPLETED">Completed</option>
//             <option value="CANCELLED">Cancelled</option>
//           </select>
//         </div>

//         {/* Table */}
//         <div className="oh-table-wrap">
//           <table className="oh-table">
//             <thead>
//               <tr>
//                 <th>Booking ID</th>
//                 <th>Farmer</th>
//                 <th>Services</th>
//                 <th>Date</th>
//                 <th>Amount</th>
//                 <th>Status</th>
//                 <th>Receipt</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={7} className="oh-empty">
//                     Loading records...
//                   </td>
//                 </tr>
//               ) : filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="oh-empty">
//                     No records found.
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map((b) => (
//                   <tr key={b.id}>
//                     <td style={{ color: "#6c757d" }}>{b.bookingNumber}</td>
//                     <td style={{ fontWeight: "500" }}>{b.farmerName}</td>
//                     <td>
//                       {b.items?.map((item, i) => (
//                         <span key={i} className="oh-pill">
//                           {item.serviceName}
//                         </span>
//                       ))}
//                     </td>
//                     <td>{b.preferredDate}</td>
//                     <td className="oh-amount">
//                       ₹{b.totalAmount?.toLocaleString("en-IN")}
//                     </td>
//                     <td>
//                       <span className={`badge-${b.status.toLowerCase()}`}>
//                         {b.status.charAt(0) + b.status.slice(1).toLowerCase()}
//                       </span>
//                     </td>
//                     <td>
//                       {b.status === "COMPLETED" ? (
//                         <div
//                           style={{
//                             display: "flex",
//                             flexDirection: "column",
//                             gap: "4px",
//                           }}
//                         >
//                           <PaymentStatus bookingId={b.id} />
//                           <button
//                             className="oh-receipt-btn"
//                             onClick={() => handleDownloadReceipt(b)}
//                           >
//                             <IconDownload size={12} /> Receipt
//                           </button>
//                         </div>
//                       ) : (
//                         "—"
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OwnerHistory;


import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { OwnerSidebar } from './OwnerDashboard'
import { getAllBookings } from '../../api/bookingApi'
import { getPayments } from '../../api/paymentApi'
import { generateReceipt } from '../../utils/generateReceipt'
import { IconDownload } from '@tabler/icons-react'
import './OwnerHistory.css'

// ─────────────────────────────────────────
// Payment status badge component
// ─────────────────────────────────────────
const PaymentStatus = ({ bookingId }) => {
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    getPayments(bookingId)
      .then(res => {
        const balancePaid = res.data.some(
          p => p.type === 'BALANCE' && p.status === 'SUCCESS'
        )
        setPaid(balancePaid)
      })
      .catch(() => { })
  }, [bookingId])

  return (
    <span style={{
      fontSize: '11px',
      fontWeight: '500',
      padding: '2px 8px',
      borderRadius: '20px',
      background: paid ? '#EAF3DE' : '#FAEEDA',
      color: paid ? '#3B6D11' : '#854F0B',
      display: 'inline-block',
      marginBottom: '4px',
    }}>
      {paid ? '✓ Paid' : 'Pending payment'}
    </span>
  )
}

// ─────────────────────────────────────────
// Main component
// ─────────────────────────────────────────
const OwnerHistory = () => {
  const [bookings, setBookings] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [search, statusFilter, bookings])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const res = await getAllBookings()
      const done = res.data.filter(b =>
        b.status === 'COMPLETED' || b.status === 'CANCELLED'
      )
      setBookings(done)
      setFiltered(done)
    } catch (err) {
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...bookings]
    if (search) {
      result = result.filter(b =>
        b.farmerName.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (statusFilter) {
      result = result.filter(b => b.status === statusFilter)
    }
    setFiltered(result)
  }

  const handleDownloadReceipt = async (booking) => {
    try {
      const res = await getPayments(booking.id)
      generateReceipt(booking, res.data)
      toast.success('Receipt downloaded!')
    } catch (err) {
      toast.error('Failed to generate receipt')
    }
  }

  const totalEarnings = bookings
    .filter(b => b.status === 'COMPLETED')
    .reduce((s, b) => s + (b.totalAmount || 0), 0)

  const totalAcres = bookings
    .filter(b => b.status === 'COMPLETED')
    .reduce((s, b) => s + (b.items?.[0]?.quantity || 0), 0)

  return (
    <div className="oh-wrap">
      <OwnerSidebar active="/owner/history" />

      <div className="oh-main">
        <div className="oh-topbar">
          <h1>History & Records</h1>
          <button className="oh-export-btn">
            <IconDownload size={15} /> Export CSV
          </button>
        </div>

        {/* Summary cards */}
        <div className="oh-sum-row">
          <div className="oh-sum-card">
            <div className="oh-sum-num">
              {bookings.filter(b => b.status === 'COMPLETED').length}
            </div>
            <div className="oh-sum-lbl">Total jobs done</div>
          </div>
          <div className="oh-sum-card">
            <div className="oh-sum-num">
              ₹{totalEarnings.toLocaleString('en-IN')}
            </div>
            <div className="oh-sum-lbl">Total earned</div>
          </div>
          <div className="oh-sum-card">
            <div className="oh-sum-num">{totalAcres}</div>
            <div className="oh-sum-lbl">Acres covered</div>
          </div>
          <div className="oh-sum-card">
            <div className="oh-sum-num">
              {bookings.filter(b => b.status === 'CANCELLED').length}
            </div>
            <div className="oh-sum-lbl">Cancelled</div>
          </div>
        </div>

        {/* Filters */}
        <div className="oh-filters">
          <input
            className="oh-search"
            type="text"
            placeholder="Search farmer name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="oh-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All status</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Table */}
        <div className="oh-table-wrap">
          <table className="oh-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Farmer</th>
                <th>Services</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="oh-empty">
                    Loading records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="oh-empty">
                    No records found.
                  </td>
                </tr>
              ) : filtered.map(b => (
                <tr key={b.id}>
                  <td style={{ color: '#6c757d' }}>
                    {b.bookingNumber}
                  </td>
                  <td style={{ fontWeight: '500' }}>
                    {b.farmerName}
                  </td>
                  <td>
                    {b.items?.map((item, i) => (
                      <span key={i} className="oh-pill">
                        {item.serviceName}
                      </span>
                    ))}
                  </td>
                  <td>{b.preferredDate}</td>
                  <td className="oh-amount">
                    ₹{b.totalAmount?.toLocaleString('en-IN')}
                  </td>
                  <td>
                    <span className={`badge-${b.status.toLowerCase()}`}>
                      {b.status.charAt(0) + b.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td>
                    {b.status === 'COMPLETED'
                      ? <PaymentStatus bookingId={b.id} />
                      : '—'
                    }
                  </td>
                  <td>
                    {b.status === 'COMPLETED' ? (
                      <button
                        className="oh-receipt-btn"
                        onClick={() => handleDownloadReceipt(b)}
                      >
                        <IconDownload size={12} /> Receipt
                      </button>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default OwnerHistory