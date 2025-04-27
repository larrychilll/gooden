import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface AdPlacementProps {
  adClient: string;
  adSlot: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
}

const AdPlacement: React.FC<AdPlacementProps> = ({ adClient, adSlot, format = 'auto' }) => {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    fetchAdSenseStatus();
  }, []);

  const fetchAdSenseStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'adsense')
        .single();

      if (error) throw error;
      setIsEnabled(data?.value?.enabled ?? false);
    } catch (error) {
      console.error('Error fetching AdSense status:', error);
      setIsEnabled(false);
    }
  };

  useEffect(() => {
    if (isEnabled) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('Error loading AdSense ad:', error);
      }
    }
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
};

export default AdPlacement;