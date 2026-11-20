import { Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import {
  IconTractor, IconSettings2, IconDroplet,
  IconPlant2, IconMapPin, IconCalendar,
  IconLanguage, IconClock, IconStar,
  IconShieldCheck, IconHeart
} from '@tabler/icons-react'
import './AboutPage.css'

const equipment = [
  { icon: <IconTractor size={22} color="#3B6D11" />, name: 'Mahindra 575 DI', detail: '47 HP, 4WD, 2018 model' },
  { icon: <IconSettings2 size={22} color="#3B6D11" />, name: 'Rotavator', detail: '6 ft heavy duty' },
  { icon: <IconDroplet size={22} color="#3B6D11" />, name: 'Boom Sprayer', detail: '400 litre tank, 12 m boom' },
  { icon: <IconPlant2 size={22} color="#3B6D11" />, name: 'Seed Drill', detail: '9 tyne, multi-crop' },
]

const values = [
  {
    icon: <IconClock size={18} color="#3B6D11" />,
    title: 'Always on time',
    desc: 'We show up on the date you book, every time. Your season cannot wait and we understand that.'
  },
  {
    icon: <IconShieldCheck size={18} color="#3B6D11" />,
    title: 'Transparent pricing',
    desc: 'No hidden charges. The rate you see is the rate you pay — per acre, confirmed before the job starts.'
  },
  {
    icon: <IconHeart size={18} color="#3B6D11" />,
    title: 'Farmer first',
    desc: 'We grew up farming. We treat every field like our own and every farmer like family.'
  },
]

const AboutPage = () => {
  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="ab-hero">
        <div>
          <div className="ab-hero-tag">
            <IconMapPin size={12} /> Pune district, Maharashtra
          </div>
          <h1>Farming is our roots, service is our purpose</h1>
          <p>
            KhetSeva was born from a simple belief — every farmer deserves
            timely, professional, and affordable tractor services. We have
            been serving fields across Pune district for over a decade.
          </p>
        </div>
        <div className="ab-hero-stats">
          {[
            { num: '12+', label: 'Years of experience' },
            { num: '500+', label: 'Farmers served' },
            { num: '5,000+', label: 'Acres covered' },
            { num: '3', label: 'Districts covered' },
          ].map((s, i) => (
            <div key={i} className="ab-hero-stat">
              <div className="ab-hero-stat-num">{s.num}</div>
              <div className="ab-hero-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="ab-story">
        <div>
          <div className="ab-section-tag">Our story</div>
          <h2>From one tractor to a trusted name</h2>
          <p>
            Suresh Pawar started with a single tractor in 2012, helping
            neighbours in Baramati with basic ploughing. Over the years,
            the demand grew — and so did the trust.
          </p>
          <p>
            Today, KhetSeva serves farmers across Baramati, Indapur, and
            Daund with 7 specialised services. Every job is handled
            personally, with the same care we would give to our own fields.
          </p>
          <p>
            In 2025, we launched this platform to make booking easier —
            no phone tag, no confusion, just simple online booking with
            transparent pricing and payment after the job is done.
          </p>
        </div>
        <div className="ab-owner-card">
          <div className="ab-owner-top">
            <div className="ab-owner-av">SP</div>
            <div>
              <div className="ab-owner-name">Suresh Pawar</div>
              <div className="ab-owner-role">Founder & tractor operator</div>
            </div>
          </div>
          <div className="ab-owner-detail">
            {[
              { icon: <IconMapPin size={15} color="#3B6D11" />, text: 'Baramati, Pune, Maharashtra' },
              { icon: <IconCalendar size={15} color="#3B6D11" />, text: '12+ years in tractor services' },
              { icon: <IconLanguage size={15} color="#3B6D11" />, text: 'Speaks Marathi, Hindi, English' },
              { icon: <IconClock size={15} color="#3B6D11" />, text: 'Available 6 days a week' },
              { icon: <IconStar size={15} color="#3B6D11" />, text: '4.9 average rating from 500+ farmers' },
            ].map((r, i) => (
              <div key={i} className="ab-owner-row">
                {r.icon} {r.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment */}
      <section className="ab-equipment">
        <div className="ab-section-tag">Equipment</div>
        <h2>What we operate</h2>
        <div className="ab-eq-grid">
          {equipment.map((eq, i) => (
            <div key={i} className="ab-eq-card">
              <div className="ab-eq-icon">{eq.icon}</div>
              <div className="ab-eq-name">{eq.name}</div>
              <div className="ab-eq-detail">{eq.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="ab-values">
        <div className="ab-section-tag">Why choose us</div>
        <h2>Our values</h2>
        <div className="ab-val-grid">
          {values.map((v, i) => (
            <div key={i} className="ab-val-card">
              <div className="ab-val-icon">{v.icon}</div>
              <div className="ab-val-title">{v.title}</div>
              <div className="ab-val-desc">{v.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="ab-cta">
        <h2>Ready to book a service?</h2>
        <p>Join 500+ farmers who trust KhetSeva for their tractor needs.</p>
        <Link to="/services">
          <button className="btn-ks-primary" style={{ padding: '12px 28px', fontSize: '15px' }}>
            Book your first service ↗
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="ab-footer">
        <div className="ab-footer-logo">
          Khet<span>Seva</span>
        </div>
        <div className="ab-footer-copy">© 2025 KhetSeva. All rights reserved.</div>
      </footer>

    </div>
  )
}

export default AboutPage