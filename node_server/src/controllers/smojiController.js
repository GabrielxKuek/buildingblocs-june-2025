export const convertSpeechToText = async (req, res, next) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required in request body' });
    }
    
    console.log('Received text for emoji conversion:', text);
    res.locals.text = text;
    return next();
        
  } catch (error) {
    console.error('Error in convertSpeechToText Controller:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const convertTextToEmoji = async (req, res, next) => {
  try {
    const { text } = res.locals;

    console.log('Converting text to emoji:', text);

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
    console.log('Python server response:', data);

    return res.status(200).json({
      original_text: text,
      emoji_text: data.emoji_text || data.result, 
      success: true
    });
  } catch (error) {
    console.error('Error in convertTextToEmoji Controller:', error);
    res.status(500).json({ 
      error: 'Failed to convert text to emoji',
      details: error.message 
    });
  }
}