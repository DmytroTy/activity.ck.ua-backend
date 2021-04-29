// eslint-disable-next-line import/no-extraneous-dependencies
const faker = require('faker');

const { hash } = require('../../utils');

const DAYS = ['sat', 'mon', 'tue', 'wed', 'thu', 'fri', 'sun'];
const PASSWORDS = ['12345678'];
const CATEGORY_IDS = [
  'culture',
  'recreation',
  'children',
  'todo_something',
  'history',
  'unique_things',
  'sleeping',
  'inspired_city',
  'gastronomic_adventures',
];
const TYPE_IDS = [
  '',
  'hotels',
  'sport',
  'water',
  'coffee',
  'fastfood',
  'hostels',
  'stadium',
  'gym',
];
const MIN_PHOTO = 1;
const MAX_PHOTO = 10;
const PHOTOS_URL_CHERKASY = [
  'https://media-cdn.tripadvisor.com/media/photo-s/12/41/fb/27/50.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYXxwsdrp41tfptp0FpPQ4ujnKeXb9u_rY0w&usqp=CAU',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDPBOi17RrAdJLKBVP91KUOXIpe2o6lGAmAg&usqp=CAU',
  'https://cdn.britannica.com/94/151994-050-472C6FF4/Museum-lore-Cherkasy-Ukraine.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReLr5yJAwgrHWc0nuloNZryrqQEUHrbLDKQ9JQ2WSlObxrlE-qEgB4B41G8pvZi1qeBl0&usqp=CAU',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcEFXvX0r9uc2y5rsxAZiDIS2-515nHg8_eWb1UUbY1txpQBueokdUQu-P_NWH3PFThrA&usqp=CAU',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0ot6ov1exiBBdLxkTPDpVNYRvCS7wOn10bZ1TCSXJpFrngZdZRlh_gxblzwwfugyACTM&usqp=CAU',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG5MWa7V18I-EdS4OOU6MejYyZw4G0fIxONAa84klTN8p14vliXuYMy2Oe750WZsGGzKM&usqp=CAU',
  'https://ukraina-hotel.org/userfiles/Hill%20of%20glory(1).jpg',
  'https://ukraina-hotel.org/userfiles/Philarmoniya.jpg',
  'https://ukraina-hotel.org/userfiles/%D0%91%D1%83%D0%B4%D0%B4%D0%B8%D1%81%D0%BA%D0%B8%D0%B9%20%D1%85%D1%80%D0%B0%D0%BC(1).jpg',
];

const user = () => ({
  name: faker.name.findName(),
  avatar: faker.internet.avatar(),
  email: faker.internet.email(),
  passwordHash: hash.create(faker.random.arrayElement(PASSWORDS)),
});

const organization = () => ({
  name: faker.name.findName(),
  phones: faker.random.arrayElements().map(() => faker.phone.phoneNumber('+380#########')),
  email: faker.internet.email(),
});

function getWorkTime() {
  const workTime = {};

  for (let day = 0; day <= faker.random.number({ min: 1, max: 6 }); day += 1) {
    const startMinutes = faker.random.number({ min: 0, max: 59 });
    const endMinutes = faker.random.number({ min: 0, max: 59 });

    workTime[DAYS[day]] = {
      start: `${faker.random.number({ min: 0, max: 23 })}:${
        startMinutes < 10 ? '0' : ''
      }${startMinutes}`,
      end: `${faker.random.number({ min: 0, max: 23 })}:${endMinutes < 10 ? '0' : ''}${endMinutes}`,
    };
  }

  return workTime;
}

const photos = () => {
  return Array.from(new Array(faker.random.number({ min: MIN_PHOTO, max: MAX_PHOTO }))).map(() => {
    const photo = { url: faker.random.arrayElement(PHOTOS_URL_CHERKASY) };

    if (faker.random.boolean()) {
      photo.author_name = faker.random.arrayElement([null, faker.name.findName()]);
      photo.author_link = faker.internet.url();
    }

    return photo;
  });
};

const place = () => ({
  name: faker.company.companyName(),
  category_id: faker.random.arrayElement(CATEGORY_IDS),
  type_id: faker.random.arrayElement(TYPE_IDS),
  address: faker.address.streetAddress(true),
  phones: faker.random.arrayElements().map(() => faker.phone.phoneNumber('+380#########')),
  website: faker.internet.url(),
  work_time: getWorkTime(),
  accessibility: faker.random.boolean(),
  dog_friendly: faker.random.boolean(),
  child_friendly: faker.random.boolean(),
  description: faker.lorem.text(),
  main_photo: faker.random.arrayElement(PHOTOS_URL_CHERKASY),
});

function getStartEndTimes() {
  const dateNow = Date.now();
  const monthInMilliseconds = 30 * 24 * 60 * 60 * 1000; // 30 days
  const interval = {
    min: 30 * 60 * 1000, // 30 minutes
    max: 8 * 60 * 60 * 1000, // 8 hours
  };

  const start = dateNow + interval.min + faker.random.number(monthInMilliseconds);
  const end = start + interval.min + faker.random.number(interval.max - interval.min);

  return { start_time: new Date(start), end_time: new Date(end) };
}

const event = () => ({
  name: faker.company.companyName(),
  organizer: faker.company.companyName(),
  ...getStartEndTimes(),
  price: parseFloat(faker.finance.amount(0.0)),
  website: faker.internet.url(),
  phones: faker.random.arrayElements().map(() => faker.phone.phoneNumber('+380#########')),
  address: faker.address.streetAddress(true),
  accessibility: faker.random.boolean(),
  dog_friendly: faker.random.boolean(),
  child_friendly: faker.random.boolean(),
  program: faker.lorem.text(),
  description: faker.lorem.text(),
  main_photo: faker.random.arrayElement(PHOTOS_URL_CHERKASY),
});

module.exports = { user, organization, photos, place, event };
