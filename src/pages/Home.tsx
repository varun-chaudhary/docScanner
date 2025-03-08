import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useDocumentStore } from '../store/documentStore';
import { FileText, Upload, User, BarChart2 } from 'lucide-react';

const Home: React.FC = () => {
  const { user, isAdmin } = useAuthStore();
  const { userDocuments, fetchUserDocuments } = useDocumentStore();

  useEffect(() => {
    fetchUserDocuments();
  }, [fetchUserDocuments]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to DocScanner</h1>
        <p className="text-gray-600">
          Scan and match documents with our intelligent system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Link
          to="/scan"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center"
        >
          <Upload className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Scan Document</h2>
          <p className="text-gray-600">
            Upload and scan a document to find similar matches
          </p>
          <div className="mt-4 text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
            {user?.credits} credits available
          </div>
        </Link>

        <Link
          to="/profile"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center"
        >
          <User className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Profile</h2>
          <p className="text-gray-600">
            View your profile, past scans, and credit requests
          </p>
          <div className="mt-4 text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
            {userDocuments.length} documents
          </div>
        </Link>

        {isAdmin ? (
          <Link
            to="/admin"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center"
          >
            <BarChart2 className="h-12 w-12 text-indigo-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Admin Dashboard</h2>
            <p className="text-gray-600">
              Access analytics and manage credit requests
            </p>
            <div className="mt-4 text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
              Admin access
            </div>
          </Link>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <FileText className="h-12 w-12 text-indigo-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">How It Works</h2>
            <p className="text-gray-600">
              Each user gets 20 free scans per day. Need more? Request additional credits from admins.
            </p>
            <div className="mt-4 text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
              Daily reset at midnight
            </div>
          </div>
        )}
      </div>

      {userDocuments.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Recent Documents</h2>
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
                {userDocuments.slice(0, 5).map((doc) => (
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
          {userDocuments.length > 5 && (
            <div className="mt-4 text-right">
              <Link
                to="/profile"
                className="text-indigo-600 hover:text-indigo-900"
              >
                View all documents
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;