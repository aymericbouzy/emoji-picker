import { useState } from 'react';
import Select from 'react-select/async';
import styles from '../styles/Picker.module.css';

const access_key = process.env.NEXT_PUBLIC_EMOJI_API_KEY;

type Emoji = {
  character: string;
  slug: string;
  parent: string;
  unicodeName: string;
};

const ignore = /^e(\d)+-\d-/;

async function loadOptions(search: string) {
  const url = new URL('https://emoji-api.com/emojis');
  url.search = new URLSearchParams({ search, access_key }).toString();

  const emojis: Emoji[] = await fetch(url.toString()).then((response) =>
    response.json(),
  );

  const suggestedEmojis: Emoji[] = await fetch(
    `/api/search?${new URLSearchParams({ query: search })}`,
  ).then((response) => response.json());

  return [
    ...suggestedEmojis,
    ...(emojis || [])
      .filter(({ parent }) => !parent)
      .filter(({ slug }) => !ignore.test(slug))
      .filter(
        ({ character }) =>
          !suggestedEmojis.some((emoji) => emoji.character === character),
      ),
  ].map(({ character, unicodeName }) => ({
    label: `${character} ${unicodeName}`,
    value: JSON.stringify({ character, unicodeName }),
  }));
}

const PickEmoji = () => {
  const [queries, setQueries] = useState([]);

  async function onEmoji({ value: emoji }) {
    const { character, unicodeName } = JSON.parse(emoji);
    navigator.clipboard.writeText(character);
    fetch('/api/remember-choice', {
      method: 'POST',
      body: JSON.stringify({
        queries,
        choice: { character, unicodeName },
      }),
      headers: {
        'content-type': 'application/json',
      },
    });
    setQueries([]);
  }

  return (
    <>
      <label
        className={styles.label}
        id="emoji-picker-label"
        htmlFor="emoji-picker"
      >
        Search emoji
      </label>
      <Select
        inputId="emoji-picker"
        aria-labelledby="emoji-picker-label"
        className={styles.picker}
        cacheOptions
        loadOptions={(search: string) =>
          loadOptions(search).catch((error) => {
            console.error(error);
            throw error;
          })
        }
        autoFocus
        onChange={onEmoji}
        placeholder="Select emoji..."
        onInputChange={(query) => setQueries((queries) => [...queries, query])}
      />
    </>
  );
};

export default PickEmoji;
