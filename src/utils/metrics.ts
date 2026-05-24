import type { AppData, AdminMetric } from '../types'

export function computeMetrics(data: AppData): AdminMetric {
  const completedConsultations = data.consultations.filter((item) => item.status === 'FINALIZED').length
  const appointmentsThisMonth = data.appointments.length
  const teleconsultations = data.teleconsultations.length
  const prescriptionsDispensed = data.prescriptions.filter((item) => item.status === 'DISPENSED').length
  const lowStockAlerts = data.stockItems.filter((item) => item.status === 'LOW').length
  const campaignsActive = data.campaigns.filter((item) => item.status === 'ACTIVE' || item.status === 'PUBLISHED').length

  return {
    appointmentsThisMonth,
    completedConsultations,
    teleconsultations,
    prescriptionsDispensed,
    lowStockAlerts,
    staffingGaps: 2,
    campaignsActive,
  }
}
