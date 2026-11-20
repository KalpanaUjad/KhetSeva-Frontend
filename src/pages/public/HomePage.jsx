import { Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import './HomePage.css'
import {
  IconPlant2, IconCut, IconArrowsShuffle,
  IconDroplet, IconSettings2, IconRuler2, IconTruck,
  IconMapPin
} from '@tabler/icons-react'

const services = [
  { icon: <IconPlant2 size={22} color="#6d114a" />, name: 'Sowing', rate: '₹800 / acre' },
  { icon: <IconCut size={22} color="#3B6D11" />, name: 'Harvesting', rate: '₹1,200 / acre' },
  { icon: <IconArrowsShuffle size={22} color="#3B6D11" />, name: 'Ploughing', rate: '₹700 / acre' },
  { icon: <IconDroplet size={22} color="#3B6D11" />, name: 'Spraying', rate: '₹500 / acre' },
  { icon: <IconSettings2 size={22} color="#3B6D11" />, name: 'Rotavator', rate: '₹900 / acre' },
  { icon: <IconRuler2 size={22} color="#3B6D11" />, name: 'Levelling', rate: '₹600 / acre' },
  { icon: <IconTruck size={22} color="#3B6D11" />, name: 'Transportation', rate: '₹15 / km' },
]

const steps = [
  { num: 1, title: 'Register & login', desc: 'Create your free account with your mobile number and village details' },
  { num: 2, title: 'Choose a service', desc: 'Pick the service, enter your field size and preferred date' },
  { num: 3, title: 'Owner approves', desc: 'You get a confirmation once the owner reviews and accepts' },
  { num: 4, title: 'Pay after work', desc: 'Job done? Pay securely via UPI or card and download your receipt' },
]

const reviews = [
  { initials: 'RS', name: 'Ramesh Shinde', location: 'Baramati, Pune', text: 'Booking was very easy and the work was done on time. The tractor operator was experienced and careful with my sugarcane field.', stars: 5 },
  { initials: 'SP', name: 'Sunita Patil', location: 'Indapur, Pune', text: 'Online payment after work is very convenient. I got a proper bill too. Will definitely book again for the next season.', stars: 5 },
  { initials: 'VK', name: 'Vijay Kale', location: 'Daund, Pune', text: 'The spraying service was very thorough. The owner confirmed the booking quickly and showed up exactly on the date I chose.', stars: 4 },
]

const HomePage = () => {
  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="home-hero">
        <div>
          <div className="home-hero-tag">
            <IconMapPin size={12} /> Serving farmers across Maharashtra
          </div>
          <h1>
            Your Farm Deserves <em>Expert</em> Tractor Services
          </h1>
          <p>
            From sowing to harvesting, ploughing to spraying — get professional
            tractor services at your field, on your schedule. Book in minutes,
            pay after the job.
          </p>
          <div className="home-hero-btns">
            <Link to="/services">
              <button className="btn-ks-primary" style={{ padding: '12px 24px', fontSize: '15px' }}>
                Book a Service ↗
              </button>
            </Link>
            <Link to="/about">
              <button className="btn-ks-outline" style={{ padding: '12px 24px', fontSize: '15px' }}>
                Learn More
              </button>
            </Link>
          </div>
        </div>

        <div className="home-hero-visual">
          <div className="home-exp-badge">
            <div className="big">12+</div>
            <div className="sub">Years of farming experience</div>
          </div>
          <div className="home-stat-row">
            {[
              { num: '500+', label: 'Farmers served' },
              { num: '7', label: 'Services offered' },
              { num: '4.9★', label: 'Avg. rating' },
            ].map((s, i) => (
              <div key={i} className="home-stat">
                <div className="home-stat-num">{s.num}</div>
                <div className="home-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="home-services">
        <div className="home-section-tag">What we offer</div>
        <h2 className="home-section-title">Our Services</h2>
        <div className="home-services-grid">
          {services.map((svc, i) => (
            <div key={i} className="home-svc-card">
              <div className="home-svc-icon">{svc.icon}</div>
              <div className="home-svc-name">{svc.name}</div>
              <div className="home-svc-rate">{svc.rate}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="home-how">
        <div className="home-section-tag">Simple process</div>
        <h2 className="home-section-title">How it works</h2>
        <div className="home-steps">
          {steps.map((step, i) => (
            <div key={i} className="home-step">
              <div className="home-step-num">{step.num}</div>
              <div className="home-step-title">{step.title}</div>
              <div className="home-step-desc">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About strip */}
      <section className="home-about">
        <div>
          <div className="home-about-tag">About the owner</div>
          <h2>Trusted by Farmers for Over a Decade</h2>
          <p>
            With 12+ years of hands-on farming experience, we understand your
            land and your crops. Our modern tractor and equipment ensure
            precision work — every acre, every time.
          </p>
          <p>
            We operate across Pune and nearby districts. Available 6 days a
            week, from sunrise to sunset.
          </p>
        </div>
        <div className="home-about-stats">
          {[
            { num: '12+', label: 'Years experience' },
            { num: '500+', label: 'Farmers served' },
            { num: '5,000+', label: 'Acres covered' },
            { num: '3', label: 'Districts covered' },
          ].map((s, i) => (
            <div key={i} className="home-about-stat">
              <div className="home-about-stat-num">{s.num}</div>
              <div className="home-about-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="home-reviews">
        <div className="home-section-tag">What farmers say</div>
        <h2 className="home-section-title">Reviews</h2>
        <div className="home-reviews-grid">
          {reviews.map((r, i) => (
            <div key={i} className="home-review-card">
              <div className="home-review-stars">
                {'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}
              </div>
              <p className="home-review-text">{r.text}</p>
              <div className="home-review-author">
                <div className="home-review-avatar">{r.initials}</div>
                <div>
                  <div className="home-review-name">{r.name}</div>
                  <div className="home-review-loc">{r.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <h2>Ready to book your next farm service?</h2>
        <p>Join 500+ farmers who trust KhetSeva for their tractor needs.</p>
        <Link to="/login">
          <button className="btn-ks-primary" style={{ padding: '12px 28px', fontSize: '15px' }}>
            Get started — it is free ↗
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer-logo">
          Khet<span>Seva</span>
        </div>
        <div className="home-footer-links">
          {['Services', 'About', 'Contact', 'Owner login'].map((l, i) => (
            <span key={i} className="home-footer-link">{l}</span>
          ))}
        </div>
        <div className="home-footer-copy">© 2025 KhetSeva. All rights reserved.</div>
      </footer>

    </div>
  )
}

export default HomePage