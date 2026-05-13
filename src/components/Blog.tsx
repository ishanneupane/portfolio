import type { CollectionEntry } from 'astro:content';
import { createSignal, For, Show } from 'solid-js';

type Props = {
  tags: string[];
  data: CollectionEntry<'blog'>[];
};

export default function Blog(props: Props) {
  const [playerName, setPlayerName] = createSignal('');
  const [players, setPlayers] = createSignal<string[]>([]);

  const [teamA, setTeamA] = createSignal<string[]>([]);
  const [teamB, setTeamB] = createSignal<string[]>([]);
  const [umpire, setUmpire] = createSignal<string | null>(null);

  const [tossResult, setTossResult] = createSignal('');
  const [isTossing, setIsTossing] = createSignal(false);

  const [error, setError] = createSignal('');

  const addPlayer = () => {
    const trimmedName = playerName().trim();

    if (!trimmedName) return;

    const alreadyExists = players().some(
      (player) => player.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (alreadyExists) {
      setError('Player already added');
      return;
    }

    setError('');
    setTossResult('');

    setPlayers([...players(), trimmedName]);
    setPlayerName('');
  };
  const generateTeams = () => {
    setTossResult(''); // clear toss result

    const shuffled = [...players()].sort(() => Math.random() - 0.5);

    let umpirePlayer: string | null = null;

    if (shuffled.length % 2 !== 0) {
      umpirePlayer = shuffled.pop() || null;
    }

    const middle = shuffled.length / 2;

    setTeamA(shuffled.slice(0, middle));
    setTeamB(shuffled.slice(middle));
    setUmpire(umpirePlayer);
  };

  const tossCoin = () => {
    setIsTossing(true);
    setTossResult('Tossing...');

    setTimeout(() => {
      const result = Math.random() > 0.5 ? 'Heads' : 'Tails';

      setTossResult(result);
      setIsTossing(false);
    }, 1000);
  };

  return (
    <div class='flex flex-wrap gap-4'>
    <div class='flex flex-col gap-4'>
      <div class='flex gap-2 flex-wrap'>
        <input
          type='text'
          value={playerName()}
          onInput={(e) => setPlayerName(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addPlayer();
            }
          }}
          class='bg-gray/5 dark:bg-white/15 border border-black/15 dark:border-white/20 text-black dark:text-white px-3 py-2'
          placeholder='Player Name'
        />

        <button
          class='px-3 py-1 border border-black/25 dark:border-white/25 hover:bg-black/5 dark:hover:bg-white/15 blend'
          onClick={addPlayer}
        >
          Add member
        </button>

        <button
          class='px-3 py-1 border border-black/25 dark:border-white/25 hover:bg-black/5 dark:hover:bg-white/15 blend'
          onClick={tossCoin}
          disabled={isTossing()}
        >
          {isTossing() ? 'Tossing...' : 'Toss'}
        </button>
      </div>
      <Show when={error()}>
        <p class='text-red-500 text-sm'>{error()}</p>
      </Show>
      <Show when={tossResult()}>
        <div class='px-3 py-2 rounded border border-black/15 dark:border-white/20 bg-black/5 dark:bg-white/10 w-fit'>
          Toss Result: <span class='font-bold'>{tossResult()}</span>
        </div>
      </Show>

      <div class='flex flex-wrap gap-2'>
        <For each={players()}>
          {(player) => (
            <div class='px-3 py-1 rounded border border-black/15 dark:border-white/20 bg-black/5 dark:bg-white/10'>
              {player}
            </div>
          )}
        </For>
      </div>

      <button
        class='px-3 py-1 border border-black/25 dark:border-white/25 hover:bg-black/5 dark:hover:bg-white/15 blend w-fit'
        onClick={generateTeams}
      >
        Generate Teams
      </button>

      <Show when={teamA().length || teamB().length}>
        <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div class='p-4 rounded border border-black/15 dark:border-white/20'>
            <h2 class='font-bold mb-2'>Team A</h2>

            <div class='flex flex-col gap-2'>
              <For each={teamA()}>{(player) => <div>{player}</div>}</For>
            </div>
          </div>

          <div class='p-4 rounded border border-black/15 dark:border-white/20'>
            <h2 class='font-bold mb-2'>Team B</h2>

            <div class='flex flex-col gap-2'>
              <For each={teamB()}>{(player) => <div>{player}</div>}</For>
            </div>
          </div>
        </div>
        <Show when={umpire()}>
          <div class='p-4 rounded border border-black/15 dark:border-white/20'>
            <span class='font-bold'>Umpire:</span> {umpire()}
          </div>
        </Show>
      </Show>
      
    </div>
    <div>
    <div>
      Support creator with some love and DAKSHINA</div>
      <img
        src='/image/del.jpeg'
        alt='Bottom image'
        class='w-full max-w-xl mx-auto h-40 rounded-xl object-contain mt-6 bg-black/5'
      />
    </div>
    </div>
  );
}
