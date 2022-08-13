// authen validation
export const validation = () => ({
  username: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: 'neu co',
  },
  email: {
    required: true,
    minLength: 2,
    maxLength: 30,
    pattern: 'neu co',
  },

  password: {
    required: true,
    minLength: 6,
    maxLength: 30,
    pattern: 'neu co',
  },
});
