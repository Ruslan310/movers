"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useCountUp } from "react-countup";

const Arrow = () => <span aria-hidden="true">↗</span>;
const Check = () => <span className="check" aria-hidden="true">✓</span>;

function RollingAmount({ value }: { value: number }) {
  const countUpRef = useRef<HTMLSpanElement>(null);
  const { update } = useCountUp({
    ref: countUpRef as unknown as RefObject<HTMLElement>,
    start: value,
    end: value,
    duration: 0.7,
    separator: ",",
    useEasing: true,
    enableReinitialize: false,
  });

  useEffect(() => update(value), [update, value]);

  return <span ref={countUpRef}>{value.toLocaleString("en-CA")}</span>;
}

const services = [
  { num: "01", title: "Apartment moves", text: "Elevators, strata rules, tight hallways — planned before moving day.", tag: "Most popular" },
  { num: "02", title: "House moves", text: "Full-home packing, furniture protection and careful room-by-room setup.", tag: "Door to door" },
  { num: "03", title: "Cafés & restaurants", text: "Equipment, fixtures and furniture moved around your service schedule.", tag: "Low downtime" },
  { num: "04", title: "Packing & logistics", text: "Supplies, packing, storage coordination and last-mile delivery.", tag: "Full service" },
];

const reviews = [
  ["AK", "Anna K.", "Kitsilano → Burnaby", "The team arrived right on time, protected every corner and somehow made our two-bedroom move feel easy. Final price matched the quote."],
  ["DL", "David L.", "North Vancouver", "Our restaurant equipment was heavy and delicate. Everything was labelled, secured and back in place before our next service."],
  ["MS", "Maya S.", "Yaletown → Coquitlam", "Fast, kind and incredibly organized. The live arrival update and clear hourly pricing took all the stress out of moving day."],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [home, setHome] = useState("2 Bedroom");
  const [volume, setVolume] = useState("Typical");
  const [sent, setSent] = useState(false);
  const [showNavEstimate, setShowNavEstimate] = useState(false);

  useEffect(() => {
    const primaryCta = document.getElementById("primary-estimate-cta");
    if (!primaryCta) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowNavEstimate(!entry.isIntersecting && entry.boundingClientRect.bottom < 84),
      { rootMargin: "-84px 0px 0px 0px", threshold: 0 },
    );

    observer.observe(primaryCta);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const revealGroups = [
      ".proofStrip > div",
      ".sectionHead",
      ".serviceCard",
      ".estIntro, .calculator",
      ".photo",
      ".reviewLead, .reviewCard",
      ".areasMap, .areasCopy",
      ".contactCopy, .contactForm",
      "footer > div",
    ];
    const elements: HTMLElement[] = [];

    revealGroups.forEach((selector) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
        element.classList.add("revealItem");
        element.style.setProperty("--reveal-delay", `${Math.min(index, 3) * 75}ms`);
        elements.push(element);
      });
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const moveEstimate = useMemo(() => {
    const homes = {
      "1 Bedroom": { hours: 3, rate: 149 },
      "2 Bedroom": { hours: 5, rate: 179 },
      "3 Bedroom": { hours: 7, rate: 219 },
      Townhouse: { hours: 8, rate: 239 },
      House: { hours: 10, rate: 269 },
    };
    const selected = homes[home as keyof typeof homes];
    const volumeAdjustment = volume === "Light" ? -1 : volume === "Full" ? 2 : 0;
    const minHours = Math.max(2, selected.hours + volumeAdjustment);
    const maxHours = minHours + (home === "House" || home === "Townhouse" ? 2 : 1);
    return { rate: selected.rate, minHours, maxHours, minTotal: selected.rate * minHours, maxTotal: selected.rate * maxHours };
  }, [home, volume]);

  return (
    <main>
      <div className="ambient ambientOne" /><div className="ambient ambientTwo" />
      <header className="nav glass">
        <a href="#top" className="brand" aria-label="Northline Movers home"><span className="brandMark">N</span><span>NORTHLINE <b>MOVERS</b></span></a>
        <nav className={menuOpen ? "navLinks open" : "navLinks"} aria-label="Primary navigation">
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#work" onClick={() => setMenuOpen(false)}>Our work</a>
          <a href="#reviews" onClick={() => setMenuOpen(false)}>Reviews</a>
          <a href="#areas" onClick={() => setMenuOpen(false)}>Areas</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
        <a className={`navCta ${showNavEstimate ? "navCtaVisible" : ""}`} href="#estimate" aria-hidden={!showNavEstimate} tabIndex={showNavEstimate ? 0 : -1}>Get estimate <Arrow /></a>
        <button className="menuButton" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
      </header>

      <section className="hero" id="top">
        <div className="heroCopy">
          <div className="eyebrow"><i /> Moving Greater Vancouver, daily</div>
          <h1>Your move.<br /><em>Handled beautifully.</em></h1>
          <p>Careful local movers for apartments, homes, cafés and restaurants. Clear quotes. Protected belongings. No moving-day drama.</p>
          <div className="heroActions"><a id="primary-estimate-cta" className="button primary" href="#estimate">Build your estimate <Arrow /></a><a className="button textButton" href="tel:+16045550184">(604) 555–0184</a></div>
          <div className="trustRow"><div className="faces"><span>AK</span><span>JM</span><span>DL</span></div><div><b>4.9 <span className="stars">★★★★★</span></b><small>from 240+ local moves</small></div></div>
        </div>
        <div className="heroVisual">
          <div className="heroPhoto" role="img" aria-label="Professional movers loading boxes into a truck" />
          <div className="floatingCard arrival glass"><span className="pulse" /><div><small>YOUR CREW</small><b>Arrives on time</b></div><strong>08:30</strong></div>
          <div className="floatingCard coverage glass"><b>Fully insured</b><span>✓</span><small>Your space & belongings</small></div>
          <div className="routeLine"><span>VAN</span><i /><span>YVR</span></div>
        </div>
      </section>

      <section className="proofStrip" aria-label="Company highlights"><div><strong>1,200+</strong><span>moves completed</span></div><div><strong>7 days</strong><span>a week availability</span></div><div><strong>$2M</strong><span>liability coverage</span></div><div><strong>0</strong><span>hidden fees</span></div></section>

      <section className="section" id="services">
        <div className="sectionHead"><div><span className="kicker">WHAT WE MOVE</span><h2>Big move or small.<br />We know the way.</h2></div><p>From a studio across the street to an entire restaurant across the Lower Mainland, your move gets a proper plan.</p></div>
        <div className="servicesGrid">{services.map((service) => <article className="serviceCard glass" key={service.num}><div className="serviceTop"><span>{service.num}</span><span className="tag">{service.tag}</span></div><div className={`serviceIcon icon${service.num}`}><span /></div><h3>{service.title}</h3><p>{service.text}</p><a href="#contact">Plan this move <Arrow /></a></article>)}</div>
      </section>

      <section className="darkSection" id="estimate">
        <div className="estIntro"><span className="kicker green">QUICK ESTIMATE</span><h2>Simple deposit.<br /><em>Then just the hours.</em></h2><p>A booking deposit reserves your date and crew. After that, you pay only for the actual time your move takes.</p><ul><li><Check /> Deposit secures your moving date</li><li><Check /> Remaining balance billed by actual hours</li><li><Check /> Clear hourly rate before moving day</li></ul></div>
        <div className="calculator glassDark">
          <div className="calcTop">
            <div className="calcHeading">
              <small>ESTIMATED MOVE RANGE</small>
              <div className="priceRange">
                <div className="pricePoint"><span>FROM</span><strong><span className="currency">CA$</span><RollingAmount value={moveEstimate.minTotal} /></strong></div>
                <div className="pricePoint"><span>UP TO</span><strong><span className="currency">CA$</span><RollingAmount value={moveEstimate.maxTotal} /></strong></div>
              </div>
            </div>
            <div className="rateBadge"><b>{moveEstimate.minHours}–{moveEstimate.maxHours} hours</b><small>CA${moveEstimate.rate} per hour</small></div>
          </div>
          <label>What are you moving?</label>
          <div className="typeGrid">{["1 Bedroom", "2 Bedroom", "3 Bedroom", "Townhouse", "House"].map(x => <button key={x} aria-pressed={home === x} className={home === x ? "selected" : ""} onClick={() => setHome(x)}>{x}</button>)}</div>
          <label>How full is the home?</label>
          <div className="volumeGrid">{[["Light","A few essentials"],["Typical","Normally furnished"],["Full","Lots of furniture & boxes"]].map(([name,detail]) => <button key={name} aria-pressed={volume === name} className={volume === name ? "selected" : ""} onClick={() => setVolume(name)}><b>{name}</b><small>{detail}</small></button>)}</div>
          <div className="paymentModel"><Check /><div><b>Booking deposit</b><small>Paid once to reserve your crew and date</small></div><strong>Confirmed in quote</strong></div>
          <div className="estimateNotice"><span aria-hidden="true">i</span><p><b>This is an approximate estimate.</b> Final time and price may vary depending on the amount of belongings, elevator availability, stairs, carrying distance, oversized or heavy items, parking access, and other conditions that make handling more difficult.</p></div>
          <a href="#contact" className="button primary full">Confirm my hourly rate <Arrow /></a><small className="disclaimer">Planning range based on home size and item volume. Your final balance is calculated from actual hours worked.</small>
        </div>
      </section>

      <section className="section workSection" id="work">
        <div className="sectionHead"><div><span className="kicker">RECENT MOVES</span><h2>Care you can see.</h2></div><p>Real-world moving expertise, from careful packing to the final placement.</p></div>
        <div className="gallery">
          <article className="photo photoOne"><div><span>RESIDENTIAL</span><h3>Two-bedroom apartment</h3><p>Kitsilano → Mount Pleasant · 5.5 hrs</p></div></article>
          <article className="photo photoTwo"><div><span>PACKING</span><h3>Full-home preparation</h3><p>North Vancouver · 86 boxes</p></div></article>
          <article className="photo photoThree"><div><span>HOSPITALITY</span><h3>Café relocation</h3><p>Commercial Drive · overnight</p></div></article>
        </div>
        <p className="photoNote">Representative project photography. Ask to see our latest verified move gallery.</p>
      </section>

      <section className="section reviewsSection" id="reviews">
        <div className="reviewLead"><span className="kicker">NEIGHBOUR APPROVED</span><h2>Moves people<br /><em>actually enjoyed.</em></h2><div className="bigRating"><strong>4.9</strong><div><span className="stars">★★★★★</span><small>Google rating</small></div></div></div>
        <div className="reviewCards">{reviews.map(([initials,name,route,quote]) => <article className="reviewCard glass" key={name}><span className="quote">“</span><p>{quote}</p><div className="reviewer"><span>{initials}</span><div><b>{name}</b><small>{route}</small></div><em>★★★★★</em></div></article>)}</div>
      </section>

      <section className="areas section" id="areas">
        <div className="areasMap"><div className="mapWater"/><div className="mapRoad roadOne"/><div className="mapRoad roadTwo"/><span className="pin p1">Vancouver</span><span className="pin p2">Burnaby</span><span className="pin p3">Richmond</span><span className="pin p4">Coquitlam</span><span className="pin p5">North Van</span></div>
        <div className="areasCopy"><span className="kicker">LOCAL BY DESIGN</span><h2>Greater Vancouver<br /><em>is our home route.</em></h2><p>Local crews who understand bridge timing, strata move windows, loading zones and neighbourhood access.</p><div className="areaTags">{["Vancouver","Burnaby","Richmond","Coquitlam","North Vancouver","West Vancouver","New Westminster","Surrey","Delta","Port Moody"].map(x=><span key={x}>{x}</span>)}</div><p className="small">Moving farther? Ask us about routes across British Columbia.</p></div>
      </section>

      <section className="contact section" id="contact">
        <div className="contactCopy"><span className="kicker green">LET’S GET MOVING</span><h2>Tell us where.<br /><em>We’ll handle the how.</em></h2><p>Share a few details and we’ll respond with availability and a clear quote — usually within 20 minutes during business hours.</p><div className="contactMethods"><a href="tel:+16045550184"><span>↗</span><div><small>CALL OR TEXT</small><b>(604) 555–0184</b></div></a><a href="mailto:hello@northlinemovers.ca"><span>↗</span><div><small>EMAIL</small><b>hello@northlinemovers.ca</b></div></a></div></div>
        <form className="contactForm glassDark" onSubmit={e => { e.preventDefault(); setSent(true); }}>
          {sent ? <div className="success"><span>✓</span><h3>Request received.</h3><p>Thanks! We’ll be in touch shortly to confirm the details.</p><button type="button" onClick={()=>setSent(false)}>Send another</button></div> : <><div className="formRow"><label>Your name<input required placeholder="Alex Morgan" /></label><label>Phone number<input required type="tel" placeholder="(604) 555-0123" /></label></div><div className="formRow"><label>Moving from<input required placeholder="Postal code or neighbourhood" /></label><label>Moving to<input required placeholder="Postal code or neighbourhood" /></label></div><div className="formRow"><label>Move date<input required type="date" /></label><label>Move type<select defaultValue="2 Bedroom"><option>1 Bedroom</option><option>2 Bedroom</option><option>3 Bedroom</option><option>Townhouse</option><option>House</option></select></label></div><label>Anything we should know?<textarea placeholder="Bedrooms, stairs, large items, packing help…" /></label><button className="button primary full" type="submit">Request my quote <Arrow /></button><small className="privacy">By submitting, you agree we may contact you about your move. No spam.</small></>}
        </form>
      </section>

      <footer><div className="footerBrand"><a href="#top" className="brand"><span className="brandMark">N</span><span>NORTHLINE <b>MOVERS</b></span></a><p>Thoughtful moving and logistics<br />across Greater Vancouver.</p></div><div><h4>Explore</h4><a href="#services">Services</a><a href="#work">Our work</a><a href="#estimate">Estimate</a><a href="#reviews">Reviews</a></div><div><h4>Contact</h4><a href="tel:+16045550184">(604) 555–0184</a><a href="mailto:hello@northlinemovers.ca">hello@northlinemovers.ca</a><span>Mon–Sun · 7am–9pm</span></div><div><h4>Based in</h4><span>Vancouver, BC</span><span>Serving the Lower Mainland</span><span>BC registered & insured</span></div><div className="footerBottom"><span>© 2026 Northline Movers</span><span>Privacy · Terms</span><span>Made for moving forward.</span></div></footer>
      <a className="mobileCta" href="#estimate">Get a free estimate <Arrow /></a>
    </main>
  );
}
