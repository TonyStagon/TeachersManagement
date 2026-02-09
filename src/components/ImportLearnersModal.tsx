import { useState, useRef } from 'react';
import { X, Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';

interface ImportLearnersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (learners: ImportedLearner[]) => void;
}

export interface ImportedLearner {
  full_name: string;
  grade: string;
  student_number: string;
  email: string;
  date_of_birth: string;
  enrollment_date: string;
  status: string;
}

export default function ImportLearnersModal({ isOpen, onClose, onImport }: ImportLearnersModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ImportedLearner[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const headers = ['full_name', 'grade', 'student_number', 'email', 'date_of_birth', 'enrollment_date', 'status'];
    const sampleData = [
      'John Doe,Grade 10,STU101,john.doe@student.edu,2007-05-15,2024-01-10,Active',
      'Jane Smith,Grade 11,STU102,jane.smith@student.edu,2006-08-22,2023-01-10,Active',
      'Mike Johnson,Grade 12,STU103,mike.johnson@student.edu,2005-12-03,2022-01-10,Active',
    ];

    const csvContent = [headers.join(','), ...sampleData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'learners_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        setErrors(['Please select a CSV file']);
        return;
      }
      setSelectedFile(file);
      parseCSV(file);
    }
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length < 2) {
        setErrors(['CSV file is empty or has no data rows']);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const requiredHeaders = ['full_name', 'grade', 'student_number', 'email', 'date_of_birth', 'enrollment_date', 'status'];

      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        setErrors([`Missing required columns: ${missingHeaders.join(', ')}`]);
        return;
      }

      const newErrors: string[] = [];
      const learners: ImportedLearner[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length !== headers.length) {
          newErrors.push(`Row ${i + 1}: Incorrect number of columns`);
          continue;
        }

        const learner: ImportedLearner = {
          full_name: values[headers.indexOf('full_name')],
          grade: values[headers.indexOf('grade')],
          student_number: values[headers.indexOf('student_number')],
          email: values[headers.indexOf('email')],
          date_of_birth: values[headers.indexOf('date_of_birth')],
          enrollment_date: values[headers.indexOf('enrollment_date')],
          status: values[headers.indexOf('status')] || 'Active',
        };

        if (!learner.full_name || !learner.grade || !learner.student_number || !learner.email) {
          newErrors.push(`Row ${i + 1}: Missing required fields`);
          continue;
        }

        if (!['Grade 10', 'Grade 11', 'Grade 12'].includes(learner.grade)) {
          newErrors.push(`Row ${i + 1}: Invalid grade (must be Grade 10, Grade 11, or Grade 12)`);
          continue;
        }

        learners.push(learner);
      }

      setErrors(newErrors);
      setParsedData(learners);
    };

    reader.onerror = () => {
      setErrors(['Failed to read file']);
    };

    reader.readAsText(file);
  };

  const handleImport = () => {
    if (parsedData.length > 0) {
      onImport(parsedData);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setParsedData([]);
    setErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Import Learners from CSV</h2>
              <p className="text-blue-100 text-sm">Upload a CSV file to add multiple learners at once</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FileSpreadsheet className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">Step 1: Download Template</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Download the CSV template to see the required format and column headers.
                </p>
                <button
                  onClick={downloadTemplate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download CSV Template
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Step 2: Upload Your CSV File</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select a CSV file containing learner data in the correct format
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer font-medium"
            >
              <FileSpreadsheet className="w-5 h-5" />
              Select CSV File
            </label>
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-3">
                Selected: <span className="font-semibold">{selectedFile.name}</span>
              </p>
            )}
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-2">Errors Found</h3>
                  <ul className="space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="text-sm text-red-800">• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {parsedData.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-emerald-900 mb-2">
                    Ready to Import: {parsedData.length} Learner{parsedData.length !== 1 ? 's' : ''}
                  </h3>
                  <div className="max-h-48 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-emerald-300">
                        <tr>
                          <th className="text-left py-2 text-emerald-900">Name</th>
                          <th className="text-left py-2 text-emerald-900">Grade</th>
                          <th className="text-left py-2 text-emerald-900">Student #</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.map((learner, index) => (
                          <tr key={index} className="border-b border-emerald-200">
                            <td className="py-2 text-emerald-800">{learner.full_name}</td>
                            <td className="py-2 text-emerald-800">{learner.grade}</td>
                            <td className="py-2 text-emerald-800">{learner.student_number}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">CSV Format Requirements:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Headers must include: full_name, grade, student_number, email, date_of_birth, enrollment_date, status</li>
              <li>• Grade must be: Grade 10, Grade 11, or Grade 12</li>
              <li>• Dates must be in format: YYYY-MM-DD</li>
              <li>• Status should be: Active, Inactive, or Graduated</li>
              <li>• Student averages will be calculated automatically from performance records</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={parsedData.length === 0}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Import {parsedData.length > 0 ? `${parsedData.length} Learner${parsedData.length !== 1 ? 's' : ''}` : 'Learners'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
