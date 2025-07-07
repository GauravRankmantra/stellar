"use client";
import { Facebook, Phone, Mail, Instagram, MessageCircle } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact Us" },
];

const Footer = () => {

  const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3444.094688359275!2d78.0460299!3d30.319824399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390929caf86b89cf%3A0xf9252bb4392a1458!2sPAE%20Construction%20India%20(OPC)%20Pvt.%20Ltd.(Pal%20Architect%20And%20Engineer)!5e0!3m2!1sen!2sin!4v1751612072916!5m2!1sen!2sin" 
  return (
    <footer className="bg-gray-950 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-4 md:px-10">
        {/* Logo & Name */}
        <div>
          <img
            src="/images/logo.svg"
            alt="PAE Construction"
            className="h-16 mb-3"
          />
          <h2 className="text-xl font-semibold">
            PAE CONSTRUCTION INDIAN OPC PVT LTD.
          </h2>
          <p className="text-sm mt-2">
            Building your dreams with strength and integrity.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-white transition">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <p className="text-sm">
            7/2/1 Convent Road, Near SBI Main Branch
            <br />
            Dehradun, Uttarakhand-248001
          </p>
          <p className="mt-2 text-sm">
            <Phone className="inline mr-2" size={16} />
            0135-4099051, 7895872139, 9412143346
          </p>
          <p className="text-sm mt-2">
            <Mail className="inline mr-2" size={16} />
            <a
              href="mailto:paeconstructionindian@gmail.com"
              className="hover:text-white transition"
            >
              paeconstructionindian@gmail.com
            </a>
          </p>
          <div className="flex gap-4 mt-4">
            {/* Instagram */}
            <a
              href="https://instagram.com/pae.construction"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram size={24} className="hover:text-white transition" />
            </a>
            {/* Facebook */}
            <a
              href="https://facebook.com/constructionpae"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook size={24} className="hover:text-white transition" />
            </a>

            {/* WhatsApp (Add your WhatsApp number/link here) */}
            <a
              href="https://wa.me/917895872139"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              {" "}
              {/* Replace with your actual WhatsApp number */}
              <MessageCircle
                size={24}
                className="hover:text-white transition"
              />
            </a>
            {/* Add more social media icons as needed */}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Find Us on Map</h3>
          <div className="rounded-lg overflow-hidden h-48 w-full">
            {" "}
            {/* Adjust height as needed */}
            <iframe
              src={googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              aria-label="Google Map location of PAE Construction"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-10">
        © {new Date().getFullYear()} PAE Construction Indian OPC Pvt. Ltd. All
        rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
