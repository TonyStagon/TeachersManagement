import React, { useState, useEffect } from 'react';
import { ExternalLink, Calendar, Globe } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { supabase } from '../lib/supabase';

interface Scholarship {
  name: string;
  url: string;
  closing_date: string | null;
  source: string;
  created_at?: string;
}

interface Bursary {
  name: string;
  url: string;
  source: string;
  scraped_at: string;
}

export function Funding() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [bursaries, setBursaries] = useState<Bursary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'scholarships' | 'bursaries'>('scholarships');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFundingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch scholarships - using type assertion since tables may not be in TypeScript definitions
      const { data: scholarshipsData, error: scholarshipsError } = await supabase
        .from('scholarships')
        .select('scholarships, scholarship_url, closing_date, source, created_at')
        .order('closing_date', { ascending: true });

      if (scholarshipsError) throw scholarshipsError;

      const formattedScholarships = ((scholarshipsData as any[]) || []).map(item => ({
        name: item.scholarships,
        url: item.scholarship_url,
        closing_date: item.closing_date,
        source: item.source,
        created_at: item.created_at
      }));

      setScholarships(formattedScholarships);

      // Fetch bursaries
      const { data: bursariesData, error: bursariesError } = await supabase
        .from('bursaries')
        .select('scholarships, scholarship_url, source, scraped_at')
        .order('scraped_at', { ascending: false });

      if (bursariesError) throw bursariesError;

      const formattedBursaries = ((bursariesData as any[]) || []).map(item => ({
        name: item.scholarships,
        url: item.scholarship_url,
        source: item.source,
        scraped_at: item.scraped_at
      }));

      setBursaries(formattedBursaries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch funding data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundingData();
  }, []);

  const filteredScholarships = scholarships.filter(scholarship =>
    scholarship.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.source?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBursaries = bursaries.filter(bursary =>
    bursary.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bursary.source?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No deadline';
    try {
      return new Date(dateString).toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchFundingData} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Funding Opportunities</h1>
        <p className="text-gray-600">Discover scholarships and bursaries for your education</p>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('scholarships')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'scholarships'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Scholarships ({scholarships.length})
        </button>
        <button
          onClick={() => setActiveTab('bursaries')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'bursaries'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Bursaries ({bursaries.length})
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search funding opportunities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {activeTab === 'scholarships' ? (
          <div className="divide-y divide-gray-200">
            {filteredScholarships.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? 'No scholarships match your search' : 'No scholarships available'}
              </div>
            ) : (
              filteredScholarships.map((scholarship, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {scholarship.name || 'Unnamed Scholarship'}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        {scholarship.closing_date && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Closes: {formatDate(scholarship.closing_date)}</span>
                          </div>
                        )}
                        {scholarship.source && (
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 mr-1" />
                            <span>Source: {scholarship.source}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {scholarship.url && (
                      <a
                        href={scholarship.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 inline-flex items-center px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Apply <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBursaries.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? 'No bursaries match your search' : 'No bursaries available'}
              </div>
            ) : (
              filteredBursaries.map((bursary, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {bursary.name || 'Unnamed Bursary'}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        {bursary.scraped_at && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Updated: {formatDate(bursary.scraped_at)}</span>
                          </div>
                        )}
                        {bursary.source && (
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 mr-1" />
                            <span>Source: {bursary.source}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {bursary.url && (
                      <a
                        href={bursary.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 inline-flex items-center px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Learn More <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}