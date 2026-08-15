import React from 'react';

const VokimExperience = () => {
  return (
    <section style={s.section}>

      {/* ── HEADER ── */}
      <div style={s.headerBlock}>
        <p style={s.upcomingLabel}>UPCOMING EVENT</p>
        <h1 style={s.mainHeading}>VOKIM EXPERIENCE 2026</h1>
        <p style={s.subHeading}>A Night of African Praise</p>
      </div>

      {/* ── FLYER + EVENT DETAILS ── */}
      <div style={s.contentRow}>

        {/* Primary flyer (KEY) */}
        <div style={s.primaryFlyerWrap}>
          <img
            src="/static/vokim_experience_flyer1.jpg"
            alt="VOKIM Experience 2026 Official Flyer"
            style={s.primaryFlyer}
          />
        </div>

        {/* Details column */}
        <div style={s.detailsCol}>

          <div style={s.detailItem}>
            <span style={s.detailIcon}>📅</span>
            <div>
              <p style={s.detailLabel}>DATE</p>
              <p style={s.detailValue}>Saturday, June 27th, 2026</p>
            </div>
          </div>

          <div style={s.detailItem}>
            <span style={s.detailIcon}>🕓</span>
            <div>
              <p style={s.detailLabel}>TIME</p>
              <p style={s.detailValue}>4:00 PM – 6:00 PM</p>
              <p style={s.detailNote}>Doors open at 3:15 PM</p>
              <p style={s.detailNote}>
                Guests are welcome to enjoy a Hymns Medley, Red Carpet reception, and photo opportunities.
              </p>
            </div>
          </div>

          <div style={s.detailItem}>
            <span style={s.detailIcon}>📍</span>
            <div>
              <p style={s.detailLabel}>LOCATION</p>
              <p style={s.detailValue}>15830 118 Ave NW</p>
              <p style={s.detailValue}>Edmonton, AB T5V 0A9</p>
            </div>
          </div>

          <div style={s.detailItem}>
            <span style={s.detailIcon}>🎟️</span>
            <div>
              <p style={s.detailLabel}>ADMISSION</p>
              <p style={s.freeText}>FREE</p>
            </div>
          </div>

          <p style={s.registerPrompt}>Click the link below to register for free:</p>
          <a
            href="https://www.eventbrite.ca/e/vokim-experience-2026-african-praise-tickets-1983321532092?aff=oddtdtcreator"
            target="_blank"
            rel="noopener noreferrer"
            style={s.registerBtn}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#b8861a'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#E4A11B'}
          >
            REGISTER FOR FREE →
          </a>

          {/* TikTok */}
          <a
            href="https://vt.tiktok.com/ZSuF1WpNs/"
            target="_blank"
            rel="noopener noreferrer"
            style={s.tiktokLink}
            onMouseOver={e => e.currentTarget.style.borderColor = '#E4A11B'}
            onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(228,161,27,0.4)'}
          >
            <span style={s.tiktokIcon}>▶</span>
            <span>Watch the VOKIM Experience</span>
          </a>

        </div>
      </div>

      {/* ── ABOUT THE VOKIM EXPERIENCE ── */}
      <div style={s.card}>
        <h2 style={s.cardHeading}>ABOUT THE VOKIM EXPERIENCE</h2>
        <p style={s.bodyText}>
          'VOKIM Experience' is a free evening of African Gospel music concert featuring anointed
          worshippers and gifted musicians. This inspiring concert is hosted annually by VOKIM
          (Voice of the Kingdom Music), a ministry under Voice of the Kingdom Ministries – Canada.
        </p>
        <p style={s.bodyText}>
          Born from a God-given vision, The VOKIM Experience creates a platform where people from
          every tribe, tongue, and denomination can lift their hearts, hands, sounds, and voices
          together in sincere praise to the Almighty God.
        </p>
        <p style={s.tagline}>"It's not just an event, it's an Experience"</p>
      </div>

      {/* ── MEET THE VOKIM TEAM ── */}
      <div style={s.card}>
        <h2 style={s.cardHeading}>MEET THE VOKIM TEAM</h2>
        <p style={s.bodyText}>
          At The VOKIM Experience, we are honoured to see gifted psalmists, worshippers, and
          minstrels come together — men and women who carry the sound of Heaven and reflect God's
          grace. Through VOKIM songs and ministry, it reminds us that beyond rhythm, culture, and
          language, there is one sound, one voice, one Spirit, and one Saviour — our focus is
          one: Jesus Christ.
        </p>
        <div style={s.teamButtons}>
          <a href="/join" style={s.teamBtn}>Musicians</a>
          <a href="/join" style={s.teamBtnOutline}>Non-Musicians</a>
        </div>
      </div>

      {/* ── SECONDARY FLYER ── */}
      <div style={s.secondaryFlyerWrap}>
        <img
          src="/static/vokim_experience_flyer2.jpg"
          alt="VOKIM Experience 2026 — Band"
          style={s.secondaryFlyer}
        />
      </div>

      {/* ── SHARE / NEEDS YOU ── */}
      <div style={s.card}>
        <h2 style={s.cardHeading}>SHARE THE VOKIM EXPERIENCE</h2>
        <h3 style={s.cardSubHeading}>VOKIM EXPERIENCE NEEDS YOU!</h3>
        <p style={s.bodyText}>
          The VOKIM Experience is made possible by people like you. Through your prayers,
          volunteering in different units, financial support, sharing the news online and offline,
          wearing the publicity VOKIM T-shirts, and inviting friends and family, you help make
          this event happen every year. Thank you for being part of it.
        </p>
        <p style={s.scripture}>
          "Declare His glory among the nations, His marvelous works among all peoples."
          <br /><span style={s.scriptureRef}>— 1 Chronicles 16:24 (KJV)</span>
        </p>
        <p style={s.bodyText}>
          This is an event for everyone, and we invite you to help spread the word. Together,
          let's make it known.
        </p>

        {/* Volunteer */}
        <div style={s.volunteerBox}>
          <h3 style={s.volunteerHeading}>Volunteer With Us</h3>
          <p style={s.bodyText}>
            As a volunteer, you'll be key to making the event a success. Help us create a welcoming
            and memorable experience for every attendee.
          </p>
          <ul style={s.roleList}>
            {['VOKIM Soldiers for Christ','Evangelism','Media / Promotion',
              'Ushering','Dance Team','Welfare','Event Planning / Logistics','Others']
              .map(role => (
                <li key={role} style={s.roleItem}>
                  <span style={s.roleDot}>●</span>{role}
                </li>
              ))}
          </ul>
          <p style={s.bodyText}>
            To get involved, contact us at{' '}
            <a href="mailto:info@vokim.ca" style={s.goldLink}>info@vokim.ca</a>
            {' '}or text{' '}
            <a href="sms:7808072238" style={s.goldLink}>780-807-2238</a>
            {' '}and indicate the capacity you would like to serve.
          </p>
        </div>
      </div>

      {/* ── JOIN THE PRAYERS ── */}
      <div style={s.card}>
        <h2 style={s.cardHeading}>JOIN THE PRAYERS</h2>
        <p style={s.scripture}>
          "And this is the confidence that we have in him, that, if we ask any thing according to
          his will, he heareth us: And if we know that he hear us, whatsoever we ask, we know that
          we have the petitions that we desired of him."
          <br /><span style={s.scriptureRef}>— 1 John 5:14–15 (KJV)</span>
        </p>
        <p style={s.bodyText}>
          As we prepare for The VOKIM Experience 2026, we trust God and lift our voices together
          in prayer. We invite you to join us in praying for this event.
        </p>
      </div>

      {/* ── GIVE TO SUPPORT ── */}
      <div style={s.card}>
        <h2 style={s.cardHeading}>GIVE TO SUPPORT THE EVENT</h2>
        <p style={s.bodyText}>
          'VOKIM Experience' is a free evening of African Gospel music concert featuring anointed
          worshippers and gifted musicians. Through your prayers and your support, this event
          happens every year. We launched last year and this year marks the <strong style={{color:'rgb(255,226,112)'}}>2nd edition</strong> of
          The VOKIM Experience — and it promises to be a time of intentional praise to our God.
        </p>
        <p style={s.bodyText}>
          Join hands with us to make this event a reality. It's our prayer that God, Who gives
          seed to the sower and bread to the eater, multiplies the seed we sow and increases the
          fruits of righteousness — increase you on every side, and bring you into a harvest of
          the promises He's made to you.
        </p>
        <div style={s.donateBox}>
          <p style={s.donateTitle}>Charitable Donation — VOKIM Experience Concert</p>
          <p style={s.bodyText}>
            Send your Interac e-Transfer to:{' '}
            <a href="mailto:info@vokim.ca" style={s.goldLink}>info@vokim.ca</a>
          </p>
          <p style={s.bodyText}>Tax receipt will be issued. Thank you for your generous support and God bless you.</p>
        </div>
      </div>

      {/* ── SOCIAL MEDIA ── */}
      <div style={{...s.card, textAlign: 'center'}}>
        <h2 style={s.cardHeading}>STAY CONNECTED</h2>
        <p style={s.bodyText}>Subscribe to our pages and be the first to know.</p>
        <div style={s.socialRow}>
          <a href="https://www.facebook.com/vokimministries" target="_blank" rel="noopener noreferrer" style={s.socialBtn}>
            Facebook
          </a>
          <a href="https://www.instagram.com/vokim_ministries" target="_blank" rel="noopener noreferrer" style={s.socialBtn}>
            Instagram
          </a>
          <a href="https://www.tiktok.com/@vokim_ministries" target="_blank" rel="noopener noreferrer" style={s.socialBtn}>
            TikTok @Vokim_ministries
          </a>
        </div>
      </div>

      {/* ── THANK YOU ── */}
      <div style={s.thankYou}>
        <p style={s.thankYouText}>
          Thank you for your support!<br />
          <span style={s.thankYouSub}>Looking forward to seeing you at the venue.</span>
        </p>
        <a
          href="https://www.eventbrite.ca/e/vokim-experience-2026-african-praise-tickets-1983321532092?aff=oddtdtcreator"
          target="_blank"
          rel="noopener noreferrer"
          style={s.registerBtn}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#b8861a'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#E4A11B'}
        >
          REGISTER FOR FREE →
        </a>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .vexp-content-row { flex-direction: column !important; align-items: center !important; }
          .vexp-primary-flyer { max-width: 420px !important; width: 100% !important; }
          .vexp-details { width: 100% !important; max-width: 100% !important; }
        }
        @media (max-width: 480px) {
          .vexp-primary-flyer { max-width: 100% !important; }
        }
      `}</style>
    </section>
  );
};

const gold = 'rgb(255, 226, 112)';
const goldAccent = '#E4A11B';

const s = {
  section: {
    background: 'linear-gradient(to bottom, #1a1400, #2a1f00, #1a1a1a)',
    padding: '4rem 1.5rem',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box',
  },

  /* Header */
  headerBlock: { marginBottom: '3rem' },
  upcomingLabel: {
    fontSize: '1rem', fontWeight: '700', letterSpacing: '0.25em',
    color: goldAccent, textTransform: 'uppercase', marginBottom: '0.5rem',
  },
  mainHeading: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900', color: gold,
    fontFamily: 'Georgia, "Times New Roman", Times, serif',
    letterSpacing: '0.05em', textShadow: '0 2px 20px rgba(228,161,27,0.4)',
    margin: '0 0 0.5rem 0', lineHeight: 1.2,
  },
  subHeading: {
    fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', color: 'rgba(255,255,255,0.75)',
    fontStyle: 'italic', letterSpacing: '0.1em', margin: 0,
  },

  /* Flyer + details row */
  contentRow: {
    display: 'flex', flexDirection: 'row', gap: '3rem',
    justifyContent: 'center', alignItems: 'flex-start',
    maxWidth: '1100px', margin: '0 auto 3rem auto', flexWrap: 'wrap',
  },
  primaryFlyerWrap: { flex: '0 0 auto', maxWidth: '400px', width: '100%' },
  primaryFlyer: {
    width: '100%', height: 'auto', borderRadius: '12px', display: 'block',
    boxShadow: '0 8px 40px rgba(228,161,27,0.35)',
  },
  detailsCol: {
    flex: '1 1 320px', maxWidth: '480px', display: 'flex',
    flexDirection: 'column', gap: '1.25rem', textAlign: 'left',
  },
  detailItem: { display: 'flex', gap: '0.875rem', alignItems: 'flex-start' },
  detailIcon: { fontSize: '1.4rem', lineHeight: 1, marginTop: '2px' },
  detailLabel: {
    fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.15em',
    color: goldAccent, margin: '0 0 2px 0', textTransform: 'uppercase',
  },
  detailValue: { fontSize: '1rem', fontWeight: '600', color: '#ffffff', margin: '0', lineHeight: 1.5 },
  detailNote: { fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: '4px 0 0 0', lineHeight: 1.5 },
  freeText: { fontSize: '1.5rem', fontWeight: '900', color: gold, letterSpacing: '0.1em', margin: 0 },
  registerPrompt: { fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: '0.5rem 0 0.25rem 0' },
  registerBtn: {
    display: 'inline-block', backgroundColor: goldAccent, color: '#000',
    fontWeight: '800', fontSize: '1rem', letterSpacing: '0.1em',
    padding: '0.9rem 2.5rem', borderRadius: '4px', textDecoration: 'none',
    textAlign: 'center', transition: 'background-color 0.2s ease',
    alignSelf: 'flex-start', textTransform: 'uppercase',
  },
  tiktokLink: {
    display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
    color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', fontWeight: '600',
    textDecoration: 'none', border: '1px solid rgba(228,161,27,0.4)',
    borderRadius: '4px', padding: '0.6rem 1.2rem', alignSelf: 'flex-start',
    transition: 'border-color 0.2s ease',
  },
  tiktokIcon: { color: goldAccent, fontSize: '0.9rem' },

  /* Cards */
  card: {
    maxWidth: '860px', margin: '0 auto 2.5rem auto',
    background: 'rgba(255,255,255,0.05)', borderRadius: '12px',
    padding: '2rem 2.5rem', textAlign: 'left',
    borderLeft: `4px solid ${goldAccent}`,
  },
  cardHeading: {
    fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: '900', color: gold,
    fontFamily: 'Georgia, "Times New Roman", Times, serif',
    margin: '0 0 0.5rem 0', letterSpacing: '0.04em',
  },
  cardSubHeading: {
    fontSize: '1.1rem', fontWeight: '700', color: goldAccent,
    letterSpacing: '0.08em', margin: '0 0 1rem 0', textTransform: 'uppercase',
  },
  bodyText: {
    fontSize: '0.975rem', lineHeight: '1.75', color: 'rgba(255,255,255,0.82)',
    margin: '0 0 1rem 0',
  },
  tagline: {
    fontSize: '1.2rem', fontStyle: 'italic', fontWeight: '600',
    color: gold, textAlign: 'center', margin: '1.5rem 0 0 0',
    letterSpacing: '0.03em',
  },

  /* Team buttons */
  teamButtons: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' },
  teamBtn: {
    display: 'inline-block', backgroundColor: goldAccent, color: '#000',
    fontWeight: '700', fontSize: '0.95rem', padding: '0.6rem 1.8rem',
    borderRadius: '4px', textDecoration: 'none', letterSpacing: '0.05em',
  },
  teamBtnOutline: {
    display: 'inline-block', border: `2px solid ${goldAccent}`, color: gold,
    fontWeight: '700', fontSize: '0.95rem', padding: '0.6rem 1.8rem',
    borderRadius: '4px', textDecoration: 'none', letterSpacing: '0.05em',
    backgroundColor: 'transparent',
  },

  /* Secondary flyer */
  secondaryFlyerWrap: { maxWidth: '520px', margin: '0 auto 2.5rem auto' },
  secondaryFlyer: {
    width: '100%', height: 'auto', borderRadius: '12px', display: 'block',
    boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
  },

  /* Scripture */
  scripture: {
    fontSize: '0.95rem', fontStyle: 'italic', color: gold,
    margin: '0.5rem 0 1rem 0', lineHeight: 1.7,
    borderLeft: `3px solid ${goldAccent}`, paddingLeft: '1rem',
  },
  scriptureRef: { fontStyle: 'normal', fontWeight: '600', fontSize: '0.85rem', color: goldAccent },

  /* Volunteer box */
  volunteerBox: {
    background: 'rgba(228,161,27,0.08)', borderRadius: '8px',
    padding: '1.25rem 1.5rem', marginTop: '1.25rem',
  },
  volunteerHeading: {
    fontSize: '1.1rem', fontWeight: '800', color: gold,
    margin: '0 0 0.75rem 0', textTransform: 'uppercase', letterSpacing: '0.08em',
  },
  roleList: { listStyle: 'none', padding: 0, margin: '0.5rem 0 1rem 0', display: 'flex', flexWrap: 'wrap', gap: '0.4rem 1.5rem' },
  roleItem: { fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: '0.4rem' },
  roleDot: { color: goldAccent, fontSize: '0.6rem' },
  goldLink: { color: goldAccent, fontWeight: '600', textDecoration: 'underline' },

  /* Donate box */
  donateBox: {
    background: 'rgba(228,161,27,0.1)', borderRadius: '8px',
    padding: '1.25rem 1.5rem', marginTop: '1rem',
    border: `1px solid rgba(228,161,27,0.3)`,
  },
  donateTitle: {
    fontSize: '1rem', fontWeight: '800', color: gold,
    margin: '0 0 0.75rem 0', textTransform: 'uppercase', letterSpacing: '0.06em',
  },

  /* Social */
  socialRow: { display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' },
  socialBtn: {
    display: 'inline-block', border: `1px solid ${goldAccent}`, color: gold,
    fontWeight: '600', fontSize: '0.9rem', padding: '0.5rem 1.4rem',
    borderRadius: '4px', textDecoration: 'none', letterSpacing: '0.05em',
    transition: 'background 0.2s',
  },

  /* Thank you */
  thankYou: {
    maxWidth: '600px', margin: '3rem auto 0 auto',
    textAlign: 'center', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '1.5rem',
  },
  thankYouText: { fontSize: '1.3rem', fontWeight: '700', color: gold, margin: 0, lineHeight: 1.6 },
  thankYouSub: { fontSize: '1rem', fontWeight: '400', color: 'rgba(255,255,255,0.7)' },
};

export default VokimExperience;
