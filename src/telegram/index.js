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
  // { command: '/', description: '' },
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
        return await bot.sendMessage(chatId, `Вітання від телеграм бота Activityckua. Виберіть дію:`, startOptions);
        break;
    
      case '/categories':
        return await bot.sendMessage(chatId, `Виберіть категорію:`, categoriesOptions);
        break;
    
      case '/current_events':
        return await sendCurrentEvents(bot, chatId);
        break;
    
      case '/events':
        return await sendEvents(bot, chatId);
        break;
    
      default:
        break;
    }
  });

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    switch (true) {
      /* case '/start':
        return await bot.sendMessage(chatId, `Вітання від телеграм бота  Виберіть дію:`, startOptions);
        break;
     */
      case data.startsWith('/categories'):
        return await bot.sendMessage(chatId, `Виберіть категорію:`, categoriesOptions);
        break;
    
      case data.startsWith('/current_events'):
        return await sendCurrentEvents(bot, chatId);
        break;
    
      case data.startsWith('/events'):
        return await sendEvents(bot, chatId);
        break;
    
      case data.startsWith('/places/'):
        const categoryId = data.split('/places/')[1];
        return await sendPlaces(bot, chatId, { categoryId });
        break;
    
      default:
        break;
    }
  });
}

module.exports = {
  launch,
};
