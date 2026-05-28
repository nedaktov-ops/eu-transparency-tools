export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-900">About This Dashboard</h1>
      <p className="mt-4 text-gray-700 leading-relaxed">
        This dashboard visualizes economic data from the European Central Bank's 
        Statistical Data Warehouse (SDW). All data is fetched directly from the 
        ECB API and is publicly available.
      </p>
      <h2 className="text-xl font-semibold mt-8 text-gray-900">Data Sources</h2>
      <ul className="mt-2 space-y-2 text-gray-600">
        <li>• ECB SDW API: <a href="https://sdw-wsrest.ecb.europa.eu/" className="text-blue-600 hover:underline">sdw-wsrest.ecb.europa.eu</a></li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 text-gray-900">Privacy</h2>
      <p className="mt-2 text-gray-600">
        No cookies, no analytics, no user data collection. This dashboard only 
        fetches public data from the ECB.
      </p>
    </div>
  )
}
