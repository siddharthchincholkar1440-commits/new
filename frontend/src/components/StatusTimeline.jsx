import { Check, Circle, Clock3 } from 'lucide-react'
import { useFirStore } from '../store/useFirStore.js'

function StatusTimeline() {
  const timeline = useFirStore((state) => state.timeline)

  return (
    <section className="timeline-section" aria-label="Report status timeline">
      <div className="timeline-header"><div><span className="section-kicker">CASE PROGRESS</span><h3>Current working stages</h3></div><span className="last-updated"><Clock3 size={14} /> Updated just now</span></div>
      <div className="timeline">
        {timeline.map((item, index) => (
          <div className={`timeline-item ${item.state}`} key={item.title}>
            <div className="timeline-marker">{item.state === 'complete' ? <Check size={14} /> : item.state === 'current' ? <span /> : <Circle size={11} />}</div>
            {index < timeline.length - 1 && <div className="timeline-line" />}
            <div className="timeline-content"><div className="timeline-title-row"><h4>{item.title}</h4>{item.state === 'current' && <span className="stage-status">IN PROGRESS</span>}</div><p>{item.description}</p></div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default StatusTimeline
