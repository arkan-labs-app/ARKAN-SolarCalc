
"use client";
import { useEffect } from "react";

export function useIframeHeight(postToOrigin: string = "*") {
  useEffect(() => {
    const send = () => {
      const h = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      window.parent?.postMessage({ type: "IFRAME_HEIGHT", height: h }, postToOrigin);
    };

    // envia na carga
    send();

    // envia em resize
    const onResize = () => send();
    window.addEventListener("resize", onResize);

    // envia em mudanças de layout
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(send);
      ro.observe(document.body);
    }

    // expõe para chamar manualmente (ex.: ao trocar de etapa)
    (window as any).sendIframeHeight = send;

    return () => {
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, [postToOrigin]);
}
