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

  console.log(
    emojis
      .filter(({ parent }) => !parent)
      .filter(({ slug }) => !ignore.test(slug)),
  );

  return emojis
    .filter(({ parent }) => !parent)
    .filter(({ slug }) => !ignore.test(slug))
    .map(({ character, unicodeName }) => ({
      label: `${character} ${unicodeName}`,
      value: character,
    }));
}

async function copyToClipBoard({ value: emoji }) {
  await navigator.clipboard.writeText(emoji);
}

const PickEmoji = () => {
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
        loadOptions={loadOptions}
        autoFocus
        onChange={copyToClipBoard}
        placeholder="Select emoji..."
      />
    </>
  );
};

export default PickEmoji;
