const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js')
const QRCode = require('qrcode')
const generatePayload = require('promptpay-qr')
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})
const PHONE = '0968134278'
client.once('ready', () => {
    console.log('BOT ONLINE')
})

client.on('messageCreate', async message => {

    if (message.author.bot) return

    if (message.content === '!pay') {
	await message.delete()
        const embed = new EmbedBuilder()
            .setTitle('ระบบชำระเงินอัตโนมัติ')
            .setColor('#ff0000')
            .setImage('attachment://Fourdesign.jpg')

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId('promptpay')
                .setLabel('ชำระเงินแบบ : PromptPay')
                .setEmoji('💳')
                .setStyle(ButtonStyle.Secondary)

        )

        await message.channel.send({
            embeds: [embed],
            components: [row],
            files: ['./Fourdesign.jpg']
        })
    }

})

client.on('interactionCreate', async interaction => {

    if (!interaction.isButton()) return

    if (interaction.customId === 'promptpay') {

        const modal = new ModalBuilder()
    .setCustomId('payment_modal')
    .setTitle('PromptPay Payment')

const amountInput = new TextInputBuilder()
    .setCustomId('amount')
    .setLabel('จำนวนเงิน')
    .setPlaceholder('ใส่จำนวนเงินที่ต้องการชำระ')
    .setStyle(TextInputStyle.Short)

const firstActionRow =
    new ActionRowBuilder().addComponents(amountInput)

modal.addComponents(firstActionRow)

await interaction.showModal(modal)
    }

})
client.on('interactionCreate', async interaction => {

    if (!interaction.isModalSubmit()) return

    if (interaction.customId === 'payment_modal') {

        const amount =
            interaction.fields.getTextInputValue('amount')

        const payload = generatePayload(PHONE, {
    amount: parseFloat(amount)
})

const qrBuffer = await QRCode.toBuffer(payload, {
    width: 800
})

const qrEmbed = new EmbedBuilder()
    .setTitle(`💸 ชำระเงินจำนวน ${amount} บาท`)
    .setDescription('กรุณาสแกน QR Code ด้านล่าง')
    .setColor('#ff0000')
    .setImage('attachment://qrcode.png')

await interaction.reply({
    embeds: [qrEmbed],
    files: [{
        attachment: qrBuffer,
        name: 'qrcode.png'
    }]
})
    }

})

client.login('MTUwNDg1MzQzMDc0ODA1Nzc4MQ.GOAM2V.WlQIzZwpdrmyQjweRYsZOQfh-CDeyHlC_KHdbY')