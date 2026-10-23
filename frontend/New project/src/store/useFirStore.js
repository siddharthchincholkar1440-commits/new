import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const WHATSAPP_NUMBER = '+91 98765 43210'

const initialDraft = {
  fullName: '',
  age: '',
  phone: '',
  address: '',
  locality: '',
  policeStation: '',
  incidentDate: '',
  incidentTime: '',
  incidentLocation: '',
  incidentDescription: '',
  files: [],
}

const initialSteps = [
  { title: 'Report received', description: 'Your report has been submitted successfully.', state: 'complete' },
  { title: 'Initial review', description: 'A duty officer will review the information provided.', state: 'current' },
  { title: 'Assigned to investigating officer', description: 'An officer will be assigned to your case.', state: 'upcoming' },
  { title: 'Investigation in progress', description: 'Relevant information is being verified.', state: 'upcoming' },
]

export const useFirStore = create(persist((set, get) => ({
  step: 0,
  draft: initialDraft,
  statement: '',
  statementLocked: false,
  addons: [],
  securityConfigured: false,
  currentReport: null,
  timeline: initialSteps,
  setStep: (step) => set({ step }),
  updateDraft: (field, value) => set((state) => ({ draft: { ...state.draft, [field]: value } })),
  setFiles: (files) => set((state) => ({ draft: { ...state.draft, files } })),
  setStatement: (statement) => set({ statement }),
  lockStatement: () => set({ statementLocked: true }),
  addAddon: (addon) => set((state) => ({ addons: [...state.addons, addon] })),
  setSecurityConfigured: (securityConfigured) => set({ securityConfigured }),
  submitReport: () => {
    const { draft } = get()
    const id = `FIR-2026-${String(Math.floor(1000 + Math.random() * 9000))}`
    const now = new Date()
    const report = {
      id,
      locality: draft.locality || 'Indiranagar',
      station: draft.policeStation || 'Indiranagar Police Station',
      createdAt: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Under review',
    }
    set({ currentReport: report, timeline: initialSteps })
  },
  resetDraft: () => set({
    step: 0,
    draft: { ...initialDraft, files: [] },
    statement: '',
    statementLocked: false,
    addons: [],
    securityConfigured: false,
    currentReport: null,
    timeline: initialSteps,
  }),
}), {
  name: 'civicshield-demo-report',
  storage: createJSONStorage(() => window.localStorage),
  partialize: (state) => ({ currentReport: state.currentReport, timeline: state.timeline }),
}))
