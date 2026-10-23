import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  ClipboardCheck,
  FilePlus2,
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import AnalyticsDashboard from './components/AnalyticsDashboard.jsx'
import OtpModal from './components/OtpModal.jsx'
import RegistrationForm from './components/RegistrationForm.jsx'
import StatusTimeline from './components/StatusTimeline.jsx'
import { useFirStore, WHATSAPP_NUMBER } from './store/useFirStore.js'
import './App.css'

const steps = [
  { label: 'Your details', icon: ClipboardCheck },
  { label: 'Your statement', icon: FilePlus2 },
  { label: 'Review & secure', icon: Fingerprint },
  { label: 'Verify identity', icon: LockKeyhole },
  { label: 'Report filed', icon: ShieldCheck },
]

const demoReport = {
  id: 'FIR-2026-0842',
  locality: 'Indiranagar',
  station: 'Indiranagar Police Station',
  createdAt: '21 Oct 2026',
  status: 'Under review',
}

function App() {
  const [activeView, setActiveView] = useState(() => new URLSearchParams(window.location.search).get('view') === 'track' ? 'track' : 'file')
  const [otpOpen, setOtpOpen] = useState(false)
  const [trackId, setTrackId] = useState(() => new URLSearchParams(window.location.search).get('case') ?? '')
  const [trackUnlocked, setTrackUnlocked] = useState(false)
  const {
    step,
    setStep,
    setSecurityConfigured,
    currentReport,
    submitReport,
  } = useFirStore()

  const report = currentReport ?? demoReport

  const changeView = (view) => {
    setActiveView(view)
    if (view === 'file') setStep(0)
  }

  const completeFiling = () => {
    submitReport()
    setOtpOpen(false)
    setStep(4)
  }

  const startTracking = (id = currentReport?.id ?? '') => {
    setTrackId(id)
    setTrackUnlocked(false)
    setActiveView('track')
  }

  const trackLogin = (event) => {
    const submittedCode = new FormData(event.currentTarget).get('track-otp')
    if (submittedCode !== '123456') return 'That code doesn’t match. For this demo, use 123456.'
    if (trackId.trim().toUpperCase() === report.id) {
      setTrackUnlocked(true)
      return ''
    }
    return `We couldn't find that report. Try ${report.id}.`
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" onClick={() => changeView('file')}>
          <span className="brand-mark"><ShieldCheck size={23} strokeWidth={2.2} /></span>
          <span className="brand-name">Civic<span>Shield</span></span>
        </a>
        <p className="nav-caption">YOUR SPACE</p>
        <nav className="side-nav" aria-label="Main navigation">
          <button className={activeView === 'file' ? 'nav-item active' : 'nav-item'} onClick={() => changeView('file')}>
            <FilePlus2 size={18} /> File a report
          </button>
          <button className={activeView === 'track' ? 'nav-item active' : 'nav-item'} onClick={() => startTracking()}>
            <ClipboardCheck size={18} /> Track a report
          </button>
          <button className={activeView === 'insights' ? 'nav-item active' : 'nav-item'} onClick={() => changeView('insights')}>
            <BarChart3 size={18} /> Public insights
          </button>
        </nav>
        <div className="sidebar-spacer" />
        <div className="help-card">
          <div className="help-icon"><LockKeyhole size={17} /></div>
          <strong>Your safety comes first</strong>
          <p>Your information is handled with care. This demo does not send or store real reports.</p>
          <a href="tel:112">Emergency? Call 112 <ArrowRight size={13} /></a>
        </div>
        <div className="profile-row">
          <div className="profile-avatar">CS</div>
          <div><strong>Citizen portal</strong><span>Secure session</span></div>
          <span className="online-dot" />
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="breadcrumb"><span>Citizen portal</span><span className="crumb-slash">/</span><strong>
            {activeView === 'file' ? 'File a report' : activeView === 'track' ? 'Track a report' : 'Public insights'}
          </strong></div>
          <div className="topbar-right">
            <span className="secure-label"><span /> Secure & confidential</span>
            <button className="topbar-avatar" aria-label="Citizen account">C</button>
          </div>
        </header>

        <div className="content-wrap">
          <AnimatePresence mode="wait">
            {activeView === 'file' && (
              <motion.section className="page-content" key="file" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.24 }}>
                {step < 4 ? (
                  <>
                    <div className="eyebrow"><span className="eyebrow-dot" /> CITIZEN SERVICES <span className="eyebrow-line" /> 01 / 03</div>
                    <div className="page-heading-row">
                      <div><h1>File a First Information Report</h1><p className="page-subtitle">A guided, secure way to report an incident to your local police station.</p></div>
                      <div className="estimate-chip"><span className="clock-icon">◷</span> About 5 minutes</div>
                    </div>
                    <div className="wizard-progress" aria-label={`Step ${step + 1} of 5`}>
                      {steps.map((item, index) => (
                        <div className={`progress-step ${index < step ? 'complete' : ''} ${index === step ? 'current' : ''}`} key={item.label}>
                          <div className="progress-node">{index < step ? <Check size={15} /> : <item.icon size={15} />}</div>
                          <span>{item.label}</span>
                          {index < steps.length - 1 && <div className="progress-connector" />}
                        </div>
                      ))}
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div key={step} className="step-content" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
                        {step === 0 && <RegistrationForm onNext={() => setStep(1)} />}
                        {step === 1 && <StatementStep onBack={() => setStep(0)} onNext={() => setStep(2)} />}
                        {step === 2 && <SecurityStep onBack={() => setStep(1)} onNext={() => { setSecurityConfigured(true); setStep(3); setOtpOpen(true) }} />}
                        {step === 3 && <OtpStep onBack={() => setStep(2)} onOpen={() => setOtpOpen(true)} />}
                      </motion.div>
                    </AnimatePresence>
                  </>
                ) : (
                  <SubmissionSuccess report={currentReport} onTrack={() => startTracking(currentReport?.id)} onFileAnother={() => { useFirStore.getState().resetDraft(); setStep(0) }} />
                )}
              </motion.section>
            )}
            {activeView === 'track' && (
              <motion.section className="page-content" key="track" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.24 }}>
                <div className="eyebrow"><span className="eyebrow-dot" /> SECURE CASE ACCESS</div>
                <h1>Track your report</h1>
                <p className="page-subtitle tracking-subtitle">Check the latest stage of your report with your secure tracking link.</p>
                {!trackUnlocked ? (
                  <TrackingLogin trackId={trackId} setTrackId={setTrackId} onSubmit={trackLogin} />
                ) : (
                  <div className="tracking-result">
                    <div className="tracking-case-head">
                      <div><span className="status-pill"><span /> IN PROGRESS</span><h2>Your report is being reviewed</h2><p>Updates will appear here as your case progresses.</p></div>
                      <div className="tracking-case-id"><span>REPORT REFERENCE</span><strong>{report.id}</strong></div>
                    </div>
                    <div className="tracking-detail-strip"><span><small>Locality</small><strong>{report.locality}</strong></span><span><small>Police station</small><strong>{report.station}</strong></span><span><small>Filed on</small><strong>{report.createdAt}</strong></span></div>
                    <StatusTimeline />
                    <div className="demo-disclaimer"><LockKeyhole size={15} /> Demo experience: case details shown are simulated and are not connected to a police database.</div>
                  </div>
                )}
              </motion.section>
            )}
            {activeView === 'insights' && (
              <motion.section className="page-content" key="insights" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.24 }}>
                <div className="eyebrow"><span className="eyebrow-dot" /> COMMUNITY TRANSPARENCY</div>
                <h1>Public insights</h1>
                <p className="page-subtitle tracking-subtitle">An at-a-glance view of reporting activity across the city.</p>
                <AnalyticsDashboard />
              </motion.section>
            )}
          </AnimatePresence>
        </div>
        <footer className="app-footer"><span>© 2026 CivicShield Citizen Services</span><span><span className="footer-shield"><ShieldCheck size={14} /></span> A safer way to be heard <span className="footer-separator">·</span> <button onClick={() => changeView('insights')}>Privacy & transparency</button></span></footer>
      </main>

      <AnimatePresence>
        {otpOpen && <OtpModal onClose={() => setOtpOpen(false)} onVerified={completeFiling} />}
      </AnimatePresence>
    </div>
  )
}

function StatementStep({ onBack, onNext }) {
  const { statement, setStatement, statementLocked, lockStatement, addons, addAddon } = useFirStore()
  const [addonText, setAddonText] = useState('')
  const [addonError, setAddonError] = useState('')

  const continueToSecurity = (event) => {
    event.preventDefault()
    if (statement.trim().length < 20) return
    lockStatement()
    onNext()
  }

  const appendAddon = (event) => {
    event.preventDefault()
    if (!addonText.trim()) {
      setAddonError('Add a note before saving.')
      return
    }
    addAddon(addonText.trim())
    setAddonText('')
    setAddonError('')
  }

  return (
    <form className="form-card" onSubmit={continueToSecurity}>
      <div className="form-card-heading"><div><span className="section-kicker">STEP 02 · YOUR ACCOUNT</span><h2>Your statement</h2><p>Describe what happened in your own words. Include any details that feel important.</p></div><div className="section-icon"><FilePlus2 size={20} /></div></div>
      {statementLocked ? (
        <>
          <div className="locked-note"><LockKeyhole size={15} /><span><strong>Statement locked</strong> — your original account is preserved and cannot be edited.</span></div>
          <div className="locked-statement">{statement}</div>
          <div className="addons-title"><span className="addon-plus">+</span><div><strong>Modifications / add-ons</strong><p>Add new information separately without changing your original statement.</p></div></div>
          <label className="field-label" htmlFor="addon">Additional information <span className="optional">OPTIONAL</span></label>
          <textarea id="addon" className="form-input textarea-input" rows="3" placeholder="Add any new information you would like to include..." value={addonText} onChange={(event) => setAddonText(event.target.value)} />
          {addonError && <p className="field-error">{addonError}</p>}
          {addons.length > 0 && <div className="saved-addons">{addons.map((item, index) => <div className="saved-addon" key={`${index}-${item}`}><Check size={14} /><span>{item}</span></div>)}</div>}
          <button className="text-action" type="button" onClick={appendAddon}>+ Add this information</button>
        </>
      ) : (
        <>
          <label className="field-label" htmlFor="statement">Initial account <span className="required-star">*</span></label>
          <textarea id="statement" className="form-input statement-input" rows="7" placeholder="Tell us what happened. You can write in your own words — there's no need for legal language." value={statement} onChange={(event) => setStatement(event.target.value)} required minLength={20} />
          <div className="field-hint-row"><span>Include what happened, when, and anything you remember.</span><span>{statement.length} characters</span></div>
          <div className="statement-notice"><LockKeyhole size={16} /><span>After you continue, this statement is locked. You can still add new information separately.</span></div>
        </>
      )}
      <div className="form-actions"><button type="button" className="button button-secondary" onClick={onBack}><ArrowLeft size={16} /> Back</button><button type="submit" className="button button-primary">Continue <ArrowRight size={16} /></button></div>
    </form>
  )
}

function SecurityStep({ onBack, onNext }) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const { statement } = useFirStore()

  useEffect(() => {
    if (!playing) return undefined
    const timeout = window.setTimeout(() => {
      if (elapsed >= 48) setPlaying(false)
      else setElapsed(elapsed + 1)
    }, 1000)
    return () => window.clearTimeout(timeout)
  }, [elapsed, playing])

  return (
    <form className="form-card" onSubmit={(event) => { event.preventDefault(); onNext() }}>
      <div className="form-card-heading"><div><span className="section-kicker">STEP 03 · FINAL CHECK</span><h2>Review & secure</h2><p>Listen to your statement, then set a password to protect this report.</p></div><div className="section-icon"><Fingerprint size={20} /></div></div>
      <div className="audio-card">      <div className="audio-top"><div className="audio-art"><span /><span /><span /><span /><span /></div><div className="audio-copy"><strong>Recorded statement</strong><span>Audio preview · 00:{String(Math.floor(elapsed)).padStart(2, '0')} / 00:48</span></div><button className={`play-button ${playing ? 'is-playing' : ''}`} type="button" aria-label={playing ? 'Pause audio preview' : 'Play audio preview'} onClick={() => { if (elapsed >= 48) setElapsed(0); setPlaying(!playing) }}>{playing ? 'Ⅱ' : '▶'}</button></div><div className="audio-track"><span style={{ width: `${(elapsed / 48) * 100}%` }} /></div><div className="audio-bottom"><span>Preview your written account</span><span>{statement.trim().length > 0 ? 'Statement ready' : 'No recording available'}</span></div><div className="audio-transcript"><span>PREVIEW TRANSCRIPT</span><p>“{statement.trim() || 'Your written statement will appear here after you complete the previous step.'}”</p></div></div>
      <div className="password-panel"><div className="password-panel-icon"><LockKeyhole size={17} /></div><div className="password-panel-content"><strong>Set a report password</strong><p>Use this password with your verification code to access the tracking link.</p></div></div>
      <label className="field-label" htmlFor="report-password">Create password <span className="required-star">*</span></label>
      <div className="password-field"><input id="report-password" className="form-input" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" required minLength={8} autoComplete="new-password" /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></div>
      <p className="field-hint">Choose at least 8 characters. For this demo, your password is not sent or stored.</p>
      <div className="security-footnote"><ShieldCheck size={15} /> Your statement and password stay on this device in this frontend demo.</div>
      <div className="form-actions"><button type="button" className="button button-secondary" onClick={onBack}><ArrowLeft size={16} /> Back</button><button type="submit" className="button button-primary">Continue to verification <ArrowRight size={16} /></button></div>
    </form>
  )
}

function OtpStep({ onBack, onOpen }) {
  return (
    <div className="form-card otp-step-card">
      <div className="form-card-heading"><div><span className="section-kicker">STEP 04 · IDENTITY CHECK</span><h2>Verify your identity</h2><p>A one-time code helps protect access to your submitted report.</p></div><div className="section-icon"><LockKeyhole size={20} /></div></div>
      <div className="verification-summary"><div className="whatsapp-badge">W</div><div><span>Code will be sent to</span><strong>{WHATSAPP_NUMBER}</strong><small>Centralized demo WhatsApp number</small></div><span className="verified-indicator"><ShieldCheck size={18} /></span></div>
      <div className="demo-code-note"><span className="info-icon">i</span><span><strong>Frontend demo:</strong> use <code>123456</code> as the verification code. No message is sent.</span></div>
      <div className="privacy-note"><LockKeyhole size={15} /><span>Identity verification is simulated for this frontend-only experience.</span></div>
      <div className="form-actions"><button type="button" className="button button-secondary" onClick={onBack}><ArrowLeft size={16} /> Back</button><button type="button" className="button button-primary" onClick={onOpen}>Verify with WhatsApp <ArrowRight size={16} /></button></div>
    </div>
  )
}

function TrackingLogin({ trackId, setTrackId, onSubmit }) {
  const [loginError, setLoginError] = useState('')
  return (
    <form className="track-login-card" onSubmit={(event) => { event.preventDefault(); setLoginError(onSubmit(event)) }}>
      <div className="login-emblem"><LockKeyhole size={22} /></div>
      <h2>Secure case access</h2>
      <p>Enter the report reference from your secure tracking link, then verify with WhatsApp.</p>
      <label className="field-label" htmlFor="track-reference">Report reference</label>
      <input id="track-reference" className="form-input" value={trackId} onChange={(event) => setTrackId(event.target.value)} placeholder="e.g. FIR-2026-0842" required />
      <label className="field-label login-phone-label">Verification number</label>
      <div className="readonly-phone"><span className="whatsapp-badge small">W</span><span>{WHATSAPP_NUMBER}</span><span className="central-tag">CENTRAL NUMBER</span></div>
      <label className="field-label" htmlFor="track-otp">WhatsApp verification code</label>
      <input id="track-otp" name="track-otp" className="form-input" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" placeholder="Enter 6-digit code" required />
      {loginError && <p className="field-error" role="alert">{loginError}</p>}
      <div className="tracking-demo-hint">Demo code: <strong>123456</strong> · Try reference <strong>{useFirStore.getState().currentReport?.id ?? demoReport.id}</strong></div>
      <button type="submit" className="button button-primary login-submit">Access your report <ArrowRight size={16} /></button>
      <div className="login-privacy"><ShieldCheck size={14} /> Only you can access your report details.</div>
    </form>
  )
}

function SubmissionSuccess({ report, onTrack, onFileAnother }) {
  const [copied, setCopied] = useState(false)
  const trackingUrl = `${window.location.origin}/?view=track&case=${report?.id ?? 'FIR-2026-0842'}`
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(trackingUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Unable to copy the demo tracking link.', error)
      window.alert(`Copy this link: ${trackingUrl}`)
    }
  }

  return (
    <div className="success-view">
      <div className="success-check"><Check size={28} strokeWidth={2.5} /></div>
      <span className="section-kicker">SUBMISSION COMPLETE</span>
      <h1>Your report has been filed</h1>
      <p className="success-subtitle">Your information has been recorded in this demo. Keep your reference number safe for future updates.</p>
      <div className="submission-receipt">
        <div className="receipt-heading"><span><Check size={14} /> DATABASE UPDATE COMPLETE</span><span className="receipt-date">{report?.createdAt ?? 'Today'}</span></div>
        <div className="receipt-id-label">YOUR REPORT REFERENCE</div>
        <div className="receipt-id">{report?.id}</div>
        <div className="receipt-divider" />
        <div className="receipt-meta"><div><span>Police station</span><strong>{report?.station}</strong></div><div><span>Locality</span><strong>{report?.locality}</strong></div></div>
      </div>
      <div className="tracking-link-card"><div className="link-icon"><LockKeyhole size={17} /></div><div className="link-content"><strong>Your secure tracking link</strong><span>{trackingUrl}</span><small>Requires WhatsApp code to access · Demo only</small></div><button onClick={copyLink} className="copy-link-button">{copied ? <><Check size={14} /> Copied</> : 'Copy link'}</button></div>
      <div className="success-actions"><button className="button button-primary" onClick={onTrack}>Track your report <ArrowRight size={16} /></button><button className="button button-secondary" onClick={onFileAnother}>File another report</button></div>
      <p className="success-disclaimer"><ShieldCheck size={14} /> This is a frontend demonstration. No actual police report has been filed.</p>
    </div>
  )
}

export default App
