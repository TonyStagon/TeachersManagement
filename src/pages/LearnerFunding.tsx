import { useState, useEffect } from 'react';
import { ExternalLink, Calendar, Globe, Search, Banknote } from 'lucide-react';
import { supabaseFunding } from '../lib/supabase-funding';

interface Scholarship {
  name: string;
  url: string;
  closing_date: string | null;
  source: string;
}

interface Bursary {
  name: string;
  url: string;
  source: string;
  scraped_at: string;
}

export default function LearnerFunding() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [bursaries, setBursaries] = useState<Bursary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'scholarships' | 'bursaries'>('scholarships');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: sData, error: sError } = await supabaseFunding
          .from('scholarships')
          .select('scholarships, scholarship_url, closing_date, source')
          .order('closing_date', { ascending: true });

        if (sError) throw sError;
        setScholarships(((sData as any[]) || []).map(i => ({
          name: i.scholarships, url: i.scholarship_url,
          closing_date: i.closing_date, source: i.source,
        })));

        const { data: bData, error: bError } = await supabaseFunding
          .from('bursaries')
          .select('scholarships, scholarship_url, source, scraped_at')
          .order('scraped_at', { ascending: false });

        if (bError) throw bError;
        setBursaries(((bData as any[]) || []).map(i => ({
          name: i.scholarships, url: i.scholarship_url,
          source: i.source, scraped_at: i.scraped_at,
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load funding data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (d: string | null) => {
    if (!d) return 'No deadline';
    try { return new Date(d).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' }); }
    catch { return 'Invalid date'; }
  };

  const filteredScholarships = scholarships.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.source?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBursaries = bursaries.filter(b =>
    b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.source?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
          <Banknote className="w-5 h-5 text-emerald-700" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Funding Opportunities</h2>
          <p className="text-gray-500 text-sm">Scholarships and bursaries available for you</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('scholarships')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${activeTab === 'scholarships' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Scholarships ({scholarships.length})
        </button>
        <button
          onClick={() => setActiveTab('bursaries')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${activeTab === 'bursaries' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Bursaries ({bursaries.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search funding opportunities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
        />
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-3 text-gray-500 text-sm">Loading funding opportunities...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 text-sm">{error}</div>
        ) : activeTab === 'scholarships' ? (
          <div className="divide-y divide-gray-100">
            {filteredScholarships.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No scholarships found</div>
            ) : filteredScholarships.map((s, i) => (
              <div key={i} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-2">{s.name || 'Unnamed Scholarship'}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      {s.closing_date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Closes: {formatDate(s.closing_date)}</span>}
                      {s.source && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{s.source}</span>}
                    </div>
                  </div>
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer"
                      className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                      Apply <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredBursaries.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No bursaries found</div>
            ) : filteredBursaries.map((b, i) => (
              <div key={i} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-2">{b.name || 'Unnamed Bursary'}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      {b.scraped_at && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Updated: {formatDate(b.scraped_at)}</span>}
                      {b.source && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{b.source}</span>}
                    </div>
                  </div>
                  {b.url && (
                    <a href={b.url} target="_blank" rel="noopener noreferrer"
                      className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                      Apply <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
