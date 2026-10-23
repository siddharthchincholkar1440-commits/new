import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, LockKeyhole, MessageCircle, ShieldCheck, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { WHATSAPP_NUMBER } from '../store/useFirStore.js'

function OtpModal({ onClose, onVerified }) {
  const [phase, setPhase] = useState('intro')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  const sendCode = () => {
    setError('')
    setPhase('verify')
    window.setTimeout(() => inputRef.current?.focus(), 100)
  }

  const verify = (event) => {
    event.preventDefault()
    if (otp !== '123456') {
      setError('That code doesn’t match. Please try again.')
      return
    }
    setError('')
    setLoading(true)
    window.setTimeout(onVerified, 1100)
  }

  return (
    <AnimatePresence>
      <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget && !loading) onClose() }}>
        <motion.div className="otp-modal" role="dialog" aria-modal="true" aria-labelledby="otp-title" initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} transition={{ duration: 0.2 }}>
          <button className="modal-close" aria-label="Close verification dialog" onClick={onClose} disabled={loading}><X size={18} /></button>
          {loading ? (
            <div className="otp-loading"><div className="loading-spinner" /><span className="section-kicker">SECURE SUBMISSION</span><h2>Recording your report</h2><p>Updating the demo database and preparing your tracking link…</p><div className="loading-steps"><span><CheckCircle2 size={15} /> Identity verified</span><span className="loading-current"><span className="mini-spinner" /> Saving report</span><span className="loading-muted">Create tracking link</span></div></div>
          ) : (
            <>
              <div className="modal-icon"><MessageCircle size={21} /></div>
              <span className="section-kicker">WHATSAPP VERIFICATION</span>
              <h2 id="otp-title">{phase === 'intro' ? 'Verify it’s you' : 'Enter your code'}</h2>
              {phase === 'intro' ? (
                <>
                  <p className="modal-description">We’ll send a one-time verification code to confirm your identity before submitting this report.</p>
                  <div className="modal-number-card"><span className="whatsapp-badge">W</span><div><small>CODE WILL BE SENT TO</small><strong>{WHATSAPP_NUMBER}</strong></div><ShieldCheck size={17} /></div>
                  <div className="modal-demo-hint"><span className="info-icon">i</span> <span><strong>Demo only:</strong> this app does not send a WhatsApp message. Use <code>123456</code>.</span></div>
                  <button className="button button-primary modal-primary" onClick={sendCode}>Send verification code <span className="whatsapp-button-icon">W</span></button>
                </>
              ) : (
                <form onSubmit={verify}>
                  <p className="modal-description">Enter the 6-digit code sent to <strong>{WHATSAPP_NUMBER}</strong>.</p>
                  <div className="otp-input-wrap"><input ref={inputRef} className="form-input otp-input" aria-label="Six-digit verification code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength="6" placeholder="· · · · · ·" value={otp} onChange={(event) => { setOtp(event.target.value.replace(/\D/g, '').slice(0, 6)); setError('') }} required /></div>
                  {error && <p className="field-error otp-error" role="alert">{error}</p>}
                  <div className="modal-demo-hint"><span className="info-icon">i</span> <span><strong>Demo code:</strong> <code>123456</code></span></div>
                  <button className="button button-primary modal-primary" type="submit" disabled={otp.length !== 6}>Verify & submit <LockKeyhole size={15} /></button>
                  <button className="resend-code" type="button" onClick={sendCode}>Resend code</button>
                </form>
              )}
              <div className="modal-security-note"><LockKeyhole size={14} /> Secure, private, and only for this report</div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default OtpModal
