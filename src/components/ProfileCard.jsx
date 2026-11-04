import { useState } from 'react'

export default function ProfileCard({ name, group, technologies }) {
  const [likes, setLikes] = useState(0)

  return (
    <article className="profile-card">
      <p className="profile-card__group">Група {group}</p>
      <h1 className="profile-card__name">{name}</h1>
      <p className="profile-card__role">Майбутній frontend-розробник</p>

      <section className="profile-card__section">
        <h2 className="profile-card__heading">Про мене</h2>
        <p className="profile-card__text">
          Технології, які я хочу опанувати в цьому курсі:
        </p>
        <ul className="profile-card__list">
          {technologies.map((technology) => (
            <li className="profile-card__item" key={technology}>
              {technology}
            </li>
          ))}
        </ul>
      </section>

      <button
        type="button"
        className="profile-card__like"
        onClick={() => setLikes((current) => current + 1)}
      >
        Подобається
        <span className="profile-card__count">{likes}</span>
      </button>
    </article>
  )
}
