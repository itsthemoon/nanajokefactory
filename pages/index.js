import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [jokeInput, setJokeInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ joke: jokeInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setJokeInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/nana.png" />
      </Head>

      <main className={styles.main}>
        <img src="/nana.png" className={styles.icon} />
        <h3>Nana's Go-Go Joke Factory</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="joke"
            placeholder="Joke about (fill in the blank)"
            value={jokeInput}
            onChange={(e) => setJokeInput(e.target.value)}
          />
          <input type="submit" value="Generate joke" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
