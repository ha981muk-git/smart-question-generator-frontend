import React, { useState, useEffect } from 'react';
import { FileText, BookOpen, Clock, Users, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const QuestionPaperGenerator = () => {
  const [formData, setFormData] = useState({
    grade: '',
    subject: '',
    topics: [],
    total_marks: 50,
    duration: 120,
    questionTypes: ['mcq', 'short', 'long']
  });
  
  const [generatedPaper, setGeneratedPaper] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const grades = [
    { value: '6', label: 'Grade 6' },
    { value: '7', label: 'Grade 7' },
    { value: '8', label: 'Grade 8' },
    { value: '9', label: 'Grade 9' },
    { value: '10', label: 'Grade 10' },
    { value: '11', label: 'Grade 11' },
    { value: '12', label: 'Grade 12' }
  ];

  const subjects = [
    'Mathematics', 'Science', 'English', 'History', 'Geography', 
    'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics'
  ];

  const [availableTopics, setAvailableTopics] = useState([]);
  const [topicInput, setTopicInput] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const addTopic = () => {
    if (topicInput.trim() && !formData.topics.includes(topicInput.trim())) {
      setFormData(prev => ({
        ...prev,
        topics: [...prev.topics, topicInput.trim()]
      }));
      setTopicInput('');
    }
  };

  const removeTopic = (topicToRemove) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter(topic => topic !== topicToRemove)
    }));
  };
   console.log(formData)
  const generateQuestionPaper = async () => {
    if (!formData.grade || !formData.subject || formData.topics.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // console.log('Sending request with data:', formData); // testing log browser console output
      
      // Try different URL variations
      const urls = [
        '/api/generate-paper/', // Use Vite proxy
        'http://127.0.0.1:8000/api/generate-paper/', // Django server endpoint  
        'http://localhost:8000/api/generate-paper/'
      ];
      
      let response;
      let lastError;
      
      for (const url of urls) {
        try {
          console.log('Trying URL:', url);
          response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
          });
          console.log('Response received from:', url);
          break; // If successful, break out of loop
        } catch (error) {
          console.log('Failed with URL:', url, 'Error:', error.message);
          lastError = error;
          continue; // Try next URL
        }
      }
      
      if (!response) {
        throw lastError || new Error('All server URLs failed');
      }

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      setGeneratedPaper(data);
      setSuccess('Question paper generated successfully!');
    } catch (err) {
      console.error('Full error details:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      
      // Check if it's a network error
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Network error: Cannot connect to server. Please check if the backend is running.');
      } else if (err.message.includes('CORS')) {
        setError('CORS error: Server is not configured to accept requests from this domain.');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    // This would implement PDF export functionality
    alert('PDF export functionality will be implemented next!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <FileText className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Smart Question Paper Generator</h1>
          </div>
          <p className="text-gray-600 text-lg">Create customized exam papers with AI-powered question generation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-indigo-600" />
              Paper Configuration
            </h2>

            {/* Grade Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Grade *
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Choose Grade</option>
                {grades.map(grade => (
                  <option key={grade.value} value={grade.value}>
                    {grade.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Choose Subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Topics */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topics *
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="Enter topic name"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addTopic()}
                />
                <button
                  type="button"
                  onClick={addTopic}
                  className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                  >
                    {topic}
                    <button
                      type="button"
                      onClick={() => removeTopic(topic)}
                      className="ml-2 text-indigo-600 hover:text-indigo-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Marks and Duration */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Marks
                </label>
                <input
                  type="number"
                  name="total_marks"
                  value={formData.total_marks}
                  onChange={handleInputChange}
                  min="10"
                  max="100"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="30"
                  max="300"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateQuestionPaper}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  Generate Question Paper
                </>
              )}
            </button>

            {/* Messages */}
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center text-red-700">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}
            
            {success && (
              <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg flex items-center text-green-700">
                <CheckCircle className="w-5 h-5 mr-2" />
                {success}
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-indigo-600" />
                Question Paper Preview
              </h2>
              {generatedPaper && (
                <button
                  onClick={exportToPDF}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </button>
              )}
            </div>

            {!generatedPaper ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Your generated question paper will appear here</p>
                <p className="text-sm">Fill the form and click generate to create your custom exam paper</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Paper Header */}
                <div className="border-b pb-4">
                  <h3 className="text-xl font-bold text-center">{generatedPaper.title}</h3>
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>Subject: {generatedPaper.subject_name}</span>
                    <span>Grade: {generatedPaper.grade_name}</span>
                  </div>
                  <div className="flex justify-between mt-1 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Duration: {generatedPaper.duration} minutes
                    </span>
                    <span>Total Marks: {generatedPaper.total_marks}</span>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Instructions:</h4>
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {generatedPaper.instructions}
                  </div>
                </div>

                {/* Questions */}
                <div className="space-y-4">
                  {generatedPaper.questions && generatedPaper.questions.map((question, index) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-gray-800">Q{index + 1}.</span>
                        <div className="text-sm text-gray-600 flex items-center gap-4">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {question.marks} marks
                          </span>
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded capitalize">
                            {question.difficulty}
                          </span>
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded uppercase">
                            {question.question_type}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-800 mb-3">{question.question_text}</p>
                      
                      {question.question_type === 'mcq' && (
                        <div className="grid grid-cols-1 gap-2 ml-4">
                          {question.option_a && <p className="text-sm">A) {question.option_a}</p>}
                          {question.option_b && <p className="text-sm">B) {question.option_b}</p>}
                          {question.option_c && <p className="text-sm">C) {question.option_c}</p>}
                          {question.option_d && <p className="text-sm">D) {question.option_d}</p>}
                        </div>
                      )}
                      
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          Topic: {question.topic_name} | Time: {question.time_to_solve} min
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Grade-Specific</h3>
            <p className="text-gray-600 text-sm">Questions tailored to specific grade levels and curriculum standards</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <BookOpen className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Multi-Subject</h3>
            <p className="text-gray-600 text-sm">Support for various subjects with topic-wise question generation</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Time-Optimized</h3>
            <p className="text-gray-600 text-sm">Questions designed with appropriate time allocation and difficulty balance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPaperGenerator;
