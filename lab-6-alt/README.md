# ЛР-6, альтернативна версія: Formik + Yup

Копія лабораторної № 6, у якій React Hook Form і Zod замінено на **Formik** і
**Yup**. Поведінка сторінки така сама, як у `lab-6/` після §4.6: ті самі
правила й повідомлення, `aria-invalid` і `aria-describedby`, курсор у першому
неправильному полі, «Надсилаємо …», відповідь сервера, очищення після успіху й
кнопка «Очистити». Форма підписки з §4.7 не змінювалася.

## Запуск

```bash
npm install
npm run dev
```

Перевірки: `npm run lint`, `npm run format:check`, `npm run build`.

## Що змінилося порівняно з lab-6

- `src/bookingSchema.js` — та сама схема бронювання, описана Yup;
- `src/components/BookingForm.jsx` — значення полів зберігає `useFormik`,
  помилки показуються після `touched`, фокус на першій помилці й очищення
  форми зроблено вручну;
- `src/api.js` — імітований сервер перевіряє дані тією самою схемою Yup;
- `package.json` — прибрано `react-hook-form` і `@hookform/resolvers`, додано
  `formik` і `yup`.

## Порівняння з React Hook Form і Zod

### Бібліотеки та версії

| Версія         | lab-6 (React Hook Form + Zod)                              | lab-6-alt (Formik + Yup)              |
| -------------- | ---------------------------------------------------------- | ------------------------------------- |
| Форма          | react-hook-form 7.92.0                                     | formik 2.4.9                          |
| Схема          | zod 4.6.7, @hookform/resolvers 7.0.8                       | yup 1.7.1                             |
| Останній реліз | 11.11.2026 (RHF), 12.10.2026 (Zod), 20.11.2026 (resolvers) | 10.11.2025 (Formik), 21.09.2025 (Yup) |

### Відповідники API

| Що робить          | lab-6 (React Hook Form + Zod)                           | lab-6-alt (Formik + Yup)                                                                                 |
| ------------------ | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `register`         | `register('name')` — неконтрольоване поле               | `getFieldProps('name')` — контрольоване поле                                                             |
| `Controller`       | `Controller` для `GuestsStepper`                        | `value={formik.values.guests}` + `formik.setFieldValue('guests', …)`                                     |
| `useWatch`         | `useWatch({ control, name: 'comment' })` для лічильника | `formik.values.comment` (Formik і так перемальовує форму)                                                |
| `handleSubmit`     | `handleSubmit(onValid)` перевіряє й викликає `onValid`  | власний `handleSubmit`: `preventDefault`, `await formik.validateForm()`, `setTouched`, фокус, `dispatch` |
| `zodResolver`      | `zodResolver(bookingSchema)` у `useForm`                | `validationSchema: bookingSchema` у `useFormik`                                                          |
| `reset`            | `reset()` повертає `defaultValues`                      | `formik.resetForm()` повертає `initialValues`                                                            |
| `setFocus`         | `setFocus('name')`                                      | `nameRef.current.focus()` / `document.querySelector('[name=…]').focus()`                                 |
| `formState.errors` | `errors.name?.message`                                  | `formik.errors.name` + перевірка `formik.touched.name`                                                   |
| Схема              | Zod: `refine`, `z.coerce.number()`, `path: ['time']`    | Yup: `test`, `yup.number()`, `this.parent.date` у тесті часу                                             |

### Розмір збірки

`npm run build` в обох теках:

| Версія    | JS        | JS (gzip) | CSS     |
| --------- | --------- | --------- | ------- |
| lab-6     | 353.68 kB | 109.37 kB | 2.85 kB |
| lab-6-alt | 359.15 kB | 111.49 kB | 2.85 kB |

Різниця — близько 5.5 kB (2.1 kB у gzip): Formik і Yup разом трохи більші за
React Hook Form і Zod.

### Рендери під час введення в полі «Ім'я»

Перевірено в React DevTools з увімкненим _Highlight updates when components
render_:

- **lab-6:** поле «Ім'я» неконтрольоване (`register`), значення зберігає сам
  DOM-елемент. Під час введення `BookingForm` не перемальовується — підсвічених
  компонентів немає. Коментар перемальовує лише `BookingForm` через `useWatch`.
- **lab-6-alt:** Formik зберігає значення у стані компонента, тому кожне
  натискання клавіші перемальовує `BookingForm` разом з усіма полями,
  `GuestsStepper` і лічильником.

### Висновок

Для наступного проєкту я взяв би пару **React Hook Form + Zod**: обидві
бібліотеки активно випускають релізи (останні — у жовтні та листопаді 2026
року), неконтрольовані поля дають менше перемальовувань під час введення, а
Zod дає зручний вивід типів і `z.coerce` для даних із `FormData`. Formik і Yup
працюють і зрозуміліші для новачка, але останній реліз Formik вийшов у
листопаді 2025 року, тож для нового коду це радше варіант підтримки наявних
проєктів. Yup залишив би для проєктів, де він уже використовується, — його
схема читається майже як Zod, але поступається типами й екосистемою.
