import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import materialService from '../services/materialService';
import materialTrackingService from '../services/materialTrackingService';
import { useProject } from '../context/ProjectContext';

const CircularProgress = ({ value, total, color }) => {
  const radius = 36;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = total > 0 ? value / total : 0;
  const strokeDashoffset = circumference - percent * circumference;
  return (
    <svg height={radius * 2} width={radius * 2} style={{ display: 'block', margin: '0 auto' }}>
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        style={{ transition: 'stroke-dashoffset 0.5s' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="1.1em"
        fill={color}
        fontWeight="bold"
      >
        {value}/{total}
      </text>
    </svg>
  );
};

const MaterialTrackingDetails = () => {
  const { particularName } = useParams();
  const navigate = useNavigate();
  const { selectedProject } = useProject();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [materialsRes, trackingRes] = await Promise.all([
          materialService.getAll(selectedProject?.id),
          materialTrackingService.getAll(selectedProject?.id)
        ]);

        const materials = Array.isArray(materialsRes?.data) ? materialsRes.data : [];
        const trackingEntries = Array.isArray(trackingRes?.data) ? trackingRes.data : [];

        const materialMap = materials.reduce((acc, m) => {
          const id = m?.id;
          if (id !== undefined && id !== null) {
            acc[id] = m?.particulars || '';
          }
          return acc;
        }, {});

        const merged = trackingEntries.map((entry) => ({
          ...entry,
          particulars: materialMap?.[entry?.material_id] || '',
          received: entry?.received_quantity || 0,
          consumed: entry?.consumed_quantity || 0
        }));

        if (isMounted) setEntries(merged);
      } catch (e) {
        console.error('Failed to load material tracking:', e);
        if (isMounted) setError(e?.message || 'Failed to load material tracking');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [selectedProject?.id]);

  // Get all transactions for this particular
  const txns = useMemo(() => {
    const target = (particularName || '').toLowerCase();
    return (Array.isArray(entries) ? entries : []).filter((en) => {
      const p = (en?.particulars || '').toLowerCase();
      return p === target;
    });
  }, [entries, particularName]);

  // Compute analytics
  let totalReceived = 0, totalConsumed = 0;
  txns.forEach(txn => {
    if (txn.received) totalReceived += Number(txn.received);
    if (txn.consumed) totalConsumed += Number(txn.consumed);
    if (txn.amount && !txn.received) totalReceived += Number(txn.amount);
    if (txn.paid && !txn.consumed) totalConsumed += Number(txn.paid);
  });
  const totalEstimated = 100; // TODO: Replace with actual estimate if available
  const remaining = totalReceived - totalConsumed;

  // In the analytics cards section, use safe values:
  const safeConsumed = Math.min(totalConsumed, totalEstimated);
  const safeReceived = Math.min(totalReceived, totalEstimated);
  const safeRemaining = Math.max(Math.min(remaining, totalEstimated), 0);
  const percentConsumed = totalEstimated > 0 ? Math.round((safeConsumed / totalEstimated) * 100) : 0;
  const percentReceived = totalEstimated > 0 ? Math.round((safeReceived / totalEstimated) * 100) : 0;
  const percentRemaining = totalEstimated > 0 ? Math.round((safeRemaining / totalEstimated) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <button onClick={() => navigate(-1)} className="mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">&larr; Back</button>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-md p-4 text-center text-white" style={{ background: 'linear-gradient(135deg, #f87171 60%, #fca5a5 100%)' }}>
          <div className="text-lg font-bold mb-2">Total Consumed / Total Estimated</div>
          <CircularProgress value={safeConsumed} total={totalEstimated} color="#ef4444" />
          <div className="mt-2 text-lg font-bold text-[#ef4444] bg-white rounded-full inline-block px-3 py-1">{percentConsumed}%</div>
        </div>
        <div className="rounded-md p-4 text-center text-white" style={{ background: 'linear-gradient(135deg, #4ade80 60%, #bbf7d0 100%)' }}>
          <div className="text-lg font-bold mb-2">Total Received / Total Estimated</div>
          <CircularProgress value={safeReceived} total={totalEstimated} color="#22c55e" />
          <div className="mt-2 text-lg font-bold text-[#22c55e] bg-white rounded-full inline-block px-3 py-1">{percentReceived}%</div>
        </div>
        <div className="rounded-md p-4 text-center text-white" style={{ background: 'linear-gradient(135deg, #60a5fa 60%, #bfdbfe 100%)' }}>
          <div className="text-lg font-bold mb-2">Remaining In Stock</div>
          <CircularProgress value={safeRemaining} total={totalEstimated} color="#3b82f6" />
          <div className="mt-2 text-lg font-bold text-[#3b82f6] bg-white rounded-full inline-block px-3 py-1">{percentRemaining}%</div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Material Tracking List &gt; {particularName}</h3>
          </div>
        </div>
        {error ? (
          <div className="px-4 py-3 text-sm text-red-600">{error}</div>
        ) : null}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">NO.</th>
                <th className="px-6 py-3">Particulars</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Received</th>
                <th className="px-6 py-3">Consumed</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-6 py-6 text-center text-gray-500" colSpan={5}>Loading...</td>
                </tr>
              ) : (
                txns.map((txn, idx) => (
                  <tr key={`${txn?.id ?? 'row'}-${idx}`}>
                    <td className="px-6 py-4">{String(idx+1).padStart(2, '0')}</td>
                    <td className="px-6 py-4 text-red-600 font-bold">{txn.particulars}</td>
                    <td className="px-6 py-4">{txn.date}</td>
                    <td className="px-6 py-4">{txn.received || '-'}</td>
                    <td className="px-6 py-4">{txn.consumed || '-'}</td>
                  </tr>
                ))
              )}
              <tr className="bg-gray-50 font-semibold">
                <td className="px-6 py-4" colSpan={3}>Total</td>
                <td className="px-6 py-4">{totalReceived}</td>
                <td className="px-6 py-4">{totalConsumed}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MaterialTrackingDetails;