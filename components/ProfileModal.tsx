
import React, { useState } from 'react';
import { X, User, Mail, Phone, Settings, Save, Edit3, ShieldCheck } from 'lucide-react';
import { UserProfile, OddsFormat } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, profile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#16191f] w-full max-w-lg rounded-3xl border border-[#262b35] shadow-2xl overflow-hidden relative">
        <div className="p-6 border-b border-[#262b35] flex justify-between items-center bg-[#1a1d23]">
          <h2 className="text-xl font-black italic uppercase">User <span className="text-yellow-400">Profile</span></h2>
          <button onClick={onClose} className="p-2 hover:bg-[#262b35] rounded-full text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Profile Header */}
          <div className="flex items-center gap-4 p-4 bg-[#262b35]/30 rounded-2xl border border-[#262b35]">
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-black">
              <User size={40} weight="bold" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{profile.fullName}</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Member Since: {profile.memberSince}</p>
              <div className="flex items-center gap-1 mt-1 text-green-500 text-[10px] font-bold">
                <ShieldCheck size={12} /> VERIFIED ACCOUNT
              </div>
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="ml-auto p-2 bg-yellow-400/10 text-yellow-400 rounded-xl hover:bg-yellow-400 hover:text-black transition-all"
              >
                <Edit3 size={20} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Info */}
            <div className="space-y-4 col-span-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Personal Details</h4>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full bg-[#0f1115] border ${isEditing ? 'border-yellow-400/50' : 'border-[#262b35]'} rounded-xl py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full bg-[#0f1115] border ${isEditing ? 'border-yellow-400/50' : 'border-[#262b35]'} rounded-xl py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full bg-[#0f1115] border ${isEditing ? 'border-yellow-400/50' : 'border-[#262b35]'} rounded-xl py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all`}
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-4 col-span-2 pt-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Betting Preferences</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Odds Format</label>
                  <div className="relative">
                    <Settings className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <select
                      name="oddsFormat"
                      value={formData.oddsFormat}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full bg-[#0f1115] border ${isEditing ? 'border-yellow-400/50' : 'border-[#262b35]'} rounded-xl py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all appearance-none cursor-pointer`}
                    >
                      <option value="Decimal">Decimal (2.50)</option>
                      <option value="Fractional">Fractional (3/2)</option>
                      <option value="American">American (+150)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Language</label>
                  <div className="relative">
                    <Settings className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full bg-[#0f1115] border ${isEditing ? 'border-yellow-400/50' : 'border-[#262b35]'} rounded-xl py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all appearance-none cursor-pointer`}
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Spanish">Spanish</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="p-6 bg-[#1a1d23] border-t border-[#262b35] flex gap-3">
            <button 
              onClick={() => { setIsEditing(false); setFormData(profile); }}
              className="flex-1 py-3 rounded-xl border border-[#262b35] font-bold text-sm hover:bg-[#262b35] transition-all"
            >
              CANCEL
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 py-3 bg-yellow-400 text-black rounded-xl font-bold text-sm hover:bg-yellow-300 transition-all flex items-center justify-center gap-2"
            >
              <Save size={18} />
              SAVE CHANGES
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
