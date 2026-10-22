import { IconFileText, IconMessageSquare, IconTruck, IconArrowRight } from './Icons';

export default function OrderProcess() {
  const steps = [
    {
      step: '01',
      title: 'Enquire & Specify',
      desc: 'Submit your required steel grade, dimensions, quantity, and target delivery site via form or direct phone call.',
      icon: <IconFileText size={24} />,
    },
    {
      step: '02',
      title: 'Transparent Quotation',
      desc: 'Receive competitive mill-direct pricing with transparent GST breakdown, Mill Test Certificates (MTC), and dispatch timelines.',
      icon: <IconMessageSquare size={24} />,
    },
    {
      step: '03',
      title: 'Dispatch & Delivery',
      desc: 'Stock material is loaded and dispatched within 24 hours with live transit tracking directly to your project location.',
      icon: <IconTruck size={24} />,
    },
  ];

  return (
    <section className="section order-modern-section" id="order">
      <div className="container">
        <div className="section-header">
          <div className="section-label label-amber">
            <IconTruck size={15} /> STREAMLINED FULFILLMENT
          </div>
          <h2 className="section-title text-white">
            Procure in <span className="text-gradient">3 Simple Steps</span>
          </h2>
          <p className="section-desc text-gray">
            Engineered for minimum lead time, seamless documentation, and transparent commercial execution.
          </p>
        </div>

        <div className="order-steps-grid" id="stepsGrid">
          {steps.map((s, idx) => (
            <div className="order-step-card" key={s.step} id={`step${idx + 1}`}>
              <div className="order-step-header">
                <span className="order-step-num">{s.step}</span>
                <div className="order-step-icon">{s.icon}</div>
              </div>
              <h3 className="order-step-title">{s.title}</h3>
              <p className="order-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
