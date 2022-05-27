const {
  content: { TELEGRAM_NUMBER_PER_PAGE },
  server: {
    FRONTEND,
    prefix: { EVENTS, PLACES },
  },
} = require('../config');
const { getCurrentEvents, getEvents, getPlaceEvents, getPlaces } = require('../db');

async function sendCurrentEvents(bot, chatId, limit = TELEGRAM_NUMBER_PER_PAGE, page = 1, filters) {
  const { events } = await getCurrentEvents(limit, page, filters);

  if (events.length === 0)
    return await bot.sendMessage(chatId, `Немає подій, які зараз відбуваються.`);

  for (const event of events) {
    await bot.sendPhoto(chatId, event.main_photo);
    await bot.sendMessage(chatId, `<b>${event.name}</b>\n${new Date(event.start_time)}`, {
      parse_mode: 'HTML',
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: 'Детальніше про подію', url: `${FRONTEND}${EVENTS}/${event.id}` }],
        ],
      }),
    });
  }
}

async function sendEvents(bot, chatId, startTime = Date.now(), limit = TELEGRAM_NUMBER_PER_PAGE, page = 1, filters) {
  const { events } = await getEvents(startTime, limit, page, filters);

  if (events.length === 0)
    return await bot.sendMessage(chatId, `Немає подій, які відватимуться у вибраний період.`);

  for (const event of events) {
    await bot.sendPhoto(chatId, event.main_photo);
    await bot.sendMessage(chatId, `<b>${event.name}</b>\n${new Date(event.start_time)}`, {
      parse_mode: 'HTML',
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: 'Детальніше про подію', url: `${FRONTEND}${EVENTS}/${event.id}` }],
        ],
      }),
    });
  }
}

async function sendPlaces(bot, chatId, filters, limit = TELEGRAM_NUMBER_PER_PAGE, page = 1) {
  const { places } = await getPlaces(filters, limit, page);

  /* if (places.length === 0)
    return await bot.sendMessage(chatId, `Немає Місць.`); */

  for (const place of places) {
    await bot.sendPhoto(chatId, place.main_photo);
    await bot.sendMessage(
      chatId,
      `<b>${place.name}</b>
рейтинг: ${place.rating}
адреса: ${place.address}
телефони: ${place.phones}
вебсайт: ${place.website}`, // години роботи: ${place.work_time}
      {
        parse_mode: 'HTML',
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{ text: 'Детальніше', url: `${FRONTEND}${PLACES}/${filters.categoryId}/${place.id}` }],
          ],
        }),
      },
    );
  }
}

module.exports = { sendCurrentEvents, sendEvents, sendPlaces };
