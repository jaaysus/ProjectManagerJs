const app = require('./index'); // Import the app
const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
