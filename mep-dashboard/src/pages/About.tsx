export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-900">About This Dashboard</h1>
      <p className="mt-4 text-gray-700 leading-relaxed">
        This dashboard displays voting records of Members of the European Parliament 
        using data from HowTheyVote.eu. All data is sourced from the official 
        European Parliament website.
      </p>
      <h2 className="text-xl font-semibold mt-8 text-gray-900">Data Sources</h2>
      <ul className="mt-2 space-y-2 text-gray-600">
        <li>• HowTheyVote API: <a href="https://howtheyvote.eu/api/" className="text-blue-600 hover:underline">howtheyvote.eu/api</a></li>
        <li>• European Parliament: <a href="https://www.europarl.europa.eu/" className="text-blue-600 hover:underline">europarl.europa.eu</a></li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 text-gray-900">Privacy</h2>
      <p className="mt-2 text-gray-600">
        No cookies, no analytics, no user data collection. This dashboard only 
        fetches public data from the European Parliament.
      </p>
    </div>
  )
}
