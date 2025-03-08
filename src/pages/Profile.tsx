import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useDocumentStore } from '../store/documentStore';
import { useCreditStore } from '../store/creditStore';
import { User, FileText, Clock, AlertCircle } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const { userDocuments, fetchUserDocuments } = useDocumentStore();
  const { userRequests, fetchUserRequests, submitCreditRequest, requestError } = useCreditStore();
  
  const [creditAmount, setCreditAmount] = useState(10);
  const [creditReason, setCreditReason] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [activeTab, setActiveTab] = useState('documents');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUserDocuments();
    fetchUserRequests();
  }, [fetchUserDocuments, fetchUserRequests]);

  const handleCreditRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (creditAmount <= 0) {
      return;
    }
    
    const success = submitCreditRequest(creditAmount, creditReason);
    
    if (success) {
      setSuccessMessage('Credit request submitted successfully');
      setCreditReason('');
      setShowRequestForm(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-3 rounded-full">
            <User className="h-8 w-8 text-indigo-600" />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
            <p className="text-gray-600">
              Role: <span className="capitalize">{user.role}</span>
            </p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-lg font-semibold text-gray-900">
              {user.credits} <span className="text-gray-600">credits</span>
            </div>
            <p className="text-sm text-gray-500">
              {user.scansToday} scans today
            </p>
          </div>
        </div>

        {user.credits === 0 && (
          <div className="mt-4 bg-red-50 p-3 rounded-lg flex items-start">
            <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-red-700 font-medium">You're out of credits!</p>
              <p className="text-red-600 text-sm">
                Request more credits or wait until tomorrow for your free daily credits.
              </p>
            </div>
          </div>
        )}

        {!showRequestForm && (
          <div className="mt-4">
            <button
              onClick={() => setShowRequestForm(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Request More Credits
            </button>
          </div>
        )}

        {showRequestForm && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Request Additional Credits</h3>
            
            {requestError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {requestError}
              </div>
            )}
            
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {successMessage}
              </div>
            )}
            
            <form onSubmit={handleCreditRequest} className="space-y-4">
              <div>
                <label htmlFor="creditAmount" className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  id="creditAmount"
                  type="number"
                  min="1"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(parseInt(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="creditReason" className="block text-sm font-medium text-gray-700">
                  Reason
                </label>
                <textarea
                  id="creditReason"
                  value={creditReason}
                  onChange={(e) => setCreditReason(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Explain why you need more credits"
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="inline mr-1" size={16} />
              Your Documents
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
          {activeTab === 'documents' && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Documents</h2>
              
              {userDocuments.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p>You haven't scanned any documents yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Preview
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userDocuments.map((doc) => (
                        <tr key={doc.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {doc.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {doc.content.substring(0, 50)}...
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeTab === 'requests' && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Credit Requests</h2>
              
              {userRequests.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <Clock className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p>You haven't made any credit requests yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
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
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userRequests.map((request) => (
                        <tr key={request.id}>
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

export default Profile;