import { billingOverview } from '@/data/billingOverview'
import { FaMoneyBillWave, FaFileInvoice, FaExclamationTriangle } from 'react-icons/fa'

export default function BillingOverview() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Billing Overview</h2>

      {/* Total Revenue */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
        <div className="flex items-center gap-3 text-green-600">
          <FaMoneyBillWave className="text-xl" />
          <span className="font-medium text-gray-700">Total Revenue</span>
        </div>
        <span className="font-bold text-gray-900">{billingOverview.totalRevenue}</span>
      </div>

      {/* Pending Invoices */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
        <div className="flex items-center gap-3 text-blue-600">
          <FaFileInvoice className="text-xl" />
          <span className="font-medium text-gray-700">Pending Invoices</span>
        </div>
        <span className="font-semibold text-gray-800">{billingOverview.pendingInvoices}</span>
      </div>

      {/* Overdue Payments */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
        <div className="flex items-center gap-3 text-red-600">
          <FaExclamationTriangle className="text-xl" />
          <span className="font-medium text-gray-700">Overdue Payments</span>
        </div>
        <span className="font-semibold text-gray-800">{billingOverview.overduePayments}</span>
      </div>
    </div>
  )
}
