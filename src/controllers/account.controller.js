const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/662e7dda4ec44bdb835450446b67b443")) //TODO: Make the link config

exports.validate = async function (req, res) {
    const {addressList} = req.body

    try {

        const getValue = async (address) => {
            if (!Web3.utils.isAddress(address)) {
                return "Not Valid"
            }
            let balance = await web3.eth.getBalance(address)
            return web3.utils.fromWei(balance, "ether")
        }

        const promises = addressList.map((address) => getValue(address))
        const response = await Promise.all(promises)

        return res.status(200).send(response)
    } catch (e) {
        return res.status(404).send({
            err: "Not found"
        })
    }
}

/**
 * One line version if prefer
 */
/*
exports.validate = async function (req, res) {
    const {addressList} = req.body

    try {
        return res.status(200).send(await Promise.all(addressList.map(async (a) => Web3.utils.isAddress(a) ? web3.utils.fromWei(await web3.eth.getBalance(a), "ether") : "Not Valid")))
    } catch (e) {
        return res.status(404).send({
            err: "Not found"
        })
    }
}*/
