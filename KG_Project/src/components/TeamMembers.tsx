import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  MoreVertical,
  Mail,
  Shield,
  Trash2,
  Edit2,
  X,
  UserPlus,
  Search
} from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  createdAt?: string;
}

interface TeamMembersProps {
  darkMode: boolean;
}

const TeamMembers: React.FC<TeamMembersProps> = ({ darkMode }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Viewer',
    status: 'Active' as 'Active' | 'Inactive'
  });

  // Available roles
  const roles = [
    'Super Admin',
    'Fleet Manager',
    'Operations Lead',
    'Service Manager',
    'Viewer'
  ];

  // ============================================
  // API INTEGRATION SECTION
  // ============================================

  // Fetch team members from API
  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      // TODO: Replace with your actual API endpoint
      // const response = await fetch('/api/team-members', {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      // const data = await response.json();
      // setTeamMembers(data);

      // Mock data for now
      const mockData: TeamMember[] = [
        { id: 1, name: 'Admin User', email: 'admin@kinetic.com', role: 'Super Admin', status: 'Active', lastLogin: 'Just now' },
        { id: 2, name: 'Rajesh Sharma', email: 'rajesh.s@kinetic.com', role: 'Fleet Manager', status: 'Active', lastLogin: '2 hours ago' },
        { id: 3, name: 'Priya Verma', email: 'priya.v@kinetic.com', role: 'Operations Lead', status: 'Active', lastLogin: '5 hours ago' },
        { id: 4, name: 'Amit Kumar', email: 'amit.k@kinetic.com', role: 'Viewer', status: 'Inactive', lastLogin: '3 days ago' },
      ];
      setTeamMembers(mockData);
    } catch (error) {
      console.error('Error fetching team members:', error);
      // TODO: Add error handling/notification
    } finally {
      setLoading(false);
    }
  };

  // Add new team member via API
  const addTeamMember = async () => {
    try {
      // TODO: Replace with your actual API endpoint
      // const response = await fetch('/api/team-members', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(formData)
      // });
      // const newMember = await response.json();

      // Mock implementation
      const newMember: TeamMember = {
        id: teamMembers.length + 1,
        ...formData,
        lastLogin: 'Never'
      };

      setTeamMembers([...teamMembers, newMember]);
      setShowAddModal(false);
      resetForm();
      // TODO: Add success notification
    } catch (error) {
      console.error('Error adding team member:', error);
      // TODO: Add error handling/notification
    }
  };

  // Update team member via API
  const updateTeamMember = async () => {
    if (!selectedMember) return;

    try {
      // TODO: Replace with your actual API endpoint
      // const response = await fetch(`/api/team-members/${selectedMember.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(formData)
      // });
      // const updatedMember = await response.json();

      // Mock implementation
      setTeamMembers(teamMembers.map(member =>
        member.id === selectedMember.id
          ? { ...member, ...formData }
          : member
      ));

      setShowEditModal(false);
      setSelectedMember(null);
      resetForm();
      // TODO: Add success notification
    } catch (error) {
      console.error('Error updating team member:', error);
      // TODO: Add error handling/notification
    }
  };

  // Delete team member via API
  const deleteTeamMember = async (id: number) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;

    try {
      // TODO: Replace with your actual API endpoint
      // await fetch(`/api/team-members/${id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });

      // Mock implementation
      setTeamMembers(teamMembers.filter(member => member.id !== id));
      // TODO: Add success notification
    } catch (error) {
      console.error('Error deleting team member:', error);
      // TODO: Add error handling/notification
    }
  };

  // ============================================
  // END API INTEGRATION SECTION
  // ============================================

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'Viewer',
      status: 'Active'
    });
  };

  const openEditModal = (member: TeamMember) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      status: member.status
    });
    setShowEditModal(true);
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Team Management
          </h3>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your organization's team members and their roles
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Member
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${darkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>

      {/* Team Members Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`text-left border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`p-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Name</th>
                <th className={`p-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Role</th>
                <th className={`p-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Status</th>
                <th className={`p-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Last Login</th>
                <th className={`p-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <Users className={`mx-auto mb-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} size={48} />
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {searchQuery ? 'No team members found' : 'No team members yet'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className={`border-b last:border-0 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <td className="p-4">
                      <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{member.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail size={12} />
                        {member.email}
                      </div>
                    </td>
                    <td className={`p-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-center gap-2">
                        <Shield size={16} className="text-blue-500" />
                        {member.role}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${member.status === 'Active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className={`p-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{member.lastLogin}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(member)}
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 transition"
                          title="Edit member"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteTeamMember(member.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400 transition"
                          title="Remove member"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Add Team Member
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full p-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full p-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  placeholder="john@kinetic.com"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={`w-full p-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                  className={`w-full p-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAddModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Cancel
              </button>
              <button
                onClick={addTeamMember}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Edit Team Member
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full p-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full p-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={`w-full p-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                  className={`w-full p-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowEditModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Cancel
              </button>
              <button
                onClick={updateTeamMember}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Update Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
