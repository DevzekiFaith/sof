"use client";

import { useState } from 'react';
import { useSMS } from '../../contexts/SMSContext';
import { MessageSquare, Phone, RefreshCw, Send, FileText } from 'lucide-react';

export default function SMSPage() {
  const { templates, ussdMenus, smsLogs, loading, sendSMS, sendUSSD, refreshData } = useSMS();
  const [activeTab, setActiveTab] = useState<'templates' | 'ussd' | 'logs'>('templates');
  const [showSendSMS, setShowSendSMS] = useState(false);
  const [showTestUSSD, setShowTestUSSD] = useState(false);

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-[#60a5fa]" />
            <h1 className="text-3xl md:text-4xl font-bold">SMS & USSD</h1>
          </div>
          <button
            onClick={refreshData}
            className="flex items-center gap-2 bg-[#282828] text-white px-4 py-2 rounded-lg hover:bg-[#333] transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-700 pb-4 flex-wrap">
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'templates' ? 'bg-[#60a5fa] text-black' : 'bg-[#282828] text-white hover:bg-[#333]'
            }`}
          >
            <FileText className="w-5 h-5" />
            SMS Templates
          </button>
          <button
            onClick={() => setActiveTab('ussd')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'ussd' ? 'bg-[#60a5fa] text-black' : 'bg-[#282828] text-white hover:bg-[#333]'
            }`}
          >
            <Phone className="w-5 h-5" />
            USSD Menus
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'logs' ? 'bg-[#60a5fa] text-black' : 'bg-[#282828] text-white hover:bg-[#333]'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            SMS Logs
          </button>
        </div>

        {/* Action Button */}
        {activeTab !== 'logs' && (
          <div className="mb-6">
            <button
              onClick={() => activeTab === 'templates' ? setShowSendSMS(true) : setShowTestUSSD(true)}
              className="flex items-center gap-2 bg-[#60a5fa] text-black px-4 py-2 rounded-lg hover:bg-[#60a5fa]/90 transition-colors"
            >
              <Send className="w-5 h-5" />
              {activeTab === 'templates' ? 'Send SMS' : 'Test USSD'}
            </button>
          </div>
        )}

        {/* SMS Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading templates...</div>
            ) : templates.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No SMS templates configured.</div>
            ) : (
              templates.map((template) => (
                <div key={template.id} className="bg-[#282828] p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                      <span className="px-2 py-1 bg-[#333] text-gray-300 rounded-full text-sm capitalize">{template.type}</span>
                    </div>
                  </div>
                  <div className="bg-[#333] p-4 rounded-lg mb-4">
                    <code className="text-sm text-gray-300">{template.template}</code>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {template.variables.map((variable, idx) => (
                      <span key={idx} className="px-2 py-1 bg-[#60a5fa]/20 text-[#60a5fa] rounded-full text-sm">
                        {variable}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* USSD Menus Tab */}
        {activeTab === 'ussd' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading USSD menus...</div>
            ) : ussdMenus.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No USSD menus configured.</div>
            ) : (
              ussdMenus.map((menu) => (
                <div key={menu.id} className="bg-[#282828] p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">{menu.title}</h3>
                  <div className="space-y-2">
                    {menu.options.map((option) => (
                      <div key={option.id} className="flex items-center gap-4 bg-[#333] p-3 rounded-lg">
                        <span className="w-8 h-8 bg-[#60a5fa] text-black rounded-full flex items-center justify-center font-bold">
                          {option.id}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium">{option.label}</p>
                          <p className="text-sm text-gray-400">Action: {option.action}</p>
                        </div>
                        {option.nextMenu && (
                          <span className="text-sm text-gray-400">→ {option.nextMenu}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* SMS Logs Tab */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading logs...</div>
            ) : smsLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No SMS logs yet.</div>
            ) : (
              smsLogs.map((log) => (
                <div key={log.id} className="bg-[#282828] p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          log.type === 'sent' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                        }`}>
                          {log.type}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          log.status === 'delivered' ? 'bg-[#60a5fa] text-black' :
                          log.status === 'pending' ? 'bg-yellow-500 text-black' :
                          'bg-red-500 text-white'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      <p className="text-gray-400 mb-2">To: {log.phoneNumber}</p>
                      <p className="text-sm">{log.message}</p>
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(log.sentAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Send SMS Modal */}
        {showSendSMS && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#282828] p-6 rounded-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Send SMS</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const variables: Record<string, string> = {};
                templates.find(t => t.id === formData.get('templateId'))?.variables.forEach(v => {
                  variables[v] = formData.get(v) as string;
                });
                sendSMS(
                  formData.get('phoneNumber') as string,
                  formData.get('templateId') as string,
                  variables
                );
                setShowSendSMS(false);
              }}>
                <div className="space-y-4">
                  <input
                    name="phoneNumber"
                    placeholder="Phone Number"
                    required
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
                  />
                  <select
                    name="templateId"
                    required
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
                  >
                    <option value="">Select Template</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <div className="text-sm text-gray-400">
                    <p className="mb-2">Template variables:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {templates.length > 0 && templates[0].variables.map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                    </ul>
                  </div>
                  {templates.length > 0 && templates[0].variables.map((v) => (
                    <input
                      key={v}
                      name={v}
                      placeholder={v}
                      required
                      className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
                    />
                  ))}
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowSendSMS(false)}
                    className="flex-1 px-4 py-2 bg-[#333] text-white rounded-lg hover:bg-[#444] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#60a5fa] text-black rounded-lg hover:bg-[#60a5fa]/90 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Test USSD Modal */}
        {showTestUSSD && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#282828] p-6 rounded-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Test USSD</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                sendUSSD(
                  formData.get('phoneNumber') as string,
                  formData.get('menuId') as string,
                  formData.get('optionId') as string
                );
                setShowTestUSSD(false);
              }}>
                <div className="space-y-4">
                  <input
                    name="phoneNumber"
                    placeholder="Phone Number"
                    required
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
                  />
                  <select
                    name="menuId"
                    required
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
                  >
                    <option value="">Select Menu</option>
                    {ussdMenus.map((m) => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                  <select
                    name="optionId"
                    required
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
                  >
                    <option value="">Select Option</option>
                    {ussdMenus.length > 0 && ussdMenus[0].options.map((opt) => (
                      <option key={opt.id} value={opt.id}>{opt.id} - {opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowTestUSSD(false)}
                    className="flex-1 px-4 py-2 bg-[#333] text-white rounded-lg hover:bg-[#444] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#60a5fa] text-black rounded-lg hover:bg-[#60a5fa]/90 transition-colors"
                  >
                    Test
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
