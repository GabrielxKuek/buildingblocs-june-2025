

export const convertSpeechToText = async (req, res, next) => {
  try {
    const something = 'How are you feeling today?';
    res.locals.text = something;
    return next();
    
  } catch (error) {
    console.error('Error in convertSpeechToText Controller:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const convertTextToEmoji = async (req, res, next) => {
  try {
    const { text } = res.locals;

    // Need to call python server api
    const response = await fetch('http://localhost:5000/api/convert-emoji', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in convertSpeechToText Controller:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

