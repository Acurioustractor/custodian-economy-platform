import React, { useState, useEffect } from 'react';
import {
  Beaker,
  Play,
  Pause,
  BarChart3,
  TrendingUp,
  Target,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Settings,
  Download,
  Filter
} from 'lucide-react';
import { 
  brandTestingFramework, 
  BrandTestVariant, 
  BrandTestResult 
} from '../services/brand-testing-framework';
import { useMetrics } from '../contexts/MetricsContext';
import { emailNotificationService } from '../services/email-notification-service';
import { authService } from '../services/auth-service';

interface BrandTestingInterfaceProps {
  className?: string;
}

export const BrandTestingInterface: React.FC<BrandTestingInterfaceProps> = ({ 
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'results' | 'compare'>('overview');
  const [activeTests, setActiveTests] = useState<BrandTestVariant[]>([]);
  const [testResults, setTestResults] = useState<BrandTestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  
  // Connect to metrics system
  const { setActiveBrandTests, addActivity, updateBrandScore } = useMetrics();

  // New test form state
  const [newTest, setNewTest] = useState({
    name: '',
    description: '',
    headlines: [''],
    taglines: [''],
    keyMessages: [''],
    targetAudiences: [] as string[],
    testDuration: 30
  });

  useEffect(() => {
    loadActiveTests();
    loadTestHistory();
  }, []);

  const loadActiveTests = async () => {
    try {
      const tests = await brandTestingFramework.getActiveTests();
      setActiveTests(tests);
      // Update real metrics with current active test count
      setActiveBrandTests(tests.length);
    } catch (error) {
      console.error('Failed to load active tests:', error);
    }
  };

  const loadTestHistory = async () => {
    try {
      const history = await brandTestingFramework.getTestHistory();
      setTestResults(history);
    } catch (error) {
      console.error('Failed to load test history:', error);
    }
  };

  const createNewTest = async () => {
    setLoading(true);
    try {
      const variant = await brandTestingFramework.createTestVariant(
        newTest.name,
        newTest.description,
        {
          headlines: newTest.headlines.filter(h => h.trim()),
          taglines: newTest.taglines.filter(t => t.trim()),
          key_messages: newTest.keyMessages.filter(m => m.trim())
        },
        newTest.targetAudiences,
        { test_duration_days: newTest.testDuration }
      );

      await brandTestingFramework.startTest(variant.id);
      await loadActiveTests(); // This will update the metrics automatically
      
      // Log activity in real metrics system
      addActivity({
        type: 'brand',
        message: `New brand test "${newTest.name}" created and started`
      });
      
      // Reset form
      setNewTest({
        name: '',
        description: '',
        headlines: [''],
        taglines: [''],
        keyMessages: [''],
        targetAudiences: [],
        testDuration: 30
      });
      
      setActiveTab('overview');
    } catch (error) {
      console.error('Failed to create test:', error);
      alert('Failed to create test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeTest = async (variantId: string) => {
    setLoading(true);
    try {
      const result = await brandTestingFramework.analyzeTestPerformance(variantId);
      await loadTestHistory();
      
      // Update real brand score based on test results
      const brandAlignment = Math.round(result.metrics.brand_dna_alignment);
      updateBrandScore(brandAlignment);
      
      // Log completion activity
      const testVariant = activeTests.find(t => t.id === variantId);
      const currentUser = authService.getAuthState().user;
      
      addActivity({
        type: 'brand',
        message: `Brand test "${testVariant?.name || 'Unknown'}" analysis completed - Score: ${brandAlignment}%`
      });
      
      // Send email notification for completed test
      if (testVariant) {
        await emailNotificationService.notifyTestCompleted({
          testName: testVariant.name,
          testType: testVariant.content.headlines ? 'messaging' : 'positioning',
          completedBy: currentUser?.name || 'Unknown User',
          completionDate: new Date(),
          overallScore: brandAlignment,
          keyFindings: [
            `Brand DNA alignment: ${result.metrics.brand_dna_alignment.toFixed(1)}%`,
            `Audience resonance: ${result.metrics.audience_resonance?.toFixed(1) || 'N/A'}%`,
            `Message clarity: ${result.metrics.message_clarity?.toFixed(1) || 'N/A'}%`
          ],
          testId: variantId
        });
      }
      
      alert(`Test analysis complete! Overall brand alignment: ${result.metrics.brand_dna_alignment.toFixed(1)}%`);
    } catch (error) {
      console.error('Failed to analyze test:', error);
      alert('Failed to analyze test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const compareSelectedVariants = async () => {
    if (selectedVariants.length < 2) {
      alert('Please select at least 2 variants to compare');
      return;
    }

    setLoading(true);
    try {
      const comparison = await brandTestingFramework.compareVariants(selectedVariants);
      
      // Log comparison activity
      addActivity({
        type: 'analytics',
        message: `Compared ${selectedVariants.length} brand test variants - Winner: ${comparison.winner}`
      });
      
      console.log('Comparison result:', comparison);
      alert(`Winner: ${comparison.winner}. Statistical significance: ${comparison.statistical_significance ? 'Yes' : 'No'}`);
    } catch (error) {
      console.error('Failed to compare variants:', error);
      alert('Failed to compare variants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addMessageField = (type: 'headlines' | 'taglines' | 'keyMessages') => {
    setNewTest(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }));
  };

  const updateMessageField = (type: 'headlines' | 'taglines' | 'keyMessages', index: number, value: string) => {
    setNewTest(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => i === index ? value : item)
    }));
  };

  const removeMessageField = (type: 'headlines' | 'taglines' | 'keyMessages', index: number) => {
    setNewTest(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className={`max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2 flex items-center gap-3">
              <Beaker className="h-8 w-8 text-blue-600" />
              Brand Testing Framework
            </h1>
            <p className="text-gray-600">
              Iterative testing and optimization of brand messaging using empathy ledger insights
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('create')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Test
            </button>
            <button
              onClick={compareSelectedVariants}
              disabled={selectedVariants.length < 2 || loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BarChart3 className="h-4 w-4" />
              Compare Selected
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {[
            { key: 'overview', label: 'Active Tests', icon: Eye },
            { key: 'create', label: 'Create Test', icon: Plus },
            { key: 'results', label: 'Results', icon: BarChart3 },
            { key: 'compare', label: 'Compare', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Active Brand Tests</h2>
            <span className="text-sm text-gray-500">{activeTests.length} active tests</span>
          </div>

          {activeTests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Beaker className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Tests</h3>
              <p className="text-gray-500 mb-4">Create your first brand test to start optimizing your messaging</p>
              <button
                onClick={() => setActiveTab('create')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Test
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeTests.map((test) => (
                <div key={test.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{test.name}</h3>
                      <p className="text-sm text-gray-600">{test.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedVariants.includes(test.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedVariants([...selectedVariants, test.id]);
                          } else {
                            setSelectedVariants(selectedVariants.filter(id => id !== test.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        test.status === 'active' ? 'bg-green-100 text-green-800' :
                        test.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {test.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="text-sm">
                      <span className="text-gray-500">Audiences:</span>
                      <span className="ml-1 text-gray-900">{test.target_audiences.join(', ')}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Started:</span>
                      <span className="ml-1 text-gray-900">{test.test_start_date.toLocaleDateString()}</span>
                    </div>
                    {test.test_end_date && (
                      <div className="text-sm">
                        <span className="text-gray-500">Ends:</span>
                        <span className="ml-1 text-gray-900">{test.test_end_date.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => analyzeTest(test.id)}
                      disabled={loading}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                      Analyze
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="max-w-2xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Brand Test</h2>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Name</label>
              <input
                type="text"
                value={newTest.name}
                onChange={(e) => setNewTest(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Q1 2024 Messaging Test"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newTest.description}
                onChange={(e) => setNewTest(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the goals and hypothesis for this test..."
              />
            </div>

            {/* Headlines */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Test Headlines</label>
                <button
                  onClick={() => addMessageField('headlines')}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Add Variant
                </button>
              </div>
              {newTest.headlines.map((headline, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => updateMessageField('headlines', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Headline variant ${index + 1}`}
                  />
                  {newTest.headlines.length > 1 && (
                    <button
                      onClick={() => removeMessageField('headlines', index)}
                      className="px-2 py-2 text-red-600 hover:text-red-700"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Taglines */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Test Taglines</label>
                <button
                  onClick={() => addMessageField('taglines')}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Add Variant
                </button>
              </div>
              {newTest.taglines.map((tagline, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => updateMessageField('taglines', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Tagline variant ${index + 1}`}
                  />
                  {newTest.taglines.length > 1 && (
                    <button
                      onClick={() => removeMessageField('taglines', index)}
                      className="px-2 py-2 text-red-600 hover:text-red-700"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Key Messages */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Key Messages</label>
                <button
                  onClick={() => addMessageField('keyMessages')}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Add Message
                </button>
              </div>
              {newTest.keyMessages.map((message, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <textarea
                    value={message}
                    onChange={(e) => updateMessageField('keyMessages', index, e.target.value)}
                    rows={2}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Key message ${index + 1}`}
                  />
                  {newTest.keyMessages.length > 1 && (
                    <button
                      onClick={() => removeMessageField('keyMessages', index)}
                      className="px-2 py-2 text-red-600 hover:text-red-700"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Target Audiences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audiences</label>
              <div className="space-y-2">
                {['partners', 'community', 'government', 'philanthropic', 'media'].map((audience) => (
                  <label key={audience} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newTest.targetAudiences.includes(audience)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewTest(prev => ({
                            ...prev,
                            targetAudiences: [...prev.targetAudiences, audience]
                          }));
                        } else {
                          setNewTest(prev => ({
                            ...prev,
                            targetAudiences: prev.targetAudiences.filter(a => a !== audience)
                          }));
                        }
                      }}
                      className="rounded border-gray-300 mr-2"
                    />
                    <span className="text-sm text-gray-700 capitalize">{audience}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Test Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Duration (days)</label>
              <input
                type="number"
                value={newTest.testDuration}
                onChange={(e) => setNewTest(prev => ({ ...prev, testDuration: parseInt(e.target.value) || 30 }))}
                min="7"
                max="365"
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Create Button */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setActiveTab('overview')}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createNewTest}
                disabled={loading || !newTest.name || newTest.targetAudiences.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create & Start Test'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
          
          {testResults.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
              <p className="text-gray-500">Run some tests to see performance insights here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {testResults.map((result) => (
                <div key={`${result.variant_id}-${result.test_period.start.getTime()}`} className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Test Result - {result.variant_id}</h3>
                      <p className="text-sm text-gray-600">
                        {result.test_period.start.toLocaleDateString()} - {result.test_period.end.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        result.confidence_level > 80 ? 'bg-green-100 text-green-800' :
                        result.confidence_level > 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {result.confidence_level.toFixed(1)}% confidence
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
                    {Object.entries(result.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{value.toFixed(1)}%</div>
                        <div className="text-xs text-gray-500 capitalize">
                          {key.replace(/_/g, ' ')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {result.recommendations.length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {result.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'compare' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Compare Test Variants</h2>
          <p className="text-gray-600">
            Select tests from the overview tab to compare their performance metrics and determine the winning variant.
          </p>
          
          {selectedVariants.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Tests Selected</h3>
              <p className="text-gray-500 mb-4">Go to the overview tab and select tests to compare</p>
              <button
                onClick={() => setActiveTab('overview')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Select Tests
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-4">
                Selected Tests ({selectedVariants.length})
              </h3>
              <div className="space-y-2 mb-6">
                {selectedVariants.map((variantId) => {
                  const test = activeTests.find(t => t.id === variantId);
                  return (
                    <div key={variantId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="font-medium">{test?.name || variantId}</span>
                      <button
                        onClick={() => setSelectedVariants(selectedVariants.filter(id => id !== variantId))}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={compareSelectedVariants}
                disabled={selectedVariants.length < 2 || loading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Run Comparison'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};