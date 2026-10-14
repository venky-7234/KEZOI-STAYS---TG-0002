import { useScrollReveal } from '../hooks/useScrollReveal';

const groups = [
  {
    label: 'Outdoors & slow moments',
    items: [
      ['The Mango Orchards', 'Walk through five acres of greenery, enjoy the fresh air, and take a break from the noise of the city.'],
      ['The Private Pool', 'Spend your afternoons in the pool, enjoy a few laughs with your favourite people, and let the day slow down.'],
      ['The Open Sit-Out', 'Enjoy your morning coffee, feel the breeze, and take in the beautiful green views without having anywhere else to be.'],
      ['The Cycling Experience', 'Take a cycle through the greenery, explore the surroundings, and enjoy the simple pleasure of being outdoors.'],
      ['The Slow Mornings', 'Wake up to greenery, step outside for some fresh air, enjoy a warm cup of tea, and let the morning begin at its own pace.'],
    ],
  },
  {
    label: 'Food & evenings',
    items: [
      ['The Dining Table', 'A table filled with delicious food, friends laughing out loud, stories being shared, and moments that make you wish the meal would never end.'],
      ['The Barbecue Evenings', 'Freshly grilled food, music playing in the background, friends gathered around, and an evening that turns into a memory.'],
      ['The Bonfire Nights', 'Sit around the fire, share stories, play your favourite songs, and enjoy the kind of night you never want to end.'],
      ['The Fully Equipped Kitchen', 'Cook your favourite meals, make a midnight snack, or prepare something special together. Some of the best moments begin in the kitchen.'],
    ],
  },
  {
    label: 'Play & entertainment',
    items: [
      ['The Upstairs Snooker Table', 'Challenge your friends to a game, enjoy a little friendly competition, and see who really knows how to play.'],
      ['The Carrom Board', 'Gather around for a quick game that turns into hours of fun, playful arguments, and friendly competition.'],
      ['The Cricket & Badminton Games', 'Pick your teams, bring out your competitive side, and turn an ordinary afternoon into a game everyone wants to win.'],
      ["The Children's Play Area", 'Swings, seesaws, and plenty of space to play while the little ones make memories of their own.'],
      ['The Music & Entertainment', 'Connect your favourite playlist, turn up the music, and let the atmosphere match the mood of your group.'],
    ],
  },
  {
    label: 'Together at home',
    items: [
      ['The Living Room', 'Movie nights, long conversations, games, and everyone together in one place, just like being at home.'],
      ['The Comfortable Bedrooms', 'After a day full of activities, settle into a comfortable room, get some rest, and wake up ready for another day together.'],
      ['The Family Get-Together', 'Bring everyone under one roof for good food, laughter, games, and the kind of time together that busy schedules rarely allow.'],
      ["The Friends' Weekend", "No plans to rush through, no city noise to escape from—just your favourite people, great food, music, and time to enjoy each other's company."],
    ],
  },
];

export default function FarmhouseExperience() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.01 });

  return (
    <section ref={ref} id="experience" className={`farmhouse-experience ${isVisible ? 'animate-fade-up' : 'pre-animate'}`}>
      <div className="container">
        <header className="experience-heading">
          <span className="about-eyebrow">More than a place to stay</span>
          <h2>The Kezoi Farmhouse Experience</h2>
          <p>Room to slow down, play, share a meal, and spend meaningful time together.</p>
        </header>

        <div className="experience-groups">
          {groups.map((group) => (
            <section className="experience-group" key={group.label}>
              <div className="experience-group-heading">
                <h3>{group.label}</h3>
              </div>
              <div className="experience-list">
                {group.items.map(([title, description]) => (
                  <article key={title}>
                    <h4>{title}</h4>
                    <p>{description}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="experience-signature">
          <span>Kezoi Stays</span>
          <p>Luxury is an amenity. Feeling at home is the experience.</p>
        </footer>
      </div>
    </section>
  );
}
