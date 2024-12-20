// app/page.tsx
export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <section className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Ultimate K-Pop Quiz Experience</h1>
        <p className="text-lg text-gray-600 mb-6">
          Test your knowledge of K-Pop, discover new tracks, and build your personal music library.
        </p>
        <div className="space-x-4">
          <a href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-medium">
            Get Started
          </a>
          <a href="/quiz" className="text-blue-600 hover:underline">
            Try the Quiz First
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 text-center">
        <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-3">Sign Up</h2>
          <p className="text-gray-600 mb-4">Join our community of K-Pop fans.</p>
          <a href="/signup" className="text-blue-600 hover:underline">Sign Up Now →</a>
        </div>

        <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-3">Log In</h2>
          <p className="text-gray-600 mb-4">Already have an account? Access your profile and saved songs.</p>
          <a href="/login" className="text-blue-600 hover:underline">Log In →</a>
        </div>

        <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-3">Your K-Pop Library</h2>
          <p className="text-gray-600 mb-4">Browse and add songs to your personal K-Pop library if logged in.</p>
          <a href="/songs" className="text-blue-600 hover:underline">Go to Library →</a>
        </div>
      </section>

      {/* Quiz Highlight Section */}
      <section className="mt-10 bg-white p-8 rounded shadow hover:shadow-lg transition text-center">
        <h2 className="text-2xl font-semibold mb-3">Take the Quiz</h2>
        <p className="text-gray-600 mb-4">Challenge yourself and test your K-Pop knowledge!</p>
        <a href="/quiz" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded font-medium">
          Start Quiz
        </a>
      </section>
    </main>
  )
}
