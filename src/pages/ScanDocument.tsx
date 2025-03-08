import React, { useState } from 'react';
import { useDocumentStore } from '../store/documentStore';
import { useAuthStore } from '../store/authStore';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

const ScanDocument: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();
  const { scanDocument, scanResults, scanError, isScanning, clearScanResults } = useDocumentStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'text/plain') {
      setError('Please upload a plain text (.txt) file');
      return;
    }

    setFile(selectedFile);
    setError('');

    // Read file content
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setContent(event.target.result as string);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!title.trim()) {
      setError('Please enter a title');
      setIsLoading(false);
      return;
    }

    if (!content.trim()) {
      setError('Please enter content or upload a file');
      setIsLoading(false);
      return;
    }

    try {
      await scanDocument(title, content);
    } catch (err) {
      setError('An error occurred while scanning the document');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setContent('');
    setFile(null);
    clearScanResults();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Scan Document</h1>

      {user && (
        <div className="bg-indigo-50 p-4 rounded-lg mb-6 flex items-center justify-between">
          <div>
            <p className="text-indigo-800">
              You have <span className="font-bold">{user.credits}</span> credits available
            </p>
            <p className="text-sm text-indigo-600">
              Each scan uses 1 credit. Credits reset daily at midnight.
            </p>
          </div>
          {user.credits === 0 && (
            <div className="text-red-600 text-sm">
              <AlertCircle className="inline mr-1" size={16} />
              You're out of credits! Request more from the admin.
            </div>
          )}
        </div>
      )}

      {scanError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {scanError}
        </div>
      )}

      {scanResults.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Scan Results</h2>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              New Scan
            </button>
          </div>

          <div className="mb-4 p-4 bg-green-50 rounded-lg">
            <p className="flex items-center text-green-700">
              <CheckCircle className="mr-2" size={20} />
              Document scanned successfully!
            </p>
          </div>

          <h3 className="font-medium text-gray-700 mb-2">Similar Documents:</h3>
          
          {scanResults.length === 0 ? (
            <p className="text-gray-500">No similar documents found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Similarity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scanResults.map((result) => (
                    <tr key={result.documentId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {result.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className="bg-indigo-600 h-2.5 rounded-full" 
                              style={{ width: `${result.similarity}%` }}
                            ></div>
                          </div>
                          <span>{result.similarity.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Document</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Document Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter document title"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Document Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter document content or upload a file"
              ></textarea>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">Upload a plain text file</p>
              <input
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
              {file && (
                <p className="mt-2 text-sm text-indigo-600">
                  File selected: {file.name}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isScanning || user?.credits === 0}
                className={`px-4 py-2 rounded text-white ${
                  isScanning || user?.credits === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isScanning ? 'Scanning...' : 'Scan Document'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-2">How Document Scanning Works</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-1">
          <li>Enter a title and paste your document content or upload a text file</li>
          <li>Click "Scan Document" to analyze the text (uses 1 credit)</li>
          <li>The system will compare your document against existing documents</li>
          <li>Results show similar documents with a similarity percentage</li>
        </ol>
      </div>
    </div>
  );
};

export default ScanDocument;