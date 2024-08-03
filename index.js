const express = require('express');
const cors = require('cors');
const blogRoutes = require('./api/routes/blogRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/blogs', blogRoutes);

const PORT = process.env.PORT || 5801;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
