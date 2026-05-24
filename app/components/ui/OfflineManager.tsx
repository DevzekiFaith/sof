"use client";

import { useOffline } from "../../contexts/OfflineContext";
import { useUser } from "../../contexts/UserContext";
import { Download, Trash2, Wifi, WifiOff, HardDrive, Settings, Crown, Lock } from "lucide-react";
import { useState } from "react";
import PaymentPromptModal from "./PaymentPromptModal";

export default function OfflineManager() {
  const { downloadedContent, isOnline, settings, usedStorage, removeContent, updateSettings, clearAllDownloads } = useOffline();
  const { isPremium, currentUser } = useUser();
  const [showSettings, setShowSettings] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const formatStorage = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const storagePercent = (usedStorage / (settings.maxStorage * 1024 * 1024)) * 100;
  const userIsPremium = isPremium();
  const isLoggedIn = currentUser !== null;

  const handleDownload = () => {
    if (!isLoggedIn) {
      setShowPaymentModal(true);
      return;
    }
    if (!userIsPremium) {
      setShowPaymentModal(true);
      return;
    }
  };

  return (
    <div className="bg-[#181818] p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-[#1ed760]" />
          Offline Content
          {!userIsPremium && (
            <div className="flex items-center gap-1 text-xs text-[#1ed760]">
              <Crown size={10} />
              <span>Premium</span>
            </div>
          )}
        </h3>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <div className="flex items-center gap-1 text-xs text-[#1ed760]">
              <Wifi size={14} />
              <span>Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-orange-400">
              <WifiOff size={14} />
              <span>Offline</span>
            </div>
          )}
          {userIsPremium && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-[#282828] rounded-full transition-colors"
            >
              <Settings size={16} className="text-[#b3b3b3]" />
            </button>
          )}
        </div>
      </div>

      {/* Storage Usage */}
      <div className="bg-[#282828] p-4 rounded-lg mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#1ed760]" />
            <span className="text-sm text-white">Storage Used</span>
          </div>
          <span className="text-sm text-[#b3b3b3]">{formatStorage(usedStorage)} / {settings.maxStorage} MB</span>
        </div>
        <div className="w-full bg-[#121212] rounded-full h-2">
          <div
            className={`h-full rounded-full transition-all ${storagePercent > 90 ? 'bg-red-500' : storagePercent > 70 ? 'bg-yellow-500' : 'bg-[#1ed760]'}`}
            style={{ width: `${Math.min(storagePercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && userIsPremium && (
        <div className="bg-[#282828] p-4 rounded-lg mb-4">
          <h4 className="text-sm font-bold text-white mb-3">Download Settings</h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-[#b3b3b3]">Auto-download enrolled courses</span>
              <input
                type="checkbox"
                checked={settings.autoDownload}
                onChange={(e) => updateSettings({ autoDownload: e.target.checked })}
                className="w-4 h-4 accent-[#1ed760]"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-[#b3b3b3]">WiFi only downloads</span>
              <input
                type="checkbox"
                checked={settings.wifiOnly}
                onChange={(e) => updateSettings({ wifiOnly: e.target.checked })}
                className="w-4 h-4 accent-[#1ed760]"
              />
            </label>
            <div>
              <label className="text-sm text-[#b3b3b3] block mb-1">Max Storage (MB)</label>
              <input
                type="number"
                value={settings.maxStorage}
                onChange={(e) => updateSettings({ maxStorage: parseInt(e.target.value) || 500 })}
                className="w-full bg-[#121212] border border-[#3f3f3f] rounded px-3 py-2 text-sm text-white"
                min="100"
                max="2000"
                step="100"
              />
            </div>
            <div>
              <label className="text-sm text-[#b3b3b3] block mb-1">Download Quality</label>
              <select
                value={settings.downloadQuality}
                onChange={(e) => updateSettings({ downloadQuality: e.target.value as any })}
                className="w-full bg-[#121212] border border-[#3f3f3f] rounded px-3 py-2 text-sm text-white"
              >
                <option value="low">Low (faster, less storage)</option>
                <option value="medium">Medium (balanced)</option>
                <option value="high">High (best quality)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Downloaded Content */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#b3b3b3]">{downloadedContent.length} items downloaded</span>
          {downloadedContent.length > 0 && userIsPremium && (
            <button
              onClick={clearAllDownloads}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {!userIsPremium ? (
          <div className="text-center py-8">
            <Lock className="w-12 h-12 text-[#3f3f3f] mx-auto mb-2" />
            <p className="text-sm text-[#b3b3b3]">Offline downloads require Premium</p>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="mt-3 px-4 py-2 bg-[#1ed760] text-black font-bold rounded-full text-sm hover:scale-105 transition-transform"
            >
              Upgrade to Premium
            </button>
          </div>
        ) : downloadedContent.length === 0 ? (
          <div className="text-center py-8">
            <Download className="w-12 h-12 text-[#3f3f3f] mx-auto mb-2" />
            <p className="text-sm text-[#b3b3b3]">No content downloaded</p>
            <p className="text-xs text-[#b3b3b3] mt-1">Download courses to learn offline</p>
          </div>
        ) : (
          downloadedContent.map((content) => (
            <div
              key={content.id}
              className="flex items-center gap-3 p-3 bg-[#282828] rounded-lg group"
            >
              <div className="w-10 h-10 rounded bg-[#1ed760]/20 flex items-center justify-center">
                <Download className="w-5 h-5 text-[#1ed760]" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{content.title}</p>
                <div className="flex items-center gap-2 text-xs text-[#b3b3b3]">
                  <span className="capitalize">{content.type}</span>
                  <span>•</span>
                  <span>{formatStorage(content.size)}</span>
                  {!content.isFullyDownloaded && (
                    <>
                      <span>•</span>
                      <span className="text-[#1ed760]">{Math.round(content.progress)}%</span>
                    </>
                  )}
                </div>
                {!content.isFullyDownloaded && (
                  <div className="w-full bg-[#121212] rounded-full h-1 mt-1">
                    <div
                      className="h-full bg-[#1ed760] rounded-full transition-all"
                      style={{ width: `${content.progress}%` }}
                    />
                  </div>
                )}
              </div>

              <button
                onClick={() => removeContent(content.id)}
                className="p-2 hover:bg-[#333] rounded-full transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} className="text-red-400" />
              </button>
            </div>
          ))
        )}
      </div>

      <PaymentPromptModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        featureName="Offline Downloads"
        plan="premium"
      />
    </div>
  );
}
