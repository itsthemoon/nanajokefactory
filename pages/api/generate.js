import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const joke = req.body.joke || '';
  if (joke.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid joke idea",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(joke),
      temperature: 0.6,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(idea) {
  const capitalizedJoke =
    idea[0].toUpperCase() + idea.slice(1);
  return `Create a "Grandma" type joke based on nana's joke idea. The joke must make sense, be witty, and sometimes can be crude. Nana is a 72 year old woman. At the end of the day, the punchline of the joke has to hit.

  Idea: Joke about balls
  Joke: What did the female cannon ball say to the male cannon ball? I think we’re going to have a Berber!!
  Idea: Joke about babies
  Idea: Joke about daughters
  Joke:  A dad took his daughter to work one day for Take Your Child to Work and when they got to his office she started crying. His co-workers gathered round to see what was the matter . She sniffles and says "Dad , where are all the clowns you work with?"
  Idea: Joke about animals
  Joke: What did the buffalo say when his boy went to school? Bi-Son!!!
  Idea: Joke about states
  Joke: What's the capital of Wyoming?? ....'W'!
  Idea: ${idea}
  Joke:`;
}


