import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
        <div className="text-text-secondary">
          Configure your Free Fruit experience
        </div>
      </div>

      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <SettingsIcon size={24} className="text-primary" />
          <h2 className="text-xl font-semibold text-text-primary">App Preferences</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <h3 className="text-text-primary font-medium">Push Notifications</h3>
              <p className="text-text-secondary text-sm">Get notified about new projections</p>
            </div>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <h3 className="text-text-primary font-medium">Auto Refresh</h3>
              <p className="text-text-secondary text-sm">Automatically update data every 5 minutes</p>
            </div>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="text-text-primary font-medium">Dark Mode</h3>
              <p className="text-text-secondary text-sm">Use dark theme (currently always on)</p>
            </div>
            <input type="checkbox" className="toggle" defaultChecked disabled />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;