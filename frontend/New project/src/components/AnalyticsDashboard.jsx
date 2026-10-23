import { ArrowDownRight, ArrowUpRight, BarChart3, MapPin, ShieldCheck } from 'lucide-react'

const localityReports = [
  { name: 'Indiranagar', count: 48, color: 'green' },
  { name: 'Koramangala', count: 36, color: 'mint' },
  { name: 'Jayanagar', count: 29, color: 'blue' },
  { name: 'Whitefield', count: 24, color: 'gold' },
  { name: 'Malleshwaram', count: 18, color: 'purple' },
]

const stationReports = [
  { name: 'Indiranagar Police Station', count: 48, change: '+12%', color: 'green' },
  { name: 'Koramangala Police Station', count: 36, change: '+8%', color: 'mint' },
  { name: 'Jayanagar Police Station', count: 29, change: '-3%', color: 'blue' },
  { name: 'Whitefield Police Station', count: 24, change: '+5%', color: 'gold' },
]

function AnalyticsDashboard() {
  const maxCount = Math.max(...localityReports.map((item) => item.count))

  return (
    <div className="analytics-dashboard">
      <div className="insights-disclaimer"><ShieldCheck size={16} /><span><strong>Public data overview</strong> — aggregated sample figures for this frontend demo.</span><span className="sample-data-badge">SAMPLE DATA</span></div>
      <div className="stat-grid">
        <div className="stat-card"><span className="stat-icon green"><BarChart3 size={18} /></span><span className="stat-label">Reports filed</span><strong>1,284</strong><span className="stat-change positive"><ArrowUpRight size={14} /> 8.2% <span>vs. last month</span></span></div>
        <div className="stat-card"><span className="stat-icon blue"><MapPin size={18} /></span><span className="stat-label">Localities covered</span><strong>24</strong><span className="stat-context">Across Bengaluru</span></div>
        <div className="stat-card"><span className="stat-icon amber"><ShieldCheck size={18} /></span><span className="stat-label">Police stations</span><strong>18</strong><span className="stat-context">Receiving reports</span></div>
        <div className="stat-card"><span className="stat-icon lilac"><BarChart3 size={18} /></span><span className="stat-label">Avg. first review</span><strong>2.4 <small>days</small></strong><span className="stat-change positive"><ArrowDownRight size={14} /> 0.6 days <span>faster</span></span></div>
      </div>
      <div className="analytics-grid">
        <section className="analytics-card locality-chart">
          <div className="analytics-card-heading"><div><span className="section-kicker">REPORT ACTIVITY</span><h2>Reports by locality</h2></div><button className="period-selector" type="button">Last 30 days <span>⌄</span></button></div>
          <div className="bar-chart" role="img" aria-label="Bar chart of sample reports by locality">
            <div className="chart-y-axis"><span>50</span><span>40</span><span>30</span><span>20</span><span>10</span><span>0</span></div>
            <div className="chart-bars">{localityReports.map((item) => <div className="bar-column" key={item.name}><span className="bar-value" style={{ bottom: `${(item.count / maxCount) * 100 + 3}%` }}>{item.count}</span><div className={`chart-bar ${item.color}`} style={{ height: `${(item.count / maxCount) * 100}%` }} /><span className="bar-label">{item.name}</span></div>)}</div>
          </div>
          <div className="chart-caption"><span className="legend-dot" /> Number of filed reports <span className="caption-total">155 reports shown</span></div>
        </section>
        <section className="analytics-card station-chart">
          <div className="analytics-card-heading"><div><span className="section-kicker">BY POLICE STATION</span><h2>Station overview</h2></div><span className="station-total">This month</span></div>
          <div className="station-list">{stationReports.map((station) => <div className="station-row" key={station.name}><span className={`station-dot ${station.color}`} /><div className="station-name-count"><strong>{station.name}</strong><span>{station.count} reports</span><div className="station-progress"><span className={station.color} style={{ width: `${(station.count / 48) * 100}%` }} /></div></div><span className={`station-change ${station.change.startsWith('-') ? 'negative' : ''}`}>{station.change.startsWith('-') ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}{station.change}</span></div>)}</div>
          <button className="view-all-stations" type="button" onClick={() => window.alert('Station data shown here is sample data for this demo.')}>View all 18 stations <span>→</span></button>
        </section>
      </div>
      <div className="analytics-footnote"><ShieldCheck size={14} /><span>Figures are anonymized sample data for demonstration purposes and do not represent official crime statistics.</span></div>
    </div>
  )
}

export default AnalyticsDashboard
