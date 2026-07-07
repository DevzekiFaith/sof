"use client";

import { useState, useEffect } from "react";
import { Download, Trash2, Wifi, WifiOff, HardDrive, Play, Pause, X } from "lucide-react";
import { useOffline } from "../../contexts/OfflineContext";
import { useLanguage } from "../../contexts/LanguageContext";

export default function DownloadManager() {
  const { downloadedContent, isOnline, settings, usedStorage, removeContent, updateSettings } = useOffline();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDownload, setActiveDownload] = useState<string | null>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const storagePercentage = (usedStorage / (settings.maxStorage * 1024 * 1024)) * 100;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 md:bottom-4 md:right-4 bg-[#282828] hover:bg-[#333] text-white p-3 rounded-full shadow-lg z-40 transition-all"
        title={t('offline.settings')}
      >
        <Download className="w-5 h-5" />
        {downloadedContent.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#60a5fa] text-black text-xs font-bold rounded-full flex items-center justify-center">
            {downloadedContent.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-[#181818] rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl border border-[#282828]">
        {/* Header */}
        <div className="p-4 border-b border-[#282828] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#60a5fa]/10 rounded-full flex items-center justify-center">
              <Download className="w-5 h-5 text-[#60a5fa]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{t('offline.settings')}</h2>
              <div className="flex items-center gap-2 text-xs text-[#b3b3b3]">
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#b3b3b3] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Storage Info */}
        <div className="p-4 border-b border-[#282828]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-[#b3b3b3]">
              <HardDrive className="w-4 h-4" />
              <span>{formatBytes(usedStorage)} / {settings.maxStorage} MB</span>
            </div>
            <span className="text-sm text-[#60a5fa] font-bold">{Math.round(storagePercentage)}%</span>
          </div>
          <div className="w-full bg-[#282828] rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                storagePercentage > 90 ? 'bg-red-500' : storagePercentage > 70 ? 'bg-yellow-500' : 'bg-[#60a5fa]'
              }`}
              style={{ width: `${storagePercentage}%` }}
            />
          </div>
        </div>

        {/* Settings */}
        <div className="p-4 border-b border-[#282828] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">{t('offline.dataSaver')}</p>
              <p className="text-xs text-[#b3b3b3]">Reduce data usage</p>
            </div>
            <button
              onClick={() => updateSettings({ dataSaverMode: !settings.dataSaverMode })}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.dataSaverMode ? 'bg-[#60a5fa]' : 'bg-[#282828]'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.dataSaverMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">{t('offline.wifiOnly')}</p>
              <p className="text-xs text-[#b3b3b3]">Download only on WiFi</p>
            </div>
            <button
              onClick={() => updateSettings({ wifiOnly: !settings.wifiOnly })}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.wifiOnly ? 'bg-[#60a5fa]' : 'bg-[#282828]'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.wifiOnly ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Audio Only Mode</p>
              <p className="text-xs text-[#b3b3b3]">Skip videos, use audio</p>
            </div>
            <button
              onClick={() => updateSettings({ audioOnlyMode: !settings.audioOnlyMode })}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.audioOnlyMode ? 'bg-[#60a5fa]' : 'bg-[#282828]'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.audioOnlyMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Text Only Mode</p>
              <p className="text-xs text-[#b3b3b3]">Minimal data usage</p>
            </div>
            <button
              onClick={() => updateSettings({ textOnlyMode: !settings.textOnlyMode })}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.textOnlyMode ? 'bg-[#60a5fa]' : 'bg-[#282828]'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.textOnlyMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Downloaded Content */}
        <div className="p-4">
          <h3 className="text-sm font-bold text-white mb-3">Downloaded Content ({downloadedContent.length})</h3>
          {downloadedContent.length === 0 ? (
            <div className="text-center py-8 text-[#b3b3b3]">
              <Download className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No content downloaded yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {downloadedContent.map((content) => (
                <div
                  key={content.id}
                  className="flex items-center gap-3 p-3 bg-[#282828] rounded-lg hover:bg-[#333] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{content.title}</p>
                    <div className="flex items-center gap-2 text-xs text-[#b3b3b3]">
                      <span>{formatBytes(content.size)}</span>
                      <span>•</span>
                      <span>{content.type}</span>
                      {content.isFullyDownloaded ? (
                        <span className="text-[#60a5fa]">• Ready</span>
                      ) : (
                        <span className="text-yellow-500">• {Math.round(content.progress)}%</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeContent(content.id)}
                    className="text-[#b3b3b3] hover:text-red-500 transition-colors p-2"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#282828]">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-3 bg-[#60a5fa] text-black font-bold rounded-full hover:bg-[#1db954] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
