import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdPlacement {
  id: string;
  name: string;
  location: string;
  ad_client: string;
  ad_slot: string;
  format: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  status: 'active' | 'paused' | 'archived';
}

const AdSenseManager: React.FC = () => {
  const [placements, setPlacements] = useState<AdPlacement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    ad_client: '',
    ad_slot: '',
    format: 'auto' as const,
    status: 'active' as const
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // Fetch ad placements
      const { data: placementsData, error: placementsError } = await supabase
        .from('ad_placements')
        .select('*')
        .order('created_at', { ascending: false });

      if (placementsError) throw placementsError;
      setPlacements(placementsData || []);

      // Fetch global AdSense status
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'adsense')
        .single();

      if (settingsError) throw settingsError;
      setIsEnabled(settingsData?.value?.enabled ?? false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }

  async function toggleAdSense() {
    try {
      const newValue = !isEnabled;
      const { error } = await supabase
        .from('site_settings')
        .update({ value: { enabled: newValue } })
        .eq('key', 'adsense');

      if (error) throw error;
      setIsEnabled(newValue);
    } catch (error) {
      console.error('Error toggling AdSense:', error);
      setError(error instanceof Error ? error.message : 'Failed to toggle AdSense');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('ad_placements')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ad_placements')
          .insert([formData]);

        if (error) throw error;
      }

      setEditingId(null);
      setFormData({
        name: '',
        location: '',
        ad_client: '',
        ad_slot: '',
        format: 'auto',
        status: 'active'
      });
      fetchData();
    } catch (error) {
      console.error('Error saving ad placement:', error);
      setError(error instanceof Error ? error.message : 'Failed to save ad placement');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this ad placement?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('ad_placements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error deleting ad placement:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete ad placement');
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(placement: AdPlacement) {
    setEditingId(placement.id);
    setFormData({
      name: placement.name,
      location: placement.location,
      ad_client: placement.ad_client,
      ad_slot: placement.ad_slot,
      format: placement.format,
      status: placement.status
    });
  }

  if (loading && !editingId) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">AdSense Management</h2>
          <button
            onClick={toggleAdSense}
            className="flex items-center px-4 py-2 rounded-lg border transition-colors duration-200"
            title={isEnabled ? 'Disable AdSense' : 'Enable AdSense'}
          >
            {isEnabled ? (
              <>
                <ToggleRight className="w-6 h-6 text-green-600 mr-2" />
                <span className="text-green-600">AdSense Enabled</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-6 h-6 text-gray-400 mr-2" />
                <span className="text-gray-400">AdSense Disabled</span>
              </>
            )}
          </button>
        </div>
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>

      {/* Ad Placement Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {editingId ? 'Edit Ad Placement' : 'Add New Ad Placement'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ad Client</label>
            <input
              type="text"
              value={formData.ad_client}
              onChange={(e) => setFormData({ ...formData, ad_client: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ad Slot</label>
            <input
              type="text"
              value={formData.ad_slot}
              onChange={(e) => setFormData({ ...formData, ad_slot: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Format</label>
            <select
              value={formData.format}
              onChange={(e) => setFormData({ ...formData, format: e.target.value as AdPlacement['format'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="auto">Auto</option>
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
              <option value="rectangle">Rectangle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as AdPlacement['status'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name: '',
                  location: '',
                  ad_client: '',
                  ad_slot: '',
                  format: 'auto',
                  status: 'active'
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : editingId ? (
              'Update Placement'
            ) : (
              'Add Placement'
            )}
          </button>
        </div>
      </form>

      {/* Ad Placements List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {placements.map((placement) => (
              <tr key={placement.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{placement.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{placement.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{placement.format}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    placement.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : placement.status === 'paused'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {placement.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(placement)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(placement.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdSenseManager;