import { startTransition, useActionState, useRef } from 'react'
import { useFormik } from 'formik'
import GuestsStepper from './GuestsStepper.jsx'
import { bookingSchema } from '../bookingSchema.js'
import { sendBooking } from '../api.js'

const initialValues = {
  name: '',
  phone: '',
  date: '',
  time: '',
  guests: 2,
  comment: '',
}

// Порядок полів для фокуса на першій помилці.
const fields = ['name', 'phone', 'date', 'time', 'guests', 'comment']

export default function BookingForm() {
  const nameRef = useRef(null)
  const [result, dispatch, isPending] = useActionState(bookTable, null)
  const formik = useFormik({
    initialValues,
    validationSchema: bookingSchema,
  })

  // Дія для useActionState: null — сигнал «Очистити»; інакше надсилаємо
  // бронювання, після успіху очищаємо форму й повертаємо відповідь.
  async function bookTable(previousResult, booking) {
    if (booking === null) return null
    const response = await sendBooking(booking)
    if (response.ok) startTransition(() => formik.resetForm())
    return response
  }

  // Formik сам не переводить фокус на перше неправильне поле, тож після
  // невдалої перевірки робимо це вручну.
  async function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = await formik.validateForm()
    formik.setTouched({
      name: true,
      phone: true,
      date: true,
      time: true,
      guests: true,
      comment: true,
    })
    const firstInvalid = fields.find((field) => validationErrors[field])
    if (firstInvalid) {
      document.querySelector(`[name="${firstInvalid}"]`)?.focus()
      return
    }
    if (isPending) return
    startTransition(() => dispatch(bookingSchema.cast(formik.values)))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.currentTarget.requestSubmit()
    }
  }

  function handleReset() {
    nameRef.current?.focus() // до resetForm(): поле лишається тим самим
    formik.resetForm()
    startTransition(() => dispatch(null))
  }

  const showError = (field) => formik.touched[field] && formik.errors[field]

  return (
    <form
      className="booking-form"
      noValidate
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
    >
      <div className="field">
        <label>
          Ім'я
          <input
            {...formik.getFieldProps('name')}
            ref={nameRef}
            autoComplete="name"
            required
            aria-invalid={showError('name') ? 'true' : 'false'}
            aria-describedby="name-error"
          />
        </label>
        <p id="name-error" className="field-error">
          {showError('name') ? formik.errors.name : ''}
        </p>
      </div>
      <div className="field">
        <label>
          Телефон
          <input
            {...formik.getFieldProps('phone')}
            type="tel"
            autoComplete="tel"
            placeholder="+380671234567"
            required
            aria-invalid={showError('phone') ? 'true' : 'false'}
            aria-describedby="phone-error"
          />
        </label>
        <p id="phone-error" className="field-error">
          {showError('phone') ? formik.errors.phone : ''}
        </p>
      </div>
      <div className="row">
        <div className="field">
          <label>
            Дата
            <input
              {...formik.getFieldProps('date')}
              type="date"
              required
              aria-invalid={showError('date') ? 'true' : 'false'}
              aria-describedby="date-error"
            />
          </label>
          <p id="date-error" className="field-error">
            {showError('date') ? formik.errors.date : ''}
          </p>
        </div>
        <div className="field">
          <label>
            Час
            <input
              {...formik.getFieldProps('time')}
              type="time"
              required
              aria-invalid={showError('time') ? 'true' : 'false'}
              aria-describedby="time-error"
            />
          </label>
          <p id="time-error" className="field-error">
            {showError('time') ? formik.errors.time : ''}
          </p>
        </div>
      </div>
      <GuestsStepper
        value={formik.values.guests}
        onChange={(value) => formik.setFieldValue('guests', value, true)}
      />
      <label>
        Коментар
        <textarea
          {...formik.getFieldProps('comment')}
          maxLength={200}
          aria-describedby="comment-counter"
        />
      </label>
      <p id="comment-counter" className="counter">
        {formik.values.comment.length} / 200
      </p>
      <div className="actions">
        <button type="submit" aria-disabled={isPending}>
          {isPending ? 'Надсилаємо …' : 'Забронювати'}
        </button>
        <button type="button" onClick={handleReset}>
          Очистити
        </button>
      </div>
      <p
        role="status"
        className={result?.ok === false ? 'status error' : 'status'}
      >
        {result?.message}
      </p>
    </form>
  )
}
