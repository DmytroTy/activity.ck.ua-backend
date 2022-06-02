const {
  content: { TELEGRAM_NUMBER_PER_PAGE },
  server: {
    FRONTEND,
    prefix: { EVENTS, PLACES },
  },
} = require('../config');
const { getCurrentEvents, getEvents, getPlaceEvents, getPlaces } = require('../db');

async function sendCurrentEvents(bot, chatId, page = 1, limit = TELEGRAM_NUMBER_PER_PAGE, filters) {
  const { events, _totalPages: totalPages } = await getCurrentEvents(limit, page, filters);

  if (events.length === 0)
    return await bot.sendMessage(chatId, 'Немає подій, які зараз відбуваються.');

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

  if (page < totalPages) {
    await bot.sendMessage(chatId, 'Хочете переглянути більше місць?', {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: 'Завантажити більше', callback_data: `/current_events?page=${page + 1}` }],
        ],
      }),
    });
  }
}

async function sendEvents(bot, chatId, startTime = Date.now(), page = 1, limit = TELEGRAM_NUMBER_PER_PAGE, filters) {
  const { events, _totalPages: totalPages } = await getEvents(startTime, limit, page, filters);

  if (events.length === 0)
    return await bot.sendMessage(chatId, 'Немає подій, які відватимуться у вибраний період.');

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

  if (page < totalPages) {
    await bot.sendMessage(chatId, 'Хочете переглянути більше місць?', {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: 'Завантажити більше', callback_data: `${EVENTS}?page=${page + 1}` }],
        ],
      }),
    });
  }
}

async function sendPlaces(bot, chatId, filters, page = 1, limit = TELEGRAM_NUMBER_PER_PAGE) {
  const { places, _totalPages: totalPages } = await getPlaces(filters, limit, page);

  if (places.length === 0)
    return await bot.sendMessage(chatId, 'Наразі немає місць в даній категорії.');

  for (const place of places) {
    await bot.sendPhoto(chatId, place.main_photo);
    await bot.sendMessage(
      chatId,
      `<b>${place.name}</b>
рейтинг: ${place.rating}
адреса: ${place.address}
телефон: ${place.phones}
вебсайт: ${place.website}`, // години роботи: ${place.work_time}
      {
        parse_mode: 'HTML',
        // disable_web_page_preview: true,
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{ text: 'Детальніше', url: `${FRONTEND}${PLACES}/${filters.categoryId}/${place.id}` }],
          ],
        }),
      },
    );
  }

  if (page < totalPages) {
    await bot.sendMessage(chatId, 'Хочете переглянути більше місць?', {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: 'Завантажити більше', callback_data: `${PLACES}/${filters.categoryId}?page=${page + 1}` }],
        ],
      }),
    });
  }
}

module.exports = { sendCurrentEvents, sendEvents, sendPlaces };
