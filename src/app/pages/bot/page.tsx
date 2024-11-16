"use client"
import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [tweets, setTweets] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const fetchTweets = async () => {
    if (!username) {
      setError('Please enter a username.');
      return;
    }

    setError('');
    try {
      const res = await fetch(`/api/getTweets?username=${username}`);
      const data = await res.json();

      if (res.ok) {
        setTweets(data.tweets || []);
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (error) {
      setError('An error occurred while fetching data.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Get Latest Tweets</h1>

      <div className="mb-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2"
          placeholder="Enter Twitter username"
        />
        <button onClick={fetchTweets} className="ml-2 bg-blue-500 text-white p-2">
          Get Tweets
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div>
        <h2 className="text-xl font-bold">Recent Tweets</h2>
        {tweets.length > 0 ? (
          <ul>
            {tweets.map((tweet, index) => (
              <li key={index} className="border-b py-2">{tweet}</li>
            ))}
          </ul>
        ) : (
          <p>No tweets found.</p>
        )}
      </div>
    </div>
  );
}
