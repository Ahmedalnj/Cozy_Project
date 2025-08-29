"use client";

import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Logo from "./navbar/Logo";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Logo />
            <p className="text-gray-400 text-sm leading-relaxed">
              منصة رائدة في مجال حجز العقارات السياحية في ليبيا. نقدم أفضل تجربة إقامة لعملائنا الكرام.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <a href="/properties" className="text-gray-400 hover:text-white transition-colors">
                  جميع العقارات
                </a>
              </li>
              <li>
                <a href="/favorites" className="text-gray-400 hover:text-white transition-colors">
                  المفضلة
                </a>
              </li>
              <li>
                <a href="/trips" className="text-gray-400 hover:text-white transition-colors">
                  رحلاتي
                </a>
              </li>
              <li>
                <a href="/reservations" className="text-gray-400 hover:text-white transition-colors">
                  الحجوزات
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">الدعم</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  مركز المساعدة
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  سياسة الخصوصية
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  شروط الاستخدام
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  الإبلاغ عن مشكلة
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">تواصل معنا</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <FaPhone className="w-4 h-4" />
                <span className="text-sm">+218 91 234 5678</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <FaEnvelope className="w-4 h-4" />
                <span className="text-sm">info@cozy-libya.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <FaMapMarkerAlt className="w-4 h-4" />
                <span className="text-sm">طرابلس، ليبيا</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Cozy Libya. جميع الحقوق محفوظة.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                العربية
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                English
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
