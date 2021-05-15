import Select from 'react-select/async';
import styles from '../styles/Picker.module.css';

const access_key = 'df9221947c2ce6c96b3fe0a3bd32402765885025';

async function loadOptions(search: string) {
  const url = new URL('https://emoji-api.com/emojis');
  url.search = new URLSearchParams({ search, access_key }).toString();

  const emojis: { character: string; slug: string }[] = await fetch(
    url.toString(),
  ).then((response) => response.json());

  console.log(emojis);

  return emojis.map(({ character, slug }) => ({
    label: `${character} ${slug}`,
    value: character,
  }));
}

async function copyToClipBoard({ value: emoji }) {
  await navigator.clipboard.writeText(emoji);
}

const PickEmoji = () => {
  return (
    <Select
      className={styles.picker}
      cacheOptions
      loadOptions={loadOptions}
      autoFocus
      onChange={copyToClipBoard}
    />
  );
};

export default PickEmoji;
