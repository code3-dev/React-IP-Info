import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import "./App.css";

function App() {
  const [ip, setIp] = useState('');
  const [ipData, setIpData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const fetchIpInfo = async (queryIp) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`https://ipwho.is/${queryIp}`, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.data.success) {
        setIpData(response.data);
      } else {
        setError(response.data.message || 'Failed to fetch IP information');
      }
    } catch (err) {
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIpInfo('');
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchIpInfo(ip);
  };

  const exportToImage = async () => {
    setIsExporting(true);
    const exportButton = document.getElementById('exportButton');
    exportButton.classList.add('hidden');

    const exportElement = document.getElementById('exportableContent');
    const canvas = await html2canvas(exportElement);
    const image = canvas.toDataURL('image/png', 1.0);
    let downloadLink = document.createElement('a');
    downloadLink.href = image;
    downloadLink.download = 'ip-info.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    exportButton.classList.remove('hidden');
    setIsExporting(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold underline mb-6 text-center text-gray-800">
        IP Information
      </h1>
      <form onSubmit={handleSubmit} className="mb-2 flex flex-col items-center">
        <input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="Enter IP address"
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{ maxWidth: '300px' }}
        />
        <button
          type="submit"
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
        >
          Get Info
        </button>
      </form>

      {loading && (
        <div className="flex justify-center items-center">
          <div className="loader"></div>
        </div>
      )}

      {error && (
        <div className="flex py-2 justify-center items-center">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-2 rounded-md" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      )}

      {ipData && (
        <div className="flex flex-col items-center">
          <div id="exportableContent" className="exportableContent frameBorder shadowBox w-full max-w-4xl rounded-xl overflow-hidden p-6">
            <h3 className="text-2xl font-bold text-center mb-4">IP Details {ipData.flag && ipData.flag.emoji}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <p><strong>IP:</strong> {ipData.ip}</p>
              <p><strong>Type:</strong> {ipData.type}</p>
              <p><strong>Continent:</strong> {ipData.continent}</p>
              <p><strong>Country:</strong> {ipData.country} ({ipData.country_code})</p>
              <p><strong>Region:</strong> {ipData.region}</p>
              <p><strong>City:</strong> {ipData.city}</p>
              <p><strong>Latitude:</strong> {ipData.latitude}</p>
              <p><strong>Longitude:</strong> {ipData.longitude}</p>
              <p><strong>EU Member:</strong> {ipData.is_eu ? 'Yes' : 'No'}</p>
              <p><strong>Postal Code:</strong> {ipData.postal}</p>
              <p><strong>Calling Code:</strong> {ipData.calling_code}</p>
              <p><strong>Capital:</strong> {ipData.capital}</p>
              <p><strong>Borders:</strong> {ipData.borders}</p>
              <p><strong>ISP:</strong> {ipData.connection.isp}</p>
              <p><strong>Organization:</strong> {ipData.connection.org}</p>
              <p><strong>ASN:</strong> {ipData.connection.asn}</p>
              <p><strong>Timezone:</strong> {ipData.timezone.id} (UTC{ipData.timezone.utc})</p>
              <p><strong>Current Time:</strong> {ipData.timezone.current_time}</p>
            </div>
            {!isExporting && (
              <button
                id='exportButton'
                onClick={exportToImage}
                className="bg-green-500 mt-4 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg mb-4 transition-colors ... duration-200"
              >
                Export to Image
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

}

export default App;