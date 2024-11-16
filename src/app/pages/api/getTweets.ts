import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  tweets?: string[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { username } = req.query;
  const bearer_key = "AAAAAAAAAAAAAAAAAAAAABWFwgEAAAAA3DbhL%2BhXOa91FcHw8ZsqHv%2F0cu0%3DB89Md2Q7AQOIe0dd8is37dpVKX5jEinNtQsgr3DxuAYyclUODF"

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    // Paso 1: Obtener el ID de usuario
    const userResponse = await fetch(`https://api.twitter.com/2/users/by/username/${username}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearer_key}`,  // Reemplaza con tu Bearer Token
      },
    });

    // Si la respuesta de la API de Twitter no es exitosa
    if (!userResponse.ok) {
      const errorDetails = await userResponse.text(); // Obtenemos la respuesta en texto para ver el error
      console.error('Error fetching user:', errorDetails); // Log para ver el detalle
      return res.status(500).json({ error: 'Failed to fetch user data from Twitter.' });
    }

    const userData = await userResponse.json();
    if (userData.errors) {
      return res.status(400).json({ error: `Twitter API error: ${userData.errors[0].message}` });
    }

    if (userResponse.ok && userData.data) {
      const userId = userData.data.id;

      // Paso 2: Obtener los tweets más recientes del usuario
      const tweetsResponse = await fetch(`https://api.twitter.com/2/users/${userId}/tweets?max_results=5`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${bearer_key}`,
        },
      });

      // Si la respuesta de la API de Twitter no es exitosa
      if (!tweetsResponse.ok) {
        const errorDetails = await tweetsResponse.text(); // Obtenemos la respuesta en texto para ver el error
        console.error('Error fetching tweets:', errorDetails); // Log para ver el detalle
        return res.status(500).json({ error: 'Failed to fetch tweets from Twitter.' });
      }

      const tweetsData = await tweetsResponse.json();

      if (tweetsResponse.ok && tweetsData.data) {
        // Devolvemos los textos de los tweets
        return res.status(200).json({
          tweets: tweetsData.data.map((tweet: any) => tweet.text),
        });
      } else {
        return res.status(404).json({ error: 'No tweets found or invalid user' });
      }
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
}
