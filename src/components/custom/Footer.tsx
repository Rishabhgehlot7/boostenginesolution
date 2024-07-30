// src/components/Footer.js

import facebook from "@/public/icons/facebook.svg";
import github from "@/public/icons/github.svg";
import insta from "@/public/icons/insta.svg";
import twitter from "@/public/icons/twitter.svg";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="bg-[#03346E] text-white w-full h-auto">
      {/* Footer */}
      <div className="container mx-auto p-4">
        <div className="grid md:grid-cols-6 gap-6 grid-cols-2">
          <div className="col-span-2">
            <div className="text-3xl font-bold text-[#6EACDA] md:pb-5">
              Boost Engine
            </div>
            <p className="text-sm pb-5 md:pb-10">
              Accelerate your business with our cutting-edge technology
              solutions. Innovating the future, one step at a time.
            </p>
            <div className="flex gap-4">
              <Link href="https://twitter.com/boostengine">
                <Image src={twitter} alt="Twitter" width={24} height={24} />
              </Link>
              <Link href="https://facebook.com/boostengine">
                <Image src={facebook} alt="Facebook" width={24} height={24} />
              </Link>
              <Link href="https://instagram.com/boostengine">
                <Image src={insta} alt="Instagram" width={24} height={24} />
              </Link>
              <Link href="https://github.com/boostengine">
                <Image src={github} alt="GitHub" width={24} height={24} />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="uppercase font-bold">Company</h3>
            <ul>
              <li className="text-sm py-1">
                <Link href="/about">
                  About Us
                </Link>
              </li>
              <li className="text-sm py-1">
                <Link href="/services">
                  <div>Services</div>
                </Link>
              </li>
              <li className="text-sm py-1">
                <Link href="/portfolio">
                  <div>Portfolio</div>
                </Link>
              </li>
              <li className="text-sm py-1">
                <Link href="/careers">
                  <div>Careers</div>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="uppercase font-bold">Social</h3>
            <ul>
              <li className="text-sm py-1">
                <Link href="https://twitter.com/boostengine">
                  <div>Twitter</div>
                </Link>
              </li>
              <li className="text-sm py-1">
                <Link href="https://facebook.com/boostengine">
                  <div>Facebook</div>
                </Link>
              </li>
              <li className="text-sm py-1">
                <Link href="https://instagram.com/boostengine">
                  <div>Instagram</div>
                </Link>
              </li>
              <li className="text-sm py-1">
                <Link href="https://github.com/boostengine">
                  <div>GitHub</div>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="uppercase font-bold">Products</h3>
            <ul>
              <li className="text-sm py-1">
                <Link href="/products/software">
                  <div>Software Solutions</div>
                </Link>
              </li>
              <li className="text-sm py-1">
                <Link href="/products/consulting">
                  <div>Consulting Services</div>
                </Link>
              </li>
              <li className="text-sm py-1">
                <Link href="/products/support">
                  <div>Support & Maintenance</div>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="uppercase font-bold">Help</h3>
            <ul>
              <li className="text-sm py-1">
                <Link href="/terms">
                  <div>Terms of Service</div>
                </Link>
              </li>
              <li className="text-sm py-1">
                <Link href="/privacy">
                  <div>Privacy Policy</div>
                </Link>
              </li>
              <li className="text-sm py-1">
                <Link href="/refund">
                  <div>Refund Policy</div>
                </Link>
              </li>
              <li className="text-sm py-1">
                <Link href="/shipping">
                  <div>Shipping Policy</div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-4">
        <hr className="border-gray-600" />
      </div>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center flex-col md:flex-row gap-3">
          <p className="text-sm">
            Copyright 2024 Boost Engine, All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
