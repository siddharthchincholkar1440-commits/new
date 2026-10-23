import { ArrowRight, CalendarDays, FileUp, MapPin, Paperclip, ShieldCheck, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { useFirStore } from '../store/useFirStore.js'

const localities = ['Indiranagar', 'Koramangala', 'Jayanagar', 'Whitefield', 'Malleshwaram', 'Other']
const today = new Date()
const maxIncidentDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

function RegistrationForm({ onNext }) {
  const { draft, updateDraft, setFiles } = useFirStore()
  const [fileError, setFileError] = useState('')
  const fileInput = useRef(null)

  const addFiles = (event) => {
    const selected = Array.from(event.target.files ?? [])
    const accepted = selected.filter((file) => file.type.startsWith('image/') || file.type === 'application/pdf')
    if (accepted.length !== selected.length) setFileError('Please choose images or PDF documents only.')
    else setFileError('')
    if (accepted.length) {
      setFiles([...draft.files, ...accepted.map((file) => ({ name: file.name, size: file.size }))])
    }
    event.target.value = ''
  }

  const removeFile = (fileIndex) => {
    setFiles(draft.files.filter((_, index) => index !== fileIndex))
  }

  const submit = (event) => {
    event.preventDefault()
    onNext()
  }

  const field = (name) => ({
    value: draft[name],
    onChange: (event) => updateDraft(name, event.target.value),
  })

  return (
    <form className="form-card" onSubmit={submit}>
      <div className="form-card-heading"><div><span className="section-kicker">STEP 01 · ABOUT THE INCIDENT</span><h2>Let’s start with the details</h2><p>Share a few details so we can direct your report to the right place.</p></div><div className="section-icon"><ShieldCheck size={20} /></div></div>
      <div className="form-section">
        <div className="form-section-title"><span className="section-number">01</span><div><h3>Personal details</h3><p>Your contact information will only be used for this report.</p></div></div>
        <div className="field-grid two-columns">
          <div className="field-group"><label className="field-label" htmlFor="full-name">Full name <span className="required-star">*</span></label><input className="form-input" id="full-name" autoComplete="name" placeholder="Enter your full name" required {...field('fullName')} /></div>
          <div className="field-group"><label className="field-label" htmlFor="phone">Contact number <span className="required-star">*</span></label><div className="phone-input"><span>+91</span><input className="form-input" id="phone" type="tel" autoComplete="tel-national" inputMode="numeric" pattern="[0-9]{10}" placeholder="10-digit mobile number" required {...field('phone')} /></div></div>
          <div className="field-group"><label className="field-label" htmlFor="age">Age <span className="optional">OPTIONAL</span></label><input className="form-input" id="age" type="number" min="1" max="120" placeholder="Your age" {...field('age')} /></div>
          <div className="field-group"><label className="field-label" htmlFor="locality">Locality <span className="required-star">*</span></label><select className="form-input" id="locality" required {...field('locality')}><option value="">Select your locality</option>{localities.map((locality) => <option key={locality}>{locality}</option>)}</select></div>
          <div className="field-group field-wide"><label className="field-label" htmlFor="address">Residential address <span className="required-star">*</span></label><input className="form-input" id="address" autoComplete="street-address" placeholder="Building, street, area" required {...field('address')} /></div>
        </div>
      </div>
      <div className="section-rule" />
      <div className="form-section">
        <div className="form-section-title"><span className="section-number">02</span><div><h3>Incident details</h3><p>When and where did the incident take place?</p></div></div>
        <div className="field-grid two-columns">
          <div className="field-group"><label className="field-label" htmlFor="incident-date">Date of incident <span className="required-star">*</span></label><div className="input-with-icon"><CalendarDays size={16} /><input className="form-input" id="incident-date" type="date" max={maxIncidentDate} required {...field('incidentDate')} /></div></div>
          <div className="field-group"><label className="field-label" htmlFor="incident-time">Approx. time <span className="optional">OPTIONAL</span></label><input className="form-input" id="incident-time" type="time" {...field('incidentTime')} /></div>
          <div className="field-group field-wide"><label className="field-label" htmlFor="incident-location">Location of incident <span className="required-star">*</span></label><div className="input-with-icon"><MapPin size={16} /><input className="form-input" id="incident-location" placeholder="Street, landmark or nearby area" required {...field('incidentLocation')} /></div></div>
          <div className="field-group field-wide"><label className="field-label" htmlFor="incident-description">Brief description <span className="required-star">*</span></label><textarea className="form-input textarea-input" id="incident-description" rows="3" placeholder="A brief summary will help prepare your statement." required {...field('incidentDescription')} /></div>
        </div>
      </div>
      <div className="section-rule" />
      <div className="form-section">
        <div className="form-section-title"><span className="section-number">03</span><div><h3>Supporting documents</h3><p>Add photos or documents that may help with your report.</p></div></div>
        <button type="button" className="upload-zone" onClick={() => fileInput.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const transfer = event.dataTransfer; addFiles({ target: { files: transfer.files, value: '' } }) }}><span className="upload-icon"><FileUp size={19} /></span><span><strong>Click to upload <span>or drag and drop</span></strong><small>Images or PDF · files are only simulated in this demo</small></span><Paperclip size={17} className="upload-paperclip" /></button>
        <input ref={fileInput} className="sr-only" type="file" accept="image/*,.pdf,application/pdf" multiple onChange={addFiles} aria-label="Upload supporting documents" />
        {fileError && <p className="field-error">{fileError}</p>}
        {draft.files.length > 0 && <div className="file-list">{draft.files.map((file, index) => <div className="file-row" key={`${file.name}-${index}`}><span className="file-type-icon"><Paperclip size={15} /></span><span className="file-name">{file.name}<small>{(file.size / 1024).toFixed(0)} KB · demo file</small></span><button type="button" aria-label={`Remove ${file.name}`} onClick={() => removeFile(index)}><Trash2 size={15} /></button></div>)}</div>}
      </div>
      <div className="form-assurance"><ShieldCheck size={16} /><span>Your details are treated confidentially. Fields marked <span className="required-star">*</span> are required.</span><button type="button" className="text-action assurance-action" onClick={() => window.alert('This frontend demo does not connect to a real police service.')}>How we protect you</button></div>
      <div className="form-actions"><span className="required-hint"><span className="required-star">*</span> Required fields</span><button type="submit" className="button button-primary">Continue to statement <ArrowRight size={16} /></button></div>
    </form>
  )
}

export default RegistrationForm
