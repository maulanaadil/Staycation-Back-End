const Item = require('../models/Item');
const Treasure = require('../models/Activity');
const Travelers = require('../models/Booking');
const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Booking = require('../models/Booking');
const Member = require('../models/Member');
const Explore = require('../models/Explore');

module.exports = {
  landingPage: async (req, res) => {
    try {
      const mostPicked = await Item.find()
        .select('_id title country city price unit imageId')
        .limit(5)
        .populate({ path: 'imageId', select: '_id imageUrl' });

      const category = await Category.find()
        .select('_id name')
        .limit(3)
        .populate({
          path: 'itemId',
          select: '_id title country city isPopular imageId',
          perDocumentLimit: 4,
          option: { sort: { sumBooking: -1 } },
          populate: {
            path: 'imageId',
            select: '_id imageUrl',
            perDocumentLimit: 1,
          },
        });

      const travelers = await Travelers.find();
      const treasures = await Treasure.find();
      const cities = await Item.find();

      for (let i = 0; i < category.length; i++) {
        for (let y = 0; y < category[i].itemId.length; y++) {
          const item = await Item.findOne({ _id: category[i].itemId[y]._id });
          item.isPopular = false;
          await item.save();

          if (category[i].itemId[0] === category[i].itemId[y]) {
            item.isPopular = true;
            await item.save();
          }
        }
      }

      const testimonial = {
        _id: 'asd1293uasdads1',
        imageUrl: '/images/testimonial-landingpages.jpg',
        name: 'Happy Family',
        rate: 4.55,
        content:
          'What a great trip with my family and I should try again next time soon',
        familyName: 'Jordan Fill',
        familyOccupation: 'Product Designer',
      };

      res.status(200).json({
        hero: {
          travelers: travelers.length,
          treasures: treasures.length,
          cities: cities.length,
        },
        mostPicked,
        category,
        testimonial,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server ERROR' });
    }
  },

  detailPage: async (req, res) => {
    const { id } = req.params;
    try {
      const item = await Item.findOne({ _id: id })
        .populate({ path: 'featureId', select: '_id qty name imageUrl' })
        .populate({ path: 'activityId', select: '_id name type imageUrl' })
        .populate({ path: 'imageId', select: '_id imageUrl' });

      const bank = await Bank.find();

      const testimonial = {
        _id: 'asd1293uasdads1',
        imageUrl: '/images/testimonial-detailpages.jpg',
        name: 'Happy Family',
        rate: 4.25,
        content:
          'As wife i can pick a great trip with my own children, Thank you',
        familyName: 'Shintya Farah',
        familyOccupation: 'Product Manager',
      };
      res.status(200).json({
        ...item._doc,
        bank,
        testimonial,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server ERROR' });
    }
  },

  bookingPage: async (req, res) => {
    try {
      const {
        idItem,
        duration,
        bookingStartDate,
        bookingEndDate,
        firstName,
        lastName,
        email,
        phoneNumber,
        accountHolder,
        bankFrom,
      } = req.body;

      if (!req.file == null) {
        return res.status(404).json({ message: 'Image Not Found' });
      }

      if (
        idItem === undefined ||
        duration === undefined ||
        // price === undefined ||
        bookingStartDate === undefined ||
        bookingEndDate === undefined ||
        firstName === undefined ||
        lastName === undefined ||
        email === undefined ||
        phoneNumber === undefined ||
        accountHolder === undefined ||
        bankFrom === undefined
      ) {
        res.status(404).json({ message: 'Fill all the fields' });
      }

      const item = await Item.findOne({ _id: idItem });
      if (!item) {
        return res.status(404).json({ message: 'Item Not Found' });
      }

      item.sumBooking += 1;
      await item.save();

      let total = item.price * duration;
      let tax = total * 0.1;

      const invoice = Math.floor(1000000 + Math.random() * 9000000);

      const member = await Member.create({
        firstName,
        lastName,
        email,
        phoneNumber,
      });

      const newBooking = {
        invoice,
        bookingStartDate,
        bookingEndDate,
        total: (total += tax),
        itemId: {
          _id: item.id,
          title: item.title,
          price: item.price,
          duration: duration,
        },
        memberId: member.id,
        payments: {
          proofPayment: `images/${req.file.filename}`,
          bankFrom: bankFrom,
          accountHolder: accountHolder,
        },
      };
      //   console.log(newBooking);
      const booking = await Booking.create(newBooking);

      res.status(201).json({ message: 'Success Booking', booking });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server ERROR' });
    }
  },

  // For Mobile API

  homePage: async (req, res) => {
    try {
      const reccomendedForYou = await Item.find()
        .select('_id title country city imageId')
        .limit(4)
        .populate({ path: 'imageId', select: '_id imageUrl' });

      const mostPopular = await Item.find()
        .select('_id title country city imageId')
        .limit(4)
        .populate({ path: 'imageId', select: '_id imageUrl' });

      const ExploreNearby = await Explore.find()
        .limit(6)
        .populate({ path: 'imageId', select: '_id imageUrl' });

      res.status(200).json({
        reccomendedForYou,
        mostPopular,
        ExploreNearby,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server ERROR' });
    }
  },

  detailPageMobile: async (req, res) => {
    const { id } = req.params;
    try {
      const item = await Item.findOne({ _id: id })
        .populate({ path: 'featureId', select: '_id qty name imageUrl' })
        .populate({ path: 'activityId', select: '_id name type imageUrl ' })
        .populate({ path: 'imageId', select: '_id imageUrl' });

      const map = {
        location: 'Bandung',
      };

      const feedback = [
        {
          _id: 'kkl1293uasdads1',
          imageUrl: '#',
          rate: 4.0,
          userName: 'Shintya Delina',
          content:
            'As wife i can pick a great trip with my own children and the places is so really beautyfull ',
        },
        {
          _id: 'kkl1293uasdads2',
          imageUrl: '#',
          rate: 4.0,
          userName: 'Latifah',
          content:
            'As wife i can pick a great trip with my own children and the places is so really beautyfull ',
        },
        {
          _id: 'kkl1293uasdads3',
          imageUrl: '#',
          rate: 4.0,
          userName: 'Eveline',
          content:
            'As wife i can pick a great trip with my own children and the places is so really beautyfull ',
        },
      ];

      res.status(200).json({
        ...item._doc,
        map,
        feedback,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server ERROR' });
    }
  },
};
