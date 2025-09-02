
"use client";
import { useEffect } from "react";

export function useIframeHeight(targetOrigin: string = "*") {
  useEffect(() => {
    const sendHeight = () => {
      // Garante que o código rode apenas no cliente
      if (typeof window !== 'undefined') {
        const height = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight,
          document.body.clientHeight,
          document.documentElement.clientHeight
        );
        
        window.parent.postMessage({ type: "ARKAN_SOLAR_CALC_RESIZE", height }, targetOrigin);
      }
    };

    // Função para ser chamada manualmente
    (window as any).sendIframeHeight = sendHeight;

    // Envia a altura inicial
    // Um timeout garante que a renderização inicial terminou
    const initialTimeout = setTimeout(sendHeight, 100);

    // Adiciona listeners para mudanças
    window.addEventListener("resize", sendHeight);
    
    // ResizeObserver é mais robusto para mudanças de conteúdo dinâmico
    const resizeObserver = new ResizeObserver(sendHeight);
    resizeObserver.observe(document.body);

    // Limpeza ao desmontar
    return () => {
      clearTimeout(initialTimeout);
      window.removeEventListener("resize", sendHeight);
      resizeObserver.disconnect();
      delete (window as any).sendIframeHeight;
    };
  }, [targetOrigin]);
}
