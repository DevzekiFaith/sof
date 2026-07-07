"use client";

import { Download, FileText, Video, ExternalLink, Check } from "lucide-react";
import { Resource } from "../../data/courses";

interface DownloadableResourceProps {
  resource: Resource;
  onDownload?: (resource: Resource) => void;
}

export default function DownloadableResource({ resource, onDownload }: DownloadableResourceProps) {
  const handleDownload = () => {
    if (resource.downloadable && resource.content) {
      // Create a downloadable file from the content
      const blob = new Blob([resource.content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resource.name.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      if (onDownload) onDownload(resource);
    } else if (resource.url && resource.url !== '#') {
      // Open external link in new tab
      window.open(resource.url, '_blank');
    }
  };

  const getIcon = () => {
    switch (resource.type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      case 'template':
      case 'exercise':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeLabel = () => {
    switch (resource.type) {
      case 'video':
        return 'Video';
      case 'pdf':
        return 'PDF';
      case 'article':
        return 'Article';
      case 'template':
        return 'Template';
      case 'exercise':
        return 'Exercise';
      case 'download':
        return 'Download';
      default:
        return 'Resource';
    }
  };

  return (
    <div className="group bg-[#282828] hover:bg-[#333] rounded-lg p-4 transition-all duration-300 border border-transparent hover:border-[#60a5fa]/30">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#60a5fa]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#60a5fa]/20 transition-colors">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-white font-semibold text-sm truncate">{resource.name}</h4>
            {resource.downloadable && (
              <span className="px-2 py-0.5 bg-[#60a5fa]/20 text-[#60a5fa] text-xs font-bold rounded-full">
                Downloadable
              </span>
            )}
          </div>
          <p className="text-xs text-[#b3b3b3] mb-2">{getTypeLabel()}</p>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 text-xs text-[#60a5fa] hover:text-white transition-colors font-medium"
          >
            {resource.downloadable ? (
              <>
                <Download className="w-4 h-4" />
                Download
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                Open
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
