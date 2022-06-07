const TelegramApi = require('node-telegram-bot-api');

const {
  telegramBot: { TOKEN },
} = require('../config');
const { sendCurrentEvents, sendEvents, sendPlaces } = require('./services');

const bot = new TelegramApi(TOKEN, { polling: true });

const commands = [
  { command: '/start', description: 'Почати' },
  { command: '/categories', description: 'Вибрати категорію' },
  { command: '/current_events', description: 'Події які зараз йдуть' },
  { command: '/events', description: 'Події які будуть найближчим часом' },
];

const startOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 'Вибрати категорію', callback_data: '/categories' }],
      [{ text: 'Події які зараз йдуть', callback_data: '/current_events' }],
      [{ text: 'Події які будуть найближчим часом', callback_data: '/events' }],
    ],
  }),
};

const categoriesOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 'затишна ночівля', callback_data: '/places/sleeping' }],
      [{ text: 'гастрономічні пригоди', callback_data: '/places/gastronomy' }],
      [{ text: 'місце відпочинку', callback_data: '/places/recreation' }],
      [{ text: 'культурне натхнення', callback_data: '/places/culture' }],
      [{ text: 'унікальність міста', callback_data: '/places/unique' }],
      [{ text: 'навігація містом', callback_data: '/places/navigation' }],
    ],
  }),
};

const launch = async () => {
  await bot.setMyCommands(commands);

  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    switch (text) {
      case '/start':
        return await bot.sendMessage(chatId, 'Вітання від телеграм бота Activityckua. Виберіть дію:', startOptions);
    
      case '/categories':
        return await bot.sendMessage(chatId, 'Виберіть категорію:', categoriesOptions);
    
      case '/current_events':
        return await sendCurrentEvents(bot, chatId);
    
      case '/events':
        return await sendEvents(bot, chatId);
    }
  });

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    let page;
    switch (true) {
      case data.startsWith('/categories'):
        return await bot.sendMessage(chatId, 'Виберіть категорію:', categoriesOptions);
    
      case data.startsWith('/current_events'):
        page = data.split('?page=')[1];
        return await sendCurrentEvents(bot, chatId, page);
    
      case data.startsWith('/events'):
        page = data.split('?page=')[1];
        return await sendEvents(bot, chatId, undefined, page);
    
      case data.startsWith('/places/'):
        const filters = data.split('/places/')[1];
        const categoryId = filters.split('?page=')[0];
        page = filters.split('?page=')[1];
        return await sendPlaces(bot, chatId, { categoryId }, page);
    }
  });
}

module.exports = {
  launch,
};
