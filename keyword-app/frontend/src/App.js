import React from 'react';

function UserDiv() {
  const [searchPrompt, setSearchPrompt] = React.useState('');
  const [language, setLanguage] = React.useState('en');
  const [keywords, setKeywords] = React.useState({ primary: [], secondary: [], tertiary: [] });
  const [translatedKeywords, setTranslatedKeywords] = React.useState([]);
  const [longTailKeywords, setLongTailKeywords] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const handleSearchPromptChange = (event) => {
    setSearchPrompt(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const fetchKeywords = async () => {
    setLoading(true);
    const keywordData = await window.pythonRun(`fetchKeywordData("${searchPrompt}")`);
    setKeywords(keywordData.result);
    setLoading(false);
  };

  const translateKeywords = async () => {
    setLoading(true);
    const translationData = await window.pythonRun(`translateKeywords(${JSON.stringify(keywords)}, "${language}")`);
    setTranslatedKeywords(translationData.result);
    setLoading(false);
  };

  const fetchLongTailKeywords = async () => {
    setLoading(true);
    const longTailData = await window.pythonRun(`suggest_long_tail_keywords(${JSON.stringify(keywords)})`);
    setLongTailKeywords(longTailData.result);
    setLoading(false);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          value={searchPrompt}
          onChange={handleSearchPromptChange}
          placeholder="Enter search prompt..."
          className="p-2 border border-gray-300 rounded"
        />
        <button onClick={fetchKeywords} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
          Fetch Keywords
        </button>
        <button onClick={fetchLongTailKeywords} className="ml-2 px-4 py-2 bg-purple-500 text-white rounded">
          Suggest Long-Tail Keywords
        </button>
      </div>
      <div className="mb-4">
        <select value={language} onChange={handleLanguageChange} className="p-2 border border-gray-300 rounded">
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
        <button onClick={translateKeywords} className="ml-2 px-4 py-2 bg-green-500 text-white rounded">
          Translate Keywords
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {!loading && (
        <div>
          <h3 className="text-lg font-semibold">Keywords</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h4 className="text-md font-semibold">Primary</h4>
              <ul>{keywords.primary.map((keyword) => <li key={keyword}>{keyword}</li>)}</ul>
            </div>
            <div>
              <h4 className="text-md font-semibold">Secondary</h4>
              <ul>{keywords.secondary.map((keyword) => <li key={keyword}>{keyword}</li>)}</ul>
            </div>
            <div>
              <h4 className="text-md font-semibold">Tertiary</h4>
              <ul>{keywords.tertiary.map((keyword) => <li key={keyword}>{keyword}</li>)}</ul>
            </div>
          </div>
          {translatedKeywords.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold">Translated Keywords</h3>
              <ul>{translatedKeywords.map((keyword) => <li key={keyword}>{keyword}</li>)}</ul>
            </div>
          )}
          {longTailKeywords.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold">Long-Tail Keywords</h3>
              <ul>{longTailKeywords.map((keyword) => <li key={keyword}>{keyword}</li>)}</ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserDiv;
