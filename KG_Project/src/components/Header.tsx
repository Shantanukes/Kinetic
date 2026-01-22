// Header Component

import React, { useMemo, useState } from 'react';
import { Search, Sun, Moon, Bell, User, ChevronDown, LogOut } from 'lucide-react';
import { MenuItem } from '../types';

interface HeaderProps {
  darkMode: boolean;
  notifications: number;
  showUserMenu: boolean;
  currentPage: string;
  menuItems: MenuItem[];
  userRole: string;
  username?: string;
  setDarkMode: (mode: boolean) => void;
  setCurrentPage: (page: string) => void;
  setShowUserMenu: (show: boolean) => void;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  darkMode,
  notifications,
  showUserMenu,
  currentPage,
  menuItems,
  userRole,
  username,
  setDarkMode,
  setCurrentPage,
  setShowUserMenu,
  handleLogout
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const searchableItems = useMemo(() => {
    const items: { id: string; label: string }[] = [];
    menuItems.forEach(item => {
      items.push({ id: item.id, label: item.label });
      if (item.subItems) {
        item.subItems.forEach(sub => items.push({ id: sub.id, label: sub.label }));
      }
    });
    return items;
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return searchableItems.filter(item => item.label.toLowerCase().includes(term));
  }, [searchTerm, searchableItems]);

  const handleSelect = (id: string) => {
    setCurrentPage(id);
    setSearchTerm('');
    setSearchOpen(false);
  };
  const getDisplayName = () => {
    switch (userRole) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'OEM': return 'OEM';
      case 'RND': return 'Research';
      case 'DEALER': return 'Dealer';
      case 'SERVICE': return 'Service';
      case 'FLEET': return 'Fleet Manager';
      case 'USER': return 'End User';
      default: return 'User';
    }
  }

  const getDisplayRole = () => {
    switch (userRole) {
      case 'SUPER_ADMIN': return 'System Administrator';
      case 'OEM': return 'OEM Partner';
      case 'RND': return 'Research Department';
      case 'DEALER': return 'Dealer Partner';
      case 'SERVICE': return 'Service Engineer';
      case 'FLEET': return 'Fleet Manager';
      case 'USER': return 'Valued Customer';
      default: return 'Kinetic Green';
    }
  }

  return (
    <header className={`sticky top-0 z-30 ${
      darkMode 
        ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50' 
        : 'bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg'
    }`}>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4 flex-1">
          <h1 className={`text-2xl font-bold bg-gradient-to-r ${
            darkMode 
              ? 'from-white to-gray-300' 
              : 'from-gray-900 to-gray-700'
          } bg-clip-text text-transparent`}>
            {menuItems.find(m => m.id === currentPage)?.label || 'Dashboard'}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => {
                setTimeout(() => setSearchOpen(false), 150);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && filteredItems.length > 0) {
                  handleSelect(filteredItems[0].id);
                }
              }}
              className={`pl-10 pr-4 py-2.5 rounded-xl border transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:bg-gray-750' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:bg-white'
              } focus:ring-2 focus:ring-green-500 focus:border-green-500 w-64 shadow-sm`}
            />
            {searchOpen && filteredItems.length > 0 && (
              <div className={`absolute mt-2 w-full rounded-lg shadow-lg border z-40 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                {filteredItems.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    className={`w-full text-left px-4 py-2 text-sm cursor-pointer transition ${darkMode ? 'text-gray-100 hover:bg-gray-700' : 'text-gray-700 hover:bg-blue-50'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="relative">
            <button className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} relative`}>
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                darkMode 
                  ? 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 border border-gray-700' 
                  : 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200'
              } shadow-lg hover:shadow-xl`}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-left hidden md:block">
                <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {username || getDisplayName()}
                </p>
                <p className="text-xs text-gray-500 uppercase">{getDisplayRole()}</p>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showUserMenu && (
              <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center space-x-2 px-4 py-3 hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-white' : ''} rounded-lg`}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
