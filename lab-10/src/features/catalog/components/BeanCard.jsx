import { useId } from 'react'
import { paths } from '../../../lib/paths.js'
import FavoriteButton from '../../../components/FavoriteButton.jsx'
import Link from '../../../components/Link.jsx'

export default function BeanCard({ bean, children }) {
  const titleId = useId()

  return (
    <article className="bean-card" aria-labelledby={titleId}>
      <h3 id={titleId}>
        <Link to={paths.bean(bean.id)}>{bean.name}</Link>
      </h3>
      <p>{bean.notes.join(', ')}</p>
      <p className="price">{bean.price} грн</p>
      <FavoriteButton productId={bean.id} name={bean.name} />
      {children}
    </article>
  )
}
