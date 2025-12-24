import React from 'react';
import { AppConfig } from '../types';
import { Settings, Globe, Lock, Key, Eye, Clock, MessageSquare } from 'lucide-react';

interface SidebarProps {
  config: AppConfig;
  isRunning: boolean;
  onConfigChange: (key: keyof AppConfig, value: string | number) => void;
}

interface InputGroupProps {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, icon: Icon, children }) => (
  <div className="mb-5">
    <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
      <Icon size={12} />
      {label}
    </label>
    {children}
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ config, isRunning, onConfigChange }) => {
  
  const styles = {
    input: "w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  };

  return (
    <div className="w-80 bg-gray-950 border-r border-gray-800 flex flex-col h-full">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Eye className="text-white" size={18} />
          </div>
          <div>
            <h1 className="font-bold text-gray-100 leading-tight">GradeGuard</h1>
            <p className="text-xs text-gray-500">Auto-Monitor Dashboard</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <InputGroup label="Target Configuration" icon={Globe}>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Portal Login URL"
              className={styles.input}
              value={config.portalUrl}
              onChange={(e) => onConfigChange('portalUrl', e.target.value)}
              disabled={isRunning}
            />
            <input
              type="text"
              placeholder="Grades Page URL"
              className={styles.input}
              value={config.gradePageUrl}
              onChange={(e) => onConfigChange('gradePageUrl', e.target.value)}
              disabled={isRunning}
            />
          </div>
        </InputGroup>

        <InputGroup label="Credentials" icon={Lock}>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Username / Student ID"
              className={styles.input}
              value={config.username}
              onChange={(e) => onConfigChange('username', e.target.value)}
              disabled={isRunning}
            />
            <input
              type="password"
              placeholder="Password"
              className={styles.input}
              value={config.password}
              onChange={(e) => onConfigChange('password', e.target.value)}
              disabled={isRunning}
            />
          </div>
        </InputGroup>

        <InputGroup label="Scraping Logic" icon={Key}>
          <input
            type="text"
            placeholder="Grade Element XPath"
            className={`${styles.input} font-mono text-xs`}
            value={config.xpath}
            onChange={(e) => onConfigChange('xpath', e.target.value)}
            disabled={isRunning}
          />
          <p className="text-[10px] text-gray-500 mt-1">
            Example: //span[@id='final-grade']
          </p>
        </InputGroup>

        <InputGroup label="Telegram Alerts" icon={MessageSquare}>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Bot Token"
              className={styles.input}
              value={config.botToken}
              onChange={(e) => onConfigChange('botToken', e.target.value)}
              disabled={isRunning}
            />
            <input
              type="text"
              placeholder="Chat ID"
              className={styles.input}
              value={config.chatId}
              onChange={(e) => onConfigChange('chatId', e.target.value)}
              disabled={isRunning}
            />
          </div>
        </InputGroup>

        <InputGroup label="Frequency" icon={Clock}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">{config.intervalMinutes} min</span>
            <span className="text-xs text-gray-500">Interval</span>
          </div>
          <input
            type="range"
            min="15"
            max="60"
            step="5"
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            value={config.intervalMinutes}
            onChange={(e) => onConfigChange('intervalMinutes', parseInt(e.target.value))}
            disabled={isRunning}
          />
          <p className="text-[10px] text-gray-500 mt-2 italic border-l-2 border-gray-700 pl-2">
            Wait time between checks to avoid IP bans.
          </p>
        </InputGroup>
      </div>

      <div className="p-4 border-t border-gray-800 text-xs text-center text-gray-600">
        v1.0.2 &bull; Selenium WebDriver
      </div>
    </div>
  );
};

export default Sidebar;