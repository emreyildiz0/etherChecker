const Web3 = require('web3');
const axios = require("axios");
const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/662e7dda4ec44bdb835450446b67b443")) //TODO: Make the link config

const link = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2C&vs_currencies=usd"

exports.balance = async function (req, res) {

    const {addressList} = req.body

    try {
        const ethereumGet = await axios.get(link)
        const usdValue = (quantity) => ethereumGet.data?.ethereum?.usd * quantity //TODO: add validation

        const getValue = async (address) => {
            if (!Web3.utils.isAddress(address)) {
                return "Not Valid"
            }
            let balance = await web3.eth.getBalance(address)
            return web3.utils.fromWei(balance, "ether")
        }

        const promises = addressList.map((address) => getValue(address))

        const response = await Promise.all(promises)

        let responseData = []
        for (let i in addressList) {
                let obj = {}
                let address = addressList[i];
                obj[address] = {
                    "ether": response[i],
                    "usd" : usdValue(parseFloat(response[i]))
                }
                if (usdValue(parseFloat(response[i]))) responseData.push(obj)
        }

        return res.status(200).send(responseData)
    } catch (e) {
        return res.status(404).send({
            err: "Not found"
        })
    }
}
