const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const exploreSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  minutes: {
    type: Number,
    require: true,
  },
  hours: {
    type: Number,
    require: false,
  },
  imageId: [
    {
      type: ObjectId,
      ref: 'Image',
    },
  ],
});

module.exports = mongoose.model('Explore', exploreSchema);
