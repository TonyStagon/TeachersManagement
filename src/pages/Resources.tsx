import { BookOpen, Download, Search, Filter, Upload, Video, FileText, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import { mockResources } from '../lib/mockData';

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Lesson Plans', 'Worksheets', 'Videos', 'Assessment Tools'];

  const filteredResources = mockResources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Lesson Plans':
        return BookOpen;
      case 'Worksheets':
        return ClipboardList;
      case 'Videos':
        return Video;
      case 'Assessment Tools':
        return FileText;
      default:
        return BookOpen;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Lesson Plans':
        return 'bg-blue-100 text-blue-700';
      case 'Worksheets':
        return 'bg-emerald-100 text-emerald-700';
      case 'Videos':
        return 'bg-purple-100 text-purple-700';
      case 'Assessment Tools':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resource Library</h1>
          <p className="text-gray-600 mt-1">Access teaching materials and training resources</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md">
          <Upload className="w-4 h-4" />
          Upload Resource
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search resources by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map((resource) => {
            const Icon = getCategoryIcon(resource.category);
            return (
              <div
                key={resource.id}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all duration-200 hover:border-emerald-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 ${getCategoryColor(resource.category).replace('text', 'bg').replace('700', '100')} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${getCategoryColor(resource.category).split(' ')[1]}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{resource.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(resource.category)}`}>
                      {resource.category}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Download className="w-4 h-4" />
                    <span>{resource.downloads} downloads</span>
                  </div>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                    Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-gray-900 mb-2">Total Resources</h3>
          <p className="text-4xl font-bold text-emerald-700">{mockResources.length}</p>
          <p className="text-sm text-gray-600 mt-2">Available materials</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-gray-900 mb-2">Total Downloads</h3>
          <p className="text-4xl font-bold text-blue-700">
            {mockResources.reduce((sum, r) => sum + r.downloads, 0)}
          </p>
          <p className="text-sm text-gray-600 mt-2">This term</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-gray-900 mb-2">Most Popular</h3>
          <p className="text-lg font-bold text-purple-700 truncate">
            {mockResources.sort((a, b) => b.downloads - a.downloads)[0].title}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {mockResources.sort((a, b) => b.downloads - a.downloads)[0].downloads} downloads
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl shadow-md p-6 border border-emerald-200">
          <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-3">Access training guides and tutorials</p>
          <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
            View Guides
          </button>
        </div>
      </div>
    </div>
  );
}
