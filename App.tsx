import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Square, Activity, Bell, RefreshCw, CheckCircle2 } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Terminal from './components/Terminal';
import StatsChart from './components/StatsChart';
import { AppConfig, LogEntry, LogLevel, MonitoringStats } from './types';

const App: React.FC = () => {
  // --- State ---
  const [config, setConfig] = useState<AppConfig>({
    portalUrl: 'https://university.portal.edu/login',
    gradePageUrl: 'https://university.portal.edu/student/grades',
    username: '',
    password: '',
    xpath: "//div[@class='final-score']/span",
    botToken: '',
    chatId: '',
    intervalMinutes: 15,
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<MonitoringStats>({
    lastChecked: null,
    currentGrade: null,
    status: 'IDLE',
    checksPerformed: 0,
    responseTimeHistory: [],
  });

  const timerRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);

  // --- Helpers ---
  const addLog = useCallback((message: string, level: LogLevel = LogLevel.INFO) => {
    const entry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      level,
      message,
    };
    setLogs((prev) => [...prev, entry]);
  }, []);

  const handleConfigChange = (key: keyof AppConfig, value: string | number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  // --- Simulation Logic (Mocking Selenium) ---
  const performCheck = useCallback(async () => {
    if (!isRunningRef.current) return;

    // Start Check Cycle
    const latency = Math.floor(Math.random() * 800) + 200; // Mock latency 200-1000ms
    const checkStartTime = Date.now();

    addLog(`Initiating check cycle #${stats.checksPerformed + 1}...`, LogLevel.INFO);
    
    try {
      // 1. Init Driver
      await new Promise(r => setTimeout(r, 600));
      addLog('Headless Chrome initialized (PID: 1394).', LogLevel.INFO);

      // 2. Navigate
      await new Promise(r => setTimeout(r, 800));
      addLog(`Navigating to ${config.portalUrl}`, LogLevel.INFO);

      // 3. Login
      if (!config.username || !config.password) {
        throw new Error("Credentials missing. Aborting.");
      }
      await new Promise(r => setTimeout(r, 1200));
      addLog('Login form submitted. Waiting for redirect...', LogLevel.INFO);
      addLog('Session authenticated successfully.', LogLevel.SUCCESS);

      // 4. Go to Grades
      await new Promise(r => setTimeout(r, 600));
      addLog(`Accessing Grade Page: ${config.gradePageUrl}`, LogLevel.INFO);

      // 5. Scrape XPath
      await new Promise(r => setTimeout(r, 400));
      addLog(`Locating element by XPath: ${config.xpath}`, LogLevel.INFO);

      // Mock Grade Result (Simulate a change occasionally)
      const possibleGrades = ['A', 'A', 'A', 'A-', 'B+']; // Weighted towards A
      const randomGrade = possibleGrades[Math.floor(Math.random() * possibleGrades.length)];
      
      const prevGrade = stats.currentGrade;
      
      if (prevGrade && prevGrade !== randomGrade) {
        addLog(`GRADE CHANGE DETECTED! Old: ${prevGrade} -> New: ${randomGrade}`, LogLevel.WARNING);
        
        // Mock Telegram
        if (config.botToken && config.chatId) {
            addLog(`Sending Telegram notification to Chat ID: ${config.chatId}...`, LogLevel.INFO);
            await new Promise(r => setTimeout(r, 500));
            addLog(`Notification sent successfully.`, LogLevel.SUCCESS);
        } else {
            addLog(`Telegram not configured. Skipping alert.`, LogLevel.WARNING);
        }

      } else {
        addLog(`Value extracted: "${randomGrade}". No change detected.`, LogLevel.INFO);
      }

      // Update Stats
      const finalLatency = Date.now() - checkStartTime;
      setStats(prev => ({
        ...prev,
        lastChecked: new Date(),
        currentGrade: randomGrade,
        checksPerformed: prev.checksPerformed + 1,
        responseTimeHistory: [...prev.responseTimeHistory, { 
          time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }), 
          latency: finalLatency 
        }].slice(-20) // Keep last 20
      }));

    } catch (error: any) {
      addLog(`Error during execution: ${error.message}`, LogLevel.ERROR);
      // Don't stop on error, just log it, mimicking a robust service
    }

    addLog(`Cycle complete. Sleeping for ${config.intervalMinutes} minutes.`, LogLevel.INFO);

  }, [config, stats.checksPerformed, stats.currentGrade, addLog]);

  // --- Interval Management ---
  useEffect(() => {
    if (stats.status === 'RUNNING') {
        isRunningRef.current = true;
        
        // Immediate first run
        performCheck();

        // Set interval (Using seconds instead of minutes for Demo purposes if needed, 
        // but let's respect the "minutes" variable in a real app. 
        // For this DEMO app, I will speed it up significantly: 1 minute = 5 seconds)
        // NOTE: In a real app, this would be `config.intervalMinutes * 60 * 1000`
        const DEMO_MULTIPLIER = 5000; 
        const intervalTime = Math.max(5000, config.intervalMinutes * 1000); // Fast simulation

        timerRef.current = window.setInterval(() => {
            performCheck();
        }, intervalTime);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            isRunningRef.current = false;
        };
    } else {
        isRunningRef.current = false;
        if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [stats.status, config.intervalMinutes, performCheck]);

  const toggleRunning = () => {
    if (stats.status === 'RUNNING') {
      setStats(prev => ({ ...prev, status: 'IDLE' }));
      addLog('Process stopped by user.', LogLevel.WARNING);
    } else {
      if (!config.username || !config.password) {
        addLog('Cannot start: Username and Password required.', LogLevel.ERROR);
        return;
      }
      setStats(prev => ({ ...prev, status: 'RUNNING' }));
      addLog('Monitoring service started.', LogLevel.SUCCESS);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden text-gray-200">
      {/* Left Sidebar */}
      <Sidebar 
        config={config} 
        onConfigChange={handleConfigChange} 
        isRunning={stats.status === 'RUNNING'} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-900 min-w-0">
        
        {/* Header / Top Stats */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 border-b border-gray-800 bg-gray-950">
            {/* Status Card */}
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex items-center justify-between shadow-sm">
                <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">System Status</p>
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${stats.status === 'RUNNING' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`}></span>
                        <span className={`font-mono font-bold ${stats.status === 'RUNNING' ? 'text-emerald-400' : 'text-gray-400'}`}>
                            {stats.status}
                        </span>
                    </div>
                </div>
                <Activity className={stats.status === 'RUNNING' ? 'text-emerald-500/50' : 'text-gray-700'} size={24} />
            </div>

            {/* Last Check Card */}
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex items-center justify-between shadow-sm">
                <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Last Checked</p>
                    <p className="font-mono text-gray-200 text-sm">
                        {stats.lastChecked ? stats.lastChecked.toLocaleTimeString() : '--:--:--'}
                    </p>
                </div>
                <RefreshCw className={stats.status === 'RUNNING' ? 'animate-spin text-blue-500/50' : 'text-gray-700'} size={24} />
            </div>

            {/* Current Grade Card */}
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex items-center justify-between shadow-sm col-span-2 md:col-span-2">
                <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Current Grade Value</p>
                    <p className="text-2xl font-bold text-white tracking-tight">
                        {stats.currentGrade || 'Waiting for data...'}
                    </p>
                </div>
                <CheckCircle2 className="text-purple-500/50" size={32} />
            </div>
        </div>

        {/* Middle Content - Chart & Controls */}
        <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
            
            {/* Chart Section */}
            <div className="lg:col-span-2 flex flex-col bg-gray-950 border border-gray-800 rounded-lg p-4 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                        <Activity size={14} />
                        Latency History
                    </h3>
                    <span className="text-xs text-gray-600 bg-gray-900 px-2 py-1 rounded border border-gray-800">
                        {stats.responseTimeHistory.length > 0 
                            ? `${stats.responseTimeHistory[stats.responseTimeHistory.length - 1].latency}ms` 
                            : '0ms'
                        }
                    </span>
                </div>
                <div className="flex-1 min-h-0">
                    <StatsChart data={stats.responseTimeHistory} />
                </div>
            </div>

            {/* Controls Section */}
            <div className="flex flex-col gap-4">
                <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 shadow-xl flex-1 flex flex-col justify-center items-center text-center space-y-4">
                    <div className="p-4 bg-gray-900 rounded-full border border-gray-800">
                         <Bell className={stats.status === 'RUNNING' ? "text-yellow-500" : "text-gray-600"} size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-200">Control Panel</h3>
                        <p className="text-sm text-gray-500 mt-1">Manage the Selenium process</p>
                    </div>
                    
                    <button
                        onClick={toggleRunning}
                        className={`w-full py-3 px-6 rounded-md font-semibold flex items-center justify-center gap-2 transition-all ${
                            stats.status === 'RUNNING'
                            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/50'
                            : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/50'
                        }`}
                    >
                        {stats.status === 'RUNNING' ? (
                            <>
                                <Square size={18} fill="currentColor" /> Stop Monitor
                            </>
                        ) : (
                            <>
                                <Play size={18} fill="currentColor" /> Start Monitor
                            </>
                        )}
                    </button>
                    {stats.status === 'RUNNING' && (
                        <p className="text-xs text-green-500/80 animate-pulse">
                            Thread Active: PID {Math.floor(Math.random() * 9000) + 1000}
                        </p>
                    )}
                </div>
            </div>
        </div>

        {/* Bottom Terminal */}
        <div className="h-1/3 min-h-[250px] p-6 pt-0">
             <Terminal logs={logs} onClear={() => setLogs([])} />
        </div>

      </div>
    </div>
  );
};

export default App;