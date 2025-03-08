import React, { useEffect, useState } from 'react';
import { useAnalyticsStore } from '../store/analyticsStore';
import { useCreditStore } from '../store/creditStore';
import { BarChart2, Users, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { data, isLoading, fetchAnalytics } = useAnalyticsStore();
  const { allRequests, fetchAllRequests, approveRequest, denyRequest } = useCreditStore();
  const [activeTab, setActiveTab] = useState('analytics');

  useEffect(() => {
    fetchAnalytics();
    fetchAllRequests();
  }, [fetchAnalytics, fetchAllRequests]);

  const handleApproveRequest = (requestId: string) => {
    const success = approveRequest(requestId);
    if (success) {
      fetchAllRequests();
    }
  };

  const handleDenyRequest = (requestId: string) => {
    const success = denyRequest(requestId);
    if (success) {
      fetchAllRequests();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <BarChart2 className="h-8 w-8 text-indigo-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart2 className="inline mr-1" size={16} />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Clock className="inline mr-1" size={16} />
              Credit Requests
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'analytics' && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">System Analytics</h2>
              
              {isLoading ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">Loading analytics data...</p>
                </div>
              ) : data ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Users className="h-10 w-10 text-indigo-600 mr-3" />
                        <div>
                          <p className="text-sm text-indigo-600 font-medium">Total Users</p>
                          <p className="text-2xl font-bold text-indigo-900">{data.totalUsers}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-10 w-10 text-green-600 mr-3" />
                        <div>
                          <p className="text-sm text-green-600 font-medium">Total Documents</p>
                          <p className="text-2xl font-bold text-green-900">{data.totalDocuments}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <BarChart2 className="h-10 w-10 text-purple-600 mr-3" />
                        <div>
                          <p className="text-sm text-purple-600 font-medium">Scans Today</p>
                          <p className="text-2xl font-bold text-purple-900">{data.totalScansToday}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Top Users by Scans</h3>
                      {data.topUsers.length === 0 ? (
                        <p className="text-gray-500">No scan data available</p>
                      ) : (
                        <div className="space-y-3">
                          {data.topUsers.map((user, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                                {index + 1}
                              </div>
                              <div className="ml-3 flex-grow">
                                <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-indigo-600 h-2 rounded-full" 
                                    style={{ width: `${(user.scansToday / Math.max(...data.topUsers.map(u => u.scansToday))) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-sm font-medium text-gray-900">{user.scansToday}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Credit Usage</h3>
                      {data.creditUsage.length === 0 ? (
                        <p className="text-gray-500">No credit usage data available</p>
                      ) : (
                        <div className="space-y-3">
                          {data.creditUsage.map((user, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-medium">
                                {index + 1}
                              </div>
                              <div className="ml-3 flex-grow">
                                <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-600 h-2 rounded-full" 
                                    style={{ width: `${(user.creditsUsed / 20) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-sm font-medium text-gray-900">{user.creditsUsed}/20</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-4 md:col-span-2">
                      <h3 className="font-semibold text-gray-900 mb-3">Top Document Topics</h3>
                      {data.topDocumentTopics.length === 0 ? (
                        <p className="text-gray-500">No document topic data available</p>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          {data.topDocumentTopics.map((topic, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg text-center">
                              <div className="text-sm font-medium text-gray-900">{topic.topic}</div>
                              <div className="text-xs text-gray-500">{topic.count} occurrences</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No analytics data available</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'requests' && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Credit Requests</h2>
              
              {allRequests.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <Clock className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p>No credit requests to display</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reason
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {request.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {request.amount}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {request.reason.substring(0, 50)}
                            {request.reason.length > 50 && '...'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                request.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : request.status === 'denied'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleApproveRequest(request.id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Approve"
                                >
                                  <CheckCircle size={18} />
                                </button>
                                <button
                                  onClick={() => handleDenyRequest(request.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Deny"
                                >
                                  <XCircle size={18} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;