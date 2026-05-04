'use client';

import { useState } from 'react';
import { Save, Store, Bell, Shield, CreditCard, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardSettingsPage() {
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'LUXE Store',
    storeEmail: 'hello@luxe.com',
    currency: 'USD',
    taxRate: '8',
    freeShippingThreshold: '100',
    shippingCost: '9.99',
    maintenanceMode: false,
  });

  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    newCustomers: false,
    reviews: true,
  });

  const [activeTab, setActiveTab] = useState('store');

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const tabs = [
    { id: 'store', label: 'Store', icon: Store },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'seo', label: 'SEO & Meta', icon: Globe },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-cream">Settings</h1>
        <p className="text-cream/40 mt-1">Configure your store preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  activeTab === tab.id
                    ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                    : 'text-cream/50 hover:text-cream hover:bg-white/5'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'store' && (
            <div className="card p-6 space-y-6">
              <h3 className="text-lg font-bold text-cream border-b border-white/5 pb-4">Store Configuration</h3>

              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 sm:col-span-1">
                  <label className="label">Store Name</label>
                  <input value={storeSettings.storeName}
                    onChange={e => setStoreSettings(s => ({ ...s, storeName: e.target.value }))}
                    className="input-field" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="label">Contact Email</label>
                  <input type="email" value={storeSettings.storeEmail}
                    onChange={e => setStoreSettings(s => ({ ...s, storeEmail: e.target.value }))}
                    className="input-field" />
                </div>
                <div>
                  <label className="label">Currency</label>
                  <select value={storeSettings.currency}
                    onChange={e => setStoreSettings(s => ({ ...s, currency: e.target.value }))}
                    className="input-field">
                    <option value="USD">USD — US Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                    <option value="GBP">GBP — British Pound</option>
                    <option value="BDT">BDT — Bangladeshi Taka</option>
                    <option value="INR">INR — Indian Rupee</option>
                  </select>
                </div>
                <div>
                  <label className="label">Tax Rate (%)</label>
                  <input type="number" step="0.1" value={storeSettings.taxRate}
                    onChange={e => setStoreSettings(s => ({ ...s, taxRate: e.target.value }))}
                    className="input-field" />
                </div>
                <div>
                  <label className="label">Free Shipping Threshold ($)</label>
                  <input type="number" value={storeSettings.freeShippingThreshold}
                    onChange={e => setStoreSettings(s => ({ ...s, freeShippingThreshold: e.target.value }))}
                    className="input-field" />
                </div>
                <div>
                  <label className="label">Default Shipping Cost ($)</label>
                  <input type="number" step="0.01" value={storeSettings.shippingCost}
                    onChange={e => setStoreSettings(s => ({ ...s, shippingCost: e.target.value }))}
                    className="input-field" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-ink rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-cream">Maintenance Mode</p>
                  <p className="text-xs text-cream/40">Temporarily close your store to customers</p>
                </div>
                <button
                  onClick={() => setStoreSettings(s => ({ ...s, maintenanceMode: !s.maintenanceMode }))}
                  className={`relative w-12 h-6 rounded-full transition-all ${storeSettings.maintenanceMode ? 'bg-brand-500' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${storeSettings.maintenanceMode ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-6 space-y-4">
              <h3 className="text-lg font-bold text-cream border-b border-white/5 pb-4">Notification Preferences</h3>
              {[
                { key: 'newOrders', label: 'New Orders', desc: 'Get notified when a customer places an order' },
                { key: 'lowStock', label: 'Low Stock Alerts', desc: 'Alert when product stock falls below threshold' },
                { key: 'newCustomers', label: 'New Registrations', desc: 'Notify when a new customer registers' },
                { key: 'reviews', label: 'Product Reviews', desc: 'Alert when customers leave reviews' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-ink rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-cream">{item.label}</p>
                    <p className="text-xs text-cream/40">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                    className={`relative w-12 h-6 rounded-full transition-all ${notifications[item.key as keyof typeof notifications] ? 'bg-brand-500' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notifications[item.key as keyof typeof notifications] ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card p-6 space-y-5">
              <h3 className="text-lg font-bold text-cream border-b border-white/5 pb-4">Security Settings</h3>
              <div>
                <label className="label">Current Password</label>
                <input type="password" placeholder="••••••••" className="input-field" />
              </div>
              <div>
                <label className="label">New Password</label>
                <input type="password" placeholder="••••••••" className="input-field" />
              </div>
              <div>
                <label className="label">Confirm New Password</label>
                <input type="password" placeholder="••••••••" className="input-field" />
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="card p-6 space-y-5">
              <h3 className="text-lg font-bold text-cream border-b border-white/5 pb-4">Payment Configuration</h3>
              <div>
                <label className="label">Stripe Publishable Key</label>
                <input type="password" defaultValue="pk_test_••••••••••••••••" className="input-field font-mono" />
              </div>
              <div>
                <label className="label">Stripe Secret Key</label>
                <input type="password" defaultValue="sk_test_••••••••••••••••" className="input-field font-mono" />
              </div>
              <div className="p-4 bg-ink rounded-xl border border-yellow-500/20">
                <p className="text-sm text-yellow-400 font-semibold mb-1">⚠️ Never expose secret keys</p>
                <p className="text-xs text-cream/40">Always store keys in environment variables. Never commit them to version control.</p>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="card p-6 space-y-5">
              <h3 className="text-lg font-bold text-cream border-b border-white/5 pb-4">SEO & Meta Tags</h3>
              <div>
                <label className="label">Site Title</label>
                <input defaultValue="LUXE — Premium eCommerce" className="input-field" />
              </div>
              <div>
                <label className="label">Meta Description</label>
                <textarea defaultValue="Discover curated premium products. Fast shipping, easy returns." rows={3} className="input-field resize-none" />
              </div>
              <div>
                <label className="label">Keywords</label>
                <input defaultValue="ecommerce, premium, luxury, shopping" className="input-field" />
              </div>
            </div>
          )}

          <div className="mt-4">
            <button onClick={handleSave} className="btn-primary">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
