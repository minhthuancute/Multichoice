export const validation = () => ({
  email: {
    required: true,
    minLength: 2,
    maxLength: 30,
    pattern: 'neu co',
  },

  password: {
    required: true,
    minLength: 2,
    maxLength: 30,
    pattern: 'neu co',
  },
});
