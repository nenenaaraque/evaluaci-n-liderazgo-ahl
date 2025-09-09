    // This is our secure intermediary function.
    exports.handler = async function (event, context) {
      // Only allow POST requests
      if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
      }

      try {
        // Get the conversation data sent from the webpage
        const body = JSON.parse(event.body);

        // Get the secret API key from our Netlify environment variables
        const apiKey = process.env.GOOGLE_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        // Call the Google AI API from the server, keeping the key safe
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body), // Pass the conversation data through
        });

        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }

        const data = await response.json();

        // Send the AI's response back to the webpage
        return {
          statusCode: 200,
          body: JSON.stringify(data),
        };
      } catch (error) {
        console.error('Error in serverless function:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: error.message }),
        };
      }
    };
