// FeeManagementContent.tsx
import React, { useState } from 'react'
import { DollarSign ,NotebookPen, Percent, Timer, CreditCard } from 'lucide-react'

const tabs = [
  { id: '/FeeStructureMaster', label: 'Fee Structure Master', icon: <DollarSign size={20} /> },
  { id: 'assignFees', label: 'Assign Fees to Students', icon: <NotebookPen size={20} /> },
  { id: 'discounts', label: 'Discounts & Concessions Setup', icon: <Percent size={20} /> },
  { id: 'fines', label: 'Fine & Late Payment Rules', icon: <Timer size={20} /> },
  { id: 'paymentModes', label: 'Payment Modes & Gateway Integration', icon: <CreditCard size={20} /> },
]

const FeeManagementContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('feeStructure')

  return (
    <div className="w-full p-4">
      {/* Tabs Header */}
      <div className="flex space-x-2 mb-4 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-3 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow">
        {activeTab === 'feeStructure' && <div>Fee Structure Master content goes here.</div>}
        {activeTab === 'assignFees' && <div>Assign Fees to Students content goes here.</div>}
        {activeTab === 'discounts' && <div>Discounts & Concessions Setup content goes here.</div>}
        {activeTab === 'fines' && <div>Fine & Late Payment Rules content goes here.</div>}
        {activeTab === 'paymentModes' && <div>Payment Modes & Gateway Integration content goes here.</div>}
      </div>
    </div>
  )
}

export default FeeManagementContent
