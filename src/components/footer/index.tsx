import React from 'react';
import Image from 'next/image';
import { Instagram, X, Facebook } from 'lucide-react';
import { LogoCompra } from '@/assets';



const Footer: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 px-12">
      <div className="mt-10 flex flex-col gap-3 justify-center items-center">
        <Image src={LogoCompra} alt="Logo" width={100} height={100}></Image>
        <div className="flex gap-3 item-center justify-center">
          <Instagram></Instagram>
          <X></X>
          <Facebook></Facebook>
        </div>
      </div>
      <div className="w-full border border-black "></div>
      <div className="flex justify-between items-center">
        <p>2025 All rights reserved.</p>
        <div className="flex gap-4 mb-4">
          <p>Privacy Policy</p>
          <p>Terms of Service</p>
          <p>Cookies Settings</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;