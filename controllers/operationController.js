const { Operations, User } = require("../models/user");

class OperationController {
    async transfer(req, res) {
        try {
            const { receiver, sender, amount } = req.body;

            const userSender = await User.findOne({ where: { iban: sender } });
            const userReceiver = await User.findOne({ where: { iban: receiver } });

            var success = false;

            if (!userSender || !userReceiver) return res.status(401).json({ error: 'Какого-то пользователя не существует' });
            if (userSender.balance < amount) return res.status(400).json({ error: 'Недостаточно средств для операции' });

            const userSenderBalance = userSender.balance;
            const userReceiverBalance = userReceiver.balance;

            await userSender.update({
                balance: parseFloat(userSenderBalance - amount),
            });
            await userReceiver.update({
                balance: parseFloat(userReceiverBalance + amount),
            });

            success = true;

            const tranferOperation = await Operations.create({
                name: 'tranfer',
                title: 'Перевод от ' + sender + ' к ' + receiver + ' в количестве ' + amount + ', успешно?:' + success,
                amount: amount,
                receiver: userReceiver.id,
                sender: userSender.id,
                success: success,
            });

            await tranferOperation.save();

            res.render('resultScreen', {
                operation: 'transfer',
                title: tranferOperation.title,
                balance: userSender.balance,
            });
        } catch (e) {
            return res.status(500).json({ error: 'какая-то ошибка при операции ' + e + ', попробуйте еще раз' });
        }
    }

    async pay(req, res) {
        try {
            const { payer, amount } = req.body;
            var success = false;
            const userPayer = await User.findOne({ where: { iban: payer } });

            if (!userPayer) return res.status(401).json({ error: 'Пользователя не существует' });
            if (userPayer.balance < amount) return res.status(400).json({ error: 'Недастаточно средств для оплаты' });

            const userPayerBalance = userPayer.balance;

            await userPayer.update({
                balance: parseFloat(userPayerBalance - amount),
            });

            success = true;

            const payOperation = await Operations.create({
                name: 'pay',
                title: 'Оплата от ' + payer + ' в количестве ' + amount + ', успешно?:' + success,
                amount: amount,
                sender: userPayer.id,
                success: success,
            });

            await payOperation.save();

            res.render('resultScreen', {
                operation: 'pay',
                title: payOperation.title,
                balance: userPayer.balance,
            });
        } catch (e) {
            return res.status(500).json({ error: 'какая-то ошибка при оплате ' + e + ', попробуйте еще раз' })
        };
    }

    async deposit(req, res) {
        try {
            const { receiver, amount } = req.body;
            var success = false;
            const userReceiver = await User.findOne({ where: { iban: receiver } });

            if (!userReceiver) return res.status(401).json({ error: 'Пользователя не существует' });

            const userReceiverBalance = userReceiver.balance;

            await userReceiver.update({
                balance: parseFloat(userReceiverBalance + amount),
            });

            success = true;

            const depositOperation = await Operations.create({
                name: 'deposit',
                title: 'Пополнение для ' + receiver + ' в количестве ' + amount + ', успешно?:' + success,
                amount: amount,
                receiver: userReceiver.id,
                success: success,
            });

            await depositOperation.save();

            res.render('resultScreen', {
                operation: 'deposit',
                title: depositOperation.title,
                balance: userReceiver.balance,
            });
        } catch (e) {
            return res.status(500).json({ error: 'какая-то ошибка при выполнении операции' + e + ', попробуйте еще раз' })
        };
    }
}

module.exports = { OperationController: new OperationController() };