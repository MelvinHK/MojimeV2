import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react';

export const Route = createFileRoute('/')({
  component: Index,
})

const kaomojis = [
  "(≧ ▽ ≦)", "(=・ω・=)", "(● ˇ∀ˇ ●)", "(*✧ω✧*)"
];

function Index() {
  const [kaomoji, setKaomoji] = useState("");

  useEffect(() => {
    const randomKaomoji = kaomojis[Math.floor(Math.random() * kaomojis.length)];
    setKaomoji(randomKaomoji);
  }, []);

  return (
    <div className="home-container">
      <div>{kaomoji}</div>
      <div>Mojime</div>
    </div>
  );
}
