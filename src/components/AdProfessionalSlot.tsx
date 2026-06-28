import { useEffect, useRef } from 'react';

interface AdProfessionalSlotProps {
  type: 'banner' | 'container';
}

export default function AdProfessionalSlot({ type }: AdProfessionalSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    // Clear previous contents
    adRef.current.innerHTML = '';

    if (type === 'banner') {
      // 1. Create the config script
      const configScript = document.createElement('script');
      configScript.type = 'text/javascript';
      configScript.innerHTML = `
        atOptions = {
          'key' : '4e31ef4b87e0162dd556fe47d657c162',
          'format' : 'iframe',
          'height' : 60,
          'width' : 468,
          'params' : {}
        };
      `;
      adRef.current.appendChild(configScript);

      // 2. Create the invoke script
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = 'https://www.highperformanceformat.com/4e31ef4b87e0162dd556fe47d657c162/invoke.js';
      adRef.current.appendChild(invokeScript);
    } else if (type === 'container') {
      // 1. Create the container div
      const containerDiv = document.createElement('div');
      containerDiv.id = 'container-2d18609577a0d05dd55ea280d780113f';
      containerDiv.className = 'w-full flex items-center justify-center min-h-[80px]';
      adRef.current.appendChild(containerDiv);

      // 2. Create the invoke script
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.async = true;
      invokeScript.setAttribute('data-cfasync', 'false');
      invokeScript.src = 'https://pl30112261.effectivecpmnetwork.com/2d18609577a0d05dd55ea280d780113f/invoke.js';
      adRef.current.appendChild(invokeScript);
    }
  }, [type]);

  return (
    <div className="w-full flex flex-col items-center justify-center my-4 p-2 bg-slate-900/30 border border-slate-800/40 rounded-xl max-w-full overflow-hidden">
      <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1.5 select-none">
        Publicidad Patrocinada • Sponsor Ad
      </div>
      <div ref={adRef} className="w-full flex items-center justify-center overflow-hidden min-h-[60px]" />
    </div>
  );
}
