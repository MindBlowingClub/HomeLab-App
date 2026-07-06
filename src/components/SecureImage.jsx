import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Cache in memoria per evitare chiamate ripetute a storage.createSignedUrl per la stessa immagine
const signedUrlCache = new Map();

/**
 * Hook personalizzato per risolvere URL Supabase privati in Signed URL temporanei autorizzati.
 */
export const useSecureUrl = (url, expires = 3600) => {
  const [secureUrl, setSecureUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url) {
      setSecureUrl(null);
      return;
    }

    if (typeof url !== 'string' || url.startsWith('data:') || !url.includes('/storage/v1/object/')) {
      setSecureUrl(url);
      return;
    }

    // Controlla se abbiamo un URL già firmato e ancora valido in cache
    const cacheKey = `${url}_${expires}`;
    const cached = signedUrlCache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      setSecureUrl(cached.url);
      return;
    }

    let isMounted = true;
    const fetchSignedUrl = async () => {
      setLoading(true);
      try {
        const urlObj = new URL(url);
        // Rileva il bucket dal percorso dell'URL
        let bucketName = 'immobili-media';
        if (urlObj.pathname.includes('/immobili-documenti/')) {
          bucketName = 'immobili-documenti';
        }

        const pathParts = urlObj.pathname.split(`/${bucketName}/`);
        if (pathParts.length > 1) {
          const filePath = pathParts[1];
          const { data, error } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(filePath, expires);
          
          if (!error && data?.signedUrl && isMounted) {
            // Salva in cache (scade 60 secondi prima della scadenza reale per sicurezza)
            signedUrlCache.set(cacheKey, {
              url: data.signedUrl,
              expiry: Date.now() + (expires - 60) * 1000
            });
            setSecureUrl(data.signedUrl);
          } else if (isMounted) {
            setSecureUrl(url); // Fallback all'URL originale in caso di errore
          }
        } else if (isMounted) {
          setSecureUrl(url);
        }
      } catch (err) {
        console.error("Errore nel risolvere l'URL protetto:", err);
        if (isMounted) {
          setSecureUrl(url);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSignedUrl();

    return () => {
      isMounted = false;
    };
  }, [url, expires]);

  return { secureUrl, loading };
};

/**
 * Componente per renderizzare un tag <img> che carica le immagini in sicurezza tramite link firmato.
 */
export const SecureImage = ({ src, alt, className, style, ...props }) => {
  const { secureUrl, loading } = useSecureUrl(src);

  if (loading && !secureUrl) {
    // Renders a shimmer loading state
    return (
      <div 
        className={`${className} animate-pulse bg-gray-200/50 flex items-center justify-center`} 
        style={style}
      >
        <span className="text-gray-400 text-xs">Caricamento...</span>
      </div>
    );
  }

  return (
    <img 
      src={secureUrl || src} 
      alt={alt} 
      className={className} 
      style={style} 
      {...props} 
    />
  );
};

/**
 * Componente per renderizzare un <div> con un'immagine di sfondo protetta.
 */
export const SecureImageBackground = ({ url, className, style, children, ...props }) => {
  const { secureUrl } = useSecureUrl(url);

  const mergedStyle = {
    ...style,
    backgroundImage: secureUrl ? `url(${secureUrl})` : 'linear-gradient(to bottom right, #E5E5EA, #D2D2D7)'
  };

  return (
    <div 
      className={className} 
      style={mergedStyle} 
      {...props}
    >
      {children}
    </div>
  );
};
